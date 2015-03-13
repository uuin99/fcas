//Grid Model
Ext.define('HIST', {
    extend: 'Ext.data.Model',
    idProperty: 'ROWNUM',
    fields: ['ROWNUM', 
             'REQT_DATE', 'CMRA_NO', 'CMRA_NM', 'TRGT_TBL_NM', 'TRGT_TBL_DESC', 
             'COMP_ID', 'COMP_NM', 'SHOP_ID', 'SHOP_NM', 'CMRA_GRP_ID', 
             'CMRA_GRP_NM', 'EXEC_DATE', 'TOT_CNT', 'PRGS_CNT', 'STAT', 
             'STAT_DESC', 'ERR_DESC', 'CHK', 'NEC_APMT_DESC', 'NEC_APMT_STAT']
});

//Code Model
Ext.define('CODE', {
    extend: 'Ext.data.Model',
    fields: ['CD_TYPE', 'CD', 'CD_TYPE_DESC', 'CD_DESC', 'DISP_ORDR', 'UP_CD_TYPE', 'UP_CD', 'USE_YN']
});

function fnMRenderer(value, metaData, record, rowIndex, colIndex, store, view){
	if(colIndex == 1){
		var tt = Ext.getCmp('chkCol');
	}
	if (colIndex == 14 || colIndex == 14) { 
		if (value != null) {
			return Ext.util.Format.number(value,'0,000');
		}
	}
	return value;
}

