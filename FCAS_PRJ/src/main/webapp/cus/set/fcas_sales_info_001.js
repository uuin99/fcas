var now_date = new Date();

Ext.define('SALES_INFO', {
    extend: 'Ext.data.Model',
    idProperty: 'DATE',
    fields: ['DATE', 'DAY', 'COMP_ID', 'SHOP_ID', 'STND_DATE',
             'WORK_YN', 'BUY_CS_CNT', 'SALES_AMT', 'EVNT_NM',
             'REGI_ID', 'REGI_NM', 'REGI_DT', 'UPDT_ID', 'UPDT_NM', 'UPDT_DT']
});

Ext.define('SALES_INFO_DETL', {
    extend: 'Ext.data.Model',
    idProperty: 'TIME',
    fields: ['TIME', 'COMP_ID', 'SHOP_ID', 'STND_DATE', 'TIME_CD',
             'BUY_CS_CNT', 'SALES_AMT',
             'REGI_ID', 'REGI_NM', 'REGI_DT', 'UPDT_ID', 'UPDT_NM', 'UPDT_DT']
});

function fnMRenderer(value, metaData, record, rowIndex, colIndex, store, view){
	if (colIndex <= 1) {
		if (record.get('DAY') == '일') {
			metaData.style = 'background-color:#f6f6f6; color:red;';
		} else {
			metaData.style = 'background-color:#f6f6f6;';
		}
	}

	if (colIndex == 0) {
		return value.substr(6,2);
	}

	if (colIndex == 2) {
		if (value == 'Y' || value == true) {
			metaData.style = 'color:red;';
			return '휴무';
		} else {
			return '';
		}
	}

	if (colIndex == 3 || colIndex == 4) {
		if (value != null) {
			return Ext.util.Format.number(value,'0,000');
		}
	}

	if (colIndex == 5) {
		metaData.style = 'background-color:#f6f6f6;';
	}

	return value;
}

function fnDRenderer(value, metaData, record, rowIndex, colIndex, store, view){
	if (colIndex == 0) {
		metaData.style = 'background-color:#f6f6f6;';
	}

	if (colIndex >= 1) {
		if (value != null) {
			return Ext.util.Format.number(value,'0,000');
		}
	}

	return value;
}

