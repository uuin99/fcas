//File Uid
var fileMastGridFileUid = '';
var openerWinId = "board_regi_win";

//File Master Grid
var fileMastGrid = null;
var fileUploadPopup = null;
var fileUploadForm = null;
var oneFileUploadForm = null;
var oneFileUploadPopup = null;
var fileMastPanelFileUid = '';
var fileMastPanelFileSeq = '';
var fileMastPanelFileNm = '';

/** 단일 File Upload Function Start **/

	//단일 File Upload Window Open.
	function fnOpenOneFileUpload(fileUidId, fileSeqId, fileNmId){
		fileMastPanelFileUid = fileUidId;
		fileMastPanelFileSeq = fileSeqId;
		fileMastPanelFileNm = fileNmId;
		oneFileUploadPopup.show();
		Ext.getBody().mask();
	}
	
	//단일 File Upload Submit;
	function fnOneFileUploadSubmit(){
		fnSetElMask(oneFileUploadPopup);
		Ext.getCmp('oneFileUploadFileUid').setValue(Ext.getCmp(fileMastPanelFileUid).getValue());
		
		var frm = oneFileUploadForm.getForm();
		frm.submit({
			url: '/sys/com/Common/insertFile.do',
			params: {
				INIT_FILE_FLAG: 'Y'
			},
			success: function(form, action){
				Ext.getCmp(fileMastPanelFileUid).setValue(action.result.FILE_INFO[0].FILE_UID);
				Ext.getCmp(fileMastPanelFileSeq).setValue(action.result.FILE_INFO[0].FILE_SEQ);
				Ext.getCmp(fileMastPanelFileNm).setValue(action.result.FILE_INFO[0].FILE_NM);
				fnSetElUnmask(oneFileUploadPopup);
				Ext.MessageBox.show({
			        title: 'FCAS',
			        msg: action.result.message,
			        icon: Ext.MessageBox.INFO,
			        buttons: Ext.Msg.OK,
			        fn: function(buttonId, text, opt){
			        	if(buttonId == 'ok'){
			        		fnOneCloseFileUploadWin();
			        	}
			        }   
			    });
			},
			failure: function(form, action){
				fnSetElUnmask(oneFileUploadPopup);
				fnShowMessage(action.result.message);
			}
		});
	}        
	
	//단일 File Upload Popup Close
	function fnOneCloseFileUploadWin(){
		oneFileUploadForm.getForm().reset();
		oneFileUploadPopup.hide();
		Ext.getBody().unmask();
	}
	
	//단일 File Download
	function fnOpenOneFileDownload(fileUidId, fileSeqId, fileNmId){
		//File 존재여부 확인.
		var fileName = Ext.getCmp(fileNmId).getValue();
		if (fileName == '' || fileName == undefined) {
			fnShowMessage(parent.msgProperty.COM_ERR_0017);//다운로드할 파일이 존재하지 않습니다.
			return;
		} 
		//File Download Logic
	  
	  var fileDownForm = document.createElement("form");
	  fileDownForm.name = "fileDownForm";
	  fileDownForm.method = "POST";
	  fileDownForm.action = '/sys/com/Common/getFileDownload.do';
	  fileDownForm.target = '_self';
	  
	  fileDownForm=addHidden(fileDownForm, 'FILE_UID', Ext.getCmp(fileUidId).getValue());
	  fileDownForm=addHidden(fileDownForm, 'FILE_SEQ', Ext.getCmp(fileSeqId).getValue());
	  document.body.insertBefore(fileDownForm, null); 
	  fileDownForm.submit();
	  document.body.removeChild(fileDownForm);
	}
	
	//단일 File Upload 삭제.
	function fnOpenOneFileDelete(fileUidId, fileSeqId, fileNmId){
		Ext.MessageBox.confirm('FCAS', parent.msgProperty.COM_IFO_0011, //파일을 삭제하시겠습니까?
			function(btnid){
    			if (btnid == 'yes') {
					//File 존재여부 확인.
					var fileName = Ext.getCmp(fileNmId).getValue();
					if (fileName == '' || fileName == undefined) {
						fnShowMessage(parent.msgProperty.COM_ERR_0018);//삭제할 파일이 존재하지 않습니다.
						return;
					}
					//One File Delete Logic
					var params = {FILE_UID:Ext.getCmp(fileUidId).getValue(),FILE_SEQ:Ext.getCmp(fileSeqId).getValue()};
					fnSubmitFormStore('/sys/com/Common/deleteFile.do',params,function(response, opts){
						var result = Ext.decode(response.responseText);
						if (result.success) {
							Ext.getCmp(fileSeqId).setValue('');
							Ext.getCmp(fileNmId).setValue('');            	
							fnShowMessage(result.message);
						} else {
							var msg = '';
							try {
								msg = result.message;
							} catch(err) {
								msg = parent.msgProperty.COM_ERR_0020;//작업에 실패하였습니다.[1]
							}
							fnShowMessage(msg);
						}    		
					});
    			}
			}
		);						
	}

