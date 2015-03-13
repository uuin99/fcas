var fileUidValue = '';
var fileUploadForm = null;
Ext.onReady(function(){
    Ext.QuickTips.init();
    fileUidValue = '';
    fileUploadForm = Ext.create('Ext.form.Panel', {
        id: 'fileUploadForm',
        height: 190,
        border: 0,
        bodyPadding: 10,
        frame: true,
        fileUpload: true,
        renderTo: 'file_upload_div',
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
        }],
        buttonAlign: 'center',
        buttons: [{ text: '전송하기',
            id: 'btn_upload_submit',
            handler: function(){
            	fnBtnUploadSubmit();
            } 
          },
          { text: '초기화',
            id: 'btn_upload_init',
            handler: function(){
            	this.up('fileUploadForm').getForm().reset();
            }
          },
          { text: '닫기',
            id: 'btn_upload_close',
            handler: function(){
            	fnBtnUploadPopupClose();
            }
          }]
	});
    
    function fnBtnUploadSubmit(){
    	fileUidValue = window.dialogArguments.FILE_UID;
    	Ext.getCmp('fileUploadFileUid').setValue(window.dialogArguments.FILE_UID);
    	
    	var frm = fileUploadForm.getForm();
    	frm.submit({
    		url: '/sys/com/Common/insertFile.do',
    		success: function(form, action){
    			fnShowMessage(action.result.message, undefined, undefined, function(buttonId, text, opt){
    				if(buttonId == Ext.Msg.OK){
    	    			window.returnValue = action.result.FILE_UID;
    	    	    	window.close();
    				}
    			});
    		},
    		failure: function(form, action){
    			fnShowMessage(action.result.message, undefined, undefined, function(buttonId, text, opt){
    				if(buttonId == Ext.Msg.OK){
    				}
    			});
    		}
    	});
    }
        
    //File Upload Popup Close
    function fnBtnUploadPopupClose(){
    	window.returnValue = fileUidValue;
    	window.close();
    }
    
});
