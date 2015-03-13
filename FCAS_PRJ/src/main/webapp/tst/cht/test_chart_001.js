var now_date = new Date();

var chartLoadMask;

Ext.define('EQIP_GRP', {
    extend: 'Ext.data.Model',
    fields: ['CMRA_GRP_ID','CMRA_GRP_NM']
});

var cmraGrpStore = Ext.create('Ext.data.JsonStore', {
    autoLoad: true,
	model: 'EQIP_GRP',
	proxy: {
		type: 'ajax',
		api: {
			read: '/mng/svc/EqipGrpMngt/selectEqipGrpList.do'
		},
		reader: {
			type: 'json',
			root: 'data',
			totalProperty: 'total',
			successProperty: 'success',
			messageProperty: 'message'
		}
	},
	listeners: {
		beforeload: function(store, operation){                
			var eParams = {
				start: '',
				COMP_ID: parent.gvCompId,
				SHOP_ID: parent.gvShopId
            };
            store.proxy.extraParams = eParams;
		}
	}
});

var charTitle;
var chartId = 'chart1';
var chartDiv = 'chart_div';

//스트링 형식으로 레이아웃 정의.
var layoutStr = '';

//차트 데이터
var chartData = [];

//rMate 차트 생성 준비가 완료된 상태 시 호출할 함수를 지정합니다.
var chartVars = 'rMateOnLoadCallFunction=chartReadyHandler';

// 차트의 속성인 rMateOnLoadCallFunction 으로 설정된 함수.
// rMate 차트 준비가 완료된 경우 이 함수가 호출됩니다.
// 이 함수를 통해 차트에 레이아웃과 데이터를 삽입합니다.
// 파라메터 : id - rMateChartH5.create() 사용 시 사용자가 지정한 id 입니다.
function chartReadyHandler(id) {
	document.getElementById(id).setLayout(layoutStr);
	document.getElementById(id).setData(chartData);
}

function displayCallFunction(){
	chartLoadMask.hide();
}

var chartTypeStore = Ext.create('Ext.data.JsonStore', {
    fields: ['CD', 'CD_DESC'],
    data: [
       {CD: 'Line2D', CD_DESC: 'Line2D'},
       {CD: 'Column2D', CD_DESC: 'Column2D'},
       {CD: 'Column3D', CD_DESC: 'Column3D'},
       {CD: 'Area2D', CD_DESC: 'Area2D'},
       {CD: 'Bar2D', CD_DESC: 'Bar2D'}
   ]
});

var chartDivStore = Ext.create('Ext.data.JsonStore', {
    fields: ['CD', 'CD_DESC'],
    data: [
       {CD: '2', CD_DESC: '시간대별 객수(1)'},
       {CD: '1', CD_DESC: '일별 객수(2)'},
       {CD: '3', CD_DESC: '요일별 객수(3)'},
       //{CD: '6', CD_DESC: '시간대별 성별 입장객수(4)'},
       {CD: '8', CD_DESC: '시간대별 성별 입장객수(4)'},
       {CD: '7', CD_DESC: '시간대별 연령대별 입장객수(5)'},
       {CD: '5', CD_DESC: '요일별 연령대별 입장객수(6)'},
       {CD: '4', CD_DESC: '연령대별 성별 입장객수(7)'}
   ]
});

