
Ext.define('CODE', {
    extend: 'Ext.data.Model',
    idProperty: 'ROWNUM',
    fields: ['ROWNUM', 
             'CD', 'CD_DESC', 
             'REGI_ID', 'REGI_NM', 'REGI_DT', 'UPDT_ID', 'UPDT_NM', 'UPDT_DT']
});

function fnRenderer(value, metaData, record, rowIndex, colIndex, store, view){
	//Key
	if (colIndex == 1) {
		if (record.get('ROWNUM') != '') {
			metaData.style = 'background-color:#f6f6f6;';
		}
	}
	
	//ReadOnly
	if(colIndex >= 3){
		metaData.style = 'background-color:#f6f6f6;';
	}
	
	return value;
}

Ext.onReady(function() {
    Ext.QuickTips.init();
    
    var panel = Ext.create('Ext.panel.Panel', {
    	id: 's_panel',
    	renderTo: 'search_div',
    	bodyPadding: 0,
    	border: 0,
    	items: {
    		defaults: {
    			padding: 0,
    	    	margin: 1,
    			labelAlign: 'right',
    			labelSeparator: '',
    			labelWidth: 70,
    			width: 220
            },
            border: 0,
            layout: {
        	    type: 'hbox',
        	    align: 'stretch'
        	},
            items: [{
        		xtype: 'textfield',
        		id: 's_cd',
        		fieldLabel: '메시지 코드',
        		enterEventEnabled:true,
        		search_cd: 'CD;00001'
        	}, {
        		xtype: 'textfield',
        		id: 's_cd_desc',
        		fieldLabel: '메시지',
        		enterEventEnabled:true,
        		search_cd: 'CD_DESC;00002'
        	}]
    	}
    });
    
    var store = Ext.create('Ext.data.JsonStore', {
        pageSize: 20,
		model: 'CODE',
		proxy: {
			type: 'ajax',
			api: {
				read: '/mng/com/MsgMngt/selectMsgMngt.do'
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
				
				var eParams = {
					CD: Ext.getCmp('s_cd').getValue(),
					CD_DESC: Ext.getCmp('s_cd_desc').getValue()
                };
                store.proxy.extraParams = eParams;
                
			},
			load: function(store, records, success){
				//Paging을 통한 검색은 제외한다.
				//scMap = "";
			},
			remove: function(store, record, index){
				
				if (record.get('ROWNUM') == '') {
					return;
				}
				
				var after_fn = function(response){
                    var result = Ext.decode(response.responseText);
                    if (result.success) {
                        fnShowMessage(parent.msgProperty.COM_RST_0003, //삭제를 완료하였습니다. 
                        	Ext.MessageBox.INFO, function(buttonId, text){
	                            if (buttonId == 'ok') {
	                                store.loadPage(1);
	                            }
	                        }
                        );
                    } else {
                        var msg = '';
                        try {
                            msg = result.message;
                        } catch(err) {
                            msg = parent.msgProperty.COM_ERR_0003; //삭제에 실패하였습니다.
                        }
                        fnShowMessage(msg);
                    }
                };
                fnSubmitGridStore(store, '/mng/com/MsgMngt/deleteMsgMngt.do', after_fn);
                
			}
		}
	});
    
    var btn_add = Ext.create('Ext.button.Button', {
    	id: 'btn_add',
    	text: '행추가',
    	icon: '/images/icon/icon_add.png',
    	width: 60,
    	handler: function(){
    		var cnt = store.getCount();
    		var edit = grid.getPlugin();
    		var rec = new CODE({
    			ROWNUM: ''
    		});
			
			edit.cancelEdit();
			store.insert(cnt, rec);
			edit.startEditByPosition({
				row: cnt,
				column: 1
			});
    	}
    });
    
    var btn_delete = Ext.create('Ext.button.Button', {
    	id: 'btn_delete',
    	text: '행삭제',
    	icon: '/images/icon/icon_delete.png',
    	width: 60,
    	handler: function(){
    		Ext.MessageBox.confirm('FCAS', parent.msgProperty.COM_IFO_0001, //삭제하시겠습니까?
    			function(btnid){
        			if (btnid == 'yes') {
        				var record = grid.getView().getSelectionModel().getSelection()[0];
        				if (record) {
        					store.remove(record);
        				} else {
        					fnShowMessage(parent.msgProperty.COM_ERR_0004); //선택한 데이터가 없습니다.
        				}
        			}
        		}
    		);
    	}
    });
    
    var btn_save = Ext.create('Ext.button.Button', {
    	id: 'btn_save',
    	text: '저장',
    	icon: '/images/icon/icon_save.png',
    	width: 60,
    	handler: function(){
    		var after_fn = function(response){
                var result = Ext.decode(response.responseText);
                if (result.success) {
                	fnSetElUnmask();
                    fnShowMessage(parent.msgProperty.COM_RST_0001, //저장을 완료하였습니다. 
                    	Ext.MessageBox.INFO, function(buttonId, text){
	                        if (buttonId == 'ok') {
	                            store.loadPage(1);
	                        }
	                    }
                    );
                } else {
                    var msg = '';
                    try {
                        msg = result.message;
                    } catch(err) {
                        msg = parent.msgProperty.COM_ERR_0001; //저장에 실패하였습니다.
                    }
                    fnSetElUnmask();
                    fnShowMessage(msg);
                }
            };
            var insertParams = store.getNewRecords();
            var updateParams = store.getUpdatedRecords();
            for(var idx = 0 ; idx < insertParams.length ; idx ++){
            	var paramsTemp = insertParams[idx];
            	if (paramsTemp.get('CD') == '') {
            		fnShowMessage(parent.msgProperty.COM_ERR_0014.replace('param1', '메시지 코드')); //param1은(는) 필수입력 사항입니다.
            		return;
            	}
            	if (paramsTemp.get('CD_DESC') == '') {
            		fnShowMessage(parent.msgProperty.COM_ERR_0014.replace('param1', '메시지')); //param1은(는) 필수입력 사항입니다.
            		return;
            	}
            }
            for(var idx = 0 ; idx < updateParams.length ; idx ++){
            	var paramsTemp = updateParams[idx];
            	if (paramsTemp.get('CD') == '') {
            		fnShowMessage(parent.msgProperty.COM_ERR_0014.replace('param1', '메시지 코드')); //param1은(는) 필수입력 사항입니다.
            		return;
            	}
            	if (paramsTemp.get('CD_DESC') == '') {
            		fnShowMessage(parent.msgProperty.COM_ERR_0014.replace('param1', '메시지')); //param1은(는) 필수입력 사항입니다.
            		return;
            	}
            }
            fnSetElMask();
            fnSubmitGridStore(store, '/mng/com/MsgMngt/insertOrUpdateMsgMngt.do', after_fn);
    	}
    });
    
    var btn_excel = Ext.create('Ext.button.Button', {
    	id: 'btn_excel',
    	text: 'Excel Export',
    	icon: '/images/icon/icon_excel.png',
    	handler: function(){
    		var excelFormObjs = { 
    			    hiddenType:[
    			        { "NAME":"SHEET_NAME", 	"VALUE": "메시지관리" },
    			        { "NAME":"COLS", 		"VALUE": "CD,CD_DESC" },
    			        { "NAME":"TITLE", 		"VALUE": "메시지코드,메시지" },
    			        { "NAME":"SQLID", 		"VALUE": "msgmngt.getMsg" },
    			        { "NAME":"CD", 			"VALUE": Ext.getCmp('s_cd').getValue() == null ? "": Ext.getCmp('s_cd').getValue() },
    			        { "NAME":"CD_DESC", 	"VALUE": Ext.getCmp('s_cd_desc').getValue() == null ? "": Ext.getCmp('s_cd_desc').getValue() }
    			    ]
    			};
    		fnDownloadExcel(excelFormObjs);
    	}
    });
    
	var btn_reset = Ext.create('Ext.button.Button', {
		id: 'btn_reset',
    	text: '초기화',
    	icon: '/images/icon/icon_reset.png',
    	handler: function(){
    		fnInitSearch(grid, panel);
    	}
    });
	
	var btn_search = Ext.create('Ext.button.Button', {
		id: 'btn_search',
    	text: '조회',
    	icon: '/images/icon/icon_search.png',
    	handler: function(){
    		store.loadPage(1);
    	}
	});
    
    var grid = Ext.create('Ext.grid.Panel', {
    	id: 'grid',
        renderTo: 'main_div',
        columnLines: true,
        viewConfig: {
        	enableTextSelection: true,
            stripeRows: true
        },
        width: 'auto',
        height: 516,
        store: store,
        plugins: [Ext.create('Ext.grid.plugin.CellEditing', {clicksToEdit: 1})],
        columns: [{
        	xtype: 'rownumberer',
        	text: 'No',
        	width: 40,
        	align: 'center'
        }, {
            text: '메시지 코드'+fnRequiredValue(),
            width: 100,
            dataIndex: 'CD',
            renderer: fnRenderer,
            editor: {
            	maxLength: 20
            }
        }, {
            text: '메시지'+fnRequiredValue(),
            width: 350,
            dataIndex: 'CD_DESC',
            renderer: fnRenderer,
            editor: {
                maxLength: 500 
            }
        }, {
            text: '등록자',
            width: 60,
            dataIndex: 'REGI_NM',
        	align: 'center',
        	renderer: fnRenderer
        }, {
            text: '등록일시',
            width: 110,
            dataIndex: 'REGI_DT',
        	align: 'center',
        	renderer: fnRenderer
        }, {
            text: '수정자',
            width: 60,
            dataIndex: 'UPDT_NM',
        	align: 'center',
        	renderer: fnRenderer
        }, {
            text: '수정일시',
            width: 110,
            dataIndex: 'UPDT_DT',
        	align: 'center',
        	renderer: fnRenderer
        }],
        tbar: [{
        	xtype: 'panel',
        	id: 'l_panel',
        	bodyPadding: 0,
        	bodyStyle: 'background-color:transparent;',
        	border: 0,
        	layout: {
        	    type: 'hbox',
        	    align: 'stretch'
        	},
        	items: [
        	    btn_add,
        	    {xtype: 'tbspacer'},
        	    btn_delete,
        	    {xtype: 'tbspacer'},
        	    btn_save
        	]
        }, {
    	   xtype: 'tbfill'
        }, {
        	xtype: 'panel',
        	id: 'r_panel',
        	bodyPadding: 0,
        	bodyStyle: 'background-color:transparent;',
        	border: 0,
        	layout: {
        	    type: 'hbox',
        	    align: 'stretch'
        	},
        	items: [
        	    btn_excel,
        	    {xtype: 'tbspacer'},
        	    btn_reset,
        	    {xtype: 'tbspacer'},
        	    btn_search
        	]
        }],
        dockedItems: [{
            xtype: 'pagingtoolbar',
            displayInfo: true,
            dock: 'bottom',
            store: store
        }],
        listeners: {
            beforeedit: function(editor, e){
                if (e.field == 'CD') {
                    if (e.record.get('ROWNUM') != '') {
                        e.cancel = true;
                    }
                }
            }
        }
    });
    
    //Ext.getCmp('grid').setSize(w, h);
    
    fnIframeHeight(516);
});
