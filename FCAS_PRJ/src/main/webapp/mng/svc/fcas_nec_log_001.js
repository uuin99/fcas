var isFormExpanded = false;
var popup_cmraCompFindPopupForm = null;
var popup_cmraCompFindGridForm = null;
//공통코드 Model
Ext.define('CODE', {
    extend: 'Ext.data.Model',
    fields: ['CD_TYPE', 'CD', 'CD_TYPE_DESC', 'CD_DESC', 'DISP_ORDR', 'UP_CD_TYPE', 'UP_CD', 'USE_YN']
});

//온라인 문의 질문 Grid Model
Ext.define('NEC_LOG_LIST', {
    extend: 'Ext.data.Model',
    idProperty: 'ROWNUM',
    fields: ['ROWNUM', 
             'LOG_DATE', 'LOG_SEQ', 'REQT_DATE', 'CMRA_NO', 'CMRA_NM', 
             'TRGT_TBL_NM', 'TRGT_TBL_NM_DESC', 'COMP_ID', 'COMP_NM', 'SHOP_ID', 
             'SHOP_NM', 'CMRA_GRP_ID', 'CMRA_GRP_NM', 'LOG_TYPE', 'LOG_TYPE_DESC', 
             'ERR_DESC']
});

Ext.onReady(function(){
    Ext.QuickTips.init(); 
    
//Combo Store
    
    var trgtTblNmStore = Ext.create('Ext.data.JsonStore', {
    	model: 'CODE',
    	data: Ext.decode(trgt_tbl_nm)
    });

    trgtTblNmStore.filter([
  	    {property: 'USE_YN', value: 'Y'},
  	    {filterFn: function(item){
  	    	return item.get("CD") != '0000';
  	    }}
  	]);    
    
    var trgtTblNmAllStore = Ext.create('Ext.data.JsonStore', {
        model: 'CODE',
        data: [{'CD': '', 'CD_DESC': 'ALL'}]
    });
    
    for (var i=0; i<trgtTblNmStore.getCount(); i++) {
    	trgtTblNmAllStore.add(trgtTblNmStore.getAt(i));
    }
    
    var logTypeStore = Ext.create('Ext.data.JsonStore', {
    	model: 'CODE',
    	data: Ext.decode(log_type)
    });

    logTypeStore.filter([
  	    {property: 'USE_YN', value: 'Y'},
  	    {filterFn: function(item){
  	    	return item.get("CD") != '0000';
  	    }}
  	]);    
    
    var logTypeAllStore = Ext.create('Ext.data.JsonStore', {
        model: 'CODE',
        data: [{'CD': '', 'CD_DESC': 'ALL'}]
    });
    
    for (var i=0; i<logTypeStore.getCount(); i++) {
    	logTypeAllStore.add(logTypeStore.getAt(i));
    }     
    
    //Gird Store
    var store = Ext.create('Ext.data.JsonStore', {
        pageSize: 20,
		model: 'NEC_LOG_LIST',
		proxy: {
			type: 'ajax',
			api: {
				read: '/mng/svc/NecConMngt/selectNecLogMngtList.do'
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
						LOG_DATE_START:Ext.Date.format(Ext.getCmp('s_log_date_start').getValue(),'Ymd'),
						LOG_DATE_END:Ext.Date.format(Ext.getCmp('s_log_date_end').getValue(),'Ymd'),
						REQT_DATE_START:Ext.Date.format(Ext.getCmp('s_reqt_date_start').getValue(),'Ymd'),
						REQT_DATE_END:Ext.Date.format(Ext.getCmp('s_reqt_date_end').getValue(),'Ymd'),						
						CMRA_NO:Ext.getCmp('s_cmra_no').getValue(),
						COMP_ID:Ext.getCmp('s_comp_id').getValue(),
						SHOP_ID:Ext.getCmp('s_shop_id').getValue(),
						CMRA_GRP_ID:Ext.getCmp('s_cmra_grp_id').getValue(),
						TRGT_TBL_NM:Ext.getCmp('s_trgt_tbl_nm').getValue(),
						LOG_TYPE:Ext.getCmp('s_log_type').getValue()
				};
                store.proxy.extraParams = eParams;
			}
		}
	});

    //입력폼 Store    
    var form_store = Ext.create('Ext.data.JsonStore', {
        pageSize: 10,
		model: 'NEC_APMT_LIST',
		proxy: {
			type: 'ajax',
			api: {
				read: '/mng/svc/NecConMngt/selectNecLogMngtView.do'
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
			},
			remove: function(store, record, index){
			}
		}
	});    
    
  //Main 검색 Panel
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
    			labelWidth: 80,
    			width: 190
            },
            border: 0,
            layout: {
            	type: 'table',
        	    columns: 3
        	},
            items: [{
        		xtype: 'panel',
        		border:0,
        		padding: 0,
	    		margin: 0,
	    		bodyStyle:'background-color:transparent',
	    		width: 240,
        		layout: {
        			type:'hbox',
        			aligh:'stretch'
        		},
        		items: [{
            		xtype: 'textfield',
            		id: 's_comp_nm',
            		fieldLabel: '고객사',
        			readOnly: true,
            		enterEventEnabled:true,
    	    		fieldStyle: 'background:rgb(235,235,235);',
    	    		labelWidth: 81,
        			width: 181    	    			
            	},{
        			xtype: 'button',
        			text: '찾기',
        			icon: '/images/icon/icon_popup_search02.png',
        			margin: 1,
        			width: 50,
        	    	handler: function(){
    	            	fnOpenCompFindForm('s_comp_id','s_comp_nm');
    	            	// 고객사 찾기 클릭시 매장정보는 삭제한다.
                		Ext.getCmp('s_shop_id').setValue('');
                		Ext.getCmp('s_shop_nm').setValue('');
        	    	}
        		}, {
    	            xtype: 'hidden',
    	            id: 's_comp_id',
    	            width: 0
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
            		id: 's_shop_nm',
            		fieldLabel: '매장',
        			readOnly: true,
    	    		fieldStyle: 'background:rgb(235,235,235);',
    	    		padding: 0,
	    	    	margin: 1,
	    			labelAlign: 'right',
	    			labelSeparator: '',
            		enterEventEnabled:true,
    	    		labelWidth: 80,
        			width: 180
            	}, {
        			xtype: 'button',
        			text: '찾기',
        			id: 's_btn_shop',
        			icon: '/images/icon/icon_popup_search02.png',
        			margin: 1,
        			width: 50,
        	    	handler: function(){
        	    		if( Ext.getCmp("s_comp_nm").getValue() == '' ) {
        	    			fnShowMessage(  parent.msgProperty.COM_ERR_0028 ); //'고객사를 먼저 선택해 주십시오.'
        	    		} else {
        	    			fnOpenShopFindForm( 's_shop_id','s_shop_nm' , Ext.getCmp("s_comp_id").getValue() );
        	    		}
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
                	fieldLabel: '처리일자',
                	id: 's_log_date_start',
                	format:'Y-m-d',
                	altFormats: 'm,d,Y|m.d.Y|Ymd',
                	padding: 0,
	    	    	margin: 1,
	    			labelAlign: 'right',
	    			labelSeparator: '',
            		enterEventEnabled:true,                	
                	labelWidth: 80,
                	width: 180
                }, {
                	xtype: 'datefield',
                	fieldLabel: '~',
                	id: 's_log_date_end',
                	format:'Y-m-d',
                	altFormats: 'm,d,Y|m.d.Y|Ymd',
                	padding: 0,
	    	    	margin: 1,
	    			labelAlign: 'right',
	    			labelSeparator: '',
            		enterEventEnabled:true,                	
                	labelWidth: 10,
                	width: 120
                }]
        	}, {
        		xtype: 'textfield',
        		id: 's_cmra_no',
        		fieldLabel: '카메라번호',
        		enterEventEnabled:true
        	}, {
        		xtype: 'textfield',
        		id: 's_cmra_grp_id',
        		fieldLabel: '카메라그룹번호',
        		enterEventEnabled:true
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
                	fieldLabel: '요청일',
                	id: 's_reqt_date_start',
                	format:'Y-m-d',
                	altFormats: 'm,d,Y|m.d.Y|Ymd',
                	padding: 0,
	    	    	margin: 1,
	    			labelAlign: 'right',
	    			labelSeparator: '',
            		enterEventEnabled:true,                	
                	labelWidth: 80,
                	width: 180
                }, {
                	xtype: 'datefield',
                	fieldLabel: '~',
                	id: 's_reqt_date_end',
                	format:'Y-m-d',
                	altFormats: 'm,d,Y|m.d.Y|Ymd',
                	padding: 0,
	    	    	margin: 1,
	    			labelAlign: 'right',
	    			labelSeparator: '',
            		enterEventEnabled:true,                	
                	labelWidth: 10,
                	width: 120
                }]
        	}, {
        		xtype: 'combobox',
        		id: 's_trgt_tbl_nm',
        		fieldLabel: '요청테이블',
        		store: trgtTblNmAllStore,
        	    queryMode: 'local',
        	    valueField: 'CD',
        	    displayField: 'CD_DESC',
        		enterEventEnabled:true,
        	    value: ''
        	}, {
        		xtype: 'combobox',
        		id: 's_log_type',
        		fieldLabel: '로그유형',
        		store: logTypeAllStore,
        	    queryMode: 'local',
        	    valueField: 'CD',
        	    displayField: 'CD_DESC',
        		enterEventEnabled:true,
        	    value: ''
        	}]
    	}
    });
    
    /* Button 정의 Start */
    var btn_new = Ext.create('Ext.button.Button', {
    	id: 'btn_new',
    	text: '신규',
    	icon: '/images/icon/icon_new.png',
    	width: 60,
    	handler: function(){
    		fnOpenNewForm();
    	}
    });

    var btn_save = Ext.create('Ext.button.Button', {
    	id: 'btn_save',
    	text: '저장',
    	icon: '/images/icon/icon_save.png',
    	width: 60,
    	handler: function(){
    		if(isFormExpanded){
    			fnSaveForm();
    		}else {
    			fnShowMessage(parent.msgProperty.COM_ERR_0021);//입력폼을 활성화 후 버튼을 눌러주시기 바랍니다.
    		}
    	}
    });

    var btn_delete = Ext.create('Ext.button.Button', {
    	id: 'btn_delete',
    	text: '삭제',
    	icon: '/images/icon/icon_delete.png',
    	width: 60,
    	handler: function(){
    		var selectedCompId = Ext.getCmp('STAT_DESC').getValue(); 
    		if(selectedCompId == null || selectedCompId == ''){
    			fnShowMessage(parent.msgProperty.COM_ERR_0022);//삭제할 데이터를 먼저 선택하여 주시기 바랍니다.
    			return;
    		}else {
    			fnRemoveForm();
    		}
    	}
    });    
    
    var btn_excel = Ext.create('Ext.button.Button', {
    	id: 'btn_excel',
    	text: 'Excel Export',
    	icon: '/images/icon/icon_excel.png',
    	handler: function(){
    		fnExcelExport();
    	}
    });

	var btn_reset = Ext.create('Ext.button.Button', {
		id: 'btn_reset',
    	text: '초기화',
    	icon: '/images/icon/icon_reset.png',
    	handler: function(){
    		fnInitSearch(grid, panel);
    		form.getForm().reset();
    		form.collapse();
    		//검색 조건 Default Value Setting.
    	}
    });

	var btn_search = Ext.create('Ext.button.Button', {
		id: 'btn_search',
    	text: '조회',
    	icon: '/images/icon/icon_search.png',
    	handler: function(){
    		fnSearchGrid();
    	}
	});
	
    /* Button 정의 End */	
	
	//Grid
    var grid = Ext.create('Ext.grid.Panel', {
    	id: 'grid',
        columnLines: true,
        viewConfig: {
        	enableTextSelection: true,
            stripeRows: true
        },
        height: 516,
        store: store,
        columns: [{
        	xtype: 'rownumberer',
        	text : 'No',
        	width: 40,
        	align: 'center'
        }, {
    		text: '처리일자',
            width    : 80,
            dataIndex: 'LOG_DATE',
            align: 'center'
    	}, {
    		text: '로그 Seq',
            width    : 50,
            dataIndex: 'LOG_SEQ',
            align: 'right'
    	}, {
    		text: '로그 유형',
            width    : 60,
            dataIndex: 'LOG_TYPE',
            align: 'center'
    	}, {
    		text: '로그 유형명',
            width    : 100,
            dataIndex: 'LOG_TYPE_DESC',
            align: 'left'
    	}, {
    		text: '요청일자',
            width    : 80,
            dataIndex: 'REQT_DATE',
            align: 'center'
    	}, {
    		text: '고객사 ID',
            width    : 80,
            dataIndex: 'COMP_ID'
    	}, {
    		text: '고객사 명',
            width    : 80,
            dataIndex: 'COMP_NM'
    	}, {
    		text: '매장 ID',
            width    : 80,
            dataIndex: 'SHOP_ID'
    	}, {
    		text: '매장 명',
            width    : 80,
            dataIndex: 'SHOP_NM'
    	}, {
    		text: '카메라 그룹 코드',
            width    : 80,
            dataIndex: 'CMRA_GRP_ID'
    	}, {
    		text: '카메라 그룹 명',
            width    : 80,
            dataIndex: 'CMRA_GRP_NM'
    	}, {
    		text: '카메라번호',
            width    : 80,
            dataIndex: 'CMRA_NO'
    	}, {
    		text: '카메라명',
            width    : 80,
            dataIndex: 'CMRA_NM'
    	}, {
    		text: '요청테이블',
            width    : 120,
            dataIndex: 'TRGT_TBL_NM'
    	}, {
    		text: '요청테이블명',
            width    : 100,
            dataIndex: 'TRGT_TBL_NM_DESC'
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
        	items: [/*
        	    btn_new,
        	    {xtype: 'tbspacer'},
        	    btn_save,
        	    {xtype: 'tbspacer'},
        	    btn_delete*/
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
        	select: function(rowModel, record, index){
        		fnOpenLoadForm(record);
        	}
        }
    });

	//입력폼    
    var form = Ext.create('Ext.form.Panel', {
    	id: 'form',
    	title: 'Error 상세',
    	frame: true,
    	height: 400,
    	collapsed: true,
    	collapsible: true,
    	autoScroll : true,
    	fieldDefaults: {
    		padding: 0,
	    	margin: 1,
			labelAlign: 'right',
			labelSeparator: '',
			width: 806
    	},
    	layout: {
    	    type: 'table',
    	    columns: 1
    	},
    	items: [{
    		xtype: 'textarea',
    		id: 'ERR_DESC',
    		name: 'ERR_DESC',
    		height: 350,
    		readOnly:true
    	}],
        listeners: {
        	collapse: function(panel){
        		grid.setHeight(516);
        		isFormExpanded = false;
        	},
        	expand: function(panel){
        		grid.setHeight(200);
        		isFormExpanded = true;
        	}
        }
    });
    
    //화면 출력 Panel
    Ext.create('Ext.panel.Panel', {
    	renderTo: 'main_div',
    	border: 0,
    	padding: 0,
    	margin: 0,
    	width: 818,
    	items: [grid, {xtype: 'tbspacer', height: 10}, form]
    });
    
    /** Function 정의 Start **/
    
    //신규 Button
    function fnOpenNewForm(){
    	fnSetFormObjView(true);
    	form.expand();
    	fnOpenLoadForm();
    }
    
    //Form Load
    function fnOpenLoadForm(record){
    	if(record == undefined){
    		form.loadRecord(new NEC_LOG_LIST());
    		form.collapse();
    	}else {
        	form.loadRecord(record);
        	form.expand();		
    	}
    }    
    
    //저장 Button
    function fnSaveForm(){
    	
    	//From Default Validation.
    	if(fnIsFormDfultValid(form)){
    		return;
    	}
    	
    	/* 사용자 정의 Validation Start */
    	var strlocalVali = fnChkOlnClsValiaion(); 
    	if(strlocalVali != undefined){
    		fnShowMessage(strlocalVali);
    		return;    		
    	}
    	/* 사용자 정의 Validation End */
    	fnSetElMask();
    	form.getForm().submit({
    		url: '/mng/svc/NecConMngt/insertOrUpdateNecApmt.do',
    		success: function(form, action){
    			fnSetElUnmask();
    			fnShowMessage(action.result.message);
    			fnSearchGrid();
    		},
    		failure: function(form, action){
    			fnSetElUnmask();
    			fnShowMessage(action.result.message);
    		}
    	});
    }
    
    //삭제 Button
    function fnRemoveForm(){
    	Ext.MessageBox.confirm('FCAS', parent.msgProperty.COM_IFO_0001, //삭제하시겠습니까?
			function(btnid){
    			if (btnid == 'yes') {
    		    	var strlocalVali = fnChkOlnClsValiaion(); 
    		    	if(strlocalVali != undefined){
    		    		fnShowMessage(strlocalVali);
    		    		return;    		
    		    	}
    		    	fnSetElMask();
    		    	var frm = form.getForm();
    		    	frm.submit({
    		    		url: '/mng/svc/NecConMngt/deleteNecApmt.do',
    		    		success: function(form, action){
    		    			fnSetElUnmask();
    		    			fnShowMessage(action.result.message);
    		    			fnSearchGrid();
    		    		},
    		    		failure: function(form, action){
    		    			fnSetElUnmask();
    		    			fnShowMessage(action.result.message);
    		    		}
    		    	});    				
    			}
    		}
    	);
    }    
    
    function fnChkOlnClsValiaion(){
    	return undefined;
    }
    
    //Grid 조회
    function fnSearchGrid(){
    	form.collapse();
    	fnOpenLoadForm();
		store.loadPage(1);
    }
    
    //Excel Export
    function fnExcelExport(){
    	var excelFormObjs = { 
			    hiddenType:[
			        { "NAME":"SHEET_NAME", 	"VALUE": "FA" },
			        { "NAME":"COLS", 		"VALUE": "REGI_DT,REGI_NM,CLS_TYPE_NM,FINS_YN,CLS_TITLE,FINS_USER_NM,FINS_DT" },
			        { "NAME":"TITLE", 		"VALUE": "문의일시,문의자,문의유형,처리여부,제목,담당자,처리일시" },
			        { "NAME":"SQLID", 		"VALUE": "olnclsmngt.selectOlnClsExcel" },
			        { "NAME":"WIN_TYPE", 	"VALUE": "INQ"}, 
			        { "NAME":"COMP_ID", 	"VALUE":  parent.gvCompId}, 
			        { "NAME":"SHOP_ID", 	"VALUE": Ext.getCmp('s_shop_id').getValue() == null ? "" : Ext.getCmp('s_shop_id').getValue() }, 
			        { "NAME":"CLS_TYPE", 	"VALUE": Ext.getCmp('s_cls_type').getValue() == null ? "" : Ext.getCmp('s_cls_type').getValue() }, 
			        { "NAME":"FINS_YN", 	"VALUE": Ext.getCmp('s_fins_yn').getValue() == null ? "" : Ext.getCmp('s_fins_yn').getValue() }, 
			        { "NAME":"REGI_DT_START", 	"VALUE": Ext.getCmp('s_regi_dt_start').getValue() == null ? "" : Ext.getCmp('s_regi_dt_start').getValue() }, 
			        { "NAME":"REGI_DT_END", "VALUE": Ext.getCmp('s_regi_dt_end').getValue() == null ? "" : Ext.getCmp('s_regi_dt_end').getValue() } 			        
			    ]
			};
		fnDownloadExcel(excelFormObjs);
    }
    /** Function 정의 End **/    
    
    /** 카메라 찾기 영역 Start **/

    //고객사 검색 창 Panel
    var cmraFindPanelForm = Ext.create('Ext.panel.Panel', {
    	id: 's_cmraPopup_form_panel',
    	bodyPadding: 0,
    	border: 0,
    	items: {
    		defaults: {
    			padding: 0,
    			margin: 1,
    			labelAlign: 'right',
    			labelSeparator: '',
    			labelWidth: 60,
    			width: 150
    		},
    		border: 0,
    		layout: {
    			type: 'hbox',
    			align: 'stretch'
    		},
    		items: [{
        		xtype: 'textfield',
        		id: 's_popup_form_cmra_grp_nm',
        		fieldLabel: '카메라번호',
        		enterEventEnabled:true
        	}]
    	}
    });    
    
    //카메라 Model
    Ext.define('POPUP_CMRA_LIST_FROM', {
        extend: 'Ext.data.Model',
        fields: ['ROWNUM', 
                 'COMP_ID', 'COMP_NM', 'SHOP_ID', 'SHOP_NM', 'CMRA_GRP_ID', 
                 'CMRA_GRP_NM', 'CMRA_NO', 'CMRA_NM']
    });

    //카메라 Store
    var popup_cmra_store_form = Ext.create('Ext.data.JsonStore', {
        pageSize: 10,
    	model: 'POPUP_CMRA_LIST_FROM',
    	proxy: {
    		type: 'ajax',
    		api: {
    			read: '/mng/svc/EqipMngt/selectEqipList.do'
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
    					COMP_ID: Ext.getCmp('COMP_ID').getValue(),
    					SHOP_ID: Ext.getCmp('SHOP_ID').getValue(),
    					CMRA_GRP_NM: Ext.getCmp('s_popup_form_cmra_grp_nm').getValue()
                };
                store.proxy.extraParams = eParams;
    		}
    	}
    });    
    
    //고객사 검색 Gird
    popup_cmraFindGridForm = Ext.create('Ext.grid.Panel', {
    	id: 'cmra_find_form_grid',
        columnLines: true,
        viewConfig: {
        	enableTextSelection: true,
            stripeRows: true
        },
        height: 290,
        store: popup_cmra_store_form,
        columns: [{
    		text: '카메라<BR>그룹 ID',
            width    : 60,
            dataIndex: 'CMRA_GRP_ID'
    	}, {
    		text: '카메라 그룹',
            width    : 100,
            dataIndex: 'CMRA_GRP_NM'
    	}, {
    		text: '카메라<BR>번호',
            width    : 60,
            dataIndex: 'CMRA_NO'
    	}, {
    		text: '카메라명',
            width    : 100,
            dataIndex: 'CMRA_NM'
    	}],
        tbar: [{
    	   xtype: 'tbfill'
        }, {
        	xtype: 'panel',
        	id: 'r_cmraPopupForm_panel',
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
        	    		fnInitSearch(popup_cmraFindGridForm, cmraFindPanelForm);
        	    	}
        		}, {
        			xtype: 'tbspacer'
        		}, {
        			xtype: 'button',
        			text: '조회',
        			icon: '/images/icon/icon_search.png',
        	    	handler: function(){
        	    		popup_cmra_store_form.loadPage(1);
        	    	}
        		}
        	]
        }],
        dockedItems: [{
            xtype: 'pagingtoolbar',
            displayInfo: true,
            dock: 'bottom',
            store: popup_cmra_store_form
        }],
		listeners: {

			celldblclick: function(obj ,  td,  cellIndex, record,  tr,  rowIndex,  e,  eOpts){
				
				Ext.getCmp('COMP_ID').setValue(record.data.COMP_ID);
				Ext.getCmp('COMP_NM').setValue(record.data.COMP_NM);
				Ext.getCmp('SHOP_ID').setValue(record.data.SHOP_ID);
				Ext.getCmp('SHOP_NM').setValue(record.data.SHOP_NM);
				Ext.getCmp('CMRA_GRP_ID').setValue(record.data.CMRA_GRP_ID);
				Ext.getCmp('CMRA_GRP_NM').setValue(record.data.CMRA_GRP_NM);
				Ext.getCmp('CMRA_NO').setValue(record.data.CMRA_NO);
				Ext.getCmp('CMRA_NM').setValue(record.data.CMRA_NM);
				fnCloseCmraFindForm();
			}
		}
    });
    
    //고객사 Popup Window
    popup_cmraFindPopupForm = Ext.create('Ext.window.Window', {
    	title: '[Face !nsight] 카메라 찾기',
    	width: 400,
    	height: 375,
    	closable:false,
    	draggable: false,
    	resizable: false,
        items: [cmraFindPanelForm, popup_cmraFindGridForm],
        buttonAlign: 'center',
        buttons: [
            { text: '적용',
              handler: function(){
            	var record = popup_cmraFindGridForm.getView().getSelectionModel().getSelection()[0];
  				if (record) {
  					//화면 Data 적용.
  					Ext.getCmp('CMRA_GRP_ID').setValue(record.data.CMRA_GRP_ID);
  					Ext.getCmp('CMRA_GRP_NM').setValue(record.data.CMRA_GRP_NM);
  					Ext.getCmp('CMRA_NO').setValue(record.data.CMRA_NO);
  					Ext.getCmp('CMRA_NM').setValue(record.data.CMRA_NM);
  					//Popup Close.
  					fnCloseCmraFindForm();
  				} else {
  					fnShowMessage('적용할 열를 선택하여 주시기 바랍니다.');
  					return;
  				}
              }
            },
            { text: '닫기',
              handler: function(){
            	  fnCloseCmraFindForm();
              }
            }
        ]
    });    
    
    //카메라찾기 Popup Open
    function fnOpenCmraFindForm(){
    	popup_cmraFindPopupForm.show();
    	popup_cmra_store_form.loadPage(1);
    	Ext.getBody().mask();    	
    }
    
    //카메라찾기 Popup Close
    function fnCloseCmraFindForm(){
    	popup_cmraFindPopupForm.hide();
    	Ext.getBody().unmask();
    	fnInitSearch(popup_cmraFindGridForm, cmraFindPanelForm);    	
    }    
    
    function fnSetFormObjView(bol){
    	Ext.getCmp('btn_form_comp').setVisible(bol);//고객사 찾기
    	Ext.getCmp('btn_form_shop').setVisible(bol);//사업소 찾기
    	Ext.getCmp('btn_form_cmra').setVisible(bol);//카메라 찾기
    	
    	Ext.getCmp('REQT_DATE').setReadOnly(!bol);//요청일자
    	Ext.getCmp('TRGT_TBL_NM').setReadOnly(!bol);//요청테이블
    	if(!bol){
    		Ext.getCmp('REQT_DATE').setFieldStyle("background:rgb(235,235,235);");
    		Ext.getCmp('TRGT_TBL_NM').setFieldStyle("background:rgb(235,235,235);");    		
    	}else {
    		Ext.getCmp('REQT_DATE').setFieldStyle("background:rgb(255,255,255);");
    		Ext.getCmp('TRGT_TBL_NM').setFieldStyle("background:rgb(255,255,255);");
    	}
    }
    
    /** 카메라 찾기 영역 End **/
    
    fnIframeHeight(580); //200 + 380
});
