var isFormExpanded = false;


Ext.define('CODE', {
    extend: 'Ext.data.Model',
    fields: ['CD_TYPE', 'CD', 'CD_TYPE_DESC', 'CD_DESC', 'DISP_ORDR', 'UP_CD_TYPE', 'UP_CD', 'USE_YN']
});

Ext.define('FAIL_DESC', {
    extend: 'Ext.data.Model',
    idProperty: 'ROWNUM',
    fields: ['ROWNUM',
             'COMP_ID','SHOP_ID','COMP_NM','SHOP_NM','ACPT_SEQ','FAIL_TITLE','FAIL_TYPE','FAIL_TYPE_NM','FAIL_DATE',
             'FAIL_TM','FAIL_CTS','FILE_UID', 'FILE_SEQ', 'FILE_NM', 'FINS_DATE','FINS_TM','TREAT_CTS','FAIL_STAT','FAIL_STAT_NM',
             'SHOW_FAIL_DT','SHOW_FAIL_TM','SHOW_FAIL_DTTM','SHOW_FINS_DT','SHOW_FINS_TM','SHOW_FINS_DTTM',
             'SHOW_FAIL_SI','SHOW_FAIL_BN','SHOW_FINS_SI','SHOW_FINS_BN',
             'REGI_ID', 'REGI_NM', 'REGI_DT', 'UPDT_ID', 'UPDT_NM', 'UPDT_DT','REGI_INFO','UPDT_INFO']
});








