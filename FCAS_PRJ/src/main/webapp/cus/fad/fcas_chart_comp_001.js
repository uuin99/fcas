/*var chartDivStore = Ext.create('Ext.data.JsonStore', {
    fields: ['CD', 'CD_DESC'],
    data: [
       {CD: '1', CD_DESC: '입장객수'}, //Column2D
       //{CD: '1', CD_DESC: '입장/체류객수'}, //Column2D
       {CD: '2', CD_DESC: '성별 객층수'}, //Column2D
       {CD: '3', CD_DESC: '연령대별 객층수'}, //Column2D
       {CD: '4', CD_DESC: '시간대별 입장객수'}, //Line2D Scroll(13)
       //{CD: '5', CD_DESC: '시간대별 체류객수'}, //Line2D Scroll(13)
       {CD: '6', CD_DESC: '시간대별-성별 객층수'} //Line2D Scroll(13)
       //{CD: '7', CD_DESC: '시간대별-연령대별 객층수'} //Line2D Scroll(13)
   ]
});*/

var chartDivStore = Ext.create('Ext.data.JsonStore', {
    model: 'CODE',
    data: Ext.decode(chart_comp)
});

chartDivStore.filter([
    {property: 'USE_YN', value: 'Y'},
    {filterFn: function(item){
    	return item.get("CD") != '0000';
    }}
]);

