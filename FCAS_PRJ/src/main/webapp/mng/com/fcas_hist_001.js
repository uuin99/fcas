var scMap = "";
//Grid Model
Ext.define('HIST', {
    extend: 'Ext.data.Model',
    idProperty: 'ROWNUM',
    fields: ['ROWNUM', 'COMP_ID', 'COMP_NM', 'SHOP_ID', 'SHOP_NM', 
             'USER_ID', 'USER_NM', 'DEPT_NM', 'POSI_NM', 'HIST_TYPE', 'HIST_TYPE_DESC',
             'PROG_NM', 'EVNT_TYPE', 'EVNT_TYPE_DESC', 'SRCH_DETL', 'ACES_IP', 'HIST_DT']
});

//Code Model
Ext.define('CODE', {
    extend: 'Ext.data.Model',
    fields: ['CD_TYPE', 'CD', 'CD_TYPE_DESC', 'CD_DESC', 'DISP_ORDR', 'UP_CD_TYPE', 'UP_CD', 'USE_YN']
});

Ext.onReady(function() {
    Ext.QuickTips.init();
    
    var histStore = Ext.create('Ext.data.JsonStore', {
    	model: 'CODE',
    	data: Ext.decode(hist_type)
    });

    histStore.filter([
  	    {property: 'USE_YN', value: 'Y'},
  	    {filterFn: function(item){
  	    	return item.get("CD") != '0000';
  	    }}
  	]);    
    
    var histAllStore = Ext.create('Ext.data.JsonStore', {
        model: 'CODE',
        data: [{'CD': '', 'CD_DESC': 'ALL'}]
    });
    
    for (var i=0; i<histStore.getCount(); i++) {
    	histAllStore.add(histStore.getAt(i));
    }    
    
    var evntStore = Ext.create('Ext.data.JsonStore', {
    	model: 'CODE',
    	data: Ext.decode(evnt_type)
    });
    
    evntStore.filter([
  	    {property: 'USE_YN', value: 'Y'},
  	    {filterFn: function(item){
  	    	return item.get("CD") != '0000';
  	    }}
  	]);        
    
    var evntAllStore = Ext.create('Ext.data.JsonStore', {
        model: 'CODE',
        data: [{'CD': '', 'CD_DESC': 'ALL'}]
    });
    
    for (var i=0; i<evntStore.getCount(); i++) {
    	evntAllStore.add(evntStore.getAt(i));
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
        	    columns: 3
        	},
            items: [{
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
            		id: 's_comp_nm',
            		fieldLabel: '고객사',
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
        	    		fnOpenCompFindForm('s_comp_id','s_comp_nm');

    	            	// 고객사 찾기 클릭시 매장정보는 삭제한다.
                		Ext.getCmp('s_shop_id').setValue('');
                		Ext.getCmp('s_shop_nm').setValue('');
        	    	}
        		}, {
    	            xtype: 'hidden',
    	            id: 's_comp_id',
    	            width: 0,
        			search_cd:'COMP_ID;00003'
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
    	    		labelWidth: 70,
        			width: 180
            	}, {
        			xtype: 'button',
        			text: '찾기',
        			icon: '/images/icon/icon_popup_search02.png',
        			width: 50,
        			margin: 1,
        	    	handler: function(){
        	    		if( Ext.getCmp("s_comp_nm").getValue() == '' ) {
        	    			fnShowMessage(parent.msgProperty.COM_ERR_0028);//고객사를 먼저 선택해 주십시오.
        	    		} else {
        	    			fnOpenShopFindForm( 's_shop_id','s_shop_nm' , Ext.getCmp("s_comp_id").getValue() );
        	    		}
        	    	}
        		}, {
    	            xtype: 'hidden',
    	            id: 's_shop_id',
    	            width: 0,
        			search_cd:'SHOP_ID;00004'
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
                	fieldLabel: '접근일',
                	id: 's_hist_dt_start',
                	format:'Y-m-d',
                	altFormats: 'm,d,Y|m.d.Y|Ymd',
                	padding: 0,
	    	    	margin: 1,
	    			labelAlign: 'right',
	    			labelSeparator: '',
            		enterEventEnabled:true,                	
                	labelWidth: 70,
                	width: 180,
                	search_cd:'HIST_DT_START;00013',
                	value: fnAddMonths(new Date(), 0, 'F')
                }, {
                	xtype: 'datefield',
                	fieldLabel: '~',
                	id: 's_hist_dt_end',
                	format:'Y-m-d',
                	altFormats: 'm,d,Y|m.d.Y|Ymd',
                	padding: 0,
	    	    	margin: 1,
	    			labelAlign: 'right',
	    			labelSeparator: '',
            		enterEventEnabled:true,                	
                	labelWidth: 10,
                	width: 120,
                	search_cd:'HIST_DT_END;00014',
                	value: fnAddMonths(new Date(), 0, 'L')
                }]
        	}, {
        		xtype: 'textfield',
        		id: 's_user_nm',
        		fieldLabel: '사용자',
        		enterEventEnabled:true,
        		search_cd:'USER_NM;00005'
        	}, {
        		xtype: 'textfield',
        		id: 's_dept_nm',
        		fieldLabel: '부서',
        		enterEventEnabled:true,
        		search_cd:'DEPT_NM;00006'
        	}, {
        		xtype: 'textfield',
        		id: 's_posi_nm',
        		fieldLabel: '직책',
        		enterEventEnabled:true,
        		search_cd:'POSI_NM;00007'
        	}, {
        		xtype: 'combobox',
        		id: 's_hist_type',
        		fieldLabel: '이력유형',
        		store: histAllStore,
        	    queryMode: 'local',
        	    valueField: 'CD',
        	    displayField: 'CD_DESC',
        		enterEventEnabled:true,
        	    value: '',
        	    search_cd:'HIST_TYPE;00008'
        	}, {
        		xtype: 'textfield',
        		id: 's_prog_nm',
        		fieldLabel: '화면명',
        		enterEventEnabled:true,
        		search_cd:'PROG_NM;00009'
        	}, {
        		xtype: 'combobox',
        		id: 's_evnt_type',
        		fieldLabel: '이벤트유형',
        		store: evntAllStore,
        	    queryMode: 'local',
        	    valueField: 'CD',
        	    displayField: 'CD_DESC',
        		enterEventEnabled:true,
        	    value: '',
        	    search_cd:'EVNT_TYPE;00010'
        	}]
    	}
    });
    
   
    
    var store = Ext.create('Ext.data.JsonStore', {
        pageSize: 20,
		model: 'HIST',
		proxy: {
			type: 'ajax',
			api: {
				read: '/mng/com/SysUseHist/selectHistList.do'
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
					HIST_DT_START: Ext.Date.format(Ext.getCmp('s_hist_dt_start').getValue(),'Ymd'),
					HIST_DT_END: Ext.Date.format(Ext.getCmp('s_hist_dt_end').getValue(),'Ymd'),
					COMP_ID: Ext.getCmp('s_comp_id').getValue(),
					SHOP_ID: Ext.getCmp('s_shop_id').getValue(),
					USER_NM: Ext.getCmp('s_user_nm').getValue(),
					DEPT_NM: Ext.getCmp('s_dept_nm').getValue(),
					POSI_NM: Ext.getCmp('s_posi_nm').getValue(),
					HIST_TYPE: Ext.getCmp('s_hist_type').getValue(),
					PROG_NM: Ext.getCmp('s_prog_nm').getValue(),
					EVNT_TYPE: Ext.getCmp('s_evnt_type').getValue(),
					SC_MAP:scMap
                };
                store.proxy.extraParams = eParams;
			},
			load: function(store, records, success, eOpts){
				//Paging을 통한 검색은 제외한다.
				scMap = "";
			}
		}
	});
    
    var btn_excel = Ext.create('Ext.button.Button', {
    	id: 'btn_excel',
    	text: 'Excel Export',
    	icon: '/images/icon/icon_excel.png',
    	handler: function(){
    		if (!fnValidSearchDateOneMonth(Ext.getCmp('s_hist_dt_start'),Ext.getCmp('s_hist_dt_end'),'접근일')) {return;}
    		var excelFormObjs = { 
    			    hiddenType:[
    			        { "NAME":"SHEET_NAME", 	"VALUE": "시스템 사용 이력" },
    			        { "NAME":"COLS", 		"VALUE": "COMP_NM,SHOP_NM,USER_NM,DEPT_NM,POSI_NM,HIST_TYPE_DESC,PROG_NM,EVNT_TYPE_DESC,SRCH_DETL,ACES_IP,USER_NM,HIST_DT" },
    			        { "NAME":"TITLE", 		"VALUE": "업체명,매장명,사용자,부서,직책,이력유형,화면명,이벤트유형,검색상세,접근아이피,접근자,접근일시" },
    			        { "NAME":"SQLID", 		"VALUE": "sysusehist.selectHistList" },
    			        { "NAME":"HIST_DT_START", "VALUE": Ext.Date.format(Ext.getCmp('s_hist_dt_start').getValue(),'Ymd') },
    			        { "NAME":"HIST_DT_END", "VALUE": Ext.Date.format(Ext.getCmp('s_hist_dt_end').getValue(),'Ymd') },
    			        { "NAME":"COMP_ID", 	"VALUE": Ext.getCmp('s_comp_id').getValue() == null ? "" : Ext.getCmp('s_comp_id').getValue() },
    			        { "NAME":"SHOP_ID", 	"VALUE": Ext.getCmp('s_shop_id').getValue() == null ? "" : Ext.getCmp('s_shop_id').getValue() },
    			        { "NAME":"USER_NM", 	"VALUE": Ext.getCmp('s_user_nm').getValue() == null ? "" : Ext.getCmp('s_user_nm').getValue() },
    			        { "NAME":"DEPT_NM", 	"VALUE": Ext.getCmp('s_dept_nm').getValue() == null ? "" : Ext.getCmp('s_dept_nm').getValue() },
    			        { "NAME":"POSI_NM", 	"VALUE": Ext.getCmp('s_posi_nm').getValue() == null ? "" : Ext.getCmp('s_posi_nm').getValue() },
    			        { "NAME":"HIST_TYPE", 	"VALUE": Ext.getCmp('s_hist_type').getValue() == null ? "": Ext.getCmp('s_hist_type').getValue() },
    			        { "NAME":"PROG_NM", 	"VALUE": Ext.getCmp('s_prog_nm').getValue() == null ? "" : Ext.getCmp('s_prog_nm').getValue() },
    			        { "NAME":"EVNT_TYPE", 	"VALUE": Ext.getCmp('s_evnt_type').getValue() == null ? "": Ext.getCmp('s_evnt_type').getValue() },
    			        { "NAME":"PROG_ID", 	"VALUE": "FCAS_HIST_001" },
    			        { "NAME":"SC_MAP", 		"VALUE": fnGetScMap(panel) }
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
    		Ext.getCmp('s_hist_dt_start').setValue(fnAddMonths(new Date(), 0, 'F'));
    		Ext.getCmp('s_hist_dt_end').setValue(fnAddMonths(new Date(), 0, 'L'));
    	}
    });
	
	var btn_search = Ext.create('Ext.button.Button', {
		id: 'btn_search',
    	text: '조회',
    	icon: '/images/icon/icon_search.png',
    	handler: function(){
    		if (!fnValidSearchDateOneMonth(Ext.getCmp('s_hist_dt_start'),Ext.getCmp('s_hist_dt_end'),'접근일')) {return;}
    		//scMap = fnGetScMap(panel);
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
            text: '업체명',
            width: 100,
            dataIndex: 'COMP_NM'
        }, {
            text: '매장명',
            width: 100,
            dataIndex: 'SHOP_NM'
        }, {
            text: '사용자',
            width: 100,
            dataIndex: 'USER_NM'
        }, {
            text: '부서',
            width: 100,
            dataIndex: 'DEPT_NM'
        }, {
            text: '직책',
            width: 100,
            dataIndex: 'POSI_NM'
        }, {
            text: '이력유형',
            width: 100,
            dataIndex: 'HIST_TYPE_DESC',
            align: 'center'
        }, {
            text: '화면명',
            width: 100,
            dataIndex: 'PROG_NM'
        }, {
            text: '이벤트유형',
            width: 100,
            dataIndex: 'EVNT_TYPE_DESC',
            align: 'center'
        }, {
            text: '검색상세',
            width: 300,
            dataIndex: 'SRCH_DETL'
        }, {
            text: '접근아이피',
            width: 100,
            dataIndex: 'ACES_IP'
        }, {
            text: '접근일시',
            width: 130,
            dataIndex: 'HIST_DT'
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
    
    fnIframeHeight(516);
});
