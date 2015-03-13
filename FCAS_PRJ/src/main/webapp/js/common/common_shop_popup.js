var popup_shopFindPopupForm = null;
var popup_shopFindGridForm = null;

var shop_popup_comp_id_form = null;

var popup_shopFindGridForm_id = null;
var popup_shopFindGridForm_nm = null;
var popup_shopFindGridForm_callBackFn = null;

//SHOP Model
Ext.define('POPUP_SHOP_LIST_FORM', {
    extend: 'Ext.data.Model',
    fields: ['COMP_NM', 'SHOP_ID', 'SHOP_NM']
});

//고객사 Store
var popup_shop_store_form = Ext.create('Ext.data.JsonStore', {
    pageSize: 10,
	model: 'POPUP_SHOP_LIST_FORM',
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
					COMP_ID: shop_popup_comp_id_form//,
					//SHOP_NM: Ext.getCmp('s_popup_form_shop_nm').getValue()
            };
            store.proxy.extraParams = eParams;
		}
	}
});

//샵 검색 창 Panel
var shopFindPanelForm = null;
/*
var shopFindPanelForm = Ext.create('Ext.panel.Panel', {
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
    		id: 's_popup_form_shop_nm',
    		fieldLabel: '매장명'
    	}]
	}
});
*/






//매장 찾기 Popup Open.
function fnOpenShopFindForm( id, nm, compId ){
	shop_popup_comp_id_form = compId;
	popup_shopFindPopupForm.show();
	Ext.getBody().mask();

	popup_shopFindGridForm_id = id;
	popup_shopFindGridForm_nm = nm;

    setColumnSize( 'id_shopPopupForm_COMP_NM'	,35, popup_shopFindGridForm);
    setColumnSize( 'id_shopPopupForm_SHOP_ID'	,25, popup_shopFindGridForm);
    setColumnSize( 'id_shopPopupForm_SHOP_NM'	,40, popup_shopFindGridForm);

    popup_shop_store_form.loadPage(1);
}

//매장 찾기 Popup Close.
function fnCloseShopFindForm(){
	shop_popup_comp_id_form = null;
	popup_shopFindPopupForm.hide();
	Ext.getBody().unmask();
	fnInitSearch(popup_shopFindGridForm, shopFindPanelForm);
}

//매장 찾기 Popup Open. ( CALLBACK 이 있는 매장찾기 메소드 )
function fnOpenShopFindWithCallBackForm( id, nm, compId , callBackFn ){

	popup_shopFindGridForm_callBackFn = callBackFn;

	shop_popup_comp_id_form = compId;
	popup_shopFindPopupForm.show();
	Ext.getBody().mask();

	popup_shopFindGridForm_id = id;
	popup_shopFindGridForm_nm = nm;

    setColumnSize( 'id_shopPopupForm_COMP_NM'	,35, popup_shopFindGridForm);
    setColumnSize( 'id_shopPopupForm_SHOP_ID'	,25, popup_shopFindGridForm);
    setColumnSize( 'id_shopPopupForm_SHOP_NM'	,40, popup_shopFindGridForm);

    popup_shop_store_form.loadPage(1);
}


Ext.onReady(function(){
    Ext.QuickTips.init();

    //매장 검색 Gird
    popup_shopFindGridForm = Ext.create('Ext.grid.Panel', {
    	id: 'shop_find_form_grid',
        columnLines: true,
        viewConfig: {
        	enableTextSelection: true,
            stripeRows: true
        },
        height: 314,
        store: popup_shop_store_form,
        columns: [{
    		text: '고객사명',
            width    : 100,
            dataIndex: 'COMP_NM',
            id: 'id_shopPopupForm_COMP_NM'
    	},{
    		text: '매장ID',
            width    : 100,
            dataIndex: 'SHOP_ID',
            id: 'id_shopPopupForm_SHOP_ID'
    	},{
    		text: '매장명',
            width    : 100,
            dataIndex: 'SHOP_NM',
            id: 'id_shopPopupForm_SHOP_NM'
    	}],
        tbar: [{
    	   xtype: 'tbfill'
        }, {
        	xtype: 'panel',
        	id: 'r_shopPopupForm_panel',
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
        	    		fnInitSearch(popup_shopFindGridForm, shopFindPanelForm);
        	    	}
        		}, {
        			xtype: 'tbspacer'
        		}, {
        			xtype: 'button',
        			text: '조회',
        			icon: '/images/icon/icon_search.png',
        	    	handler: function(){
        	    		popup_shop_store_form.loadPage(1);
        	    	}
        		}
        	]
        }],
        dockedItems: [{
            xtype: 'pagingtoolbar',
            displayInfo: true,
            dock: 'bottom',
            store: popup_shop_store_form
        }],
		listeners: {

			celldblclick: function(obj ,  td,  cellIndex, record,  tr,  rowIndex,  e,  eOpts){

					Ext.getCmp( popup_shopFindGridForm_id ).setValue(record.data.SHOP_ID);
  					Ext.getCmp( popup_shopFindGridForm_nm ).setValue(record.data.SHOP_NM);

  					if(popup_shopFindGridForm_callBackFn != null) {
  						eval( popup_shopFindGridForm_callBackFn );
  					}

  					//Popup Close.
  					fnCloseShopFindForm();
			}
		}
    });

    //매장 Popup Window
    popup_shopFindPopupForm = Ext.create('Ext.window.Window', {
    	title: '[Face !nsight] 매장찾기',
    	width: 400,
    	height: 375,
    	closable:false,
    	draggable: false,
    	resizable: false,
    	y:233,
        items: [shopFindPanelForm, popup_shopFindGridForm],
        buttonAlign: 'center',
        buttons: [
            { text: '적용',
              id: 'btn_addr_apply_shopForm',
              handler: function(){
            	var record = popup_shopFindGridForm.getView().getSelectionModel().getSelection()[0];
  				if (record) {
  					//화면 Data 적용.

  					Ext.getCmp( popup_shopFindGridForm_id ).setValue(record.data.SHOP_ID);
  					Ext.getCmp( popup_shopFindGridForm_nm ).setValue(record.data.SHOP_NM);

  					if(popup_shopFindGridForm_callBackFn != null) {
  						eval( popup_shopFindGridForm_callBackFn )();
  					}
  					//Popup Close.
  					fnCloseShopFindForm();

  				} else {
  					fnShowMessage('적용할 매장을 선택하여 주시기 바랍니다.');
  					return;
  				}
              }
            },
            { text: '닫기',
              id: 'btn_upload_close_shopForm',
              handler: function(){
            	  fnCloseShopFindForm();
              }
            }
        ]
    });
});


