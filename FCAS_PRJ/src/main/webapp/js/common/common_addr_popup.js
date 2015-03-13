var popup_addrFindGrid = null;
var popup_addrFindWindow = null;
var popup_addr1Id = '';
var popup_addr1CdId = '';

//주소 Model
Ext.define('POPUP_ADDR_LIST', {
    extend: 'Ext.data.Model',
    idProperty: 'ROWNUM',
    fields: ['ROWNUM',
             'ADDR_CD', 'CI', 'GU', 'DN', 'CI_GU_DONG']
});

//주소 Store
var popup_addr_store = Ext.create('Ext.data.JsonStore', {
    pageSize: 10,
	model: 'POPUP_ADDR_LIST',
	proxy: {
		type: 'ajax',
		api: {
			read: '/mng/svc/AddrMngt/selectAddrConvPopupList.do'
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
					DN: Ext.getCmp('s_popup_dn').getValue()
            };
            store.proxy.extraParams = eParams;
		}
	}
});

//주소 검색 창 Panel
var addrFindPanel = Ext.create('Ext.panel.Panel', {
	id: 's_addrPopup_panel',
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
    		id: 's_popup_dn',
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
function fnOpenAddrFind(adr1Id, adr1CdId){
	popup_addr1Id = adr1Id;
	popup_addr1CdId = adr1CdId;
	popup_addrFindWindow.show();
	Ext.getBody().mask();
}

//주소찾기 Popup Close.
function fnCloseAddrFind(){
	popup_addrFindWindow.hide();
	Ext.getBody().unmask();
	fnInitSearch(popup_addrFindGrid, addrFindPanel);
}

Ext.onReady(function(){
    Ext.QuickTips.init();

    //xtype AddrPanel 선언
    Ext.define('AddrPanel',{
    	extend: 'Ext.panel.Panel',
    	alias: 'widget.AddrPanel',
    	initComponent: function(){
    		var panelMode = this.panelMode == undefined ? 'edit' : this.panelMode;
    		panelMode = panelMode == 'edit' ? false : true;
    		this.layout = {
	        	    type: 'table',
	        	    columns: 2
	        };
    		this.items = [{
        		xtype: 'panel',
        		border:0,
        		padding: 0,
	    		margin: 0,
	    		colspan: 2,
	    		bodyStyle:'background-color:transparent',
	    		fieldDefaults: {
	        		padding: 0,
	    	    	margin: 1,
	    			labelAlign: 'right',
	    			labelSeparator: ''
	        	},
        		layout: {
        			type:'hbox',
        			aligh:'stretch'
        		},
        		items: [{
	            		xtype: 'textfield',
	            		id: this.addr1FieldNm,
	            		name: this.addr1FieldNm,
	            		fieldLabel: this.addr1Label,
            			labelWidth: 100, 
            			readOnly: true,
            			afterLabelTextTpl: this.afterLabelTextTpl,
    		    		fieldStyle: 'background:rgb(235,235,235);',
            			width: this.addrFieldWidth - 120
	        		}, {
	        			xtype: 'button',
	        			text: '주소찾기',
	                    icon: '/images/icon/icon_popup_search02.png',
	                    margin: 1,
	        			addr1FildId: this.addr1FieldNm,
	        			addr1CdFildId: this.addr1CdFieldNm,
	        			hidden: panelMode,
	        	    	handler: function(){
	        	    		fnOpenAddrFind(this.addr1FildId,this.addr1CdFildId);
	        	    	}
	        		}, {
	            		xtype: 'hidden',
	            		id: this.addr1CdFieldNm,
	            		name: this.addr1CdFieldNm,
	            		labelWidth: 0,
	            		width: 0
	        		}]
        	}, {
        		xtype: 'textfield',
        		id: this.addr2FieldNm,
        		name: this.addr2FieldNm,
        		fieldLabel: this.addr2Label,
        		width: this.addrFieldWidth,
        		afterLabelTextTpl: this.afterLabelTextTpl,
        		readOnly: panelMode,
            	colspan: 2,
            	maxLength: 200
        	}];
    		AddrPanel.superclass.initComponent.call(this);
    	}
    });

    //주소검색 Gird
    popup_addrFindGrid = Ext.create('Ext.grid.Panel', {
    	id: 'addr_find_grid',
        columnLines: true,
        viewConfig: {
        	enableTextSelection: true,
            stripeRows: true
        },
        height: 290,
        store: popup_addr_store,
        columns: [{
    		text: '주소',
            width    : 386,
            dataIndex: 'CI_GU_DONG'
    	}],
        tbar: [{
    	   xtype: 'tbfill'
        }, {
        	xtype: 'panel',
        	id: 'r_addrPopup_panel',
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
        	    		fnInitSearch(popup_addrFindGrid, addrFindPanel);
        	    	}
        		}, {
        			xtype: 'tbspacer'
        		}, {
        			xtype: 'button',
        			text: '조회',
        			icon: '/images/icon/icon_search.png',
        	    	handler: function(){
        	    		popup_addr_store.loadPage(1);
        	    	}
        		}
        	]
        }],
        dockedItems: [{
            xtype: 'pagingtoolbar',
            displayInfo: true,
            dock: 'bottom',
            store: popup_addr_store
        }],
		listeners: {
			celldblclick: function(obj ,  td,  cellIndex, record,  tr,  rowIndex,  e,  eOpts){
				//화면 Data 적용.
				Ext.getCmp(popup_addr1Id).setValue(record.data.CI_GU_DONG);
				Ext.getCmp(popup_addr1CdId).setValue(record.data.ADDR_CD);
				//Popup Close.
				fnCloseAddrFind();
			}
		}
    });

    //주소 찾기 Popup Window
    popup_addrFindWindow = Ext.create('Ext.window.Window', {
    	title: '[Face !nsight] 주소찾기',
    	width: 400,
    	height: 375,
    	closable:false,
    	draggable: false,
    	resizable: false,
        items: [addrFindPanel, popup_addrFindGrid],
        buttonAlign: 'center',
        buttons: [
            { text: '적용',
              id: 'btn_addr_apply',
              handler: function(){
            	var record = popup_addrFindGrid.getView().getSelectionModel().getSelection()[0];
  				if (record) {
  					//화면 Data 적용.
  					Ext.getCmp(popup_addr1Id).setValue(record.data.CI_GU_DONG);
  					Ext.getCmp(popup_addr1CdId).setValue(record.data.ADDR_CD);
  					//Popup Close.
  					fnCloseAddrFind();
  				} else {
  					fnShowMessage(parent.msgProperty.COM_ERR_0019);//적용할 주소를 선택하여 주시기 바랍니다.
  					return;
  				}
              }
            },
            { text: '닫기',
              id: 'btn_upload_close',
              handler: function(){
            	  fnCloseAddrFind();
              }
            }
        ]
    });
});


