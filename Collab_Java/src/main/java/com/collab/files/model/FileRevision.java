package com.collab.files.model;

public class FileRevision 
{
	private String fileName;	
	private String revisionFileName;
	private String revision;
	private String updatedOn;
	private String commitMessage;
	
	public String getRevision() {
		return revision;
	}
	public void setRevision(String revision) {
		this.revision = revision;
	}
	public String getUpdatedOn() {
		return updatedOn;
	}
	public void setUpdatedOn(String updatedOn) {
		this.updatedOn = updatedOn;
	}
	public String getCommitMessage() {
		return commitMessage;
	}
	public void setCommitMessage(String commitMessage) {
		this.commitMessage = commitMessage;
	}
	public String getFileName() {
		return fileName;
	}
	public void setFileName(String fileName) {
		this.fileName = fileName;
	}
	public String getRevisionFileName() {
		return revisionFileName;
	}
	public void setRevisionFileName(String revisionFileName) {
		this.revisionFileName = revisionFileName;
	}
}
