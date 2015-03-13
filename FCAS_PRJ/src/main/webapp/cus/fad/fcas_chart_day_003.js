/*var chartDivStore = Ext.create('Ext.data.JsonStore', {
    fields: ['CD', 'CD_DESC'],
    data: [
       {CD: '1', CD_DESC: '시간대별-입장객수'}, //Column2D Scroll(13)
       {CD: '2', CD_DESC: '시간대별-성별 객층수'}, //Column2D+Line2D Scroll(13)
       {CD: '3', CD_DESC: '시간대별-연령대별 객층수'}, //Line2D Scroll(13)
       //{CD: '4', CD_DESC: '시간대별-체류고객수'}, //Column2D+Line2D Scroll(13)
       //{CD: '5', CD_DESC: '시간대별-설치위치별 입장객수'}, //Line2D Scroll(13)
       {CD: '6', CD_DESC: '성별-연령대별 객층수 (2차트)'}, //Pie2D, Column2D
       {CD: '7', CD_DESC: '연령대별-성별 객층수 (2차트)'}, //Pie2D, Column2D
       //{CD: '8', CD_DESC: '설치위치별-성별 객층수'}, //Column2D Scroll(10)
       //{CD: '9', CD_DESC: '설치위치별-연령대별 객층수'} //Column2D Scroll(10)
   ]
});*/
/* 20131129 고객사 계정 추가 개발 : 카메라 그룹 대신에 고객사 합계를 볼 수 있도록 설치위치별~ 은 전부 삭제*/

var chartDivStore = Ext.create('Ext.data.JsonStore', {
    model: 'CODE',
    data: Ext.decode(chart_day)
});


chartDivStore.filter([
    {property: 'USE_YN', value: 'Y'},
    {filterFn: function(item){
    	return item.get("CD") != '0000';
    }}
]);

function chartClickHanlder(seriesId, displayText, index, data, values){
	// 매장 아이디 오브젝트를 스트링 변환 후 저장
	var shop_id = fnSetStringToArrayObject(Ext.getCmp('s_shop_grp_id').getValue());
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
		SHOP_ID: shop_id,
		STND_DATE: Ext.Date.format(Ext.getCmp('s_stnd_date').getValue(),'Ymd')
	};

	if (Ext.getCmp('combo_chart_div').getValue() == '6') { //성별-연령대별 입장객수 (2차트)
		categoryField = 'SEX_NM';
		//공통코드 - 연령대별
		for (var i=0; i<ageCdStore.getCount(); i++) {
			fields[i] = ageCdStore.getAt(i).get('CD')+'_CNT';
			displayNames[i] = ageCdStore.getAt(i).get('CD_DESC');
			sumFields[i] = 'ENTER_CNT';
			sumAliases[i] = ageCdStore.getAt(i).get('CD')+'_CNT';
		}
		modelFields = ['SEX_CD', 'SEX_NM'];
		for (var i=0; i<fields.length; i++) {
			modelFields[i+2] = fields[i];
		}
		keyFields = ['SEX_CD'];
		caseField = 'AGE_CD';
		if (shop_id == '') {
			Ext.apply(
				extraParams,
				{ SHOP_ID: shop_id }
    		);
		}
		Ext.apply(
			extraParams,
			{ SEX_CD: data['SEX_CD'], AGE_CD: 'XX' }
		);
	} else if (Ext.getCmp('combo_chart_div').getValue() == '7') { //연령대별-성별 입장객수 (2차트)
		categoryField = 'AGE_NM';
		//공통코드 - 성별
		for (var i=0; i<sexCdStore.getCount(); i++) {
			fields[i] = sexCdStore.getAt(i).get('CD')+'_CNT';
			displayNames[i] = sexCdStore.getAt(i).get('CD_DESC');
			sumFields[i] = 'ENTER_CNT';
			sumAliases[i] = sexCdStore.getAt(i).get('CD')+'_CNT';
		}
		modelFields = ['AGE_CD', 'AGE_NM'];
		for (var i=0; i<fields.length; i++) {
			modelFields[i+2] = fields[i];
		}
		keyFields = ['AGE_CD'];
		caseField = 'SEX_CD';
		if (shop_id == '') {
			Ext.apply(
				extraParams,
				{ SHOP_ID: shop_id }
    		);
		}
		Ext.apply(
			extraParams,
			{ AGE_CD: data['AGE_CD'], SEX_CD: 'X' }
		);
	}

	//차트 타이틀
	charTitle = Ext.getCmp('combo_chart_div').getRawValue();

	//차트 레이아웃
	layoutStr2 = fnGetLayout2(charTitle, categoryField, fields, displayNames);

	Ext.apply(
		extraParams,
		{
			DIV: Ext.getCmp('combo_chart_div').getValue(),
			KEY_FIELDS: fnSetStringToArrayObject(keyFields),
			CASE_FIELD: caseField,
			SUM_FIELDS: fnSetStringToArrayObject(sumFields),
			SUM_ALIASES: fnSetStringToArrayObject(sumAliases)
		}
	);

	store2.model.setFields(modelFields);
	store2.proxy.extraParams = extraParams;
	store2.load();
}

