Ext.define('TEST', {
    extend: 'Ext.data.Model',
    fields: ['CD_TYPE', 'CD', 'CD_TYPE_DESC', 'CD_DESC', 'DISP_ORDR', 'UP_CD_TYPE', 'UP_CD', 'USE_YN']
});

Ext.define('CODE', {
    extend: 'Ext.data.Model',
    fields: ['CD_TYPE', 'CD', 'CD_TYPE_DESC', 'CD_DESC', 'DISP_ORDR', 'UP_CD_TYPE', 'UP_CD', 'USE_YN']
});

Ext.onReady(function() {
    //Ext.QuickTips.init();
	Ext.tip.QuickTipManager.init();
    
    Ext.create('Ext.form.HtmlEditor', {
        id: 'cont',
        width: 780,
        height: 250,        
        renderTo: 'main_div',
        defaultValue : ''
    });
    
    /*var calendarStore = Ext.create('Ext.calendar.data.MemoryCalendarStore', {
        data: Ext.calendar.data.Calendars.getData()
    });

    // A sample event store that loads static JSON from a local file. Obviously a real
    // implementation would likely be loading remote data via an HttpProxy, but the
    // underlying store functionality is the same.
    var eventStore = Ext.create('Ext.calendar.data.MemoryEventStore', {
        data: Ext.calendar.data.Events.getData()
    });
    
    Ext.create('Ext.calendar.CalendarPanel', {
    	rederTo: 'main_div',
    	eventStore: eventStore,
        calendarStore: calendarStore,
        border: false,
        region: 'center',
        activeItem: 3, // month view
        monthViewCfg: {
            showHeader: true,
            showWeekLinks: true,
            showWeekNumbers: true
        }
    });*/
    
    /*var bizStore1 = Ext.create('Ext.data.JsonStore', {
    	model: 'CODE',
    	data: Ext.decode(biz_item_1)
    });
    
    bizStore1.filter([
	    {property: 'USE_YN', value: 'Y'},
	    {filterFn: function(item){
	    	return item.get("CD") != '0000';
	    }}
	]);
    
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
    
    var emailStore = Ext.create('Ext.data.JsonStore', {
    	autoLoad: true,
		model: 'CODE',
		proxy: {
			type: 'ajax',
			api: {
				read: '/mng/com/CodeMngt/selectCodeMngt.do'
			},
			reader: {
				type: 'json',
				root: 'data'
			}
		},
		listeners: {
			beforeload: function(store, operation){                
				var eParams = {
					CD_TYPE: 'email',
					USE_YN: 'Y'
                };
                store.proxy.extraParams = eParams;
			},
			load: function(store, records, successful){
				for (var i=0; i<records.length; i++) {
					if (records[i].get('CD') == '0000') {
						store.remove(records[i]);
					}
				}
				store.insert(0, new CODE({
					CD: '[ 직접 입력 ]',
					CD_DESC: '[ 직접 입력 ]'
				}));
			}
		}
	});
    
    var store = Ext.create('Ext.data.JsonStore', {
        //pageSize: 50,
		model: 'TEST',
		proxy: {
			type: 'ajax',
			api: {
				read: '/mng/com/CodeMngt/selectCodeMngt.do'
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
					alert(response.responseText);
				}
			}
		},
		listeners: {
			add: function(store, records, index){
				
			},
			beforeload: function(store, operation){                
				var eParams = {
					start: '',
					CD_DESC: ''
                };
                store.proxy.extraParams = eParams;
			},
			load: function(store, records, successful){
				//alert('load : ' + records.length);
			},
			remove: function(store, record, index){
				
			}
		}
	});
    
    var panel = Ext.create('Ext.panel.Panel', {
    	id: 'panel',
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
            		id: 's_cd_type_desc',
            		fieldLabel: '코드 타입명'
            	}, {
            		xtype: 'textfield',
            		id: 's_cd_desc',
            		fieldLabel: '코드명'
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
            		xtype: 'combobox',
            		id: 's_biz_item_1',
            		fieldLabel: '업종 대그룹',
            		store: bizStore1,
            	    queryMode: 'local',
            	    valueField: 'CD',
            	    displayField: 'CD_DESC',
            	    listeners: {
            	    	select: function(combo, records){
            	    		Ext.getCmp('s_biz_item_2').setValue('');
            	    		Ext.getCmp('s_biz_item_2').getStore().clearFilter();
            	    		Ext.getCmp('s_biz_item_2').getStore().filter([
            	    		    {property: 'USE_YN', value: 'Y'},
            	    		    {property: 'UP_CD', value: combo.getValue()},
            	    		    {filterFn: function(item){
            	    		    	return item.get("CD") != '0000';
            	    		    }}
            	    		]);
            	    		
            	    		Ext.getCmp('s_biz_item_3').setValue('');
            	    		Ext.getCmp('s_biz_item_3').getStore().clearFilter();
            	    		Ext.getCmp('s_biz_item_3').getStore().filter([
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
            		id: 's_biz_item_2',
            		fieldLabel: '업종 중그룹',
            		store: bizStore2,
            	    queryMode: 'local',
            	    valueField: 'CD',
            	    displayField: 'CD_DESC',
            	    listeners: {
            	    	select: function(combo, records){
            	    		Ext.getCmp('s_biz_item_3').setValue('');
            	    		Ext.getCmp('s_biz_item_3').getStore().clearFilter();
            	    		Ext.getCmp('s_biz_item_3').getStore().filter([
            	    		    {property: 'USE_YN', value: 'Y'},
            	    		    {property: 'UP_CD', value: combo.getValue()},
            	    		    {filterFn: function(item){
            	    		    	return item.get("CD") != '0000';
            	    		    }}
            	    		]);
            	    	}
            	    }
            	}, {
            		xtype: 'combobox',
            		id: 's_biz_item_3',
            		fieldLabel: '업종 소그룹',
            		store: bizStore3,
            	    queryMode: 'local',
            	    valueField: 'CD',
            	    displayField: 'CD_DESC'
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
            		id: 's_email1',
            		fieldLabel: '이메일',
            	}, {
            		xtype: 'combobox',
            		id: 's_email2',
            		store: emailStore,
            	    queryMode: 'local',
            	    valueField: 'CD',
            	    displayField: 'CD_DESC',
            	    editable: false,
            	    listeners: {
            	    	change: function(field, newValue, oldValue){
            	    		if (newValue == '[ 직접 입력 ]') {
            	    			Ext.getCmp('s_email1').setValue('');
            	    			Ext.getCmp('s_email1').setReadOnly(false);
            	    		} else {
            	    			Ext.getCmp('s_email1').setValue(newValue);
            	    			Ext.getCmp('s_email1').setReadOnly(true);
            	    		}
            	    	}
            	    }
            	}, {
            		xtype: 'textfield',
            		fieldLabel: '등록자',
            		value: '11111111',
            		readOnly: true,
            		fieldStyle: 'background:blue;'
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
            		xtype: 'datefield',
            		id: 's_date_f',
            		fieldLabel: '일자',
            		value: new Date()
            	}, {
            		xtype: 'datefield',
            		id: 's_date_t',
            		fieldLabel: '~',
            		labelWidth: 10,
            		value: new Date()
            	}]
            }]
    	}
    });
    
    var grid = Ext.create('Ext.grid.Panel', {
    	id: 'grid',
        renderTo: 'main_div',
        columnLines: true,
        viewConfig: {
        	enableTextSelection: true,
        	loadingText: '로딩중...',
            stripeRows: true
        },
        width: 'auto',
        height: 200,
        store: store,
        columns: [{
        	xtype: 'rownumberer',
        	text : 'No',
        	width: 40,
        	align: 'center',
        	locked: true
        }, {
            text     : '코드 타입',
            flex     : 1,
            dataIndex: 'CD_TYPE'
        }, {
            text     : '코드 타입명',
            flex     : 1,
            dataIndex: 'CD_TYPE_DESC'
        }, {
            text     : '코드',
            flex     : 1,
            dataIndex: 'CD'
        }, {
            text     : '코드명',
            flex     : 1,
            dataIndex: 'CD_DESC'
        }, {
            text     : '정렬순서',
            flex     : 1,
            dataIndex: 'DISP_ORDR'
        }, {
            text     : '상위 코드 타입',
            flex     : 1,
            dataIndex: 'UP_CD_TYPE'
        }, {
            text     : '상위 코드',
            flex     : 1,
            dataIndex: 'UP_CD'
        }, {
            text     : '사용여부',
            flex     : 1,
            dataIndex: 'USE_YN'
        }],
        tbar: [{
    	   xtype: 'tbfill'
        }, {
        	xtype: 'button',
        	text: 'Chart',
        	icon: '/js/extjs-4.1.0/resources/themes/images/default/grid/group-by.gif',
        	width: 60,
        	border: 1,
        	style: {
        	    borderColor: '#99bce8',
        	    borderStyle: 'solid'
        	},
        	handler: function(){
        		//rMateChart 를 생성합니다.
        		// 파라메터 (순서대로) 
        		//  1. 차트의 id ( 임의로 지정하십시오. ) 
        		//  2. 차트가 위치할 div 의 id (즉, 차트의 부모 div 의 id 입니다.)
        		//  3. 차트 생성 시 필요한 환경 변수들의 묶음인 chartVars
        		//  4. 차트의 가로 사이즈 (생략 가능, 생략 시 100%)
        		//  5. 차트의 세로 사이즈 (생략 가능, 생략 시 100%)        		
        		if (document.getElementById(charId) != null) {
        			document.getElementById(charDiv).removeChild(document.getElementById(charId));
        		}
        		rMateChartH5.create(charId, charDiv, chartVars, '100%', '100%'); 
        	}
        }, {
        	xtype: 'button',
        	text: '초기화',
        	icon: '/js/extjs-4.1.0/resources/themes/images/default/grid/refresh.gif',
        	width: 60,
        	border: 1,
        	style: {
        	    borderColor: '#99bce8',
        	    borderStyle: 'solid'
        	},
        	handler: function(){
        		if (grid.store.data.items.length > 0) {
                    grid.getStore().clearData();
                    grid.getStore().totalCount = 0;
                    grid.getView().refresh();
                }
        		if (document.getElementById(charId) != null) {
        			document.getElementById(charDiv).removeChild(document.getElementById(charId));
        		}
        	}
        }, {
        	xtype: 'button',
        	text: '조회',
        	icon: '/js/extjs-4.1.0/resources/themes/images/default/grid/page-next.gif',
        	width: 60,
        	border: 1,
        	style: {
        	    borderColor: '#99bce8',
        	    borderStyle: 'solid'
        	},
        	handler: function(){
        		alert(Ext.getCmp('s_date_f').getRawValue());
        		alert(Ext.getCmp('s_date_f').getValue());
        		alert(Ext.Date.format(Ext.getCmp('s_date_f').getValue(), 'Ymd'));
        		
        		Ext.MessageBox.confirm('FCAS', '조회 하시겠습니까?',
        			function(btnid){
	        			if (btnid == 'yes') {
	        				store.loadPage(1);
	        			}
	        		}
        		);
        	}
        }]
    });
    
    //Default Value Setting
    Ext.getCmp('s_email2').setValue('[ 직접 입력 ]');
    
    //Ext.getCmp('grid').setSize(w, h);*/
});
