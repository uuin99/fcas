var chartDivStore = Ext.create('Ext.data.JsonStore', {
    fields: ['CD', 'CD_DESC'],
    data: [
       {CD: '1', CD_DESC: '일별-입장객수'}, //Column2D Scroll(10)
       {CD: '2', CD_DESC: '일별-성별 입장객수'}, //Column2D+Line2D Scroll(10)
       {CD: '3', CD_DESC: '일별-연령대별 입장객수'}, //Line2D Scroll(10)
       {CD: '4', CD_DESC: '월별-입장객수'}, //Column2D+Line2D Scroll(10)
       {CD: '5', CD_DESC: '월별-성별 입장객수'}, //Line2D Scroll(10)
       {CD: '6', CD_DESC: '월별-연령대별 입장객수'} //Pie2D, Column2D
   ]
});

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
		extraParams1 = {
	    	COMP_ID: parent.gvCompId,
			SHOP_ID: Ext.getCmp('s_shop_id').getValue(),
			CMRA_GRP_ID: cmra_grp_id,
			STND_DATE: Ext.getCmp('s_stnd_date1').isVisible() ? Ext.Date.format(Ext.getCmp('s_stnd_date1').getValue(),'Ymd') : '',
			STND_YYMM: Ext.getCmp('s_stnd_yymm1').isVisible() ? Ext.Date.format(Ext.getCmp('s_stnd_yymm1').getValue(),'Ym') : ''
    	},
		extraParams2 = {
	    	COMP_ID: parent.gvCompId,
			SHOP_ID: Ext.getCmp('s_shop_id').getValue(),
			CMRA_GRP_ID: cmra_grp_id,
			STND_DATE: Ext.getCmp('s_stnd_date2').isVisible() ? Ext.Date.format(Ext.getCmp('s_stnd_date2').getValue(),'Ymd') : '',
			STND_YYMM: Ext.getCmp('s_stnd_yymm2').isVisible() ? Ext.Date.format(Ext.getCmp('s_stnd_yymm2').getValue(),'Ym') : ''
    	};
    	
    	//차트 타이틀
    	charTitle = Ext.getCmp('combo_chart_div').getRawValue();
    	var type = Ext.getCmp('combo_chart_type').getValue();
    	
    	if (div == '1') { //일별-입장객수
    		categoryField = 'STND_DATE';
    		fields = ['ENTER_CNT'];
    		displayNames = ['입장객수'];
    		modelFields = ['STND_DATE', 'ENTER_CNT'];
    		keyFields = ['STND_DATE'];
    		sumFields = ['ENTER_CNT'];
    		sumAliases = ['ENTER_CNT'];
    		if (cmra_grp_id == '') {
    			Ext.apply(
					extraParams1,
					{ CMRA_GRP_ID: 'TT' }
	    		);
    		}
    		if (cmra_grp_id == '') {
    			Ext.apply(
					extraParams2,
					{ CMRA_GRP_ID: 'TT' }
	    		);
    		}
    		
    		layoutStr  = fnGetLayout(charTitle, false, type, categoryField, fields, displayNames);
    		layoutStr2 = fnGetLayout(charTitle, false, type, categoryField, fields, displayNames);
    	} else if (div == '2') { //일별-성별 입장객수
    		categoryField = 'STND_DATE';
    		//공통코드 - 성별
    		for (var i=0; i<sexCdStore.getCount(); i++) {
				fields[i] = sexCdStore.getAt(i).get('CD')+'_CNT';
    			displayNames[i] = sexCdStore.getAt(i).get('CD_DESC');
    			sumFields[i] = 'ENTER_CNT';
    			sumAliases[i] = sexCdStore.getAt(i).get('CD')+'_CNT';
    		}
    		modelFields = ['STND_DATE'];
    		for (var i=0; i<fields.length; i++) {
    			modelFields[i+1] = fields[i];
    		}
    		keyFields = ['STND_DATE'];
    		caseField = 'SEX_CD';
    		if (cmra_grp_id == '') {
    			Ext.apply(
					extraParams1,
					{ CMRA_GRP_ID: 'TT' }
	    		);
    		}
    		Ext.apply(
				extraParams1,
				{ AGE_CD: 'TT', SEX_CD: 'X' }
    		);
    		if (cmra_grp_id == '') {
    			Ext.apply(
					extraParams2,
					{ CMRA_GRP_ID: 'TT' }
	    		);
    		}
    		Ext.apply(
				extraParams2,
				{ AGE_CD: 'TT', SEX_CD: 'X' }
    		);
    		
    		layoutStr  = fnGetLayout(charTitle, true, type, categoryField, fields, displayNames);
    		layoutStr2 = fnGetLayout(charTitle, true, type, categoryField, fields, displayNames);
    	} else if (div == '3') { //일별-연령대별 입장객수
    		categoryField = 'STND_DATE';
    		//공통코드 - 연령대별
    		for (var i=0; i<ageCdStore.getCount(); i++) {
				fields[i] = ageCdStore.getAt(i).get('CD')+'_CNT';
    			displayNames[i] = ageCdStore.getAt(i).get('CD_DESC');
    			sumFields[i] = 'ENTER_CNT';
    			sumAliases[i] = ageCdStore.getAt(i).get('CD')+'_CNT';
    		}
    		modelFields = ['STND_DATE'];
    		for (var i=0; i<fields.length; i++) {
    			modelFields[i+1] = fields[i];
    		}
    		keyFields = ['STND_DATE'];
    		caseField = 'AGE_CD';
    		if (cmra_grp_id == '') {
    			Ext.apply(
					extraParams1,
					{ CMRA_GRP_ID: 'TT' }
	    		);
    		}
    		Ext.apply(
				extraParams1,
				{ SEX_CD: 'T', AGE_CD: 'XX' }
    		);
    		if (cmra_grp_id == '') {
    			Ext.apply(
					extraParams2,
					{ CMRA_GRP_ID: 'TT' }
	    		);
    		}
    		Ext.apply(
				extraParams2,
				{ SEX_CD: 'T', AGE_CD: 'XX' }
    		);
    		
    		layoutStr  = fnGetLayout(charTitle, true, type, categoryField, fields, displayNames);
    		layoutStr2 = fnGetLayout(charTitle, true, type, categoryField, fields, displayNames);
    	} else if (div == '4') { //월별-입장객수
    		categoryField = 'STND_YYMM';
    		fields = ['ENTER_CNT'];
    		displayNames = ['입장객수'];
    		modelFields = ['STND_YYMM', 'ENTER_CNT'];
    		keyFields = ['STND_YYMM'];
    		sumFields = ['ENTER_CNT'];
    		sumAliases = ['ENTER_CNT'];
    		if (cmra_grp_id == '') {
    			Ext.apply(
					extraParams1,
					{ CMRA_GRP_ID: 'TT' }
	    		);
    		}
    		if (cmra_grp_id == '') {
    			Ext.apply(
					extraParams2,
					{ CMRA_GRP_ID: 'TT' }
	    		);
    		}
    		
    		layoutStr  = fnGetLayout(charTitle, false, type, categoryField, fields, displayNames);
    		layoutStr2 = fnGetLayout(charTitle, false, type, categoryField, fields, displayNames);
    	} else if (div == '5') { //월별-성별 입장객수
    		categoryField = 'STND_YYMM';
    		//공통코드 - 성별
    		for (var i=0; i<sexCdStore.getCount(); i++) {
				fields[i] = sexCdStore.getAt(i).get('CD')+'_CNT';
    			displayNames[i] = sexCdStore.getAt(i).get('CD_DESC');
    			sumFields[i] = 'ENTER_CNT';
    			sumAliases[i] = sexCdStore.getAt(i).get('CD')+'_CNT';
    		}
    		modelFields = ['STND_YYMM'];
    		for (var i=0; i<fields.length; i++) {
    			modelFields[i+1] = fields[i];
    		}
    		keyFields = ['STND_YYMM'];
    		caseField = 'SEX_CD';
    		if (cmra_grp_id == '') {
    			Ext.apply(
					extraParams1,
					{ CMRA_GRP_ID: 'TT' }
	    		);
    		}
    		Ext.apply(
				extraParams1,
				{ AGE_CD: 'TT', SEX_CD: 'X' }
    		);
    		if (cmra_grp_id == '') {
    			Ext.apply(
					extraParams2,
					{ CMRA_GRP_ID: 'TT' }
	    		);
    		}
    		Ext.apply(
				extraParams2,
				{ AGE_CD: 'TT', SEX_CD: 'X' }
    		);
    		
    		layoutStr  = fnGetLayout(charTitle, true, type, categoryField, fields, displayNames);
    		layoutStr2 = fnGetLayout(charTitle, true, type, categoryField, fields, displayNames);
    	} else if (div == '6') { //월별-연령대별 입장객수
    		categoryField = 'STND_YYMM';
    		//공통코드 - 연령대별
    		for (var i=0; i<ageCdStore.getCount(); i++) {
				fields[i] = ageCdStore.getAt(i).get('CD')+'_CNT';
    			displayNames[i] = ageCdStore.getAt(i).get('CD_DESC');
    			sumFields[i] = 'ENTER_CNT';
    			sumAliases[i] = ageCdStore.getAt(i).get('CD')+'_CNT';
    		}
    		modelFields = ['STND_YYMM'];
    		for (var i=0; i<fields.length; i++) {
    			modelFields[i+1] = fields[i];
    		}
    		keyFields = ['STND_YYMM'];
    		caseField = 'AGE_CD';
    		if (cmra_grp_id == '') {
    			Ext.apply(
					extraParams1,
					{ CMRA_GRP_ID: 'TT' }
	    		);
    		}
    		Ext.apply(
				extraParams1,
				{ SEX_CD: 'T', AGE_CD: 'XX' }
    		);
    		if (cmra_grp_id == '') {
    			Ext.apply(
					extraParams2,
					{ CMRA_GRP_ID: 'TT' }
	    		);
    		}
    		Ext.apply(
				extraParams2,
				{ SEX_CD: 'T', AGE_CD: 'XX' }
    		);
    		
    		layoutStr  = fnGetLayout(charTitle, true, type, categoryField, fields, displayNames);
    		layoutStr2 = fnGetLayout(charTitle, true, type, categoryField, fields, displayNames);
    	}
    	
    	Ext.apply(
			extraParams1,
			{
				DIV: div,
				KEY_FIELDS: fnSetStringToArrayObject(keyFields),
				CASE_FIELD: caseField,
				SUM_FIELDS: fnSetStringToArrayObject(sumFields),
				SUM_ALIASES: fnSetStringToArrayObject(sumAliases)
			}
		);
    	
    	store.model.setFields(modelFields);
    	store.proxy.extraParams = extraParams1;
    	store.load();
    	
    	Ext.apply(
			extraParams2,
			{
				DIV: div,
				KEY_FIELDS: fnSetStringToArrayObject(keyFields),
				CASE_FIELD: caseField,
				SUM_FIELDS: fnSetStringToArrayObject(sumFields),
				SUM_ALIASES: fnSetStringToArrayObject(sumAliases)
			}
		);
    	
    	store2.model.setFields(modelFields);
    	store2.proxy.extraParams = extraParams2;
    }
    
    store = Ext.create('Ext.data.JsonStore', {
    	model: 'CHART',
		proxy: {
			type: 'ajax',
			url: '/cus/fad/CondChart/selectCondChart.do',
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
				fnRemoveChild(chartId1, chartDiv1);
			},
			load: function(store, records, successful){
				//차트 데이터
				chartData = fnGetChartData(records);
				
				//차트 생성
				rMateChartH5.create(chartId1, chartDiv1, chartVars, '427', '100%');
				
				store2.load();
			}
		}
	});
    
    store2 = Ext.create('Ext.data.JsonStore', {
    	model: 'CHART',
		proxy: {
			type: 'ajax',
			url: '/cus/fad/CondChart/selectCondChart.do',
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
				fnRemoveChild(chartId2, chartDiv2);
			},
			load: function(store, records, successful){
				//차트 데이터
				chartData2 = fnGetChartData(records);
				
				//차트 생성
				rMateChartH5.create(chartId2, chartDiv2, chartVars2, '427', '100%');
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
	    		bodyStyle: 'background-color:transparent',
	    		width: 265,
	    		defaults: {
	    			labelWidth: 60,
	    			width: 210
	            },
        		layout: {
        			type: 'hbox',
        			aligh: 'stretch'
        		},
        		items: [{
            		xtype: 'textfield',
            		id: 's_shop_nm',
            		fieldLabel: '매장',
        			readOnly: true,
        			margin: 1
            	}, {
        			xtype: 'button',
        			id: 's_btn_shop',
        			text: '찾기',
        			icon: '/images/icon/icon_popup_search02.png',
        			width: 50,
        			margin: 1,
        	    	handler: function(){
        	    		fnOpenShopFindForm('s_shop_id', 's_shop_nm', parent.gvCompId);
        	    	}
        		}, {
    	            xtype: 'hidden',
    	            id: 's_shop_id',
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
                width: 210,
                listConfig: {
                    getInnerTpl: function() {
                    	return '<div class="x-combo-list-item"><img src="/js/extjs-4.1.0/resources/themes/images/s.gif" class="chkCombo-default-icon chkCombo"/>{CMRA_GRP_NM}</div>';
                    }
                }
        	}, {
        		xtype: 'datefield',
        		id: 's_stnd_date1',
        		fieldLabel: '기준일',
        		width: 160
        	}, {
        		xtype: 'datefield',
        		id: 's_stnd_date2',
        		fieldLabel: '비교일',
        		width: 160
        	}, {
        		xtype: 'monthfield',
        		id: 's_stnd_yymm1',
        		fieldLabel: '기준월',
        		width: 160,
        		format: 'Y-m',
        		visible: false
        	}, {
        		xtype: 'monthfield',
        		id: 's_stnd_yymm2',
        		fieldLabel: '비교월',
        		width: 160,
        		format: 'Y-m',
        		visible: false
        	}]
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
        		fnRemoveChild(chartId1, chartDiv1);
            	fnRemoveChild(chartId2, chartDiv2);
            	
        		//chartTypeStore.clearFilter(true);
        		
        		Ext.getCmp('s_stnd_date1').setValue(Ext.Date.add(now_date, Ext.Date.DAY, -1));
        		Ext.getCmp('s_stnd_date2').setValue(now_date);
            	
        		Ext.getCmp('s_stnd_yymm1').setValue(Ext.Date.add(now_date, Ext.Date.MONTH, -1));
        		Ext.getCmp('s_stnd_yymm2').setValue(now_date);
        		
        		if (combo.getRawValue().indexOf('일별') > -1) {
        			Ext.getCmp('s_stnd_date1').setVisible(true);
        			Ext.getCmp('s_stnd_date2').setVisible(true);
        			
        			Ext.getCmp('s_stnd_yymm1').setVisible(false);
        			Ext.getCmp('s_stnd_yymm2').setVisible(false);
        		} else {
        			Ext.getCmp('s_stnd_date1').setVisible(false);
        			Ext.getCmp('s_stnd_date2').setVisible(false);
        			
        			Ext.getCmp('s_stnd_yymm1').setVisible(true);
        			Ext.getCmp('s_stnd_yymm2').setVisible(true);
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
    	
    	Ext.getCmp('s_stnd_date1').setValue(Ext.Date.add(now_date, Ext.Date.DAY, -1));
		Ext.getCmp('s_stnd_date2').setValue(now_date);
    	
		Ext.getCmp('s_stnd_yymm1').setValue(Ext.Date.add(now_date, Ext.Date.MONTH, -1));
		Ext.getCmp('s_stnd_yymm2').setValue(now_date);
		
		Ext.getCmp('s_stnd_date1').setVisible(true);
		Ext.getCmp('s_stnd_date2').setVisible(true);
		
		Ext.getCmp('s_stnd_yymm1').setVisible(false);
		Ext.getCmp('s_stnd_yymm2').setVisible(false);
		
    	Ext.getCmp('combo_chart_div').setValue('1');
    }
    
    fnChartInit();
    
    fnIframeHeight(516);
});
