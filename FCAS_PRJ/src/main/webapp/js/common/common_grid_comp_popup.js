var popup_compFindPopup = null;
var popup_compFindGrid = null;
var parent_comp_grid = null;

//COMP Model
Ext.define('POPUP_COMP_LIST', {
    extend: 'Ext.data.Model',
    fields: ['COMP_ID', 'COMP_NM', 'TAX_NO_VIEW']
});

//고객사 Store
var popup_comp_store = Ext.create('Ext.data.JsonStore', {
    pageSize: 10,
	model: 'POPUP_COMP_LIST',
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
					COMP_NM: Ext.getCmp('s_popup_comp_nm').getValue()
            };
            store.proxy.extraParams = eParams;
		}
	}
});

//고객사 검색 창 Panel
var compFindPanel = Ext.create('Ext.panel.Panel', {
	id: 's_compPopup_panel',
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
    		id: 's_popup_comp_nm',
    		fieldLabel: '고객사명'
    	}]
	}
});






//고객사 찾기 Popup Open.
function fnOpenCompFind( grid ){
	popup_compFindPopup.show();
	Ext.getBody().mask();

	parent_comp_grid = grid;

    setColumnSize('id_compPopup_COMP_ID'		,20, popup_compFindGrid);
    setColumnSize('id_compPopup_COMP_NM'		,35, popup_compFindGrid);
    setColumnSize('id_compPopup_TAX_NO_VIEW'	,45, popup_compFindGrid);


}



//고객사 찾기 Popup Close.
function fnCloseCompFind(){
	popup_compFindPopup.hide();
	Ext.getBody().unmask();
	fnInitSearch(popup_compFindGrid, compFindPanel);
}


Ext.onReady(function(){
    Ext.QuickTips.init();

    //고객사 검색 Gird
    popup_compFindGrid = Ext.create('Ext.grid.Panel', {
    	id: 'comp_find_grid',
        columnLines: true,
        viewConfig: {
        	enableTextSelection: true,
            stripeRows: true
        },
        height: 290,
        store: popup_comp_store,
        columns: [{
    		text: '고객사ID',
            width    : 100,
            dataIndex: 'COMP_ID',
            id: 'id_compPopup_COMP_ID'
    	},{
    		text: '고객사명',
            width    : 100,
            dataIndex: 'COMP_NM',
            id: 'id_compPopup_COMP_NM'
    	},{
    		text: '사업자번호',
            width    : 100,
            dataIndex: 'TAX_NO_VIEW',
            id: 'id_compPopup_TAX_NO_VIEW'
    	}],
        tbar: [{
    	   xtype: 'tbfill'
        }, {
        	xtype: 'panel',
        	id: 'r_compPopup_panel',
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
        	    		fnInitSearch(popup_compFindGrid, compFindPanel);
        	    	}
        		}, {
        			xtype: 'tbspacer'
        		}, {
        			xtype: 'button',
        			text: '조회',
        			icon: '/images/icon/icon_search.png',
        	    	handler: function(){
        	    		popup_comp_store.loadPage(1);
        	    	}
        		}
        	]
        }],
        dockedItems: [{
            xtype: 'pagingtoolbar',
            displayInfo: true,
            dock: 'bottom',
            store: popup_comp_store
        }],
		listeners: {

			celldblclick: function(obj ,  td,  cellIndex, record,  tr,  rowIndex,  e,  eOpts){

				//화면 Data 적용.
				var rec = parent_comp_grid.getSelectionModel().getSelection()[0];
				rec.set('COMP_NM',record.data.COMP_NM);
				rec.set('COMP_ID',record.data.COMP_ID);

				//Popup Close.
				fnCloseCompFind();
			}
		}
    });

    //고객사 Popup Window
    popup_compFindPopup = Ext.create('Ext.window.Window', {
    	title: '[Face !nsight] 고객사찾기',
    	width: 400,
    	height: 375,
    	closable:false,
    	draggable: false,
    	resizable: false,
        items: [compFindPanel, popup_compFindGrid],
        buttonAlign: 'center',
        buttons: [
            { text: '적용',
              id: 'btn_addr_apply_comp',
              handler: function(){
            	var record = popup_compFindGrid.getView().getSelectionModel().getSelection()[0];
  				if (record) {
  					//화면 Data 적용.
  					var rec = parent_comp_grid.getSelectionModel().getSelection()[0];
  					rec.set('COMP_NM',record.data.COMP_NM);
  					rec.set('COMP_ID',record.data.COMP_ID);

  					//Popup Close.
  					fnCloseCompFind();
  				} else {
  					fnShowMessage('적용할 고객사를 선택하여 주시기 바랍니다.');
  					return;
  				}
              }
            },
            { text: '닫기',
              id: 'btn_upload_close_comp',
              handler: function(){
            	  fnCloseCompFind();
              }
            }
        ]
    });
});


