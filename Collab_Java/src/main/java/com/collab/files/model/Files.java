package com.collab.files.model;

public class Files 
{
	private String Id;
	private String fileName;
	private String uploadedDate;
	private int noOfRevisions;
	public String getId() {
		return Id;
	}
	public void setId(String id) {
		Id = id;
	}
	public String getFileName() {
		return fileName;
	}
	public void setFileName(String fileName) {
		this.fileName = fileName;
	}
	public String getUploadedDate() {
		return uploadedDate;
	}
	public void setUploadedDate(String uploadedDate) {
		this.uploadedDate = uploadedDate;
	}
	public int getNoOfRevisions() {
		return noOfRevisions;
	}
	public void setNoOfRevisions(int noOfRevisions) {
		this.noOfRevisions = noOfRevisions;
	}
}
