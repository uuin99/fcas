//File Uid
var fileMastGridFileUid = '';
//File Master Grid
var fileMastGrid = null;

var fileUploadForm = null;
var fileUploadPopup = null;

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

//File Grid Data Load
function fnFileMastFildLoad(fileMastGridId, paramFileMastGridFileUid){
	if(paramFileMastGridFileUid != undefined && paramFileMastGridFileUid != null){
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

//신규 Form 생성.
function createForm(nm,mt,at,tg) {
    var f=document.createElement("form");
    f.name=nm;
    f.method=mt;
    f.action=at;
    f.target=tg;
    return f;
}

//Form에 Hidden Value 입력.
function addHidden(f,n,v) {
    var i=document.createElement("input");
    i.type="hidden";
    i.name=n;
    i.value=v;
    f.insertBefore(i);
    return f;
}

Ext.onReady(function(){
    Ext.QuickTips.init();

    var btn_fileUpload = Ext.create('Ext.button.Button', {
    	id: 'btn_add',
    	text: '파일업로드',
    	icon: '/images/icon/icon_add.png',
    	width: 100,
    	handler: function(){
    		fnOpenNewBrdPopup();
    	}
    });
    
    var btn_fileDelete = Ext.create('Ext.button.Button', {
    	id: 'btn_delete',
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
		                        msg: '선택한 데이터가 없습니다.',
		                        icon: Ext.MessageBox.INFO,
		                        buttons: Ext.MessageBox.OK
		                    });
        				}
        			}
        		}
    		);
    	}
    });    
    
    Ext.define('FileMastGrid',{
    	extend: 'Ext.grid.Panel',
    	alias: 'widget.FileMastGrid',
    	initComponent: function(){
    		this.height = 200;
    		
    		this.columnLines = true;
    		
    		this.columns = [
    		    {text: 'File Name', width: 200, dataIndex:'FILE_NM_LINK' },
    		    {text: 'File Size', width: 100, align: 'right', dataIndex:'FILE_SIZE' },
    		    {text: '등록자', width: 60, dataIndex:'REGI_NM', align: 'center' },
    		    {text: '등록일', width: 130, dataIndex:'REGI_DT', align: 'center' }
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
    	                        fnShowMessage("삭제를 완료하였습니다. : "+result.total, Ext.MessageBox.INFO, function(buttonId, text, opt){//삭제를 완료하였습니다.
    	                            if (buttonId == 'ok') {
    	                            	fnGetFileMastGrid().store.load();
    	                            }
    	                        });
    	                    } else {
    	                        var msg = '';
    	                        try {
    	                            msg = result.message;
    	                        } catch(err) {
    	                            msg = '삭제에 실패하였습니다.';
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
    
    Ext.create('Ext.window.Window', {
    	title: '[Face !nsight] File List',
    	width: 800,
    	height: 400,
    	items: [{
    		xtype:'textfield'
    	},{
    		xtype:'FileMastGrid',
    		id:'fileMastGridId'
    	}]
    }).show();
    
    fileUploadForm = Ext.create('Ext.form.Panel', {
        id: 'fileUploadForm',
        height: 300,
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
    
    fileUploadPopup = Ext.create('Ext.window.Window', {
    	title: '[Face !nsight] File Upload',
    	height: 300,
    	closable:false,
        items: [fileUploadForm],
        buttonAlign: 'center',
        buttons: [
            { text: '전송하기',
              id: 'brd_submit',
              handler: function(){
            	  fnSubmitBrdPopup();
              } 
            },
            { text: '초기화',
              id: 'brd_init',
              handler: function(){
            	  fileUploadForm.getForm().reset();
              }
            },
            { text: '닫기',
              id: 'brd_close',
              handler: function(){
            	  fnCloseBrdPopup();
              }
            }
        ]
    });
    
    //File Upload Submit;
    function fnSubmitBrdPopup(){
    	Ext.getCmp('fileUploadFileUid').setValue(fileMastGridFileUid);
    	
    	var frm = fileUploadForm.getForm();
    	frm.submit({
    		url: '/sys/com/Common/insertFile.do',
    		success: function(form, action){
    			fnShowMessage(comRst0001);//저장을 완료하였습니다.
    		},
    		failure: function(form, action){
    			fnShowMessage(comErr0001);//저장에 실패하였습니다.
    		}
    	});
    }    
    
    //File Upload Popup Open
    function fnOpenNewBrdPopup(){
    	fileUploadPopup.show();
    	Ext.getBody().mask();
    }
    
    //File Upload Popup Close
    function fnCloseBrdPopup(){
    	fileUploadPopup.hide();
    	Ext.getBody().unmask();
    	fnGetFileMastGrid().store.load();
    }
    
    fnSetFileMastGrid('fileMastGridId');
    fnFileMastFildLoad('fileMastGridId','Test');
    
});
