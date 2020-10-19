package com.collab.files.adapter;

import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsOperations;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.collab.config.DatabaseConfig;
import com.collab.files.model.FileRevision;
import com.collab.files.model.Files;
import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;
import com.mongodb.client.gridfs.GridFSFindIterable;
import com.mongodb.client.gridfs.model.GridFSFile;

@Component
public class FilesCollabAdapter 
{
	@SuppressWarnings("resource")
	public Map<String, Object> UploadFiles(String revision, String fName, String commit,String strNoOfRevisions, MultipartFile file) 
	{
		  Map<String, Object> map = new HashMap<>();
		  ApplicationContext ctx = new AnnotationConfigApplicationContext(DatabaseConfig.class);

			GridFsOperations gridOperations =
			          (GridFsOperations) ctx.getBean("gridFsTemplate");
			
			Long size = file.getSize();
			if((size/1000/1000) > 5)
			{
				map.put("MSG","Size too big");
				map.put("Status","Failure");
				return map;
			}
			
			String extension = file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf('.')+1);
			
			if(!extension.equals("txt"))
			{
				map.put("MSG","Invalid Format");
				map.put("Status","Failure");
				return map;
			}
			
			DBObject metaData = new BasicDBObject();
			metaData.put("revision", revision);
			String fileName = "";
			if(!revision.equals("Original"))
			{
				fileName = fName;
				int noOfRevisions = Integer.parseInt(strNoOfRevisions);
				fileName = fileName.substring(0, fileName.lastIndexOf('.')) + "-" + (noOfRevisions + 1) + fileName.substring(fileName.lastIndexOf('.'));
			metaData.put("originalFileName",fName);		
			}
			else
				fileName = file.getOriginalFilename();
			
			if(commit != null)
				metaData.put("commit",commit);
			 
			try {
				gridOperations.store(file.getInputStream(), fileName, "text/plain", metaData);
			} catch (IOException e) {
				e.printStackTrace();
				map.put("Status","Failure");
				return map;
			}
			
			map.put("Status","Success");
			return map;		
	}
	
	@SuppressWarnings("resource")
	public Map<String, Object> RevertRevision(String revision, String fileName) 
	{
		Map<String, Object> map = new HashMap<>();
		  ApplicationContext ctx =
                new AnnotationConfigApplicationContext(DatabaseConfig.class);

			GridFsOperations gridOperations =
			          (GridFsOperations) ctx.getBean("gridFsTemplate");
			
			Query query = null;
			
			if(revision.equals("Original"))
				query = new Query(Criteria.where("metadata.revision").ne(revision).and("metadata.originalFileName").is(fileName));
			else
				query = new Query(Criteria.where("metadata.revision").gt(revision).and("metadata.originalFileName").is(fileName));
			
			gridOperations.delete(query);
			
		     map.put("Status","Success");

			return map;
	}
	
	@SuppressWarnings("resource")
	public Map<String, Object> GetFiles(String fileName) 
	{
		Map<String, Object> map = new HashMap<>();
		  ApplicationContext ctx =
                new AnnotationConfigApplicationContext(DatabaseConfig.class);

			GridFsTemplate gridOperations =
			          (GridFsTemplate) ctx.getBean("gridFsTemplate");
			
		    try {
		    	InputStream stream = loadResource(fileName, gridOperations);
			    map.put("Status","Success");
				map.put("stream",stream);
				return map;			
			} 
		    catch (IOException e) {
			     map.put("Status","Failure");
			     return map;
			}
	}
	
	@SuppressWarnings("resource")
	public Map<String, Object> GetAllFiles() 
	{
			Map<String, Object> map = new HashMap<>();
		    ApplicationContext ctx = new AnnotationConfigApplicationContext(DatabaseConfig.class);

			GridFsOperations gridOperations =
			          (GridFsOperations) ctx.getBean("gridFsTemplate");
			
	    	GridFSFindIterable textFile = gridOperations.find(new Query(Criteria.where("metadata.revision").is("Original")));
	    	
	    	Iterator<GridFSFile> it = textFile.iterator();
	    	
	    	List<Files> mainList = new ArrayList<>();
	    	while(it.hasNext())
	    	{
	    		GridFSFile fs = it.next();
	    		Files fl = new Files();
	    		fl.setId(fs.getObjectId().toString());
	    		fl.setFileName(fs.getFilename());
	    		fl.setUploadedDate(new SimpleDateFormat("dd MMM yyyy HH:mm").format(fs.getUploadDate()));
	    		GridFSFindIterable revisions = gridOperations.find(new Query(Criteria.where("metadata.originalFileName").is(fs.getFilename()).and("metadata.revision").ne("Original")));
	    		int count = 0;
	    		Iterator<GridFSFile> it2 = revisions.iterator();
	    		while(it2.hasNext())
	    		{
	    			it2.next();
	    			count = count + 1;
	    		}
	    		fl.setNoOfRevisions(count);
	    		mainList.add(fl);
	    	}		

	     map.put("Status","Success");
		 map.put("files",mainList);
	     return map;
	}
	
	@SuppressWarnings("resource")
	public Map<String, Object> GetFileRevisions(String fileName) 
	{
			Map<String, Object> map = new HashMap<>();
		    ApplicationContext ctx = new AnnotationConfigApplicationContext(DatabaseConfig.class);

			GridFsOperations gridOperations =
			          (GridFsOperations) ctx.getBean("gridFsTemplate");
		
	    	GridFSFindIterable textFile = gridOperations.find(new Query(Criteria.where("metadata.originalFileName").is(fileName)));
	    	
	    	Iterator<GridFSFile> it = textFile.iterator();
	    	
	    	List<FileRevision> mainList = new ArrayList<>();
	    	while(it.hasNext())
	    	{
	    		GridFSFile fs = it.next();
	    		FileRevision fl = new FileRevision();
	    		fl.setFileName(fs.getMetadata().getString("originalFileName"));
	    		fl.setRevisionFileName(fs.getFilename());	
	    		fl.setUpdatedOn(new SimpleDateFormat("dd MMM yyyy HH:mm").format(fs.getUploadDate()));
	    		fl.setRevision(fs.getMetadata().getString("revision"));
	    		fl.setCommitMessage((fs.getMetadata().getString("commit")==null)?"-":fs.getMetadata().getString("commit"));
	    		mainList.add(fl);
	    	}		
	    	
	    	GridFSFile fs = gridOperations.findOne(new Query(Criteria.where("filename").is(fileName)));
	    	FileRevision fl = new FileRevision();
    		fl.setFileName(fs.getFilename());
    		fl.setRevisionFileName(fs.getFilename());	
    		fl.setUpdatedOn(new SimpleDateFormat("dd MMM yyyy HH:mm").format(fs.getUploadDate()));
    		fl.setRevision(fs.getMetadata().getString("revision"));
    		fl.setCommitMessage((fs.getMetadata().getString("commit")==null)?"-":fs.getMetadata().getString("commit"));
    		mainList.add(fl);

	     map.put("Status","Success");
		 map.put("fileRevision",mainList);
	     return map;
	}
	
	private InputStream loadResource(String fileName, GridFsTemplate operations) throws IOException 
	{
		GridFSFile textFile = operations.findOne((new Query(Criteria.where("filename").is(fileName))));		
		GridFsResource resource = operations.getResource(textFile.getFilename());
	    return resource.getInputStream();
	}

}
