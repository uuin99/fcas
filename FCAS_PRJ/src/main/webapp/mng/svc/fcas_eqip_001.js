Ext.define('CODE', {
    extend: 'Ext.data.Model',
    fields: ['CD_TYPE', 'CD', 'CD_TYPE_DESC', 'CD_DESC', 'DISP_ORDR', 'UP_CD_TYPE', 'UP_CD', 'USE_YN']
});


Ext.define('EQIP', {
    extend: 'Ext.data.Model',
    idProperty: 'ROWNUM',
    fields: ['ROWNUM',
             'CMRA_NO','COMP_ID','SHOP_ID','COMP_NM','SHOP_NM','CMRA_NM','CMRA_GRP_ID','CMRA_GRP_NM','INST_DATE','CMRA_STAT',
             'REGI_ID', 'REGI_NM', 'REGI_DT', 'UPDT_ID', 'UPDT_NM', 'UPDT_DT']
});


var cmraStatStore = Ext.create('Ext.data.JsonStore', {
    model: 'CODE',
    data: Ext.decode(cmra_stat)
});

cmraStatStore.filter([
    {property: 'USE_YN', value: 'Y'},
    {filterFn: function(item){
    	return item.get("CD") != '0000';
    }}
]);


function fnRenderer(value, metaData, record, rowIndex, colIndex, store, view){
	//if (colIndex == 1 || colIndex == 2) {
	//	metaData.style = 'background-color:#f6f6f6;';
	//}
    //
	var retValue = null;

	if (colIndex == 4 || colIndex == 8 || colIndex == 9 || colIndex == 10 || colIndex == 11) {
		metaData.style = 'background-color:#f6f6f6;';
	}

	if (colIndex == 7) {
		retValue = fnRendererCode(cmraStatStore, value);
	} else {
		retValue = value;
	}

	return retValue;
}

