<%@page import="fcas.sys.com.servlet.SystemCode"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%
	String email_Main = SystemCode.getCode("email");
%>
<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge"/>
	<title>Face !nsight</title>
	<%@ include file="/common/common.jsp" %>
	<script type="text/javascript">
		var subMenuStore = null;

		var selectedMenuFontObj = null;
		var selectedProgFontObj = null;
		var popup_myInfoPopupForm = null;
		var main_checkLoginId = 'N';
		var myInfo_store = null;
		var myInfoPopupForm = null;

		function fnGoMenu(menu_id){
			if (selectedMenuFontObj != null) {
				selectedMenuFontObj.style.color = '#464646';
				selectedMenuFontObj.style.fontSize = '16px';
			}
			selectedMenuFontObj = document.getElementById('font_'+menu_id);
			selectedMenuFontObj.style.fontSize = '18px';


			var eParams = {
				AUTH: gvAuth,
				PRNT_MENU_ID: menu_id
            };
			subMenuStore.proxy.extraParams = eParams;
			subMenuStore.load();

			//alert(menu_id);
			parent.document.getElementById("main").style.height = "1050px";
	    }

		var firstClick = true;
		var onloadPageYn = "N";

		function fnGoProg(menu_id, prog_src){

			//alert(firstClick);
			if(prog_src.match('/cus/fad/ShopStrdReport/selectShopStrdReportView.do')) {
				onloadPageYn = "N";
				if( !firstClick ) {
					if(onloadPageYn == "N") {
						//연속 클릭 방지.. 페이지 로딩중일때는 리퀘스트를 보내지 않음..
						//alert("로딩중");
						return;
					}
				}
				firstClick = false;
			} else {
				onloadPageYn = "Y";
				firstClick = true;
			}



		    if (selectedProgFontObj != null) {
		        selectedProgFontObj.style.color = '#464646';
		        selectedProgFontObj.style.fontWeight = '';
		    }
		    selectedProgFontObj = document.getElementById('font_'+menu_id);
		    selectedProgFontObj.style.color = '#0D68B5';
		    selectedProgFontObj.style.fontWeight = 'bold';

			document.getElementById('content_iframe').src = prog_src;
		}

		function fnLogOut(){
			location.href = '/sys/com/Login/actionLogout.do';
		}

		function fnOpenMyInfo(){
			popup_myInfoPopupForm.show();
			Ext.getBody().mask();
			fnMyInfoLoadForm(gvUserId);
		}

		function fnCloseMyInfo(){
			popup_myInfoPopupForm.hide();
			Ext.getBody().unmask();
		}

		function fnDownMenu(){
			alert('서비스 준비중입니다.');
		}

	    //Form Load
	    function fnMyInfoLoadForm(userId){

	    	var eParams = {
	    			USER_ID: userId
	            };
	    	myInfo_store.proxy.extraParams = eParams;
	    	myInfo_store.load({
	        	scope: this,
	            callback: function(records, operation, success) {
	            	if (records.length == 1) {
	            		myInfoPopupForm.expand();
	            		myInfoPopupForm.loadRecord(records[0]);
	            		Ext.getCmp('mainId_PRE_LOGIN_ID').setValue(records[0].data.LOGIN_ID);
	            		Ext.getCmp('mainId_PRE_LOGIN_PWD').setValue(records[0].data.LOGIN_PWD);
	            		//Ext.getCmp('EMAIL_FIELD').setValue('');
	            		main_checkLoginId = "Y";
	            	} else {
	            		fnShowMessage("");
	            		return;
	            	}
	            }
	        });
	    }

		function fnMenuMouseOver(obj){
			obj.style.color = '#0D68B5';
		}

		function fnMenuMouseOut(obj){
			if (selectedMenuFontObj != obj) {
				obj.style.color = '#464646';
			}
		}

		function fnProgMouseOver(obj){
			obj.style.color = '#0D68B5';
		}

		function fnProgMouseOut(obj){
			if (selectedProgFontObj != obj) {
				obj.style.color = '#464646';
			}
		}

		Ext.onReady(function(){
		    Ext.QuickTips.init();

		    //if (parent.gvAuthType == 'C') { //매장담당자
		    	document.getElementById('content_iframe').src = '/sys/com/Main/myPage.do';
		    //}

		    //화면 사이즈 조정
		    //var h = document.documentElement.scrollHeight - 151;
		    //document.getElementById('main').setAttribute('style', 'width:1024px; height:'+h+'px;');

		    Ext.create('Ext.data.JsonStore', {
		    	autoLoad: true,
		    	fields: ['MENU_ID', 'MENU_NM'],
		    	proxy: {
		    		type: 'ajax',
		    		api: {
		    			read: '/sys/com/Login/selectMainMenu.do'
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
							AUTH: gvAuth,
							LEVL: '1'
		                };
		                store.proxy.extraParams = eParams;
					},
		    		load: function(store, records, successful){
		    			var top_menu_html = '<div style="width:100%; height:100%; text-align:center;">';

		    			for (var i=0; i<records.length; i++) { //대메뉴
		    				if (i == records.length-1) {
		    					top_menu_html += '<a href="#"  onclick="fnGoMenu(\''+records[i].get('MENU_ID')+'\')"><font id="font_'+records[i].get('MENU_ID')+'" onmouseover="fnMenuMouseOver(this);" onmouseout="fnMenuMouseOut(this);">'+records[i].get('MENU_NM')+'</font></a>';
		    				} else {
		    					top_menu_html += '<a href="#" onclick="fnGoMenu(\''+records[i].get('MENU_ID')+'\')" style="margin-right:75px;"><font id="font_'+records[i].get('MENU_ID')+'" onmouseover="fnMenuMouseOver(this);" onmouseout="fnMenuMouseOut(this);">'+records[i].get('MENU_NM')+'</font></a>';
		    				}
		    			}

		    			top_menu_html += '</div>';

		    			document.getElementById('top_menu').innerHTML = top_menu_html;

		    			var menu_html = '<ul style="text-align:left;">';
		    			menu_html += '<li class="left_title">마이페이지</li>';
    					menu_html += '<li class="left_title_line"></li>';
	    				menu_html += '</ul>';
    					document.getElementById('menu').innerHTML = menu_html;
		    		}
		    	}
		    });

		    subMenuStore = Ext.create('Ext.data.JsonStore', {
		    	fields: ['MENU_ID', 'MENU_NM', 'MENU_PATH', 'PROG_ID', 'PRNT_MENU_ID', 'LEVL', 'STEP', 'HAS_CHILD', 'TRGT_URL'],
		    	proxy: {
		    		type: 'ajax',
		    		api: {
		    			read: '/sys/com/Login/selectMainMenu.do'
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
		    		load: function(store, records, successful){
	    				var menu_html = '<ul style="text-align:left;">';

		    			for (var i=0; i<records.length; i++) {
		    				if (records[i].get('LEVL') == '1') { //대메뉴
		    					menu_html += '<li class="left_title">'+records[i].get('MENU_NM')+'</li>';
		    					menu_html += '<li class="left_title_line"></li>';
		    				} else if (records[i].get('LEVL') == '2') { //중메뉴
		    					if (records[i].get('TRGT_URL') == null) {
		    						menu_html += '<li class="left_subtitle">'+records[i].get('MENU_NM')+'</li>';
		    					} else {
		    						menu_html += '<li class="left_subtitle"><a href="#" onclick="fnGoProg(\''+records[i].get('MENU_ID')+'\', \''+records[i].get('TRGT_URL')+'?PGMNAME='+records[i].get('MENU_NM')+'&PGMPATH=홈 > '+records[i].get('MENU_PATH')+'\')"><font id="font_'+records[i].get('MENU_ID')+'" onmouseover="fnProgMouseOver(this);" onmouseout="fnProgMouseOut(this);">'+records[i].get('MENU_NM')+'</font></a></li>';
		    					}
		    					menu_html += '<li class="left_subtitle_line"></li>';
		    					menu_html += '<li class="left_submenu"></li>';
		    				} else { //소메뉴
		    					if (records[i].get('TRGT_URL') == null) {
		    						menu_html += '<li class="left_submenu">'+records[i].get('MENU_NM')+'</li>';
		    					} else {
		    						menu_html += '<li class="left_submenu"><a href="#" onclick="fnGoProg(\''+records[i].get('MENU_ID')+'\', \''+records[i].get('TRGT_URL')+'?PGMNAME='+records[i].get('MENU_NM')+'&PGMPATH=홈 > '+records[i].get('MENU_PATH')+'\')"><font id="font_'+records[i].get('MENU_ID')+'" onmouseover="fnProgMouseOver(this);" onmouseout="fnProgMouseOut(this);">'+records[i].get('MENU_NM')+'</font></a></li>';
		    					}
		    				}
		    			}

	    				menu_html += '</ul>';

		    			document.getElementById('menu').innerHTML = menu_html;
		    		}
		    	}
		    });

			// 내 정보변경 관련 스크립트 시작
			Ext.define('CODE_MAIN', {
			    extend: 'Ext.data.Model',
			    fields: ['CD_TYPE', 'CD', 'CD_TYPE_DESC', 'CD_DESC', 'DISP_ORDR', 'UP_CD_TYPE', 'UP_CD', 'USE_YN']
			});

			Ext.define('USER_MAIN', {
			    extend: 'Ext.data.Model',
			    idProperty: 'ROWNUM',
			    fields: ['ROWNUM',
			             'USER_ID', 'COMP_ID', 'SHOP_ID','COMP_NM', 'SHOP_NM', 'LOGIN_ID', 'LOGIN_PWD', 'USER_NM',
			             'AUTH', 'USER_TYPE', 'DEPT_NM', 'POSI_NM', 'CELL_NO', 'TEL_NO', 'FAX_NO',
			             'EMAIL_ID', 'EMAIL_DOMAIN', 'USER_STAT',
			             'STOP_ID', 'STOP_NM', 'STOP_DT',
			             'LOGIN_ID_CHNG_DATE', 'LOGIN_PWD_CHNG_DATE',
			             'USER_TYPE_NM', 'USER_STAT_NM', 'EMAIL_NM', 'STOP_INFO',
			             'REGI_ID', 'REGI_NM', 'REGI_DT', 'UPDT_ID', 'UPDT_NM', 'UPDT_DT', 'REGI_INFO', 'UPDT_INFO']
			});

			var email_Main = '<%=email_Main%>';

			var emailStore = Ext.create('Ext.data.JsonStore', {
		    	model: 'CODE_MAIN',
		    	data: Ext.decode(email_Main)
		    });

		    emailStore.filter([
		        {property: 'USE_YN', value: 'Y'},
		        {filterFn: function(item){
		        	return item.get("CD") != '0000';
		        }}
		    ]);
		    emailStore.insert(0, new CODE_MAIN({
		    	CD: '',
		    	CD_DESC: '[ 직접 입력 ]'
		    }));

		    myInfo_store = Ext.create('Ext.data.JsonStore', {
		        pageSize: 10,
				model: 'USER_MAIN',
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
				}
			});

		    myInfoPopupForm = Ext.create('Ext.form.Panel', {
		    	id: 'form_myInfo',
		    	title: '사용자 상세',
		    	frame: true,
		    	height: 452,
		    	autoScroll: true,
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
		            colspan: 2,
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
		            		id: 'mainId_COMP_NM',
		            		name: 'COMP_NM',
		            		fieldLabel: '고객사',
		        			readOnly: true,
		    	    		fieldStyle: 'background:rgb(235,235,235);',
		            		width:280
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
		            		id: 'mainId_SHOP_NM',
		            		name: 'SHOP_NM',
		            		fieldLabel: '매장',
		        			readOnly: true,
		    	    		fieldStyle: 'background:rgb(235,235,235);',
		            		width:280
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
		            colspan: 2,
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
		        		id: 'mainId_USER_ID',
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
		            		id: 'mainId_LOGIN_ID',
		            		name: 'LOGIN_ID',
		            		fieldLabel: '로그인 ID',
		            		maxLength : 12,
		            		afterLabelTextTpl: fnRequiredValue(),
		            		width:280,
		    	    	    listeners: {
		    	    	    	change: function(obj, newVal, oldVal, eOpts){
		    	    	    		//수정시 재 검증.
		    	    	    		main_checkLoginId = 'N';
		    	    	    	}
		    	    	    }
	        			}, {
		        			xtype: 'button',
		        			text: 'ID중복체크',
		        	    	handler: function(){
		        	    		fnMainDistinctValue( '사용자 ID');
		        	    	}
		        		}, {
	        	            xtype: 'hidden',
	        	            id: 'mainId_PRE_LOGIN_ID',
	        	            name: 'PRE_LOGIN_ID'
	        	        }, {
	        	            xtype: 'hidden',
	        	            id: 'mainId_PRE_LOGIN_PWD',
	        	            name: 'PRE_LOGIN_PWD'
	        	        }]
		        	}, {
		        		xtype: 'textfield',
		        		id: 'mainId_LOGIN_PWD',
		        		name: 'LOGIN_PWD',
		        		inputType:'password',
		        		afterLabelTextTpl: fnRequiredValue(),
		        		maxLength : 100,
		        		fieldLabel: '비밀번호'
		        	}, {
		        		xtype: 'textfield',
		        		id: 'mainId_LOGIN_PWD_CHNG_DATE',
		        		name: 'LOGIN_PWD_CHNG_DATE',
		    			readOnly: true,
			    		fieldStyle: 'background:rgb(235,235,235);',
		        		fieldLabel: '비밀번호 변경일자'
		        	}, {
		        		xtype: 'textfield',
		        		id: 'mainId_USER_NM',
		        		name: 'USER_NM',
		        		afterLabelTextTpl: fnRequiredValue(),
		        		fieldLabel: '사용자 이름'
		        	}, {
		        		xtype: 'textfield',
		        		id: 'mainId_LOGIN_ID_CHNG_DATE',
		        		name: 'LOGIN_ID_CHNG_DATE',
		    			readOnly: true,
			    		fieldStyle: 'background:rgb(235,235,235);',
		        		fieldLabel: '로그인ID 변경일자'
		        	}, {
		        		xtype: 'textfield',
		        		id: 'mainId_AUTH',
		        		name: 'AUTH',
		    			readOnly: true,
			    		fieldStyle: 'background:rgb(235,235,235);',
		        		fieldLabel: '권한'
		        	}, {
		        		xtype: 'textfield',
		        		id: 'mainId_POSI_NM',
		        		name: 'POSI_NM',
		        		maxLength : 100,
		        		fieldLabel: '직책'
		        	}, {
		        		xtype: 'textfield',
		        		id: 'mainId_DEPT_NM',
		        		name: 'DEPT_NM',
		        		maxLength : 100,
		        		fieldLabel: '부서'
		        	}, {
		        		xtype: 'textfield',
		        		id: 'mainId_CELL_NO',
		        		name: 'CELL_NO',
		        		fieldLabel: '휴대폰번호',
		        		regex: new RegExp(/[01](0|1|6|7|8|9)[-](\d{4}|\d{3})[-]\d{4}$/),
		        		regexText: '핸드폰번호 형식(010-0000-0000)을 맞추어 주세요',
		        		maxLength: 16
		        	}, {
		        		xtype: 'textfield',
		        		id: 'mainId_TEL_NO',
		        		name: 'TEL_NO',
		        		fieldLabel: '연락처(전화)',
		        		regex: new RegExp(/^\d{1,16}|[-]|[(]|[)]?$/),
		        		regexText: '전화 번호를 형식에 맞게 입력하여 주세요.',
		        		maxLength: 16
		        	}, {
		        		xtype: 'textfield',
		        		id: 'mainId_FAX_NO',
		        		name: 'FAX_NO',
		        		fieldLabel: '연락처(FAX)',
		        		regex: new RegExp(/^\d{1,16}|[-]|[(]|[)]?$/),
		        		regexText: 'FAX번호를 형식에 맞게 입력하여 주세요.',
		        		maxLength: 16,
		        		colspan:2
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
		            		id: 'mainId_EMAIL_ID',
		            		name: 'EMAIL_ID',
		            		fieldLabel: '메일',
		            		maxLength : 50,
		            		width:180
	        			},{
	                		xtype: 'textfield',
	                		id: 'mainId_EMAIL_DOMAIN',
	                		name: 'EMAIL_DOMAIN',
	                		width: 110,
	                		labelWidth:10,
	                		maxLength : 50,
	                		fieldLabel: '@'
	            		},{
	            			xtype: 'combobox',
	        	    		store: emailStore,
	        	    		id: 'mainId_EMAIL_FIELD',
	        	    	    queryMode: 'local',
	        	    	    valueField: 'CD',
	        	    	    displayField: 'CD_DESC',
	        	    	    width: 116,
	        	    	    editable: false,
	        	    	    listeners: {
	        	    	    	change: function(field, newValue, oldValue){
	        	    	    		if (newValue == '') {
	        	    	    			Ext.getCmp('mainId_EMAIL_DOMAIN').setValue('');
	        	    	    			Ext.getCmp('mainId_EMAIL_DOMAIN').setReadOnly(false);
	        	    	    		} else {
	        	    	    			Ext.getCmp('mainId_EMAIL_DOMAIN').setValue(newValue);
	        	    	    			Ext.getCmp('mainId_EMAIL_DOMAIN').setReadOnly(true);
	        	    	    		}
	        	    	    	}
	        	    	    }
	            		}]
		        	}]
		    	},{
		    		xtype: 'fieldset',
		            title: '이력 정보',
		            defaultType: 'textfield',
		            colspan: 2,
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
			    		id: 'mainId_REGI_INFO',
			    		name: 'REGI_INFO',
			    		fieldLabel: '등록정보 : '
			    	}, {
			    		xtype: 'displayfield',
			    		id: 'mainId_UPDT_INFO',
			    		name: 'UPDT_INFO',
			    		fieldLabel: '수정정보 : '
			    	}, {
			    		xtype: 'displayfield',
			    		id: 'mainId_STOP_INFO',
			    		name: 'STOP_INFO',
			    		fieldLabel: '사용중지정보 : '
			    	}]
		        }]
		    });

		    //내정보 변경 팝업 Popup Window
		    popup_myInfoPopupForm = Ext.create('Ext.window.Window', {
		    	title: '[Face !nsight] 내 정보 변경',
		    	width: 830,
		    	height: 472,
		    	closable:false,
		    	draggable: false,
		    	resizable: false,
		        items: [myInfoPopupForm],
		        buttonAlign: 'center',
		        buttons: [{
		        	text: '수정',
		            id: 'btn_addr_apply_myInfoForm',
		            handler: function(){
	  					fnSaveFormMain();
		            }
		        }, {
		        	text: '닫기',
		            id: 'btn_upload_close_myInfoForm',
		            handler: function(){
		            	fnCloseMyInfo();
		            }
		        }]
		    });

		    //중복 값 Check
		    function fnMainDistinctValue( idLabel ){
		    	var params = {
	    			LOGIN_ID: Ext.getCmp('mainId_LOGIN_ID').getValue()
		    	};

		    	var idCheck = Ext.getCmp('mainId_LOGIN_ID').getValue();

		    	//var regExp = /[a-z0-9_^\\s]{4,20}$/i; // 영문 과 숫자 조합한것만..
		    	var regExp = /[^(a-zA-Z0-9)]/; // 영문 과 숫자 만..
		    	if(regExp.test(idCheck) ){
		    		//fnShowMessage("로그인ID는 영문 또는 숫자만 입력가능합니다");
		    		fnShowMessage( parent.msgProperty.COM_ERR_0054.replace('param1', '로그인ID') );
		    	 	return;
		    	}

		    	if(idCheck.length < 6 || idCheck.length >= 12){
		    		//fnShowMessage("로그인ID는 6자리 ~ 12자리 이하로 입력하세요.");
		    		fnShowMessage( parent.msgProperty.COM_ERR_0055.replace('param1', '로그인ID') );
		    	 	return;
		    	}

		    	fnSubmitFormStore('/mng/com/UserMngt/selectCheckLoginId.do', params, function(response, opts){
		    		var result = Ext.decode(response.responseText);
		    		var msgCode = result.messageCode;
		    		var msg = result.message;
		    		msg = msg.replace("param1", idLabel);
		    		fnShowMessage(msg);
		    		if (msgCode == 'COM_RST_0005') { //{param1}은(는) 사용이 가능합니다.
		    			main_checkLoginId = 'Y';
		    		} else if(msgCode == 'COM_ERR_0012') {//{param1}은(는) 현재 존재하는 값으로 사용이 불가능합니다.
		    			main_checkLoginId = 'N';
		    		}
		    	});
		    }


		    //Form Validation
		    function fnFormValidMain(frm){
		    	var retStr = null;


		    	if(!frm.isValid()){
		    		retStr = parent.msgProperty.COM_ERR_0023 ;//'입력 폼 중 입력 폼에 맞지 않게 입력된 값이 있습니다.<br>빨간 줄로 표시된 입력 폼을 확인하여 주시기 바랍니다.';
		    	}else if(Ext.getCmp('mainId_LOGIN_ID').getValue() == null || Ext.getCmp('mainId_LOGIN_ID').getValue() == ''){
		    		retStr = parent.msgProperty.COM_ERR_0014.replace('param1', '로그인ID');//'로그인ID는 필수 입력 사항입니다.';
		    	}else if (main_checkLoginId == 'N') {
		     		retStr = parent.msgProperty.COM_ERR_0033; //'로그인ID 중복체크를 해주시기 바랍니다.';
		        }else if(Ext.getCmp('mainId_USER_NM').getValue() == null || Ext.getCmp('mainId_USER_NM').getValue() == ''){
		    		retStr = parent.msgProperty.COM_ERR_0014.replace('param1', '사용자이름');//'사용자이름은 필수 입력 사항입니다.';
		    	}else if(Ext.getCmp('mainId_LOGIN_PWD').getValue().length < 6 || Ext.getCmp('mainId_LOGIN_PWD').getValue().length >= 12){
		    		//fnShowMessage("비밀번호는 6자리 ~ 12자리 이하로 입력하세요.");
		    		retStr = parent.msgProperty.COM_ERR_0055.replace('param1', '비밀번호');
		    	}

		    	return retStr;
		    }

		    //저장
		    function fnSaveFormMain(){

		    	var frm = myInfoPopupForm.getForm();
		    	var validStr = fnFormValidMain(frm);

		    	if (validStr) {
		    		fnShowMessage(validStr);
		    		return;
		    	}


		    	fnSetElMask(popup_myInfoPopupForm);
		    	var frm = myInfoPopupForm.getForm();
		    	frm.submit({
		    		url: '/mng/com/UserMngt/updateUserMyinfo.do',
		    		success: function(form, action){
		    			fnSetElUnmask(popup_myInfoPopupForm);
		    			fnShowMessage(action.result.message); //저장을 완료하였습니다.
		    			fnCloseMyInfo();
		    		},
		    		failure: function(form, action){
		    			fnSetElUnmask(popup_myInfoPopupForm);
		    			fnShowMessage(action.result.message); //저장에 실패하였습니다.
		    			fnCloseMyInfo();
		    		}
		    	});
		    }
		 	// 내 정보변경 관련 스크립트 끝

		    Ext.getCmp('mainId_EMAIL_FIELD').setValue('');
		});
	</script>
