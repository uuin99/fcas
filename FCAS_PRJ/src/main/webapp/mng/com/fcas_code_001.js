Ext.define('CODE', {
    extend: 'Ext.data.Model',
    idProperty: 'ROWNUM',
    fields: ['ROWNUM',
             'CD_TYPE', 'CD', 'CD_TYPE_DESC', 'CD_DESC', 'DISP_ORDR', 'UP_CD_TYPE', 'UP_CD', 'USE_YN',
             'REGI_ID', 'REGI_NM', 'REGI_DT', 'UPDT_ID', 'UPDT_NM', 'UPDT_DT']
});

function fnMRenderer(value, metaData, record, rowIndex, colIndex, store, view){
	if (colIndex == 1) {
		if (record.get('ROWNUM') != '') {
			metaData.style = 'background-color:#f6f6f6;';
		}
	}
	
	if (colIndex >= 5) {
		metaData.style = 'background-color:#f6f6f6;';
	}
	
	return value;
}

function fnDRenderer(value, metaData, record, rowIndex, colIndex, store, view){
	if (colIndex == 1) {
		if (record.get('ROWNUM') != '') {
			metaData.style = 'background-color:#f6f6f6;';
		}
	}
	
	if (colIndex == 4 || colIndex >= 7) {
		metaData.style = 'background-color:#f6f6f6;';
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
        		id: 's_cd_type',
        		fieldLabel: '코드 타입',
        		enterEventEnabled:true
        	}, {
        		xtype: 'textfield',
        		id: 's_cd_type_desc',
        		fieldLabel: '코드타입명',
        		enterEventEnabled:true
        	}, {
        		xtype: 'combobox',
                store: allYnCode,
                valueField: 'CD',
                displayField: 'CD_DESC',
                queryMode: 'local',
        		id: 's_use_yn',
        		fieldLabel: '사용여부',
        		enterEventEnabled:true,
        		editable: false
        	}]
    	}
    });
    
    var m_store = Ext.create('Ext.data.JsonStore', {
        pageSize: 10,
		model: 'CODE',
		proxy: {
			type: 'ajax',
			api: {
				read: '/mng/com/CodeMngt/selectCodeMngt.do'
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
				fnInitSearch(d_grid);
				
				var eParams = {
					CD: '0000', //최상위 코드 타입의 코드값은 0000
					CD_TYPE_S: Ext.getCmp('s_cd_type').getValue(),
					CD_TYPE_DESC: Ext.getCmp('s_cd_type_desc').getValue(),
					USE_YN: Ext.getCmp('s_use_yn').getValue()
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
                        store.loadPage(1);
                        fnShowMessage(msg);
                    }
                };
                fnSubmitGridStore(store, '/mng/com/CodeMngt/deleteCodeMngt.do', after_fn);
			}
		}
	});
    
    var btn_add_m = Ext.create('Ext.button.Button', {
    	id: 'btn_add_m',
    	text: '행추가',
    	icon: '/images/icon/icon_add.png',
    	width: 60,
    	handler: function(){
    		var cnt = m_store.getCount();
    		var edit = m_grid.getPlugin();
    		var rec = new CODE({
    			ROWNUM: '',
    			CD: '0000',
                USE_YN: 'Y'
            });
			
			edit.cancelEdit();
			m_store.insert(cnt, rec);
			edit.startEditByPosition({
				row: cnt,
				column: 1
			});
    	}
    });
    
    var btn_delete_m = Ext.create('Ext.button.Button', {
    	id: 'btn_delete_m',
    	text: '행삭제',
    	icon: '/images/icon/icon_delete.png',
    	width: 60,
    	handler: function(){
    		Ext.MessageBox.confirm('FCAS', parent.msgProperty.COM_IFO_0001, //삭제하시겠습니까?
    			function(btnid){
        			if (btnid == 'yes') {
        				var record = m_grid.getView().getSelectionModel().getSelection()[0];
        				if (record) {
        					m_store.remove(record);
        				} else {
        					fnShowMessage(parent.msgProperty.COM_ERR_0004); //선택한 데이터가 없습니다.
        				}
        			}
        		}
    		);
    	}
    });
    
    var btn_save_m = Ext.create('Ext.button.Button', {
    	id: 'btn_save_m',
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
	                            m_store.loadPage(1);
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
            fnSubmitGridStore(m_store, '/mng/com/CodeMngt/insertOrUpdateCodeMngt.do', after_fn);
    	}
    });
    
    var btn_excel = Ext.create('Ext.button.Button', {
    	id: 'btn_excel',
    	text: 'Excel Export',
    	icon: '/images/icon/icon_excel.png',
    	handler: function(){
    		var excelFormObjs = { 
			    hiddenType:[
			        { "NAME":"SHEET_NAME", 	 "VALUE": document.getElementById("prog_nm").innerText },
			        { "NAME":"COLS", 		 "VALUE": "CD_TYPE, CD_TYPE_DESC, CD, CD_DESC, DISP_ORDR, UP_CD_TYPE, UP_CD, USE_YN, UPDT_NM, UPDT_DT" },
			        { "NAME":"TITLE", 		 "VALUE": "코드타입, 코드타입명, 코드, 코드명, 정렬순서, 상위코드타입, 상위코드, 사용여부, 수정자, 수정일시" },
			        { "NAME":"SQLID", 		 "VALUE": "codemngt.getCode" },
			        { "NAME":"CD_TYPE_S", 	 "VALUE": Ext.getCmp('s_cd_type').getValue() == null ? "": Ext.getCmp('s_cd_type').getValue() },
			        { "NAME":"CD_TYPE_DESC", "VALUE": Ext.getCmp('s_cd_type_desc').getValue() == null ? "": Ext.getCmp('s_cd_type_desc').getValue() },
			        { "NAME":"USE_YN", 	     "VALUE": Ext.getCmp('s_use_yn').getValue() == null ? "": Ext.getCmp('s_use_yn').getValue() }
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
    		fnInitSearch(m_grid, panel);
    		fnInitSearch(d_grid);
    	}
    });
	
	var btn_search = Ext.create('Ext.button.Button', {
		id: 'btn_search',
    	text: '조회',
    	icon: '/images/icon/icon_search.png',
    	handler: function(){
    		m_store.loadPage(1);
    	}
	});
	
	var cellEditingM = Ext.create('Ext.grid.plugin.CellEditing', {
		clicksToEdit: 1
	});
    
    var m_grid = Ext.create('Ext.grid.Panel', {
    	id: 'm_grid',
        columnLines: true,
        viewConfig: {
        	enableTextSelection: true,
            stripeRows: true
        },
        width: 'auto',
        height: 306,
        store: m_store,
        plugins: [cellEditingM],
        columns: [{
        	xtype: 'rownumberer',
        	text: 'No',
        	width: 40,
        	align: 'center'
        }, {
            text: '코드 타입'+fnRequiredValue(),
            width: 100,
            dataIndex: 'CD_TYPE',
            renderer: fnMRenderer,
            editor: {
                
            }
        }, {
            text: '코드 타입명'+fnRequiredValue(),
            width: 200,
            dataIndex: 'CD_TYPE_DESC',
            renderer: fnMRenderer,
            editor: {
                
            }
        }, {
            text: '상위 코드 타입',
            width: 100,
            dataIndex: 'UP_CD_TYPE',
            renderer: fnMRenderer,
            editor: {
                
            }
        }, {
            text: '사용여부'+fnRequiredValue(),
            width: 60,
            dataIndex: 'USE_YN',
        	align: 'center',
        	renderer: fnMRenderer,
            editor: {
            	xtype: 'combobox',
                store: ynCode,
                valueField: 'CD',
                displayField: 'CD_DESC',
                queryMode: 'local'
            }
        }, {
            text: '등록자',
            width: 60,
            dataIndex: 'REGI_NM',
        	align: 'center',
        	renderer: fnMRenderer
        }, {
            text: '등록일시',
            width: 110,
            dataIndex: 'REGI_DT',
        	align: 'center',
        	renderer: fnMRenderer
        }, {
            text: '수정자',
            width: 60,
            dataIndex: 'UPDT_NM',
        	align: 'center',
        	renderer: fnMRenderer
        }, {
            text: '수정일시',
            width: 110,
            dataIndex: 'UPDT_DT',
        	align: 'center',
        	renderer: fnMRenderer
        }],
        tbar: [{
        	xtype: 'panel',
        	id: 'l_panel_m',
        	bodyPadding: 0,
        	bodyStyle: 'background-color:transparent;',
        	border: 0,
        	layout: {
        	    type: 'hbox',
        	    align: 'stretch'
        	},
        	items: [
        	    btn_add_m,
        	    {xtype: 'tbspacer'},
        	    btn_delete_m,
        	    {xtype: 'tbspacer'},
        	    btn_save_m
        	]
        }, {
    	   xtype: 'tbfill'
        }, {
        	xtype: 'panel',
        	id: 'r_panel_m',
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
            store: m_store
        }],
        listeners: {
            beforeedit: function(editor, e){
                if (e.field == 'CD_TYPE') {
                    if (e.record.get('ROWNUM') != '') {
                        e.cancel = true;
                    }
                }
            },
            itemclick: function(view, record, item, index, e){
            	if (record.get('ROWNUM') == '') {
            		fnInitSearch(d_grid);
            		return;
            	}
            	
            	var eParams = {
            		CD_S: '0000',
					CD_TYPE: record.get('CD_TYPE')
                };
                d_store.proxy.extraParams = eParams;
                d_store.loadPage(1);
            }
        }
    });
	
	var d_store = Ext.create('Ext.data.JsonStore', {
        pageSize: 20,
		model: 'CODE',
		proxy: {
			type: 'ajax',
			api: {
				read: '/mng/com/CodeMngt/selectCodeMngt.do'
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
	                                var record = m_grid.getView().getSelectionModel().getSelection()[0];
	                            	var eParams = {
	                            		CD_S: '0000',
	                					CD_TYPE: record.get('CD_TYPE')
	                                };
	                                d_store.proxy.extraParams = eParams;
	                                d_store.loadPage(1);
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
                        var record = m_grid.getView().getSelectionModel().getSelection()[0];
                    	var eParams = {
                    		CD_S: '0000',
        					CD_TYPE: record.get('CD_TYPE')
                        };
                        d_store.proxy.extraParams = eParams;
                        d_store.loadPage(1);
                        
                        fnShowMessage(msg);
                    }
                };
                fnSubmitGridStore(store, '/mng/com/CodeMngt/deleteCodeMngt.do', after_fn);
			}
		}
	});
	
	var btn_add_d = Ext.create('Ext.button.Button', {
    	id: 'btn_add_d',
    	text: '행추가',
    	icon: '/images/icon/icon_add.png',
    	width: 60,
    	handler: function(){
    		var record = m_grid.getView().getSelectionModel().getSelection()[0];
			if (record) {
				var cnt = d_store.getCount();
	    		var edit = d_grid.getPlugin();
	    		var rec = new CODE({
	    			ROWNUM: '',
	    			CD_TYPE: record.get('CD_TYPE'),
	    			CD_TYPE_DESC: record.get('CD_TYPE_DESC'),
	    			UP_CD_TYPE: record.get('UP_CD_TYPE'),
	                USE_YN: 'Y'
	            });
				
				edit.cancelEdit();
				d_store.insert(cnt, rec);
				edit.startEditByPosition({
					row: cnt,
					column: 1
				});
			} else {
				fnShowMessage(parent.msgProperty.COM_ERR_0013); //코드타입을 선택하세요.
			}
    	}
    });
    
    var btn_delete_d = Ext.create('Ext.button.Button', {
    	id: 'btn_delete_d',
    	text: '행삭제',
    	icon: '/images/icon/icon_delete.png',
    	width: 60,
    	handler: function(){
    		Ext.MessageBox.confirm('FCAS', parent.msgProperty.COM_IFO_0001, //삭제하시겠습니까?
    			function(btnid){
        			if (btnid == 'yes') {
        				var record = d_grid.getView().getSelectionModel().getSelection()[0];
        				if (record) {
        					d_store.remove(record);
        				} else {
        					fnShowMessage(parent.msgProperty.COM_ERR_0004); //선택한 데이터가 없습니다.
        				}
        			}
        		}
    		);
    	}
    });
    
    var btn_save_d = Ext.create('Ext.button.Button', {
    	id: 'btn_save_d',
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
	                            d_store.loadPage(1);
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
            fnSubmitGridStore(d_store, '/mng/com/CodeMngt/insertOrUpdateCodeMngt.do', after_fn);
    	}
    });
    
    var cellEditingD = Ext.create('Ext.grid.plugin.CellEditing', {
		clicksToEdit: 1
	});
	
	var d_grid = Ext.create('Ext.grid.Panel', {
    	id: 'd_grid',
        columnLines: true,
        viewConfig: {
        	enableTextSelection: true,
            stripeRows: true
        },
        width: 'auto',
        height: 516,
        store: d_store,
        plugins: [cellEditingD],
        columns: [{
        	xtype: 'rownumberer',
        	text: 'No',
        	width: 40,
        	align: 'center'
        }, {
            text: '코드'+fnRequiredValue(),
            width: 100,
            dataIndex: 'CD',
            renderer: fnDRenderer,
            editor: {
                
            }
        }, {
            text: '코드명'+fnRequiredValue(),
            width: 200,
            dataIndex: 'CD_DESC',
            renderer: fnDRenderer,
            editor: {
                
            }
        }, {
            text: '정렬순서',
            width: 60,
            dataIndex: 'DISP_ORDR',
        	align: 'center',
        	renderer: fnDRenderer,
            editor: {
                
            }
        }, {
            text: '상위 코드 타입',
            width: 100,
            dataIndex: 'UP_CD_TYPE',
            renderer: fnDRenderer
        }, {
            text: '상위 코드',
            width: 100,
            dataIndex: 'UP_CD',
            renderer: fnDRenderer,
            editor: {
                
            }
        }, {
            text: '사용여부'+fnRequiredValue(),
            width: 60,
            dataIndex: 'USE_YN',
        	align: 'center',
        	renderer: fnDRenderer,
            editor: {
            	xtype: 'combobox',
                store: ynCode,
                valueField: 'CD',
                displayField: 'CD_DESC',
                queryMode: 'local'
            }
        }, {
            text: '등록자',
            width: 60,
            dataIndex: 'REGI_NM',
        	align: 'center',
        	renderer: fnDRenderer
        }, {
            text: '등록일시',
            width: 110,
            dataIndex: 'REGI_DT',
        	align: 'center',
        	renderer: fnDRenderer
        }, {
            text: '수정자',
            width: 60,
            dataIndex: 'UPDT_NM',
        	align: 'center',
        	renderer: fnDRenderer
        }, {
            text: '수정일시',
            width: 110,
            dataIndex: 'UPDT_DT',
        	align: 'center',
        	renderer: fnDRenderer
        }],
        tbar: [{
        	xtype: 'panel',
        	id: 'l_panel_d',
        	bodyPadding: 0,
        	bodyStyle: 'background-color:transparent;',
        	border: 0,
        	layout: {
        	    type: 'hbox',
        	    align: 'stretch'
        	},
        	items: [
        	    btn_add_d,
        	    {xtype: 'tbspacer'},
        	    btn_delete_d,
        	    {xtype: 'tbspacer'},
        	    btn_save_d
        	]
        }],
        dockedItems: [{
            xtype: 'pagingtoolbar',
            displayInfo: true,
            dock: 'bottom',
            store: d_store
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
    
    Ext.create('Ext.panel.Panel', {
    	renderTo: 'main_div',
    	bodyPadding: 0,
    	border: 0,
    	width: 818,
    	height: 832,
    	items: [m_grid, {xtype: 'tbspacer', height: 10}, d_grid]
    });
    
    //Resize
    //Ext.getCmp('grid').setSize(w, h);
    
    //Default Value Setting
    Ext.getCmp('s_use_yn').setValue('');
    
    fnIframeHeight(832);
});
