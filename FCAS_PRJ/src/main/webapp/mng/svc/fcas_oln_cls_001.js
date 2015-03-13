var isFormExpanded = false;
//공통코드 Model
Ext.define('CODE', {
    extend: 'Ext.data.Model',
    fields: ['CD_TYPE', 'CD', 'CD_TYPE_DESC', 'CD_DESC', 'DISP_ORDR', 'UP_CD_TYPE', 'UP_CD', 'USE_YN']
});

//온라인 문의 질문 Grid Model
Ext.define('ONL_CLS_LIST', {
    extend: 'Ext.data.Model',
    idProperty: 'ROWNUM',
    fields: ['ROWNUM', 
             'COMP_ID', 'COMP_NM' ,'SHOP_ID', 'SHOP_NM' ,'CLS_SEQ' ,'CLS_TITLE' ,'CLS_TYPE' ,
             'QUST_CTS' ,'FILE_UID' ,'ASK_CTS' ,'FINS_YN' ,'CANC_YN' ,
             'REGI_ID' ,'REGI_NM' ,'REGI_DT' ,'UPDT_ID', 'UPDT_NM' ,'UPDT_DT',
             'FINS_USER_NM', 'FINS_DT', 'FINS_ASK_CTS']
});

//온라인 문의 질문 Form Model
Ext.define('ONL_CLS', {
    extend: 'Ext.data.Model',
    idProperty: 'ROWNUM',
    fields: ['ROWNUM', 
             'COMP_ID', 'COMP_NM' ,'SHOP_ID', 'SHOP_NM' ,'CLS_SEQ' ,'CLS_SEQ_VIEW' ,'CLS_TITLE' ,'CLS_TYPE' ,
             'QUST_CTS' ,'FILE_UID' ,'ASK_CTS' ,'FINS_YN' ,'CANC_YN' ,
             'REGI_ID','REGI_NM' ,'REGI_DT' ,'UPDT_ID', 'UPDT_NM','UPDT_DT' , 'REGI_INFO', 
             'UPDT_INFO', 'FILE_NM', 'FILE_SEQ', 'FINS_USER_NM', 'FINS_DT', 'FINS_ASK_CTS']
});

