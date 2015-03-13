var strAvailTime = '01|02|03|04|05|06|07|08|09|10|11|12|13|14|15|16|17|18|19|20|21|22|23|24';
var isFormExpanded = false;
//공통코드 Model
Ext.define('CODE', {
    extend: 'Ext.data.Model',
    fields: ['CD_TYPE', 'CD', 'CD_TYPE_DESC', 'CD_DESC', 'DISP_ORDR', 'UP_CD_TYPE', 'UP_CD', 'USE_YN']
});

//매장 Grid Model
Ext.define('SHOP_LIST', {
    extend: 'Ext.data.Model',
    idPropert: 'ROWNUM',
    fields: [  'ROWNUM', 'COMP_ID', 'COMP_NM', 'SHOP_ID', 'SHOP_NM'
             , 'SRVC_STRT_DATE', 'SRVC_END_DATE', 'CMRA_CNT', 'SHOP_ADDR1', 'SHOP_ADDR1_CODE'
             , 'SHOP_ADDR2', 'BIZ_ITEM_1', 'BIZ_ITEM_2', 'BIZ_ITEM_3', 'SHOP_RMRK'
             , 'OPEN_TM', 'CLOSE_TM', 'FILE_UID', 'REGI_ID', 'REGI_NM'
             , 'REGI_DT', 'UPDT_ID', 'REGI_NM', 'UPDT_DT'
             , 'BIZ_ITEM_1_DESC', 'BIZ_ITEM_2_DESC', 'BIZ_ITEM_3_DESC', 'SRVC_DATE', 'OPEN_CLOSE_TM'
             , 'USE_YN']
});

//매장 Form Model
Ext.define('SHOP', {
    extend: 'Ext.data.Model',
    idPropert: 'ROWNUM',
    fields: [  'COMP_ID', 'COMP_NM', 'SHOP_ID', 'SHOP_NM'
             , 'SRVC_STRT_DATE', 'SRVC_END_DATE', 'CMRA_CNT', 'SHOP_ADDR1', 'SHOP_ADDR1_CODE'
             , 'SHOP_ADDR2', 'BIZ_ITEM_1', 'BIZ_ITEM_2', 'BIZ_ITEM_3', 'SHOP_RMRK'
             , 'OPEN_TM', 'CLOSE_TM', 'FILE_UID', 'REGI_ID', 'REGI_NM'
             , 'REGI_DT', 'UPDT_ID', 'REGI_INFO', 'REGI_NM', 'UPDT_DT'
             , 'UPDT_INFO', 'KWTH_ADDR_CODE', 'KWTH_ADDR_DESC'
             , 'USE_YN']
});