Ext.onReady(function(){
    Ext.QuickTips.init();

    var store = Ext.create('Ext.data.JsonStore', {
        pageSize: 20,
		model: 'EQIP',
		proxy: {
			type: 'ajax',
			api: {
				read: '/mng/svc/EqipMngt/selectEqipList.do'
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
						INST_DATE_F: Ext.Date.format(Ext.getCmp('s_date_f').getValue(), 'Ymd'),
						INST_DATE_T: Ext.Date.format(Ext.getCmp('s_date_t').getValue(), 'Ymd'),
						CMRA_NM: Ext.getCmp('s_cmra_nm').getValue(),
						CMRA_GRP_ID: Ext.getCmp('s_cmra_grp_id').getValue(),
						COMP_ID: Ext.getCmp('s_comp_id').getValue(),
						SHOP_ID: Ext.getCmp('s_shop_id').getValue()
                };
                store.proxy.extraParams = eParams;
			},
			remove: function(store, record, index){
				if (record.get('ROWNUM') == '') {
					return;
				}
				fnSetElMask();
				var after_fn = function(response, opts){
                    var result = Ext.decode(response.responseText);
                    if (result.success) {
                    	//'삭제를 완료하였습니다.'
                    	fnSetElUnmask();
                        fnShowMessage(parent.msgProperty.COM_RST_0003, Ext.MessageBox.INFO, function(buttonId, text, opt){
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
                        	msg = parent.msgProperty.COM_ERR_0003; //'삭제에 실패하였습니다.';//
                        }
                        store.loadPage(1);
                        fnShowMessage(msg);
                    }
                };
                fnSubmitGridStore(store, '/mng/svc/EqipMngt/deleteEqip.do', after_fn);
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
            		xtype: 'datefield',
            		id: 's_date_f',
            		fieldLabel: '설치일자',
            		value: '',
            		enterEventEnabled:true
            	}, {
            		xtype: 'datefield',
            		id: 's_date_t',
            		fieldLabel: '~',
            		labelWidth: 10,
            		value: '',
            		enterEventEnabled:true
            	}]
            }, {
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
    	    		fieldStyle: 'background:rgb(235,235,235);',
        	        listeners: {
        	            focus: function(obj, The, eOpts){
        	            	obj.focus(false);
        	            	fnOpenCompFindForm('s_comp_id','s_comp_nm');

        	            	// 고객사 찾기 클릭시 매장정보 & 카메라 그룹정보는 삭제한다.
	                		Ext.getCmp('s_shop_id').setValue('');
	                		Ext.getCmp('s_shop_nm').setValue('');
	                		Ext.getCmp('s_cmra_grp_nm').setValue('');
	                		Ext.getCmp('s_cmra_grp_id').setValue('');

        	        	}
        	        }
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
            		labelWidth: 40,
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
            		fieldLabel: '카메라그룹',
            		labelWidth: 70,
        			readOnly: true,
            		enterEventEnabled:true,
    	    		fieldStyle: 'background:rgb(235,235,235);'
            	},{
        			xtype: 'button',
        			text: '찾기',
        			icon: '/images/icon/icon_popup_search02.png',
        			margin: 1,
        			width: 55,
        	    	handler: function(){
        	    		if( Ext.getCmp("s_comp_nm").getValue() == '' ) {
        	    			fnShowMessage(  parent.msgProperty.COM_ERR_0028 ); //'고객사를 먼저 선택해 주십시오.'
        	    		} else if( Ext.getCmp("s_shop_nm").getValue() == '' ) {
        	    			fnShowMessage(  parent.msgProperty.COM_ERR_0045 ); //fnShowMessage('매장을 먼저 선택해 주십시오.');
        	    		} else {
        	    			fnOpenEqipGrpFindForm( 's_cmra_grp_id','s_cmra_grp_nm' , Ext.getCmp("s_comp_id").getValue() , Ext.getCmp("s_shop_id").getValue() );
        	    		}
        	    	}
        		},{
            		xtype: 'hidden',
            		id: 's_comp_id'
            	},{
            		xtype: 'hidden',
            		id: 's_shop_id'
            	},{
            		xtype: 'hidden',
            		id: 's_cmra_grp_id'
            	}]
            }, {
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
            		id: 's_cmra_nm',
            		fieldLabel: '카메라명',
            		enterEventEnabled:true
            	}]
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
    		var rec = new EQIP({
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
		                        msg:  parent.msgProperty.COM_ERR_0004, //'선택한 데이터가 없습니다.',
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
            fnSubmitGridStore(store, '/mng/svc/EqipMngt/insertOrUpdateEqip.do', after_fn);
    	}
    });

    var btn_excel = Ext.create('Ext.button.Button', {
    	id: 'btn_excel',
    	text: 'Excel Export',
    	icon: '/images/icon/icon_excel.png',
    	handler: function(){

			var colVal = "COMP_NM,SHOP_NM,CMRA_GRP_NM,CMRA_NO,CMRA_NM,INST_DATE,CMRA_STAT_NM,REGI_NM,REGI_DT,UPDT_NM,UPDT_DT"
			var titalVal = "고객사,매장,카메라그룹명,카메라ID,카메라명,설치일자,운용상태,등록자,등록일시,수정자,수정일시"

				var excelFormObjs = {
    			    hiddenType:[
    			        { "NAME":"SHEET_NAME", 	"VALUE": "시간대별 입장_체류" },
    			        { "NAME":"COLS", 		"VALUE":  colVal},
    			        { "NAME":"TITLE", 		"VALUE":  titalVal},
    			        { "NAME":"SQLID", 		"VALUE": "eqipmngt.getEqipList" },
    			        { "NAME":"COMP_ID", "VALUE": Ext.getCmp('s_comp_id').getValue() == null ? "" : Ext.getCmp('s_comp_id').getValue() },
    			        { "NAME":"SHOP_ID", "VALUE": Ext.getCmp('s_shop_id').getValue() == null ? "" : Ext.getCmp('s_shop_id').getValue() },
    			        { "NAME":"INST_DATE_F", 	"VALUE": Ext.Date.format(Ext.getCmp('s_date_f').getValue(), 'Ymd') == null ? "" : Ext.Date.format(Ext.getCmp('s_date_f').getValue(), 'Ymd')},
    			        { "NAME":"INST_DATE_T", 	"VALUE": Ext.Date.format(Ext.getCmp('s_date_t').getValue(), 'Ymd') == null ? "" : Ext.Date.format(Ext.getCmp('s_date_t').getValue(), 'Ymd')},
    			        { "NAME":"CMRA_NM", "VALUE": Ext.getCmp('s_cmra_nm').getValue() == null ? "" : Ext.getCmp('s_cmra_nm').getValue() },
    			        { "NAME":"CMRA_GRP_ID", "VALUE": Ext.getCmp('s_cmra_grp_id').getValue() == null ? "" : Ext.getCmp('s_cmra_grp_id').getValue() }
    			    ]
    			};
    		fnDownloadExcel(excelFormObjs);
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
            text     : '카메라 그룹명' + fnRequiredValue(),
            width    : 100,
            dataIndex: 'CMRA_GRP_NM',
            renderer: fnRenderer
        }, {
            text     : '카메라 ID',
            width    : 100,
            dataIndex: 'CMRA_NO',
            renderer: fnRenderer
        }, {
            text     : '카메라 명',
            width    : 100,
            dataIndex: 'CMRA_NM',
            renderer: fnRenderer,
            editor: {
            	maxLength:150
            }
        }, {
            text     : '설치일자',
            width    : 100,
            dataIndex: 'INST_DATE',
            renderer: fnRenderer,
            editor: {
                xtype: 'datefield',
                format: 'Y-m-d',
                altFormats: 'm,d,Y|m.d.Y|Ymd'
            },
            renderer: function(value, metadata, record, rowIndex, colIndex, store) {
                var returnV = fnChangeFormatDash( value ) ;
                if (Ext.isDate(returnV)) {
                    returnV = Ext.Date.format(returnV, 'Y-m-d');
                }
                return returnV;
            }
        }, {
            text     : '운용상태',
            width    : 100,
            dataIndex: 'CMRA_STAT',
            renderer: fnRenderer,
            editor: {
            	xtype: 'combobox',
                store: cmraStatStore,
                valueField: 'CD',
                displayField: 'CD_DESC',
                editable: false,
                queryMode: 'local'
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
            beforeedit: function(editor, e){
                if (e.field == 'CD_TYPE' || e.field == 'CD') {
                    if (e.record.get('ROWNUM') != '') {
                        e.cancel = true;
                    }
                }
            }, cellclick: function(obj, td, cellIndex, record, tr, rowIndex, e, eOpts){
            	if(cellIndex == 1) {
            		fnOpenCompFind( grid );

            	    // 고객사 찾기 클릭시 매장정보& 카메라 그룹정보는 삭제한다.
            		var rec = grid.getSelectionModel().getSelection()[0];
            		rec.set('SHOP_NM','');
            		rec.set('SHOP_ID','');
            		rec.set('CMRA_GRP_NM','');
            		rec.set('CMRA_GRP_ID','');

            	} else if(cellIndex == 2) {
            		if( record.data.COMP_ID == null || record.data.COMP_ID == '') {
            			fnShowMessage(  parent.msgProperty.COM_ERR_0028 ); //'고객사를 먼저 선택해 주십시오.'
            		} else {
            			fnOpenShopFind( grid , record.data.COMP_ID );

                	    // 매장 찾기 클릭시 카메라 그룹정보는 삭제한다.
                		var rec = grid.getSelectionModel().getSelection()[0];

                		rec.set('CMRA_GRP_NM','');
                		rec.set('CMRA_GRP_ID','');

            		}
            	} else if(cellIndex == 3) {
            		if( record.data.COMP_ID == null || record.data.COMP_ID == '') {
            			fnShowMessage(  parent.msgProperty.COM_ERR_0028 ); //'고객사를 먼저 선택해 주십시오.'
            		} else if( record.data.SHOP_ID == null || record.data.SHOP_ID == '') {
            			fnShowMessage(  parent.msgProperty.COM_ERR_0045 ); //매장을 먼저 선택하여 주십시오.
            		} else {
            			fnOpenEqipGrpFind( grid , record.data.COMP_ID , record.data.SHOP_ID );
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
