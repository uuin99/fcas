var now_date = Ext.Date.add(new Date(), Ext.Date.DAY, -1);

var divStore = Ext.create('Ext.data.JsonStore', {
    fields: ['CD', 'CD_DESC'],
    data: [
       {CD: 'TIME', CD_DESC: '시간대별'},
       {CD: 'DAY', CD_DESC: '일자별'},
       {CD: 'MONTH', CD_DESC: '월별'},
       {CD: 'TERM', CD_DESC: '기간별(객층)'}
   ]
});

var timeCdStore;

Ext.define('CODE', {
    extend: 'Ext.data.Model',
    fields: ['CD_TYPE', 'CD', 'CD_TYPE_DESC', 'CD_DESC', 'DISP_ORDR', 'UP_CD_TYPE', 'UP_CD', 'USE_YN']
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

Ext.define('SHOP_TIME', {
	extend: 'Ext.data.Model',
    fields: null
});

function fnRenderer(value, metaData, record, rowIndex, colIndex, store, view){
	if (value == 'Y') {
		metaData.style = 'color: red';
		return '휴무';
	} else {
		if (value != null) {
			return value.format();
		}
	}
}

Ext.onReady(function(){
    Ext.QuickTips.init();

    var combo_div = Ext.create('Ext.form.field.ComboBox', {
		id: 'combo_div',
		labelWidth: 60,
		fieldLabel: '구분',
        store: divStore,
        valueField: 'CD',
        displayField: 'CD_DESC',
        queryMode: 'local',
        editable: false,
        width: 160,
        listeners: {
        	select: function(combo, records){
        		Ext.getCmp('s_stnd_date').setVisible(false);
        		Ext.getCmp('s_stnd_yymm').setVisible(false);
        		Ext.getCmp('s_stnd_yyyy').setVisible(false);
        		Ext.getCmp('s_stnd_date_f').setVisible(false);
        		Ext.getCmp('s_stnd_date_t').setVisible(false);

        		if (combo.getValue() == 'TIME') {
        			Ext.getCmp('s_stnd_date').setVisible(true);
        		} else if (combo.getValue() == 'DAY') {
        			Ext.getCmp('s_stnd_yymm').setVisible(true);
        		} else if (combo.getValue() == 'MONTH') {
        			Ext.getCmp('s_stnd_yyyy').setVisible(true);
        		} else if (combo.getValue() == 'TERM') {
        			Ext.getCmp('s_stnd_date_f').setVisible(true);
        			Ext.getCmp('s_stnd_date_t').setVisible(true);
        		}
        	}
        }
    });

    var panel = Ext.create('Ext.panel.Panel', {
    	id: 's_panel',
    	renderTo: 'search_div',
    	bodyPadding: 0,
    	border: 0,
    	items: {
    		defaults: {
    			labelWidth: 60,
    			width: 160
            },
            border: 0,
            layout: {
        	    type: 'hbox',
        	    align: 'stretch'
        	},
            items: [
                combo_div,
                { xtype: 'tbspacer', width: 10 },
                {
	        		xtype: 'datefield',
	        		id: 's_stnd_date',
	        		fieldLabel: '기준일',
	        		enterEventEnabled: true,
	        		hidden: true,
	        		search_cd:'STND_DATE;00017'
                },
                {
	        		xtype: 'monthfield',
	        		id: 's_stnd_yymm',
	        		fieldLabel: '기준월',
	        		format: 'Y-m',
	        		enterEventEnabled: true,
	        		hidden: true,
	        		search_cd:'STND_YYMM;00018'
                },
                {
	        		xtype: 'textfield',
	        		id: 's_stnd_yyyy',
	        		fieldLabel: '기준년',
	        		maxLength: 4,
	        		enterEventEnabled: true,
	        		hidden: true,
	        		search_cd:'STND_YY;00019'
                },
                {
	        		xtype: 'datefield',
	        		id: 's_stnd_date_f',
	        		fieldLabel: '기준기간',
	        		hidden: true,
	        		search_cd:'STND_DATE_F;00020'
                },
                {
	        		xtype: 'datefield',
	        		id: 's_stnd_date_t',
	        		fieldLabel: '~',
	        		labelWidth: 20,
	    			width: 120,
	        		enterEventEnabled: true,
	        		hidden: true,
	        		search_cd:'STND_DATE_T;00021'
                }
            ]
    	}
    });

    var store = Ext.create('Ext.data.JsonStore', {
		model: 'SHOP_TIME',
		proxy: {
			type: 'ajax',
			api: {
				read: '/cus/fad/ShopEnterMngt/selectListShopEnter.do'
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

    var btn_excel = Ext.create('Ext.button.Button', {
    	id: 'btn_excel',
    	text: 'Excel Export',
    	icon: '/images/icon/icon_excel.png',
    	handler: function(){
    		if (store.getCount() == 0) {
    			fnShowMessage(parent.msgProperty.COM_ERR_0016); //조회된 데이터가 없습니다.
    			return;
    		}

    		var columns = grid.getView().getHeaderCt().getGridColumns();

    		var cols = [];
    		var widths = [];
    		var titles = [];
    		for (var i=1; i<columns.length; i++) {
    			cols[i-1] = columns[i].dataIndex;
    			widths[i-1] = columns[i].width;
    			titles[i-1] = columns[i].text;
    		}
    		var datas = [];
			for (var j=0; j<store.getCount(); j++) {
				var data = '';
				for (var i=0; i<cols.length; i++) {
					if (i > 0) {
						data += '&';
					}
					data += store.getAt(j).get(cols[i]);
				}
				datas[j] = data;
			}

    		var excelFormObjs = {
			    hiddenType:[
			        { NAME:"SHEET_NAME", VALUE: Ext.getCmp('combo_div').getRawValue() },
			        { NAME:"COLS",       VALUE: cols },
			        { NAME:"WIDTHS",     VALUE: widths },
			        { NAME:"TITLES",     VALUE: titles },
			        { NAME:"DATAS",      VALUE: datas }
			    ]
			};

    		var excelForm = document.createElement("form");
            excelForm.name = "excelForm";
            excelForm.method = "POST";
            excelForm.action = '/cus/fad/ShopEnterMngt/getExcelDownFile.do';
            excelForm.target = '_self';

            for (var i=0; i<excelFormObjs.hiddenType.length; i++) {
                var hiddenObjInfo = excelFormObjs.hiddenType[i];
                var hiddenObj = document.createElement("input");
                hiddenObj.type = "hidden";
                hiddenObj.name = hiddenObjInfo.NAME;
                hiddenObj.value = hiddenObjInfo.VALUE;
                excelForm.insertBefore(hiddenObj, null);
            }
            document.body.insertBefore(excelForm, null);
            excelForm.submit();
            document.body.removeChild(excelForm);
    	}
    });

	var btn_reset = Ext.create('Ext.button.Button', {
		id: 'btn_reset',
    	text: '초기화',
    	icon: '/images/icon/icon_reset.png',
    	handler: function(){
    		fnInitSearch(grid, panel);
    		fnInit();
    	}
    });

	var btn_search = Ext.create('Ext.button.Button', {
		id: 'btn_search',
    	text: '조회',
    	icon: '/images/icon/icon_search.png',
    	handler: function(){
    		if (Ext.getCmp('s_stnd_date_f').isVisible()) {
    			var term = Ext.getCmp('s_stnd_date_t').getValue() - Ext.getCmp('s_stnd_date_f').getValue();
    			if (term > 7862400000 ) {
    				fnShowMessage(parent.msgProperty.COM_ERR_0074.replace('param1', '3개월')); //조회 기간은 param1을(를) 초과할 수 없습니다.
        			return;
    			}
    		}
    		timeCdStore.load();
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
            text: '매장ID',
            width: 60,
            dataIndex: 'SHOP_ID',
        	align: 'center'
        }, {
            text: '매장명',
            width: 150,
            dataIndex: 'SHOP_NM',
        	align: 'center'
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
        }]
    });

    timeCdStore = Ext.create('Ext.data.JsonStore', {
    	fields: ['TIME_CD', 'TIME_NM'],
		proxy: {
			type: 'ajax',
			url: '/cus/fad/ShopEnterMngt/selectListTimeCd.do',
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
					STND_DATE: Ext.Date.format(Ext.getCmp('s_stnd_date').getValue(),'Ymd')
                };
                store.proxy.extraParams = eParams;
			},
			load: function(store, records, successful){
				generateDynamicModel(records);
			}
		}
	});

    function generateDynamicModel(records){
    	var fields = ['SHOP_ID', 'SHOP_NM'];
    	var columns = [{
        	xtype: 'rownumberer',
        	text: 'No',
        	width: 40,
        	align: 'center'
        }, {
            text: '매장ID',
            width: 60,
            dataIndex: 'SHOP_ID',
        	align: 'center'
        }, {
            text: '매장명',
            width: 150,
            dataIndex: 'SHOP_NM'
        }];
    	var eParams = null;

    	if (Ext.getCmp('combo_div').getValue() == 'TIME') {
    		for (var i=0; i<records.length; i++) {
        		fields[i+2] = 'CNT_'+records[i].get('TIME_CD');
        		columns[i+3] = new Ext.grid.column.Column({
        			text: records[i].get('TIME_NM'),
        			dataIndex: fields[i+2],
        			width: 60,
        			align: 'right',
        			renderer: fnRenderer
        		});
        	}

        	eParams = {
    			COMP_ID: parent.gvCompId,
    			STND_DATE: Ext.Date.format(Ext.getCmp('s_stnd_date').getValue(),'Ymd'),
    			DIV: 'TIME',
    			CASE_FIELD: 'TIME_CD',
    			FIELDS: Ext.encode(fields).replace(/\[|\]|\"/g,'')
            };
		} else if (Ext.getCmp('combo_div').getValue() == 'DAY') {
			var f = Ext.Date.getFirstDateOfMonth(Ext.getCmp('s_stnd_yymm').getValue());
			var l = Ext.Date.getLastDateOfMonth(Ext.getCmp('s_stnd_yymm').getValue());
			var d = Ext.Date.format(l,'j') - Ext.Date.format(f,'j') + 1;

			for (var i=0; i<d; i++) {
	    		fields[i+2] = 'CNT_'+Ext.Date.format(Ext.Date.add(f, Ext.Date.DAY, i),'Ymd');
	    		columns[i+3] = new Ext.grid.column.Column({
	    			text: i+1+'일',
	    			dataIndex: fields[i+2],
	    			width: 60,
	    			align: 'right',
	    			renderer: fnRenderer
	    		});
	    	}

	    	eParams = {
				COMP_ID: parent.gvCompId,
				STND_YYMM: Ext.Date.format(Ext.getCmp('s_stnd_yymm').getValue(),'Ym'),
				DIV: 'DAY',
				CASE_FIELD: 'STND_DATE',
				FIELDS: Ext.encode(fields).replace(/\[|\]|\"/g,'')
	        };
		} else if (Ext.getCmp('combo_div').getValue() == 'MONTH') {
			var s = Ext.getCmp('s_stnd_yyyy').getValue()+'0101';
			var sd = Ext.Date.parse(s, 'Ymd');
			for (var i=0; i<12; i++) {
	    		fields[i+2] = 'CNT_'+Ext.Date.format(Ext.Date.add(sd, Ext.Date.MONTH, i),'Ym');
	    		columns[i+3] = new Ext.grid.column.Column({
	    			text: i+1+'월',
	    			dataIndex: fields[i+2],
	    			width: 70,
	    			align: 'right',
	    			renderer: fnRenderer
	    		});
	    	}

	    	eParams = {
				COMP_ID: parent.gvCompId,
				STND_YYYY: Ext.getCmp('s_stnd_yyyy').getValue(),
				DIV: 'MONTH',
				CASE_FIELD: 'STND_YYMM',
				FIELDS: Ext.encode(fields).replace(/\[|\]|\"/g,'')
		    };
		} else if (Ext.getCmp('combo_div').getValue() == 'TERM') {
			var i = 0;
			var sex_fields = [], age_fields = [];

			fields[i+2] = 'CNT_ENTER';
			columns[i+3] = new Ext.grid.column.Column({
    			text: '입장객수',
    			dataIndex: fields[i+2],
    			width: 80,
    			align: 'right',
    			renderer: fnRenderer
    		});
			i += 1;

			fields[i+2] = 'CNT_SUM';
			columns[i+3] = new Ext.grid.column.Column({
    			text: '객층합계',
    			dataIndex: fields[i+2],
    			width: 80,
    			align: 'right',
    			renderer: fnRenderer
    		});
			i += 1;

			for (var j=0; j<sexCdStore.getCount(); j++) {
				sex_fields[j] = 'CNT_'+sexCdStore.getAt(j).get('CD');
				fields[i+2] = sex_fields[j];
				columns[i+3] = new Ext.grid.column.Column({
	    			text: sexCdStore.getAt(j).get('CD_DESC'),
	    			dataIndex: fields[i+2],
	    			width: 70,
	    			align: 'right',
	    			renderer: fnRenderer
	    		});
				i += 1;
			}

			for (var j=0; j<ageCdStore.getCount(); j++) {
				age_fields[j] = 'CNT_'+ageCdStore.getAt(j).get('CD');
				fields[i+2] = age_fields[j];
				columns[i+3] = new Ext.grid.column.Column({
	    			text: ageCdStore.getAt(j).get('CD_DESC'),
	    			dataIndex: fields[i+2],
	    			width: 70,
	    			align: 'right',
	    			renderer: fnRenderer
	    		});
				i += 1;
			}

			eParams = {
				COMP_ID: parent.gvCompId,
				STND_DATE_F: Ext.Date.format(Ext.getCmp('s_stnd_date_f').getValue(),'Ymd'),
				STND_DATE_T: Ext.Date.format(Ext.getCmp('s_stnd_date_t').getValue(),'Ymd'),
				DIV: 'TERM',
				SEX_FIELDS: Ext.encode(sex_fields).replace(/\[|\]|\"/g,''),
				AGE_FIELDS: Ext.encode(age_fields).replace(/\[|\]|\"/g,'')
		    };
		}

    	Ext.apply(
    			eParams,
			{
				SC_MAP:fnGetScMap(panel),
				SC_MENU_DIV:'shop_enter_div',
				SC_MENU_CD:Ext.getCmp('combo_div').getValue()
			}
		);

    	store.model.setFields(fields);
    	grid.reconfigure(store, columns);

    	store.proxy.extraParams = eParams;
    	store.load();
    }

    function fnInit(){
    	//alert(now_date);
    	Ext.getCmp('combo_div').setValue('TIME');
    	Ext.getCmp('s_stnd_date').setVisible(true);
		Ext.getCmp('s_stnd_date').setValue(now_date);
		Ext.getCmp('s_stnd_yymm').setValue(now_date);
		Ext.getCmp('s_stnd_yyyy').setValue(Ext.Date.format(now_date,'Y'));
		Ext.getCmp('s_stnd_date_f').setValue(Ext.Date.add(Ext.Date.add(now_date, Ext.Date.MONTH, -3), Ext.Date.DAY, 1));
		Ext.getCmp('s_stnd_date_t').setValue(now_date);
    }

    fnInit();
	fnIframeHeight(516);
});
