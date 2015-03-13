var now_date = new Date();

var chartLoadMask;

var store1;
var store2;

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
var chartId1 = 'chart1';
var chartDiv1 = 'chart_div1';
var chartId2 = 'chart2';
var chartDiv2 = 'chart_div2';

//스트링 형식으로 레이아웃 정의.
var layoutStr1 = '';
var layoutStr2 = '';

//차트 데이터
var chartData1 = [];
var chartData2 = [];

//rMate 차트 생성 준비가 완료된 상태 시 호출할 함수를 지정합니다.
var chartVars1 = 'rMateOnLoadCallFunction=chart1ReadyHandler';
var chartVars2 = 'rMateOnLoadCallFunction=chart2ReadyHandler';

// 차트의 속성인 rMateOnLoadCallFunction 으로 설정된 함수.
// rMate 차트 준비가 완료된 경우 이 함수가 호출됩니다.
// 이 함수를 통해 차트에 레이아웃과 데이터를 삽입합니다.
// 파라메터 : id - rMateChartH5.create() 사용 시 사용자가 지정한 id 입니다.
function chart1ReadyHandler(id) {
	document.getElementById(id).setLayout(layoutStr1);
	document.getElementById(id).setData(chartData1);
}

function chart2ReadyHandler(id) {
	document.getElementById(id).setLayout(layoutStr2);
	document.getElementById(id).setData(chartData2);
}

function displayCallFunction(){
	chartLoadMask.hide();
}

/*
//챠트에서 item클릭시 불려지는 함수 설정
//layout XML 에서 Chart 속성을 넣을때 itemClickJsFunction를 주고,만든 javascript 함수명을 넣어줍니다
//예) <Column3DChart showDataTips="true" itemClickJsFunction="chartClick">
//
//파라메터 설명
//seriesId : layout XML에서 부여한 series의 id가 있을 경우, 해당 id를 보내줍니다.
//displayText : 화면상에 보여주는 dataTip(마우스 올라갔을때 보여주는 박스-tooltip)의 내용
//index : 클릭된 item(막대나 파이조각등)의 index 번호 - 맨 왼쪽 또는 맨 위 것이 0번입니다
//data : 해당 item의 값을 표현하기 위해 입력된 data(입력된 데이타중 해당 row(레코드) 자료입니다)
//values : 해당 item의 값 (배열로 전달되며, 챠트 종류에 따라 아래와 같이 들어옵니다.)
BarSeries 0:x축값 1:y축값
ColumnSeries 0:x축값 1:y축값
AreaSeries 0:x축값 1:y축값
BubbleSeries 0:x축값 1:y축값 2:radius값
LineSeries 0:x축값 1:y축값
PieSeries 0:값
*/
function chartClickHanlder(seriesId, displayText, index, data, values){
	alert("클릭 정보 \nseriesId:"+seriesId+"\ndisplayText:"+displayText+"\nindex:"+index+"\ndata:"+data['SEX_CD']+"\nvalues:"+values[0]);
	chartLoadMask.show();
	
	var eParams;
	if (Ext.getCmp('combo_chart_div').getValue() == '1') {
		eParams = {
			COMP_ID: parent.gvCompId,
			SHOP_ID: Ext.getCmp('s_shop_id').getValue(),
			STND_DATE: Ext.Date.format(Ext.getCmp('s_stnd_date').getValue(),'Ymd'),
			SEX_CD: data['SEX_CD']
	    };
	} else if (Ext.getCmp('combo_chart_div').getValue() == '2') {
		eParams = {
			COMP_ID: parent.gvCompId,
			SHOP_ID: Ext.getCmp('s_shop_id').getValue(),
			STND_DATE: Ext.Date.format(Ext.getCmp('s_stnd_date').getValue(),'Ymd'),
			AGE_CD: data['AGE_CD']
	    };
	}
	
    store2.proxy.extraParams = eParams;
    store2.load();
}

var chartDivStore = Ext.create('Ext.data.JsonStore', {
    fields: ['CD', 'CD_DESC'],
    data: [
       //{CD: '1', CD_DESC: '성별 연령대별 입장객수(1)'},
       {CD: '1', CD_DESC: '연령대별 입장객수'},
       {CD: '2', CD_DESC: '연령대별 성별 입장객수(2)'}
   ]
});