Ext.onReady(function(){
    Ext.QuickTips.init();

    var panel = Ext.create('Ext.panel.Panel', {
    	id: 's_panel',
    	renderTo: 'search_div',
    	bodyPadding: 0,
    	border: 0,
    	items: {
    		defaults: {
    			labelWidth: 70,
    			width: 220
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
        		value: parent.gvShopNm,
    			readOnly: true,
	    		fieldStyle: 'background:rgb(235,235,235);'
        	},{
    			xtype: 'button',
    			id: 'btn_shop_search',
    			text: '찾기',
    			icon: '/images/icon/icon_popup_search02.png',
    			margin: 1,
    			width: 50,
    	    	handler: function(){
    	    		fnOpenShopFindForm( 's_shop_id','s_shop_nm' , parent.gvCompId );
    	    	}
    		}, {
	            xtype: 'hidden',
	            id: 's_shop_id',
	            value: parent.gvShopId,
	            width: 0
	        }, {
	            xtype: 'hidden',
	            id: 's_shop_addr1_code',
	            width: 0
	        }, {
        		xtype: 'monthfield',
        		id: 's_stnd_date',
        		fieldLabel: '기준월',
        		format: 'Y-m',
        		enterEventEnabled: true,
        		value: now_date,
        		width: 170
        	}]
    	}
    });

    var m_store = Ext.create('Ext.data.JsonStore', {
		model: 'SALES_INFO',
		proxy: {
			type: 'ajax',
			api: {
				read: '/cus/set/SalesInfoMngt/selectSalesInfoMngt.do'
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
				fnInitSearch(d_grid);

				var eParams = {
					//COMP_ID: parent.gvCompId, // 서버단에서 가져오도록 변경함..
					SHOP_ID: Ext.getCmp('s_shop_id').getValue(),
					STND_DATE: Ext.Date.format(Ext.getCmp('s_stnd_date').getValue(),'Ym')
                };
                store.proxy.extraParams = eParams;
			},
			update: function(store, record, operation, modifiedFieldNames){
				if (record.get('WORK_YN') == true || record.get('WORK_YN') == 'Y') {
					record.set('WORK_YN', 'Y');
				} else {
					record.set('WORK_YN', 'N');
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

	var btn_data_reset = Ext.create('Ext.button.Button', {
		id: 'btn_reset',
    	text: '데이터 초기화',
    	icon: '/images/icon/icon_reset.png',
    	handler: function(){

    		var record = m_grid.getView().getSelectionModel().getSelection()[0];

			if (record) {

				if( record.data.STND_DATE == null || record.data.STND_DATE == '') {
					fnShowMessage( parent.msgProperty.COM_ERR_0061 ); // '초기화할 정보를 선택 후 클릭해 주십시오.'
					return;
				}

		    	var params = {
		    			COMP_ID: record.data.COMP_ID,
		    			SHOP_ID: record.data.SHOP_ID,
		    			STND_DATE: record.data.STND_DATE
		    	};

		    	fnSubmitFormStore('/cus/set/SalesInfoMngt/deleteSalesInfoDetlAll.do', params, function(response, opts){
		    		var result = Ext.decode(response.responseText);
		    		var msg = result.message;
		    		fnShowMessage(msg);
		    		m_store.load();
		    		fnInitSearch(d_grid);

		    	});


			} else {

				fnShowMessage( parent.msgProperty.COM_ERR_0061 ); // '초기화할 정보를 선택 후 클릭해 주십시오.'
				return;
			}

    	}
    });

	var btn_search = Ext.create('Ext.button.Button', {
		id: 'btn_search',
    	text: '조회',
    	icon: '/images/icon/icon_search.png',
    	handler: function(){
    		if(Ext.getCmp('s_shop_id').getValue() == '' || Ext.getCmp('s_shop_id').getValue() == null ) {
    			fnShowMessage( parent.msgProperty.COM_ERR_0057.replace('param1', '매장') ); // 매장은 필수 검색조건입니다.
    		} else {
    			m_store.load();
    		}
    	}
	});

	var cellEditingM = Ext.create('Ext.grid.plugin.CellEditing', {
		clicksToEdit: 1
	});

	var m_grid = Ext.create('Ext.grid.Panel', {
    	id: 'm_grid',
        columnLines: true,
        viewConfig: {
        	enableTextSelection: true,
            stripeRows: true
        },
        width: 529,
        height: 516,
        store: m_store,
        plugins: [cellEditingM],
        columns: [{
            text: '일자',
            width: 60,
            dataIndex: 'DATE',
            align: 'center',
            renderer: fnMRenderer
        }, {
            text: '요일',
            width: 60,
            dataIndex: 'DAY',
            align: 'center',
            renderer: fnMRenderer
        }, {
        	xtype: 'booleancolumn',
            text: '휴일',
            width: 60,
            dataIndex: 'WORK_YN',
            align: 'center',
            editor: {
            	xtype: 'checkboxfield',
            	inputValue: 'Y'
            },
            renderer: fnMRenderer
        }, {
            text: '구매고객 수',
            width: 100,
            dataIndex: 'BUY_CS_CNT',
            align: 'right',
            editor: {
            	 xtype: 'numericfield'
            },
            renderer: fnMRenderer
        }, {
            text: '매출금액',
            width: 100,
            dataIndex: 'SALES_AMT',
            align: 'right',
            editor: {
            	xtype: 'numericfield'
            },
            renderer: fnMRenderer
        }, {
            text: 'EVENT 명',
            width: 130,
            dataIndex: 'EVNT_NM',
            renderer: fnMRenderer
        }],
        tbar: [{
        	xtype: 'label',
        	text: '[ 일자별 정보 ]',
        	height: 22,
        	style: 'font-weight:bold;'
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
        	    //btn_reset,
        	    //{xtype: 'tbspacer'},
        	    btn_search
        	]
        }],
        listeners: {
            beforeedit: function(editor, e){
            	if (parent.gvAuthType != 'C') { //고객사로 로그인 하였을 경우에 수정 불가.
            		return false;
                }
            },
        	itemclick: function(view, record, item, index, e){

        		//var record = m_grid.getView().getSelectionModel().getSelection()[0];

    			if (record) {
            		var eParams = {
        					COMP_ID: record.get('COMP_ID'),
        					SHOP_ID: record.get('SHOP_ID'),
        					STND_DATE: record.get('DATE')
                    };
               		d_store.proxy.extraParams = eParams;
                    d_store.load();
    			}

            }
        }
    });

    var d_store = Ext.create('Ext.data.JsonStore', {
		model: 'SALES_INFO_DETL',
		proxy: {
			type: 'ajax',
			api: {
				read: '/cus/set/SalesInfoMngt/selectSalesInfoDetlMngt.do'
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
			//update: function(store, record, operation, modifiedFieldNames){
			//	var m_record = m_grid.getView().getSelectionModel().getSelection()[0];
        	//	if (m_record) {
        	//		var sum = 0;
        	//		for (var i=0; i<store.getCount(); i++) {
        	//			var v = store.getAt(i).get(modifiedFieldNames[0]);
        	//			if (v != null) {
        	//				sum += v;
        	//			}
        	//		}
        	//		m_record.set(modifiedFieldNames[0], sum);
 			//	}
			//}
		}
	});

    var btn_save = Ext.create('Ext.button.Button', {
    	id: 'btn_save',
    	text: '저장',
    	icon: '/images/icon/icon_save.png',
    	width: 60,
    	handler: function(){
    		var m_params = fnSetGridParams(m_store.getUpdatedRecords());
            var d_params = fnSetGridParams(d_store.getUpdatedRecords());

            Ext.Ajax.request({
                url: '/cus/set/SalesInfoMngt/insertOrUpdateSalesInfoMngt.do',
                params: {mainData: m_params, detailData: d_params},
                method: 'POST',
                callback: function(options, success, response){

                },
                success: function(response){
                	var result = Ext.decode(response.responseText);
                    if (result.success) {
                        fnShowMessage(parent.msgProperty.COM_RST_0001, //저장을 완료하였습니다.
                        	Ext.MessageBox.INFO, function(buttonId, text){
    	                        if (buttonId == 'ok') {
    	                            m_store.load();
    	                        }
    	                    }
                        );
                    } else {
                        var msg = '';
                        try {
                            msg = result.message;
                        } catch(err) {
                            msg = parent.msgProperty.COM_ERR_0001; //저장에 실패하였습니다.
                        }
                        fnShowMessage(msg);
                    }
                },
                failure: function(response){
                    fnShowMessage('server-side failure with status code ' + response.status);
                }
            });
    	}
    });

    var cellEditingD = Ext.create('Ext.grid.plugin.CellEditing', {
		clicksToEdit: 1
	});

	var d_grid = Ext.create('Ext.grid.Panel', {
    	id: 'd_grid',
        columnLines: true,
        viewConfig: {
        	enableTextSelection: true,
            stripeRows: true
        },
        width: 279,
        height: 516,
        store: d_store,
        plugins: [cellEditingD],
        columns: [{
            text: '시간',
            width: 60,
            dataIndex: 'TIME',
            align: 'center',
            renderer: fnDRenderer
        }, {
            text: '구매고객 수',
            width: 100,
            dataIndex: 'BUY_CS_CNT',
            align: 'right',
            editor: {
            	xtype: 'numericfield'
            },
            renderer: fnDRenderer
        }, {
            text: '매출금액',
            width: 100,
            dataIndex: 'SALES_AMT',
            align: 'right',
            editor: {
            	xtype: 'numericfield'
            },
            renderer: fnDRenderer
        }],
        tbar: [{
        	xtype: 'label',
        	text: '[ 시간대별 정보 ]',
        	height: 22,
        	style: 'font-weight:bold;'
        }, {
    	   xtype: 'tbfill'
        }, {
        	xtype: 'panel',
        	id: 'l_panel_d',
        	bodyPadding: 0,
        	bodyStyle: 'background-color:transparent;',
        	border: 0,
        	layout: {
        	    type: 'hbox',
        	    align: 'stretch'
        	},
        	items: [
            	btn_data_reset,
            	{xtype: 'tbspacer'},
        	    btn_save
        	]
        }],
        listeners: {
            beforeedit: function(editor, e){
            	if (parent.gvAuthType != 'C') { //고객사로 로그인 하였을 경우에 수정 불가.
            		return false;
                }
            }
        }
    });

	Ext.create('Ext.panel.Panel', {
    	renderTo: 'main_div',
    	bodyPadding: 0,
    	border: 0,
    	layout: 'hbox',
    	items: [m_grid, {xtype: 'tbspacer', width: 10}, d_grid]
    });


	// 권한 타입이 매장일 경우에는 찾기 버튼 삭제한다.
	if(parent.gvAuthType == 'C') {
		Ext.getCmp('btn_shop_search').setVisible(false);
	} else { // 매장일 경우에만 데이터초기화 버튼와 저장 버튼을 보여줌..
		Ext.getCmp('btn_save').setVisible(false);
		Ext.getCmp('btn_reset').setVisible(false);

	}


	fnIframeHeight(516);
});