Ext.onReady(function(){
    Ext.QuickTips.init();

    /*Combo Store Start*/
    //Email Combo Store
    var emailStore = Ext.create('Ext.data.JsonStore', {
    	model: 'CODE',
    	data: Ext.decode(email)
    });

    emailStore.filter([
	    {property: 'USE_YN', value: 'Y'},
	    {filterFn: function(item){
	    	return item.get("CD") != '0000';
	    }}
	]);
    emailStore.insert(0, new CODE({
		CD: '[ 직접 입력 ]',
		CD_DESC: '[ 직접 입력 ]'
	}));

    var bizStore1 = Ext.create('Ext.data.JsonStore', {
    	model: 'CODE',
    	data: Ext.decode(biz_item_1)
    });

    bizStore1.filter([
	    {property: 'USE_YN', value: 'Y'},
	    {filterFn: function(item){
	    	return item.get("CD") != '0000';
	    }}
	]);

    bizStore1.insert(0, new CODE({
    	CD: '',
    	CD_DESC: '선택'
    }));    
    
    var bizStore2 = Ext.create('Ext.data.JsonStore', {
    	model: 'CODE',
    	data: Ext.decode(biz_item_2)
    });

    bizStore2.filter([
  	    {property: 'USE_YN', value: 'Y'},
  	    {property: 'UP_CD', value: 'ZZZZ'},
  	    {filterFn: function(item){
  	    	return item.get("CD") != '0000';
  	    }}
  	]);

    var bizStore3 = Ext.create('Ext.data.JsonStore', {
    	model: 'CODE',
    	data: Ext.decode(biz_item_3)
    });

    bizStore3.filter([
	    {property: 'USE_YN', value: 'Y'},
	    {property: 'UP_CD', value: 'ZZZZ'},
	    {filterFn: function(item){
	    	return item.get("CD") != '0000';
	    }}
	]);

    /*Combo Store End*/

    //Gird Store
    var store = Ext.create('Ext.data.JsonStore', {
        pageSize: 20,
		model: 'SHOP_LIST',
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
						COMP_ID: Ext.getCmp('s_comp_id').getValue(),
						SHOP_NM: Ext.getCmp('s_shop_nm').getValue()
                };
                store.proxy.extraParams = eParams;
			}
		}
	});

    //입력폼 Store
    var form_store = Ext.create('Ext.data.JsonStore', {
        pageSize: 10,
		model: 'SHOP',
		proxy: {
			type: 'ajax',
			api: {
				read: '/mng/svc/ShopMngt/selectShop.do'
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
                        fnShowMessage('삭제를 완료하였습니다.' , Ext.MessageBox.INFO, function(buttonId, text, opt){
                            if (buttonId == 'ok') {
                                store.loadPage(1);
                            }
                        });
                    } else {
                        var msg = '';
                        try {
                            msg = result.message;
                        } catch(err) {
                            msg = '삭제에 실패하였습니다.';//
                        }
                        store.loadPage(1);
                        fnShowMessage(msg);
                    }
                };

                fnSubmitGridStore(store, '/mng/svc/ShopMngt/deleteShop.do', after_fn);
			}
		}
	});

    //Main 검색 Panel
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
    			labelSeparator: '',
    			labelWidth: 70,
    			width: 180
            },
            border: 0,
            layout: {
        	    type: 'hbox',
        	    align: 'stretch'
        	},
            items: [{
        		xtype: 'panel',
        		border:0,
        		padding: 0,
	    		margin: 0,
	    		bodyStyle:'background-color:transparent',
	    		width:240,
        		layout: {
        			type:'hbox',
        			aligh:'stretch'
        		},
        		items: [{
            		xtype: 'textfield',
            		id: 's_comp_nm',
            		fieldLabel: '고객사',
        			readOnly: true,
    	    		fieldStyle: 'background:rgb(235,235,235);',
    	    		padding: 0,
	    	    	margin: 1,
	    			labelAlign: 'right',
	    			labelSeparator: '',
	        		enterEventEnabled:true,
    	    		labelWidth: 70,
        			width: 180
            	}, {
        			xtype: 'button',
        			text: '찾기',
        			icon: '/images/icon/icon_popup_search02.png',
        			width: 50,
        			margin: 1,
        	    	handler: function(){
        	    		fnOpenCompFindForm('s_comp_id','s_comp_nm');
        	    	}
        		}, {
    	            xtype: 'hidden',
    	            id: 's_comp_id',
    	            width: 0
    	        }]
        	},{
        		xtype: 'textfield',
        		id: 's_shop_nm',
        		fieldLabel: '매장명',
        		enterEventEnabled:true
        	}]
    	}
    });

    /* Button 정의 Start */
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
    			fnSaveForm();
    		}else {
    			fnShowMessage(parent.msgProperty.COM_ERR_0021);//입력폼을 활성화 후 버튼을 눌러주시기 바랍니다.
    		}
    	}
    });

    var btn_delete = Ext.create('Ext.button.Button', {
    	id: 'btn_delete',
    	text: '삭제',
    	icon: '/images/icon/icon_delete.png',
    	width: 60,
    	handler: function(){
    		var selectedShopId = Ext.getCmp('SHOP_ID').getValue();
    		if(selectedShopId == null || selectedShopId == '' ){
    			fnShowMessage(parent.msgProperty.COM_ERR_0022);//삭제할 데이터를 먼저 선택하여 주시기 바랍니다.
    			return;
    		}else {
    			fnRemoveForm();
    		}
    	}
    });

    var btn_excel = Ext.create('Ext.button.Button', {
    	id: 'btn_excel',
    	text: 'Excel Export',
    	icon: '/images/icon/icon_excel.png',
    	handler: function(){
    		fnExcelExport();
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

    /* Button 정의 End */

	//Grid
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
    		text: '고객사명',
            width    : 200,
            dataIndex: 'COMP_NM'
    	}, {
    		text: '매장ID',
            width    : 50,
            align	 : 'center',
            dataIndex: 'SHOP_ID'
    	}, {
    		text: '매장명',
            width    : 150,
            dataIndex: 'SHOP_NM'
    	}, {
    		text: '이용기간',
            width    : 130,
            dataIndex: 'SRVC_DATE'
    	}, {
    		text: '이용여부',
            width    : 50,
            dataIndex: 'USE_YN',
            align: 'center'
    	}, {
    		text: '소재지역',
            width    : 180,
            dataIndex: 'SHOP_ADDR1'
    	}, {
    		text: '업종대그룹명',
            width    : 110,
            dataIndex: 'BIZ_ITEM_1_DESC'
    	}, {
    		text: '업중중그룹명',
            width    : 110,
            dataIndex: 'BIZ_ITEM_2_DESC'
    	}, {
    		text: '업종소그룹명',
            width    : 110,
            dataIndex: 'BIZ_ITEM_3_DESC'
    	}, {
    		text: '영업시간대',
            width    : 80,
            dataIndex: 'OPEN_CLOSE_TM'
    	}, {
    		text: '등록정보',
            width    : 110,
            dataIndex: 'REGI_DT'
    	}, {
    		text: '수정정보',
            width    : 100,
            dataIndex: 'UPDT_DT'
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
        	    btn_excel,
        	    {xtype: 'tbspacer'},
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
        		fnOpenLoadForm(record.data.COMP_ID, record.data.SHOP_ID);
        	}
        }
    });

	//입력폼
    var form = Ext.create('Ext.form.Panel', {
    	id: 'form',
    	title: '매장 상세',
    	frame: true,
    	height: 410,
    	collapsed: true,
    	collapsible: true,
    	autoScroll : true,
    	fieldDefaults: {
    		padding: 0,
	    	margin: 1,
			labelAlign: 'right',
			labelSeparator: '',
			labelWidth: 100,
			width: 380
    	},
    	style: {
    	      backgroundColor: 'white'
    	},
    	layout: {
    	    type: 'table',
    	    columns: 2
    	},
    	items: [{
    		xtype: 'fieldset',
            title: '매장기본정보',
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
		            		width:320
	        			}, {
		        			xtype: 'button',
		        			text: '찾기',
		        			margin: 1,
		        			icon: '/images/icon/icon_popup_search02.png',
		        	    	handler: function(){
		        	    		//fnOpenCompFind();
		        	    		fnOpenCompFindForm('COMP_ID','COMP_NM');
		        	    	}
		        		}, {
	        	            xtype: 'hidden',
	        	            id: 'COMP_ID',
	        	            name: 'COMP_ID'
	        	        }]
	        	}, {
         			xtype: 'textfield',
         			id: 'SHOP_ID',
         			name: 'SHOP_ID',
         			readOnly: true,
 	    			fieldStyle: 'background:rgb(235,235,235);',
         			fieldLabel: '매장ID'
         		}, {
         			xtype: 'textfield',
         			id: 'SHOP_NM',
         			name: 'SHOP_NM',
         			afterLabelTextTpl: fnRequiredValue(),
         			fieldLabel: '매장명',
         			maxLength: 200
         		}, {
         			xtype: 'panel',
         			border:0,
         			padding: 0,
 	    			margin: 0,
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
 	            			xtype: 'datefield',
 	            			id: 'SRVC_STRT_DATE',
 	            			name: 'SRVC_STRT_DATE',
 	            			fieldLabel: '이용기간',
 	            			format: 'Y-m-d',
 	            			afterLabelTextTpl: fnRequiredValue(),
 	            			labelWidth: 100,
 	            			width: 200,
                    	    listeners: {
                    	    	change: function(obj, newValue, oldValue, eOpts){
                    	    		var srvcEndDate =  Ext.getCmp('SRVC_END_DATE').getValue();
                    	    		var thisValue = obj.getValue();
                    	    		if(srvcEndDate != '' && srvcEndDate != null && srvcEndDate < thisValue){
                    	    			fnShowMessage('이용기간은 종료일자 보다 시작일자가 클 수는 없습니다.');
                    	    			obj.setValue(srvcEndDate);
                    	    			return;
                    	    		}
                    	    	}
                    	    }
 	        			},{
 	            			xtype: 'datefield',
 	            			id: 'SRVC_END_DATE',
 	            			name: 'SRVC_END_DATE',
 	            			fieldLabel: '~',
 	            			format: 'Y-m-d',
 	            			mandatoryLabel:'이용기간',
 	            			labelWidth: 10,
 	            			width: 110,
                    	    listeners: {
                    	    	change: function(obj, newValue, oldValue, eOpts){
                    	    		var srvcStrtDate =  Ext.getCmp('SRVC_STRT_DATE').getValue();
                    	    		var thisValue = obj.getValue();
                    	    		if(srvcStrtDate != '' && srvcStrtDate != null && srvcStrtDate > thisValue){
                    	    			fnShowMessage('이용기간은 시작일자 보다 종료일자가 작을 수는 없습니다.');
                    	    			obj.setValue(srvcStrtDate);
                    	    			return;
                    	    		}
                    	    	}
                    	    }
 	        			}
 	        		]
         		}, {
            		xtype: 'AddrPanel',
            		addr1Label: '매장주소',
            		addr1FieldNm: 'SHOP_ADDR1',
            		addr1CdFieldNm: 'SHOP_ADDR1_CODE',
            		addr2Label: '매장상세주소',
            		addr2FieldNm: 'SHOP_ADDR2',
            		afterLabelTextTpl: fnRequiredValue(),
            		addrFieldWidth: 500,
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
    	        	}
            	}, {
            		xtype: 'KwthAddrPanel',
            		kwthAddrLabel: '날씨연동지역',
            		kwthAddrFieldNm: 'KWTH_ADDR_DESC',
            		kwthPointCdFieldNm: 'KWTH_ADDR_CODE',
            		afterLabelTextTpl: fnRequiredValue(),
            		panelMode: 'edit',
            		kwthAddrFieldWidth: 500,
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
    	        	}
            	}, {
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
	             			xtype: 'combobox',
	         				id: 'BIZ_ITEM_1',
	         				name: 'BIZ_ITEM_1',
	         				fieldLabel: '업종그룹',
	         				store: bizStore1,
	     	    			queryMode: 'local',
	     	    			valueField: 'CD',
	     	    			displayField: 'CD_DESC',
	     	    			editable: false,
	     	    			labelWidth: 100,
 	            			width: 250,
	                	    listeners: {
	                	    	select: function(combo, records){
	                	    		Ext.getCmp('BIZ_ITEM_2').setValue('');
	                	    		Ext.getCmp('BIZ_ITEM_2').getStore().clearFilter();
	                	    		Ext.getCmp('BIZ_ITEM_2').getStore().filter([
	                	    		    {property: 'USE_YN', value: 'Y'},
	                	    		    {property: 'UP_CD', value: combo.getValue()},
	                	    		    {filterFn: function(item){
	                	    		    	return item.get("CD") != '0000';
	                	    		    }}
	                	    		]);

	                	    		Ext.getCmp('BIZ_ITEM_3').setValue('');
	                	    		Ext.getCmp('BIZ_ITEM_3').getStore().clearFilter();
	                	    		Ext.getCmp('BIZ_ITEM_3').getStore().filter([
	                  	    		    {property: 'USE_YN', value: 'Y'},
	                  	    		    {property: 'UP_CD', value: 'ZZZZ'},
	                  	    		    {filterFn: function(item){
	                  	    		    	return item.get("CD") != '0000';
	                  	    		    }}
	                  	    		]);
	                	    	}
	                	    }
             			}, {
                 			xtype: 'combobox',
             				id: 'BIZ_ITEM_2',
             				name: 'BIZ_ITEM_2',
             				fieldLabel: '→',
             				store: bizStore2,
         	    			queryMode: 'local',
         	    			valueField: 'CD',
         	    			displayField: 'CD_DESC',
         	    			editable: false,
	     	    			labelWidth: 10,
 	            			width: 160,
                    	    listeners: {
                    	    	select: function(combo, records){
                    	    		Ext.getCmp('BIZ_ITEM_3').setValue('');
                    	    		Ext.getCmp('BIZ_ITEM_3').getStore().clearFilter();
                    	    		Ext.getCmp('BIZ_ITEM_3').getStore().filter([
                    	    		    {property: 'USE_YN', value: 'Y'},
                    	    		    {property: 'UP_CD', value: combo.getValue()},
                    	    		    {filterFn: function(item){
                    	    		    	return item.get("CD") != '0000';
                    	    		    }}
                    	    		]);
                    	    	}
                    	    }
             			},{
                 			xtype: 'combobox',
             				id: 'BIZ_ITEM_3',
             				name: 'BIZ_ITEM_3',
             				fieldLabel: '→',
             				store: bizStore3,
         	    			queryMode: 'local',
         	    			valueField: 'CD',
         	    			displayField: 'CD_DESC',
	     	    			labelWidth: 10,
 	            			width: 160,
         	    			editable: false
             			}
             		]
         		}, {
         			xtype: 'numericfield',
         			id: 'CMRA_CNT',
         			name: 'CMRA_CNT',
         			fieldLabel: '카메라대수',
         			maxLength: 5
         		}, {
         			xtype: 'panel',
         			border:0,
         			padding: 0,
 	    			margin: 0,
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
             				id: 'OPEN_TM',
             				name: 'OPEN_TM',
             				fieldLabel: '영업시간',
             				regex: new RegExp(/^(01|02|03|04|05|06|07|08|09|10|11|12|13|14|15|16|17|18|19|20|21|22|23|24)?$/),
             				regexText: '24시간 형태로 입력하여 주시기 바랍니다.<br>(예: 오후 8시 --> 20시)',
             				numericVarcharFieldEnabled: true,
             				labelWidth: 100,
 	            			width: 130,
             				maxLength: 2
             			}, {
             				xtype: 'textfield',
             				id: 'CLOSE_TM',
             				name: 'CLOSE_TM',
             				fieldLabel: '시 ~',
             				regex: new RegExp(/^(01|02|03|04|05|06|07|08|09|10|11|12|13|14|15|16|17|18|19|20|21|22|23|24)?$/),
             				regexText: '24시간 형식으로 맞추어 주세요<br>(예:21:00)',
             				numericVarcharFieldEnabled: true,
             				labelWidth: 22,
 	            			width: 52,
             				maxLength: 2
             			}, {
             				xtype: 'displayfield',
             				id: 'TM',
             				name: 'TM',
             				fieldLabel: '시',
             				labelWidth: 10,
 	            			width: 10
             			}, {
                 			xtype: 'combobox',
             				id: 'USE_YN',
             				name: 'USE_YN',
             				fieldLabel: '이용여부',
             				store: ynCode,
         	    			valueField: 'CD',
         	    			displayField: 'CD_DESC',
	     	    			labelWidth: 100,
 	            			width: 160,
         	    			editable: false
             			}
             		]
             	}]
         	}, {
	    		xtype: 'fieldset',
	            title: '특이사항',
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
	        		xtype: 'textarea',
	        		id: 'SHOP_RMRK',
	        		name: 'SHOP_RMRK',
	        		fieldLabel: '특이사항',
	        		width: 762,
	            	colspan: 2,
	            	maxLength: 8000
	        	}]
         	}, {
	    		xtype: 'fieldset',
	            title: '이력정보',
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
	        		xtype: 'displayfield',
		    		id: 'REGI_INFO',
		    		name: 'REGI_INFO',
		    		fieldLabel: '등록정보 : '
		    	}, {
		    		xtype: 'displayfield',
		    		id: 'UPDT_INFO',
		    		name: 'UPDT_INFO',
		    		fieldLabel: '수정정보 : '
		    	}]

         	}
        ],
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

    //화면 출력 Panel
    Ext.create('Ext.panel.Panel', {
    	renderTo: 'main_div',
    	border: 0,
    	padding: 0,
    	margin: 0,
    	width: 818,
    	items: [grid, {xtype: 'tbspacer', height: 10}, form]
    });

    /** Function 정의 Start **/

    //신규 Button
    function fnOpenNewForm(){
    	form.expand();
    	fnInitForm();
    }

    //Form Load
    function fnOpenLoadForm(compId, shopId){
    	var eParams = {
    			COMP_ID: compId,
    			SHOP_ID: shopId
            };
        form_store.proxy.extraParams = eParams;
        form_store.load({
        	scope: this,
            callback: function(records, operation, success) {
            	if (records.length == 1) {
            		form.loadRecord(records[0]);
            		fnLoadMultiComboVal(records[0].data.BIZ_ITEM_1, records[0].data.BIZ_ITEM_2, records[0].data.BIZ_ITEM_3);
            		form.expand();
            	} else {
            		fnShowMessage("");
            		return;
            	}
            }
        });
    }

    //Multi Combo Load.
    function fnLoadMultiComboVal(biz1Val, biz2Val, biz3Val){
    	Ext.getCmp('BIZ_ITEM_2').setValue('');
		Ext.getCmp('BIZ_ITEM_2').getStore().clearFilter();
		Ext.getCmp('BIZ_ITEM_2').getStore().filter([
		    {property: 'USE_YN', value: 'Y'},
		    {property: 'UP_CD', value: biz1Val},
		    {filterFn: function(item){
		    	return item.get("CD") != '0000';
		    }}
		]);

		Ext.getCmp('BIZ_ITEM_3').setValue('');
		Ext.getCmp('BIZ_ITEM_3').getStore().clearFilter();
		Ext.getCmp('BIZ_ITEM_3').getStore().filter([
  		    {property: 'USE_YN', value: 'Y'},
  		    {property: 'UP_CD', value: biz2Val},
  		    {filterFn: function(item){
  		    	return item.get("CD") != '0000';
  		    }}
  		]);

		Ext.getCmp('BIZ_ITEM_1').setValue(biz1Val);
		Ext.getCmp('BIZ_ITEM_2').setValue(biz2Val);
		Ext.getCmp('BIZ_ITEM_3').setValue(biz3Val);

    }

    //저장 Button
    function fnSaveForm(){
    	
    	//From Default Validation.
    	if(fnIsFormDfultValid(form)){
    		return;
    	}
    	
    	var addrCode = Ext.getCmp('SHOP_ADDR1_CODE').getValue();
    	var addrDetl = Ext.getCmp('SHOP_ADDR2').getValue();
    	var kwthAddrCode = Ext.getCmp('KWTH_ADDR_CODE').getValue();
    	
    	if(addrCode == null || addrCode == ''){
    		fnShowMessage('매장주소는 필수 사항입니다.');
    		Ext.getCmp('SHOP_ADDR1').focus();
    		return;
    	}
    	if(addrDetl == null || addrDetl == ''){
    		fnShowMessage('매장상세주소는 필수 사항입니다.');
    		Ext.getCmp('SHOP_ADDR2').focus();
    		return;
    	}
    	if(kwthAddrCode == null || kwthAddrCode == ''){
    		fnShowMessage('날씨연동지역코드는 필수 사항입니다.');
    		Ext.getCmp('KWTH_ADDR_DESC').focus();
    		return;
    	}    	
    	
    	fnSetElMask();
    	form.getForm().submit({
    		url: '/mng/svc/ShopMngt/insertOrUpdateShop.do',
    		success: function(form, action){
    			fnSetElUnmask();
    			fnShowMessage(action.result.message);
    			fnSearchGrid();
    		},
    		failure: function(form, action){
    			fnSetElUnmask();
    			fnShowMessage(action.result.message);
    		}
    	});
    }

    //삭제 Button
    function fnRemoveForm(){
    	Ext.MessageBox.confirm('FCAS', parent.msgProperty.COM_IFO_0001, //삭제하시겠습니까?
			function(btnid){
    			if (btnid == 'yes') {
			    	var frm = form.getForm();
			    	fnSetElMask();
			    	frm.submit({
			    		url: '/mng/svc/ShopMngt/deleteShop.do',
			    		success: function(form, action){
			    			fnSetElUnmask();
			    			fnShowMessage(action.result.message);
			    			fnSearchGrid();
			    		},
			    		failure: function(form, action){
			    			fnSetElUnmask();
			    			fnShowMessage(action.result.message);
			    		}
			    	});
    			}
			}
		);
    }

    //Grid 조회
    function fnSearchGrid(){
    	form.collapse();
    	fnInitForm();
		store.loadPage(1);
    }

    //Form 초기화.
    function fnInitForm(){
    	form.loadRecord(new SHOP({
    			OPEN_TM:'01',
    			CLOSE_TM:'24',
    			BIZ_ITEM_1: '',
    			USE_YN: 'Y'
    	}));
    	Ext.getCmp('BIZ_ITEM_2').setValue('');
		Ext.getCmp('BIZ_ITEM_2').getStore().clearFilter();
		Ext.getCmp('BIZ_ITEM_2').getStore().filter([
		    {property: 'USE_YN', value: 'Y'},
		    {property: 'UP_CD', value: 'zzz'},
		    {filterFn: function(item){
		    	return item.get("CD") != '0000';
		    }}
		]);

		Ext.getCmp('BIZ_ITEM_3').setValue('');
		Ext.getCmp('BIZ_ITEM_3').getStore().clearFilter();
		Ext.getCmp('BIZ_ITEM_3').getStore().filter([
  		    {property: 'USE_YN', value: 'Y'},
  		    {property: 'UP_CD', value: 'zzz'},
  		    {filterFn: function(item){
  		    	return item.get("CD") != '0000';
  		    }}
  		]);
    }

    //Excel Export
    function fnExcelExport(){
    	var excelFormObjs = {
			    hiddenType:[
			        { "NAME":"SHEET_NAME", 	"VALUE": "매장관리" },
			        { "NAME":"COLS", 		"VALUE": "COMP_NM,SHOP_ID,SHOP_NM,SRVC_DATE,SHOP_ADDR1,BIZ_ITEM_1_DESC,BIZ_ITEM_2_DESC,BIZ_ITEM_3_DESC,OPEN_CLOSE_TM,REGI_DT,UPDT_DT" },
			        { "NAME":"TITLE", 		"VALUE": "고객사명,매장ID,매장명,이용기간,소재지역,업종 대그룹 명,업종 중그룹 명,업종 소그룹 명,영업 시간대,등록정보,수정정보" },
			        { "NAME":"SQLID", 		"VALUE": "shopmngt.getShopListExcel" },
			        { "NAME":"COMP_ID", 	"VALUE": Ext.getCmp('s_comp_id').getValue() == null ? "" : Ext.getCmp('s_comp_id').getValue() }, //상호
			        { "NAME":"SHOP_NM", 	"VALUE": Ext.getCmp('s_shop_nm').getValue() == null ? "" : Ext.getCmp('s_shop_nm').getValue() } //담당자명
			    ]
			};
		fnDownloadExcel(excelFormObjs);
    }
    /** Function 정의 End **/

    /* 입력폼 Byte Checking Start*/
    

    
    /* 입력폼 Byte Checking End*/

    fnIframeHeight(590); //200 + 390

});