function fnGetLayout(title, legendFlag, type, categoryField, fields, displayNames, scrollFlag, visibleItemSize){
	var form = 'segment';
	var itemRenderer = '';
	if (type == 'Area2D') {
		form = 'curve';
	}
	var categoryAxis = 'CategoryAxis';
	if (scrollFlag) {
		categoryAxis = 'CategoryLinearAxis';
	}
	
	var layout = "<rMateChart backgroundColor='white' cornerRadius='5' borderStyle='solid'>"
		+ "<Options>"
		+ "<Caption text='" + title +"'/>";
	if (legendFlag) {
		layout += "<Legend defaultMouseOverAction='false' useVisibleCheck='true'/>";
	}
	layout += "</Options>"
		+ "<NumberFormatter id='numfmt' useThousandsSeparator='true'/>"
		+ "<" + type + "Chart showDataTips='true' selectionMode='single' displayCompleteCallFunction='displayCallFunction'>";
	if (type == "Bar2D") {
		layout += "<verticalAxis>"
			+ "<"+categoryAxis+" id='vAxis' categoryField='" + categoryField + "'/>"
			+ "</verticalAxis>";
		if (scrollFlag) {
			layout += "<verticalAxisRenderers>"
				+ "<ScrollableAxisRenderer axis='{vAxis}' visibleItemSize='" + visibleItemSize + "' scrollSensitivity='1'/>"
				+"</verticalAxisRenderers>";
		}
		layout += "<horizontalAxis><LinearAxis formatter='{numfmt}'/></horizontalAxis>";
	} else {
		layout += "<horizontalAxis>"
			+ "<"+categoryAxis+" id='hAxis' categoryField='" + categoryField + "'/>"
			+ "</horizontalAxis>";
		if (scrollFlag) {
			layout += "<horizontalAxisRenderers>"
				+ "<ScrollableAxisRenderer axis='{hAxis}' visibleItemSize='" + visibleItemSize + "' scrollSensitivity='1'/>"
				+"</horizontalAxisRenderers>";
		}
		layout += "<verticalAxis><LinearAxis formatter='{numfmt}'/></verticalAxis>";
	} 
	layout += "<series>";
	for (var i=0; i<fields.length; i++) {
		if (type == "Bar2D") {
			layout += "<" + type +"Series id='" + fields[i] + "' form='" + form + "' labelPosition='inside' labelAlign='right' xField='" + fields[i] + "' displayName='" + displayNames[i] + "'>"
			+ "<showDataEffect><SeriesInterpolate direction='right'/></showDataEffect>"
			+ "</" + type +"Series>";
		} else {
			layout += "<" + type +"Series id='" + fields[i] + "' form='" + form + "' labelPosition='inside' showLabelVertically='true' yField='" + fields[i] + "' displayName='" + displayNames[i] + "'>"
				+ "<showDataEffect><SeriesInterpolate/></showDataEffect>"
				+ "</" + type +"Series>";
		}
	}
	layout += "</series>"
		+ "</" + type + "Chart>"
		+ "</rMateChart>";
	
	return layout;
}

function fnGetLayoutStacked(title){
	var str = 
		'<rMateChart backgroundColor="0xFFFFFF" cornerRadius="12" borderStyle="solid">'
			+'<Options>'
				+'<Caption text="'+title+'"/>'
			+'</Options>'
			+'<Column2DChart showDataTips="true" displayCompleteCallFunction="displayCallFunction">'
				+'<horizontalAxis>'
					+'<CategoryAxis categoryField="TIME_NM"/>' 
				+'</horizontalAxis>'
				+'<series>'
					+'<Column2DSet type="stacked" showTotalLabel="true" totalLabelJsFunction="totalFunc">'    
						+'<series>'
							+'<Column2DSeries labelPosition="inside" yField="ENTER_CNT_M" displayName="남성">'
								+'<showDataEffect><SeriesInterpolate/></showDataEffect>'
							+'</Column2DSeries>'
							+'<Column2DSeries labelPosition="inside" yField="ENTER_CNT_F" displayName="여성">'
								+'<showDataEffect><SeriesInterpolate/></showDataEffect>'
							+'</Column2DSeries>'
						+'</series>'
					+'</Column2DSet>'
				+'</series>'
			+'</Column2DChart>'
		+'</rMateChart>';
	
	return str;
}

