var now_date = new Date();

Ext.define('SHOP_EVNT', {
    extend: 'Ext.data.Model',
    idProperty: 'ROWNUM',
    fields: ['ROWNUM',
             'COMP_ID', 'SHOP_ID', 'EVNT_NO', 'EVNT_NM', 'EVNT_STRT_DATE', 'EVNT_END_DATE', 'EVNT_RMRK',
             'REGI_ID', 'REGI_NM', 'REGI_DT', 'UPDT_ID', 'UPDT_NM', 'UPDT_DT']
});

function fnRenderer(value, metaData, record, rowIndex, colIndex, store, view){
	if (colIndex == 1 || colIndex >= 6) {
		metaData.style = 'background-color:#f6f6f6;';
	}
	
	if (colIndex == 5) {
		metaData.tdAttr = 'data-qtip="'+fnReplaceAll(value,'\n','<br>')+'"';
	}
	
	if (colIndex == 3 || colIndex == 4) {
		var returnV = fnChangeFormatDash(value);
        if (Ext.isDate(returnV)) {
            returnV = Ext.Date.format(returnV, 'Y-m-d');
        }
        return returnV;
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
    			labelWidth: 60,
    			width: 210
            },
            border: 0,
            layout: {
        	    type: 'hbox',
        	    align: 'stretch'
        	},
            items: [{
        		xtype: 'panel',
        		border:0,
        		padding: 0,
	    		margin: 0,
	    		bodyStyle:'background-color:transparent',
	    		width:230,
        		layout: {
        			type:'hbox',
        			aligh:'stretch'
        		},
        		items: [{
            		xtype: 'textfield',
            		id: 's_shop_nm',
            		fieldLabel: '매장',
        			readOnly: true,
    	    		fieldStyle: 'background:rgb(235,235,235);',
    	    		padding: 0,
	    	    	margin: 1,
	    			labelAlign: 'right',
	    			labelSeparator: '',
            		enterEventEnabled:true,
    	    		labelWidth: 60,
        			width: 170
            	}, {
        			xtype: 'button',
        			id: 's_btn_shop',
        			text: '찾기',
        			icon: '/images/icon/icon_popup_search02.png',
        			margin: 1,
        			width: 50,
        	    	handler: function(){
        	    		fnOpenShopFindForm( 's_shop_id','s_shop_nm' , parent.gvCompId);
        	    	}
        		}, {
    	            xtype: 'hidden',
    	            id: 's_shop_id',
    	            width: 0
    	        }]
        	}, {
        		xtype: 'panel',
        		border:0,
        		padding: 0,
	    		margin: 0,
	    		colspan: 2,
	    		bodyStyle:'background-color:transparent',
	    		width:320,
        		layout: {
        			type:'hbox',
        			aligh:'stretch'
        		},
        		items: [{
                	xtype: 'datefield',
                	fieldLabel: '이벤트 기간',
                	id: 's_evnt_dt_start',
                	format:'Y-m-d',
                	altFormats: 'm,d,Y|m.d.Y|Ymd',
                	padding: 0,
	    	    	margin: 1,
	    			labelAlign: 'right',
	    			labelSeparator: '',
            		enterEventEnabled:true,                	
                	labelWidth: 70,
                	width: 180,
                	value: Ext.Date.getFirstDateOfMonth(now_date)
                }, {
                	xtype: 'datefield',
                	fieldLabel: '~',
                	id: 's_evnt_dt_end',
                	format:'Y-m-d',
                	altFormats: 'm,d,Y|m.d.Y|Ymd',
                	padding: 0,
	    	    	margin: 1,
	    			labelAlign: 'right',
	    			labelSeparator: '',
            		enterEventEnabled:true,                	
                	labelWidth: 10,
                	width: 120,
                	value: Ext.Date.getLastDateOfMonth(now_date)
                }]
        	}, {
        		xtype: 'textfield',
        		id: 's_evnt_nm',
        		fieldLabel: '이벤트 명'
        	}]
    	}
    });
    
    var store = Ext.create('Ext.data.JsonStore', {
        pageSize: 20,
		model: 'SHOP_EVNT',
		proxy: {
			type: 'ajax',
			api: {
				read: '/cus/set/ShopEvntMngt/selectShopEvntMngt.do'
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
				var eParams = null;
				eParams = {
					COMP_ID: parent.gvCompId,
					SHOP_ID: Ext.getCmp('s_shop_id').getValue(),
					EVNT_DT_START: Ext.Date.format(Ext.getCmp('s_evnt_dt_start').getValue(),'Ymd'),
					EVNT_DT_END: Ext.Date.format(Ext.getCmp('s_evnt_dt_end').getValue(),'Ymd'),
					EVNT_NM: Ext.getCmp('s_evnt_nm').getValue()
                };
				
                store.proxy.extraParams = eParams;
			},
			remove: function(store, record, index){
				if (record.get('EVNT_NO') == '') {
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
                fnSubmitGridStore(store, '/cus/set/ShopEvntMngt/deleteShopEvntMngt.do', after_fn);
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
    		var rec = new SHOP_EVNT({
    			ROWNUM: '',
				COMP_ID: parent.gvCompId,
				SHOP_ID: parent.gvShopId
    		});
			
			edit.cancelEdit();
			store.insert(cnt, rec);
			edit.startEditByPosition({
				row: cnt,
				column: 2
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
                        msg = result.error;
                    } catch(err) {
                        msg = parent.msgProperty.COM_ERR_0001; //저장에 실패하였습니다.
                    }
                    fnShowMessage(msg, Ext.MessageBox.ERROR);
                }
            };
            fnSubmitGridStore(store, '/cus/set/ShopEvntMngt/insertOrUpdateShopEvntMngt.do', after_fn);
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
    		if (parent.gvAuthType == 'C') {
    			Ext.getCmp('s_shop_nm').setValue(parent.gvShopNm);
    			Ext.getCmp('s_shop_id').setValue(parent.gvShopId);
    			Ext.getCmp('s_btn_shop').setVisible(false);
    		}
			Ext.getCmp('s_evnt_dt_start').setValue(Ext.Date.getFirstDateOfMonth(now_date));
			Ext.getCmp('s_evnt_dt_end').setValue(Ext.Date.getLastDateOfMonth(now_date));
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
        plugins: [cellEditing],
        columns: [{
        	xtype: 'rownumberer',
        	text: 'No',
        	width: 40,
        	align: 'center'
        }, {
            text: '이벤트 번호',
            width: 80,
            dataIndex: 'EVNT_NO',
            align: 'center',
            renderer: fnRenderer
        }, {
            text: '이벤트 명',
            width: 150,
            dataIndex: 'EVNT_NM',
            renderer: fnRenderer,
            editor: {
            	
            }
        }, {
            text: '시작일자',
            width: 90,
            dataIndex: 'EVNT_STRT_DATE',
            align: 'center',
            renderer: fnRenderer,
            editor: {
            	xtype: 'datefield'
            }
        }, {
            text: '종료일자',
            width: 90,
            dataIndex: 'EVNT_END_DATE',
            align: 'center',
            renderer: fnRenderer,
            editor: {
            	xtype: 'datefield'
            }
        }, {
            text: '설명',
            width: 300,
            dataIndex: 'EVNT_RMRK',
            renderer: fnRenderer,
            editor: {
                xtype: 'textareafield'
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
        		if (parent.gvAuthType != 'C') { //고객사로 로그인 하였을 경우에 수정 불가.
        			return false;
        		}
        	}
        }
    });
	
	// 권한 타입이 매장일 경우에는 찾기 버튼 삭제한다.
	if (parent.gvAuthType == 'C') {
		Ext.getCmp('s_shop_nm').setValue(parent.gvShopNm);
		Ext.getCmp('s_shop_id').setValue(parent.gvShopId);
		Ext.getCmp('s_btn_shop').setVisible(false);
	} else {
		Ext.getCmp('l_panel').setVisible(false);
	}
	
	fnIframeHeight(516);
});
