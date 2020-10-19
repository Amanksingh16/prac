package com.collab.files.svcimpl;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.collab.files.adapter.FilesCollabAdapter;
import com.collab.files.svcint.FileCollabSvcInt;

@RestController
@RequestMapping("/col")
public class FileCollabSvcImpl implements FileCollabSvcInt
{
	@Autowired
	FilesCollabAdapter adapter;
	
	@Override
	@RequestMapping(value="/upload", method = RequestMethod.POST, headers="Accept=application/json")
	public Map<String, Object> UploadFiles(@RequestParam(value = "file",required=false) MultipartFile file,@RequestParam Map<String, String> params, HttpSession session,HttpServletRequest request, HttpServletResponse response) throws IOException 
	{		
			String revision = params.get("revision");
			String fileName = params.get("fileName");
			String strNoOfRevisions = params.get("noOfRevisions");
			String commit = params.get("commit");
		    
			return adapter.UploadFiles(revision, fileName, commit, strNoOfRevisions, file);
	}
	
	@Override
	@RequestMapping(value="/revert/revision", method = RequestMethod.POST, headers="Accept=application/json")
	public Map<String, Object> RevertRevision(@RequestParam Map<String, String> params, HttpSession session,HttpServletRequest request, HttpServletResponse response) throws IOException 
	{
			String revision = params.get("revision");
			String fileName = params.get("fileName");
			
			return adapter.RevertRevision(revision, fileName);
	}
	
	@Override
	@RequestMapping(value="/get", method = RequestMethod.GET, headers="Accept=application/json")
	public Map<String, Object> GetFiles(@RequestParam Map<String, String> params, HttpSession session,HttpServletRequest request, HttpServletResponse response) throws IOException 
	{
		Map<String, Object> map = new HashMap<>();
		String fileName = params.get("fileName");
		map = adapter.GetFiles(fileName);

		if(map.get("Status").equals("Success"))
		{
			InputStream stream = (InputStream) map.get("stream");
			IOUtils.copy(stream, response.getOutputStream());
			return null;	
		}
	    return map;
	}
	
	@Override
	@RequestMapping(value="/getfiles", method = RequestMethod.POST, headers="Accept=application/json")
	public Map<String, Object> GetAllFiles(@RequestParam Map<String, String> params, HttpSession session,HttpServletRequest request, HttpServletResponse response) throws IOException 
	{
	     return adapter.GetAllFiles();
	}
	
	@Override
	@RequestMapping(value="/getfilerevisions", method = RequestMethod.POST, headers="Accept=application/json")
	public Map<String, Object> GetFileRevisions(@RequestParam Map<String, String> params, HttpSession session,HttpServletRequest request, HttpServletResponse response) throws IOException 
	{
		 String fileName = params.get("fileName");
	     return adapter.GetFileRevisions(fileName);
	}
	
	

}
