import React, { Component } from 'react';
import './../css/FilesCollab.css';
import axios from 'axios';
import $ from 'jquery';
var queryString = require('querystring');
var httpURL = '';
var lstFiles = [];
var lstFilesRevision = [];

class FilesCollab extends Component {
  constructor(props) {
    super(props);
		this.state = {
			file : '',
			revisionfile : ''
        }
  }
  
  componentDidMount = () => {
          $('#upload').prop("disabled", true);
		  $('#uploadRevision').prop("disabled", true);
		  $('#revisionFile').prop("disabled", true);
		  $('#revertCmb').prop("disabled", true);
		  $('#revertRevision').prop("disabled", true);
		  this.getFiles();
  }
  
  getFiles=()=>
  {
	  		  axios.post(httpURL + '/col/getfiles', {
            withCredentials: true
        }).then((response) => {
			console.log(response.data);
            if (response.data.Status === 'Success') {
    
                lstFiles = response.data.files;
                this.setFilesTable();
            } else {
                alert("Not able to get files");
            }
        }).catch((e) => {
            alert('Service failed: ' + e);
        });
  }
  
	handleSubmit=(event)=> 
	{
		event.preventDefault();
		var files = event.target.files; //FileList object
		var files = files[0];
		this.setState({
                    file: files,
                });
		$('#upload').prop("disabled", false);
		$('#filename').text(files.name);
	}
	
	handleRevisionSubmit=(event)=>
	{
		event.preventDefault();
		var files = event.target.files;
		var files = files[0];
		this.setState({
            revisionfile: files,
        });
		
		$('#uploadRevision').prop("disabled", false);
		$('#revisionfilename').text(files.name);
	}
	
	setFilesTable = () => {
        $('#filesTableBody tr').remove();
        var table = document.getElementById('filesTable');
        var tbody = document.getElementById('filesTableBody');

        for (var i = 0; i < lstFiles.length; i++) {
            var id = lstFiles[i].id;
            var fileName = lstFiles[i].fileName;
            var uploadedDate = lstFiles[i].uploadedDate;
            var noOfRevisions = lstFiles[i].noOfRevisions;

            var row = document.createElement('tr');
            row.onclick = (e) => {
                $(e.path[1]).addClass('selected').siblings().removeClass('selected');
				$(e.path[1]).addClass('selected').siblings().find('td:eq(4)').removeClass('selected');
				$('.revision-form')[0].reset();
				$('#revertRevision').prop("disabled", false);
				$('#revertCmb').prop("disabled", false);
				$('#revisionFile').prop("disabled", false);
				$('#revisionfilename').text('');
				this.setState({
					revisionfile: '',
				});
				var fileName = $('#filesTableBody tr.selected').find('td:eq(1)').text();
				$('#revision_text').text('Submit a New Revision for the Selected File');
				this.getFilesRevision(fileName);
            }

            this.addTD(row, id, 'no-display');
            this.addTD(row, fileName, 'text-center');
            this.addTD(row, uploadedDate, 'text-center');
            this.addTD(row, noOfRevisions, 'text-center');
            this.addTDView(row, 'text-center');

            tbody.append(row);
        }
        table.append(tbody);
    }
	
	getFilesRevision=(fileName)=>
	{
		axios.post(httpURL + '/col/getfilerevisions',queryString.stringify({'fileName':fileName}), {
					withCredentials: true
				}).then((response) => {
				if (response.data.Status === 'Success') {
					lstFilesRevision = response.data.fileRevision;
					lstFilesRevision.sort(function(a, b){return (b.revision).localeCompare(a.revision)});
					this.setFilesRevisionTable();
					this.fillRevertCmb();
				} else {
				alert("Not able to get file revisions");
				}
				}).catch((e) => {
				alert('Service failed: ' + e);
				});
	}
	
    addTD(row, val, classname) {
        var cell = document.createElement('td');
        cell.className = classname;
        var text = document.createTextNode(val);
        cell.append(text);
        row.append(cell);
    }
	
