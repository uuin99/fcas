var now_date = new Date();
var isFormExpanded = false;

Ext.define('CODE', {
    extend: 'Ext.data.Model',
    fields: ['CD_TYPE', 'CD', 'CD_TYPE_DESC', 'CD_DESC', 'DISP_ORDR', 'UP_CD_TYPE', 'UP_CD', 'USE_YN']
});

Ext.define('CNCT_LIST', {
    extend: 'Ext.data.Model',
    idProperty: 'ROWNUM',
    fields: ['ROWNUM',
             'CNCT_NO', 'COMP_ID', 'COMP_NM', 'CNCT_STRT_DATE', 'CNCT_END_DATE', 'CMRA_CNT',
             'SHOP_CNT', 'CNCT_TOT_AMT', 'SRVC_AMT', 'BNFT_AMT', 'SALE_MNG_ID',
             'OBTN_NO', 'RMRK', 'FILE_UID', 'CNCT_STAT',
             'REGI_ID', 'REGI_NM', 'REGI_DT', 'UPDT_ID', 'UPDT_NM', 'UPDT_DT',
             'CNCT_STAT_NM', 'SALE_MNG_NM']
});

Ext.define('CNCT', {
    extend: 'Ext.data.Model',
    idProperty: 'ROWNUM',
    fields: ['ROWNUM',
             'CNCT_NO', 'COMP_ID', 'COMP_NM', 'CNCT_STRT_DATE', 'CNCT_END_DATE', 'CMRA_CNT',
             'SHOP_CNT', 'CNCT_TOT_AMT', 'SRVC_AMT', 'BNFT_AMT', 'SALE_MNG_ID',
             'OBTN_NO', 'RMRK', 'FILE_UID', 'CNCT_STAT',
             'REGI_ID', 'REGI_NM', 'REGI_DT', 'UPDT_ID', 'UPDT_NM', 'UPDT_DT',
             'CNCT_STAT_NM', 'SALE_MNG_NM', 'REGI_INFO', 'UPDT_INFO']
});

Ext.define('USER', {
    extend: 'Ext.data.Model',
    fields: ['USER_ID', 'USER_NM']
});

var cnctStatStore = Ext.create('Ext.data.JsonStore', {
	model: 'CODE',
	data: Ext.decode(cnct_stat)
});

cnctStatStore.filter([
    {property: 'USE_YN', value: 'Y'},
    {filterFn: function(item){
    	return item.get("CD") != '0000';
    }}
]);

var allCnctStatStore = Ext.create('Ext.data.JsonStore', {
	model: 'CODE',
	data: Ext.decode(cnct_stat)
});

allCnctStatStore.filter([
    {property: 'USE_YN', value: 'Y'},
    {filterFn: function(item){
    	return item.get("CD") != '0000';
    }}
]);

allCnctStatStore.insert(0, new CODE({
	CD: '',
	CD_DESC: 'ALL'
}));

var saleMngStore = Ext.create('Ext.data.JsonStore', {
	autoLoad: true,
	model: 'USER',
	proxy: {
		type: 'ajax',
		api: {
			read: '/mng/com/UserMngt/selectSalesMnge.do'
		},
		reader: {
			type: 'json',
			root: 'data'
		}
	},
	listeners: {
		beforeload: function(store, operation){                
			var eParams = {
				'USER_STAT':'20'
            };
            store.proxy.extraParams = eParams;
		}
	}
});

