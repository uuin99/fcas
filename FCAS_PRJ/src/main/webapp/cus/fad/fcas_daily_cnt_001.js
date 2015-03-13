Ext.define('CODE', {
    extend: 'Ext.data.Model',
    fields: ['CD_TYPE', 'CD', 'CD_TYPE_DESC', 'CD_DESC', 'DISP_ORDR', 'UP_CD_TYPE', 'UP_CD', 'USE_YN']
});


Ext.define('DAILY_CNT', {
    extend: 'Ext.data.Model',
    idProperty: 'ROWNUM',
    fields: ['ROWNUM',
             'COMP_ID','COMP_NM','SHOP_ID','SHOP_NM','CMRA_GRP_ID','CMRA_GRP_NM','STND_DATE',
             'DOV_CD','DOV_CD_NM','STND_YYMM','ENTER_CNT','EXIT_CNT','TOTAL_CNT','STAY_CNT','WORK_DT',
             'TOTAL_YN', 'WORK_YN']
});


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
    	    		fieldStyle: 'background:rgb(235,235,235);',
    	    		padding: 0,
	    	    	margin: 1,
	    			labelAlign: 'right',
	    			labelSeparator: '',
    	    		labelWidth: 70,
        			width: 180,
        			value: parent.gvShopNm,
            		enterEventEnabled:true
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
                	id: 's_date_f',
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
                	search_cd:'STND_DATE_F;00027'
                }, {
                	xtype: 'datefield',
                	fieldLabel: '~',
                	id: 's_date_t',
                	format:'Y-m-d',
                	altFormats: 'm,d,Y|m.d.Y|Ymd',
            		enterEventEnabled:true,
                	padding: 0,
	    	    	margin: 1,
	    			labelAlign: 'right',
	    			labelSeparator: '',
                	labelWidth: 10,
                	width: 120,
                	value: fnAddMonths(new Date(), 0, 'L'),
                	search_cd:'STND_DATE_T;00028'
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
		model: 'DAILY_CNT',
		proxy: {
			type: 'ajax',
			api: {
				read: '/cus/fad/DataCnt/selectDailyCntList.do'
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
					STND_DATE_F: Ext.Date.format(Ext.getCmp('s_date_f').getValue(), 'Ymd'),
					STND_DATE_T: Ext.Date.format(Ext.getCmp('s_date_t').getValue(), 'Ymd'),
					RADIO_VALUE: Ext.getCmp('s_radio_value').getValue().s_radio_value1,
					SHOP_ID: Ext.getCmp('s_shop_id').getValue(),
					SC_MAP:scMap
                };
                store.proxy.extraParams = eParams;
			},
			load: function(store, records, success, eOpts){
				//Paging을 통한 검색은 제외한다.
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
				scMap = "";
			}
		}
	});

    var btn_excel = Ext.create('Ext.button.Button', {
    	id: 'btn_excel',
    	text: 'Excel Export',
    	icon: '/images/icon/icon_excel.png',
    	handler: function(){
    		if (!fnValidSearchDateOneMonth(Ext.getCmp('s_date_f'),Ext.getCmp('s_date_t'),'기준일')) {return;}
    		// 20130902 대용량 데이터 조회 제한 로직 추가 S
    		scMap = fnGetScMap(panel);
    		store.load({
    		    scope: this,
    		    callback: function(records, operation, success) {
    		        if (success) {
    		    		var radioVal = Ext.getCmp('s_radio_value').getValue().s_radio_value1;
    					var colVal = "COMP_ID,COMP_NM,SHOP_ID,SHOP_NM,CMRA_GRP_ID,CMRA_GRP_NM,TOTAL_YN,STND_DATE,STND_YYMM,WORK_YN,DOV_CD,DOV_CD_NM,ENTER_CNT"/*,EXIT_CNT,TOTAL_CNT,STAY_CNT,WORK_DT"*/;
    					var titalVal = "고객사ID,고객사명,매장ID,매장명,카메라그룹ID,카메라그룹명,집계여부,기준일자,기준월,휴무여부,요일코드,요일코드명,입장객수"/*,퇴장객수,전체객수,평균체류고객수,작업일시"*/;
    					if(radioVal == 'TT'){
    						colVal = "COMP_ID,COMP_NM,SHOP_ID,SHOP_NM,STND_DATE,STND_YYMM,WORK_YN,DOV_CD,DOV_CD_NM,ENTER_CNT"/*,EXIT_CNT,TOTAL_CNT,STAY_CNT,WORK_DT"*/;
    						titalVal = "고객사ID,고객사명,매장ID,매장명,기준일자,기준월,휴무여부,요일코드,요일코드명,입장객수"/*,퇴장객수,전체객수,평균체류고객수,작업일시"*/;
    					}
    		    		var excelFormObjs = {
    		    			    hiddenType:[
    		    			        { "NAME":"SHEET_NAME", 	"VALUE": "일자별 입장_체류" },
    		    			        { "NAME":"COLS", 		"VALUE":  colVal},
    		    			        { "NAME":"TITLE", 		"VALUE":  titalVal},
    		    			        { "NAME":"SQLID", 		"VALUE": "datacnt.selectDailyCntList" },
    		    			        { "NAME":"COMP_ID", "VALUE": parent.gvCompId },
    		    			        { "NAME":"SHOP_ID", "VALUE": Ext.getCmp('s_shop_id').getValue() == null ? "" : Ext.getCmp('s_shop_id').getValue() },
    		    			        { "NAME":"RADIO_VALUE", "VALUE": Ext.getCmp('s_radio_value').getValue().s_radio_value1 },
    		    			        { "NAME":"STND_DATE_F", 	"VALUE": Ext.Date.format(Ext.getCmp('s_date_f').getValue(), 'Ymd') == null ? "" : Ext.Date.format(Ext.getCmp('s_date_f').getValue(), 'Ymd') },
    		    			        { "NAME":"STND_DATE_T", 	"VALUE": Ext.Date.format(Ext.getCmp('s_date_t').getValue(), 'Ymd') == null ? "" : Ext.Date.format(Ext.getCmp('s_date_t').getValue(), 'Ymd') },
    		    			        { "NAME":"PROG_ID", 	"VALUE": "fcas_daily_cnt_001" },
    		    			        { "NAME":"SC_MAP", 		"VALUE": fnGetScMap(panel) }
    		    			    ]
    		    			};
    		    		fnDownloadExcel(excelFormObjs);
    		        }
    		    }
    		});
    		// 20130902 대용량 데이터 조회 제한 로직 추가 E
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
    		Ext.getCmp('s_date_f').setValue(fnAddMonths(new Date(), 0, 'F'));
    		Ext.getCmp('s_date_t').setValue(fnAddMonths(new Date(), 0, 'L'));
    	}
    });

	var btn_search = Ext.create('Ext.button.Button', {
		id: 'btn_search',
    	text: '조회',
    	icon: '/images/icon/icon_search.png',
    	handler: function(){
    		if (!fnValidSearchDateOneMonth(Ext.getCmp('s_date_f'),Ext.getCmp('s_date_t'),'기준일')) {return;}
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
        	text : 'No',
        	width: 40,
        	align: 'center'
        }, {
            text     : '고객사ID',
            width    : 80,
            dataIndex: 'COMP_ID'
        }, {
            text     : '고객사명',
            width    : 80,
            dataIndex: 'COMP_NM'
        }, {
            text     : '매장ID',
            width    : 80,
            dataIndex: 'SHOP_ID'
        }, {
            text     : '매장명',
            width    : 80,
            dataIndex: 'SHOP_NM'
        }, {
            text     : '카메라그룹ID',
            width    : 80,
            dataIndex: 'CMRA_GRP_ID',
            id: 'CMRA_GRP_ID'
        }, {
            text     : '카메라그룹명',
            width    : 80,
            dataIndex: 'CMRA_GRP_NM',
            id: 'CMRA_GRP_NM'
        }, {
            text     : '집계여부',
            width    : 80,
            dataIndex: 'TOTAL_YN',
            id: 'TOTAL_YN',
            align: 'center'
        }, {
            text     : '기준일자',
            width    : 80,
            dataIndex: 'STND_DATE',
            align: 'center'
        }, {
            text     : '기준월',
            width    : 80,
            dataIndex: 'STND_YYMM',
            align: 'center'
        }, {
            text     : '휴무여부',
            width    : 80,
            dataIndex: 'WORK_YN',
            align: 'center'
        }, {
            text     : '요일코드',
            width    : 80,
            dataIndex: 'DOV_CD',
            align: 'center'
        }, {
            text     : '요일코드명',
            width    : 80,
            dataIndex: 'DOV_CD_NM',
            align: 'center'
        }, {
            text     : '입장객수',
            width    : 80,
            dataIndex: 'ENTER_CNT',
            align: 'right'
        }/*, {
            text     : '퇴장객수',
            width    : 80,
            dataIndex: 'EXIT_CNT'
        }, {
            text     : '전체객수',
            width    : 80,
            dataIndex: 'TOTAL_CNT'
        }, {
            text     : '평균체류고객수',
            width    : 80,
            dataIndex: 'STAY_CNT'
        }, {
            text     : '작업일시',
            width    : 80,
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

    //Resize
    //Ext.getCmp('grid').setSize(w, h);

    //Default Value Setting


    fnIframeHeight(516);

});