Ext.onReady(function(){
    Ext.QuickTips.init();


    var failTypeStore = Ext.create('Ext.data.JsonStore', {
        model: 'CODE',
        data: Ext.decode(fail_type)
    });

    failTypeStore.filter([
        {property: 'USE_YN', value: 'Y'},
        {filterFn: function(item){
        	return item.get("CD") != '0000';
        }}
    ]);

    var failStatStore = Ext.create('Ext.data.JsonStore', {
        model: 'CODE',
        data: Ext.decode(fail_stat)
    });

    failStatStore.filter([
        {property: 'USE_YN', value: 'Y'},
        {filterFn: function(item){
        	return item.get("CD") != '0000';
        }}
    ]);

    var allfailTypeStore = Ext.create('Ext.data.JsonStore', {
        model: 'CODE',
        data: [{'CD': '', 'CD_DESC': 'ALL'}]
    });

    for (var i=0; i<failTypeStore.getCount(); i++) {
    	allfailTypeStore.add(failTypeStore.getAt(i));
    }


    var allfailStatStore = Ext.create('Ext.data.JsonStore', {
        model: 'CODE',
        data: [{'CD': '', 'CD_DESC': 'ALL'}]
    });

    for (var i=0; i<failStatStore.getCount(); i++) {
    	allfailStatStore.add(failStatStore.getAt(i));
    }




    var store = Ext.create('Ext.data.JsonStore', {
        pageSize: 20,
		model: 'FAIL_DESC',
		proxy: {
			type: 'ajax',
			api: {
				read: '/mng/svc/FailMngt/selectMyFailList.do'
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
					   //COMP_ID: Ext.getCmp('s_comp_id').getValue(),
					   SHOP_ID: Ext.getCmp('s_shop_id').getValue(),
					   FAIL_TYPE: Ext.getCmp('s_fail_type').getValue(),
					   FAIL_STAT: Ext.getCmp('s_fail_stat').getValue(),
					   FAIL_DATE_F: Ext.Date.format(Ext.getCmp('s_date_f').getValue(), 'Ymd'),
					   FAIL_DATE_T: Ext.Date.format(Ext.getCmp('s_date_t').getValue(), 'Ymd')
                };
                store.proxy.extraParams = eParams;
			}
		}
	});

    var form_store = Ext.create('Ext.data.JsonStore', {
        pageSize: 10,
		model: 'FAIL_DESC',
		proxy: {
			type: 'ajax',
			api: {
				read: '/mng/svc/FailMngt/selectFail.do'
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
    			padding: 0,
    	    	margin: 1,
    			labelAlign: 'right',
    			labelSeparator: ''
            },
            border: 0,
            layout: {
        	    type: 'vbox',
        	    align: 'stretch'
        	},
            items: [{
            	defaults: {
        			padding: 0,
        	    	margin: 1,
        			labelAlign: 'right',
        			labelSeparator: ''
                },
                border: 0,
                layout: {
            	    type: 'hbox',
            	    align: 'stretch'
            	},
            	items: [{
            		xtype: 'textfield',
            		id: 's_shop_nm',
            		fieldLabel: '매장',
        			readOnly: true,
    	    		fieldStyle: 'background:rgb(235,235,235);',
    	    		padding: 0,
	    	    	margin: 1,
	    			labelAlign: 'right',
	    			labelSeparator: '',
            		enterEventEnabled:true,
            		value:parent.gvShopNm ,
            	}, {
        			xtype: 'button',
        			text: '찾기',
        			id: 'btn_shop_search',
        			icon: '/images/icon/icon_popup_search02.png',
        			margin: 1,
        			width: 50,
        	    	handler: function(){
        	    		//if( Ext.getCmp("s_comp_nm").getValue() == '' ) {
        	    		//	fnShowMessage(parent.msgProperty.COM_ERR_0028);//고객사를 먼저 선택해 주십시오.
        	    		//} else {
        	    			//fnOpenShopFindForm( 's_shop_id','s_shop_nm' , Ext.getCmp("s_comp_id").getValue() );
        	    			fnOpenShopFindForm( 's_shop_id','s_shop_nm' , parent.gvCompId );
        	    		//}
        	    	}
        		}, {
    	            xtype: 'hidden',
    	            id: 's_shop_id',
    	            value:parent.gvShopId ,
    	            width: 0
    	        }, {
            		xtype: 'combobox',
            		id: 's_fail_type',
            		fieldLabel: '장애유형',
            		store: allfailTypeStore,
            		editable : false,
            	    queryMode: 'local',
            		width:230,
            	    valueField: 'CD',
            	    displayField: 'CD_DESC',
            		enterEventEnabled:true,
            	    value:''
            	},{
            		xtype: 'combobox',
            		id: 's_fail_stat',
            		fieldLabel: '장애상태',
            		store: allfailStatStore,
            		width:230,
            		editable : false,
            	    queryMode: 'local',
            	    valueField: 'CD',
            	    displayField: 'CD_DESC',
            		enterEventEnabled:true,
            	    value:''
            	}]
            },{
            	defaults: {
        			padding: 0,
        	    	margin: 1,
        			labelAlign: 'right',
        			labelSeparator: ''
                },
                border: 0,
                layout: {
            	    type: 'hbox',
            	    align: 'stretch'
            	},
            	items: [{
            		xtype: 'datefield',
            		id: 's_date_f',
            		fieldLabel: '장애발생일자',
            		value: fnGetYyyyMm('start'),
            		enterEventEnabled:true
            	}, {
            		xtype: 'datefield',
            		id: 's_date_t',
            		fieldLabel: '~',
            		labelWidth: 10,
            		value: fnGetYyyyMm('end'),
            		enterEventEnabled:true
            	}]
            }]
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
    		form.getForm().reset();
    		form.collapse();
    	}
    });

	var btn_search = Ext.create('Ext.button.Button', {
		id: 'btn_search',
    	text: '조회',
    	icon: '/images/icon/icon_search.png',
    	handler: function(){
    		fnSearchGrid();
    	}
	});

    var grid = Ext.create('Ext.grid.Panel', {
    	id: 'grid',
        columnLines: true,
        viewConfig: {
        	enableTextSelection: true,
            stripeRows: true
        },
        height: 516,
        store: store,
        columns: [{
        	xtype: 'rownumberer',
        	text : 'No',
        	width: 40,
        	align: 'center'
        }, {
            text     : '고객사',
            width    : 100,
            dataIndex: 'COMP_NM'
        }, {
            text     : '매장',
            width    : 100,
            dataIndex: 'SHOP_NM'
        }, {
            text     : '장애발생일시',
            width    : 100,
            dataIndex: 'SHOW_FAIL_DTTM'
        }, {
            text     : '장애유형',
            width    : 100,
            dataIndex: 'FAIL_TYPE_NM'
        }, {
            text     : '장애상태',
            width    : 100,
            dataIndex: 'FAIL_STAT_NM'
        }, {
            text     : '제목',
            width    : 100,
            dataIndex: 'FAIL_TITLE'
        }, {
            text     : '장애처리일시',
            width    : 100,
            dataIndex: 'SHOW_FINS_DTTM'
        }, {
            text     : '등록자',
            width    : 60,
            dataIndex: 'REGI_NM',
        	align: 'center'
        }, {
            text     : '등록일시',
            width    : 110,
            dataIndex: 'REGI_DT',
        	align: 'center'
        }, {
            text     : '처리자',
            width    : 60,
            dataIndex: 'UPDT_NM',
        	align: 'center'
        }, {
            text     : '처리일시',
            width    : 110,
            dataIndex: 'SHOW_FINS_DTTM',
        	align: 'center'
        }],
        tbar: [{
        	xtype: 'panel',
        	id: 'l_panel',
        	bodyPadding: 0,
        	bodyStyle: 'background-color:transparent;',
        	border: 0,
        	layout: {
        	    type: 'hbox',
        	    align: 'stretch'
        	},
        	items: [
        	    //btn_new,
        	    //{xtype: 'tbspacer'},
        	    //btn_save,
        	    //{xtype: 'tbspacer'}
        	    //btn_delete
        	]
        }, {
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
        }],
        listeners: {
        	select: function(rowModel, record, index){
        		fnOpenLoadForm(record.data.COMP_ID , record.data.SHOP_ID , record.data.ACPT_SEQ);
        		//form.loadRecord(record);
        		//form.expand();
        	}
        }
    });


    var form = Ext.create('Ext.form.Panel', {
    	id: 'form',
    	title: '장애 상세',
    	frame: true,
    	height: 432,
    	collapsed: true,
    	collapsible: true,
    	autoScroll : true,
    	style: {
    	      backgroundColor: 'white'
    	},
    	fieldDefaults: {
    		padding: 0,
	    	margin: 1,
			labelAlign: 'right',
			labelSeparator: '',
			labelWidth: 100,
			width: 380
    	},
    	layout: {
    	    type: 'table',
    	    columns: 2
    	},
    	items: [{
    		xtype: 'fieldset',
            title: '장애접수 정보',
            defaultType: 'textfield',
            layout: 'anchor',
            colspan: 2,
            margin: "1 10 1 10",
            style: {
                backgroundColor: 'rgb(223, 233, 246)'
            },
            defaults: {
                anchor: '100%'
            },
        	layout: {
        	    type: 'table',
        	    columns: 2
        	},
            items: [{
        		xtype: 'panel',
        		border:0,
        		padding: 0,
	    		margin: 0,
	    		bodyStyle:'background-color:transparent',
	    		width:380,
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
	            		id: 'COMP_NM',
	            		name: 'COMP_NM',
	            		fieldLabel: '고객사',
	        			readOnly: true,
	    	    		fieldStyle: 'background:rgb(235,235,235);',
	            		width:379
        			}, {
        	            xtype: 'hidden',
        	            id: 'COMP_ID',
        	            name: 'COMP_ID'
        	        }]
        	},{
        		xtype: 'panel',
        		border:0,
        		padding: 0,
	    		margin: 0,
	    		bodyStyle:'background-color:transparent',
	    		width:380,
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
	            		id: 'SHOP_NM',
	            		name: 'SHOP_NM',
	            		fieldLabel: '매장',
	        			readOnly: true,
	    	    		fieldStyle: 'background:rgb(235,235,235);',
	            		width:379
        			}, {
        	            xtype: 'hidden',
        	            id: 'SHOP_ID',
        	            name: 'SHOP_ID'
        	        }]
        	},{
        		xtype: 'textfield',
        		id: 'SHOW_FAIL_DTTM',
        		name: 'SHOW_FAIL_DTTM',
    			readOnly: true,
	    		fieldStyle: 'background:rgb(235,235,235);',
        		fieldLabel: '장애발생일시'
        	},{
            	xtype: 'combobox',
        		id: 'FAIL_TYPE',
        		name: 'FAIL_TYPE',
        		fieldLabel: '장애유형',
        		store: failTypeStore,
        	    queryMode: 'local',
        	    valueField: 'CD',
        	    displayField: 'CD_DESC',
    			readOnly: true,
	    		fieldStyle: 'background:rgb(235,235,235);',
        	    editable: false
        	},{
        		xtype: 'textfield',
        		id: 'FAIL_TITLE',
        		name: 'FAIL_TITLE',
        		fieldLabel: '장애제목',
    			readOnly: true,
	    		fieldStyle: 'background:rgb(235,235,235);',
        	},{
            	xtype: 'combobox',
        		id: 'FAIL_STAT',
        		name: 'FAIL_STAT',
        		fieldLabel: '장애상태',
        		store: failStatStore,
        	    queryMode: 'local',
        	    valueField: 'CD',
        	    displayField: 'CD_DESC',
    			readOnly: true,
	    		fieldStyle: 'background:rgb(235,235,235);',
        	    editable: false
        	},{
        		xtype: 'textarea',
        		id: 'FAIL_CTS',
        		name: 'FAIL_CTS',
        		fieldLabel: '장애내용',
    			readOnly: true,
	    		fieldStyle: 'background:rgb(235,235,235);',
        		width: 764,
            	colspan: 2
        	},{
        		xtype: 'FileMastPanel',
        		border:0,
        		padding: 0,
	    		margin: 0,
	    		colspan: 2,
	    		panelMode: 'read',
	    		fileUidIdNm: 'FILE_UID',
	    		fileSeqIdNm: 'FILE_SEQ',
	    		fileNmIdNm: 'FILE_NM',
        		colspan: 2
        	},{
            	xtype: 'displayfield',
	    		id: 'REGI_INFO',
	    		name: 'REGI_INFO',
        		fieldLabel: '접수자정보',
        		colspan: 2
        	}]
    	},{
    		xtype: 'fieldset',
            title: '장애처리정보',
            defaultType: 'textfield',
            layout: 'anchor',
            colspan: 2,
            margin: "1 10 1 10",
            style: {
                backgroundColor: 'rgb(223, 233, 246)'
            },
            defaults: {
                anchor: '100%'
            },
        	layout: {
        	    type: 'table',
        	    columns: 2
        	},
            items: [,{
        		xtype: 'textfield',
        		id: 'SHOW_FINS_DTTM',
        		name: 'SHOW_FINS_DTTM',
    			readOnly: true,
	    		fieldStyle: 'background:rgb(235,235,235);',
        		fieldLabel: '장애처리일시',
        		colspan: 2
        	},{
        		xtype: 'displayfield',
        		id: 'UPDT_INFO',
        		name: 'UPDT_INFO',
        		fieldLabel: '처리자 정보',
        		colspan: 2
        	},{
        		xtype: 'textarea',
        		id: 'TREAT_CTS',
        		name: 'TREAT_CTS',
        		fieldLabel: '장애처리내용',
    			readOnly: true,
	    		fieldStyle: 'background:rgb(235,235,235);',
        		width: 764,
            	colspan: 2
        	}]
    	}],
        listeners: {
        	collapse: function(panel){
        		grid.setHeight(516);
        		isFormExpanded = false;
        	},
        	expand: function(panel){
        		grid.setHeight(200);
        		isFormExpanded = true;
        	}
        }
    });

    Ext.create('Ext.panel.Panel', {
    	renderTo: 'main_div',
    	border: 0,
    	padding: 0,
    	margin: 0,
    	width: 818,
    	items: [grid, {xtype: 'tbspacer', height: 10}, form]
    });

    //신규
    function fnOpenNewForm(){
    	form.expand();
    	fnInitForm();
    }


    //Form Load
    function fnOpenLoadForm(compId , shopId , acptSeq){


    	var eParams = {
    			COMP_ID: compId,
    			SHOP_ID: shopId,
    			ACPT_SEQ: acptSeq
        };
        form_store.proxy.extraParams = eParams;
        form_store.load({
        	scope: this,
            callback: function(records, operation, success) {
            	if (records.length == 1) {
            		form.expand();
            		form.loadRecord(records[0]);
            	} else {
            		fnShowMessage("");
            		return;
            	}
            }
        });
    }

    //Grid 조회
    function fnSearchGrid(){

    	form.collapse();
    	fnInitForm();
		store.loadPage(1);
    }

    //Form 초기화.
    function fnInitForm(){
    	checkLoginId = "N";

    	form.loadRecord(new FAIL_DESC({
    		//COMP_DIV: '1',
    		//COMP_TYPE: 'C'
    	}));
    }




    //Resize
    //Ext.getCmp('grid').setSize(w, h);

    //Default Value Setting
    //Ext.getCmp('s_use_yn').setValue('');

    // 권한 타입이 매장일 경우에는 찾기 버튼 삭제한다.
	if(parent.gvAuthType == 'C') {
		Ext.getCmp('btn_shop_search').setVisible(false);
	}


    fnIframeHeight(632);

});