/** 단일 File Upload Function End **/

/** 다중 File Upload Function Start **/
	
	//File Upload Popup Open
	function fnOpenFileUploadWin(){
		fileUploadPopup.show();
		Ext.getBody().mask();
	}
	
	//File Upload Popup Close
	function fnCloseFileUploadWin(){
		fileUploadPopup.hide();
		Ext.getBody().unmask();
		fnGetFileMastGrid().store.load();
	}

	//File Uid Setting
	function fnSetFileMastGridFileUid(paramFileMastGridFileUid){
		fileMastGridFileUid = paramFileMastGridFileUid;
	}

	//File Uid 호출
	function fnSetFileMastGrid(fileMastGridId){
		eval("fileMastGrid = Ext.getCmp('"+fileMastGridId+"')");
	}

	//File Master Grid 호출
	function fnGetFileMastGrid(){
		return fileMastGrid;
	}

	//Transaction 발생되는 Panel을 숨김
	function fnSetFileMastReadMode(){
		Ext.getCmp('fm_panel').setVisible(false);
	}

	//Transaction 발생되는 Panel을 표시
	function fnSetFileMastEditMode(){
		Ext.getCmp('fm_panel').setVisible(true);
	}
	
	//File Upload Submit;
	function fnFileUploadSubmit(){
		fnSetElMask(fileUploadPopup);
		Ext.getCmp('fileUploadFileUid').setValue(fileMastGridFileUid);
		
		var frm = fileUploadForm.getForm();
		frm.submit({
			url: '/sys/com/Common/insertFile.do',
			success: function(form, action){
				fileMastGridFileUid = action.result.FILE_UID;
				fnSetElUnmask(fileUploadPopup);
				Ext.MessageBox.show({
			        title: 'FCAS',
			        msg: action.result.message,
			        icon: Ext.MessageBox.INFO,
			        buttons: Ext.Msg.OK,
			        fn: function(buttonId, text, opt){
			        	if (buttonId == 'ok') {
			        		fnCloseFileUploadWin();
			        	}
			        }   
			    });
			},
			failure: function(form, action){
				fnSetElUnmask(fileUploadPopup);
				fnShowMessage(action.result.message);
			}
		});
	}    
	
	//File Grid Data Load
	function fnFileMastFildLoad(fileMastGridId, paramFileMastGridFileUid){
		if(paramFileMastGridFileUid != undefined && paramFileMastGridFileUid != null && paramFileMastGridFileUid.toUpperCase() == 'NEW' ){
			fileMastGridFileUid = '';
		}else if(paramFileMastGridFileUid != undefined && paramFileMastGridFileUid != null){
			fileMastGridFileUid = paramFileMastGridFileUid;
		}
	    eval("Ext.getCmp('"+fileMastGridId+"').store.load()");
	}

	//File Download
	function fnFileDownload(fileUid, fileSeq){
	    if (document.downloadForm) {
	        document.downloadForm.reset();
	    }
	    var frm=createForm('downloadForm', 'post', '/sys/com/Common/getFileDownload.do', '_self');
	    frm=addHidden(frm, 'FILE_UID', fileUid);
	    frm=addHidden(frm, 'FILE_SEQ', fileSeq);
	    document.insertBefore(frm);
	    frm.submit();
	}	
/** 다중 File Upload Function End **/