function fnGetLayout1(title, nameField, field){
	var str = 
		'<rMateChart backgroundColor="white" cornerRadius="5" borderStyle="solid">'
			+'<Options>'
				+'<Caption text=""/>' 
				+'<SubCaption paddingTop="25" textAlign="right" fontSize="11" text="차트 아이템을 클릭하세요."/>'
			+'</Options>'
			+'<Pie3DChart showDataTips="true" itemClickJsFunction="chartClickHanlder" displayCompleteCallFunction="displayCallFunction">'
				+'<series>'
					+'<Pie3DSeries id="pie3DSeries" nameField="'+nameField+'" field="'+field+'" labelPosition="inside">'
						+'<showDataEffect><SeriesSlide direction="right" duration="1000"/></showDataEffect>'
					+'</Pie3DSeries>'
				+'</series>'
			+'</Pie3DChart>'
		+'</rMateChart>';
	
	return str;
}

function fnGetLayout2(title, categoryField, yFields, displayNames){
	var str = 
		'<rMateChart backgroundColor="white" cornerRadius="5" borderStyle="solid">'
			+'<Options>'
				+'<Caption text="'+title+'"/>'
				+'<Legend defaultMouseOverAction="false" useVisibleCheck="true"/>'
			+'</Options>'
			+'<NumberFormatter id="numfmt" useThousandsSeparator="true"/>'
			+'<Column3DChart showDataTips="true" displayCompleteCallFunction="displayCallFunction">'
				+'<horizontalAxis>'
					+'<CategoryAxis categoryField="'+categoryField+'"/>' 
				+'</horizontalAxis>'
				+'<verticalAxis><LinearAxis formatter="{numfmt}"/></verticalAxis>'
				+'<series>';
	for (var i=0; i<yFields.length; i++) {
		str +=		 '<Column3DSeries id="'+yFields[i]+'" yField="'+yFields[i]+'" displayName="'+displayNames[i]+'" labelPosition="inside" showLabelVertically="true">'
						+'<showDataEffect><SeriesInterpolate/></showDataEffect>'
					+'</Column3DSeries>';
	}
	str += 		 '</series>'
			+'</Column3DChart>'
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
    	            width: 0
    	        }]
        	}, {
        		xtype: 'combobox',
        		id: 's_cmra_grp_id',
        		fieldLabel: '카메라그룹',
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
        		xtype: 'datefield',
        		id: 's_stnd_date',
        		fieldLabel: '기준일자',
        		value: now_date,
        		width: 160
        	}, {
        		xtype: 'datefield',
        		id: 's_stnd_date2',
        		fieldLabel: '비교일자',
        		value: now_date,
        		width: 160
        	}]
    	}
    });
    
    store1 = Ext.create('Ext.data.JsonStore', {
		fields: ['SEX_CD', 'SEX_NM', 'ENTER_CNT_TT',
		         'AGE_CD', 'AGE_NM', 'ENTER_CNT_T'],
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
				fnBeforeload1(store, operation);
			},
			load: function(store, records, successful){
				fnLoad1(store, records, successful);
			}
		}
	});
    
    store2 = Ext.create('Ext.data.JsonStore', {
		fields: ['SEX_CD', 'SEX_NM', 'ENTER_CNT_00', 'ENTER_CNT_10', 'ENTER_CNT_20', 'ENTER_CNT_30', 'ENTER_CNT_40', 'ENTER_CNT_50', 'ENTER_CNT_60',
		         'AGE_CD', 'AGE_NM', 'ENTER_CNT_M', 'ENTER_CNT_F'],
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
				fnBeforeload2(store, operation);
			},
			load: function(store, records, successful){
				fnLoad2(store, records, successful);
			}
		}
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
    		
    		if (document.getElementById(chartId1) != null) {
    			document.getElementById(chartDiv1).removeChild(document.getElementById(chartId1));
    		}
    		if (document.getElementById(chartId2) != null) {
    			document.getElementById(chartDiv2).removeChild(document.getElementById(chartId2));
    		}
    		
    		if (parent.gvShopId != '') {
    	    	Ext.getCmp('s_shop_id').setValue(parent.gvShopId);
    	    	Ext.getCmp('s_shop_nm').setValue(parent.gvShopNm);
    	    }
    		Ext.getCmp('s_stnd_date').setValue(now_date);
    		
    		chartInit();
    	}
    });
	
	var btn_search = Ext.create('Ext.button.Button', {
		id: 'btn_search',
    	text: '조회',
    	icon: '/images/icon/icon_search.png',
    	handler: function(){
    		chartLoadMask.show();
    		
    		if (Ext.getCmp('combo_chart_div').getValue() == '1') {
    			store1.proxy.api.read = '/tst/cht/TestChart/selectDailyStatsClassA3.do';
    			store2.proxy.api.read = '/tst/cht/TestChart/selectDailyStatsClassA3.do';
    		} else if (Ext.getCmp('combo_chart_div').getValue() == '2') {
    			store1.proxy.api.read = '/tst/cht/TestChart/selectDailyStatsClassA1.do';
    			store2.proxy.api.read = '/tst/cht/TestChart/selectDailyStatsClassA1.do';
    		}
    		store1.load();
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
    	    {xtype: 'tbfill'},
    	    btn_reset,
    	    {xtype: 'tbspacer'},
    	    btn_search
    	]
    });
    
    function fnBeforeload1(store, operation){
    	if (document.getElementById(chartId1) != null) {
    		document.getElementById(chartDiv1).removeChild(document.getElementById(chartId1));
    	}
    	if (document.getElementById(chartId2) != null) {
    		document.getElementById(chartDiv2).removeChild(document.getElementById(chartId2));
    	}
    	
    	var eParams = {
    		COMP_ID: parent.gvCompId,
    		SHOP_ID: Ext.getCmp('s_shop_id').getValue(),
    		STND_DATE: Ext.Date.format(Ext.getCmp('s_stnd_date').getValue(),'Ymd')
        };
        store.proxy.extraParams = eParams;
    }

    function fnLoad1(store, records, successful){
    	if (records.length == 0) {
    		fnShowMessage(parent.msgProperty.COM_ERR_0016); //조회된 데이터가 없습니다.
    		chartLoadMask.hide();
    		return;
    	}
    	
    	charTitle = chartDivStore.getAt(chartDivStore.find('CD', Ext.getCmp('combo_chart_div').getValue())).get('CD_DESC');;
    	
    	var nameField, field;
    	if (Ext.getCmp('combo_chart_div').getValue() == '1') {
    		nameField = 'SEX_NM';
    		field = 'ENTER_CNT_TT';
    	} else if (Ext.getCmp('combo_chart_div').getValue() == '2') {
    		nameField = 'AGE_NM';
    		field = 'ENTER_CNT_T';
    	}
    	//스트링 형식으로 레이아웃 정의.
    	layoutStr1 = fnGetLayout1(charTitle, nameField, field);
    	
    	var tempData = '[';
    	for (var i=0; i<records.length; i++) {
    		if (i > 0) {
    			tempData += ',';
    		}
    		tempData += Ext.encode(records[i].data);
    	}
    	tempData += ']';

    	//차트 데이터
    	chartData1 = Ext.decode(tempData);
    	
    	rMateChartH5.create(chartId1, chartDiv1, chartVars1, '100%', '100%');
    }
    
    function fnBeforeload2(store, operation){
    	if (document.getElementById(chartId2) != null) {
    		document.getElementById(chartDiv2).removeChild(document.getElementById(chartId2));
    	}
    }
    
    function fnLoad2(store, records, successful){
    	if (Ext.getCmp('combo_chart_div').getValue() == '1') {
    		categoryField = 'SEX_NM';
    		fields = ['ENTER_CNT_00', 'ENTER_CNT_10', 'ENTER_CNT_20', 'ENTER_CNT_30', 'ENTER_CNT_40', 'ENTER_CNT_50', 'ENTER_CNT_60'];
    		displayNames = ['10대 이하', '10대', '20대', '30대', '40대', '50대', '60대 이상'];
    	} else if (Ext.getCmp('combo_chart_div').getValue() == '2') {
    		categoryField = 'AGE_NM';
    		fields = ['ENTER_CNT_M', 'ENTER_CNT_F'];
    		displayNames = ['남성', '여성'];
    	}
    	//스트링 형식으로 레이아웃 정의.
    	layoutStr2 = fnGetLayout2(charTitle, categoryField, fields, displayNames);
    	
    	var tempData = '[';
    	for (var i=0; i<records.length; i++) {
    		if (i > 0) {
    			tempData += ',';
    		}
    		tempData += Ext.encode(records[i].data);
    	}
    	tempData += ']';

    	//차트 데이터
    	chartData2 = Ext.decode(tempData);
    	
    	rMateChartH5.create(chartId2, chartDiv2, chartVars2, '100%', '100%');
    }
    
    function chartInit(){
    	Ext.getCmp('s_cmra_grp_id').setValue('');
    	Ext.getCmp('combo_chart_div').setValue('1');
    }
    
    chartInit();
    
    if (parent.gvShopId != '') {
    	Ext.getCmp('s_shop_id').setValue(parent.gvShopId);
    	Ext.getCmp('s_shop_nm').setValue(parent.gvShopNm);
    	Ext.getCmp('s_btn_shop').setDisabled(true);
    }
    
    fnIframeHeight(520);
});
