
Ext.define('EQIP_GRP', {
    extend: 'Ext.data.Model',
    idProperty: 'ROWNUM',
    fields: ['ROWNUM',
             'CMRA_GRP_ID','COMP_ID','SHOP_ID','COMP_NM','SHOP_NM' ,'CMRA_GRP_NM' ,'DISP_ORDR','TOTAL_YN',
             'REGI_ID', 'REGI_NM', 'REGI_DT', 'UPDT_ID', 'UPDT_NM', 'UPDT_DT']
});


var storeYN = new Ext.data.SimpleStore({
	fields: ['CODE_ID', 'CODE_NAME'],
	data : 	[
        ['Y', 'Y'],
        ['N', 'N']
    ]
});


function fnRenderer(value, metaData, record, rowIndex, colIndex, store, view){
	if (colIndex == 1 || colIndex == 2) {
		metaData.style = 'background-color:#f6f6f6;';
	}

	if (colIndex == 6 || colIndex == 7 || colIndex == 8 || colIndex == 9) {
		metaData.style = 'background-color:#f6f6f6;';
	}

	//if (colIndex == 3) {
	//	return fnRendererCode(addrDivStore, value);
	//} else {
	//	return value;
	//}
	return value;
}

Ext.onReady(function(){
    Ext.QuickTips.init();

    var store = Ext.create('Ext.data.JsonStore', {
        pageSize: 20,
		model: 'EQIP_GRP',
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
						CMRA_GRP_NM: Ext.getCmp('s_cmra_grp_nm').getValue(),
						COMP_ID: Ext.getCmp('s_comp_id').getValue(),
						SHOP_ID: Ext.getCmp('s_shop_id').getValue()
                };
                store.proxy.extraParams = eParams;
			},
			remove: function(store, record, index){
				if (record.get('ROWNUM') == '') {
					return;
				}

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
                        store.loadPage(1);
                        fnShowMessage(msg);
                    }
                };
                fnSubmitGridStore(store, '/mng/svc/EqipGrpMngt/deleteEqipGrp.do', after_fn);
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
    			labelSeparator: '',
    			labelWidth: 90,
    			width: 220
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
        		xtype: 'textfield',
        		id: 's_cmra_grp_nm',
        		fieldLabel: '카메라그룹명',
        		enterEventEnabled:true
        	},{
        		xtype: 'hidden',
        		id: 's_comp_id'
        	},{
        		xtype: 'hidden',
        		id: 's_shop_id'
        	}]
    	}
    });

    var btn_add = Ext.create('Ext.button.Button', {
    	id: 'btn_add',
    	text: '행추가',
    	icon: '/images/icon/icon_add.png',
    	width: 60,
    	handler: function(){
    		var cnt = store.getCount();
    		var edit = grid.getPlugin();
    		var rec = new EQIP_GRP({
    			ROWNUM:''
    		});

			edit.cancelEdit();
			store.insert(cnt, rec);
			edit.startEditByPosition({
				row: cnt,
				column: 1
			});
    	}
    });

    var btn_delete = Ext.create('Ext.button.Button', {
    	id: 'btn_delete',
    	text: '행삭제',
    	icon: '/images/icon/icon_delete.png',
    	width: 60,
    	handler: function(){
    		//'삭제 하시겠습니까?'
    		Ext.MessageBox.confirm('FCAS', parent.msgProperty.COM_IFO_0001 ,
    			function(btnid){
        			if (btnid == 'yes') {
        				var record = grid.getView().getSelectionModel().getSelection()[0];
        				if (record) {
        					store.remove(record);
        				} else {
        					Ext.MessageBox.show({
		                        title: 'FCAS',
		                        msg: parent.msgProperty.COM_ERR_0004, //'선택한 데이터가 없습니다.',
		                        icon: Ext.MessageBox.INFO,
		                        buttons: Ext.MessageBox.OK
		                    });
        				}
        			}
        		}
    		);
    	}
    });

    var btn_save = Ext.create('Ext.button.Button', {
    	id: 'btn_save',
    	text: '저장',
    	icon: '/images/icon/icon_save.png',
    	width: 60,
    	handler: function(){
    		fnSetElMask();
    		var after_fn = function(response, opts){
                var result = Ext.decode(response.responseText);
                if (result.success) {
                	//저장을 완료하였습니다.
                	fnSetElUnmask();
                    fnShowMessage( parent.msgProperty.COM_RST_0001, Ext.MessageBox.INFO, function(buttonId, text, opt){
                        if (buttonId == 'ok') {
                            store.loadPage(1);
                        }
                    });
                } else {
                	fnSetElUnmask();
                    var msg = '';
                    try {
                        msg = result.message;
                    } catch(err) {
                    	msg = parent.msgProperty.COM_ERR_0001;  //'저장에 실패하였습니다.';
                    }
                    fnShowMessage(msg);
                }
            };
            fnSubmitGridStore(store, '/mng/svc/EqipGrpMngt/insertOrUpdateEqipGrp.do', after_fn);
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
    	}
    });

	var btn_search = Ext.create('Ext.button.Button', {
		id: 'btn_search',
    	text: '조회',
    	icon: '/images/icon/icon_search.png',
    	handler: function(){
    		store.loadPage(1);
    	}
	});

	var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
		clicksToEdit: 1
	});

    var grid = Ext.create('Ext.grid.Panel', {
    	id: 'grid',
        renderTo: 'main_div',
        columnLines: true,
        viewConfig: {
        	enableTextSelection: true,
            stripeRows: true
        },
        width: 'auto',
        height: 516,
        store: store,
        plugins: [cellEditing],
        columns: [{
        	xtype: 'rownumberer',
        	text : 'No',
        	width: 40,
        	align: 'center'
        }, {
            text     : '고객사' + fnRequiredValue(),
            width    : 140,
            dataIndex: 'COMP_NM',
            renderer: fnRenderer
        }, {
            text     : '매장' + fnRequiredValue(),
            width    : 100,
            dataIndex: 'SHOP_NM',
            renderer: fnRenderer
        }, {
            text     : '카메라그룹명',
            width    : 100,
            dataIndex: 'CMRA_GRP_NM',
            renderer: fnRenderer,
            editor: {
            	maxLength:70
            }
        }, {
            text     : '집계여부',
            width    : 100,
            dataIndex: 'TOTAL_YN',
            renderer: fnRenderer,
            editor: {
            	xtype: 'combobox',
                store: storeYN,
                valueField: 'CODE_ID',
                displayField: 'CODE_NAME',
                queryMode: 'local'
            }
        }, {
            text     : '표시순서',
            width    : 100,
            dataIndex: 'DISP_ORDR',
            renderer: fnRenderer,
            editor: {
            	maxLength:3,
            	numericVarcharFieldEnabled: true
            }
        },{
            text     : '등록자',
            width    : 60,
            dataIndex: 'REGI_NM',
        	align: 'center',
        	renderer: fnRenderer
        }, {
            text     : '등록일시',
            width    : 110,
            dataIndex: 'REGI_DT',
        	align: 'center',
        	renderer: fnRenderer
        }, {
            text     : '수정자',
            width    : 60,
            dataIndex: 'UPDT_NM',
        	align: 'center',
        	renderer: fnRenderer
        }, {
            text     : '수정일시',
            width    : 110,
            dataIndex: 'UPDT_DT',
        	align: 'center',
        	renderer: fnRenderer
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
        	    btn_add,
        	    {xtype: 'tbspacer'},
        	    btn_delete,
        	    {xtype: 'tbspacer'},
        	    btn_save
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
            beforeedit: function(editor, e){
                if (e.field == 'CD_TYPE' || e.field == 'CD') {
                    if (e.record.get('ROWNUM') != '') {
                        e.cancel = true;
                    }
                }
            }, cellclick: function(obj, td, cellIndex, record, tr, rowIndex, e, eOpts){
            	if(cellIndex == 1) {

            		var rec = grid.getSelectionModel().getSelection()[0];

            		if(rec.get('ROWNUM') == '') {
                		fnOpenCompFind( grid );
                	    // 고객사 찾기 클릭시 매장정보는 삭제한다.
                		rec.set('SHOP_NM','');
                		rec.set('SHOP_ID','');
            		} else {
            			//fnShowMessage( parent.msgProperty.COM_ERR_0038.replace('param1', '고객사') ); //param1(은)는 수정할 수 없습니다. 삭제후 재등록 해주십시오.

            		}


            	} else if(cellIndex == 2) {

            		var rec = grid.getSelectionModel().getSelection()[0];

            		if(rec.get('ROWNUM') == '') {
                		if( record.data.COMP_ID == null || record.data.COMP_ID == '') {
                			fnShowMessage(  parent.msgProperty.COM_ERR_0028 ); //'고객사를 먼저 선택해 주십시오.'
                		} else {
                			fnOpenShopFind( grid , record.data.COMP_ID );
                		}
            		} else {
            			//fnShowMessage( parent.msgProperty.COM_ERR_0038.replace('param1', '매장') ); //param1(은)는 수정할 수 없습니다. 삭제후 재등록 해주십시오.
            		}

            	}

        	}
        }
    });

    //Resize
    //Ext.getCmp('grid').setSize(w, h);

    //Default Value Setting
    fnIframeHeight(516);

});