	addTDView(row, classname){
        var cell = document.createElement('td');
        cell.className = classname;
        var span = document.createElement('button');
        span.style.cursor = 'pointer';
		span.style.color='green';
        span.innerHTML  = 'View File';
        span.onclick = ()=>{
            $(row).addClass('selected').siblings().removeClass('selected');
			this.viewFile();
            $(row).addClass('selected').siblings().find('td:eq(4)').removeClass('selected');
        };
        cell.append(span);
        row.append(cell);
      }
	  
	  addTDView2(row, classname){
        var cell = document.createElement('td');
        cell.className = classname;
        var span = document.createElement('button');
        span.style.cursor = 'pointer';
		span.style.color='green';
        span.innerHTML  = 'View File';
        span.onclick=()=>{
            $(row).addClass('selected').siblings().removeClass('selected');
			this.viewRevisionFile();
            $(row).addClass('selected').siblings().find('td:eq(4)').removeClass('selected');
        };
        cell.append(span);
        row.append(cell);
      }
	  
	  setFilesRevisionTable = () => {
        $('#filesRevisionTableBody tr').remove();
        var table = document.getElementById('filesRevisionTable');
        var tbody = document.getElementById('filesRevisionTableBody');

        for (var i = 0; i < lstFilesRevision.length; i++) 
		{
            var fileName = lstFilesRevision[i].fileName;
            var revisionFileName = lstFilesRevision[i].revisionFileName;
            var revision = lstFilesRevision[i].revision;
            var commit = lstFilesRevision[i].commitMessage;
		    var updatedOn = lstFilesRevision[i].updatedOn;

            var row = document.createElement('tr');
           
            this.addTD(row, fileName, 'no-display');
            this.addTD(row, revisionFileName, 'no-display');
            this.addTD(row, revision, 'text-center');
            this.addTD(row, commit, 'text-center');
            this.addTD(row, updatedOn, 'text-center');
            this.addTDView2(row, 'text-center');

            tbody.append(row);
        }
        table.append(tbody);
    }
	
	viewRevisionFile=()=>{
			 var revisionFileName = $('#filesRevisionTableBody tr.selected').find('td:eq(1)').text();
			 var fileName = $('#filesRevisionTableBody tr.selected').find('td:eq(0)').text();
			 var revision = $('#filesRevisionTableBody tr.selected').find('td:eq(2)').text();
			 axios.get(httpURL + '/col/get?fileName='+revisionFileName, 
			 {
            withCredentials: true
        }).then((response) => {
				$('#showFile').text("Showing "+revision+" File for - "+fileName);
				$('#fileText').val(response.data);
				$('#fileText').css('display','block')
        }).catch((e) => {
            alert('Service failed: ' + e);
        });
		}
	  
	  viewFile=()=>{
			 var fileName = $('#filesTableBody tr.selected').find('td:eq(1)').text();
			 var noOfRevisions = $('#filesTableBody tr.selected').find('td:eq(3)').text();
			 if(noOfRevisions != 0)
				fileName = fileName.slice(0, fileName.lastIndexOf('.')) + "-"+noOfRevisions+fileName.slice(fileName.lastIndexOf('.'));
			 
			 axios.get(httpURL + '/col/get?fileName='+fileName, 
			 {
            withCredentials: true
        }).then((response) => {
				$('#showFile').text("Showing Latest Updated File - "+fileName);
				$('#fileText').val(response.data);
				$('#fileText').css('display','block')
        }).catch((e) => {
            alert('Service failed: ' + e);
        });
		}
  
