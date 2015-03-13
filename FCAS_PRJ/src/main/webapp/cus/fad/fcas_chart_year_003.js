/*var chartDivStore = Ext.create('Ext.data.JsonStore', {
    fields: ['CD', 'CD_DESC'],
    data: [
       {CD: '1', CD_DESC: '월별-입장객수'}, //Column2D
       {CD: '2', CD_DESC: '월별-성별 객층수'}, //Column2D+Line2D
       {CD: '3', CD_DESC: '월별-연령대별 객층수'}, //Line2D
       {CD: '4', CD_DESC: '월별-설치위치별 객층수'}, //Line2D
       {CD: '5', CD_DESC: '월별-평균 입장객수'}, //Column2D
       {CD: '6', CD_DESC: '월별-성별 평균 객층수'}, //Column2D+Line2D
       {CD: '7', CD_DESC: '월별-연령대별 평균 객층수'}, //Line2D
       {CD: '8', CD_DESC: '월별-설치위치별 평균 객층수'} //Line2D
   ]
});*/

var chartDivStore = Ext.create('Ext.data.JsonStore', {
    model: 'CODE',
    data: Ext.decode(chart_year)
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
			STND_YY: Ext.getCmp('s_stnd_yy').getValue(),
			SC_MAP:fnGetScMap(s_panel),
			SC_MENU_DIV:'chart_year',
			SC_MENU_CD:Ext.getCmp('combo_chart_div').getValue()
    	};

    	//차트 타이틀
    	charTitle = Ext.getCmp('combo_chart_div').getRawValue();
    	var type = Ext.getCmp('combo_chart_type').getValue();

    	if (div == '1' || div == '5') { //월별-입장객수
    		categoryField = 'STND_YYMM';
    		fields = ['ENTER_CNT'];
    		displayNames = ['입장객수'];
    		modelFields = ['STND_YYMM', 'ENTER_CNT'];
    		keyFields = ['STND_YYMM'];
    		sumFields = ['ENTER_CNT'];
    		sumAliases = ['ENTER_CNT'];
    		if (shop_id == '') {
    			Ext.apply(
    				extraParams,
    				{ SHOP_ID: shop_id }
        		);
    		}
    		if (div == '1') {
    			layoutStr = fnGetLayout(charTitle, false, type, categoryField, fields, displayNames);
    		} else {
    			layoutStr = fnGetLayout(charTitle, false, type, categoryField, fields, displayNames, '');
    		}
    	} else if (div == '2' || div == '6') { //월별-성별 입장객수
    		categoryField = 'STND_YYMM';
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
    		modelFields = ['STND_YYMM'];
    		for (var i=0; i<fields.length; i++) {
    			modelFields[i+1] = fields[i];
    		}
    		keyFields = ['STND_YYMM'];
    		caseField = 'SEX_CD';
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

    		if (div == '2') {
    			layoutStr = fnGetLayoutCombination2D(charTitle, categoryField, fields, displayNames, false, false);
    		} else {
    			layoutStr = fnGetLayoutCombination2D(charTitle, categoryField, fields, displayNames, false, false, '');
    		}
    	} else if (div == '3' || div == '7') { //월별-연령대별 입장객수
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

    		if (div == '3') {
    			layoutStr = fnGetLayout(charTitle, true, type, categoryField, fields, displayNames);
    		} else {
    			layoutStr = fnGetLayout(charTitle, true, type, categoryField, fields, displayNames, '');
    		}
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
			url: '/cus/fad/YearChart/selectYearChartCpa.do',
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
        		xtype: 'textfield',
        		id: 's_stnd_yy',
        		fieldLabel: '기준년',
        		search_cd:'STND_YY;00019',
        		width: 160,
        		maxLength: 4
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

        		chartTypeStore.clearFilter(true);

        		if (combo.getValue() == '1' || combo.getValue() == '5') { //월별-입장객수
        			chartTypeStore.filter([
                       {property: 'TYPE', value: '1'}
                    ]);
        			Ext.getCmp('combo_chart_type').setValue('Column2D');
            	} else if (combo.getValue() == '2' || combo.getValue() == '6') { //월별-성별 입장객수
            		chartTypeStore.filter([
                       {property: 'TYPE', value: '3'}
                    ]);
        			Ext.getCmp('combo_chart_type').setValue('Combination2D');
            	} else if (combo.getValue() == '3' || combo.getValue() == '7') { //월별-연령대별 입장객수
            		chartTypeStore.filter([
                       {property: 'TYPE', value: '1'}
                    ]);
        			Ext.getCmp('combo_chart_type').setValue('Line2D');
            	} else if (combo.getValue() == '4' || combo.getValue() == '8') { //월별-설치위치별 입장객수
            		chartTypeStore.filter([
                       {property: 'TYPE', value: '1'}
                    ]);
        			Ext.getCmp('combo_chart_type').setValue('Line2D');
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

		Ext.getCmp('s_stnd_yy').setValue(Ext.Date.format(now_date,'Y'));

    	Ext.getCmp('combo_chart_div').setValue('1');
    }

    document.getElementById(chartDiv).oncontextmenu = function(event){
		if (document.getElementById(chartId) != undefined) {
			var div = Ext.getCmp('combo_chart_div').getValue();
			if (div == '1' || div == '2' || div == '3' || div == '4') {
				fnSetQuickMenu('A', div);
			} else if (div == '5' || div == '6' || div == '7' || div == '8') {
				fnSetQuickMenu('B', div);
			}
		}

    	return false;
    };

    fnChartInit();

    fnIframeHeight(516);
});