</head>
<body onload="self.scrollTo(0, 0);">
	<div id="top" class="layout_top">
		<div id="top_wrap" class="layout_top_warp">
			<div id="logout" class="layout_logout">
				<div id="login_name" class="layout_login_name"><script>document.write(gvUserNm);</script>님 반갑습니다.</div>
				<div id="logout_btn" class="layout_login_btn"><img src="/images/main/btn_logout_nor.png" border="0" style="cursor:pointer;" onclick="fnLogOut()" onmouseover="this.src='/images/main/btn_logout_click.png'" onmouseout="this.src='/images/main/btn_logout_nor.png'"></div>
				<div id="profil_change" class="layout_profil_change"><img src="/images/main/btn_profil_change_nor.png" border="0" style="cursor:pointer;" onclick="fnOpenMyInfo()" onmouseover="this.src='/images/main/btn_profil_change_click.png'" onmouseout="this.src='/images/main/btn_profil_change_nor.png'"></div>
				<div id="use_menu" class="layout_use_menu"><img src="/images/main/btn_use_menu_nor.png" border="0" style="cursor:pointer;" onclick="fnDownMenu()" onmouseover="this.src='/images/main/btn_use_menu_click.png'" onmouseout="this.src='/images/main/btn_use_menu_nor.png'"></div>
			</div>
			<div id="top_sub" class="layout_top_sub">
				<div id="logo" class="layout_logo"><a href="/sys/com/Main/mainPage.do"><img src="/images/main/logo.png" border="0" style="cursor:pointer;"></a></div>
				<div id="top_menu" class="layout_top_menu"></div>
			</div>
		</div>
	</div>
    <div id="main" class="layout_wrap">
		<div id="main" class="layout_main">
			<div id="menu" class="layout_menu" style="overflow: auto;"></div>
			<div id="content" class="layout_content">
				<iframe id="content_iframe" src="" frameBorder="0" style="width:100%; height:1050px; border:0;"></iframe>
			</div>
		</div>
   </div>

	<div id="bottom" class="layout_bottom">
	   <div class="layout_bottom_image"><img src="/images/main/sub_bottom.png" border="0"></div>
	</div>
</body>
</html>
