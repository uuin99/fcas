var checkLoginId = 'N';
var isFormExpanded = false;

Ext.define('AUTH', {
    extend: 'Ext.data.Model',
    fields: ['AUTH', 'AUTH_DESC', 'AUTH_TYPE']
});

Ext.define('CODE', {
    extend: 'Ext.data.Model',
    fields: ['CD_TYPE', 'CD', 'CD_TYPE_DESC', 'CD_DESC', 'DISP_ORDR', 'UP_CD_TYPE', 'UP_CD', 'USE_YN']
});

Ext.define('USER', {
    extend: 'Ext.data.Model',
    idProperty: 'ROWNUM',
    fields: ['ROWNUM',
             'USER_ID', 'COMP_ID', 'SHOP_ID','COMP_NM', 'SHOP_NM', 'LOGIN_ID', 'LOGIN_PWD', 'USER_NM',
             'AUTH', 'USER_TYPE', 'DEPT_NM', 'POSI_NM', 'CELL_NO', 'TEL_NO', 'FAX_NO',
             'EMAIL_ID', 'EMAIL_DOMAIN', 'USER_STAT',
             'STOP_ID', 'STOP_NM', 'STOP_DT',
             'LOGIN_ID_CHNG_DATE','LOGIN_PWD_CHNG_DATE',
             'USER_TYPE_NM','USER_STAT_NM','EMAIL_NM','STOP_INFO',
             'REGI_ID', 'REGI_NM', 'REGI_DT', 'UPDT_ID', 'UPDT_NM', 'UPDT_DT','REGI_INFO','UPDT_INFO']
});





