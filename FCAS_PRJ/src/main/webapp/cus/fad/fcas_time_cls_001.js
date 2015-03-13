var scMap = "";
//Grid Model
Ext.define('HIST', {
    extend: 'Ext.data.Model',
    idProperty: 'ROWNUM',
    fields: ['ROWNUM',
             'COMP_ID', 'SHOP_ID', 'CMRA_GRP_ID', 'COMP_NM', 'SHOP_NM',
             'CMRA_GRP_NM', 'STND_DATE', 'SEX_CD', 'SEX_NM', 'AGE_CD',
             'AGE_NM', 'DOV_CD', 'DOV_NM', 'STND_YYMM', 'ENTER_CNT',
             'WORK_DT','TIME_GRP','TIME_GRP_NM','TIME_CD','TIME_NM','DOV_CD','DOV_CD_NM',
             'TOTAL_YN', 'WORK_YN']
});

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
            		id: 's_shop_nm',
            		fieldLabel: '매장',
        			readOnly: true,
            		enterEventEnabled:true,
    	    		fieldStyle: 'background:rgb(235,235,235);',
    	    		padding: 0,
	    	    	margin: 1,
	    			labelAlign: 'right',
	    			labelSeparator: '',
    	    		labelWidth: 70,
        			width: 180,
        			value: parent.gvShopNm
            	}, {
        			xtype: 'button',
        			text: '찾기',
        			icon: '/images/icon/icon_popup_search02.png',
        			width: 50,
        			margin: 1,
        	    	handler: function(){
    	    			fnOpenShopFindForm( 's_shop_id','s_shop_nm' , parent.gvCompId );
        	    	}
        		}, {
    	            xtype: 'hidden',
    	            id: 's_shop_id',
    	            width: 0,
    	            value: parent.gvShopId,
        			search_cd:'SHOP_ID;00004'
    	        }]
        	}, {
        		xtype: 'panel',
        		border:0,
        		padding: 0,
	    		margin: 0,
	    		bodyStyle:'background-color:transparent',
	    		width:320,
        		layout: {
        			type:'hbox',
        			aligh:'stretch'
        		},
        		items: [{
                	xtype: 'datefield',
                	fieldLabel: '기준일',
                	id: 's_stnd_dt_start',
                	format:'Y-m-d',
                	altFormats: 'm,d,Y|m.d.Y|Ymd',
                	padding: 0,
	    	    	margin: 1,
	    			labelAlign: 'right',
	    			labelSeparator: '',
            		enterEventEnabled:true,
                	labelWidth: 70,
                	width: 180,
                	value: fnAddMonths(new Date(), 0, 'F'),
                	search_cd:'STND_DT_START;00027'
                }, {
                	xtype: 'datefield',
                	fieldLabel: '~',
                	id: 's_stnd_dt_end',
                	format:'Y-m-d',
                	altFormats: 'm,d,Y|m.d.Y|Ymd',
                	padding: 0,
	    	    	margin: 1,
	    			labelAlign: 'right',
	    			labelSeparator: '',
            		enterEventEnabled:true,
                	labelWidth: 10,
                	width: 120,
                	value: fnAddMonths(new Date(), 0, 'L'),
                	search_cd:'STND_DT_END;00028'
                }]
        	},{
                xtype: 'radiogroup',
                id:'s_radio_value',
                fieldLabel: '',
                columns: 2,
                vertical: true,
                items: [
                    { boxLabel: '매장', name: 's_radio_value1', inputValue: 'TT', checked: true },
                    { boxLabel: '카메라그룹별', name: 's_radio_value1', inputValue: 'NOT_TT'}
                ]
            }]
    	}
    });

    var store = Ext.create('Ext.data.JsonStore', {
        pageSize: 20,
		model: 'HIST',
		proxy: {
			type: 'ajax',
			api: {
				read: '/cus/fad/DataCls/selectTimeClsList.do'
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
					COMP_ID: parent.gvCompId,
					SHOP_ID: Ext.getCmp('s_shop_id').getValue(),
					RADIO_VALUE: Ext.getCmp('s_radio_value').getValue().s_radio_value1,
					STND_DT_START: Ext.Date.format(Ext.getCmp('s_stnd_dt_start').getValue(),'Ymd'),
					STND_DT_END: Ext.Date.format(Ext.getCmp('s_stnd_dt_end').getValue(),'Ymd'),
					SC_MAP:scMap
                };
                store.proxy.extraParams = eParams;
			},
			load: function(store, records, success, eOpts){
				var radioVal = Ext.getCmp('s_radio_value').getValue().s_radio_value1;
				if(radioVal == 'TT'){
					Ext.getCmp("CMRA_GRP_ID").setVisible(false);
					Ext.getCmp("CMRA_GRP_NM").setVisible(false);
					Ext.getCmp("TOTAL_YN").setVisible(false);
				}else{
					Ext.getCmp("CMRA_GRP_ID").setVisible(true);
					Ext.getCmp("CMRA_GRP_NM").setVisible(true);
					Ext.getCmp("TOTAL_YN").setVisible(true);
				}
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
			if (!fnValidSearchDateOneMonth(Ext.getCmp('s_stnd_dt_start'),Ext.getCmp('s_stnd_dt_end'),'기준일')) {return;}
    		scMap = fnGetScMap(panel);
    		store.load({
    		    scope: this,
    		    callback: function(records, operation, success) {
    		        if (success) {
    					var radioVal = Ext.getCmp('s_radio_value').getValue().s_radio_value1;
    					var colVal = "COMP_ID,COMP_NM,SHOP_ID,SHOP_NM,CMRA_GRP_ID,CMRA_GRP_NM,TOTAL_YN,STND_DATE,STND_YYMM,WORK_YN,DOV_CD,DOV_CD_NM,TIME_CD,TIME_NM,SEX_CD,SEX_NM,AGE_CD,AGE_NM,ENTER_CNT"/*,WORK_DT"*/;
    					var titalVal = "고객사ID,고객사명,매장ID,매장명,카메라그룹ID,카메라그룹명,집계여부,기준일자,기준월,휴무여부,요일코드,요일코드명,시간대코드,시간대코드명,성별코드,성별코드명,연령대코드,연령대코드명,입장객수"/*,작업일시"*/;
    					if(radioVal == 'TT'){
    						colVal = "COMP_ID,COMP_NM,SHOP_ID,SHOP_NM,STND_DATE,STND_YYMM,WORK_YN,DOV_CD,DOV_CD_NM,TIME_CD,TIME_NM,SEX_CD,SEX_NM,AGE_CD,AGE_NM,ENTER_CNT"/*,WORK_DT"*/;
    						titalVal = "고객사ID,고객사명,매장ID,매장명,기준일자,기준월,휴무여부,요일코드,요일코드명,시간대코드,시간대코드명,성별코드,성별코드명,연령대코드,연령대코드명,입장객수"/*,작업일시"*/;
    					}
    					var excelFormObjs = {
    						    hiddenType:[
    						        { "NAME":"SHEET_NAME", 	"VALUE": "시간별_성별_연령별수" },
    						        { "NAME":"COLS", 		"VALUE":  colVal},
    						        { "NAME":"TITLE", 		"VALUE":  titalVal},
    						        { "NAME":"SQLID", 		"VALUE": "datacls.selectListTimeCls" },
    						        { "NAME":"COMP_ID", "VALUE": parent.gvCompId },
    						        { "NAME":"SHOP_ID", "VALUE": Ext.getCmp('s_shop_id').getValue() == null ? "" : Ext.getCmp('s_shop_id').getValue() },
    						        { "NAME":"RADIO_VALUE", "VALUE": Ext.getCmp('s_radio_value').getValue().s_radio_value1 },
    						        { "NAME":"STND_DT_START", 	"VALUE": Ext.Date.format(Ext.getCmp('s_stnd_dt_start').getValue(),'Ymd') },
    						        { "NAME":"STND_DT_END", 	"VALUE": Ext.Date.format(Ext.getCmp('s_stnd_dt_end').getValue(),'Ymd') },
    						        { "NAME":"PROG_ID", 	"VALUE": "fcas_time_cls_001" },
    						        { "NAME":"SC_MAP", 		"VALUE": fnGetScMap(panel) }
    						    ]
    						};
    		    		fnDownloadExcel(excelFormObjs);
    		        }
    		    }
    		});
    	}
    });

	var btn_reset = Ext.create('Ext.button.Button', {
		id: 'btn_reset',
    	text: '초기화',
    	icon: '/images/icon/icon_reset.png',
    	handler: function(){
    		fnInitSearch(grid, panel);
    		Ext.getCmp('s_shop_id').setValue(parent.gvShopId);
    		Ext.getCmp('s_shop_nm').setValue(parent.gvShopNm);
    		Ext.getCmp('s_stnd_dt_start').setValue(fnAddMonths(new Date(), 0, 'F') );
    		Ext.getCmp('s_stnd_dt_end').setValue(fnAddMonths(new Date(), 0, 'L') );

    	}
    });

	var btn_search = Ext.create('Ext.button.Button', {
		id: 'btn_search',
    	text: '조회',
    	icon: '/images/icon/icon_search.png',
    	handler: function(){
    		if (!fnValidSearchDateOneMonth(Ext.getCmp('s_stnd_dt_start'),Ext.getCmp('s_stnd_dt_end'),'기준일')) {return;}
    		scMap = fnGetScMap(panel);
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
            text: '고객사ID',
            width: 80,
            dataIndex: 'COMP_ID'
        }, {
            text: '고객사명',
            width: 80,
            dataIndex: 'COMP_NM'
        }, {
            text: '매장ID',
            width: 80,
            dataIndex: 'SHOP_ID'
        }, {
            text: '매장명',
            width: 80,
            dataIndex: 'SHOP_NM'
        }, {
            text: '카메라그룹ID',
            width: 80,
            dataIndex: 'CMRA_GRP_ID',
            id: 'CMRA_GRP_ID'
        }, {
            text: '카메라그룹명',
            width: 80,
            dataIndex: 'CMRA_GRP_NM',
            id: 'CMRA_GRP_NM'
        }, {
            text: '집계여부',
            width: 80,
            dataIndex: 'TOTAL_YN',
            align: 'center',
            id: 'TOTAL_YN'
        }, {
            text: '기준일자',
            width: 80,
            dataIndex: 'STND_DATE',
            align: 'center'
        }, {
            text: '기준월',
            width: 80,
            dataIndex: 'STND_YYMM',
            align: 'center'
        }, {
            text: '휴무여부',
            width: 80,
            dataIndex: 'WORK_YN',
            align: 'center'
        }, {
            text: '요일코드',
            width: 80,
            dataIndex: 'DOV_CD',
            align: 'center'
        }, {
            text: '요일코드명',
            width: 80,
            dataIndex: 'DOV_CD_NM',
            align: 'center'
        }, {
            text: '시간대코드',
            width: 80,
            dataIndex: 'TIME_CD',
            align: 'center'
        }, {
            text: '시간대코드명',
            width: 80,
            dataIndex: 'TIME_NM',
            align: 'center'
        }, {
            text: '성별코드',
            width: 80,
            dataIndex: 'SEX_CD',
            align: 'center'
        }, {
            text: '성별코드명',
            width: 80,
            dataIndex: 'SEX_NM',
            align: 'center'
        }, {
            text: '연령대코드',
            width: 80,
            dataIndex: 'AGE_CD',
            align: 'center'
        }, {
            text: '연령대코드명',
            width: 80,
            dataIndex: 'AGE_NM',
            align: 'center'
        }, {
            text: '입장객수',
            width: 80,
            dataIndex: 'ENTER_CNT',
            align: 'right'
        }/*, {
            text: '작업일시',
            width: 100,
            dataIndex: 'WORK_DT'
        }*/],
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
