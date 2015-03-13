var today = new Date(); 
//공통코드 Model
Ext.define('CODE', {
    extend: 'Ext.data.Model',
    fields: ['CD_TYPE', 'CD', 'CD_TYPE_DESC', 'CD_DESC', 'DISP_ORDR', 'UP_CD_TYPE', 'UP_CD', 'USE_YN']
});

//고객사 Form Model
Ext.define('USER_INFO', {
    extend: 'Ext.data.Model',
    fields: ['USER_ID','COMP_NM','SHOP_NM','USER_NM','CELL_NO']
});

//고객사 Form Model
Ext.define('SMS_INFO', {
    extend: 'Ext.data.Model',
    idProperty: 'SMS_TO',
    fields: ['SMS_FROM','SMS_DATE','SMS_MSG','SMS_TYPE','SEND_LIST']
});

Ext.onReady(function(){
    Ext.QuickTips.init();
    
    var minCdStore = Ext.create('Ext.data.JsonStore', {
    	model: 'CODE',
    	data: Ext.decode(minCd)
    });

    minCdStore.filter([
	    {property: 'USE_YN', value: 'Y'},
	    {filterFn: function(item){
	    	return item.get("CD") != '0000';
	    }}
	]);    
    
    var timeCdStore = Ext.create('Ext.data.JsonStore', {
        model: 'CODE'
    });
    
    for (var i=0; i<24; i++) {
    	timeCdStore.add(minCdStore.getAt(i));
    }    
    
    //Gird Store
    var store = Ext.create('Ext.data.JsonStore', {
    	model: 'USER_INFO'
    });
    
    /* Button 정의 Start */
    var btn_new = Ext.create('Ext.button.Button', {
    	id: 'btn_new',
    	text: '행추가',
    	icon: '/images/icon/icon_new.png',
    	width: 60,
    	handler: function(){
    		fnOpenNewForm();
    	}
    });

    var btn_delete = Ext.create('Ext.button.Button', {
    	id: 'btn_delete',
    	text: '행삭제',
    	icon: '/images/icon/icon_delete.png',
    	width: 60,
    	handler: function(){
    		fnRemoveForm();
    	}
    });    
    
    var btn_save = Ext.create('Ext.button.Button', {
    	id: 'btn_find',
    	text: '사용자 찾기',
    	icon: '/images/icon/icon_popup_search.png',
    	width: 80,
    	handler: function(){
    		fnOpenUserFind();
    	}
    });
    
	var btn_reset = Ext.create('Ext.button.Button', {
		id: 'btn_reset',
    	text: '초기화',
    	icon: '/images/icon/icon_reset.png',
    	handler: function(){
    		fnInitSearch(grid);
    		fnInitForm();
    		Ext.getCmp('REV_FLAG').setValue(null);
    	}
    });

    /* Button 정의 End */	
	
	//Grid
    var grid = Ext.create('Ext.grid.Panel', {
    	id: 'grid',
    	width: 450,
        columnLines: true,
        viewConfig: {
        	enableTextSelection: true,
            stripeRows: true
        },
        height: 516,
        store: store,
        plugins: [Ext.create('Ext.grid.plugin.CellEditing', {clicksToEdit: 1})],
        columns: [{
            width    : 200,
            hidden : true,
            dataIndex: 'USER_ID'
    	}, {
    		text: '고객사',
            width    : 111,
            align: 'center',
            dataIndex: 'COMP_NM'
    	}, {
    		text: '매장',
            width    : 110,
            align: 'center',
            dataIndex: 'SHOP_NM'
    	}, {
    		text: ' 이름',
            width    : 110,
            align: 'center',
            dataIndex: 'USER_NM',
            editor: {
            	
            }
    	}, {
    		text: '핸드폰 번호',
            width    : 100,
            dataIndex: 'CELL_NO',
            editor: {
            	regex: new RegExp(/[01](0|1|6|7|8|9)[-](\d{4}|\d{3})[-]\d{4}$/),
        		regexText: '핸드폰번호 형식(010-0000-0000)을 맞추어 주세요',
        		maxLength: 16            	
            }
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
        	    btn_new,
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
        	    btn_reset
        	]
        }],
        listeners: {
        	select: function(rowModel, record, index){
        	}
        }
    });

	//입력폼    
    var form = Ext.create('Ext.form.Panel', {
    	id: 'form',
    	title: 'SMS 전송',
    	frame: true,
    	width: 366,
    	height: 300,
    	autoScroll : true,
    	fieldDefaults: {
    		padding: 0,
	    	margin: 1,
			labelAlign: 'right',
			labelSeparator: '',
			labelWidth: 100,
			width: 345
    	},
    	layout: {
    	    type: 'table',
    	    columns: 1
    	},
    	style: {
    		backgroundColor: 'white'
    	},
    	items: [{
    		xtype: 'textfield',
    		id: 'SMS_FROM',
    		name: 'SMS_FROM',
    		fieldLabel: '보내는 사람 번호',
    		afterLabelTextTpl: fnRequiredValue(),
    		regex: new RegExp(/^\d{1,16}|[-]|[(]|[)]?$/),    		
    		value: parent.gvCellNo,
    		width: 345,
    		maxLength: 200
		}, {
    		xtype: 'textarea',
    		id: 'SMS_MSG',
    		name: 'SMS_MSG',
    		fieldLabel: '메시지',
    		afterLabelTextTpl: fnRequiredValue(),
    		width: 345,
    		height: 100,
        	maxLength: 8000,
        	listeners: {
        		blur : function(obj){
        			var objVal = obj.getValue();
        			var maxSize = 80;
        	    	var myLength = fnGetBytes(objVal);
        	    	if (maxSize < myLength) {
        	    		obj.setValue(fnAssertMsg(maxSize, objVal));
        	    		return;
        	    	}        	    	
        		}
        	}
    	}, {
    		xtype: 'checkboxfield',
    		id: 'REV_FLAG',
    		name: 'REV_FLAG',
    		fieldLabel: '예약여부',
    		listeners: {
    			change : function(obj){
    				Ext.getCmp('REV_YYYYMMDD').setVisible(obj.getValue());
    				Ext.getCmp('REV_HH').setVisible(obj.getValue());
    				Ext.getCmp('REV_MI').setVisible(obj.getValue());
    				if(obj.getValue()){
    					Ext.getCmp('REV_YYYYMMDD').setValue(today);
    					Ext.getCmp('REV_HH').setValue(today.getHours() < 10 ? '0' + today.getHours() : '' + today.getHours());
    					Ext.getCmp('REV_MI').setValue(today.getMinutes() < 10 ? '0' + today.getMinutes() : '' + today.getMinutes());
    				}
    			}
    		}
    	}, {
        	xtype: 'panel',
        	id: 'revTimePanel',
        	bodyPadding: 0,
        	border: 0,
        	layout: {
        	    type: 'hbox',
        	    align: 'stretch'
        	},
        	items: [
				{
					xtype: 'datefield',
					id: 'REV_YYYYMMDD',
					name: 'REV_YYYYMMDD',
					fieldLabel: '예약일시',
					format: 'Y-m-d',
					labelWidth: 100,
					width: 200,
					value: new Date(),
					hidden: true,
					listeners: {
				    	change: function(obj, newValue, oldValue, eOpts){
				    	}
				    }
				},{
         			xtype: 'combobox',
     				id: 'REV_HH',
     				name: 'REV_HH',
     				store: timeCdStore,
 	    			queryMode: 'local',
 	    			valueField: 'CD',
 	    			displayField: 'CD',
 	    			editable: false,
 	    			value: '00',
 	    			labelWidth: 0,
 	    			hidden: true,
         			width: 40
				}, {
         			xtype: 'combobox',
     				id: 'REV_MI',
     				name: 'REV_MI',
     				store: minCdStore,
 	    			queryMode: 'local',
 	    			valueField: 'CD',
 	    			displayField: 'CD',
 	    			fieldLabel: ' : ',
 	    			editable: false,
 	    			value: '00',
 	    			labelWidth: 5,
 	    			hidden: true,
         			width: 50
				}
        	]
        }],
    	buttonAlign : 'center',
		buttons : [ {
			text : '전송',
			id : 'btn_brd_write_submit',
			icon : '/images/icon/icon_save.png',
			handler : function() {
				fnSaveForm();
			}
		}]
    });
    
    //화면 출력 Panel
    Ext.create('Ext.panel.Panel', {
    	renderTo: 'main_div',
    	margin: 0,
    	padding: 0,
    	border: 0,
    	width: 818,
    	height: 516,
    	layout: {
    		type: 'hbox',
    		align: 'stretch'
    	},
    	items: [grid, {xtype: 'tbspacer', height: 10}, form]
    });
    
    /** Function 정의 Start **/
    //신규 Button
    function fnOpenNewForm(){
    	var cnt = store.getCount();
    	if(cnt > 29){
    		fnShowMessage(parent.msgProperty.COM_ERR_0078);
    		return;
    	}else {
    		var edit = grid.getPlugin();
    		var rec = new USER_INFO();
    		
    		edit.cancelEdit();
    		store.insert(cnt, rec);
    		edit.startEditByPosition({
    			row: cnt,
    			column: 1
    		});    	    		
    	}
    }
    
    function fnIsSmsToValid(store){
    	var cnt = store.getCount();
    	if(cnt == 0){
    		fnShowMessage(parent.msgProperty.COM_ERR_0079);
    		return true;
    	}
    	
    	for(var i = 0 ; i < cnt ; i ++){
    		var rec = store.getAt(i);
    		if(rec.get("USER_NM") == null || rec.get("USER_NM") == ""){
    			fnShowMessage(parent.msgProperty.COM_ERR_0081);
    			return true;
    		}else if(rec.get("CELL_NO") == null || rec.get("CELL_NO") == ""){
    			fnShowMessage(parent.msgProperty.COM_ERR_0082);
    			return true;    			
    		}
    		
    	}
    	
    	return false;
    }
    
    //저장 Button
    function fnSaveForm(){
    	
    	//From Default Validation.
    	
    	if(fnIsFormDfultValid(form)){
    		return;
    	}
    	
    	if(fnIsSmsToValid(store)){
    		return;
    	}
    	
    	var revDate = "0";
    	if(Ext.getCmp('REV_FLAG').getValue()){
    		var revYyyyMmDd = Ext.Date.format(Ext.getCmp('REV_YYYYMMDD').getValue(),'Y-m-d');
    		var revHh = Ext.getCmp('REV_HH').getValue();
    		var regMi = Ext.getCmp('REV_MI').getValue();
    		if(revYyyyMmDd == null || revYyyyMmDd == ''){
    			fnShowMessage(parent.msgProperty.COM_ERR_0082);
    			return;
    		}
    		if(revHh == null || revHh == ''){
    			fnShowMessage(parent.msgProperty.COM_ERR_0083);
    			return;
    		}
			if(regMi == null || regMi == ''){
				fnShowMessage(parent.msgProperty.COM_ERR_0084);
				return;
			}
			
			revDate = revYyyyMmDd + ' ' + revHh + ':' + regMi + ':00';
    	}
    	
    	/* 사용자 정의 Validation End */
    	fnSetElMask();
    	form.getForm().submit({
    		url: '/mng/svc/SmsInfoMngt/insertSendSmsMngtView.do',
    		params: {
    		         SEND_LIST : fnSetGridParams(store.getNewRecords()),
    		         SMS_DATE : revDate
    		},
    		success: function(form, action){
    			fnSetElUnmask();
    			fnShowMessage(action.result.message);//저장을 완료하였습니다.
    			fnInitSearch(grid);
    		},
    		failure: function(form, action){
    			fnSetElUnmask();
    			fnShowMessage(action.result.message);//저장에 실패하였습니다.
    		}
    	});
    }
    
    //삭제 Button
    function fnRemoveForm(){
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
    
    //Form 초기화.
    function fnInitForm(){
    	form.loadRecord(new SMS_INFO({
    		SMS_FROM : parent.gvCellNo
    	}));
    }
    
    fnInitForm();
    fnIframeHeight(750); //200 + 550
    
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
        height: 300,
        store: popup_user_store,
        columns: [{
            xtype: 'checkcolumn',
            header: '선택',
            dataIndex: 'CHK',
            id: 'chkCol',
            width: 40
        }, {
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
        }]
    });
    
    //주소 찾기 Popup Window
    popup_userFindWindow = Ext.create('Ext.window.Window', {
    	title: '[Face !nsight] 사용자 찾기',
    	width: 604,
    	height: 385,
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
            	  var cnt = popup_user_store.getCount();
            	  if(cnt == 0){
            		  fnShowMessage('적용할 열이 존재하지 않습니다.');
            		  return;
            	  }else {
            		  for(var i = 0 ; i < cnt ; i ++){
            			  var userRec = popup_user_store.getAt(i);
            			  if(userRec.get('CHK')){
                			  if(fnAddSmsToList(userRec)){
                				  break;
                			  }            				  
            			  }
            		  }
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
    
    function fnAddSmsToList(record){
    	var cnt = store.getCount();
    	if(cnt > 29){
    		fnShowMessage(parent.msgProperty.COM_ERR_0078);
    		return true;
    	}else {
    		var edit = grid.getPlugin();
    		var rec = new USER_INFO({
    			USER_ID : record.get('USER_ID'),
    			COMP_NM : record.get('COMP_NM'),
    			SHOP_NM : record.get('SHOP_NM'),
    			USER_NM : record.get('USER_NM'),
    			CELL_NO : record.get('CELL_NO')
    		});
    		
    		edit.cancelEdit();
    		store.insert(cnt, rec);
    		edit.startEditByPosition({
    			row: cnt,
    			column: 1
    		});    	    		
    	}    	
    	return false;
    }
    
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
    
});