	upload=()=>
	{
		var formData = new FormData();
        formData.append("revision", "Original");
        formData.append("file", this.state.file);
		
		 axios({
                url: httpURL+'/col/upload',
                method: "POST",
                data:formData,
                withCredentials: true,
            }).then((response) => {
			   
				if (response.data.Status === 'Success') 
				{
					alert("File Uploaded Succesfully");
					$('#upload').prop("disabled", true);
					$('#filename').text('');
             		this.getFiles();					
				}
				else
				{
					if(response.data.MSG === 'Invalid Format')
					{
						alert("Only .txt files are allowed");
						return;
					}						
					if(response.data.MSG === 'Size too big')
					{
						alert("File size should be maximum 5 MB");
						return;
					}
					alert("Not able to upload file");
				}
        }).catch((e) => {
			alert("Service failed " + e);
        });
	}
	
	fillRevertCmb=()=> {
        $('#revertCmb').empty();
        for (var i = 0; i < lstFilesRevision.length; i++) {
            var revisionFileName = lstFilesRevision[i].revisionFileName;
            var revision = lstFilesRevision[i].revision;
            $('#revertCmb').append($("<option> </option>").val(revisionFileName).html(revision));
        }
    }
	
	uploadRevision=()=>
	{
		var noOfRevisions = $('#filesTableBody tr.selected').find('td:eq(3)').text();
		var fileName = $('#filesTableBody tr.selected').find('td:eq(1)').text();
		var commit = $('#commit').val();
		var formData = new FormData();
		formData.append("commit", commit);
		formData.append("fileName", fileName);
		formData.append("noOfRevisions", noOfRevisions);
        formData.append("revision", "Revision "+(parseInt(noOfRevisions)+parseInt(1)));
        formData.append("file", this.state.revisionfile);
		
		 axios({
                url: httpURL+'/col/upload',
                method: "POST",
                data:formData,
                withCredentials: true,
            }).then((response) => {
				if (response.data.Status === 'Success') 
				{
					alert("New Revision Uploaded for this File");
					$('#uploadRevision').prop("disabled", true);
					this.getFiles();					
				}
				else
				{
					if(response.data.MSG === 'Invalid Format')
					{
						alert("Only .txt files are allowed");
						return;
					}						
					if(response.data.MSG === 'Size too big')
					{
						alert("File size should be maximum 5 MB");
						return;
					}
					alert("Not able to upload file");
				}
        }).catch((e) => {
			alert("Service failed " + e);
        });
	}
  
    dragOver = (e) => {
		e.preventDefault();
	}

	dragEnter = (e) => {
		e.preventDefault();
	}

	dragLeave = (e) => {
		e.preventDefault();
	}

	fileDrop=(e)=>{
		e.preventDefault();
		var files = e.dataTransfer.files;
		var files = files[0];
		this.setState({
			file: files,
		});
		$('#upload').prop("disabled", false);
		$('#filename').text(files.name);
	}
	
