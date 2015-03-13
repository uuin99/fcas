var popup_shopFindPopup = null;
var popup_shopFindGrid = null;
var shop_popup_comp_id = null;
var parent_shop_grid = null;

//SHOP Model
Ext.define('POPUP_SHOP_LIST', {
    extend: 'Ext.data.Model',
    fields: ['COMP_NM', 'SHOP_ID', 'SHOP_NM']
});

//고객사 Store
var popup_shop_store = Ext.create('Ext.data.JsonStore', {
    pageSize: 10,
	model: 'POPUP_SHOP_LIST',
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
	},
	listeners: {
		beforeload: function(store, operation){
			var eParams = {
					COMP_ID: shop_popup_comp_id//,
					//SHOP_NM: Ext.getCmp('s_popup_shop_nm').getValue()
            };
            store.proxy.extraParams = eParams;
		}
	}
});

//샵 검색 창 Panel
var shopFindPanel = null;
/*
var shopFindPanel = Ext.create('Ext.panel.Panel', {
	id: 's_shopPopup_panel',
	bodyPadding: 0,
	border: 0,
	items: {
		defaults: {
			padding: 0,
	    	margin: 1,
			labelAlign: 'right',
			labelSeparator: '',
			labelWidth: 50,
			width: 150
        },
        border: 0,
        layout: {
    	    type: 'hbox',
    	    align: 'stretch'
    	},
        items: [{
    		xtype: 'textfield',
    		id: 's_popup_shop_nm',
    		fieldLabel: '매장명'
    	}]
	}
});
*/

//매장 찾기 Popup Open.
function fnOpenShopFind(grid , compId ){

	parent_shop_grid = grid;

	shop_popup_comp_id = compId;
	popup_shopFindPopup.show();
	Ext.getBody().mask();

    setColumnSize( 'id_shopPopup_COMP_NM'	,35, popup_shopFindGrid);
    setColumnSize( 'id_shopPopup_SHOP_ID'	,25, popup_shopFindGrid);
    setColumnSize( 'id_shopPopup_SHOP_NM'	,40, popup_shopFindGrid);

    popup_shop_store.loadPage(1);
}

//매장 찾기 Popup Close.
function fnCloseShopFind(){
	shop_popup_comp_id = null;
	popup_shopFindPopup.hide();
	Ext.getBody().unmask();
	fnInitSearch(popup_shopFindGrid, shopFindPanel);
}


Ext.onReady(function(){
    Ext.QuickTips.init();

    //매장 검색 Gird
    popup_shopFindGrid = Ext.create('Ext.grid.Panel', {
    	id: 'shop_find_grid',
        columnLines: true,
        viewConfig: {
        	enableTextSelection: true,
            stripeRows: true
        },
        height: 314,
        store: popup_shop_store,
        columns: [{
    		text: '고객사명',
            width    : 100,
            dataIndex: 'COMP_NM',
            id: 'id_shopPopup_COMP_NM'
    	},{
    		text: '매장ID',
            width    : 100,
            dataIndex: 'SHOP_ID',
            id: 'id_shopPopup_SHOP_ID'
    	},{
    		text: '매장명',
            width    : 100,
            dataIndex: 'SHOP_NM',
            id: 'id_shopPopup_SHOP_NM'
    	}],
        tbar: [{
    	   xtype: 'tbfill'
        }, {
        	xtype: 'panel',
        	id: 'r_shopPopup_panel',
        	bodyPadding: 0,
        	bodyStyle: 'background-color:transparent;',
        	border: 0,
        	layout: {
        	    type: 'hbox',
        	    align: 'stretch'
        	},
        	items: [{
        			xtype: 'button',
        			text: '초기화',
        			icon: '/images/icon/icon_reset.png',
        	    	handler: function(){
        	    		fnInitSearch(popup_shopFindGrid, shopFindPanel);
        	    	}
        		}, {
        			xtype: 'tbspacer'
        		}, {
        			xtype: 'button',
        			text: '조회',
        			icon: '/images/icon/icon_search.png',
        	    	handler: function(){
        	    		popup_shop_store.loadPage(1);
        	    	}
        		}
        	]
        }],
        dockedItems: [{
            xtype: 'pagingtoolbar',
            displayInfo: true,
            dock: 'bottom',
            store: popup_shop_store
        }],
		listeners: {

			celldblclick: function(obj ,  td,  cellIndex, record,  tr,  rowIndex,  e,  eOpts){

				var rec = parent_shop_grid.getSelectionModel().getSelection()[0];
				rec.set('SHOP_ID',record.data.SHOP_ID);
				rec.set('SHOP_NM',record.data.SHOP_NM);

				//Popup Close.
				fnCloseShopFind();
			}
		}
    });

    //매장 Popup Window
    popup_shopFindPopup = Ext.create('Ext.window.Window', {
    	title: '[Face !nsight] 매장찾기',
    	width: 400,
    	height: 375,
    	closable:false,
    	draggable: false,
    	resizable: false,
        items: [shopFindPanel, popup_shopFindGrid],
        buttonAlign: 'center',
        buttons: [
            { text: '적용',
              id: 'btn_addr_apply_shop',
              handler: function(){
            	var record = popup_shopFindGrid.getView().getSelectionModel().getSelection()[0];
  				if (record) {
  					//화면 Data 적용.
  					var rec = parent_shop_grid.getSelectionModel().getSelection()[0];
  					rec.set('SHOP_ID',record.data.SHOP_ID);
  					rec.set('SHOP_NM',record.data.SHOP_NM);

  					//Popup Close.
  					fnCloseShopFind();
  				} else {
  					fnShowMessage('적용할 매장을 선택하여 주시기 바랍니다.');
  					return;
  				}
              }
            },
            { text: '닫기',
              id: 'btn_upload_close_shop',
              handler: function(){
            	  fnCloseShopFind();
              }
            }
        ]
    });
});