Ext.onReady(function(){
    Ext.QuickTips.init();
    
    chartLoadMask = new Ext.LoadMask(Ext.getBody(), {msg : '차트 로딩 중...'});
    
    function fnSetStore(div){
    	var cmra_grp_id = fnSetStringToArrayObject(Ext.getCmp('s_cmra_grp_id').getValue());
    	categoryField = '',
    	fields = [],
    	displayNames = [],
		modelFields= [],
		keyFields = [],
		caseField = '',
		sumFields = [],
		sumAliases = [],
		extraParams = {
	    	COMP_ID: parent.gvCompId,
			SHOP_ID: Ext.getCmp('s_shop_id').getValue(),
			CMRA_GRP_ID: cmra_grp_id,
			STND_DATE_F1: Ext.Date.format(Ext.getCmp('s_stnd_date_f1').getValue(),'Ymd'),
			STND_DATE_T1: Ext.Date.format(Ext.getCmp('s_stnd_date_t1').getValue(),'Ymd'),
			STND_DATE_F2: Ext.Date.format(Ext.getCmp('s_stnd_date_f2').getValue(),'Ymd'),
			STND_DATE_T2: Ext.Date.format(Ext.getCmp('s_stnd_date_t2').getValue(),'Ymd'),
			SC_MAP:fnGetScMap(s_panel),
			SC_MENU_DIV:'chart_comp',
			SC_MENU_CD:Ext.getCmp('combo_chart_div').getValue()
    	};
    	
    	//차트 타이틀
    	charTitle = Ext.getCmp('combo_chart_div').getRawValue();
    	var type = Ext.getCmp('combo_chart_type').getValue();
    	
    	if (div == '1') { //입장/체류객수
    		categoryField = 'DIV_NM';
    		fields = ['ENTER_CNT'];
    		displayNames = ['입장객수'];
    		modelFields = ['DIV_NM', 'ENTER_CNT'];
    		keyFields = ['DIV_NM'];
    		sumFields = ['ENTER_CNT'];
    		sumAliases = ['ENTER_CNT'];
    		/*fields = ['ENTER_CNT', 'STAY_CNT'];
    		displayNames = ['입장객수', '체류객수'];
    		modelFields = ['DIV_NM', 'ENTER_CNT', 'STAY_CNT'];
    		keyFields = ['DIV_NM'];
    		sumFields = ['ENTER_CNT', 'STAY_CNT'];
    		sumAliases = ['ENTER_CNT', 'STAY_CNT'];*/
    		if (cmra_grp_id == '') {
    			Ext.apply(
					extraParams,
					{ CMRA_GRP_ID: 'TT' }
	    		);
    		}
    		
    		layoutStr = fnGetLayout(charTitle, true, type, categoryField, fields, displayNames);
    	} else if (div == '2') { //성별 입장객수
    		categoryField = 'DIV_NM';
    		//공통코드 - 성별
    		for (var i=0; i<sexCdStore.getCount(); i++) {
				fields[i] = sexCdStore.getAt(i).get('CD')+'_CNT';
    			displayNames[i] = sexCdStore.getAt(i).get('CD_DESC');
    			sumFields[i] = 'ENTER_CNT';
    			sumAliases[i] = sexCdStore.getAt(i).get('CD')+'_CNT';
    		}
    		modelFields = ['DIV_NM'];
    		for (var i=0; i<fields.length; i++) {
    			modelFields[i+1] = fields[i];
    		}
    		keyFields = ['DIV_NM'];
    		caseField = 'SEX_CD';
    		if (cmra_grp_id == '') {
    			Ext.apply(
					extraParams,
					{ CMRA_GRP_ID: 'TT' }
	    		);
    		}
    		Ext.apply(
				extraParams,
				{ AGE_CD: 'TT', SEX_CD: 'X' }
    		);
    		
    		layoutStr = fnGetLayout(charTitle, true, type, categoryField, fields, displayNames);
    	} else if (div == '3') { //연령대별 입장객수
    		categoryField = 'DIV_NM';
    		//공통코드 - 연령대별
    		for (var i=0; i<ageCdStore.getCount(); i++) {
				fields[i] = ageCdStore.getAt(i).get('CD')+'_CNT';
    			displayNames[i] = ageCdStore.getAt(i).get('CD_DESC');
    			sumFields[i] = 'ENTER_CNT';
    			sumAliases[i] = ageCdStore.getAt(i).get('CD')+'_CNT';
    		}
    		modelFields = ['DIV_NM'];
    		for (var i=0; i<fields.length; i++) {
    			modelFields[i+1] = fields[i];
    		}
    		keyFields = ['DIV_NM'];
    		caseField = 'AGE_CD';
    		if (cmra_grp_id == '') {
    			Ext.apply(
					extraParams,
					{ CMRA_GRP_ID: 'TT' }
	    		);
    		}
    		Ext.apply(
				extraParams,
				{ SEX_CD: 'T', AGE_CD: 'XX' }
    		);
    		
    		layoutStr = fnGetLayout(charTitle, true, type, categoryField, fields, displayNames);
    	} else if (div == '4') { //시간대별 입장객수
    		categoryField = 'TIME_NM';
    		fields = ['ENTER_CNT1', 'ENTER_CNT2'];
    		displayNames = ['기준', '비교'];
    		modelFields = ['TIME_CD', 'TIME_NM', 'ENTER_CNT1', 'ENTER_CNT2'];
    		sumFields = ['ENTER_CNT', 'ENTER_CNT'];
    		sumAliases = ['ENTER_CNT1', 'ENTER_CNT2'];
    		if (cmra_grp_id == '') {
    			Ext.apply(
					extraParams,
					{ CMRA_GRP_ID: 'TT' }
	    		);
    		}
    		
    		layoutStr = fnGetLayout(charTitle, true, type, categoryField, fields, displayNames, '13');
    	} else if (div == '5') { //시간대별 체류객수
    		categoryField = 'TIME_NM';
    		fields = ['STAY_CNT1', 'STAY_CNT2'];
    		displayNames = ['기준', '비교'];
    		modelFields = ['TIME_CD', 'TIME_NM', 'STAY_CNT1', 'STAY_CNT2'];
    		sumFields = ['STAY_CNT', 'STAY_CNT'];
    		sumAliases = ['STAY_CNT1', 'STAY_CNT2'];
    		if (cmra_grp_id == '') {
    			Ext.apply(
					extraParams,
					{ CMRA_GRP_ID: 'TT' }
	    		);
    		}
    		
    		layoutStr = fnGetLayout(charTitle, true, type, categoryField, fields, displayNames, '13');
    	} else if (div == '6') { //시간대별-성별 입장객수
    		categoryField = 'TIME_NM';
    		//공통코드 - 성별
    		for (var i=0; i<sexCdStore.getCount(); i++) {
				fields[i] = 'CNT_A_'+sexCdStore.getAt(i).get('CD');
    			displayNames[i] = '기준-'+sexCdStore.getAt(i).get('CD_DESC');
    			sumFields[i] = 'ENTER_CNT';
    			sumAliases[i] = 'CNT_A_'+sexCdStore.getAt(i).get('CD');
    		}
    		var cnt = fields.length;
    		for (var i=cnt; i<sexCdStore.getCount()+cnt; i++) {
				fields[i] = 'CNT_B_'+sexCdStore.getAt(i-cnt).get('CD');
    			displayNames[i] = '비교-'+sexCdStore.getAt(i-cnt).get('CD_DESC');
    			sumFields[i] = 'ENTER_CNT';
    			sumAliases[i] = 'CNT_B_'+sexCdStore.getAt(i-cnt).get('CD');
    		}
    		modelFields = ['TIME_CD', 'TIME_NM'];
    		for (var i=0; i<fields.length; i++) {
    			modelFields[i+2] = fields[i];
    		}
    		caseField = 'SEX_CD';
    		if (cmra_grp_id == '') {
    			Ext.apply(
					extraParams,
					{ CMRA_GRP_ID: 'TT' }
	    		);
    		}
    		Ext.apply(
				extraParams,
				{ AGE_CD: 'TT', SEX_CD: 'X' }
    		);
    		
    		layoutStr = fnGetLayout(charTitle, true, type, categoryField, fields, displayNames, '13');
    	}  else if (div == '7') { //시간대별-연령대별 입장객수
    		categoryField = 'TIME_NM';
    		//공통코드 - 연령대별
    		for (var i=0; i<ageCdStore.getCount(); i++) {
				fields[i] = 'CNT_A_'+ageCdStore.getAt(i).get('CD');
    			displayNames[i] = '기준-'+ageCdStore.getAt(i).get('CD_DESC');
    			sumFields[i] = 'ENTER_CNT';
    			sumAliases[i] = 'CNT_A_'+ageCdStore.getAt(i).get('CD');
    		}
    		var cnt = fields.length;
    		for (var i=cnt; i<ageCdStore.getCount()+cnt; i++) {
				fields[i] = 'CNT_B_'+ageCdStore.getAt(i-cnt).get('CD');
    			displayNames[i] = '비교-'+ageCdStore.getAt(i-cnt).get('CD_DESC');
    			sumFields[i] = 'ENTER_CNT';
    			sumAliases[i] = 'CNT_B_'+ageCdStore.getAt(i-cnt).get('CD');
    		}
    		modelFields = ['TIME_CD', 'TIME_NM'];
    		for (var i=0; i<fields.length; i++) {
    			modelFields[i+2] = fields[i];
    		}
    		caseField = 'AGE_CD';
    		if (cmra_grp_id == '') {
    			Ext.apply(
					extraParams,
					{ CMRA_GRP_ID: 'TT' }
	    		);
    		}
    		Ext.apply(
				extraParams,
				{ SEX_CD: 'T', AGE_CD: 'XX' }
    		);
    		
    		layoutStr = fnGetLayout(charTitle, true, type, categoryField, fields, displayNames, '13');
    	}
    	
    	Ext.apply(
			extraParams,
			{
				DIV: div,
				KEY_FIELDS: fnSetStringToArrayObject(keyFields),
				CASE_FIELD: caseField,
				SUM_FIELDS: fnSetStringToArrayObject(sumFields),
				SUM_ALIASES: fnSetStringToArrayObject(sumAliases)
			}
		);
    	
    	store.model.setFields(modelFields);
    	store.proxy.extraParams = extraParams;
    	store.load();
    }
    
    store = Ext.create('Ext.data.JsonStore', {
    	model: 'CHART',
		proxy: {
			type: 'ajax',
			url: '/cus/fad/CompChart/selectCompChart.do',
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
				fnRemoveChild(chartId, chartDiv);
			},
			load: function(store, records, successful){
				//차트 데이터
				chartData = fnGetChartData(records);
				
				//차트 생성
				rMateChartH5.create(chartId, chartDiv, chartVars, '840', '100%');
			}
		}
	});
    
    var s_panel = Ext.create('Ext.panel.Panel', {
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
        	    columns: 2
        	},
            items: [{
        		xtype: 'panel',
        		border:0,
        		padding: 0,
	    		margin: 0,
	    		bodyStyle:'background-color:transparent',
	    		width:285,
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
        			width: 225
            	}, {
        			xtype: 'button',
        			text: '찾기',
        			id: 's_btn_shop',
        			icon: '/images/icon/icon_popup_search02.png',
        			margin: 1,
        			width: 50,
        	    	handler: function(){
        	    		fnOpenShopFindForm('s_shop_id', 's_shop_nm', parent.gvCompId);
        	    	}
        		}, {
    	            xtype: 'hidden',
    	            id: 's_shop_id',
    	            width: 0,
    	            search_cd:'SHOP_ID;00015',
    	            width: 0,
    	            listeners: {
    	            	change: function(){
    	            		cmraGrpStore.proxy.extraParams = {
	    	    				start: '',
	    	    				COMP_ID: parent.gvCompId,
	    	    				SHOP_ID: Ext.getCmp('s_shop_id').getValue()
	    	    			};
	    	    			cmraGrpStore.load({
	    	    				callback: function(){
	    	    					Ext.getCmp('s_cmra_grp_id').setValue([]);
	    	    				}
	    	    			});
    	            	}
    	            }
    	        }]
        	}, {
        		xtype: 'combobox',
        		id: 's_cmra_grp_id',
        		fieldLabel: '설치위치',
                store: cmraGrpStore,
                valueField: 'CMRA_GRP_ID',
                displayField: 'CMRA_GRP_NM',
                queryMode: 'local',
                multiSelect: true,
                search_cd:'CMRA_GRP_ID;00016',
                labelWidth: 127,
        		width: 347,
                listConfig: {
                    getInnerTpl: function() {
                    	return '<div class="x-combo-list-item"><img src="/js/extjs-4.1.0/resources/themes/images/s.gif" class="chkCombo-default-icon chkCombo"/>{CMRA_GRP_NM}</div>';
                    }
                }
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
            		id: 's_stnd_date_f1',
            		fieldLabel: '기준',
            		search_cd:'STND_DATE_F1;00022',
        			margin: 1,                	
                	labelWidth: 80,
                	width: 180
            	}, {
            		xtype: 'datefield',
            		id: 's_stnd_date_t1',
            		fieldLabel: '~',
            		search_cd:'STND_DATE_T1;00023',
            		labelWidth: 20,
            		width: 120
            	}]
        	}, {
        		xtype: 'panel',
        		border:0,
        		padding: 0,
	    		margin: 0,
	    		bodyStyle:'background-color:transparent',
	    		width:350,
        		layout: {
        			type:'hbox',
        			aligh:'stretch'
        		},
        		items: [{
            		xtype: 'datefield',
            		id: 's_stnd_date_f2',
            		fieldLabel: '비교',
            		search_cd:'STND_DATE_F2;00024',
            		labelWidth: 127,
        			width: 220
            	}, {
            		xtype: 'datefield',
            		id: 's_stnd_date_t2',
            		fieldLabel: '~',
            		search_cd:'STND_DATE_T2;00025',
            		labelWidth: 20,
            		width: 120
            	}]
        	}
            ]
        }
    }); 
    
    var combo_chart_div = Ext.create('Ext.form.field.ComboBox', {
		id: 'combo_chart_div',
		labelWidth: 60,
		fieldLabel: '차트 구분',
        store: chartDivStore,
        valueField: 'CD',
        displayField: 'CD_DESC',
        queryMode: 'local',
        editable: false,
        width: 280,
        listeners: {
        	change: function(combo){
        		fnRemoveChild(chartId, chartDiv);
        		
        		chartTypeStore.clearFilter(true);
        		
        		if (combo.getValue() == '1') { //입장/체류객수
        			chartTypeStore.filter([
                       {property: 'TYPE', value: '1'}
                    ]);
        			Ext.getCmp('combo_chart_type').setValue('Column2D');
            	} else if (combo.getValue() == '2') { //성별 입장객수
            		chartTypeStore.filter([
                       {property: 'TYPE', value: '1'}
                    ]);
        			Ext.getCmp('combo_chart_type').setValue('Column2D');
            	} else if (combo.getValue() == '3') { //연령대별 입장객수
            		chartTypeStore.filter([
                       {property: 'TYPE', value: '1'}
                    ]);
        			Ext.getCmp('combo_chart_type').setValue('Column2D');
            	} else if (combo.getValue() == '4') { //시간대별 입장객수
            		chartTypeStore.filter([
                       {property: 'TYPE', value: '2'}
                    ]);
        			Ext.getCmp('combo_chart_type').setValue('Line2D_S');
            	} else if (combo.getValue() == '5') { //시간대별 체류객수
            		chartTypeStore.filter([
                       {property: 'TYPE', value: '2'}
                    ]);
        			Ext.getCmp('combo_chart_type').setValue('Line2D_S');
            	} else if (combo.getValue() == '6') { //시간대별-성별 입장객수
            		chartTypeStore.filter([
                       {property: 'TYPE', value: '2'}
                    ]);
        			Ext.getCmp('combo_chart_type').setValue('Line2D_S');
            	} else if (combo.getValue() == '7') { //시간대별-연령대별 입장객수
            		chartTypeStore.filter([
                       {property: 'TYPE', value: '2'}
                    ]);
        			Ext.getCmp('combo_chart_type').setValue('Line2D_S');
            	}
        	}
        }
    });
    
    var combo_chart_type = Ext.create('Ext.form.field.ComboBox', {
		id: 'combo_chart_type',
		labelWidth: 60,
		fieldLabel: '차트 종류',
        store: chartTypeStore,
        valueField: 'CD',
        displayField: 'CD_DESC',
        queryMode: 'local',
        editable: false,
        width: 260
    });
    
    var btn_reset = Ext.create('Ext.button.Button', {
		id: 'btn_reset',
    	text: '초기화',
    	icon: '/images/icon/icon_reset.png',
    	handler: function(){
    		fnChartInit();
    	}
    });
	
	var btn_search = Ext.create('Ext.button.Button', {
		id: 'btn_search',
    	text: '조회',
    	icon: '/images/icon/icon_search.png',
    	handler: function(){
    		//chartLoadMask.show();
    		
    		fnSetStore(Ext.getCmp('combo_chart_div').getValue());
    	}
	});
    
    var b_panel = Ext.create('Ext.panel.Panel', {
    	id: 'b_panel',
    	renderTo: 'button_div',
    	frame: true,
    	layout: {
    	    type: 'hbox',
    	    align: 'stretch'
    	},
    	items: [
    	    combo_chart_div,
    	    {xtype: 'tbspacer'},
    	    combo_chart_type,
    	    {xtype: 'tbfill'},
    	    btn_reset,
    	    {xtype: 'tbspacer'},
    	    btn_search
    	]
    });
    
    function fnChartInit(){
    	Ext.getCmp('s_shop_nm').setValue(parent.gvShopNm);
		Ext.getCmp('s_shop_id').setValue(parent.gvShopId);
    	// 권한 타입이 매장일 경우에는 찾기 버튼 삭제한다.
    	if (parent.gvAuthType == 'C') {
    		Ext.getCmp('s_btn_shop').setVisible(false);
    	} else {
    		Ext.getCmp('s_btn_shop').setVisible(true);
    	}
    	
    	Ext.getCmp('s_cmra_grp_id').setValue([]);
    	
    	Ext.getCmp('s_stnd_date_f1').setValue(Ext.Date.getFirstDateOfMonth(Ext.Date.add(now_date, Ext.Date.MONTH, -1)));
		Ext.getCmp('s_stnd_date_t1').setValue(Ext.Date.add(now_date, Ext.Date.MONTH, -1));
    	
		Ext.getCmp('s_stnd_date_f2').setValue(Ext.Date.getFirstDateOfMonth(now_date));
		Ext.getCmp('s_stnd_date_t2').setValue(now_date);
		
    	Ext.getCmp('combo_chart_div').setValue('1');
    }
    
    document.getElementById(chartDiv).oncontextmenu = function(event){
		if (document.getElementById(chartId) != undefined) {
			var div = Ext.getCmp('combo_chart_div').getValue();
			if (div == '1' || div == '2' || div == '3') {
				fnSetQuickMenu('A', div);
			} else if (div == '4' || div == '6') {
				fnSetQuickMenu('B', div);
			}
		}
		
    	return false;
    };
    
    function fnSetQuickMenu(type, div){
    	if (Ext.getCmp('menu_'+type) != undefined) {
    		Ext.getCmp('menu_'+type).destroy();
    	}
    	
    	Ext.create('Ext.menu.Menu', {
        	id: 'menu_A',
    	    items: [{
    	        text: '입장객수',
    	        icon: '/images/icon/icon_chart.png',
    	        hidden: div == '1' ? true : false,
    	        handler: function(){
    	        	Ext.getCmp('combo_chart_div').setValue('1');
    	        	fnSetStore(Ext.getCmp('combo_chart_div').getValue());
    	        }
    	    }, {
    	        text: '성별 객층수',
    	        icon: '/images/icon/icon_chart.png',
    	        hidden: div == '2' ? true : false,
    	        handler: function(){
    	        	Ext.getCmp('combo_chart_div').setValue('2');
    	        	fnSetStore(Ext.getCmp('combo_chart_div').getValue());
    	        }
    	    }, {
    	        text: '연령대별 객층수',
    	        icon: '/images/icon/icon_chart.png',
    	        hidden: div == '3' ? true : false,
    	        handler: function(){
    	        	Ext.getCmp('combo_chart_div').setValue('3');
    	        	fnSetStore(Ext.getCmp('combo_chart_div').getValue());
    	        }
    	    }]
    	});
    	
    	Ext.create('Ext.menu.Menu', {
        	id: 'menu_B',
    	    items: [{
    	        text: '시간대별 입장객수',
    	        icon: '/images/icon/icon_chart.png',
    	        hidden: div == '4' ? true : false,
    	        handler: function(){
    	        	Ext.getCmp('combo_chart_div').setValue('4');
    	        	fnSetStore(Ext.getCmp('combo_chart_div').getValue());
    	        }
    	    }, {
    	        text: '시간대별-성별 객층수',
    	        icon: '/images/icon/icon_chart.png',
    	        hidden: div == '6' ? true : false,
    	        handler: function(){
    	        	Ext.getCmp('combo_chart_div').setValue('6');
    	        	fnSetStore(Ext.getCmp('combo_chart_div').getValue());
    	        }
    	    }]
    	});
    	
    	var menu = Ext.getCmp('menu_'+type);
		if (menu != undefined) {
			if (Ext.isChrome) { //Chrome
				menu.showAt(event.x, event.y);
			} else if (Ext.ieVersion == 0) { //Firefox
				menu.showAt(event.clientX, event.clientY);
			} else { //IE
				menu.showAt(event.x+31, event.y+186);
			}
		}
    }
    
    fnChartInit();
    
    fnIframeHeight(516);
});