Ext.onReady(function() {
    Ext.QuickTips.init();
   
    //Combo Store
    
    var trgtTblNmStore = Ext.create('Ext.data.JsonStore', {
    	model: 'CODE',
    	data: Ext.decode(trgt_tbl_nm)
    });

    trgtTblNmStore.filter([
  	    {property: 'USE_YN', value: 'Y'},
  	    {filterFn: function(item){
  	    	return item.get("CD") != '0000';
  	    }}
  	]);    
    
    var trgtTblNmAllStore = Ext.create('Ext.data.JsonStore', {
        model: 'CODE',
        data: [{'CD': '', 'CD_DESC': 'ALL'}]
    });
    
    for (var i=0; i<trgtTblNmStore.getCount(); i++) {
    	trgtTblNmAllStore.add(trgtTblNmStore.getAt(i));
    }
    
    var necPrgsStatStore = Ext.create('Ext.data.JsonStore', {
    	model: 'CODE',
    	data: Ext.decode(nec_prgs_stat)
    });

    necPrgsStatStore.filter([
  	    {property: 'USE_YN', value: 'Y'},
  	    {filterFn: function(item){
  	    	return item.get("CD") != '0000';
  	    }}
  	]);    
    
    var necPrgsStatAllStore = Ext.create('Ext.data.JsonStore', {
        model: 'CODE',
        data: [{'CD': '', 'CD_DESC': 'ALL'}]
    });
    
    for (var i=0; i<necPrgsStatStore.getCount(); i++) {
    	necPrgsStatAllStore.add(necPrgsStatStore.getAt(i));
    }    
    
    
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
	    		width: 230,
        		layout: {
        			type:'hbox',
        			aligh:'stretch'
        		},
        		items: [{
            		xtype: 'textfield',
            		id: 's_comp_nm',
            		fieldLabel: '고객사',
        			readOnly: true,
            		enterEventEnabled:true,
    	    		fieldStyle: 'background:rgb(235,235,235);',
    	    		labelWidth: 60,
        			width: 170    	    			
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
	    		width:230,
        		layout: {
        			type:'hbox',
        			aligh:'stretch'
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
    	    		labelWidth: 60,
        			width: 170
            	}, {
        			xtype: 'button',
        			text: '찾기',
        			id: 's_btn_shop',
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
        		}, {
    	            xtype: 'hidden',
    	            id: 's_shop_id',
    	            width: 0
    	        }]
        	}, {
        		xtype: 'panel',
        		border:0,
        		padding: 0,
	    		margin: 0,
	    		colspan: 2,
	    		bodyStyle:'background-color:transparent',
	    		width:320,
        		layout: {
        			type:'hbox',
        			aligh:'stretch'
        		},
        		items: [{
                	xtype: 'datefield',
                	fieldLabel: '요청일',
                	id: 's_reqt_date_start',
                	format:'Y-m-d',
                	altFormats: 'm,d,Y|m.d.Y|Ymd',
                	padding: 0,
	    	    	margin: 1,
	    			labelAlign: 'right',
	    			labelSeparator: '',
            		enterEventEnabled:true,                	
                	labelWidth: 60,
                	width: 180
                }, {
                	xtype: 'datefield',
                	fieldLabel: '~',
                	id: 's_reqt_date_end',
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
        		id: 's_cmra_no',
        		fieldLabel: '카메라번호',
        		enterEventEnabled:true
        	}, {
        		xtype: 'combobox',
        		id: 's_trgt_tbl_nm',
        		fieldLabel: '요청테이블',
        		store: trgtTblNmAllStore,
        	    queryMode: 'local',
        	    valueField: 'CD',
        	    displayField: 'CD_DESC',
        		enterEventEnabled:true,
        	    value: ''
        	}, {
        		xtype: 'combobox',
        		id: 's_stat',
        		fieldLabel: '상태',
        		store: necPrgsStatAllStore,
        	    queryMode: 'local',
        	    valueField: 'CD',
        	    displayField: 'CD_DESC',
        		enterEventEnabled:true,
        	    value: ''
        	}]
    	}
    });
    
    var store = Ext.create('Ext.data.JsonStore', {
        pageSize: 20,
		model: 'HIST',
		proxy: {
			type: 'ajax',
			api: {
				read: '/mng/svc/NecConMngt/selectNecPrgsList.do'
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
						COMP_ID:Ext.getCmp('s_comp_id').getValue(),
						SHOP_ID:Ext.getCmp('s_shop_id').getValue(),
						TRGT_TBL_NM:Ext.getCmp('s_trgt_tbl_nm').getValue(),
						REQT_DATE_START:Ext.Date.format(Ext.getCmp('s_reqt_date_start').getValue(),'Ymd'),
						REQT_DATE_END:Ext.Date.format(Ext.getCmp('s_reqt_date_end').getValue(),'Ymd'),
						STAT:Ext.getCmp('s_stat').getValue(),
						CMRA_NO:Ext.getCmp('s_cmra_no').getValue()
				};
                store.proxy.extraParams = eParams;
			},
			load: function(store, records, success, eOpts){
				//Paging을 통한 검색은 제외한다.
			}
		}
	});
    
    //Button
    var btn_save = Ext.create('Ext.button.Button', {
    	id: 'btn_save',
    	text: '예약 스케쥴 등록',
    	icon: '/images/icon/icon_reserv_schedule_save.png',
    	width: 110,
    	handler: function(){
    		var after_fn = function(response){
                var result = Ext.decode(response.responseText);
                if (result.success) {
                	fnSetElUnmask();
                    fnShowMessage(parent.msgProperty.COM_RST_0001, //저장을 완료하였습니다. 
                    	Ext.MessageBox.INFO, function(buttonId, text){
	                        if (buttonId == 'ok') {
	                            store.loadPage(1);
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
                    fnSetElUnmask();
                    fnShowMessage(msg);
                }
            };
            
            fnSetElMask();
            fnSubmitGridStore(store, '/mng/svc/NecConMngt/insertNecApmtAddBatch.do', after_fn);
    	}
    });    
    
    var btn_excel = Ext.create('Ext.button.Button', {
    	id: 'btn_excel',
    	text: 'Excel Export',
    	icon: '/images/icon/icon_excel.png',
    	handler: function(){
    		var excelFormObjs = { 
    			    hiddenType:[
    			        { "NAME":"SHEET_NAME", 	"VALUE": "" },
    			        { "NAME":"COLS", 		"VALUE": "" },
    			        { "NAME":"TITLE", 		"VALUE": "" },
    			        { "NAME":"SQLID", 		"VALUE": "" },
    			        { "NAME":"COMP_ID", "VALUE": parent.gvCompId }
    			    ]
    			};
    		fnDownloadExcel(excelFormObjs);
    	}
    });
    
    //Button
    
    
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
        columns: [{
        	xtype: 'rownumberer',
        	text: 'No',
        	width: 40,
        	align: 'center'
        }, {
            xtype: 'checkcolumn',
            header: '선택',
            dataIndex: 'CHK',
            id: 'chkCol',
            width: 40
        }, {
            text: '요청일자',
            width: 60,
            dataIndex: 'REQT_DATE'
        }, {
            text: '고객사ID',
            width: 60,
            dataIndex: 'COMP_ID',
            align: 'center'
        }, {
            text: '고객사명',
            width: 100,
            dataIndex: 'COMP_NM'
        }, {
            text: '매장ID',
            width: 60,
            dataIndex: 'SHOP_ID',
            align: 'center'
        }, {
            text: '매장명',
            width: 100,
            dataIndex: 'SHOP_NM'
        }, {
            text: '카메라그룹<br>ID',
            width: 60,
            dataIndex: 'CMRA_GRP_ID',
            align: 'center'
        }, {
            text: '카메라그룹명',
            width: 100,
            dataIndex: 'CMRA_GRP_NM'
        }, {
            text: '카메라번호',
            width: 60,
            dataIndex: 'CMRA_NO',
            align: 'center'
        }, {
            text: '카메라명',
            width: 100,
            dataIndex: 'CMRA_NM'
        }, {
            text: '요청테이블명',
            width: 120,
            dataIndex: 'TRGT_TBL_NM',
            align: 'center'
        }, {
            text: '요청테이블',
            width: 100,
            dataIndex: 'TRGT_TBL_DESC'
        }, {
            text: '처리일자',
            width: 110,
            dataIndex: 'EXEC_DATE'
        }, {
            text: '처리대상<br>건수',
            width: 60,
            dataIndex: 'TOT_CNT',
            align: 'right',
            renderer: fnMRenderer
        }, {
            text: '처리데이터<br>건수',
            width: 60,
            dataIndex: 'PRGS_CNT',
            align: 'right',
            renderer: fnMRenderer
        }, {
            text: '상태 코드',
            width: 100,
            dataIndex: 'STAT',
            hidden: true
        }, {
            text: '연계작업<br>상태',
            width: 60,
            dataIndex: 'STAT_DESC',
            align: 'center'
        }, {
            text: '연계작업 에러설명',
            width: 150,
            dataIndex: 'ERR_DESC'
        }, {
            text: '예약스케쥴<br>등록정보',
            width: 80,
            dataIndex: 'NEC_APMT_DESC',
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
        	    /*btn_excel,
        	    {xtype: 'tbspacer'},*/
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
        }]
    });
    
    //Ext.getCmp('grid').setSize(w, h);
    
    fnIframeHeight(516);
});