Ext.onReady(function(){
    Ext.QuickTips.init();

    chartLoadMask = new Ext.LoadMask(Ext.getBody(), {msg : '차트 로딩 중...'});

    function fnSetStore(div){
    	var shop_id = fnSetStringToArrayObject(Ext.getCmp('s_shop_grp_id').getValue());
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
			SHOP_ID: shop_id,
			STND_DATE: Ext.Date.format(Ext.getCmp('s_stnd_date').getValue(),'Ymd'),
			SC_MAP:fnGetScMap(s_panel),
			SC_MENU_DIV:'chart_day',
			SC_MENU_CD:Ext.getCmp('combo_chart_div').getValue()
    	};

    	//차트 타이틀
    	charTitle = Ext.getCmp('combo_chart_div').getRawValue();
    	var type = Ext.getCmp('combo_chart_type').getValue();

    	if (div == '1') { //시간대별-입장객수
    		categoryField = 'TIME_NM';
    		fields = ['ENTER_CNT'];
    		displayNames = ['입장객수'];
    		modelFields = ['TIME_CD', 'TIME_NM', 'ENTER_CNT'];
    		keyFields = ['TIME_CD'];
    		sumFields = ['ENTER_CNT'];
    		sumAliases = ['ENTER_CNT'];
    		if (shop_id == '') {
    			Ext.apply(
					extraParams,
					{ SHOP_ID: shop_id }
	    		);
    		}

    		layoutStr = fnGetLayout(charTitle, false, type, categoryField, fields, displayNames, '13');
    	} else if (div == '2') { //시간대별-성별 입장객수
    		categoryField = 'TIME_NM';
    		//공통코드 - 성별
    		fields[0] = 'SUM_CNT';
    		displayNames[0] = '합계';
    		sumFields[0] = 'ENTER_CNT';
			sumAliases[0] = 'SUM_CNT';
    		for (var i=0; i<sexCdStore.getCount(); i++) {
				fields[i+1] = sexCdStore.getAt(i).get('CD')+'_CNT';
    			displayNames[i+1] = sexCdStore.getAt(i).get('CD_DESC');
    			sumFields[i+1] = 'ENTER_CNT';
    			sumAliases[i+1] = sexCdStore.getAt(i).get('CD')+'_CNT';
    		}
    		modelFields = ['TIME_CD', 'TIME_NM'];
    		for (var i=0; i<fields.length; i++) {
    			modelFields[i+2] = fields[i];
    		}
    		keyFields = ['TIME_CD'];
    		caseField = 'SEX_CD';
    		if (shop_id == '') {
    			Ext.apply(
					extraParams,
					{ SHOP_ID: shop_id }
	    		);
    		}
    		Ext.apply(
				extraParams,
				{ AGE_CD: 'TT', SEX_CD: 'X' }
    		);

    		layoutStr = fnGetLayoutCombination2D(charTitle, categoryField, fields, displayNames, false, true, '13');
    	} else if (div == '3') { //시간대별-연령대별 입장객수
    		categoryField = 'TIME_NM';
    		//공통코드 - 연령대별
    		for (var i=0; i<ageCdStore.getCount(); i++) {
				fields[i] = ageCdStore.getAt(i).get('CD')+'_CNT';
    			displayNames[i] = ageCdStore.getAt(i).get('CD_DESC');
    			sumFields[i] = 'ENTER_CNT';
    			sumAliases[i] = ageCdStore.getAt(i).get('CD')+'_CNT';
    		}
    		modelFields = ['TIME_CD', 'TIME_NM'];
    		for (var i=0; i<fields.length; i++) {
    			modelFields[i+2] = fields[i];
    		}
    		keyFields = ['TIME_CD'];
    		caseField = 'AGE_CD';
    		if (shop_id == '') {
    			Ext.apply(
					extraParams,
					{ SHOP_ID: shop_id }
	    		);
    		}
    		Ext.apply(
				extraParams,
				{ SEX_CD: 'T', AGE_CD: 'XX' }
    		);

    		layoutStr = fnGetLayout(charTitle, true, type, categoryField, fields, displayNames, '13');
    	} else if (div == '4') { //시간대별-체류고객수
    		categoryField = 'TIME_NM';
    		fields = ['ENTER_CNT', 'STAY_CNT'];
    		displayNames = ['입장고객수', '체류고객수'];
    		modelFields = ['TIME_CD', 'TIME_NM', 'ENTER_CNT', 'STAY_CNT'];
    		keyFields = ['TIME_CD'];
    		sumFields = ['ENTER_CNT', 'STAY_CNT'];
    		sumAliases = ['ENTER_CNT', 'STAY_CNT'];
    		if (shop_id == '') {
    			Ext.apply(
					extraParams,
					{ SHOP_ID: shop_id }
	    		);
    		}

    		layoutStr = fnGetLayoutCombination2D(charTitle, categoryField, fields, displayNames, false, true, '13');
    	} else if (div == '6') { //성별-연령대별 입장객수 (2차트)
    		categoryField = 'SEX_NM';
    		fields = ['ENTER_CNT'];
			sumFields = ['ENTER_CNT'];
			sumAliases = ['ENTER_CNT'];
    		modelFields = ['SEX_CD', 'SEX_NM', 'ENTER_CNT'];
    		keyFields = ['SEX_CD'];
    		if (shop_id == '') {
    			Ext.apply(
					extraParams,
					{ SHOP_ID: shop_id }
	    		);
    		}
    		Ext.apply(
				extraParams,
				{ SEX_CD: 'X', AGE_CD: 'TT' }
    		);

    		layoutStr = fnGetLayout1(charTitle, categoryField, fields[0]);
    	} else if (div == '7') { //연령대별-성별 입장객수 (2차트)
    		categoryField = 'AGE_NM';
    		fields = ['ENTER_CNT'];
			sumFields = ['ENTER_CNT'];
			sumAliases = ['ENTER_CNT'];
    		modelFields = ['AGE_CD', 'AGE_NM', 'ENTER_CNT'];
    		keyFields = ['AGE_CD'];
    		if (shop_id == '') {
    			Ext.apply(
					extraParams,
					{ SHOP_ID: shop_id }
	    		);
    		}
    		Ext.apply(
				extraParams,
				{ AGE_CD: 'XX', SEX_CD: 'T' }
    		);

    		layoutStr = fnGetLayout1(charTitle, categoryField, fields[0]);

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
			url: '/cus/fad/DayChart/selectDayChartCpa.do',
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
				fnBeforeload(store, operation);
			},
			load: function(store, records, successful){
				fnLoad(store, records, successful);
			}
		}
	});

    store2 = Ext.create('Ext.data.JsonStore', {
    	model: 'CHART',
		proxy: {
			type: 'ajax',
			url: '/cus/fad/DayChart/selectDayChartCpa.do',
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
				fnBeforeload2(store, operation);
			},
			load: function(store, records, successful){
				fnLoad2(store, records, successful);
			}
		}
	});
    // 검색판넬
    s_panel = Ext.create('Ext.panel.Panel', {
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
            			id: 's_comp_nm',
            			fieldLabel: '고객사',
            			readOnly: true,
            			margin: 1
            		}, {
            			xtype: 'button',
            			id: 's_btn_comp',
            			text: '찾기',
            			icon: '/images/icon/icon_popup_search02.png',
            			width: 50,
            			margin: 1,
            			handler: function(){
            				fnOpenCompFindForm('s_comp_id', 's_comp_nm');
            			}
            		}, {
	    	            xtype: 'hidden',
	    	            id: 's_comp_id',
	    	            width: 0,
	    	            listeners: {
	    	            	change: function(){
	    	            		shopGrpStore.proxy.extraParams = {
	    	            			start: '',
		    	    				COMP_ID: Ext.getCmp('s_comp_id').getValue()
		    	    			};
	    	            		shopGrpStore.load({
		    	    				callback: function(){
		    	    					Ext.getCmp('s_shop_grp_id').setValue([]);
		    	    				}
		    	    			});
	    	            	}
	    	            }
	    	        }]
        	}, {
        		xtype: 'combobox',
        		id: 's_shop_grp_id',
        		fieldLabel: '매장선택',
                store: shopGrpStore,
                valueField: 'SHOP_ID',
                displayField: 'SHOP_NM',
                queryMode: 'local',
                multiSelect: true,
                width: 260,
                search_cd:'SHOP_ID;00015',
                listConfig: {
                    getInnerTpl: function() {
                    	return '<div class="x-combo-list-item"><img src="/js/extjs-4.1.0/resources/themes/images/s.gif" class="chkCombo-default-icon chkCombo"/>{SHOP_NM}</div>';
                    }
                }
        	}, {
        		xtype: 'datefield',
        		id: 's_stnd_date',
        		fieldLabel: '기준일',
        		search_cd:'STND_DATE;00017',
        		width: 160
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
        		fnRemoveChild(chartId, chartDiv);
            	fnRemoveChild(chartId1, chartDiv1);
            	fnRemoveChild(chartId2, chartDiv2);

        		fnSetDivDisplay('1Chart');
        		chartTypeStore.clearFilter(true);

        		if (combo.getValue() == '1') { //시간대별-입장객수
        			chartTypeStore.filter([
                       {property: 'TYPE', value: '2'}
                    ]);
        			Ext.getCmp('combo_chart_type').setValue('Column2D_S');
            	} else if (combo.getValue() == '2') { //시간대별-성별 입장객수
            		chartTypeStore.filter([
                       {property: 'TYPE', value: '3'}
                    ]);
        			Ext.getCmp('combo_chart_type').setValue('Combination2D');
            	} else if (combo.getValue() == '3') { //시간대별-연령대별 입장객수
            		chartTypeStore.filter([
                       {property: 'TYPE', value: '2'}
                    ]);
        			Ext.getCmp('combo_chart_type').setValue('Line2D_S');
            	} else if (combo.getValue() == '4') { //시간대별-체류고객수
            		chartTypeStore.filter([
                       {property: 'TYPE', value: '3'}
                    ]);
        			Ext.getCmp('combo_chart_type').setValue('Combination2D');
            	} else if (combo.getValue() == '6') { //성별-연령대별 입장객수 (2차트)
            		fnSetDivDisplay('2Chart');
        			chartTypeStore.filter([
        			    {property: 'TYPE', value: '4'}
        			]);
        			Ext.getCmp('combo_chart_type').setValue('2Chart');
            	} else if (combo.getValue() == '7') { //연령대별-성별 입장객수 (2차트)
            		fnSetDivDisplay('2Chart');
        			chartTypeStore.filter([
        			    {property: 'TYPE', value: '4'}
        			]);
        			Ext.getCmp('combo_chart_type').setValue('2Chart');
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
    	Ext.getCmp('s_comp_nm').setValue(parent.gvCompNm);
    	Ext.getCmp('s_comp_id').setValue(parent.gvCompId);
    	// 권한 타입이 고객사일 경우에는 찾기 버튼 삭제한다.
    	if (parent.gvAuthType == 'B') {
    		Ext.getCmp('s_btn_comp').setVisible(false);
    	} else {
    		Ext.getCmp('s_btn_comp').setVisible(true);
    	}
    	Ext.getCmp('s_shop_grp_id').setValue([]);
		Ext.getCmp('s_stnd_date').setValue(now_date);
    	Ext.getCmp('combo_chart_div').setValue('1');
    }

    document.getElementById(chartDiv).oncontextmenu = function(event){
		if (document.getElementById(chartId) != undefined) {
			var div = Ext.getCmp('combo_chart_div').getValue();
			if (div == '1' || div == '2' || div == '3' || div == '5') {
				fnSetQuickMenu('A', div);
			} else if (div == '6' || div == '7') {
				fnSetQuickMenu('B', div);
			} else if (div == '8' || div == '9') {
				fnSetQuickMenu('C', div);
			}
		}

    	return false;
    };

    document.getElementById(chartDiv1).oncontextmenu = function(event){
		if (document.getElementById(chartId1) != undefined) {
			var div = Ext.getCmp('combo_chart_div').getValue();
			if (div == '1' || div == '2' || div == '3' || div == '5') {
				fnSetQuickMenu('A', div);
			} else if (div == '6' || div == '7') {
				fnSetQuickMenu('B', div);
			} else if (div == '8' || div == '9') {
				fnSetQuickMenu('C', div);
			}
		}

    	return false;
    };

    fnChartInit();

    fnIframeHeight(516);
});