	revert=()=>
	{
		var fileName = $('#filesTableBody tr.selected').find('td:eq(1)').text();
        var revision = $('#revertCmb').find('option:selected').text();
		axios.post(httpURL + '/col/revert/revision'
		,queryString.stringify({'fileName':fileName,'revision':revision}), {
					withCredentials: true
				}).then((response) => {
				if (response.data.Status === 'Success') {
					alert("File Reverted to "+revision);
				    $('#revertCmb').prop("disabled", true);
					$('#revertRevision').prop("disabled", true);
					var fileName = $('#filesTableBody tr.selected').find('td:eq(1)').text();
					this.getFilesRevision(fileName);
					this.getFiles();
						$('#showFile').text("");
						$('#fileText').val("");
						$('#fileText').css('display','none');
				} else {
				alert("Not able to get file revisions");
				}
				}).catch((e) => {
				alert('Service failed: ' + e);
				});
	}

  
  render(){
	httpURL = window.httpURL;
	return(
		<div className = "mainContainer">
			<div className="drop-container"
						onDragOver={this.dragOver}
						onDragEnter={this.dragEnter}
						onDragLeave={this.dragLeave}
						onDrop={this.fileDrop}
						>
				<div className="drop-message">
					<div id="fileUpload">
						<input type="file" className="upload-icon" id = "imageUpload" onChange={this.handleSubmit}/>
						<label for="imageUpload" className="btn btn-large">Select file</label>
						<p id = "filename" style={{'marginLeft':5}}></p>
					</div>
					Drag & Drop files here or click to upload
			<button className="btn btn-primary" id="upload" onClick={this.upload}>Upload</button>
				</div>			
			</div>
			<div className = "col-sm-12 filesTableWrap">
				<div className = "col-md-7 col-xs-10 padding-remove">
					<table className="tableLayout1" style={{ width: '97.7%' }}>
						<thead>
							<tr>
								<th className= "no-display" style={{ width: 40, textAlign: 'center' }}>File Id</th>
								<th style={{ width: 80, textAlign: 'center' }}>File Name</th>
								<th style={{ width: 60, textAlign: 'center' }}>Originally Uploaded On</th>
								<th style={{ width: 40, textAlign: 'center' }}>Saved Revisions</th>
								<th style={{ width: 30, textAlign: 'center' }}>View File</th>
							   
							</tr>
						</thead>
                    </table>
					<div className="filesTableDiv" style={{ height: '349px', overflowY: 'scroll', border: '1px solid #ccc' }} >
						<table id="filesTable" className="tableLayout">
							<colgroup>
								<col width="80" />
								<col width="60" />
								<col width="40" />
								<col width="30" />
							</colgroup>
							<tbody id="filesTableBody"></tbody>
						</table>
                    </div>
				</div>
				<div className = "col-md-5 col-xs-10 padding-remove">
				  <p style={{'fontWeight':'bold','fontSize':'18px'}} id="revision_text">Select a File Name to Upload New Revision</p>
					<form className="revision-form">
					<div class="form-group" id="selectrevision">
						<input type="file" className="upload-revision" id = "revisionFile" onChange={this.handleRevisionSubmit} required/>
						<label for="revisionFile" className="btn btn-large btn-revision">Select File</label>
						<p id = "revisionfilename"></p>
				  </div>
				  <div class="form-group" id = "revision_submit">
					<input type="text" autoComplete = "off" class="form-control" id="commit" placeholder="Enter a commit message" required/>
					<button onClick = {this.uploadRevision} class="btn btn-primary" id="uploadRevision">Upload Revision</button>
				  </div>
				  
			</form>
			<div className="revert_revisions">		
				<p style={{textAlign:'center', color:'green',fontSize:'18px', marginTop:'10px', fontWeight:'bold'}}>File Revisions</p>
				<select className="form-control" style={{ marginLeft:'15px', width: '32%' }} id="revertCmb"></select>
				<button onClick={this.revert} class="btn btn-danger" style={{ marginRight:'10px'}} id="revertRevision">Revert To</button>
			</div>
			<table className="tableLayout1" style={{marginLeft:'15px',marginTop:'10px', width: '94.3%' }}>
						<thead>
							<tr>
								<th className= "no-display" style={{ width: 40, textAlign: 'center' }}>File Name</th>
								<th className= "no-display" style={{ width: 40, textAlign: 'center' }}>Revision File Name</th>
								<th style={{ width: 60, textAlign: 'center' }}>Revision</th>
								<th style={{ width: 80, textAlign: 'center' }}>Commit Message</th>
								<th style={{ width: 60, textAlign: 'center' }}>Updated On</th>
								<th style={{ width: 40, textAlign: 'center' }}>View File</th>
							   
							</tr>
						</thead>
                    </table>
					<div className="filesRevisionTableDiv" style={{ marginLeft:'15px',borderRadius:'5px', height: '145px', overflowY: 'scroll', border: '1px solid #ccc' }} >
						<table id="filesRevisionTable" className="tableLayout">
							<colgroup>
								<col width="60" />
								<col width="80" />
								<col width="60" />
								<col width="40" />
							</colgroup>
							<tbody id="filesRevisionTableBody"></tbody>
						</table>
                    </div>
				</div>
			</div>
			 <p id="showFile"></p>
			 <textarea
				id="fileText"
				readOnly
			/>
		</div>
	);
  }
}

export default FilesCollab;