Ext.onReady(function(){
    Ext.QuickTips.init();

    /** 단일 File Upload Start **/
    
	    //xtype OneFileMast 선언
	    /*사용시 주의 사항.
	     * 	반드시 해당하는 Form Load 시 Model에 FILE_NM, FILE_SEQ, FILE_UID가 선언되어져 있어야 함.  
	     */
	    Ext.define('FileMastPanel',{
	    	extend: 'Ext.panel.Panel',
	    	alias: 'widget.FileMastPanel',
	    	initComponent: function(){
	    		this.bodyStyle = 'background-color:transparent'	    		
	    		this.fieldDefaults = {
					padding: 0,
	    	    	margin: 1,
	    			labelAlign: 'right',
	    			labelSeparator: ''
	    		};
	    		this.layout = {
	    			type:'hbox',
	    			aligh: 'stretch'
	    		};
	    		this.items = [{
		        		xtype: 'textfield',
		        		id: this.fileNmIdNm,
		        		name: this.fileNmIdNm,
		        		fieldLabel: '첨부파일',
		    			labelWidth: 100,
		    			readOnly: true,
			    		fieldStyle: 'background:rgb(235,235,235);',
		    			width: 380
		    		}, {
		    			xtype: 'button',
		    			text: '파일업로드',
		    			id: 'btn_upload_' + this.fileNmIdNm.valueOf().toLowerCase(),
		    			fileUidId1: this.fileUidIdNm,
		    			fileSeqId1: this.fileSeqIdNm,
		    			fileNmId1: this.fileNmIdNm,
		    			icon: '/images/icon/icon_upload.png',
		    			margin: 1,
		    			hidden: this.panelMode == 'read' ? true : false,
		    	    	handler: function(){
		    	    		fnOpenOneFileUpload(this.fileUidId1, this.fileSeqId1, this.fileNmId1);
		    	    	}
		    		}, {
		    			xtype: 'button',
		    			text: '다운로드',
		    			id: 'btn_download_' + this.fileNmIdNm.valueOf().toLowerCase(),
		    			icon: '/images/icon/icon_download.png',
		    			margin: 1,
		    			fileUidId2: this.fileUidIdNm,
		    			fileSeqId2: this.fileSeqIdNm,		    			
		    			fileNmId2: this.fileNmIdNm,		    			
		    	    	handler: function(){
		    	    		fnOpenOneFileDownload(this.fileUidId2, this.fileSeqId2, this.fileNmId2);
		    	    	}
		    		}, {
		    			xtype: 'button',
		    			text: '파일삭제',
		    			id: 'btn_delete_' + this.fileNmIdNm.valueOf().toLowerCase(),
		    			icon: '/images/icon/icon_delete.png',
		    			margin: 1,
		    			fileUidId3: this.fileUidIdNm,
		    			fileSeqId3: this.fileSeqIdNm,		    			
		    			fileNmId3: this.fileNmIdNm,
		    			hidden: this.panelMode == 'read' ? true : false,
		    	    	handler: function(){
		    	    		fnOpenOneFileDelete(this.fileUidId3, this.fileSeqId3, this.fileNmId3);
		    	    	}
		    		}, {
		        		xtype: 'hidden',
		        		id: this.fileUidIdNm,
		        		name: this.fileUidIdNm,
		        		labelWidth: 0,
		        		width: 0
		    		}, {
		        		xtype: 'hidden',
		        		id: this.fileSeqIdNm,
		        		name: this.fileSeqIdNm,
		        		labelWidth: 0,
		        		width: 0
		    		}
	    		];
	    		FileMastPanel.superclass.initComponent.call(this);
	    	}
	    });    
	    
	
	    //File Upload Form
	    oneFileUploadForm = Ext.create('Ext.form.Panel', {
	        id: 'oneFileUploadForm',
	        height: 300,
	        border: 0,
	        bodyPadding: 10,
	        frame: true,
	        fileUpload: true,        
	        defaults: {
	        	padding: 0,
	        	margin: 2,
	        	labelStyle: "font-weight:bold",
	        	labelAlign: 'right',
	        	labelSeparator: '',
	        	labelWidth: 70,
	        	width: 300
	        },
	        items: [{
	            xtype: 'hidden',
	            id: 'oneFileUploadFileUid',
	            name: 'FILE_UID'
	        }, {
	        	xtype: 'fileuploadfield',
	        	id:'oneFile',
	        	fieldLable:'파일',
	        	buttonText: '파일 선택',
	            width: 450
	        }, {
	        	xtype: 'label',
	        	text: '[주의] 기존에 해당 정보와 연결되어 있는 파일이 존재할 경우 삭제될 수도 있습니다.'
	        }]
	    });
	
	    //File Upload Popup
	    oneFileUploadPopup = Ext.create('Ext.window.Window', {
	    	title: '[Face !nsight] File Upload',
	    	height: 140,
	    	closable:false,
	    	draggable: false,
	    	resizable: false,
	        items: [oneFileUploadForm],
	        buttonAlign: 'center',
	        buttons: [
	            { text: '전송하기',
	              id: 'btn_one_upload_submit',
	              handler: function(){
	            	  fnOneFileUploadSubmit();
	              } 
	            },
	            { text: '초기화',
	              id: 'btn_one_upload_init',
	              handler: function(){
	            	  oneFileUploadForm.getForm().reset();
	              }
	            },
	            { text: '닫기',
	              id: 'btn_one_upload_close',
	              handler: function(){
	            	  fnOneCloseFileUploadWin();
	              }
	            }
	        ]
	    });         
    
    /** 단일 File Upload End **/
    
    /** 다중 File Upload Start **/
    
	    var btn_fileUpload = Ext.create('Ext.button.Button', {
	    	id: 'btn_fileUpload',
	    	text: '파일업로드',
	    	icon: '/images/icon/icon_add.png',
	    	width: 100,
	    	handler: function(){
	    		fnOpenFileUploadWin();
	    	}
	    });
	    
	    var btn_fileDelete = Ext.create('Ext.button.Button', {
	    	id: 'btn_FileDelete',
	    	text: '파일삭제',
	    	icon: '/images/icon/icon_delete.png',
	    	width: 80,
	    	handler: function(){
	    		Ext.MessageBox.confirm('FCAS', '삭제 하시겠습니까?',
	    			function(btnid){
	        			if (btnid == 'yes') {
	        				var record = fnGetFileMastGrid().getView().getSelectionModel().getSelection()[0];
	        				if (record) {
	        					fnGetFileMastGrid().store.remove(record);
	        				} else {
	        					Ext.MessageBox.show({
			                        title: 'FCAS',
			                        msg: parent.msgProperty.COM_ERR_0004,//조회된 데이터가 없습니다.
			                        icon: Ext.MessageBox.INFO,
			                        buttons: Ext.MessageBox.OK
			                    });
	        				}
	        			}
	        		}
	    		);
	    	}
	    });    
	    
	    //xtype FileMastGrid 선언.
	    Ext.define('FileMastGrid',{
	    	extend: 'Ext.grid.Panel',
	    	alias: 'widget.FileMastGrid',
	    	initComponent: function(){
	    		this.columns = [
	    		    {text: 'File Name', width: 200, dataIndex:'FILE_NM_LINK' },
	    		    {text: 'File Size', width: 100, align: 'right', dataIndex:'FILE_SIZE' },
	    		    {text: '등록자', width: 120, dataIndex:'REGI_ID' },
	    		    {text: '등록일', width: 120, dataIndex:'REGI_NM' }
	    		];
	    		
	    		this.tbar = [{
		        	xtype: 'panel',
		        	id: 'fm_panel',
		        	bodyPadding: 0,
		        	bodyStyle: 'background-color:transparent;',
		        	border: 0,
		        	layout: {
		        	    type: 'hbox',
		        	    align: 'stretch'
		        	},
		        	items: [
		        	    btn_fileUpload,
		        	    {xtype: 'tbspacer'},
		        	    btn_fileDelete
		        	]
	    		}];
	    		
	    		this.store = Ext.create('Ext.data.JsonStore', {
	    	        pageSize: 10,
	    			model: Ext.define('FILE_MAST', {
	    			    extend: 'Ext.data.Model',
	    			    idProperty: 'ROWNUM',
	    			    fields: [ 'ROWNUM', 'FILE_UID', 'FILE_SEQ'
	    			              , 'FILE_NM', 'FILE_SIZE', 'FILE_CATE'
	    			              , 'REGI_ID', 'REGI_NM', 'REGI_DT'
	    			              , 'UPDT_ID', 'UPDT_NM', 'UPDT_DT'
	    			              , 'FILE_NM_LINK']
	    			}),
	    			proxy: {
	    				type: 'ajax',
	    				api: {
	    					read: '/sys/com/Common/selectFileMastInfoList.do'
	    				},
	    				reader: {
	    					type: 'json',
	    					root: 'data',
	    					totalProperty: 'total',
	    					successProperty: 'success',
	    					messageProperty: 'message'
	    				},
	    				listeners: {
	    					exception: function(proxy, response, operation){
	    						fnShowProxyMsg(proxy, response, operation);
	    					}
	    				}
	    			},
	    			listeners: {
	    				beforeload: function(store, operation){
	    					var eParams = {FILE_UID:fileMastGridFileUid};
	    					store.proxy.extraParams = eParams;
	    				},
	    				remove: function(store, record, index){
	    					if (record.get('ROWNUM') == '') {
	    						return;
	    					}
	    					
	    					var after_fn = function(response, opts){
	    	                    var result = Ext.decode(response.responseText);
	    	                    if (result.success) {
	    	                        fnShowMessage(parent.msgProperty.COM_RST_0003 + " : " + result.total, Ext.MessageBox.INFO, function(buttonId, text, opt){//삭제를 완료하였습니다.
	    	                            if (buttonId == 'ok') {
	    	                            	fnGetFileMastGrid().store.load();
	    	                            }
	    	                        });
	    	                    } else {
	    	                        var msg = '';
	    	                        try {
	    	                            msg = result.message;
	    	                        } catch(err) {
	    	                            msg = parent.msgProperty.COM_ERR_0003;//삭제에 실패하였습니다.
	    	                        }
	    	                        fnShowMessage(msg);
	    	                    }
	    	                };
	    	                fnSubmitGridStore(store, '/sys/com/Common/deleteFileList.do', after_fn);
	    				}
	    			}
	    		});
	    		FileMastGrid.superclass.initComponent.call(this);
	    	}
	    });
	    
	    //File Upload Form 
	    fileUploadForm = Ext.create('Ext.form.Panel', {
	        id: 'fileUploadForm',
	        height: 200,
	        border: 0,
	        bodyPadding: 10,
	        frame: true,
	        fileUpload: true,        
	        //url: '/sys/com/Common/insertFile.do',
	        defaults: {
	        	padding: 0,
	        	margin: 2,
	        	labelStyle: "font-weight:bold",
	        	labelAlign: 'right',
	        	labelSeparator: '',
	        	labelWidth: 70,
	        	width: 300
	        },
	        items: [{
	            xtype: 'hidden',
	            id: 'fileUploadFileUid',
	            name: 'FILE_UID'
	        }, {
	        	xtype: 'fileuploadfield',
	        	id:'file1',
	        	fieldLable:'파일1',
	        	buttonText: '파일 선택',
	            width: 450
	        }, {
	        	xtype: 'fileuploadfield',
	        	id:'file2',
	        	fieldLable:'파일2',
	        	buttonText: '파일 선택',
	            width: 450
	        }, {
	        	xtype: 'fileuploadfield',
	        	id:'file3',
	        	fieldLable:'파일3',
	        	buttonText: '파일 선택',
	            width: 450
	        }, {
	        	xtype: 'fileuploadfield',
	        	id:'file4',
	        	fieldLable:'파일4',
	        	buttonText: '파일 선택',
	            width: 450
	        }, {
	        	xtype: 'fileuploadfield',
	        	id:'file5',
	        	fieldLable:'파일5',
	        	buttonText: '파일 선택',
	            width: 450
	        }]
		});
	    
	    //File Upload Popup
	    fileUploadPopup = Ext.create('Ext.window.Window', {
	    	title: '[Face !nsight] File Upload',
	    	height: 300,
	    	closable:false,
	    	draggable: false,
	    	resizable: false,    	
	        items: [fileUploadForm],
	        buttonAlign: 'center',
	        buttons: [
	            { text: '전송하기',
	              id: 'btn_upload_submit',
	              handler: function(){
	            	  fnFileUploadSubmit();
	              } 
	            },
	            { text: '초기화',
	              id: 'btn_upload_init',
	              handler: function(){
	            	  fileUploadForm.getForm().reset();
	              }
	            },
	            { text: '닫기',
	              id: 'btn_upload_close',
	              handler: function(){
	            	  fnCloseFileUploadWin();
	              }
	            }
	        ]
	    });
	    
    /** 다중 File Upload Form&Window End **/
    
});