Ext.onReady(function(){
    Ext.QuickTips.init();
    
 	//문의유형 Combo Store
    var clsTypeStore = Ext.create('Ext.data.JsonStore', {
    	model: 'CODE',
    	data: Ext.decode(clsType)
    });

    clsTypeStore.filter([
	    {property: 'USE_YN', value: 'Y'},
	    {filterFn: function(item){
	    	return item.get("CD") != '0000';
	    }}
	]);    
    
 	//문의유형 Combo Store AllType
    var clsTypeAllStore = Ext.create('Ext.data.JsonStore', {
        model: 'CODE',
        data: [{'CD': '', 'CD_DESC': 'ALL'}]
    });

    for (var i=0; i<clsTypeStore.getCount(); i++) {
    	clsTypeAllStore.add(clsTypeStore.getAt(i));
    }    
    
    //Gird Store
    var store = Ext.create('Ext.data.JsonStore', {
        pageSize: 20,
		model: 'ONL_CLS_LIST',
		proxy: {
			type: 'ajax',
			api: {
				read: '/mng/svc/OlnClsMngt/selectOlnClsInqList.do'
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
						WIN_TYPE: 'INQ',
						COMP_ID: parent.gvCompId,
						SHOP_ID: Ext.getCmp('s_shop_id').getValue(),
						CLS_TYPE: Ext.getCmp('s_cls_type').getValue(),
						FINS_YN: Ext.getCmp('s_fins_yn').getValue(),
						REGI_DT_START: Ext.Date.format(Ext.getCmp('s_regi_dt_start').getValue(),'Ymd'),
						REGI_DT_END: Ext.Date.format(Ext.getCmp('s_regi_dt_end').getValue(),'Ymd')
                };
                store.proxy.extraParams = eParams;
			}
		}
	});

    //입력폼 Store    
    var form_store = Ext.create('Ext.data.JsonStore', {
        pageSize: 10,
		model: 'ONL_CLS',
		proxy: {
			type: 'ajax',
			api: {
				read: '/mng/svc/OlnClsMngt/selectOlnClsInq.do'
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
    			labelWidth: 60,
    			width: 170
            },
            border: 0,
            layout: {
            	type: 'table',
        	    columns: 5
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
    	    		value: parent.gvShopNm,
    	    		padding: 0,
	    	    	margin: 1,
	    			labelAlign: 'right',
	    			labelSeparator: '',
            		enterEventEnabled:true,
    	    		labelWidth: 60,
        			width: 170
            	}, {
        			xtype: 'button',
        			text: '찾기',
        			id: 's_btn_shop',
        			icon: '/images/icon/icon_popup_search02.png',
        			margin: 1,
        			width: 50,
        	    	handler: function(){
        	    		fnOpenShopFindForm( 's_shop_id','s_shop_nm' , parent.gvCompId);
        	    	}
        		}, {
    	            xtype: 'hidden',
    	            id: 's_shop_id',
    	            width: 0,
    	            value: parent.gvShopId
    	        }]
        	}, {
     			xtype: 'combobox',
 				id: 's_cls_type',
 				fieldLabel: '문의유형',
 				store: clsTypeAllStore,
    			queryMode: 'local',
    			valueField: 'CD',
    			displayField: 'CD_DESC',
    			value: '',
    			editable: false,
        		enterEventEnabled:true
        	}, {
     			xtype: 'combobox',
 				id: 's_fins_yn',
 				fieldLabel: '처리여부',
 				store: allYnCode,
    			queryMode: 'local',
    			valueField: 'CD',
    			displayField: 'CD_DESC',
    			editable: false,
    			labelWidth: 70,
     			width: 120,
        		enterEventEnabled:true,
     			value:''
        	}, {
            	xtype: 'datefield',
            	fieldLabel: '문의일자',
            	id: 's_regi_dt_start',
            	format:'Y-m-d',
            	altFormats: 'm,d,Y|m.d.Y|Ymd',
        		enterEventEnabled:true,
            	labelWidth: 70,
            	width: 170
            }, {
            	xtype: 'datefield',
            	fieldLabel: '~',
            	id: 's_regi_dt_end',
            	format:'Y-m-d',
            	altFormats: 'm,d,Y|m.d.Y|Ymd',
        		enterEventEnabled:true,
            	labelWidth: 10,
            	width: 110
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
    		var selectedCompId = Ext.getCmp('CLS_SEQ').getValue(); 
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
    		Ext.getCmp('s_shop_nm').setValue(parent.gvShopNm);
    		Ext.getCmp('s_shop_id').setValue(parent.gvShopId);
    		Ext.getCmp('s_fins_yn').setValue('');
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
    		text: '문의일시',
            width    : 110,
            dataIndex: 'REGI_DT'
    	}, {
    		text: '문의자',
            width    : 80,
            dataIndex: 'REGI_NM'
    	}, {
    		text: '문의유형',
            width    : 100,
            dataIndex: 'CLS_TYPE',
            align: 'center',
            renderer: function(value, metaData, record, rowIndex, colIndex, store, view){
            	return fnRendererCode(clsTypeStore, value);
            }
    	}, {
    		text: '처리여부',
            width    : 50,
            dataIndex: 'FINS_YN',
            align: 'center'
    	}, {
    		text: '제목',
            width    : 200,
            dataIndex: 'CLS_TITLE'
    	}, {
    		text: '담당자',
            width    : 80,
            dataIndex: 'FINS_USER_NM'
    	}, {
    		text: '처리일시',
            width    : 110,
            dataIndex: 'FINS_DT'
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
        	    btn_save,
        	    {xtype: 'tbspacer'},
        	    btn_delete
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
        	select: function(rowModel, record, index){
        		fnOpenLoadForm(record.data.COMP_ID, record.data.SHOP_ID, record.data.CLS_SEQ);
        	},
        	beforeedit: function(editor, e){
                if (parent.gvAuthType != 'C') { //고객사로 로그인 하였을 경우에 수정 불가.
                	return false;
                }
        	}
        }
    });

	//입력폼    
    var form = Ext.create('Ext.form.Panel', {
    	id: 'form',
    	title: '온라인 문의 상세',
    	frame: true,
    	height: 380,
    	collapsed: true,
    	collapsible: true,
    	autoScroll : true,
    	fieldDefaults: {
    		padding: 0,
	    	margin: 1,
			labelAlign: 'right',
			labelSeparator: '',
			labelWidth: 100,
			width: 380
    	},
    	layout: {
    	    type: 'table',
    	    columns: 2
    	},
    	style: {
    		backgroundColor: 'white'
    	},
    	items: [{
    		xtype: 'fieldset',
            title: '문의정보',
            defaultType: 'textfield',
            layout: 'anchor',
            colspan: 2,
            margin: "1 10 1 10",
            defaults: {
                anchor: '100%'
            },
        	layout: {
        	    type: 'table',
        	    columns: 2
        	},
        	style: {
        		backgroundColor: 'rgb(223, 233, 246)'
        	},
        	items: [{
        		xtype: 'displayfield',
        		id: 'CLS_SEQ_VIEW',
        		name: 'CLS_SEQ_VIEW',
        		fieldLabel: '문의일련번호 : '
        	}, {
     			xtype: 'combobox',
 				id: 'CLS_TYPE',
 				name: 'CLS_TYPE',
 				fieldLabel: '문의유형',
 				store: clsTypeStore,
    			queryMode: 'local',
    			valueField: 'CD',
    			displayField: 'CD_DESC',
    			afterLabelTextTpl: fnRequiredValue(),
    			editable: false,
    			labelWidth: 100,
     			width: 250
        	}, {
        		xtype: 'textfield',
        		id: 'CLS_TITLE',
        		name: 'CLS_TITLE',
        		fieldLabel: '문의제목',
        		afterLabelTextTpl: fnRequiredValue(),
        		colspan: 2,
        		width: 762,
        		maxLength: 200
        	}, {
        		xtype: 'textarea',
        		id: 'QUST_CTS',
        		name: 'QUST_CTS',
        		fieldLabel: '문의내용',
        		afterLabelTextTpl: fnRequiredValue(),
        		colspan: 2,
        		width: 762,
        		maxLength: 1000
        	}, {
        		xtype: 'FileMastPanel',
        		border:0,
        		padding: 0,
	    		margin: 0,
	    		colspan: 2,
	    		panelMode: 'edit',
	    		fileUidIdNm: 'FILE_UID',
	    		fileSeqIdNm: 'FILE_SEQ',
	    		fileNmIdNm: 'FILE_NM'
        	}, {
        		xtype: 'displayfield',
        		id: 'REGI_NM',
        		name: 'REGI_NM',
        		fieldLabel: '문의자 : '
        	}, {
        		xtype: 'displayfield',
        		id: 'REGI_DT',
        		name: 'REGI_DT',
        		fieldLabel: '문의일시 : '
        	}]
    	}, {
    		xtype: 'fieldset',
            title: '처리정보',
            defaultType: 'textfield',
            layout: 'anchor',
            colspan: 2,
            margin: "1 10 1 10",
            defaults: {
                anchor: '100%'
            },
        	layout: {
        	    type: 'table',
        	    columns: 2
        	},
        	style: {
        		backgroundColor: 'rgb(223, 233, 246)'
        	},
            items: [{
        		xtype: 'displayfield',
        		id: 'FINS_USER_NM',
        		name: 'FINS_USER_NM',
        		fieldLabel: '담당자 : '
        	}, {
        		xtype: 'displayfield',
        		id: 'FINS_DT',
        		name: 'FINS_DT',
        		fieldLabel: '처리일시 : '
        	}, {
        		xtype: 'textarea',
        		id: 'FINS_ASK_CTS',
        		name: 'FINS_ASK_CTS',
        		fieldLabel: '답변내용',
        		colspan: 2,
        		readOnly: true,
	    		fieldStyle: 'background:rgb(235,235,235);',
        		width: 762
        	}]
    	}, {
            xtype: 'hidden',
            id: 'FINS_YN',
            name: 'FINS_YN'
        }, {
            xtype: 'hidden',
            id: 'CANC_YN',
            name: 'CANC_YN'
        }, {
            xtype: 'hidden',
            id: 'COMP_ID',
            name: 'COMP_ID'
        }, {
            xtype: 'hidden',
            id: 'SHOP_ID',
            name: 'SHOP_ID'
        }, {
            xtype: 'hidden',
            id: 'CLS_SEQ',
            name: 'CLS_SEQ'
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
    	fnSetModeChange('W');
    	form.expand();
    	fnInitForm();
    	
    }
    
    //Form Load
    function fnOpenLoadForm(compId, shopId, clsSeq){
    	var eParams = {
    			COMP_ID: compId,
    			SHOP_ID:shopId,
    			CLS_SEQ:clsSeq
            };
        form_store.proxy.extraParams = eParams;
        form_store.load({
        	scope: this,
            callback: function(records, operation, success) {
            	if (records.length == 1) {
            		if(records[0].get('COMP_ID') != parent.gvCompId || records[0].get('SHOP_ID') != parent.gvShopId || records[0].get('FINS_YN') == 'Y'){
            			fnSetModeChange('R');
            		}else {
            			fnSetModeChange('W');
            		}
            		form.loadRecord(records[0]);
            		form.expand();            		
            	} else {
            		fnShowMessage("");
            		return;
            	}
            }
        });
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
    		url: '/mng/svc/OlnClsMngt/insertOrUpdateOlnClsInq.do',
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
    		    		url: '/mng/svc/OlnClsMngt/deleteOlnClsInq.do',
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
    
    //Mode Setting.
    function fnSetModeChange(mode){
    	if (parent.gvAuthType == 'C' && mode == 'W') {
    		Ext.getCmp('CLS_TYPE').setReadOnly(false);
    		Ext.getCmp('CLS_TYPE').setFieldStyle("background:rgb(255,255,255);");
    		Ext.getCmp('CLS_TITLE').setReadOnly(false);
    		Ext.getCmp('CLS_TITLE').setFieldStyle("background:rgb(255,255,255);");
    		Ext.getCmp('QUST_CTS').setReadOnly(false);
    		Ext.getCmp('QUST_CTS').setFieldStyle("background:rgb(255,255,255);");
    		Ext.getCmp('btn_upload_file_nm').setVisible(true);
    		Ext.getCmp('btn_delete_file_nm').setVisible(true);
    	} else {
    		Ext.getCmp('CLS_TYPE').setReadOnly(true);
    		Ext.getCmp('CLS_TYPE').setFieldStyle("background:rgb(235,235,235);");
    		Ext.getCmp('CLS_TITLE').setReadOnly(true);
    		Ext.getCmp('CLS_TITLE').setFieldStyle("background:rgb(235,235,235);");
    		Ext.getCmp('QUST_CTS').setReadOnly(true);
    		Ext.getCmp('QUST_CTS').setFieldStyle("background:rgb(235,235,235);");
    		Ext.getCmp('btn_upload_file_nm').setVisible(false);
    		Ext.getCmp('btn_delete_file_nm').setVisible(false);    		
    	}
    }
    
    function fnChkOlnClsValiaion(){
    	var compId = Ext.getCmp('COMP_ID').getValue();
    	var shopId = Ext.getCmp('SHOP_ID').getValue();
    	var finsYn = Ext.getCmp('FINS_YN').getValue();
    	if (compId != parent.gvCompId || shopId != parent.gvShopId) {
    		return parent.msgProperty.COM_ERR_0029;//타 매장의 문의 사항은 수정이 불가능합니다.
    	} else if(finsYn == 'Y') {
    		return parent.msgProperty.COM_ERR_0030;//이미 처리완료된 문의 사항입니다.
    	} else {
    		return undefined;
    	}
    }
    
    //Grid 조회
    function fnSearchGrid(){
    	form.collapse();
    	fnInitForm();
		store.loadPage(1);
    }
    
    //Form 초기화.
    function fnInitForm(){
    	form.loadRecord(new ONL_CLS({
    		CLS_SEQ_VIEW: '신규',
    		COMP_ID:parent.gvCompId ,
    		SHOP_ID:parent.gvShopId ,
    		FINS_YN: 'N' ,
    		CANC_YN: 'N' ,
    		CLS_TYPE : '10'
    	}));
    }
    
    //Excel Export
    function fnExcelExport(){
    	var excelFormObjs = { 
			    hiddenType:[
			        { "NAME":"SHEET_NAME", 	"VALUE": "온라인문의" },
			        { "NAME":"COLS", 		"VALUE": "REGI_DT,REGI_NM,CLS_TYPE_NM,FINS_YN,CLS_TITLE,FINS_USER_NM,FINS_DT" },
			        { "NAME":"TITLE", 		"VALUE": "문의일시,문의자,문의유형,처리여부,제목,담당자,처리일시" },
			        { "NAME":"SQLID", 		"VALUE": "olnclsmngt.selectOlnClsExcel" },
			        { "NAME":"WIN_TYPE", 	"VALUE": "INQ"}, 
			        { "NAME":"COMP_ID", 	"VALUE":  parent.gvCompId}, 
			        { "NAME":"SHOP_ID", 	"VALUE": Ext.getCmp('s_shop_id').getValue() == null ? "" : Ext.getCmp('s_shop_id').getValue() }, 
			        { "NAME":"CLS_TYPE", 	"VALUE": Ext.getCmp('s_cls_type').getValue() == null ? "" : Ext.getCmp('s_cls_type').getValue() }, 
			        { "NAME":"FINS_YN", 	"VALUE": Ext.getCmp('s_fins_yn').getValue() == null ? "" : Ext.getCmp('s_fins_yn').getValue() }, 
			        { "NAME":"REGI_DT_START", 	"VALUE": Ext.Date.format(Ext.getCmp('s_regi_dt_start').getValue(),'Ymd') == null ? "" : Ext.Date.format(Ext.getCmp('s_regi_dt_start').getValue(),'Ymd') }, 
			        { "NAME":"REGI_DT_END", "VALUE": Ext.Date.format(Ext.getCmp('s_regi_dt_end').getValue(),'Ymd') == null ? "" : Ext.Date.format(Ext.getCmp('s_regi_dt_end').getValue(),'Ymd') } 			        
			    ]
			};
		fnDownloadExcel(excelFormObjs);
    }
    /** Function 정의 End **/    
    
    
    if (parent.gvAuthType == 'C') {
    	Ext.getCmp('s_shop_nm').setValue(parent.gvShopNm);
    	Ext.getCmp('s_shop_id').setValue(parent.gvShopId);
    	Ext.getCmp('s_btn_shop').setVisible(false);
    } else {
    	Ext.getCmp('l_panel').setVisible(false);
    }    
    
    fnIframeHeight(580); //200 + 380
});
