var now_date = Ext.Date.add(new Date(), Ext.Date.DAY, -1);

var chartLoadMask;

var store;
var store2;

Ext.define('EQIP_GRP', {
    extend: 'Ext.data.Model',
    fields: ['CMRA_GRP_ID','CMRA_GRP_NM']
});

//20131213추가 (매장집계)
Ext.define('SHOP_GRP', {
    extend: 'Ext.data.Model',
    fields: ['SHOP_ID', 'SHOP_NM']
});

Ext.define('CODE', {
    extend: 'Ext.data.Model',
    fields: ['CD_TYPE', 'CD', 'CD_TYPE_DESC', 'CD_DESC', 'DISP_ORDR', 'UP_CD_TYPE', 'UP_CD', 'USE_YN']
});

var cmraGrpStore = Ext.create('Ext.data.JsonStore', {
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
	}
});

//20131213추가 (매장집계)
var shopGrpStore = Ext.create('Ext.data.JsonStore', {
	model: 'SHOP_GRP',
	proxy: {
		type: 'ajax',
		api: {
			read: '/mng/svc/ShopMngt/selectShopList.do'
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
	}
});

var sexCdStore = Ext.create('Ext.data.JsonStore', {
    model: 'CODE',
    data: Ext.decode(sex_cd)
});

sexCdStore.filter([
	{filterFn: function(item){
		return item.get("CD") != '0000';
	}}
]);
sexCdStore.filter([
   {property: 'USE_YN', value: 'Y'}
]);

var ageCdStore = Ext.create('Ext.data.JsonStore', {
    model: 'CODE',
    data: Ext.decode(age_cd)
});

ageCdStore.filter([
	{filterFn: function(item){
		return item.get("CD") != '0000';
	}}
]);
ageCdStore.filter([
   {property: 'USE_YN', value: 'Y'}
]);

var dovCdStore = Ext.create('Ext.data.JsonStore', {
    model: 'CODE',
    data: Ext.decode(dov_cd)
});

dovCdStore.filter([
	{filterFn: function(item){
		return item.get("CD") != '0000';
	}}
]);

var chartTypeStore = Ext.create('Ext.data.JsonStore', {
    fields: ['CD', 'CD_DESC', 'TYPE'],
    data: [
        {CD: 'Column2D', CD_DESC: 'Column2D', TYPE: '1'},
		{CD: 'Line2D', CD_DESC: 'Line2D', TYPE: '1'},
		{CD: 'Bar2D', CD_DESC: 'Bar2D', TYPE: '1'},
		{CD: 'Column3D', CD_DESC: 'Column3D', TYPE: '1'},
        {CD: 'Column2D_S', CD_DESC: 'Column2D(Scroll)', TYPE: '2'},
        {CD: 'Line2D_S', CD_DESC: 'Line2D(Scroll)', TYPE: '2'},
        {CD: 'Bar2D_S', CD_DESC: 'Bar2D(Scroll)', TYPE: '2'},
        {CD: 'Column3D_S', CD_DESC: 'Column3D(Scroll)', TYPE: '2'},
        {CD: 'Combination2D', CD_DESC: 'Combination2D(Column + Line)', TYPE: '3'},
        {CD: '2Chart', CD_DESC: 'Pie2D + Column2D', TYPE: '4'},
        {CD: 'Pie2D', CD_DESC: 'Pie2D', TYPE: '5'},
        {CD: 'Column2D_T', CD_DESC: 'Column2D(Stacked)', TYPE: '6'}
    ]
});

Ext.define('CHART', {
    extend: 'Ext.data.Model',
    fields: null
});

//다중으로 값이 넘어온 경우 Object에서 String으로 변환
function fnSetStringToArrayObject(obj){
	return Ext.encode(obj).replace(/\[|\]|\"/g,'');
}

//차트 레이아웃을 위한 변수들
var categoryField = '',
	fields = [],
	displayNames = [],
	modelFields= [],
	keyFields = [],
	caseField = '',
	sumFields = [],
	sumAliases = [],
	extraParams = {};

var charTitle;
var chartId = 'chart';
var chartDiv = 'chart_div';
var chartId1 = 'chart1';
var chartDiv1 = 'chart1_div';
var chartId2 = 'chart2';
var chartDiv2 = 'chart2_div';

//스트링 형식으로 레이아웃 정의.
var layoutStr = '';
var layoutStr2 = '';

//차트 데이터
var chartData = [];
var chartData2 = [];

//rMate 차트 생성 준비가 완료된 상태 시 호출할 함수를 지정합니다.
var chartVars = 'rMateOnLoadCallFunction=chartReadyHandler';
var chartVars2 = 'rMateOnLoadCallFunction=chartReadyHandler2';

//차트의 속성인 rMateOnLoadCallFunction 으로 설정된 함수.
//rMate 차트 준비가 완료된 경우 이 함수가 호출됩니다.
//이 함수를 통해 차트에 레이아웃과 데이터를 삽입합니다.
//파라메터 : id - rMateChartH5.create() 사용 시 사용자가 지정한 id 입니다.
function chartReadyHandler(id){
	document.getElementById(id).setLayout(layoutStr);
	//alert("레이아웃세팅완료 - 데이터세팅시작 id = " + id + "  chartData = " + chartData);
	document.getElementById(id).setData(chartData);
	//프리로더를 보이게 합니다.
	document.getElementById(id).showAdditionalPreloader();
}

function chartReadyHandler2(id){
	document.getElementById(id).setLayout(layoutStr2);
	document.getElementById(id).setData(chartData2);
	//프리로더를 보이게 합니다.
	document.getElementById(id).showAdditionalPreloader();
}

// 프리로더를 제거합니다.
function hidePreloader(){
	if (document.getElementById(chartId) != undefined) {
		document.getElementById(chartId).removeAdditionalPreloader();
	}
	if (document.getElementById(chartId1) != undefined) {
		document.getElementById(chartId1).removeAdditionalPreloader();
	}
	if (document.getElementById(chartId2) != undefined) {
		document.getElementById(chartId2).removeAdditionalPreloader();
	}
}

//차트의 속성인 displayCompleteCallFunction 으로 설정된 함수.
//rMate 차트 출력이 완료된 경우 이 함수가 호출됩니다.
function displayCallFunction(){
	//chartLoadMask.hide();
	hidePreloader();
}

function pieSeriesLabelFunc(seriesId, index, data, values){
    return values[2]+' : '+Number(values[1]).toFixed(1)+'% ('+values[0].format()+')';
}

function pieSeriesFillJsFunc(seriesId, index, data, values){
	if (values[2] == '여성') {
		return "0xd9a400";
	} else if (values[2] == '남성') {
		return "0x8da616";
	} else {
		if (index == 0) {
			return "0x8da616";
		} else if (index == 1) {
			return "0xd9a400";
		} else if (index == 2) {
			return "0xff4040";
		} else if (index == 3) {
			return "0x109dae";
		} else if (index == 4) {
			return "0xde4490";
		} else if (index == 5) {
			return "0x09a963";
		} else if (index == 6) {
			return "0xf68936";
		}
	}
}

//Store Data를 Chart에 맞게 변형
function fnGetChartData(records){
	var tempData = '[';
	for (var i=0; i<records.length; i++) {
		if (i > 0) {
			tempData += ',';
		}
		tempData += Ext.encode(records[i].data);
	}
	tempData += ']';

	//console.log.log(tempData);
	return Ext.decode(tempData);
}

var gutterLeft = '60';
var gutterRight = '10';

function fnGetLayout(title, legendFlag, chartType, categoryField, fields, displayNames, visibleItemSize, precision){
	var form = 'segment';
	var scrollFlag = false;
	if (chartType.indexOf('_S') > 0) {
		scrollFlag = true;
		chartType = chartType.replace('_S', '');
	}
	if (visibleItemSize == undefined) {
		visibleItemSize = 5;
	}

	var labelPosition = 'inside';
	if (chartType == 'Line2D') {
		labelPosition = 'down';
	}
	var maxColumnWidth = '';
	if (chartType == 'Column2D') {
		if (fields.length == 1) {
			maxColumnWidth = 'maxColumnWidth="20"';
		} else if (fields.length == 2) {
			maxColumnWidth = 'maxColumnWidth="40"';
		} else {
			maxColumnWidth = 'maxColumnWidth="800"';
		}
	}

	var categoryAxis = 'CategoryAxis';
	if (scrollFlag) {
		categoryAxis = 'CategoryLinearAxis';
	}

	if (precision == undefined) {
		precision = '-1';
	}

	var layout =
		  '<rMateChart backgroundColor="white" cornerRadius="5" borderStyle="solid">'
		+ '<Options>'
		+ '<Caption text="'+title+'"/>';
	if (legendFlag) {
		layout += '<Legend defaultMouseOverAction="false" useVisibleCheck="true"/>';
	}
	layout +=
		  '</Options>'
		+ '<NumberFormatter id="numfmt" useThousandsSeparator="true" precision="'+precision+'"/>'
		+ '<'+chartType+'Chart showDataTips="true" displayCompleteCallFunction="displayCallFunction" gutterLeft="'+gutterLeft+'" gutterRight="'+gutterRight+'" styleName="fontStyle" columnWdithRatio="1" '+maxColumnWidth+'>';
	if (chartType == 'Bar2D') {
		layout +=
			  '<verticalAxis>'
			+ '<'+categoryAxis+' id="vAxis" categoryField="'+categoryField+'"/>'
			+ '</verticalAxis>';
		if (scrollFlag) {
			layout +=
				  '<verticalAxisRenderers>'
				+ '<ScrollableAxisRenderer axis="{vAxis}" visibleItemSize="'+visibleItemSize+'" scrollSensitivity="1"/>'
				+ '</verticalAxisRenderers>';
		}
		layout += '<horizontalAxis><LinearAxis id="hAxis" formatter="{numfmt}"/></horizontalAxis>';
	} else {
		layout +=
			  '<horizontalAxis>'
			+ '<'+categoryAxis+' id="hAxis" categoryField="'+categoryField+'"/>'
			+ '</horizontalAxis>';
		if (scrollFlag) {
			layout +=
				  '<horizontalAxisRenderers>'
				+ '<ScrollableAxisRenderer axis="{hAxis}" visibleItemSize="'+visibleItemSize+'" scrollSensitivity="1"/>'
				+'</horizontalAxisRenderers>';
		}
		layout += '<verticalAxis><LinearAxis id="vAxis" formatter="{numfmt}"/></verticalAxis>';
	}
	layout += '<series>';
	for (var i=0; i<fields.length; i++) {
		if (chartType == 'Bar2D') {
			layout +=
				  '<'+chartType+'Series form="'+form+'" labelPosition="inside" labelAlign="right" xField="'+fields[i]+'" displayName="'+displayNames[i]+'" styleName="fontStyle">'
				+ '<showDataEffect><SeriesInterpolate direction="right"/></showDataEffect>'
				+ '</'+chartType+'Series>';
		} else {
			layout +=
				  '<'+chartType+'Series form="'+form+'" labelPosition="'+labelPosition+'" showLabelVertically="true" yField="'+fields[i]+'" displayName="'+displayNames[i]+'" styleName="fontStyle">'
				+ '<showDataEffect><SeriesInterpolate/></showDataEffect>';
			if (fields.length == 1) {
				layout +=
					  '<fills>'
					+ '<SolidColor color="0x8da616"/>'
	                + '</fills>';
			} else if (fields.length == 2) {
				if (i == 0) {
					layout +=
						  '<fills>'
						+ '<SolidColor color="0xd9a400"/>'
		                + '</fills>';
				} else if (i == 1) {
					layout +=
						  '<fills>'
						+ '<SolidColor color="0x8da616"/>'
		                + '</fills>';
				}
			} else {
				if (i == 0) {
					layout +=
						  '<fills>'
						+ '<SolidColor color="0x8da616"/>'
		                + '</fills>';
				} else if (i == 1) {
					layout +=
						  '<fills>'
						+ '<SolidColor color="0xd9a400"/>'
		                + '</fills>';
				} else if (i == 2) {
					layout +=
						  '<fills>'
						+ '<SolidColor color="0xff4040"/>'
		                + '</fills>';
				} else if (i == 3) {
					layout +=
						  '<fills>'
						+ '<SolidColor color="0x109dae"/>'
		                + '</fills>';
				} else if (i == 4) {
					layout +=
						  '<fills>'
						+ '<SolidColor color="0xde4490"/>'
		                + '</fills>';
				} else if (i == 5) {
					layout +=
						  '<fills>'
						+ '<SolidColor color="0x09a963"/>'
		                + '</fills>';
				} else if (i == 6) {
					layout +=
						  '<fills>'
						+ '<SolidColor color="0xf68936"/>'
		                + '</fills>';
				}
			}
			layout +=
				'</'+chartType+'Series>';
		}
	}
	layout +=
		  '</series>'
		+ '</'+chartType+'Chart>'
		+ '<Style>.fontStyle{fontFamily: 맑은 고딕, 돋움, 굴림; fontSize:12;}</Style>'
		+ '</rMateChart>';

	//console.log(layout);
	return layout;
}

function fnGetLayoutCombination2D(title, categoryField, fields, displayNames, stackFlag, scrollFlag, visibleItemSize, precision){
	type = 'clustered';
	if (stackFlag) {
		type = 'stacked';
	}

	if (fields.length == 1) {
		maxColumnWidth = '20';
	} else if (fields.length == 2) {
		maxColumnWidth = '40';
	} else {
		maxColumnWidth = '800';
	}

	var categoryAxis = 'CategoryAxis';
	if (scrollFlag) {
		categoryAxis = 'CategoryLinearAxis';
	}

	if (precision == undefined) {
		precision = '-1';
	}

	var layout =
		  '<rMateChart backgroundColor="white" cornerRadius="5" borderStyle="solid">'
		+ '<Options>'
		+ '<Caption text="'+title+'"/>'
		+ '<Legend defaultMouseOverAction="false" useVisibleCheck="true"/>'
		+ '</Options>'
		+ '<NumberFormatter id="numfmt" useThousandsSeparator="true" precision="'+precision+'"/>'
		+ '<Combination2DChart showDataTips="true" displayCompleteCallFunction="displayCallFunction" gutterLeft="'+gutterLeft+'" gutterRight="'+gutterRight+'" styleName="fontStyle">'
		+ '<horizontalAxis>'
		+ '<'+categoryAxis+' id="hAxis" categoryField="'+categoryField+'"/>'
		+ '</horizontalAxis>';
	if (scrollFlag) {
		layout +=
			  '<horizontalAxisRenderers>'
			+ '<ScrollableAxisRenderer axis="{hAxis}" visibleItemSize="'+visibleItemSize+'" scrollSensitivity="1"/>'
			+'</horizontalAxisRenderers>';
	}
	layout +=
		  '<verticalAxis>'
		+ '<LinearAxis id="vAxis" formatter="{numfmt}"/>'
		+ '</verticalAxis>'
		+ '<series>'
		+ '<Line2DSeries yField="'+fields[0]+'" displayName="'+displayNames[0]+'" labelPosition="up" styleName="fontStyle">'
		+ '<lineStroke><Stroke color="0xff4040" weight="2"/></lineStroke>'
		+ '<showDataEffect><SeriesInterpolate/></showDataEffect>'
		+ '</Line2DSeries>'
		+ '<Column2DSet type="'+type+'" columnWdithRatio="1" maxColumnWidth="'+maxColumnWidth+'">'
		+ '<series>';
	for (var i=1; i<fields.length; i++) {
		layout +=
			  '<Column2DSeries yField="'+fields[i]+'" displayName="'+displayNames[i]+'" labelPosition="inside" showLabelVertically="true" styleName="fontStyle">'
			+ '<showDataEffect><SeriesInterpolate/></showDataEffect>';
		if (fields.length == 3) {
			if (i == 1) {
				layout +=
					  '<fills>'
					+ '<SolidColor color="0xd9a400"/>'
	                + '</fills>';
			} else if (i == 2) {
				layout +=
					  '<fills>'
					+ '<SolidColor color="0x8da616"/>'
	                + '</fills>';
			}
		} else {
			if (i == 1) {
				layout +=
					  '<fills>'
					+ '<SolidColor color="0x8da616"/>'
	                + '</fills>';
			} else if (i == 2) {
				layout +=
					  '<fills>'
					+ '<SolidColor color="0xd9a400"/>'
	                + '</fills>';
			} else if (i == 3) {
				layout +=
					  '<fills>'
					+ '<SolidColor color="0x109dae"/>'
	                + '</fills>';
			} else if (i == 4) {
				layout +=
					  '<fills>'
					+ '<SolidColor color="0xde4490"/>'
	                + '</fills>';
			} else if (i == 5) {
				layout +=
					  '<fills>'
					+ '<SolidColor color="0x09a963"/>'
	                + '</fills>';
			} else if (i == 6) {
				layout +=
					  '<fills>'
					+ '<SolidColor color="0xf68936"/>'
	                + '</fills>';
			}
		}
		layout +=
	    	'</Column2DSeries>';
	}
	layout +=
		  '</series>'
		+ '</Column2DSet>'
		+ '</series>'
		+ '</Combination2DChart>'
		+ '<Style>.fontStyle{fontFamily: 맑은 고딕, 돋움, 굴림; fontSize:12;}</Style>'
		+ '</rMateChart>';

	//console.log(layout);
	return layout;
}

function fnGetLayout1(title, nameField, field, precision){
	if (precision == undefined) {
		precision = '-1';
	}

	var layout =
		  '<rMateChart backgroundColor="white" cornerRadius="5" borderStyle="solid">'
		+ '<Options>'
		+ '<Caption text=""/>'
		+ '<SubCaption paddingTop="25" textAlign="right" fontSize="11" text="차트 아이템을 클릭하세요."/>'
		+ '</Options>'
		+ '<NumberFormatter id="numfmt" useThousandsSeparator="true" precision="'+precision+'"/>'
		+ '<Pie2DChart showDataTips="true" itemClickJsFunction="chartClickHanlder" displayCompleteCallFunction="displayCallFunction" gutterLeft="'+gutterLeft+'" gutterRight="'+gutterRight+'" styleName="fontStyle">'
		+ '<series>'
		+ '<Pie2DSeries nameField="'+nameField+'" field="'+field+'" labelPosition="inside" formatter="{numfmt}" labelJsFunction="pieSeriesLabelFunc" fillJsFunction="pieSeriesFillJsFunc" styleName="fontStyle">'
		+ '<radialStroke><Stroke weight="1" color="0xffffff"/></radialStroke>'
		+ '<showDataEffect><SeriesSlide direction="right" duration="1000"/></showDataEffect>'
		+ '</Pie2DSeries>'
		+ '</series>'
		+ '</Pie2DChart>'
		+ '<Style>.fontStyle{fontFamily: 맑은 고딕, 돋움, 굴림; fontSize:12;}</Style>'
		+ '</rMateChart>';

	//console.log(layout);
	return layout;
}

function fnGetLayout2(title, categoryField, fields, displayNames, precision){
	if (fields.length == 1) {
		maxColumnWidth = '20';
	} else if (fields.length == 2) {
		maxColumnWidth = '40';
	} else {
		maxColumnWidth = '400';
	}

	if (precision == undefined) {
		precision = '-1';
	}

	var layout =
		  '<rMateChart backgroundColor="white" cornerRadius="5" borderStyle="solid">'
		+ '<Options>'
		+ '<Caption text="'+title+'"/>'
		+ '<Legend defaultMouseOverAction="false" useVisibleCheck="true"/>'
		+ '</Options>'
		+ '<NumberFormatter id="numfmt" useThousandsSeparator="true" precision="'+precision+'"/>'
		+ '<Column2DChart showDataTips="true" displayCompleteCallFunction="displayCallFunction" gutterLeft="'+gutterLeft+'" gutterRight="'+gutterRight+'" styleName="fontStyle" columnWdithRatio="1" maxColumnWidth="'+maxColumnWidth+'">'
		+ '<horizontalAxis>'
		+ '<CategoryAxis categoryField="'+categoryField+'"/>'
		+ '</horizontalAxis>'
		+ '<verticalAxis><LinearAxis formatter="{numfmt}"/></verticalAxis>'
		+ '<series>';
	for (var i=0; i<fields.length; i++) {
		layout +=
			  '<Column2DSeries yField="'+fields[i]+'" displayName="'+displayNames[i]+'" labelPosition="inside" showLabelVertically="true" styleName="fontStyle">'
			+ '<showDataEffect><SeriesInterpolate/></showDataEffect>';
		if (fields.length == 1) {
			layout +=
				  '<fills>'
				+ '<SolidColor color="0x8da616"/>'
                + '</fills>';
		} else if (fields.length == 2) {
			if (i == 0) {
				layout +=
					  '<fills>'
					+ '<SolidColor color="0xd9a400"/>'
	                + '</fills>';
			} else if (i == 1) {
				layout +=
					  '<fills>'
					+ '<SolidColor color="0x8da616"/>'
	                + '</fills>';
			}
		} else {
			if (i == 0) {
				layout +=
					  '<fills>'
					+ '<SolidColor color="0x8da616"/>'
	                + '</fills>';
			} else if (i == 1) {
				layout +=
					  '<fills>'
					+ '<SolidColor color="0xd9a400"/>'
	                + '</fills>';
			} else if (i == 2) {
				layout +=
					  '<fills>'
					+ '<SolidColor color="0xff4040"/>'
	                + '</fills>';
			} else if (i == 3) {
				layout +=
					  '<fills>'
					+ '<SolidColor color="0x109dae"/>'
	                + '</fills>';
			} else if (i == 4) {
				layout +=
					  '<fills>'
					+ '<SolidColor color="0xde4490"/>'
	                + '</fills>';
			} else if (i == 5) {
				layout +=
					  '<fills>'
					+ '<SolidColor color="0x09a963"/>'
	                + '</fills>';
			} else if (i == 6) {
				layout +=
					  '<fills>'
					+ '<SolidColor color="0xf68936"/>'
	                + '</fills>';
			}
		}
		layout +=
			'</Column2DSeries>';
	}
	layout +=
		  '</series>'
		+ '</Column2DChart>'
		+ '<Style>.fontStyle{fontFamily: 맑은 고딕, 돋움, 굴림; fontSize:12;}</Style>'
		+ '</rMateChart>';

	//console.log(layout);
	return layout;
}

function fnGetLayoutPie2D(title, nameField, fields, displayNames){
	var layout =
		  '<rMateChart backgroundColor="white" cornerRadius="5" borderStyle="solid">'
		+ '<Options>'
		+ '<Caption text="'+title+'"/>'
		+ '</Options>'
		+ '<NumberFormatter id="numfmt" useThousandsSeparator="true" precision="2"/>'
		+ '<Pie2DChart showDataTips="true" displayCompleteCallFunction="displayCallFunction" gutterLeft="'+gutterLeft+'" gutterRight="'+gutterRight+'" styleName="fontStyle">'
		+ '<series>';
	for (var i=0; i<fields.length; i++) {
		layout +=
			  '<Pie2DSeries nameField="'+nameField+'" field="'+fields[i]+'" displayName="'+displayNames[i]+'" labelPosition="inside" formatter="{numfmt}" labelJsFunction="pieSeriesLabelFunc" fillJsFunction="pieSeriesFillJsFunc" styleName="fontStyle">'
			+ '<radialStroke><Stroke weight="1" color="0xffffff"/></radialStroke>'
			+ '<showDataEffect><SeriesSlide direction="right" duration="1000"/></showDataEffect>'
			+ '</Pie2DSeries>';
	}
	layout +=
		  '</series>'
		+ '</Pie2DChart>'
		+ '<Style>.fontStyle{fontFamily: 맑은 고딕, 돋움, 굴림; fontSize:12;}</Style>'
		+ '</rMateChart>';

	//console.log(layout);
	return layout;
}

function fnGetLayoutColumn2DStacked(title, categoryField, fields, displayNames){
	if (fields.length == 1) {
		maxColumnWidth = '20';
	} else if (fields.length == 2) {
		maxColumnWidth = '40';
	} else {
		maxColumnWidth = '800';
	}

	var layout =
		  '<rMateChart backgroundColor="white" cornerRadius="5" borderStyle="solid">'
		+ '<Options>'
		+ '<Caption text="'+title+'"/>'
		+ '<Legend defaultMouseOverAction="false" useVisibleCheck="true"/>'
		+ '</Options>'
		+ '<NumberFormatter id="numfmt" useThousandsSeparator="true"/>'
		+ '<NumberFormatter id="numfmt2" useThousandsSeparator="true" precision="2"/>'
		+ '<Column2DChart showDataTips="true" displayCompleteCallFunction="displayCallFunction" gutterLeft="'+gutterLeft+'" gutterRight="'+gutterRight+'" styleName="fontStyle" columnWdithRatio="1" maxColumnWidth="'+maxColumnWidth+'">'
		+ '<horizontalAxis>'
		+ '<CategoryAxis categoryField="'+categoryField+'"/>'
		+ '</horizontalAxis>'
		+ '<verticalAxis>'
		+ '<LinearAxis id="vAxis" formatter="{numfmt}"/>'
		+ '</verticalAxis>'
		+ '<series>'
		+ '<Column2DSet type="stacked" showTotalLabel="true" formatter="{numfmt2}">'
		+ '<series>';
	for (var i=0; i<fields.length; i++) {
		layout +=
			  '<Column2DSeries yField="'+fields[i]+'" displayName="'+displayNames[i]+'" labelPosition="inside" formatter="{numfmt2}" styleName="fontStyle">'
			+ '<showDataEffect><SeriesInterpolate/></showDataEffect>'
			+ '</Column2DSeries>';
	}
	layout +=
		  '</series>'
		+ '</Column2DSet>'
		+ '</series>'
		+ '</Column2DChart>'
		+ '<Style>.fontStyle{fontFamily: 맑은 고딕, 돋움, 굴림; fontSize:12;}</Style>'
		+ '</rMateChart>';

	//console.log(layout);
	return layout;
}

function fnSetDivDisplay(gubun){
	if (gubun == '1Chart') {
		document.getElementById(chartDiv).style.display = '';
		document.getElementById(chartDiv1).style.display = 'none';
		document.getElementById(chartDiv2).style.display = 'none';
	} else {
		document.getElementById(chartDiv).style.display = 'none';
		document.getElementById(chartDiv1).style.display = '';
		document.getElementById(chartDiv2).style.display = '';
	}
}

function fnRemoveChild(id, div){
	if (document.getElementById(id) != null) {
		document.getElementById(div).removeChild(document.getElementById(id));
	}
}

function fnBeforeload(store, operation){
	fnRemoveChild(chartId, chartDiv);
	fnRemoveChild(chartId1, chartDiv1);
	fnRemoveChild(chartId2, chartDiv2);
}

function fnLoad(store, records, successful){
	if (records.length == 0) {
		fnShowMessage(parent.msgProperty.COM_ERR_0016); //조회된 데이터가 없습니다.
		//chartLoadMask.hide();
		hidePreloader();
		return;
	}

	//차트 데이터
	chartData = fnGetChartData(records);

	//차트 생성
	if (Ext.getCmp('combo_chart_type').getValue() == '2Chart') {
		rMateChartH5.create(chartId1, chartDiv1, chartVars, '427', '100%');
	} else {
		rMateChartH5.create(chartId, chartDiv, chartVars, '840', '100%');
	}
}

function fnBeforeload2(store, operation){
	fnRemoveChild(chartId2, chartDiv2);
}

function fnLoad2(store, records, successful){
	//차트 데이터
	chartData2 = fnGetChartData(records);

	//차트 생성
	rMateChartH5.create(chartId2, chartDiv2, chartVars2, '427', '100%');
}