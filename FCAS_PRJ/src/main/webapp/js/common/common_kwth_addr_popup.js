var popup_kwthAddrFindGrid = null;
var popup_kwthAddrFindWindow = null;
var popup_kwthAddrId = '';
var popup_kwthPointCdId = '';

//주소 Model
Ext.define('POPUP_KWTH_ADDR_LIST', {
    extend: 'Ext.data.Model',
    idProperty: 'ROWNUM',
    fields: ['ROWNUM',
             'POINT_CODE', 'ADDR_CD', 'CI', 'GU', 'DN', 'CI_GU_DONG']
});

//주소 Store
var popup_kwth_addr_store = Ext.create('Ext.data.JsonStore', {
    pageSize: 10,
	model: 'POPUP_KWTH_ADDR_LIST',
	proxy: {
		type: 'ajax',
		api: {
			read: '/mng/svc/AddrMngt/selectKwthAddrPopupList.do'
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
					DN: Ext.getCmp('s_kwth_popup_dn').getValue()
            };
            store.proxy.extraParams = eParams;
		}
	}
});

//주소 검색 창 Panel
var kwthAddrFindPanel = Ext.create('Ext.panel.Panel', {
	id: 's_kwthAddrPopup_panel',
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
    		id: 's_kwth_popup_dn',
    		fieldLabel: '동'
    	}, {
    		xtype: 'displayfield',
    		labelWidth: 170,
    		labelAlign: 'left',
    		width: 0,
    		fieldLabel: '&nbsp;&nbsp;[\'역삼동\'일 경우 \'역삼\'만 입력]'
    	}]
	}
});

//주소찾기 Popup Open.
function fnOpenKwthAddrFind(adr1Id, adr1CdId){
	popup_kwthAddrId = adr1Id;
	popup_kwthPointCdId = adr1CdId;
	popup_kwthAddrFindWindow.show();
	Ext.getBody().mask();
}

//주소찾기 Popup Close.
function fnCloseKwthAddrFind(){
	popup_kwthAddrFindWindow.hide();
	Ext.getBody().unmask();
	fnInitSearch(popup_kwthAddrFindGrid, kwthAddrFindPanel);
}

Ext.onReady(function(){
    Ext.QuickTips.init();

    //xtype KwthAddrPanel 선언
    Ext.define('KwthAddrPanel',{
    	extend: 'Ext.panel.Panel',
    	alias: 'widget.KwthAddrPanel',
    	initComponent: function(){
    		//var panelMode = this.panelMode == undefined ? 'edit' : this.panelMode;
    		//panelMode = panelMode == 'edit' ? false : true;
    		this.layout = {
        			type:'hbox',
        			aligh:'stretch'
        		};
    		this.border = 0;
    		this.padding = 0;
    		this.margin = 0;
    		this.bodyStyle = 'background-color:transparent';
    		this.fieldDefaults = {
        		padding: 0,
    	    	margin: 1,
    			labelAlign: 'right',
    			labelSeparator: ''
        	};
    		this.items = [{
	        		xtype: 'textfield',
	        		id: this.kwthAddrFieldNm,
	        		name: this.kwthAddrFieldNm,
	        		fieldLabel: this.kwthAddrLabel,
	    			labelWidth: 100, 
	    			readOnly: true,
	    			afterLabelTextTpl: this.afterLabelTextTpl,
		    		fieldStyle: 'background:rgb(235,235,235);',
	    			width: this.kwthAddrFieldWidth - 120
	    		}, {
	    			xtype: 'button',
	    			text: '날씨연동지역찾기',
	                icon: '/images/icon/icon_popup_search02.png',
	                margin: 1,
	    			kwthAddrFildId: this.kwthAddrFieldNm,
	    			kwthPointCdFildId: this.kwthPointCdFieldNm,
	    			//hidden: panelMode,
	    	    	handler: function(){
	    	    		fnOpenKwthAddrFind(this.kwthAddrFildId,this.kwthPointCdFildId);
	    	    	}
	    		}, {
	        		xtype: 'hidden',
	        		id: this.kwthPointCdFieldNm,
	        		name: this.kwthPointCdFieldNm,
	        		labelWidth: 0,
	        		width: 0
	    		}];
    		KwthAddrPanel.superclass.initComponent.call(this);
    	}
    });

    //주소검색 Gird
    popup_kwthAddrFindGrid = Ext.create('Ext.grid.Panel', {
    	id: 'kwth_addr_find_grid',
        columnLines: true,
        viewConfig: {
        	enableTextSelection: true,
            stripeRows: true
        },
        height: 290,
        store: popup_kwth_addr_store,
        columns: [{
    		text: '지역',
            width    : 386,
            dataIndex: 'CI_GU_DONG'
    	}],
        tbar: [{
    	   xtype: 'tbfill'
        }, {
        	xtype: 'panel',
        	id: 'r_kwthAddrPopup_panel',
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
        	    		fnInitSearch(popup_kwthAddrFindGrid, kwthAddrFindPanel);
        	    	}
        		}, {
        			xtype: 'tbspacer'
        		}, {
        			xtype: 'button',
        			text: '조회',
        			icon: '/images/icon/icon_search.png',
        	    	handler: function(){
        	    		popup_kwth_addr_store.loadPage(1);
        	    	}
        		}
        	]
        }],
        dockedItems: [{
            xtype: 'pagingtoolbar',
            displayInfo: true,
            dock: 'bottom',
            store: popup_kwth_addr_store
        }],
		listeners: {
			celldblclick: function(obj ,  td,  cellIndex, record,  tr,  rowIndex,  e,  eOpts){
				//화면 Data 적용.
				Ext.getCmp(popup_kwthAddrId).setValue('['+record.data.POINT_CODE+'] '+record.data.CI_GU_DONG);
				Ext.getCmp(popup_kwthPointCdId).setValue(record.data.POINT_CODE);
				//Popup Close.
				fnCloseKwthAddrFind();
			}
		}
    });

    //주소 찾기 Popup Window
    popup_kwthAddrFindWindow = Ext.create('Ext.window.Window', {
    	title: '[Face !nsight] 날씨 연동 코드 찾기',
    	width: 400,
    	height: 375,
    	closable:false,
    	draggable: false,
    	resizable: false,
        items: [kwthAddrFindPanel, popup_kwthAddrFindGrid],
        buttonAlign: 'center',
        buttons: [
            { text: '적용',
              id: 'btn_kwth_addr_apply',
              handler: function(){
            	var record = popup_kwthAddrFindGrid.getView().getSelectionModel().getSelection()[0];
  				if (record) {
  					//화면 Data 적용.
  					Ext.getCmp(popup_kwthAddrId).setValue('['+record.data.POINT_CODE+'] '+record.data.CI_GU_DONG);
  					Ext.getCmp(popup_kwthPointCdId).setValue(record.data.POINT_CODE);
  					//Popup Close.
  					fnCloseKwthAddrFind();
  				} else {
  					fnShowMessage(parent.msgProperty.COM_ERR_0019);//적용할 주소를 선택하여 주시기 바랍니다.
  					return;
  				}
              }
            },
            { text: '닫기',
              id: 'btn_kwth_addr_close',
              handler: function(){
            	  fnCloseKwthAddrFind();
              }
            }
        ]
    });
});


