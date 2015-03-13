var scMap = "";
//Grid Model
Ext.define('HIST', {
    extend: 'Ext.data.Model',
    idProperty: 'ROWNUM',
    fields: ['ROWNUM', 'SMS_SEQ', 'SMS_TO', 'SMS_FROM', 'SMS_DATE', 
             'SMS_MSG', 'SMS_TYPE', 'RET_CODE', 'RET_MSG', 'RET_LAST_POINT', 
             'BIZ_TYPE', 'BIZ_TYPE_DESC', 'SMS_TO_ID', 'SMS_TO_NM', 'REGI_ID', 
             'USER_NM', 'REGI_DT', 'SMS_EXEC_DT']
});

//Code Model
Ext.define('CODE', {
    extend: 'Ext.data.Model',
    fields: ['CD_TYPE', 'CD', 'CD_TYPE_DESC', 'CD_DESC', 'DISP_ORDR', 'UP_CD_TYPE', 'UP_CD', 'USE_YN']
});

Ext.onReady(function() {
    Ext.QuickTips.init();
    
    var smsRsltStore = Ext.create('Ext.data.JsonStore', {
    	model: 'CODE',
    	data: Ext.decode(sms_rslt_type)
    });

    smsRsltStore.filter([
  	    {property: 'USE_YN', value: 'Y'},
  	    {filterFn: function(item){
  	    	return item.get("CD") != '0000';
  	    }}
  	]);    
    
    var smsRsltAllStore = Ext.create('Ext.data.JsonStore', {
        model: 'CODE',
        data: [{'CD': '', 'CD_DESC': 'ALL'}]
    });
    
    for (var i=0; i<smsRsltStore.getCount(); i++) {
    	smsRsltAllStore.add(smsRsltStore.getAt(i));
    }  
    
    var smsBizTypeStore = Ext.create('Ext.data.JsonStore', {
    	model: 'CODE',
    	data: Ext.decode(sms_biz_type)
    });

    smsBizTypeStore.filter([
  	    {property: 'USE_YN', value: 'Y'},
  	    {filterFn: function(item){
  	    	return item.get("CD") != '0000';
  	    }}
  	]);    
    
    var smsBizTypeAllStore = Ext.create('Ext.data.JsonStore', {
        model: 'CODE',
        data: [{'CD': '', 'CD_DESC': 'ALL'}]
    });
    
    for (var i=0; i<smsBizTypeStore.getCount(); i++) {
    	smsBizTypeAllStore.add(smsBizTypeStore.getAt(i));
    }    
    
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
    			width: 180
            },
            border: 0,
            layout: {
        	    type: 'table',
        	    columns: 4
        	},
            items: [{
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
                	fieldLabel: 'SMS 요청일',
                	id: 's_regi_dt_start',
                	format:'Y-m-d',
                	altFormats: 'm,d,Y|m.d.Y|Ymd',
                	padding: 0,
	    	    	margin: 1,
	    			labelAlign: 'right',
	    			labelSeparator: '',
            		enterEventEnabled:true,                	
                	labelWidth: 70,
                	width: 180,
                	value: fnAddMonths(new Date(), 0, 'F')
                }, {
                	xtype: 'datefield',
                	fieldLabel: '~',
                	id: 's_regi_dt_end',
                	format:'Y-m-d',
                	altFormats: 'm,d,Y|m.d.Y|Ymd',
                	padding: 0,
	    	    	margin: 1,
	    			labelAlign: 'right',
	    			labelSeparator: '',
            		enterEventEnabled:true,                	
                	labelWidth: 10,
                	width: 120,
                	value: fnAddMonths(new Date(), 0, 'L')
                }]
        	}, {
        		xtype: 'panel',
        		border:0,
        		padding: 0,
	    		margin: 0,
	    		bodyStyle:'background-color:transparent',
	    		width:240,
        		layout: {
        			type:'hbox',
        			aligh:'stretch'
        		},
        		items: [{
            		xtype: 'textfield',
            		id: 's_regi_nm',
            		fieldLabel: '발신자',
        			readOnly: true,
    	    		fieldStyle: 'background:rgb(235,235,235);',
    	    		padding: 0,
	    	    	margin: 1,
	    			labelAlign: 'right',
	    			labelSeparator: '',
	        		enterEventEnabled:true,
    	    		labelWidth: 70,
        			width: 180
            	}, {
        			xtype: 'button',
        			text: '찾기',
        			icon: '/images/icon/icon_popup_search02.png',
        			width: 50,
        			margin: 1,
        	    	handler: function(){
        	    		fnOpenUserFind();
        	    	}
        		}, {
    	            xtype: 'hidden',
    	            id: 's_regi_id',
    	            width: 0
    	        }]
        	}, {
        		xtype: 'textfield',
        		id: 's_sms_from',
        		fieldLabel: '발신번호',
        		enterEventEnabled:true
        	}, {
        		xtype: 'textfield',
        		id: 's_sms_to_nm',
        		fieldLabel: '수신자',
        		enterEventEnabled:true
        	}, {
        		xtype: 'textfield',
        		id: 's_sms_to',
        		fieldLabel: '수신번호',
        		enterEventEnabled:true
        	}, {
        		xtype: 'textfield',
        		id: 's_sms_msg',
        		fieldLabel: '발송 메시지',
        		labelWidth: 70,
            	width: 180,
        		enterEventEnabled:true
        	}, {
        		xtype: 'combobox',
        		id: 's_biz_type',
        		fieldLabel: '업무구분',
        		store: smsBizTypeAllStore,
        	    queryMode: 'local',
        	    valueField: 'CD',
        	    displayField: 'CD_DESC',
        		enterEventEnabled:true,
        	    value: ''
        	}, {
        		xtype: 'combobox',
        		id: 's_ret_code',
        		fieldLabel: '전송결과',
        		store: smsRsltAllStore,
        	    queryMode: 'local',
        	    valueField: 'CD',
        	    displayField: 'CD_DESC',
        		enterEventEnabled:true,
        	    value: ''
        	}]
    	}
    });
    
   
    
    var store = Ext.create('Ext.data.JsonStore', {
        pageSize: 20,
		model: 'HIST',
		proxy: {
			type: 'ajax',
			api: {
				read: '/mng/svc/SmsInfoMngt/selectSmsMngtList.do'
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
						REGI_DT_START : Ext.Date.format(Ext.getCmp('s_regi_dt_start').getValue(),'Ymd'),
						REGI_DT_END : Ext.Date.format(Ext.getCmp('s_regi_dt_end').getValue(),'Ymd'),
						REGI_ID : Ext.getCmp('s_regi_id').getValue(),
						SMS_FROM : Ext.getCmp('s_sms_from').getValue(),
						SMS_TO_NM : Ext.getCmp('s_sms_to_nm').getValue(),
						SMS_TO : Ext.getCmp('s_sms_to').getValue(),
						SMS_MSG : Ext.getCmp('s_sms_msg').getValue(),
						BIZ_TYPE : Ext.getCmp('s_biz_type').getValue(),
						RET_CODE : Ext.getCmp('s_ret_code').getValue()
                };
                store.proxy.extraParams = eParams;
			},
			load: function(store, records, success, eOpts){
			}
		}
	});
    
    var btn_excel = Ext.create('Ext.button.Button', {
    	id: 'btn_excel',
    	text: 'Excel Export',
    	icon: '/images/icon/icon_excel.png',
    	handler: function(){
    		if (!fnValidSearchDateOneMonth(Ext.getCmp('s_regi_dt_start'),Ext.getCmp('s_regi_dt_end'),'접근일')) {return;}
    		var excelFormObjs = { 
    			    hiddenType:[
    			        { "NAME":"SHEET_NAME", 	"VALUE": "SMS 발송이력 검색" },
    			        { "NAME":"COLS", 		"VALUE": "BIZ_TYPE_DESC,REGI_DT,SMS_DATE,USER_NM,SMS_FROM,SMS_TO_NM,SMS_TO_ID,SMS_TO,SMS_MSG,RET_CODE,RET_MSG,RET_LAST_POINT,SMS_EXEC_DT" },
    			        { "NAME":"TITLE", 		"VALUE": "업무 유형,SMS 요청일,발신일자,SMS 요청자,발신번호,수신자,수신자 ID,수신번호,발송 메시지,SMS 결과 코드,SMS 결과,SMS Point (발신 후),실제발신일자" },
    			        { "NAME":"SQLID", 		"VALUE": "smsmngt.getSmsSendList" },
    			        { "NAME":"REGI_DT_START", "VALUE": Ext.Date.format(Ext.getCmp('s_regi_dt_start').getValue(),'Ymd') },
    			        { "NAME":"REGI_DT_END", "VALUE": Ext.Date.format(Ext.getCmp('s_regi_dt_end').getValue(),'Ymd') },
    			        { "NAME":"REGI_ID", "VALUE": Ext.getCmp('s_regi_id').getValue() == null ? "" : Ext.getCmp('s_regi_id').getValue() },
    			        { "NAME":"SMS_FROM", "VALUE": Ext.getCmp('s_sms_from').getValue() == null ? "" : Ext.getCmp('s_sms_from').getValue() },
    			        { "NAME":"SMS_TO_NM", "VALUE": Ext.getCmp('s_sms_to_nm').getValue() == null ? "" : Ext.getCmp('s_sms_to_nm').getValue() },
    			        { "NAME":"SMS_TO", "VALUE": Ext.getCmp('s_sms_to').getValue() == null ? "" : Ext.getCmp('s_sms_to').getValue() },
    			        { "NAME":"SMS_MSG", "VALUE": Ext.getCmp('s_sms_msg').getValue() == null ? "" : Ext.getCmp('s_sms_msg').getValue() },
    			        { "NAME":"BIZ_TYPE", "VALUE": Ext.getCmp('s_biz_type').getValue() == null ? "" : Ext.getCmp('s_biz_type').getValue() },
    			        { "NAME":"RET_CODE", "VALUE": Ext.getCmp('s_ret_code').getValue() == null ? "" : Ext.getCmp('s_ret_code').getValue() }
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
    		if (!fnValidSearchDateOneMonth(Ext.getCmp('s_regi_dt_start'),Ext.getCmp('s_regi_dt_end'),'SMS 요청일')) {return;}
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
        columns: [{
        	xtype: 'rownumberer',
        	text: 'No',
        	width: 40,
        	align: 'center'
        }, {
            text: '업무 유형',
            width: 80,
            dataIndex: 'BIZ_TYPE_DESC',
        	align: 'center'
        }, {
            text: 'SMS 요청일',
            width: 100,
            dataIndex: 'REGI_DT'
        }, {
            text: '발신일자',
            width: 100,
            dataIndex: 'SMS_DATE'
        }, {
            text: 'SMS 요청자',
            width: 100,
            dataIndex: 'USER_NM'
        }, {
            text: '발신번호',
            width: 100,
            dataIndex: 'SMS_FROM'
        }, {
            text: '수신자',
            width: 100,
            dataIndex: 'SMS_TO_NM'
        }, {
            text: '수신자 ID',
            width: 100,
            dataIndex: 'SMS_TO_ID'
        }, {
            text: '수신번호',
            width: 100,
            dataIndex: 'SMS_TO'
        }, {
            text: '발송 메시지',
            width: 200,
            dataIndex: 'SMS_MSG'
        }, {
            text: 'SMS 결과 코드',
            width: 80,
            dataIndex: 'RET_CODE',
        	align: 'center'
        }, {
            text: 'SMS 결과',
            width: 150,
            dataIndex: 'RET_MSG'
        }, {
            text: 'SMS Point (발신 후)',
            width: 100,
            dataIndex: 'RET_LAST_POINT',
        	align: 'right'
        }, {
            text: '실제 발신 일자',
            width: 100,
            dataIndex: 'SMS_EXEC_DT',
        	align: 'right'
        }],
        tbar: [{
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
        }]
    });
    
    //Ext.getCmp('grid').setSize(w, h);
    
    /* 사용자 찾기 Popup Start */
    
    //사용자 Model
    Ext.define('POPUP_USER_LIST', {
        extend: 'Ext.data.Model',
        idProperty: 'ROWNUM',
        fields: ['ROWNUM',
                 'CHK', 'USER_ID', 'COMP_NM', 'SHOP_NM', 'DEPT_NM', 'POSI_NM', 'USER_NM', 'CELL_NO']
    });

    //사용자 Store
    var popup_user_store = Ext.create('Ext.data.JsonStore', {
        pageSize: 10,
    	model: 'POPUP_USER_LIST',
    	proxy: {
    		type: 'ajax',
    		api: {
    			read: '/mng/svc/SmsInfoMngt/selectUserInfoList.do'
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
    					USER_NM: Ext.getCmp('s_user_nm').getValue()
                };
                store.proxy.extraParams = eParams;
    		}
    	}
    });    
    
    //사용자 검색 창 Panel
    var userFindPanel = Ext.create('Ext.panel.Panel', {
    	id: 's_userPopup_panel',
    	bodyPadding: 0,
    	border: 0,
    	items: {
    		defaults: {
    			padding: 0,
    	    	margin: 1,
    			labelAlign: 'right',
    			labelSeparator: '',
    			labelWidth: 50,
    			width: 150
            },
            border: 0,
            layout: {
        	    type: 'hbox',
        	    align: 'stretch'
        	},
            items: [{
        		xtype: 'textfield',
        		id: 's_user_nm',
        		fieldLabel: '사용자명'
        	}]
    	}
    });
    
    //사용자 검색 Gird
    popup_userFindGrid = Ext.create('Ext.grid.Panel', {
    	id: 'user_find_grid',
        columnLines: true,
        viewConfig: {
        	enableTextSelection: true,
            stripeRows: true
        },
        height: 290,
        store: popup_user_store,
        columns: [{
    		text: '고객사',
            width    : 100,
            dataIndex: 'COMP_NM'
    	}, {
    		text: '매장',
            width    : 100,
            dataIndex: 'SHOP_NM'
    	}, {
    		text: '부서',
            width    : 100,
            dataIndex: 'DEPT_NM'
    	}, {
    		text: '직함',
            width    : 60,
            dataIndex: 'POSI_NM'
    	}, {
    		text: '이름',
            width    : 100,
            dataIndex: 'USER_NM'
    	}, {
    		text: '핸드폰번호',
            width    : 90,
            dataIndex: 'CELL_NO'
    	}],
        tbar: [{
    	   xtype: 'tbfill'
        }, {
        	xtype: 'panel',
        	id: 'r_userPopup_panel',
        	bodyPadding: 0,
        	bodyStyle: 'background-color:transparent;',
        	border: 0,
        	layout: {
        	    type: 'hbox',
        	    align: 'stretch'
        	},
        	items: [{
        			xtype: 'button',
        			text: '초기화',
        			icon: '/images/icon/icon_reset.png',
        	    	handler: function(){
        	    		fnInitSearch(popup_userFindGrid, userFindPanel);
        	    	}
        		}, {
        			xtype: 'tbspacer'
        		}, {
        			xtype: 'button',
        			text: '조회',
        			icon: '/images/icon/icon_search.png',
        	    	handler: function(){
        	    		popup_user_store.loadPage(1);
        	    	}
        		}
        	]
        }],
        dockedItems: [{
            xtype: 'pagingtoolbar',
            displayInfo: true,
            dock: 'bottom',
            store: popup_user_store
        }],
		listeners: {
			celldblclick: function(obj ,  td,  cellIndex, record,  tr,  rowIndex,  e,  eOpts){
				//화면 Data 적용.
				Ext.getCmp("s_regi_nm").setValue(record.data.USER_NM);
				Ext.getCmp("s_regi_id").setValue(record.data.USER_ID);
				//Popup Close.
				fnCloseUserFind();
			}
		}
    });
    
    //주소 찾기 Popup Window
    popup_userFindWindow = Ext.create('Ext.window.Window', {
    	title: '[Face !nsight] 사용자 찾기',
    	width: 564,
    	height: 375,
    	y: 56,
    	closable:false,
    	draggable: false,
    	resizable: false,
        items: [userFindPanel, popup_userFindGrid],
        buttonAlign: 'center',
        buttons: [
            { text: '적용',
              id: 'btn_user_apply',
              handler: function(){
            	  var record = popup_userFindGrid.getView().getSelectionModel().getSelection()[0];
    				if (record) {
    					//화면 Data 적용.
    					Ext.getCmp("s_regi_nm").setValue(record.data.USER_NM);
    					Ext.getCmp("s_regi_id").setValue(record.data.USER_ID);
    					//Popup Close.
    					fnCloseUserFind();
    				} else {
    					fnShowMessage(parent.msgProperty.COM_ERR_0019);//적용할 주소를 선택하여 주시기 바랍니다.
    					return;
    				}
              }
            },
            { text: '닫기',
              id: 'btn_user_close',
              handler: function(){
            	  fnCloseUserFind();
              }
            }
        ]
    });    
    
    function fnOpenUserFind(){
    	popup_userFindWindow.show();
    	Ext.getBody().mask();    	
    }
    
    function fnCloseUserFind(){
    	popup_userFindWindow.hide();
    	Ext.getBody().unmask();
    	fnInitSearch(popup_userFindGrid, userFindPanel);   	
    }
    
    /* 사용자 찾기 Popup End */    
    
    fnIframeHeight(516);
});
