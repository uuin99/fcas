Ext.define('CODE', {
    extend: 'Ext.data.Model',
    fields: ['CD_TYPE', 'CD', 'CD_TYPE_DESC', 'CD_DESC', 'DISP_ORDR', 'UP_CD_TYPE', 'UP_CD', 'USE_YN']
});

Ext.define('ADDR', {
    extend: 'Ext.data.Model',
    idProperty: 'ROWNUM',
    fields: ['ROWNUM',
             'ADDR_CD','ADDR','ADDR_DIV','ADDR_DIV_NM']
});

var addrDivStore = Ext.create('Ext.data.JsonStore', {
    model: 'CODE',
    data: Ext.decode(addr_div)
});

addrDivStore.filter([
    {property: 'USE_YN', value: 'Y'},
    {filterFn: function(item){
    	return item.get("CD") != '0000';
    }}
]);

var alladdrDivStore = Ext.create('Ext.data.JsonStore', {
    model: 'CODE',
    data: [{'CD': '', 'CD_DESC': 'ALL'}]
});

for (var i=0; i<addrDivStore.getCount(); i++) {
	alladdrDivStore.add(addrDivStore.getAt(i));
}

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
    			width: 220
            },
            border: 0,
            layout: {
        	    type: 'hbox',
        	    align: 'stretch'
        	},
            items: [{
        		xtype: 'textfield',
        		id: 's_addr_cd',
        		fieldLabel: '주소코드',
        		enterEventEnabled:true
        	},{
        		xtype: 'textfield',
        		id: 's_addr',
        		fieldLabel: '주소',
        		enterEventEnabled:true
        	},{
        		xtype: 'combobox',
        		id: 's_addr_div',
        		fieldLabel: '주소구분',
        		store: alladdrDivStore,
        	    queryMode: 'local',
        	    valueField: 'CD',
        	    displayField: 'CD_DESC',
        		enterEventEnabled:true
        	}]
    	}
    });

    var store = Ext.create('Ext.data.JsonStore', {
        pageSize: 20,
		model: 'ADDR',
		proxy: {
			type: 'ajax',
			api: {
				read: '/mng/svc/AddrMngt/selectAddrList.do'
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
					ADDR_CD: Ext.getCmp('s_addr_cd').getValue(),
					ADDR: Ext.getCmp('s_addr').getValue(),
					ADDR_DIV: Ext.getCmp('s_addr_div').getValue()
                };
                store.proxy.extraParams = eParams;
			}
		}
	});

    var btn_excel = Ext.create('Ext.button.Button', {
    	id: 'btn_excel',
    	text: 'Excel Export',
    	icon: '/images/icon/icon_excel.png',
    	handler: function(){

    	}
    });

	var btn_reset = Ext.create('Ext.button.Button', {
		id: 'btn_reset',
    	text: '초기화',
    	icon: '/images/icon/icon_reset.png',
    	handler: function(){
    		fnInitSearch(grid, panel);
    	}
    });

	var btn_search = Ext.create('Ext.button.Button', {
		id: 'btn_search',
    	text: '조회',
    	icon: '/images/icon/icon_search.png',
    	handler: function(){
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
            text     : '주소코드',
            width    : 200,
            dataIndex: 'ADDR_CD'
        }, {
            text     : '주소',
            width    : 200,
            dataIndex: 'ADDR'
        }, {
            text     : '주소구분',
            width    : 200,
            dataIndex: 'ADDR_DIV_NM'
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
        	    //btn_excel,
        	    //{xtype: 'tbspacer'},
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
    Ext.getCmp('s_addr_div').setValue('');

    fnIframeHeight(516);

});