Ext.onReady(function(){
    Ext.QuickTips.init();

    var userTypeStore = Ext.create('Ext.data.JsonStore', {
        model: 'CODE',
        data: Ext.decode(user_type)
    });

    userTypeStore.filter([
        {property: 'USE_YN', value: 'Y'},
        {filterFn: function(item){
        	return item.get("CD") != '0000';
        }}
    ]);

    var userStatStore = Ext.create('Ext.data.JsonStore', {
        model: 'CODE',
        data: Ext.decode(user_stat)
    });

    userStatStore.filter([
        {property: 'USE_YN', value: 'Y'},
        {filterFn: function(item){
        	return item.get("CD") != '0000';
        }}
    ]);


    var alluserStatStore = Ext.create('Ext.data.JsonStore', {
        model: 'CODE',
        data: [{'CD': '', 'CD_DESC': 'ALL'}]
    });

    for (var i=0; i<userStatStore.getCount(); i++) {
    	alluserStatStore.add(userStatStore.getAt(i));
    }

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


    var authStore = Ext.create('Ext.data.JsonStore', {
    	autoLoad: true,
		model: 'AUTH',
		proxy: {
			type: 'ajax',
			api: {
				read: '/mng/com/AuthMngt/selectAuthList.do'
			},
			reader: {
				type: 'json',
				root: 'data'
			}
		},
		listeners: {
			beforeload: function(store, operation){
				var eParams = {};
                store.proxy.extraParams = eParams;
			},
			load: function(store, records, successful){

			}
		}
	});


    var store = Ext.create('Ext.data.JsonStore', {
        pageSize: 20,
		model: 'USER',
		proxy: {
			type: 'ajax',
			api: {
				read: '/mng/com/UserMngt/selectMyUserList.do'
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
						//COMP_ID: parent.gvCompId,
						SHOP_ID: Ext.getCmp('s_shop_id').getValue(),
						USER_NM: Ext.getCmp('s_user_nm').getValue(),
						DEPT_NM: Ext.getCmp('s_dept_nm').getValue(),
						USER_STAT: Ext.getCmp('s_user_stat').getValue()
                };
                store.proxy.extraParams = eParams;
			}
		}
	});

    var form_store = Ext.create('Ext.data.JsonStore', {
        pageSize: 10,
		model: 'USER',
		proxy: {
			type: 'ajax',
			api: {
				read: '/mng/com/UserMngt/selectUser.do'
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
    			labelSeparator: '',
    			labelWidth: 70,
    			width: 180
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
	    		colspan:3,
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
    	    		labelWidth: 70,
    	    		value:parent.gvShopNm ,
        			width: 180
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
    	        }]
        	},{
        		xtype: 'textfield',
        		id: 's_user_nm',
        		fieldLabel: '이름',
        		enterEventEnabled:true
        	},{
        		xtype: 'textfield',
        		id: 's_dept_nm',
        		fieldLabel: '부서',
        		enterEventEnabled:true
        	},{
        		xtype: 'combobox',
        		id: 's_user_stat',
        		fieldLabel: '상태',
        		store: alluserStatStore,
        		editable : false,
        	    queryMode: 'local',
        	    valueField: 'CD',
        	    displayField: 'CD_DESC',
        	    value:'',
        		enterEventEnabled:true
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
            text     : '매장명',
            width    : 100,
            dataIndex: 'SHOP_NM'
        }, {
            text     : '사용자ID',
            width    : 100,
            dataIndex: 'USER_ID'
        }, {
            text     : '로그인ID',
            width    : 100,
            dataIndex: 'LOGIN_ID'
        }, {
            text     : '사용자 이름',
            width    : 100,
            dataIndex: 'USER_NM'
        }, {
            text     : '권한',
            width    : 100,
            dataIndex: 'AUTH'
        }, {
            text     : '사용자구분',
            width    : 100,
            dataIndex: 'USER_TYPE_NM'
        }, {
            text     : '부서',
            width    : 100,
            dataIndex: 'DEPT_NM'
        }, {
            text     : '직책',
            width    : 100,
            dataIndex: 'POSI_NM'
        }, {
            text     : '휴대폰번호',
            width    : 100,
            dataIndex: 'CELL_NO'
        }, {
            text     : '연락처(전화)',
            width    : 100,
            dataIndex: 'TEL_NO'
        }, {
            text     : '연락처(FAX)',
            width    : 100,
            dataIndex: 'FAX_NO'
        }, {
            text     : '메일주소',
            width    : 100,
            dataIndex: 'EMAIL_NM'
        }, {
            text     : '상태',
            width    : 100,
            dataIndex: 'USER_STAT_NM'
        }, {
            text     : '사용중지자이름',
            width    : 60,
            dataIndex: 'STOP_NM'
        }, {
            text     : '사용자중지일시',
            width    : 110,
            dataIndex: 'STOP_DT'
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
            text     : '수정자',
            width    : 60,
            dataIndex: 'UPDT_NM',
        	align: 'center'
        }, {
            text     : '수정일시',
            width    : 110,
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
        	    /*
        	    btn_new,
        	    {xtype: 'tbspacer'},
        	    btn_save,
        	    {xtype: 'tbspacer'},
        	    btn_delete
        	    */
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
        		fnOpenLoadForm(record.data.USER_ID);
        		//form.loadRecord(record);
        		//form.expand();
        	}
        }
    });


    var form = Ext.create('Ext.form.Panel', {
    	id: 'form',
    	title: '사용자 상세',
    	frame: true,
    	height: 422,
    	width: 818,
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
            title: '소속 정보',
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
	            		width:378
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
	            		width:378
        			}, {
        	            xtype: 'hidden',
        	            id: 'SHOP_ID',
        	            name: 'SHOP_ID'
        	        }]
        	}]
    	},{
    		xtype: 'fieldset',
            title: '개인 정보',
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
        		id: 'USER_ID',
        		name: 'USER_ID',
    			readOnly: true,
	    		fieldStyle: 'background:rgb(235,235,235);',
        		fieldLabel: '사용자 ID'
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
	            		id: 'LOGIN_ID',
	            		name: 'LOGIN_ID',
	            		fieldLabel: '로그인ID',
	            		afterLabelTextTpl: fnRequiredValue(),
	            		readOnly: true,
	            		width:379,
	    	    	    listeners: {
	    	    	    	change: function(obj, newVal, oldVal, eOpts){
	    	    	    		//수정시 재 검증.
	    	    	    		checkLoginId = 'N';
	    	    	    	}
	    	    	    }
        			}, {
        	            xtype: 'hidden',
        	            id: 'PRE_LOGIN_ID',
        	            name: 'PRE_LOGIN_ID'
        	        }]
        	}, {
        		xtype: 'textfield',
        		id: 'LOGIN_PWD',
        		name: 'LOGIN_PWD',
        		inputType:'password',
        		afterLabelTextTpl: fnRequiredValue(),
    			readOnly: true,
	    		fieldStyle: 'background:rgb(235,235,235);',
        		fieldLabel: '비밀번호'
        	}, {
        		xtype: 'textfield',
        		id: 'LOGIN_PWD_CHNG_DATE',
        		name: 'LOGIN_PWD_CHNG_DATE',
    			readOnly: true,
	    		fieldStyle: 'background:rgb(235,235,235);',
        		fieldLabel: '비밀번호 변경일자'
        	}, {
        		xtype: 'textfield',
        		id: 'USER_NM',
        		name: 'USER_NM',
        		readOnly: true,
        		afterLabelTextTpl: fnRequiredValue(),
        		fieldLabel: '사용자 이름'
        	}, {
        		xtype: 'textfield',
        		id: 'LOGIN_ID_CHNG_DATE',
        		name: 'LOGIN_ID_CHNG_DATE',
    			readOnly: true,
	    		fieldStyle: 'background:rgb(235,235,235);',
        		fieldLabel: '로그인ID 변경일자'
        	}, {
            	xtype: 'combobox',
        		id: 'AUTH',
        		name: 'AUTH',
        		fieldLabel: '권한',
        		store: authStore,
        	    queryMode: 'local',
        	    valueField: 'AUTH',
        	    displayField: 'AUTH',
        	    readOnly: true,
        	    afterLabelTextTpl: fnRequiredValue(),
        	    editable: false
        	}, {
        		xtype: 'textfield',
        		id: 'POSI_NM',
        		name: 'POSI_NM',
        		readOnly: true,
        		fieldLabel: '직책'
        	}, {
        		xtype: 'textfield',
        		id: 'DEPT_NM',
        		name: 'DEPT_NM',
        		readOnly: true,
        		fieldLabel: '부서'
        	}, {
        		xtype: 'textfield',
        		id: 'CELL_NO',
        		name: 'CELL_NO',
        		fieldLabel: '휴대폰번호',
        		readOnly: true,
        		regex: new RegExp(/[01](0|1|6|7|8|9)[-](\d{4}|\d{3})[-]\d{4}$/),
        		regexText: '핸드폰번호 형식(010-0000-0000)을 맞추어 주세요',
        		maxLength: 16
        	}, {
        		xtype: 'textfield',
        		id: 'TEL_NO',
        		name: 'TEL_NO',
        		fieldLabel: '연락처(전화)',
        		readOnly: true,
        		regex: new RegExp(/^\d{1,16}|[-]|[(]|[)]?$/),
        		regexText: '전화 번호를 형식에 맞게 입력하여 주세요.',
        		maxLength: 16
        	}, {
        		xtype: 'textfield',
        		id: 'FAX_NO',
        		name: 'FAX_NO',
        		fieldLabel: '연락처(FAX)',
        		readOnly: true,
        		regex: new RegExp(/^\d{1,16}|[-]|[(]|[)]?$/),
        		regexText: 'FAX번호를 형식에 맞게 입력하여 주세요.',
        		maxLength: 16,
        		colspan:2

        	}, {
            	xtype: 'combobox',
        		id: 'USER_TYPE',
        		name: 'USER_TYPE',
        		fieldLabel: '사용자구분',
        		store: userTypeStore,
        	    queryMode: 'local',
        	    valueField: 'CD',
        	    displayField: 'CD_DESC',
        	    readOnly: true,
        	    afterLabelTextTpl: fnRequiredValue(),
        	    editable: false
        	}, {
            	xtype: 'combobox',
        		id: 'USER_STAT',
        		name: 'USER_STAT',
        		fieldLabel: '사용자상태',
        		store: userStatStore,
        	    queryMode: 'local',
        	    valueField: 'CD',
        	    displayField: 'CD_DESC',
        	    readOnly: true,
        	    afterLabelTextTpl: fnRequiredValue(),
        	    editable: false
        	},{
        		xtype: 'panel',
        		border:0,
        		padding: 0,
	    		margin: 0,
	    		bodyStyle:'background-color:transparent',
	    		colspan:2,
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
	            		id: 'EMAIL_ID',
	            		name: 'EMAIL_ID',
	            		fieldLabel: '메일',
	            		readOnly: true,
	            		width:216
        			},{
                		xtype: 'textfield',
                		id: 'EMAIL_DOMAIN',
                		name: 'EMAIL_DOMAIN',
                		width: 176,
                		labelWidth:10,
                		readOnly: true,
                		fieldLabel: '@'
            		}]
        	}]
    	},{
    		xtype: 'fieldset',
            title: '이력 정보',
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
	    	}, {
	    		xtype: 'displayfield',
	    		id: 'STOP_INFO',
	    		name: 'STOP_INFO',
	    		fieldLabel: '사용중지정보 : '
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


    //Form Load
    function fnOpenLoadForm(userId){

    	Ext.getCmp('LOGIN_PWD').setFieldStyle(  "background:rgb(235,235,235)" );
    	Ext.getCmp('LOGIN_PWD').setReadOnly( true );

    	var eParams = {
    			USER_ID: userId
            };
        form_store.proxy.extraParams = eParams;
        form_store.load({
        	scope: this,
            callback: function(records, operation, success) {
            	if (records.length == 1) {
            		form.expand();
            		form.loadRecord(records[0]);
            		Ext.getCmp('PRE_LOGIN_ID').setValue(records[0].data.LOGIN_ID);
            		checkLoginId = "Y";
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

    	form.loadRecord(new USER({
    		//COMP_DIV: '1',
    		//COMP_TYPE: 'C'
    	}));
    }




    //Resize
    //Ext.getCmp('grid').setSize(w, h);

    //Default Value Setting
    //Ext.getCmp('s_use_yn').setValue('');
    fnIframeHeight(622);



	// 권한 타입이 매장일 경우에는 찾기 버튼 삭제한다.
	if(parent.gvAuthType == 'C') {
		Ext.getCmp('btn_shop_search').setVisible(false);
	}


});


