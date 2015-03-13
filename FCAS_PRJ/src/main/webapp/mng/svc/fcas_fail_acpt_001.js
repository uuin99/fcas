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
				read: '/mng/svc/FailMngt/selectFailList.do'
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
					   COMP_ID: Ext.getCmp('s_comp_id').getValue(),
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

			},
			remove: function(store, record, index){

				var after_fn = function(response, opts){
                    var result = Ext.decode(response.responseText);
                    if (result.success) {
                    	//'삭제를 완료하였습니다.'
                        fnShowMessage(parent.msgProperty.COM_RST_0003, Ext.MessageBox.INFO, function(buttonId, text, opt){
                            if (buttonId == 'ok') {
                                store.loadPage(1);
                            }
                        });
                    } else {
                        var msg = '';
                        try {
                            msg = result.message;
                        } catch(err) {
                            msg = parent.msgProperty.COM_ERR_0003; //'삭제에 실패하였습니다.';//
                        }
                        fnShowMessage(msg);
                    }
                };

                fnSubmitGridStore(store, '/mng/svc/FailMngt/deleteFail.do', after_fn);
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
            		id: 's_comp_nm',
            		fieldLabel: '고객사',
        			readOnly: true,
            		enterEventEnabled:true,
    	    		fieldStyle: 'background:rgb(235,235,235);'
            	},{
        			xtype: 'button',
        			text: '찾기',
        			icon: '/images/icon/icon_popup_search02.png',
        			margin: 1,
        			width: 50,
        	    	handler: function(){
    	            	fnOpenCompFindForm('s_comp_id','s_comp_nm');
    	            	// 고객사 찾기 클릭시 매장정보는 삭제한다.
                		Ext.getCmp('s_shop_id').setValue('');
                		Ext.getCmp('s_shop_nm').setValue('');
        	    	}
        		},{
            		xtype: 'textfield',
            		id: 's_shop_nm',
            		fieldLabel: '매장',
            		labelWidth: 65,
        			readOnly: true,
            		enterEventEnabled:true,
    	    		fieldStyle: 'background:rgb(235,235,235);'
             	},{
        			xtype: 'button',
        			text: '찾기',
        			icon: '/images/icon/icon_popup_search02.png',
        			margin: 1,
        			width: 50,
        	    	handler: function(){
        	    		if( Ext.getCmp("s_comp_nm").getValue() == '' ) {
        	    			fnShowMessage(  parent.msgProperty.COM_ERR_0028 ); //'고객사를 먼저 선택해 주십시오.'
        	    		} else {
        	    			fnOpenShopFindForm( 's_shop_id','s_shop_nm' , Ext.getCmp("s_comp_id").getValue() );
        	    		}
        	    	}
        		},{
            		xtype: 'hidden',
            		id: 's_comp_id'
            	},{
            		xtype: 'hidden',
            		id: 's_shop_id'
            	},{
            		xtype: 'combobox',
            		id: 's_fail_type',
            		width: 250,
            		fieldLabel: '장애유형',
            		store: allfailTypeStore,
            		editable : false,
            		enterEventEnabled:true,
            	    queryMode: 'local',
            	    valueField: 'CD',
            	    displayField: 'CD_DESC',
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
            		xtype: 'combobox',
            		id: 's_fail_stat',
            		fieldLabel: '장애상태',
            		store: allfailStatStore,
            		editable : false,
            		enterEventEnabled:true,
            	    queryMode: 'local',
            	    valueField: 'CD',
            	    displayField: 'CD_DESC',
            	    value:''
            	},{
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


    var btn_new = Ext.create('Ext.button.Button', {
    	id: 'btn_new',
    	text: '신규',
    	icon: '/images/icon/icon_new.png',
    	width: 60,
    	handler: function(){
    		fnOpenNewForm();
    	}
    });

    var btn_save = Ext.create('Ext.button.Button', {
    	id: 'btn_save',
    	text: '저장',
    	icon: '/images/icon/icon_save.png',
    	width: 60,
    	handler: function(){
    		if(isFormExpanded){

    			if( Ext.getCmp('FAIL_STAT').getValue() == '10' ) {

    				fnSaveForm();

    			} else {

    				fnShowMessage(  '접수상태에서만 저장할 수 있습니다.' );

    			}

    		}else {
    			fnShowMessage(  parent.msgProperty.COM_ERR_0021 ); // '입력폼을 활성화 후 버튼을 눌러주시기 바랍니다.'
    		}
    	}
    });

    var btn_delete = Ext.create('Ext.button.Button', {
    	id: 'btn_delete',
    	text: '삭제',
    	icon: '/images/icon/icon_delete.png',
    	width: 60,
    	handler: function(){

			var selectedSeq = Ext.getCmp('ACPT_SEQ').getValue();
    		if(selectedSeq == null || selectedSeq == ''){
    			fnShowMessage(  parent.msgProperty.COM_ERR_0022 ); // 삭제할 장애접수정보를 먼저 선택하여 주시기 바랍니다.
    			return;
    		}else {
    			if( Ext.getCmp('FAIL_STAT').getValue() == '10' ) {

    				//'삭제 하시겠습니까?'
	        		Ext.MessageBox.confirm('FCAS', parent.msgProperty.COM_IFO_0001 ,
            			function(btnid){
                			if (btnid == 'yes') {
            	    			fnRemoveForm();

                			}
                		}
            		);

    			} else {
    				fnShowMessage(  '접수상태에서만 삭제할수 있습니다.' );
    			}
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
        	    btn_new,
        	    {xtype: 'tbspacer'},
        	    btn_save,
        	    {xtype: 'tbspacer'},
        	    btn_delete
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
	            		afterLabelTextTpl: fnRequiredValue(),
	        			readOnly: true,
	    	    		fieldStyle: 'background:rgb(235,235,235);',
	            		width:328
        			}, {
	        			xtype: 'button',
	            		icon: '/images/icon/icon_popup_search02.png',
	        			text: '찾기',
	        			margin: 1,
	        	    	handler: function(){
	        	    		fnOpenCompFindForm('COMP_ID','COMP_NM');

	                		// 고객사 찾기 클릭시 매장정보는 삭제한다.
	                		Ext.getCmp('SHOP_ID').setValue('');
	                		Ext.getCmp('SHOP_NM').setValue('');
	        	    	}
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
	            		afterLabelTextTpl: fnRequiredValue(),
	        			readOnly: true,
	    	    		fieldStyle: 'background:rgb(235,235,235);',
	            		width:328
        			}, {
	        			xtype: 'button',
	        			text: '찾기',
	            		icon: '/images/icon/icon_popup_search02.png',
	            		margin: 1,
	        	    	handler: function(){
	        	    		if( Ext.getCmp("COMP_ID").getValue() == '' ) {

	        	    			fnShowMessage(  parent.msgProperty.COM_ERR_0028 ); //'고객사를 먼저 선택해 주십시오.'

	        	    		} else {

	        	    			fnOpenShopFindForm( 'SHOP_ID','SHOP_NM' , Ext.getCmp("COMP_ID").getValue() );

	        	    		}


	        	    	}
	        		}, {
        	            xtype: 'hidden',
        	            id: 'SHOP_ID',
        	            name: 'SHOP_ID'
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
	            		xtype: 'datefield',
	            		id: 'SHOW_FAIL_DT',
	            		name: 'SHOW_FAIL_DT',
	            		fieldLabel: '장애발생일시',
	            		afterLabelTextTpl: fnRequiredValue(),
	            		width:285
        			}, {
                		xtype: 'textfield',
                		id: 'SHOW_FAIL_SI',
                		name: 'SHOW_FAIL_SI',
	            		regex: new RegExp(/[0-2][0-9]/),
	            		mandatoryLabel: '장애발생일시(시)',
	            		regexText: '00~23 까지 입력가능합니다.',
	            		numericVarcharFieldEnabled: true,
	            		maxLength: 2,
                		width:40
	        		}, {
	            		xtype: 'textfield',
	            		id: 'SHOW_FAIL_BN',
	            		name: 'SHOW_FAIL_BN',
	            		fieldLabel: ':',
	            		labelWidth:5,
	            		regex: new RegExp(/[0-5][0-9]/),
	            		mandatoryLabel: '장애발생일시(분)',
	            		regexText: '00~59 까지 입력가능합니다.',
	            		numericVarcharFieldEnabled: true,
	            		maxLength: 2,
	            		width:50
	        		}]
        	},{
            	xtype: 'combobox',
        		id: 'FAIL_TYPE',
        		name: 'FAIL_TYPE',
        		fieldLabel: '장애유형',
        		afterLabelTextTpl: fnRequiredValue(),
        		store: failTypeStore,
        	    queryMode: 'local',
        	    valueField: 'CD',
        	    displayField: 'CD_DESC',
        	    editable: false
        	},{
        		xtype: 'textfield',
        		id: 'FAIL_TITLE',
        		name: 'FAIL_TITLE',
        		fieldLabel: '장애제목',
        		afterLabelTextTpl: fnRequiredValue(),
        		maxLength: 80,
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
        		afterLabelTextTpl: fnRequiredValue(),
        		width: 764,
        		maxLength: 900,
            	colspan: 2
        	},{
        		xtype: 'FileMastPanel',
        		border:0,
        		padding: 0,
	    		margin: 0,
	    		colspan: 2,
	    		panelMode: 'edit',
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
            items: [{
        		xtype: 'textfield',
        		id: 'SHOW_FINS_DTTM',
        		name: 'SHOW_FINS_DTTM',
    			readOnly: true,
	    		fieldStyle: 'background:rgb(235,235,235);',
        		colspan: 2,
        		fieldLabel: '장애처리일시'
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
    			readOnly: true,
	    		fieldStyle: 'background:rgb(235,235,235);',
        		fieldLabel: '장애처리내용',
        		width: 764,
            	colspan: 2
        	},{
        		xtype: 'hidden',
        		id: 'ACPT_SEQ',
        		name: 'ACPT_SEQ'
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

    	Ext.getCmp('SHOW_FAIL_DT').setFieldStyle(  "background:rgb(255,255,255)" );
    	Ext.getCmp('SHOW_FAIL_DT').setReadOnly( false );

    	Ext.getCmp('SHOW_FAIL_SI').setFieldStyle(  "background:rgb(255,255,255)" );
    	Ext.getCmp('SHOW_FAIL_SI').setReadOnly( false );

    	Ext.getCmp('SHOW_FAIL_BN').setFieldStyle(  "background:rgb(255,255,255)" );
    	Ext.getCmp('SHOW_FAIL_BN').setReadOnly( false );

    	Ext.getCmp('FAIL_TYPE').setFieldStyle(  "background:rgb(255,255,255)" );
    	Ext.getCmp('FAIL_TYPE').setReadOnly( false );

    	Ext.getCmp('FAIL_TITLE').setFieldStyle(  "background:rgb(255,255,255)" );
    	Ext.getCmp('FAIL_TITLE').setReadOnly( false );

    	Ext.getCmp('FAIL_CTS').setFieldStyle(  "background:rgb(255,255,255)" );
    	Ext.getCmp('FAIL_CTS').setReadOnly( false );

    	Ext.getCmp('btn_upload_file_nm').setVisible( true );
    	Ext.getCmp('btn_delete_file_nm').setVisible( true );

    	Ext.getCmp('FAIL_STAT').setValue("10");
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

            		// 처리중 이거나 처리 완료일 경우 내용 수정 불가로 처리.
            		if(records[0].data.FAIL_STAT == '20' || records[0].data.FAIL_STAT == '30') {
            	    	Ext.getCmp('SHOW_FAIL_DT').setFieldStyle(  "background:rgb(235,235,235)" );
            	    	Ext.getCmp('SHOW_FAIL_DT').setReadOnly( true );

            	    	Ext.getCmp('SHOW_FAIL_SI').setFieldStyle(  "background:rgb(235,235,235)" );
            	    	Ext.getCmp('SHOW_FAIL_SI').setReadOnly( true );

            	    	Ext.getCmp('SHOW_FAIL_BN').setFieldStyle(  "background:rgb(235,235,235)" );
            	    	Ext.getCmp('SHOW_FAIL_BN').setReadOnly( true );

            	    	Ext.getCmp('FAIL_TYPE').setFieldStyle(  "background:rgb(235,235,235)" );
            	    	Ext.getCmp('FAIL_TYPE').setReadOnly( true );

            	    	Ext.getCmp('FAIL_TITLE').setFieldStyle(  "background:rgb(235,235,235)" );
            	    	Ext.getCmp('FAIL_TITLE').setReadOnly( true );

            	    	Ext.getCmp('FAIL_CTS').setFieldStyle(  "background:rgb(235,235,235)" );
            	    	Ext.getCmp('FAIL_CTS').setReadOnly( true );

            	    	Ext.getCmp('btn_upload_file_nm').setVisible( false );
            	    	Ext.getCmp('btn_delete_file_nm').setVisible( false );

            		} else {
            	    	Ext.getCmp('SHOW_FAIL_DT').setFieldStyle(  "background:rgb(255,255,255)" );
            	    	Ext.getCmp('SHOW_FAIL_DT').setReadOnly( false );

            	    	Ext.getCmp('SHOW_FAIL_SI').setFieldStyle(  "background:rgb(255,255,255)" );
            	    	Ext.getCmp('SHOW_FAIL_SI').setReadOnly( false );

            	    	Ext.getCmp('SHOW_FAIL_BN').setFieldStyle(  "background:rgb(255,255,255)" );
            	    	Ext.getCmp('SHOW_FAIL_BN').setReadOnly( false );

            	    	Ext.getCmp('FAIL_TYPE').setFieldStyle(  "background:rgb(255,255,255)" );
            	    	Ext.getCmp('FAIL_TYPE').setReadOnly( false );

            	    	Ext.getCmp('FAIL_TITLE').setFieldStyle(  "background:rgb(255,255,255)" );
            	    	Ext.getCmp('FAIL_TITLE').setReadOnly( false );

            	    	Ext.getCmp('FAIL_CTS').setFieldStyle(  "background:rgb(255,255,255)" );
            	    	Ext.getCmp('FAIL_CTS').setReadOnly( false );

            	    	Ext.getCmp('btn_upload_file_nm').setVisible( true );
            	    	Ext.getCmp('btn_delete_file_nm').setVisible( true );
            		}
            	} else {
            		fnShowMessage("");
            		return;
            	}
            }
        });
    }

    //저장
    function fnSaveForm(){
    	//var frm = form.getForm();
    	//var validStr = fnFormValid(frm);
        //
    	//if(validStr){
    	//	fnShowMessage(validStr);
    	//	return;
    	//}

    	if(fnIsFormDfultValid(form)){
    		return;
    	}

    	/* 사용자 정의 Validation Start */

    	/* 사용자 정의 Validation End */
    	fnSetElMask();
    	var frm = form.getForm();
    	frm.submit({
    		url: '/com/svc/FailMngt/insertOrUpdateFail.do',
    		success: function(form, action){
    			fnSetElUnmask();
    			fnShowMessage(action.result.message); //저장을 완료하였습니다.
    			fnSearchGrid();
    		},
    		failure: function(form, action){
    			fnSetElUnmask();
    			fnShowMessage(action.result.message); //저장에 실패하였습니다.
    		}
    	});
    }

    //삭제
    function fnRemoveForm(){
    	var frm = form.getForm();
    	fnSetElMask();
    	frm.submit({
    		url: '/mng/svc/FailMngt/deleteFail.do',
    		success: function(form, action){
    			fnSetElUnmask();
    			fnShowMessage(action.result.message); //삭제을 완료하였습니다
    			fnSearchGrid();
    		},
    		failure: function(form, action){
    			fnSetElUnmask();
    			fnShowMessage(action.result.message); //삭제에 실패하였습니다
    		}
    	});
    }

    //중복 값 Check
    function fnDistinctValue( idLabel ){
    	var params = {
    			LOGIN_ID: Ext.getCmp('LOGIN_ID').getValue()
    	};
    	fnSubmitFormStore('/mng/com/UserMngt/selectCheckLoginId.do', params, function(response, opts){
    		var result = Ext.decode(response.responseText);
    		var msgCode = result.messageCode;
    		var msg = result.message;
    		msg = msg.replace("param1", idLabel);
    		fnShowMessage(msg);
    		if(msgCode == 'COM_RST_0005'){ //{param1}은(는) 사용이 가능합니다.
    			checkLoginId = 'Y';
    		}else if(msgCode == 'COM_ERR_0012'){//{param1}은(는) 현재 존재하는 값으로 사용이 불가능합니다.
    			checkLoginId = 'N';
    		}
    	});
    }

    //Form Validation
    //function fnFormValid(frm){
    //	var retStr = null;
    //
    //	if(!frm.isValid()){
    //		retStr = parent.msgProperty.COM_ERR_0023 ;//'입력 폼 중 입력 폼에 맞지 않게 입력된 값이 있습니다.<br>빨간 줄로 표시된 입력 폼을 확인하여 주시기 바랍니다.';
    //	}else if(Ext.getCmp('COMP_ID').getValue() == null || Ext.getCmp('COMP_ID').getValue() == ''){
    //		retStr = parent.msgProperty.COM_ERR_0014.replace('param1', '고객사'); //param1은(는) 필수입력 사항입니다. //'고객사는 필수 입력 사항입니다.';
    //	}else if(Ext.getCmp('SHOP_ID').getValue() == null || Ext.getCmp('SHOP_ID').getValue() == ''){
    //		retStr = parent.msgProperty.COM_ERR_0014.replace('param1', '매장'); //param1은(는) 필수입력 사항입니다.//'매장은 필수 입력 사항입니다.';
    //	}else if(Ext.getCmp('SHOW_FAIL_DT').getValue() == null || Ext.getCmp('SHOW_FAIL_DT').getValue() == ''){
    //		retStr = parent.msgProperty.COM_ERR_0014.replace('param1', '장애발생일시'); //param1은(는) 필수입력 사항입니다.//'장애발생일시는 필수 입력 사항입니다.';
    //	}else if(Ext.getCmp('SHOW_FAIL_SI').getValue() == null || Ext.getCmp('SHOW_FAIL_SI').getValue() == ''){
    //		retStr = parent.msgProperty.COM_ERR_0014.replace('param1', '장애발생일시'); //param1은(는) 필수입력 사항입니다.//'장애발생일시는 필수 입력 사항입니다.';
    //	}else if(Ext.getCmp('SHOW_FAIL_BN').getValue() == null || Ext.getCmp('SHOW_FAIL_BN').getValue() == ''){
    //		retStr = parent.msgProperty.COM_ERR_0014.replace('param1', '장애발생일시'); //param1은(는) 필수입력 사항입니다.//'장애발생일시는 필수 입력 사항입니다.';
    //	}else if(Ext.getCmp('FAIL_TYPE').getValue() == null || Ext.getCmp('FAIL_TYPE').getValue() == ''){
    //		retStr = parent.msgProperty.COM_ERR_0014.replace('param1', '장애유형'); //param1은(는) 필수입력 사항입니다.//'장애유형은 필수 입력 사항입니다.';
    //	}else if(Ext.getCmp('FAIL_TITLE').getValue() == null || Ext.getCmp('FAIL_TITLE').getValue() == ''){
    //		retStr = parent.msgProperty.COM_ERR_0014.replace('param1', '장애제목'); //param1은(는) 필수입력 사항입니다.//'장애제목은 필수 입력 사항입니다.';
    //	}else if(Ext.getCmp('FAIL_CTS').getValue() == null || Ext.getCmp('FAIL_CTS').getValue() == ''){
    //		retStr = parent.msgProperty.COM_ERR_0014.replace('param1', '장애내용'); //param1은(는) 필수입력 사항입니다.//'장애내용은 필수 입력 사항입니다.';
    //	}
    //
    //	return retStr;
    //}

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

    fnIframeHeight(632);
});