Ext.onReady(function(){
    Ext.QuickTips.init();
    
    chartLoadMask = new Ext.LoadMask(Ext.getBody(), {msg : '차트 로딩 중...'});
    
    var s_panel = Ext.create('Ext.panel.Panel', {
    	id: 's_panel',
    	renderTo: 'search_div',
    	bodyPadding: 0,
    	border: 0,
    	items: {
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
    	            width: 0
    	        }]
        	}, {
        		xtype: 'combobox',
        		id: 's_cmra_grp_id',
        		fieldLabel: '카메라그룹',
        		margin: 0,
                padding: 0,
                store: cmraGrpStore,
                valueField: 'CMRA_GRP_ID',
                displayField: 'CMRA_GRP_NM',
                queryMode: 'remote',
                multiSelect: true,
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
	    		bodyStyle: 'background-color:transparent',
	    		width: 300,
	    		defaults: {
	    			labelWidth: 60,
	    			width: 160
	            },
        		layout: {
        			type: 'hbox',
        			aligh: 'stretch'
        		},
        		items: [{
                	xtype: 'datefield',
                	fieldLabel: '기간',
                	id: 's_stnd_date_f',
	    	    	margin: 1,
            		value: Ext.Date.getFirstDateOfMonth(now_date)
                }, {
                	xtype: 'datefield',
                	fieldLabel: '~',
                	id: 's_stnd_date_t',
	    	    	margin: 1,	
                	labelWidth: 10,
                	width: 110,
                	value: now_date
                }]
        	}]
    	}
    });
    
    var store = Ext.create('Ext.data.JsonStore', {
		fields: ['STND_DATE', 'ENTER_CNT', 'EXIT_CNT',
		         'TIME_CD', 'TIME_NM', 'ENTER_CNT', 'EXIT_CNT',
		         'DOV_CD', 'DOV_NM', 'ENTER_CNT', 'EXIT_CNT',
		         'AGE_CD', 'AGE_NM', 'ENTER_CNT_T', 'ENTER_CNT_M', 'ENTER_CNT_F',
		         'AGE_CD', 'AGE_NM', 'ENTER_CNT_1', 'ENTER_CNT_2', 'ENTER_CNT_3', 'ENTER_CNT_4', 'ENTER_CNT_5', 'ENTER_CNT_6', 'ENTER_CNT_7',
		         'TIME_CD', 'TIME_NM', 'ENTER_CNT_T', 'ENTER_CNT_M', 'ENTER_CNT_F',
		         'TIME_CD', 'TIME_NM', 'ENTER_CNT_TT', 'ENTER_CNT_00', 'ENTER_CNT_10', 'ENTER_CNT_20', 'ENTER_CNT_30', 'ENTER_CNT_40', 'ENTER_CNT_50', 'ENTER_CNT_60'],
		proxy: {
			type: 'ajax',
			api: {
				read: ''
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
				fnBeforeload(store, operation);
			},
			load: function(store, records, successful){
				fnLoad(store, records, successful);
			}
		}
	});
    
    var combo_chart_type = Ext.create('Ext.form.field.ComboBox', {
		id: 'combo_chart_type',
		labelAlign: 'right',
		labelSeparator: '',
		labelWidth: 60,
		fieldLabel: '차트 종류',
        store: chartTypeStore,
        valueField: 'CD',
        displayField: 'CD_DESC',
        queryMode: 'local',
        width: 160
    });
    
    var combo_scroll_flag = Ext.create('Ext.form.field.ComboBox', {
		id: 'combo_scroll_flag',
		labelAlign: 'right',
		labelSeparator: '',
		labelWidth: 80,
		fieldLabel: '스크롤 여부',
        store: ynCode,
        valueField: 'CD',
        displayField: 'CD_DESC',
        queryMode: 'local',
        width: 160
    });
    
    var combo_chart_div = Ext.create('Ext.form.field.ComboBox', {
		id: 'combo_chart_div',
		labelAlign: 'right',
		labelSeparator: '',
		labelWidth: 60,
		fieldLabel: '차트 구분',
        store: chartDivStore,
        valueField: 'CD',
        displayField: 'CD_DESC',
        queryMode: 'local',
        width: 260
    });
    
    var btn_reset = Ext.create('Ext.button.Button', {
		id: 'btn_reset',
    	text: '초기화',
    	icon: '/images/icon/icon_reset.png',
    	handler: function(){
    		var p = s_panel.items.items[0].items.items;
			if (p != undefined || p != null) {
				for (var i=0; i<p.length; i++) {
					if (p[i].getXType() == 'combobox' ||
						p[i].getXType() == 'textfield' ||
						p[i].getXType() == 'datefield') {
							p[i].setValue('');
					} else if (p[i].getXType() == 'panel') {
						var q = p[i].items.items;
						for (var j=0; j<q.length; j++) {
							if (q[j].getXType() == 'combobox' ||
								q[j].getXType() == 'textfield' ||
								q[j].getXType() == 'datefield') {
									q[j].setValue('');
							}
						}
					}
				}
				p[0].focus();
			}
    		
    		if (document.getElementById(chartId) != null) {
    			document.getElementById(chartDiv).removeChild(document.getElementById(chartId));
    		}
    		
    		if (parent.gvShopId != '') {
    	    	Ext.getCmp('s_shop_id').setValue(parent.gvShopId);
    	    	Ext.getCmp('s_shop_nm').setValue(parent.gvShopNm);
    	    }
    		Ext.getCmp('s_stnd_date_f').setValue(Ext.Date.getFirstDateOfMonth(now_date));
    		Ext.getCmp('s_stnd_date_t').setValue(now_date);
    		
    		chartInit();
    	}
    });
	
	var btn_search = Ext.create('Ext.button.Button', {
		id: 'btn_search',
    	text: '조회',
    	icon: '/images/icon/icon_search.png',
    	handler: function(){
    		chartLoadMask.show();
    		
    		if (combo_chart_div.getValue() == '1') {
    			store.proxy.api.read = '/tst/cht/TestChart/selectDailyStatsCnt.do';
    		} else if (combo_chart_div.getValue() == '2') {
    			store.proxy.api.read = '/tst/cht/TestChart/selectTimesStatsCnt.do';
    		} else if (combo_chart_div.getValue() == '3') {
    			store.proxy.api.read = '/tst/cht/TestChart/selectDailyStatsCntDov.do';
    		} else if (combo_chart_div.getValue() == '4') {
    			store.proxy.api.read = '/tst/cht/TestChart/selectDailyStatsClassA1.do';
    		} else if (combo_chart_div.getValue() == '5') {
    			store.proxy.api.read = '/tst/cht/TestChart/selectDailyStatsClassA2.do';
    		} else if (combo_chart_div.getValue() == '6') {
    			store.proxy.api.read = '/tst/cht/TestChart/selectTimesStatsClassA1.do';
    		} else if (combo_chart_div.getValue() == '7') {
    			store.proxy.api.read = '/tst/cht/TestChart/selectTimesStatsClassA2.do';
    		} else if (combo_chart_div.getValue() == '8') {
    			store.proxy.api.read = '/tst/cht/TestChart/selectTimesStatsClassA1.do';
    		}
    		store.load();
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
    	    combo_chart_type,
    	    combo_scroll_flag,
    	    combo_chart_div,
    	    {xtype: 'tbfill'},
    	    btn_reset,
    	    {xtype: 'tbspacer'},
    	    btn_search
    	]
    });
    
    function fnBeforeload(store, operation){
    	if (document.getElementById(chartId) != null) {
    		document.getElementById(chartDiv).removeChild(document.getElementById(chartId));
    	}
    	
    	var eParams = {
    		COMP_ID: parent.gvCompId,
    		SHOP_ID: Ext.getCmp('s_shop_id').getValue(),
    		STND_DATE_F: Ext.Date.format(Ext.getCmp('s_stnd_date_f').getValue(),'Ymd'),
    		STND_DATE_T: Ext.Date.format(Ext.getCmp('s_stnd_date_t').getValue(),'Ymd')
        };
        store.proxy.extraParams = eParams;
    }

    function fnLoad(store, records, successful){
    	if (records.length == 0) {
    		fnShowMessage(parent.msgProperty.COM_ERR_0016); //조회된 데이터가 없습니다.
    		chartLoadMask.hide();
    		return;
    	}
    	
    	charTitle = chartDivStore.getAt(chartDivStore.find('CD', combo_chart_div.getValue())).get('CD_DESC');;
    	var chart_type = combo_chart_type.getValue();
    	var scroll_flag = combo_scroll_flag.getValue() == 'Y';
    	
    	var categoryField, fields, displayNames;
    	if (combo_chart_div.getValue() == '1') {
    		categoryField = 'STND_DATE';
    		fields = ['ENTER_CNT', 'EXIT_CNT'];
    		displayNames = ['입장객수', '퇴장객수'];
    	} else if (combo_chart_div.getValue() == '2') {
    		categoryField = 'TIME_NM';
    		fields = ['ENTER_CNT', 'EXIT_CNT'];
    		displayNames = ['입장객수', '퇴장객수'];
    	} else if (combo_chart_div.getValue() == '3') {
    		categoryField = 'DOV_NM';
    		fields = ['ENTER_CNT', 'EXIT_CNT'];
    		displayNames = ['입장객수', '퇴장객수'];
    	} else if (combo_chart_div.getValue() == '4') {
    		categoryField = 'AGE_NM';
    		fields = ['ENTER_CNT_T', 'ENTER_CNT_M', 'ENTER_CNT_F'];
    		displayNames = ['전체', '남성', '여성'];
    	} else if (combo_chart_div.getValue() == '5') {
    		categoryField = 'AGE_NM';
    		fields = ['ENTER_CNT_1', 'ENTER_CNT_2', 'ENTER_CNT_3', 'ENTER_CNT_4', 'ENTER_CNT_5', 'ENTER_CNT_6', 'ENTER_CNT_7'];
    		displayNames = ['일', '월', '화', '수', '목', '금', '토'];
    	} else if (combo_chart_div.getValue() == '6') {
    		categoryField = 'TIME_NM';
    		fields = ['ENTER_CNT_M', 'ENTER_CNT_F'];
    		displayNames = ['남성', '여성'];
    	} else if (combo_chart_div.getValue() == '7') {
    		categoryField = 'TIME_NM';
    		fields = ['ENTER_CNT_00', 'ENTER_CNT_10', 'ENTER_CNT_20', 'ENTER_CNT_30', 'ENTER_CNT_40', 'ENTER_CNT_50', 'ENTER_CNT_60'];
    		displayNames = ['10대 이하', '10대', '20대', '30대', '40대', '50대', '60대 이상'];
    	} else if (combo_chart_div.getValue() == '8') {
    		categoryField = 'TIME_NM';
    		fields = ['ENTER_CNT_M', 'ENTER_CNT_F'];
    		displayNames = ['남성', '여성'];
    	}
    	//스트링 형식으로 레이아웃 정의.
    	if (combo_chart_div.getValue() != '8') {
    		layoutStr = fnGetLayout(charTitle, true, chart_type, categoryField, fields, displayNames, scroll_flag, 5);
    	} else {
    		layoutStr = fnGetLayoutStacked(charTitle);
    	}
    	
    	var tempData = '[';
    	for (var i=0; i<records.length; i++) {
    		if (i > 0) {
    			tempData += ',';
    		}
    		tempData += Ext.encode(records[i].data);
    	}
    	tempData += ']';

    	//차트 데이터
    	chartData = Ext.decode(tempData);
    	
    	rMateChartH5.create(chartId, chartDiv, chartVars, '100%', '100%');
    }
    
    function chartInit(){
    	Ext.getCmp('s_cmra_grp_id').setValue('');
    	Ext.getCmp('combo_chart_type').setValue('Column3D');
		Ext.getCmp('combo_scroll_flag').setValue('N');
		Ext.getCmp('combo_chart_div').setValue('2');
    }
    
    chartInit();
    
    if (parent.gvShopId != '') {
    	Ext.getCmp('s_shop_id').setValue(parent.gvShopId);
    	Ext.getCmp('s_shop_nm').setValue(parent.gvShopNm);
    	Ext.getCmp('s_btn_shop').setDisabled(true);
    }
    
    fnIframeHeight(520);
});
