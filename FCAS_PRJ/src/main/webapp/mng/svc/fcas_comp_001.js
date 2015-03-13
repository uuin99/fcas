var repChkTaxNoFlag = "N";
var isFormExpanded = false;
//공통코드 Model
Ext.define('CODE', {
    extend: 'Ext.data.Model',
    fields: ['CD_TYPE', 'CD', 'CD_TYPE_DESC', 'CD_DESC', 'DISP_ORDR', 'UP_CD_TYPE', 'UP_CD', 'USE_YN']
});

//고객사 Grid Model
Ext.define('COMP_LIST', {
    extend: 'Ext.data.Model',
    idProperty: 'ROWNUM',
    fields: ['ROWNUM',
             'COMP_ID','COMP_TYPE','COMP_DIV','COMP_NM','COMP_REGI_NO','TAX_NO','ADDR1','ADDR1_CD','ADDR2','MAST_NM',
             'BIZ_TYPE','BIZ_ITEM','CUST_MNG_NM','CUST_MAIL_ID','CUST_MAIL_DOMAIN','CUST_CELL_NO','CUST_OFIC_NO','CUST_OFIC_FAX','CLNT_CODE','RMRK',
             'COMP_TYPE_NM','COMP_DIV_NM','CUST_MAIL','REGI_ID', 'REGI_NM', 'REGI_DT', 'UPDT_ID', 'UPDT_NM', 'UPDT_DT','TAX_NO_VIEW',
             'CUST_MAIL_INFO']
});

//고객사 Form Model
Ext.define('COMP', {
    extend: 'Ext.data.Model',
    idProperty: 'COMP_ID',
    fields: ['COMP_ID','COMP_TYPE','COMP_DIV','COMP_NM','COMP_REGI_NO','TAX_NO','ADDR1','ADDR1_CD','ADDR2','MAST_NM',
             'BIZ_TYPE','BIZ_ITEM','CUST_MNG_NM','CUST_MAIL_ID','CUST_MAIL_DOMAIN','CUST_CELL_NO','CUST_OFIC_NO','CUST_OFIC_FAX','CLNT_CODE','RMRK',
             'COMP_TYPE_NM','COMP_DIV_NM','CUST_MAIL','REGI_ID', 'REGI_NM', 'REGI_DT', 'UPDT_ID', 'UPDT_NM', 'UPDT_DT','F_TAX_NO',
             'M_TAX_NO','L_TAX_NO','REGI_INFO','UPDT_INFO','FILE_UID','FILE_NM','FILE_SEQ']
});



