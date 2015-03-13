var popup_equpGrpFindPopupForm = null;
var popup_eqipGrpFindGridForm = null;

var eqipGrp_popup_comp_id_form = null;
var eqipGrp_popup_shop_id_form = null;

var popup_eqipGrpFindGridForm_id = null;
var popup_eqipGrpFindGridForm_nm = null;


//POPUP_EQIP_GRP_LIST_FORM Model
Ext.define('POPUP_EQIP_GRP_LIST_FORM', {
    extend: 'Ext.data.Model',
    fields: ['CMRA_GRP_ID', 'CMRA_GRP_NM' ]
});

//카메라 그룹 Store
var popup_eqip_grp_store_form = Ext.create('Ext.data.JsonStore', {
    pageSize: 10,
	model: 'POPUP_EQIP_GRP_LIST_FORM',
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
					COMP_ID: eqipGrp_popup_comp_id_form,
					SHOP_ID: eqipGrp_popup_shop_id_form
					//SHOP_NM: Ext.getCmp('s_popup_form_shop_nm').getValue()
            };
            store.proxy.extraParams = eParams;
		}
	}
});

//샵 검색 창 Panel
var eqipGrpFindPanelForm = null;
/*
var eqipGrpFindPanelForm = Ext.create('Ext.panel.Panel', {
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

//카메라 그룹 찾기 Popup Open.
function fnOpenEqipGrpFindForm(id, nm , compId , shopId ){

	eqipGrp_popup_comp_id_form = compId;
	eqipGrp_popup_shop_id_form = shopId;

	popup_equpGrpFindPopupForm.show();
	Ext.getBody().mask();

	popup_eqipGrpFindGridForm_id = id;
	popup_eqipGrpFindGridForm_nm = nm;

    setColumnSize( 'id_eqipGrpPopupForm_CMRA_GRP_ID'	,30, popup_eqipGrpFindGridForm);
    setColumnSize( 'id_eqipGrpPopupForm_CMRA_GRP_NM'	,70, popup_eqipGrpFindGridForm);

    popup_eqip_grp_store_form.loadPage(1);
}

//카메라 그룹 찾기 Popup Close.
function fnCloseEqipGrpFindForm(){
	eqipGrp_popup_comp_id_form = null;
	eqipGrp_popup_shop_id_form = null;
	popup_equpGrpFindPopupForm.hide();
	Ext.getBody().unmask();
	fnInitSearch(popup_eqipGrpFindGridForm, eqipGrpFindPanelForm);
}


Ext.onReady(function(){
    Ext.QuickTips.init();

    //매장 검색 Gird
    popup_eqipGrpFindGridForm = Ext.create('Ext.grid.Panel', {
    	id: 'eqipGrp_find_form_grid',
        columnLines: true,
        viewConfig: {
        	enableTextSelection: true,
            stripeRows: true
        },
        height: 314,
        store: popup_eqip_grp_store_form,
        columns: [{
    		text: '카메라 그룹 ID',
            width    : 100,
            dataIndex: 'CMRA_GRP_ID',
            id: 'id_eqipGrpPopupForm_CMRA_GRP_ID'
    	},{
    		text: '카메라 그룹 명',
            width    : 100,
            dataIndex: 'CMRA_GRP_NM',
            id: 'id_eqipGrpPopupForm_CMRA_GRP_NM'
    	}],
        tbar: [{
    	   xtype: 'tbfill'
        }, {
        	xtype: 'panel',
        	id: 'r_eqipGrpPopupForm_panel',
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
        	    		fnInitSearch(popup_eqipGrpFindGridForm, eqipGrpFindPanelForm);
        	    	}
        		}, {
        			xtype: 'tbspacer'
        		}, {
        			xtype: 'button',
        			text: '조회',
        			icon: '/images/icon/icon_search.png',
        	    	handler: function(){
        	    		popup_eqip_grp_store_form.loadPage(1);
        	    	}
        		}
        	]
        }],
        dockedItems: [{
            xtype: 'pagingtoolbar',
            displayInfo: true,
            dock: 'bottom',
            store: popup_eqip_grp_store_form
        }],
		listeners: {

			celldblclick: function(obj ,  td,  cellIndex, record,  tr,  rowIndex,  e,  eOpts){

				Ext.getCmp( popup_eqipGrpFindGridForm_id ).setValue(record.data.CMRA_GRP_ID);
				Ext.getCmp( popup_eqipGrpFindGridForm_nm ).setValue(record.data.CMRA_GRP_NM);
				//Popup Close.
				fnCloseEqipGrpFindForm();
			}
		}
    });

    //카메라 그룹 Popup Window
    popup_equpGrpFindPopupForm = Ext.create('Ext.window.Window', {
    	title: '[Face !nsight] 카메라 그룹 찾기',
    	width: 400,
    	height: 375,
    	closable:false,
    	draggable: false,
    	resizable: false,
        items: [eqipGrpFindPanelForm, popup_eqipGrpFindGridForm],
        buttonAlign: 'center',
        buttons: [
            { text: '적용',
              id: 'btn_addr_apply_eqipGrpFrom',
              handler: function(){
            	var record = popup_eqipGrpFindGridForm.getView().getSelectionModel().getSelection()[0];
  				if (record) {
  					//화면 Data 적용.
  					Ext.getCmp( popup_eqipGrpFindGridForm_id ).setValue(record.data.CMRA_GRP_ID);
  					Ext.getCmp( popup_eqipGrpFindGridForm_nm ).setValue(record.data.CMRA_GRP_NM);
  					//Popup Close.
  					fnCloseEqipGrpFindForm();
  				} else {
  					fnShowMessage('적용할 카메라 그룹명을 선택하여 주시기 바랍니다.');
  					return;
  				}
              }
            },
            { text: '닫기',
              id: 'btn_upload_close_eqipGrpForm',
              handler: function(){
            	  fnCloseEqipGrpFindForm();
              }
            }
        ]
    });
});


