var popup_equpGrpFindPopup = null;
var popup_eqipGrpFindGrid = null;
var eqipGrp_popup_comp_id = null;
var eqipGrp_popup_shop_id = null;
var parent_eqipGrp_grid = null;

//POPUP_EQIP_GRP_LIST Model
Ext.define('POPUP_EQIP_GRP_LIST', {
    extend: 'Ext.data.Model',
    fields: ['CMRA_GRP_ID', 'CMRA_GRP_NM' ]
});

//카메라 그룹 Store
var popup_eqip_grp_store = Ext.create('Ext.data.JsonStore', {
    pageSize: 10,
	model: 'POPUP_EQIP_GRP_LIST',
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
					COMP_ID: eqipGrp_popup_comp_id,
					SHOP_ID: eqipGrp_popup_shop_id
					//SHOP_NM: Ext.getCmp('s_popup_shop_nm').getValue()
            };
            store.proxy.extraParams = eParams;
		}
	}
});

//샵 검색 창 Panel
var eqipGrpFindPanel = null;
/*
var eqipGrpFindPanel = Ext.create('Ext.panel.Panel', {
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

//카메라 그룹 찾기 Popup Open.
function fnOpenEqipGrpFind(grid , compId , shopId ){

	parent_eqipGrp_grid = grid;

	eqipGrp_popup_comp_id = compId;
	eqipGrp_popup_shop_id = shopId;

	popup_equpGrpFindPopup.show();
	Ext.getBody().mask();

    setColumnSize( 'id_eqipGrpPopup_CMRA_GRP_ID'	,30, popup_eqipGrpFindGrid);
    setColumnSize( 'id_eqipGrpPopup_CMRA_GRP_NM'	,70, popup_eqipGrpFindGrid);

    popup_eqip_grp_store.loadPage(1);
}

//카메라 그룹 찾기 Popup Close.
function fnCloseEqipGrpFind(){
	eqipGrp_popup_comp_id = null;
	eqipGrp_popup_shop_id = null;
	popup_equpGrpFindPopup.hide();
	Ext.getBody().unmask();
	fnInitSearch(popup_eqipGrpFindGrid, eqipGrpFindPanel);
}


Ext.onReady(function(){
    Ext.QuickTips.init();

    //매장 검색 Gird
    popup_eqipGrpFindGrid = Ext.create('Ext.grid.Panel', {
    	id: 'eqipGrp_find_grid',
        columnLines: true,
        viewConfig: {
        	enableTextSelection: true,
            stripeRows: true
        },
        height: 314,
        store: popup_eqip_grp_store,
        columns: [{
    		text: '카메라 그룹 ID',
            width    : 100,
            dataIndex: 'CMRA_GRP_ID',
            id: 'id_eqipGrpPopup_CMRA_GRP_ID'
    	},{
    		text: '카메라 그룹 명',
            width    : 100,
            dataIndex: 'CMRA_GRP_NM',
            id: 'id_eqipGrpPopup_CMRA_GRP_NM'
    	}],
        tbar: [{
    	   xtype: 'tbfill'
        }, {
        	xtype: 'panel',
        	id: 'r_eqipGrpPopup_panel',
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
        	    		fnInitSearch(popup_eqipGrpFindGrid, eqipGrpFindPanel);
        	    	}
        		}, {
        			xtype: 'tbspacer'
        		}, {
        			xtype: 'button',
        			text: '조회',
        			icon: '/images/icon/icon_search.png',
        	    	handler: function(){
        	    		popup_eqip_grp_store.loadPage(1);
        	    	}
        		}
        	]
        }],
        dockedItems: [{
            xtype: 'pagingtoolbar',
            displayInfo: true,
            dock: 'bottom',
            store: popup_eqip_grp_store
        }],
		listeners: {

			celldblclick: function(obj ,  td,  cellIndex, record,  tr,  rowIndex,  e,  eOpts){

				var rec = parent_eqipGrp_grid.getSelectionModel().getSelection()[0];
				rec.set('CMRA_GRP_ID',record.data.CMRA_GRP_ID);
				rec.set('CMRA_GRP_NM',record.data.CMRA_GRP_NM);

				//Popup Close.
				fnCloseEqipGrpFind();
			}
		}
    });

    //카메라 그룹 Popup Window
    popup_equpGrpFindPopup = Ext.create('Ext.window.Window', {
    	title: '[Face !nsight] 카메라 그룹 찾기',
    	width: 400,
    	height: 375,
    	closable:false,
    	draggable: false,
    	resizable: false,
        items: [eqipGrpFindPanel, popup_eqipGrpFindGrid],
        buttonAlign: 'center',
        buttons: [
            { text: '적용',
              id: 'btn_addr_apply_eqipGrp',
              handler: function(){
            	var record = popup_eqipGrpFindGrid.getView().getSelectionModel().getSelection()[0];
  				if (record) {
  					//화면 Data 적용.
  					var rec = parent_eqipGrp_grid.getSelectionModel().getSelection()[0];
  					rec.set('CMRA_GRP_ID',record.data.CMRA_GRP_ID);
  					rec.set('CMRA_GRP_NM',record.data.CMRA_GRP_NM);

  					//Popup Close.
  					fnCloseEqipGrpFind();
  				} else {
  					fnShowMessage('적용할 카메라 그룹명을 선택하여 주시기 바랍니다.');
  					return;
  				}
              }
            },
            { text: '닫기',
              id: 'btn_upload_close_eqipGrp',
              handler: function(){
            	  fnCloseEqipGrpFind();
              }
            }
        ]
    });
});