function fnMRenderer(value, metaData, record, rowIndex, colIndex, store, view){
	if (colIndex == 4 || colIndex == 5 || colIndex == 6) { //매장수, 카메라수, 계약금액
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
    			padding: 0,
    	    	margin: 1,
    			labelAlign: 'right',
    			labelSeparator: '',
    			labelWidth: 60,
    			width: 170
            },
            border: 0,
            layout: {
            	type: 'table',
        	    columns: 3
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
    	    		labelWidth: 60,
        			width: 170
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
        	}, {
        		xtype: 'panel',
        		border:0,
        		padding: 0,
	    		margin: 0,
	    		bodyStyle:'background-color:transparent',
	    		width:320,
        		layout: {
        			type:'hbox',
        			aligh:'stretch'
        		},
        		items: [{
                	xtype: 'datefield',
                	fieldLabel: '계약시작일',
                	id: 's_cnct_start_date_f',
                	format:'Y-m-d',
                	altFormats: 'm,d,Y|m.d.Y|Ymd',
                	padding: 0,
	    	    	margin: 1,
	    			labelAlign: 'right',
	    			labelSeparator: '',
            		enterEventEnabled:true,                	
                	labelWidth: 60,
                	width: 170
                }, {
                	xtype: 'datefield',
                	fieldLabel: '~',
                	id: 's_cnct_start_date_t',
                	format:'Y-m-d',
                	altFormats: 'm,d,Y|m.d.Y|Ymd',
                	padding: 0,
	    	    	margin: 1,
	    			labelAlign: 'right',
	    			labelSeparator: '',
            		enterEventEnabled:true,                	
                	labelWidth: 10,
                	width: 120
                }]
        	}, {
        		xtype: 'textfield',
        		id: 's_obtn_no',
        		fieldLabel: '수주번호',
        		enterEventEnabled:true
        	}, {
        		xtype: 'combobox',
        		id: 's_cnct_stat',
        		fieldLabel: '계약상태',
	    		colspan: 3,        		
        		store: allCnctStatStore,
        	    queryMode: 'local',
        	    valueField: 'CD',
        	    displayField: 'CD_DESC',
        		enterEventEnabled:true,
        	    value:''
        	}]
    	}
    });
    
    //Grid Store
    var store = Ext.create('Ext.data.JsonStore', {
        pageSize: 20,
		model: 'CNCT_LIST',
		proxy: {
			type: 'ajax',
			api: {
				read: '/mng/svc/CnctMngt/selectCnctMngtList.do'
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
					'COMP_ID':Ext.getCmp('s_comp_id').getValue(),
					'OBTN_NO':Ext.getCmp('s_obtn_no').getValue(),
					'CNCT_STAT':Ext.getCmp('s_cnct_stat').getValue(),
					'REGI_DT_START':Ext.Date.format(Ext.getCmp('s_cnct_start_date_f').getValue(),'Ymd'),
					'REGI_DT_END':Ext.Date.format(Ext.getCmp('s_cnct_start_date_t').getValue(),'Ymd')
                };
                store.proxy.extraParams = eParams;
			}
		}
	});
    
    //입력폼 Store    
    var form_store = Ext.create('Ext.data.JsonStore', {
        pageSize: 10,
		model: 'CNCT',
		proxy: {
			type: 'ajax',
			api: {
				read: '/mng/svc/CnctMngt/selectCnctMngt.do'
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
			}
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
    
    var btn_delete = Ext.create('Ext.button.Button', {
    	id: 'btn_delete',
    	text: '삭제',
    	icon: '/images/icon/icon_delete.png',
    	width: 60,
    	handler: function(){
    		fnRemoveForm();
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
    			fnShowMessage('입력폼을 활성화 후 버튼을 눌러주시기 바랍니다.');
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
    		fnInitGrid();
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
        width: 'auto',
        height: 516,
        store: store,
        columns: [{
        	xtype: 'rownumberer',
        	text: 'No',
        	width: 40,
        	align: 'center'
        }, {
            text: '고객사',
            width: 150,
            dataIndex: 'COMP_NM'
        }, {
            text: '계약시작일',
            width: 70,
            dataIndex: 'CNCT_STRT_DATE'
        }, {
            text: '계약종료일',
            width: 70,
            dataIndex: 'CNCT_END_DATE'
        }, {
            text: '매장수',
            width: 100,
            dataIndex: 'SHOP_CNT',
            align: 'right',
            width: 70,
            renderer: fnMRenderer
        }, {
            text: '카메라수',
            width: 100,
            dataIndex: 'CMRA_CNT',
            align: 'right',
            width: 70,
            renderer: fnMRenderer
        }, {
            text: '계약금액(원단위)',
            width: 100,
            dataIndex: 'CNCT_TOT_AMT',
            align: 'right',
            renderer: fnMRenderer
        }, {
            text: '수주번호',
            width: 100,
            dataIndex: 'OBTN_NO'
        }, {
            text: '영업담당자',
            width: 80,
            dataIndex: 'SALE_MNG_NM'
        }, {
            text: '계약상태',
            width: 60,
            dataIndex: 'CNCT_STAT_NM',
            align: 'center'
        }, {
            text: '등록자',
            width: 80,
            dataIndex: 'REGI_NM'
        }, {
            text: '등록일시',
            width: 110,
            dataIndex: 'REGI_DT',
        	align: 'center'
        }, {
            text: '수정자',
            width: 80,
            dataIndex: 'UPDT_NM'
        }, {
            text: '수정일시',
            width: 110,
            dataIndex: 'UPDT_DT',
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
        	select: function(rowModel, record, index){
        		fnOpenLoadForm(record.data.CNCT_NO);
        	}
        }
    });
	
	var form = Ext.create('Ext.form.Panel', {
    	id: 'form',
    	title: '계약정보',
    	frame: true,
    	height: 335,
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
    	items: [{
    		xtype: 'fieldset',
            title: '계약 정보',
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
        		id: 'CNCT_NO',
        		name: 'CNCT_NO',
        		fieldLabel: '계약번호',
        		readOnly: true,
	    		fieldStyle: 'background:rgb(235,235,235);'
        	}, {
        		xtype: 'combobox',
        		id: 'CNCT_STAT',
        		name: 'CNCT_STAT',
        		fieldLabel: '계약상태',
        		store: cnctStatStore,
        	    queryMode: 'local',
        	    valueField: 'CD',
        	    displayField: 'CD_DESC',
        	    editable: false,
        		afterLabelTextTpl: fnRequiredValue()
        	}, {
        		xtype: 'panel',
        		border: 0,
        		padding: 0,
	    		margin: 0,
	    		bodyStyle: 'background-color:transparent',
	    		width: 380,
	    		fieldDefaults: {
	        		padding: 0,
	    	    	margin: 1,
	    			labelAlign: 'right',
	    			labelSeparator: ''
	        	},
        		layout: {
        			type: 'hbox',
        			aligh: 'stretch'
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
	        			icon: '/images/icon/icon_popup_search02.png',
	        			margin: 1,
	        	    	handler: function(){
	        	    		fnOpenCompFindForm('COMP_ID','COMP_NM');
	        	    	}
	        		}, {
        	            xtype: 'hidden',
        	            id: 'COMP_ID',
        	            name: 'COMP_ID'
        	        }]
        	}, {
        		xtype: 'panel',
        		border: 0,
        		padding: 0,
	    		margin: 0,
	    		bodyStyle: 'background-color:transparent',
	    		width: 380,
	    		fieldDefaults: {
	        		padding: 0,
	    	    	margin: 1,
	    			labelAlign: 'right',
	    			labelSeparator: ''
	        	},
        		layout: {
        			type: 'hbox',
        			aligh: 'stretch'
        		},
        		items: [{
	            		xtype: 'datefield',
	            		id: 'CNCT_STRT_DATE',
	            		name: 'CNCT_STRT_DATE',
	            		fieldLabel: '계약기간',
	            		width: 235,
                	    listeners: {
                	    	change: function(obj, newValue, oldValue, eOpts){
                	    		var srvcEndDate =  Ext.getCmp('CNCT_END_DATE').getValue();
                	    		var thisValue = obj.getValue();
                	    		if(srvcEndDate != '' && srvcEndDate != null && srvcEndDate < thisValue){
                	    			fnShowMessage('계약기간은 종료일자 보다 시작일자가 클 수는 없습니다.');
                	    			obj.setValue(srvcEndDate);
                	    			return;
                	    		}
                	    	}
                	    }
        			}, {
	            		xtype: 'datefield',
	            		id: 'CNCT_END_DATE',
	            		name: 'CNCT_END_DATE',
	            		fieldLabel: '~',
	            		labelWidth: 7,
	            		width: 142,
                	    listeners: {
                	    	change: function(obj, newValue, oldValue, eOpts){
                	    		var srvcStrtDate =  Ext.getCmp('CNCT_STRT_DATE').getValue();
                	    		var thisValue = obj.getValue();
                	    		if(srvcStrtDate != '' && srvcStrtDate != null && srvcStrtDate > thisValue){
                	    			fnShowMessage('계약기간은 시작일자 보다 종료일자가 작을 수는 없습니다.');
                	    			obj.setValue(srvcStrtDate);
                	    			return;
                	    		}
                	    	}
                	    }
        			}]
        	}, {
        		id: 'OBTN_NO',
        		name: 'OBTN_NO',
        		fieldLabel: '수주번호',
        		maxLength: 10
        	}, {
        		xtype: 'numericfield',
        		id: 'CNCT_TOT_AMT',
        		name: 'CNCT_TOT_AMT',
        		fieldLabel: '계약 총금액',
        		maxLength: 10,
        		listeners: {
        			change: function(obj){
        	    		var a = obj.getValue();
        	    		var b = Ext.getCmp('SRVC_AMT').getValue();
        	    		var c = a - b;
    	    			Ext.getCmp('BNFT_AMT').setValue(c);
        	    	},
        	    	blur: function(obj){
        	    		var a = obj.getValue();
        	    		var b = Ext.getCmp('SRVC_AMT').getValue();
        	    		var c = a - b;
        	    		if( c < 0 ){
        	    			Ext.MessageBox.confirm('FCAS', '이익이 마이너스 입니다. 계속 진행하시겠습니까?', //
        	    				function(btnid){
        	    	    			if (btnid == 'no') {
        	    	    				obj.focus();
        	    	    			}
            	    			}
            	    		);             	    			
        	    		}        	    		
        	    	}
        		}
        	}, {
        		xtype: 'numericfield',
        		id: 'SHOP_CNT',
        		name: 'SHOP_CNT',
        		fieldLabel: '매장수',
        		maxLength: 5
        	}, {
        		xtype: 'numericfield',
        		id: 'SRVC_AMT',
        		name: 'SRVC_AMT',
        		fieldLabel: '원가',
        		maxLength: 10,
        		listeners: {
        	    	change: function(obj, e, eOpts){
        	    		var a = Ext.getCmp('CNCT_TOT_AMT').getValue();
        	    		var b = obj.getValue();
        	    		var c = a - b;
        	    		Ext.getCmp('BNFT_AMT').setValue(c);
        	    	},
        	    	blur: function(obj){
        	    		var a = Ext.getCmp('CNCT_TOT_AMT').getValue();
        	    		var b = obj.getValue();
        	    		var c = a - b;
        	    		if( c < 0 ){
        	    			Ext.MessageBox.confirm('FCAS', '이익이 마이너스 입니다. 계속 진행하시겠습니까?', //이익이 마이너스 입니다. 계속 진행하시겠습니까?
        	    				function(btnid){
        	    	    			if (btnid == 'no') {
        	    	    				obj.focus();
        	    	    			}
            	    			}
            	    		);             	    			
        	    		}        	    		
        	    	}
        		}
        	}, {
        		xtype: 'numericfield',
        		id: 'CMRA_CNT',
        		name: 'CMRA_CNT',
        		fieldLabel: '카메라수',
        		maxLength: 10
        	}, {
        		xtype: 'numericfield',
        		id: 'BNFT_AMT',
        		name: 'BNFT_AMT',
        		fieldLabel: '이익',
        		maxLength: 10,
        		readOnly: true
        	}, {
        		xtype: 'combobox',
        		id: 'SALE_MNG_ID',
        		name: 'SALE_MNG_ID',
        		fieldLabel: '영업담당자',
        		store: saleMngStore,
        	    queryMode: 'local',
        	    valueField: 'USER_ID',
        	    displayField: 'USER_NM'
        	}, {
        		xtype: 'label'
        	}, {
        		xtype: 'textarea',
        		id: 'RMRK',
        		name: 'RMRK',
        		fieldLabel: '특이사항',
        		colspan: 2,
        		width: 765,
        		maxLength: 8000
        	}, {
        		xtype: 'FileMastPanel',
        		border:0,
        		padding: 0,
	    		margin: 0,
	    		colspan: 2,
	    		fileUidIdNm: 'FILE_UID',
	    		fileSeqIdNm: 'FILE_SEQ',
	    		fileNmIdNm: 'FILE_NM'
        	}, {
        		xtype: 'displayfield',
        		id: 'REGI_INFO',
        		name: 'REGI_INFO',
        		fieldLabel: '등록정보'
        	}, {
        		xtype: 'displayfield',
        		id: 'UPDT_INFO',
        		name: 'UPDT_INFO',
        		fieldLabel: '수정정보'
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
	
    //화면 출력
	Ext.create('Ext.panel.Panel', {
    	renderTo: 'main_div',
    	border: 0,
    	padding: 0,
    	margin: 0,
    	width: 818,
    	items: [grid, {xtype: 'tbspacer', height: 10}, form]
    });
	
	/** Function 정의 Start **/  
	
	//Form Load
    function fnOpenLoadForm(cnctNo){
    	var eParams = {
    			CNCT_NO: cnctNo
            };
        form_store.proxy.extraParams = eParams;
        form_store.load({
        	scope: this,
            callback: function(records, operation, success) {
            	if (records.length == 1) {
            		form.loadRecord(records[0]);
            		form.expand();            		
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
    
	//Grid 초기화.
    function fnInitGrid(){
    	form.collapse();
    	fnInitForm();    	
    	fnInitSearch(grid, panel);
    	Ext.getCmp('s_cnct_stat').setValue('');
    }
    
    //Form 입력 초기화.
	function fnInitForm(){
    	form.loadRecord(new CNCT({
    		CNCT_STAT: 'IN',
    		CNCT_TOT_AMT:0,
    		SHOP_CNT:0,
    		SRVC_AMT:0,
    		CMRA_CNT:0,
    		BNFT_AMT:0
    	}));
    }
	
	//New Form
	function fnOpenNewForm(){
    	form.expand();
    	fnInitForm();
    }
	
	//저장
	function fnSaveForm(){

		//From Default Validation.
    	if(fnIsFormDfultValid(form)){
    		return;
    	}
    	fnSetElMask();
    	form.getForm().submit({
    		url: '/mng/svc/CnctMngt/insertOrUpdateCnct.do',
    		success: function(form, action){
    			fnSetElUnmask();
    			fnShowMessage(parent.msgProperty.COM_RST_0001, //저장을 완료하였습니다.
                	Ext.MessageBox.INFO, function(buttonId, text){
                        if (buttonId == 'ok') {
                        	fnSearchGrid();
                        }
                	}
                );
    		},
    		failure: function(form, action){
    			fnSetElUnmask();
    			fnShowMessage(parent.msgProperty.COM_ERR_0001); //저장에 실패하였습니다.
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
    		    		url: '/mng/svc/CnctMngt/deleteCnct.do',
    		    		success: function(form, action){
    		    			fnSetElUnmask();
    		    			fnShowMessage(parent.msgProperty.COM_RST_0003, //삭제를 완료하였습니다.
	                        	Ext.MessageBox.INFO, function(buttonId, text){
		                            if (buttonId == 'ok') {
		                            	fnSearchGrid();
		                            }
		                        }
	                        );
    		    		},
    		    		failure: function(form, action){
    		    			fnSetElUnmask();
    		    			fnShowMessage(parent.msgProperty.COM_ERR_0003); //삭제에 실패하였습니다.
    		    		}
    		    	});
    			}
    		}
    	);
    }
	
    function fnExcelExport(){
    	var excelFormObjs = { 
			    hiddenType:[
			        { "NAME":"SHEET_NAME", 	"VALUE": "계약관리" },
			        { "NAME":"COLS", 		"VALUE": "COMP_NM,CNCT_STRT_DATE,CNCT_END_DATE,SHOP_CNT,CMRA_CNT,CNCT_TOT_AMT,OBTN_NO,SALE_MNG_NM,CNCT_STAT_NM,REGI_NM,REGI_DT,UPDT_NM,UPDT_DT" },
			        { "NAME":"TITLE", 		"VALUE": "고객사,계약시작일,계약종료일,메장수,카메라수,계약금액(원단위),수주번호,영업담당자,계약상태,등록자,등록일시,수정자,수정일시" },
			        { "NAME":"SQLID", 		"VALUE": "cnctmngt.selectCnctExcel" },
			        { "NAME":"COMP_ID", 	"VALUE": Ext.getCmp('s_comp_id').getValue() == null ? "" : Ext.getCmp('s_comp_id').getValue() }, 
			        { "NAME":"OBTN_NO", 	"VALUE": Ext.getCmp('s_obtn_no').getValue() == null ? "" : Ext.getCmp('s_obtn_no').getValue() }, 
			        { "NAME":"CNCT_STAT", 	"VALUE": Ext.getCmp('s_cnct_stat').getValue() == null ? "" : Ext.getCmp('s_cnct_stat').getValue() }, 
			        { "NAME":"REGI_DT_START", 	"VALUE": Ext.Date.format(Ext.getCmp('s_cnct_start_date_f').getValue(),'Ymd') == null ? "" : Ext.Date.format(Ext.getCmp('s_cnct_start_date_f').getValue(),'Ymd') }, 
			        { "NAME":"REGI_DT_END", 	"VALUE": Ext.Date.format(Ext.getCmp('s_cnct_start_date_t').getValue(),'Ymd') == null ? "" : Ext.Date.format(Ext.getCmp('s_cnct_start_date_t').getValue(),'Ymd') }	        
			    ]
			};
		fnDownloadExcel(excelFormObjs);
    }
    
    /** Function 정의 End **/  
    
    /* 입력폼 Byte Checking Start*/
    
    
    /* 입력폼 Byte Checking End*/
    
    fnIframeHeight(550); //200 + 335
});