Ext.onReady(function(){
    Ext.QuickTips.init();
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
    
    //대외/관계사구분 Combo Store
    var compDivStore = Ext.create('Ext.data.JsonStore', {
    	model: 'CODE',
    	data: Ext.decode(comp_div)
    });
    
    compDivStore.filter([
	    {property: 'USE_YN', value: 'Y'},
	    {filterFn: function(item){
	    	return item.get("CD") != '0000';
	    }}
	]);
    
    //사업자구분 Combo Store    
    var compTypeStore = Ext.create('Ext.data.JsonStore', {
    	model: 'CODE',
    	data: Ext.decode(comp_type)
    });
    
    compTypeStore.filter([
	    {property: 'USE_YN', value: 'Y'},
	    {filterFn: function(item){
	    	return item.get("CD") != '0000';
	    }}
	]);
    
    //Gird Store
    var store = Ext.create('Ext.data.JsonStore', {
        pageSize: 20,
		model: 'COMP_LIST',
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
						COMP_NM: Ext.getCmp('s_comp_nm').getValue(),
						TAX_NO: Ext.getCmp('s_tax_no').getValue(),
						MAST_NM: Ext.getCmp('s_mast_nm').getValue(),
						CUST_MNG_NM: Ext.getCmp('s_cust_mng_nm').getValue()
                };
                store.proxy.extraParams = eParams;
			}
		}
	});

    //입력폼 Store    
    var form_store = Ext.create('Ext.data.JsonStore', {
        pageSize: 10,
		model: 'COMP',
		proxy: {
			type: 'ajax',
			api: {
				read: '/mng/svc/CompMngt/selectComp.do'
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
                        fnShowMessage(parent.msgProperty.COM_RST_0003 , Ext.MessageBox.INFO, function(buttonId, text, opt){//삭제를 완료하였습니다.
                            if (buttonId == 'ok') {
                                store.loadPage(1);
                            }
                        });
                    } else {
                        var msg = '';
                        try {
                            msg = result.message;
                        } catch(err) {
                            msg = parent.msgProperty.COM_ERR_0003;//삭제에 실패하였습니다. 
                        } 
                        store.loadPage(1);
                        fnShowMessage(msg);
                    }
                };
                
                fnSubmitGridStore(store, '/mng/brd/CommBrd/deleteCommBrd.do', after_fn);
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
        		xtype: 'textfield',
        		id: 's_comp_nm',
        		fieldLabel: '상호',
        		enterEventEnabled:true
        	},{
        		xtype: 'textfield',
        		id: 's_tax_no',
        		fieldLabel: '사업자번호',
        		enterEventEnabled:true
        	},{
        		xtype: 'textfield',
        		id: 's_mast_nm',
        		fieldLabel: '대표자명',
        		enterEventEnabled:true
        	},{
        		xtype: 'textfield',
        		id: 's_cust_mng_nm',
        		fieldLabel: '담당자명',
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
    		if (isFormExpanded) {
    			fnSaveForm();
    		} else {
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
    		var selectedCompId = Ext.getCmp('COMP_ID').getValue(); 
    		if (selectedCompId == null || selectedCompId == '') {
    			fnShowMessage(parent.msgProperty.COM_ERR_0022);//삭제할 데이터를 먼저 선택하여 주시기 바랍니다.
    			return;
    		} else {
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
        	text: '고객사 정보',
        	columns: [{
        		text: '대외/관계사',
                width    : 80,
                dataIndex: 'COMP_DIV',
                align: 'center',
                renderer: function(value, metaData, record, rowIndex, colIndex, store, view){
                	return fnRendererCode(compDivStore, value);
                }
        	}, {
        		text: '상호',
                width    : 200,
                dataIndex: 'COMP_NM'
        	}, {
        		text: '사업자번호',
                width    : 80,
                align: 'center',
                dataIndex: 'TAX_NO_VIEW'
        	}, {
        		text: '대표명',
                width    : 80,
                dataIndex: 'MAST_NM'
        	}, {
        		text: '거래처코드',
                width    : 80,
                align: 'center',
                dataIndex: 'CLNT_CODE'
        	}]
        }, {
        	text: '고객담당자',
        	columns: [{
        		text: '이름',
                width    : 80,
                dataIndex: 'CUST_MNG_NM'
        	}, {
        		text: '핸드폰번호',
                width    : 100,
                dataIndex: 'CUST_CELL_NO'
        	}, {
        		text: '사무실번호',
                width    : 100,
                dataIndex: 'CUST_OFIC_NO'
        	}, {
        		text: 'FAX',
                width    : 100,
                dataIndex: 'CUST_OFIC_FAX'
        	}, {
        		text: '메일',
                width    : 150,
                dataIndex: 'CUST_MAIL_INFO'
        	}]
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
        		fnOpenLoadForm(record.data.COMP_ID);
        	}
        }
    });

	//입력폼    
    var form = Ext.create('Ext.form.Panel', {
    	id: 'form',
    	title: '고객사 상세',
    	frame: true,
    	height: 550,
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
    	layout: {
    	    type: 'table',
    	    columns: 2
    	},
    	style: {
    		backgroundColor: 'white'
    	},
    	items: [{
    		xtype: 'fieldset',
            title: '고객사 정보',
            defaultType: 'textfield',
            layout: 'anchor',
            colspan: 2,
            margin: "1 10 1 10",
            defaults: {
                anchor: '100%'
            },
        	layout: {
        	    type: 'table',
        	    columns: 2
        	},
        	style: {
        		backgroundColor: 'rgb(223, 233, 246)'
        	},
        	items: [{
            	xtype: 'combobox',
        		id: 'COMP_DIV',
        		name: 'COMP_DIV',
        		fieldLabel: '대외/관계사구분',
        		store: compDivStore,
        	    queryMode: 'local',
        	    valueField: 'CD',
        	    displayField: 'CD_DESC',
        	    editable: false,
        		afterLabelTextTpl: fnRequiredValue()
        	}, {
        		xtype: 'combobox',
        		id: 'COMP_TYPE',
        		name: 'COMP_TYPE',
        		fieldLabel: '사업자구분',
        		store: compTypeStore,
        	    queryMode: 'local',
        	    valueField: 'CD',
        	    displayField: 'CD_DESC',
        		afterLabelTextTpl: fnRequiredValue(),
        	    editable: false
        	}, {
        		xtype: 'textfield',
        		id: 'COMP_NM',
        		name: 'COMP_NM',
        		fieldLabel: '상호명',
        		afterLabelTextTpl: fnRequiredValue(),
        		colspan: 2,
        		width: 762,
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
	            		xtype: 'textfield',
	            		id: 'F_TAX_NO',
	            		name: 'F_TAX_NO',
	            		fieldLabel: '사업자등록번호',
	            		regex: new RegExp(/^\d{3}?$/),
	            		regexText: '숫자만 입력하여 주세요.',
	            		afterLabelTextTpl: fnRequiredValue(),
	            		numericVarcharFieldEnabled: true,
	            		labelWidth: 100,
	            		maxLength: 3,
	            		width: 140,
	    	    	    listeners: {
	    	    	    	change: function(obj, newVal, oldVal, eOpts){
	    	    	    		//수정시 재 검증.
	    	    	    		repChkTaxNoFlag = 'N';
	    	    	    		//값의 Max Length 입력 시 다음 입력칸으로 자동 입력되도록 함.
	    	    	    		if(newVal.length == 3){
	    	    	    			Ext.getCmp('M_TAX_NO').focus();
	    	    	    		}
	    	    	    	}
	    	    	    }
	        		},{
	            		xtype: 'textfield',
	            		id: 'M_TAX_NO',
	            		name: 'M_TAX_NO',
	            		fieldLabel: '-',
	            		regex: new RegExp(/^\d{2}?$/),
	            		labelWidth: 5,
	            		regexText: '숫자만 입력하여 주세요.',
	            		mandatoryLabel: '사업자등록번호',
	            		numericVarcharFieldEnabled: true,
	            		maxLength: 2,
	            		width: 40,
	    	    	    listeners: {
	    	    	    	change: function(obj, newVal, oldVal, eOpts){
	    	    	    		//수정시 재 검증.	    	    	    		
	    	    	    		repChkTaxNoFlag = 'N';
	    	    	    		//값의 Max Length 입력 시 다음 입력칸으로 자동 입력되도록 함.
	    	    	    		if(newVal.length == 2){
	    	    	    			Ext.getCmp('L_TAX_NO').focus();
	    	    	    		}
	    	    	    	}
	    	    	    }
	        		},{
	            		xtype: 'textfield',
	            		id: 'L_TAX_NO',
	            		name: 'L_TAX_NO',
	            		fieldLabel: '-',
	            		regex: new RegExp(/^\d{5}?$/),
	            		regexText: '숫자만 입력하여 주세요.',
	            		mandatoryLabel: '사업자등록번호',
	            		numericVarcharFieldEnabled: true,
	            		labelWidth: 5,
	            		maxLength: 5,
	            		width: 60,
	    	    	    listeners: {
	    	    	    	change: function(obj, newVal, oldVal, eOpts){
	    	    	    		//수정시 재 검증.	    	    	    		
	    	    	    		repChkTaxNoFlag = 'N';
	    	    	    		//값의 Max Length 입력 시 다음 입력칸으로 자동 입력되도록 함.
	    	    	    		if(newVal.length == 3){
	    	    	    			
	    	    	    		}
	    	    	    	}
	    	    	    }
	        		},{
	        			xtype: 'button',
	        			text: '등록번호검증',
	        			icon: '/images/icon/icon_check.png',
	        			margin: 1,
	        	    	handler: function(){
	        	    		var texNoStr = Ext.getCmp('F_TAX_NO').getValue() + '' + Ext.getCmp('M_TAX_NO').getValue() + '' + Ext.getCmp('L_TAX_NO').getValue();
	        	    		if (!fnCheckTexNo(Ext.getCmp('COMP_TYPE').getValue(), texNoStr  )) return;
	        	    		fnDistinctValue('TAX_NO', texNoStr, '사업자등록번호');
	        	    	}
	        		}]
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
	            		id: 'F_COMP_REGI_NO',
	            		name: 'F_COMP_REGI_NO',
	            		fieldLabel: '법인등록번호',
	            		regex: new RegExp(/^\d{6}?$/),
	            		regexText: '숫자만 입력하여 주세요.',
	            		numericVarcharFieldEnabled: true,
	            		labelWidth: 100,
	            		maxLength: 6,
	            		width: 160,
	    	    	    listeners: {
	    	    	    	change: function(obj, newVal, oldVal, eOpts){
	    	    	    		//값의 Max Length 입력 시 다음 입력칸으로 자동 입력되도록 함.
	    	    	    		if(newVal.length == 6){
	    	    	    			Ext.getCmp('L_COMP_REGI_NO').focus();
	    	    	    		}
	    	    	    	}
	    	    	    }
	        		},{
	            		xtype: 'textfield',
	            		id: 'L_COMP_REGI_NO',
	            		name: 'L_COMP_REGI_NO',
	            		fieldLabel: '-',
	            		regex: new RegExp(/^\d{7}?$/),
	            		labelWidth: 5,
	            		regexText: '숫자만 입력하여 주세요.',
	            		//mandatoryLabel: '법인등록번호',
	            		numericVarcharFieldEnabled: true,
	            		maxLength: 7,
	            		width: 70,
	    	    	    listeners: {
	    	    	    	change: function(obj, newVal, oldVal, eOpts){
	    	    	    		//값의 Max Length 입력 시 다음 입력칸으로 자동 입력되도록 함.
	    	    	    		if(newVal.length == 7){
	    	    	    			
	    	    	    		}
	    	    	    	}
	    	    	    }
	        		}]
        	}, {
        		xtype: 'AddrPanel',
        		addr1Label: '사업장 주소',
        		addr1FieldNm: 'ADDR1',
        		addr1CdFieldNm: 'ADDR1_CD',
        		addr2Label: '사업장 상세 주소',
        		addr2FieldNm: 'ADDR2',
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
        		xtype: 'textfield',
        		id: 'BIZ_TYPE',
        		name: 'BIZ_TYPE',
        		fieldLabel: '업태',
        		maxLength: 300
        	}, {
        		xtype: 'textfield',
        		id: 'BIZ_ITEM',
        		name: 'BIZ_ITEM',
        		fieldLabel: '종목',
        		maxLength: 300
        	}, {
        		xtype: 'textfield',
        		id: 'MAST_NM',
        		name: 'MAST_NM',
        		fieldLabel: '대표자명',
        		maxLength: 50
        	}, {
        		xtype: 'textfield',
        		id: 'CLNT_CODE',
        		name: 'CLNT_CODE',
        		fieldLabel: '거래처코드',
        		maxLength: 20
        	}, {
        		xtype: 'FileMastPanel',
        		border:0,
        		padding: 0,
	    		margin: 0,
	    		colspan: 2,
	    		panelMode: 'edit',
	    		fileUidIdNm: 'FILE_UID',
	    		fileSeqIdNm: 'FILE_SEQ',
	    		fileNmIdNm: 'FILE_NM'
        	}]
    	}, {
    		xtype: 'fieldset',
            title: '담당자 정보',
            defaultType: 'textfield',
            layout: 'anchor',
            colspan: 2,
            margin: "1 10 1 10",
            defaults: {
                anchor: '100%'
            },
        	layout: {
        	    type: 'table',
        	    columns: 2
        	},
        	style: {
        		backgroundColor: 'rgb(223, 233, 246)'
        	},
            items: [{
        		xtype: 'textfield',
        		id: 'CUST_MNG_NM',
        		name: 'CUST_MNG_NM',
        		fieldLabel: '담당자명',
        		afterLabelTextTpl: fnRequiredValue(),
        		maxLength: 20
        	}, {
        		xtype: 'textfield',
        		id: 'CUST_CELL_NO',
        		name: 'CUST_CELL_NO',
        		fieldLabel: '핸드폰번호',
        		regex: new RegExp(/[01](0|1|6|7|8|9)[-](\d{4}|\d{3})[-]\d{4}$/),
        		regexText: '핸드폰번호 형식(010-0000-0000)을 맞추어 주세요',
        		maxLength: 16,
        		afterLabelTextTpl: fnRequiredValue()
        	}, {
        		xtype: 'textfield',
        		id: 'CUST_OFIC_NO',
        		name: 'CUST_OFIC_NO',
        		fieldLabel: '사무실번호',
        		regex: new RegExp(/^\d{1,16}|[-]|[(]|[)]?$/),
        		regexText: '사무실 번호를 형식에 맞게 입력하여 주세요.',
        		maxLength: 16
        	}, {
        		xtype: 'textfield',
        		id: 'CUST_OFIC_FAX',
        		name: 'CUST_OFIC_FAX',
        		fieldLabel: 'FAX 번호',
        		regex: new RegExp(/^\d{1,16}|[-]|[(]|[)]?$/),
        		regexText: 'FAX번호를 형식에 맞게 입력하여 주세요.',
        		maxLength: 16,
        		colspan: 2
        	}, {
        		xtype: 'textfield',
        		id: 'CUST_MAIL_ID',
        		name: 'CUST_MAIL_ID',
        		fieldLabel: '메일',
        		maxLength: 50
        	}, {
        		xtype: 'panel',
        		border:0,
        		padding: 0,
    	    	margin: 0,
    	    	bodyStyle:'background-color:transparent',
        		layout: {
        			type:'hbox',
        			aligh:'stretch'
        		},
        		items: [{
            		xtype: 'textfield',
            		id: 'CUST_MAIL_DOMAIN',
            		name: 'CUST_MAIL_DOMAIN',
            		width: 130,
            		labelWidth:10,
            		fieldLabel: '@',
            		maxLength: 50
        		},{
        			xtype: 'combobox',
    	    		store: emailStore,
    	    	    queryMode: 'local',
    	    	    valueField: 'CD',
    	    	    displayField: 'CD_DESC',
    	    	    width: 136,
    	    	    editable: false,
    	    	    listeners: {
    	    	    	change: function(field, newValue, oldValue){
    	    	    		if (newValue == '[ 직접 입력 ]') {
    	    	    			Ext.getCmp('CUST_MAIL_DOMAIN').setValue('');
    	    	    			Ext.getCmp('CUST_MAIL_DOMAIN').setReadOnly(false);
    	    	    		} else {
    	    	    			Ext.getCmp('CUST_MAIL_DOMAIN').setValue(newValue);
    	    	    			Ext.getCmp('CUST_MAIL_DOMAIN').setReadOnly(true);
    	    	    		}
    	    	    	}
    	    	    }
        		}]
        	}]
    	}, {
    		xtype: 'fieldset',
            title: '특이사항',
            defaultType: 'textfield',
            layout: 'anchor',
            colspan: 2,
            margin: "1 10 1 10",
            defaults: {
                anchor: '100%'
            },
        	layout: {
        	    type: 'table',
        	    columns: 2
        	},
        	style: {
        		backgroundColor: 'rgb(223, 233, 246)'
        	},
            items: [{
        		xtype: 'textarea',
        		id: 'RMRK',
        		name: 'RMRK',
        		fieldLabel: '특이사항',
        		width: 762,
            	colspan: 2,
            	maxLength: 8000
        	}]
    	},{
    		xtype: 'fieldset',
            title: '이력정보',
            defaultType: 'textfield',
            layout: 'anchor',
            colspan: 2,
            margin: "1 10 1 10",
            defaults: {
                anchor: '100%'
            },
        	layout: {
        	    type: 'table',
        	    columns: 2
        	},
        	style: {
        		backgroundColor: 'rgb(223, 233, 246)'
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
        	}, {
            xtype: 'hidden',
            id: 'COMP_ID',
            name: 'COMP_ID'
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
    function fnOpenLoadForm(compId){
    	var eParams = {
    			COMP_ID: compId
            };
        form_store.proxy.extraParams = eParams;
        form_store.load({
        	scope: this,
            callback: function(records, operation, success) {
            	if (records.length == 1) {
            		form.loadRecord(records[0]);
            		form.expand();            		
            		repChkTaxNoFlag = "Y";
            	} else {
            		fnShowMessage("");
            		return;
            	}
            }
        });
    }    
    
    //저장 Button
    function fnSaveForm(){
    	
    	//From Default Validation.
    	if(fnIsFormDfultValid(form)){
    		return;
    	}
    	
    	/* 사용자 정의 Validation Start */
    	var compType = Ext.getCmp('COMP_TYPE').getValue();//사업자구분
    	var fCompRegiNo = Ext.getCmp('F_COMP_REGI_NO').getValue();//법인등록번호(앞)
    	var lCompRegiNo = Ext.getCmp('L_COMP_REGI_NO').getValue();//법인등록번호(뒤)
    	if (repChkTaxNoFlag == 'N') {
    		fnShowMessage(parent.msgProperty.COM_ERR_0024);//사업자등록번호 검증을 하여 주시기 바랍니다.
    		return;
    	} else if (compType == 'C' && ((fCompRegiNo == null || fCompRegiNo == '') || (lCompRegiNo == null || lCompRegiNo == ''))) { //법인 사업자일 경우에만 법인등록번호 검증.
    		fnShowMessage(parent.msgProperty.COM_ERR_0025);//법인 사업자의 경우 법인등록번호는 필수 입력 사항입니다.
    		return;
    	}
    	/* 사용자 정의 Validation End */
    	fnSetElMask();
    	form.getForm().submit({
    		url: '/mng/svc/CompMngt/insertOrUpdateComp.do',
    		success: function(form, action){
    			fnSetElUnmask();
    			fnShowMessage(action.result.message);//저장을 완료하였습니다.
    			fnSearchGrid();
    		},
    		failure: function(form, action){
    			fnSetElUnmask();
    			fnShowMessage(action.result.message);//저장에 실패하였습니다.
    		}
    	});
    }
    
    //삭제 Button
    function fnRemoveForm(){
    	Ext.MessageBox.confirm('FCAS', parent.msgProperty.COM_IFO_0001, //삭제하시겠습니까?
			function(btnid){
    			if (btnid == 'yes') {
    				fnSetElMask();
    		    	var frm = form.getForm();
    		    	frm.submit({
    		    		url: '/mng/svc/CompMngt/deleteComp.do',
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
    
    //중복 값 Check
    function fnDistinctValue(id, valStr, idLabel){
    	var params = {
    			COMP_ID: Ext.getCmp('COMP_ID').getValue(),
    			ID: id,
    			VALUE: valStr
    	};
    	fnSubmitFormStore('selectDistinctValue.do', params, function(response, opts){
    		var result = Ext.decode(response.responseText);
    		var msgCode = result.messageCode;
    		var msg = result.message;
    		msg = msg.replace(/param1/g, idLabel);
    		fnShowMessage(msg);
    		if (msgCode == 'COM_RST_0005') { //{param1}은(는) 사용이 가능합니다.
    			if(id == 'TAX_NO'){
    				repChkTaxNoFlag = "Y";
    			}
    		} else if(msgCode == 'COM_ERR_0012') {//{param1}은(는) 현재 존재하는 값으로 사용이 불가능합니다.
    			if (id == 'TAX_NO') {
    				repChkTaxNoFlag = "N";
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
    	repChkTaxNoFlag = "N";
    	form.loadRecord(new COMP({
    		COMP_DIV: '1',
    		COMP_TYPE: 'C'
    	}));
    }
    
    //Text Digi Code 검증.
    function fnCheckTexNo(compType, strNumb) {  
    	strNumb = fnReplaceAll(strNumb, '-', '');
        if (strNumb.length != 10) {   
        	fnShowMessage(parent.msgProperty.COM_ERR_0026);//사업자등록번호가 잘못되었습니다.
            return false;   
        }
        
        //사업자등록번호 유형과 사업자구분 비교.
        var chkCompType = fnChkCompTypeTexNo(compType, strNumb);
        if (chkCompType) {
        	fnShowMessage(chkCompType);
        	return false;
        }
        
        sumMod = 0;   
        sumMod += parseInt(strNumb.substring(0,1));   
        sumMod += parseInt(strNumb.substring(1,2)) * 3 % 10;   
        sumMod += parseInt(strNumb.substring(2,3)) * 7 % 10;   
        sumMod += parseInt(strNumb.substring(3,4)) * 1 % 10;   
        sumMod += parseInt(strNumb.substring(4,5)) * 3 % 10;   
        sumMod += parseInt(strNumb.substring(5,6)) * 7 % 10;   
        sumMod += parseInt(strNumb.substring(6,7)) * 1 % 10;   
        sumMod += parseInt(strNumb.substring(7,8)) * 3 % 10;   
        sumMod += Math.floor(parseInt(strNumb.substring(8,9)) * 5 / 10);   
        sumMod += parseInt(strNumb.substring(8,9)) * 5 % 10;   
        sumMod += parseInt(strNumb.substring(9,10));   

        if (sumMod % 10 != 0) {   
        	fnShowMessage(parent.msgProperty.COM_ERR_0026);//사업자등록번호가 잘못되었습니다.   
            return false;   
        }   
        return true;   
    }   
    
    //사업자등록번호에 따른 사업자 구분.
    function fnChkCompTypeTexNo(compType, strNum){
    	strNumb = fnReplaceAll(strNum, '-', '');
    	var mStrFlag = '';
    	var mTexNo = parseInt(strNum.substring(3,5));
    	//개인사업자
    	if ((mTexNo >= 01 && mTexNo <= 79) || (mTexNo >= 89 && mTexNo <= 80) || mTexNo == 89 || mTexNo == 80) {
    		mStrFlag = 'P'; 
    	//법인사업자
    	} else if (mTexNo == 81 || mTexNo == 86 || mTexNo == 87 || mTexNo == 82 || mTexNo == 83 || mTexNo == 84 || mTexNo == 85) { 
    		mStrFlag = 'C'; 
    	} else {
    		return parent.msgProperty.COM_ERR_0026;//사업자등록번호가 잘못되었습니다.
    	}
    	
    	//사업자번호에 따른 사업자구분과 UI상의 사업자구분 검증.
    	if (mStrFlag == compType) {
   			return false;
    	} else {
    		return parent.msgProperty.COM_ERR_0027;//'사업자구분과 사업자등록번호 상의 사업자구분이 일치하지 않습니다.'
    	}
    	
    }
    //Excel Export
    function fnExcelExport(){
    	var excelFormObjs = { 
			    hiddenType:[
			        { "NAME":"SHEET_NAME", 	"VALUE": "고객사관리" },
			        { "NAME":"COLS", 		"VALUE": "COMP_DIV_DESC,COMP_NM,TAX_NO_VIEW,MAST_NM,CLNT_CODE,CUST_MNG_NM,CUST_CELL_NO,CUST_OFIC_NO,CUST_OFIC_FAX,CUST_MAIL_INFO" },
			        { "NAME":"TITLE", 		"VALUE": "[고객사]대외/관계사,[고객사]상호,[고객사]사업자번호,[고객사]대표명,[고객사]거래처코드,[담당자]이름,[담당자]핸드폰번호,[담당자]사무실번호,[담당자]FAX,[담당자]메일" },
			        { "NAME":"SQLID", 		"VALUE": "compmngt.getCompExcelList" },
			        { "NAME":"COMP_NM", 	"VALUE": Ext.getCmp('s_comp_nm').getValue() == null ? "" : Ext.getCmp('s_comp_nm').getValue() }, //상호
			        { "NAME":"TAX_NO", 		"VALUE": Ext.getCmp('s_tax_no').getValue() == null ? "" : Ext.getCmp('s_tax_no').getValue() }, //사업자번호
			        { "NAME":"MAST_NM", 	"VALUE": Ext.getCmp('s_mast_nm').getValue() == null ? "" : Ext.getCmp('s_mast_nm').getValue() }, //대표자명
			        { "NAME":"CUST_MNG_NM", "VALUE": Ext.getCmp('s_cust_mng_nm').getValue() == null ? "" : Ext.getCmp('s_cust_mng_nm').getValue() } //담당자명			        
			    ]
			};
		fnDownloadExcel(excelFormObjs);
    }
    /** Function 정의 End **/    
    
    fnIframeHeight(750); //200 + 550
});


