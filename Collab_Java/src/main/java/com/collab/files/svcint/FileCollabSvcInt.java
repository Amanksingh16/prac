package com.collab.files.svcint;

import java.io.IOException;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.web.multipart.MultipartFile;

public interface FileCollabSvcInt {

	Map<String, Object> UploadFiles(MultipartFile file, Map<String, String> params, HttpSession session,
			HttpServletRequest request, HttpServletResponse response) throws IOException;

	Map<String, Object> GetFiles(Map<String, String> params, HttpSession session, HttpServletRequest request,
			HttpServletResponse response) throws IOException;

	Map<String, Object> GetAllFiles(Map<String, String> params, HttpSession session, HttpServletRequest request,
			HttpServletResponse response) throws IOException;

	Map<String, Object> GetFileRevisions(Map<String, String> params, HttpSession session, HttpServletRequest request,
			HttpServletResponse response) throws IOException;

	Map<String, Object> RevertRevision(Map<String, String> params, HttpSession session, HttpServletRequest request,
			HttpServletResponse response) throws IOException;

}
