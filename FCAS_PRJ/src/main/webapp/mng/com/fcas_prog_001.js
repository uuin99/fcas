Ext.define('PROG', {
    extend: 'Ext.data.Model',
    idProperty: 'ROWNUM',
    fields: ['ROWNUM',
             'PROG_ID', 'PROG_NM', 'PROG_DESC', 'TRGT_URL',
             'REGI_ID', 'REGI_NM', 'REGI_DT', 'UPDT_ID', 'UPDT_NM', 'UPDT_DT']
});

function fnRenderer(value, metaData, record, rowIndex, colIndex, store, view){
	if (colIndex == 1) {
		if (record.get('ROWNUM') != '') {
			metaData.style = 'background-color:#f6f6f6;';
		}
	}
	
	if (colIndex >= 5) {
		metaData.style = 'background-color:#f6f6f6;';
	}
	
	if (colIndex == 3) {
		metaData.tdAttr = 'data-qtip="'+fnReplaceAll(value,'\n','<br>')+'"';
	}
	
	return value;
}

Ext.onReady(function(){
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
        		id: 's_prog_nm',
        		fieldLabel: '프로그램명',
        		enterEventEnabled:true
        	}]
    	}
    });
    
    var store = Ext.create('Ext.data.JsonStore', {
        pageSize: 20,
		model: 'PROG',
		proxy: {
			type: 'ajax',
			api: {
				read: '/mng/com/ProgMngt/selectProgMngt.do'
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
					PROG_NM: Ext.getCmp('s_prog_nm').getValue()
                };
                store.proxy.extraParams = eParams;
			},
			remove: function(store, record, index){
				if (record.get('ROWNUM') == '') {
					return;
				}
				fnSetElMask();
				var after_fn = function(response){
                    var result = Ext.decode(response.responseText);
                    if (result.success) {
                    	fnSetElUnmask();
                        fnShowMessage(parent.msgProperty.COM_RST_0003, //삭제를 완료하였습니다. 
                        	Ext.MessageBox.INFO, function(buttonId, text){
	                            if (buttonId == 'ok') {
	                                store.loadPage(1);
	                            }
	                        }
                        );
                    } else {
                    	fnSetElUnmask();
                        var msg = '';
                        try {
                            msg = result.message;
                        } catch(err) {
                            msg = parent.msgProperty.COM_ERR_0003; //삭제에 실패하였습니다.
                        }
                        fnShowMessage(msg);
                    }
                };
                fnSubmitGridStore(store, '/mng/com/ProgMngt/deleteProgMngt.do', after_fn);
			},
			write: function(store, operation){
				
			}
		}
	});
    
    var btn_add = Ext.create('Ext.button.Button', {
    	id: 'btn_add',
    	text: '행추가',
    	icon: '/images/icon/icon_add.png',
    	width: 60,
    	handler: function(){
    		/*
    		var cnt = store.getCount();
    		var edit = grid.getPlugin();
    		var rec = new PROG({
    			ROWNUM: ''
    		});
			edit.cancelEdit();
			store.insert(cnt, rec);
			edit.startEditByPosition({
				row: cnt,
				column: 1
			});
			*/
    		var cnt = store.getCount();
    		store.insert(cnt, new PROG({
    			ROWNUM: ''
    		}));
            rowEditing.startEdit(cnt, 1);			
			
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
    		fnSetElMask();
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
                	fnSetElUnmask();
                    var msg = '';
                    try {
                        msg = result.message;
                    } catch(err) {
                        msg = parent.msgProperty.COM_ERR_0001; //저장에 실패하였습니다.
                    }
                    fnShowMessage(msg);
                }
            };
            fnSubmitGridStore(store, '/mng/com/ProgMngt/insertOrUpdateProgMngt.do', after_fn);
    	}
    });
    
    var btn_excel = Ext.create('Ext.button.Button', {
    	id: 'btn_excel',
    	text: 'Excel Export',
    	icon: '/images/icon/icon_excel.png',
    	handler: function(){
    		
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
	
	var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
		clicksToEdit: 1
	});
    
	var rowEditing = Ext.create('Ext.grid.plugin.RowEditing',{
        clicksToEdit: 1,
        pluginId: 'rowEditing'
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
        plugins: [rowEditing],
        columns: [{
        	xtype: 'rownumberer',
        	text: 'No',
        	width: 40,
        	align: 'center'
        }, {
            text: '프로그램ID'+fnRequiredValue(),
            width: 150,
            dataIndex: 'PROG_ID',
            renderer: fnRenderer,
            editor: {
                
            }
        }, {
            text: '프로그램명'+fnRequiredValue(),
            width: 150,
            dataIndex: 'PROG_NM',
            renderer: fnRenderer,
            editor: {
                
            }
        }, {
            text: '프로그램 설명',
            width: 200,
            dataIndex: 'PROG_DESC',
            renderer: fnRenderer,
            editor: {
                xtype: 'textareafield'
            }
        }, {
            text: '접근주소',
            width: 300,
            dataIndex: 'TRGT_URL',
            renderer: fnRenderer,
            editor: {
                
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
        	    /*btn_excel,
        	    {xtype: 'tbspacer'},*/
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
        		if(e.record.get('ROWNUM') == ''){
        			grid.getPlugin('rowEditing').editor.form.findField('PROG_ID').setReadOnly(false);
        		}else {
        			grid.getPlugin('rowEditing').editor.form.findField('PROG_ID').setReadOnly(true);        			
        		}
        	}
        }
    });
    
    //Resize
    //Ext.getCmp('grid').setSize(w, h);
    
    //Default Value Setting
    //Ext.getCmp('s_use_yn').setValue('');
    
    fnIframeHeight(516);
});
