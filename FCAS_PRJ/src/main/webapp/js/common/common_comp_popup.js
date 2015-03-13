var popup_compFindPopupForm = null;
var popup_compFindGridForm = null;

var popup_compFindGridForm_id = null;
var popup_compFindGridForm_nm = null;


//COMP Model
Ext.define('POPUP_COMP_LIST_FROM', {
    extend: 'Ext.data.Model',
    fields: ['COMP_ID', 'COMP_NM', 'TAX_NO_VIEW']
});

//고객사 Store
var popup_comp_store_form = Ext.create('Ext.data.JsonStore', {
    pageSize: 10,
	model: 'POPUP_COMP_LIST_FROM',
	proxy: {
		type: 'ajax',
		api: {
			read: '/mng/svc/CompMngt/selectCompList.do'
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
					COMP_NM: Ext.getCmp('s_popup_form_comp_nm').getValue()
            };
            store.proxy.extraParams = eParams;
		}
	}
});

//고객사 검색 창 Panel
var compFindPanelForm = Ext.create('Ext.panel.Panel', {
	id: 's_compPopup_form_panel',
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
    		id: 's_popup_form_comp_nm',
    		fieldLabel: '고객사명'
    	}]
	}
});






//고객사 찾기 Popup Open.
function fnOpenCompFindForm(id, nm){
	popup_compFindPopupForm.show();
	Ext.getBody().mask();

	popup_compFindGridForm_id = id;
	popup_compFindGridForm_nm = nm;

    setColumnSize('id_compPopupForm_COMP_ID'		,20, popup_compFindGridForm);
    setColumnSize('id_compPopupForm_COMP_NM'		,35, popup_compFindGridForm);
    setColumnSize('id_compPopupForm_TAX_NO_VIEW'	,45, popup_compFindGridForm);

}



//고객사 찾기 Popup Close.
function fnCloseCompFindForm(){
	popup_compFindPopupForm.hide();
	Ext.getBody().unmask();
	fnInitSearch(popup_compFindGridForm, compFindPanelForm);
}


Ext.onReady(function(){
    Ext.QuickTips.init();

    //고객사 검색 Gird
    popup_compFindGridForm = Ext.create('Ext.grid.Panel', {
    	id: 'comp_find_form_grid',
        columnLines: true,
        viewConfig: {
        	enableTextSelection: true,
            stripeRows: true
        },
        height: 290,
        store: popup_comp_store_form,
        columns: [{
    		text: '고객사ID',
            width    : 100,
            dataIndex: 'COMP_ID',
            id: 'id_compPopupForm_COMP_ID'
    	},{
    		text: '고객사명',
            width    : 100,
            dataIndex: 'COMP_NM',
            id: 'id_compPopupForm_COMP_NM'
    	},{
    		text: '사업자번호',
            width    : 100,
            dataIndex: 'TAX_NO_VIEW',
            id: 'id_compPopupForm_TAX_NO_VIEW'
    	}],
        tbar: [{
    	   xtype: 'tbfill'
        }, {
        	xtype: 'panel',
        	id: 'r_compPopupForm_panel',
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
        	    		fnInitSearch(popup_compFindGridForm, compFindPanelForm);
        	    	}
        		}, {
        			xtype: 'tbspacer'
        		}, {
        			xtype: 'button',
        			text: '조회',
        			icon: '/images/icon/icon_search.png',
        	    	handler: function(){
        	    		popup_comp_store_form.loadPage(1);
        	    	}
        		}
        	]
        }],
        dockedItems: [{
            xtype: 'pagingtoolbar',
            displayInfo: true,
            dock: 'bottom',
            store: popup_comp_store_form
        }],
		listeners: {

			celldblclick: function(obj ,  td,  cellIndex, record,  tr,  rowIndex,  e,  eOpts){

				Ext.getCmp( popup_compFindGridForm_id ).setValue(record.data.COMP_ID);
				Ext.getCmp( popup_compFindGridForm_nm ).setValue(record.data.COMP_NM);
				fnCloseCompFindForm();
			}
		}
    });

    //고객사 Popup Window
    popup_compFindPopupForm = Ext.create('Ext.window.Window', {
    	title: '[Face !nsight] 고객사찾기',
    	width: 400,
    	height: 375,
    	closable:false,
    	draggable: false,
    	resizable: false,
    	y: 233,
        items: [compFindPanelForm, popup_compFindGridForm],
        buttonAlign: 'center',
        buttons: [
            { text: '적용',
              id: 'btn_addr_apply_compForm',
              handler: function(){
            	var record = popup_compFindGridForm.getView().getSelectionModel().getSelection()[0];
  				if (record) {
  					//화면 Data 적용.

  					Ext.getCmp( popup_compFindGridForm_id ).setValue(record.data.COMP_ID);
  					Ext.getCmp( popup_compFindGridForm_nm ).setValue(record.data.COMP_NM);
  					//Popup Close.
  					fnCloseCompFindForm();
  				} else {
  					fnShowMessage('적용할 고객사를 선택하여 주시기 바랍니다.');
  					return;
  				}
              }
            },
            { text: '닫기',
              id: 'btn_upload_close_compForm',
              handler: function(){
            	  fnCloseCompFindForm();
              }
            }
        ]
    });
});


