/*공지형 게시판*/
var scMap = "";

var fnOpenModiPopup;
Ext.define('COMM_BRD_LIST', {
	extend : 'Ext.data.Model',
	idProperty : 'ROWNUM',
	fields : [ 'ROWNUM', 'BRD_ID', 'SEQ', 'BRD_TYPE', 'TOP_SEQ', 'PRNT_SEQ',
			'LEV', 'STEP', 'SUBJ', 'CNTS', 'FILE_UID', 'READ_CNT', 'NTIC_YN',
			'NTIC_STRT_DATE', 'NTIC_END_DATE', 'RMTE_IP', 'REGI_ID', 'REGI_NM',
			'REGI_DT', 'UPDT_ID', 'UPDT_NM', 'UPDT_DT', 'PROG_ID', 'FILE_NM' ]
});

Ext.define('COMM_BRD', {
	extend : 'Ext.data.Model',
	idProperty : 'SEQ',
	fields : [ 'BRD_ID', 'SEQ', 'BRD_TYPE', 'TOP_SEQ', 'PRNT_SEQ', 'LEV',
			'STEP', 'READ_CNT', 'RMTE_IP', 'REGI_ID', 'REGI_DT', 'UPDT_ID',
			'UPDT_DT', 'REGI_INFO', 'UPDT_INFO', 'NTIC_YN', 'NTIC_STRT_DATE',
			'NTIC_END_DATE', 'NTIC_YN_V', 'NTIC_STRT_DATE_V',
			'NTIC_END_DATE_V', 'SUBJ', 'CNTS', 'SUBJ_V', 'CNTS_V', 'FILE_UID',
			'FILE_SEQ', 'FILE_NM', 'FILE_UID_V', 'FILE_SEQ_V', 'FILE_NM_V',
			'REPLY_FLAG']
});

// Grid Renderer
function fnRenderer(value, metaData, record, rowIndex, colIndex, store, view) {
	// 제목
	if (colIndex == 1) {
		// Blank Image
		var imgB = "<img border='0px' src='/images/icon/icon_arrowB.png' width='13' height='13' > ";
		// Arrow Image
		var img = "<img border='0px' src='/images/icon/icon_arrow.png' width='13' height='13' > ";
		// Link
		value = "<a href=\"javascript:fnOpenModiPopup('" + record.get('SEQ')
				+ "', 'R')\">" + value + "</a>" + imgB;
		// Level에 따라 Image Setting.
		if (record.get('LEV') != '0') {
			var lev = parseInt(record.get('LEV'));
			var imgValue = '';
			for ( var idx = 0; idx < lev; idx++) {
				if (idx == (lev - 1)) {
					imgValue = imgValue + img;
				} else {
					imgValue = imgValue + imgB;
				}
			}
			value = imgValue + value;
		}
	}
	return value;
}

Ext.onReady(function() {
	Ext.QuickTips.init();

	/** Grid 영역 * */
	var store = Ext.create('Ext.data.JsonStore', {
		pageSize : 10,
		model : 'COMM_BRD_LIST',
		proxy : {
			type : 'ajax',
			api : {
				read : '/mng/brd/CommBrd/selectCommBrdList.do'
			},
			reader : {
				type : 'json',
				root : 'data',
				totalProperty : 'total',
				successProperty : 'success',
				messageProperty : 'message'
			},
			listeners : {
				exception : function(proxy, response, operation) {
					fnShowProxyMsg(proxy, response, operation);
				}
			}
		},
		listeners : {
			beforeload : function(store, operation) {

				var eParams = {
					BRD_ID : brdId,
					BRD_TYPE : brdType,
					SUBJ : Ext.getCmp('s_subj').getValue(),
					PROG_ID : progId,
					SC_MAP : scMap
				};
				store.proxy.extraParams = eParams;

			},
			load : function(store, records, success, eOpts) {
				// Paging을 통한 검색은 제외한다.
				
				scMap = "";
			},
			remove : function(store, record, index) {

				if (record.get('ROWNUM') == '') {
					return;
				}
				var after_fn = function(response, opts) {
					var result = Ext.decode(response.responseText);
					if (result.success) {
						fnShowMessage(parent.msgProperty.COM_RST_0003 , Ext.MessageBox.INFO, function(
								buttonId, text, opt) {// 삭제를 완료하였습니다.
							if (buttonId == 'ok') {
								store.loadPage(1);
							}
						});
					} else {
						var msg = '';
						try {
							msg = result.message;
						} catch (err) {
							msg = parent.msgProperty.COM_ERR_0003;// 삭제에 실패하였습니다.
						}
						fnShowMessage(msg);
					}
				};
				fnSubmitGridStore(store, '/mng/brd/CommBrd/deleteCommBrd.do',after_fn);
			}
		}
	});

	var search_panel = Ext.create('Ext.panel.Panel', {
		id : 's_panel',
		renderTo : 'search_div',
		bodyPadding : 0,
		border : 0,
		items : {
			defaults : {
				padding : 0,
				margin : 1,
				labelAlign : 'right',
				labelSeparator : '',
				labelWidth : 70,
				width : 220
			},
			border : 0,
			layout : {
				type : 'hbox',
				align : 'stretch'
			},
			items : [ {
				xtype : 'textfield',
				id : 's_subj',
				fieldLabel : '제목',
        		enterEventEnabled:true,
				search_cd : 'SUBJ;00012'
			} ]
		}
	});

	var btn_add = Ext.create('Ext.button.Button', {
		id : 'btn_add',
		text : '글쓰기',
		icon : '/images/icon/icon_add.png',
		width : 70,
		handler : function() {
			fnOpenNewBrdPopup();
		}
	});

	var btn_reset = Ext.create('Ext.button.Button', {
		id : 'btn_reset',
		text : '초기화',
		icon : '/images/icon/icon_reset.png',
		handler : function() {
			fnInitSearch(grid_panel, search_panel);
		}
	});

	var btn_search = Ext.create('Ext.button.Button', {
		id : 'btn_search',
		text : '조회',
		icon : '/images/icon/icon_search.png',
		handler : function() {
			fnGridSearch();
		}
	});

	var grid_panel = Ext.create('Ext.grid.Panel', {
		id : 'grid',
		columnLines : true,
		viewConfig : {
			enableTextSelection : true,
			stripeRows : true
		},
		width : 'auto',
		height : 516,
		store : store,
		columns : [ {
			xtype : 'rownumberer',
			text : 'No',
			width : 40,
			align : 'center'
		}, {
			text : '제목',
			width : 406,
			dataIndex : 'SUBJ',
			renderer : fnRenderer
		}, {
			text : '작성자',
			width : 100,
			dataIndex : 'REGI_NM',
			renderer : fnRenderer
		}, {
			text : '작성일',
			width : 110,
			dataIndex : 'REGI_DT',
			renderer : fnRenderer
		}, {
			text : '조회',
			width : 60,
			dataIndex : 'READ_CNT',
			align : 'right',
			renderer : fnRenderer
		}, {
			text : '첨부파일',
			width : 100,
			dataIndex : 'FILE_NM'
		} ],
		tbar : [ {
			xtype : 'panel',
			id : 'l_panel',
			bodyPadding : 0,
			bodyStyle : 'background-color:transparent;',
			border : 0,
			layout : {
				type : 'hbox',
				align : 'stretch'
			},
			items : [ btn_add
			]
		}, {
			xtype : 'tbfill'
		}, {
			xtype : 'panel',
			id : 'r_panel',
			bodyPadding : 0,
			bodyStyle : 'background-color:transparent;',
			border : 0,
			layout : {
				type : 'hbox',
				align : 'stretch'
			},
			items : [ btn_reset, {
				xtype : 'tbspacer'
			}, btn_search ]
		} ],
		dockedItems : [ {
			xtype : 'pagingtoolbar',
			displayInfo : true,
			dock : 'bottom',
			store : store
		} ]
	});

	/** Grid 영역 End * */

	/** Edit Form 영역 Start * */

	var form_store = Ext.create('Ext.data.JsonStore', {
		pageSize : 10,
		model : 'COMM_BRD',
		proxy : {
			type : 'ajax',
			api : {
				read : '/mng/brd/CommBrd/selectCommBrd.do'
			},
			reader : {
				type : 'json',
				root : 'data',
				totalProperty : 'total',
				successProperty : 'success',
				messageProperty : 'message'
			},
			listeners : {
				exception : function(proxy, response, operation) {
					fnShowProxyMsg(proxy, response, operation);
				}
			}
		},
		listeners : {
			beforeload : function(store, operation) {

			},
			remove : function(store, record, index) {
				if (record.get('ROWNUM') == '') {
					return;
				}

				var after_fn = function(response, opts) {
					var result = Ext.decode(response.responseText);
					if (result.success) {
						fnShowMessage(parent.msgProperty.COM_RST_0003 , Ext.MessageBox.INFO, function(
								buttonId, text, opt) {// 삭제를 완료하였습니다.
							if (buttonId == 'ok') {
								store.loadPage(1);
							}
						});
					} else {
						var msg = '';
						try {
							msg = result.message;
						} catch (err) {
							msg = parent.msgProperty.COM_ERR_0003;// 삭제에 실패하였습니다.
						}
						fnShowMessage(msg);
					}
				};

				fnSubmitGridStore(store, '/mng/brd/CommBrd/deleteCommBrd.do',
						after_fn);
			}
		}
	});

	var form_write_form = Ext.create('Ext.form.Panel', {
		id : 'form_write_form',
		title : '[Face !nsight] 게시판',
		height : 530,
		frame : true,
		hidden : true,
		url : '/mng/brd/CommBrd/insertOrUpdateCommBrd.do',
		style : {
			backgroundColor : 'white'
		},
		layout : {
			type : 'table',
			columns : 1,
			tableAttrs : {
				style : {
					width : '100%'
				}
			}
		},
		fieldDefaults : {
			padding : 0,
			margin : 1,
			labelAlign : 'right',
			labelSeparator : '',
			labelWidth : 100,
			width : 806
		},
		items : [{/*공지사항 설정*/
        	xtype: 'fieldset',
            title: '공지사항 설정',
            defaultType: 'textfield',
            layout: 'anchor',
            colspan: 2,
            margin: "1 10 1 10",
            width: 794,
            hidden: false,
            defaults: {
                anchor: '100%'
            },
        	layout: {
        	    type: 'table',
        	    columns: 3
        	},
        	style: {
        		backgroundColor: 'rgb(223, 233, 246)'
        	},
        	items: [{
                	xtype: 'checkboxfield',
                	fieldLabel: '공지 여부',
                	id: 'NTIC_YN_Edit',
                	name: 'NTIC_YN',
                	inputValue: 'Y',
                	labelWidth: 100,
                	width: 300
                }, {
                	xtype: 'datefield',
                	fieldLabel: '공지기간',
                	id: 'NTIC_STRT_DATE_Edit',
                	name: 'NTIC_STRT_DATE',
                	format:'Y-m-d',
                	altFormats: 'm,d,Y|m.d.Y|Ymd',
                	labelWidth: 100,
                	width: 200,
            	    listeners: {
            	    	change: function(obj, newValue, oldValue, eOpts){
            	    		var srvcEndDate =  Ext.getCmp('NTIC_END_DATE_Edit').getValue();
            	    		var thisValue = obj.getValue();
            	    		if(srvcEndDate != '' && srvcEndDate != null && srvcEndDate < thisValue){
            	    			fnShowMessage('공지기간은 종료일자 보다 시작일자가 클 수는 없습니다.');
            	    			obj.setValue(srvcEndDate);
            	    			return;
            	    		}
            	    	}
            	    }
                }, {
                	xtype: 'datefield',
                	fieldLabel: '~',
                	id: 'NTIC_END_DATE_Edit',
                	name: 'NTIC_END_DATE',
                	format:'Y-m-d',
                	altFormats: 'm,d,Y|m.d.Y|Ymd',
                	labelWidth: 10,
                	width: 110,
            	    listeners: {
            	    	change: function(obj, newValue, oldValue, eOpts){
            	    		var srvcStrtDate =  Ext.getCmp('NTIC_STRT_DATE_Edit').getValue();
            	    		var thisValue = obj.getValue();
            	    		if(srvcStrtDate != '' && srvcStrtDate != null && srvcStrtDate > thisValue){
            	    			fnShowMessage('공지기간은 시작일자 보다 종료일자가 작을 수는 없습니다.');
            	    			obj.setValue(srvcStrtDate);
            	    			return;
            	    		}
            	    	}
            	    }
                } 
    		]
        }, {
			xtype : 'textfield',
			fieldLabel : '제목',
			id : 'SUBJ_Edit',
			name : 'SUBJ',
    		afterLabelTextTpl: fnRequiredValue(),
			labelWidth : 80,
			maxLength: 100
		}, {
			xtype : 'htmleditor',
			id : 'CNTS_Edit',
			name : 'CNTS',
			height : 280,
			maxLength: 8000,
			mandatoryLabel: '내용'
		}, {
			xtype : 'FileMastPanel',
			border : 0,
			padding : '0 5 0 0',
			margin : '0 5 0 0',
			labelWidth : 80,
			panelMode : 'edit',
			fileUidIdNm : 'FILE_UID',
			fileSeqIdNm : 'FILE_SEQ',
			fileNmIdNm : 'FILE_NM'
		}, {/* 이력정보 */
			xtype : 'fieldset',
			title : '이력정보',
			defaultType : 'textfield',
			layout : 'anchor',
			colspan : 2,
			margin : "1 10 1 10",
			defaults : {
				anchor : '100%'
			},
			layout : {
				type : 'table',
				columns : 2
			},
			style : {
				backgroundColor : 'rgb(223, 233, 246)'
			},
			items : [{
				xtype : 'displayfield',
				id : 'REGI_INFO',
				name : 'REGI_INFO',
				fieldLabel : '등록정보 : ',
				labelWidth : 100,
				width : 380
			}, {
				xtype : 'displayfield',
				id : 'UPDT_INFO',
				name : 'UPDT_INFO',
				fieldLabel : '수정정보 : ',
				labelWidth : 100,
				width : 380
			} ]
		}, {
			xtype : 'hidden',
			id : 'BRD_ID',
			name : 'BRD_ID'
		}, {
			xtype : 'hidden',
			id : 'SEQ',
			name : 'SEQ'
		}, {
			xtype : 'hidden',
			id : 'BRD_TYPE',
			name : 'BRD_TYPE'
		}, {
			xtype : 'hidden',
			id : 'TOP_SEQ',
			name : 'TOP_SEQ'
		}, {
			xtype : 'hidden',
			id : 'PRNT_SEQ',
			name : 'PRNT_SEQ'
		}, {
			xtype : 'hidden',
			id : 'LEV',
			name : 'LEV'
		}, {
			xtype : 'hidden',
			id : 'STEP',
			name : 'STEP'
		}, {
			xtype : 'hidden',
			id : 'REPLY_FLAG',
			name : 'REPLY_FLAG'
		}, {
			xtype : 'hidden',
			id : 'PROG_ID',
			name : 'PROG_ID'
		} ],
		buttonAlign : 'center',
		buttons : [ {
			text : '저장',
			id : 'btn_brd_write_submit',
			icon : '/images/icon/icon_save.png',
			handler : function() {
				fnSubmitBrdPopup();
			}
		}, {
			text : '초기화',
			id : 'btn_brd_write_init',
			icon : '/images/icon/icon_popup_reset.png',
			handler : function() {
				form_write_form.getForm().reset();
			}
		}, {
			text : '닫기',
			id : 'btn_brd_write_close',
			icon : '/images/icon/icon_popup_close.png',
			handler : function() {
				fnCloseBrdPopup();
			}
		} ]
	});

	var form_read_form = Ext.create('Ext.form.Panel', {
		id : 'form_read_form',
		title : '[Face !nsight] 게시판',
		height : 530,
		frame : true,
		hidden : true,
		url : '/mng/brd/CommBrd/insertOrUpdateCommBrd.do',
		style : {
			backgroundColor : 'white'
		},
		layout : {
			type : 'table',
			columns : 1,
			tableAttrs : {
				style : {
					width : '100%'
				}
			}
		},
		fieldDefaults : {
				padding : 0,
				margin : 1,
				labelAlign : 'right',
				labelSeparator : '',
				labelWidth : 100,
				width : 806
			},
			items : [{/*공지사항 설정*/
	        	xtype: 'fieldset',
	            title: '공지사항 설정',
	            defaultType: 'textfield',
	            layout: 'anchor',
	            colspan: 2,
	            margin: "1 10 1 10",
	            width: 794,
	            hidden: false,
	            defaults: {
	                anchor: '100%'
	            },
	        	layout: {
	        	    type: 'table',
	        	    columns: 3
	        	},
	        	style: {
	        		backgroundColor: 'rgb(223, 233, 246)'
	        	},
	        	items: [{
						xtype: 'checkboxfield',
						fieldLabel: '공지 여부',
						id: 'NTIC_YN_Read',
						name: 'NTIC_YN_V',
						inputValue: 'Y',
						readOnly: true,
						labelWidth: 100,
						width: 300
					}, {
		    			xtype: 'textfield',
		    			fieldLabel: '공지기간 ',
		    			id: 'NTIC_STRT_DATE_Read',
		                name: 'NTIC_STRT_DATE_V',
		                readOnly: true,
			    		fieldStyle: 'background:rgb(235,235,235);',
	                	labelWidth: 100,
	                	width: 180			                
		            }, {
		            	xtype: 'textfield',
		            	fieldLabel: '~',
		            	id: 'NTIC_END_DATE_Read',
		                name: 'NTIC_END_DATE_V',
		                readOnly: true,
			    		fieldStyle: 'background:rgb(235,235,235);',
	                	labelWidth: 10,
	                	width: 90
		            }
        		]
	        }, {
				xtype : 'textfield',
				fieldLabel : '제목',
				id : 'SUBJ_Read',
				name : 'SUBJ_V',
				readOnly : true,
				fieldStyle : 'background:rgb(235,235,235);'
			}, {
				xtype : 'htmleditor',
				id : 'CNTS_Read',
				name : 'CNTS_V',
				readOnly : true,
				height : 280
			},
			/* File Upload */
			{
				xtype : 'FileMastPanel',
				border : 0,
				padding : '0 5 0 0',
				margin : '0 5 0 0',
				labelWidth : 80,
				panelMode : 'read',
				fileUidIdNm : 'FILE_UID_V',
				fileSeqIdNm : 'FILE_SEQ_V',
				fileNmIdNm : 'FILE_NM_V'
			} , {/* 이력정보 */
			xtype : 'fieldset',
			title : '이력정보',
			defaultType : 'textfield',
			layout : 'anchor',
			colspan : 2,
			margin : "1 10 1 10",
			defaults : {
				anchor : '100%'
			},
			layout : {
				type : 'table',
				columns : 2
			},
			style : {
				backgroundColor : 'rgb(223, 233, 246)'
			},
			items : [ {
				xtype : 'displayfield',
				id : 'REGI_INFO_Read',
				name : 'REGI_INFO',
				fieldLabel : '등록정보 : ',
				labelWidth : 100,
				width : 380				
			}, {
				xtype : 'displayfield',
				id : 'UPDT_INFO_Read',
				name : 'UPDT_INFO',
				fieldLabel : '수정정보 : ',
				labelWidth : 100,
				width : 380				
			} ]
		}, {
			xtype : 'hidden',
			id : 'BRD_ID',
			name : 'BRD_ID'
		}, {
			xtype : 'hidden',
			id : 'SEQ',
			name : 'SEQ'
		}, {
			xtype : 'hidden',
			id : 'BRD_TYPE',
			name : 'BRD_TYPE'
		}, {
			xtype : 'hidden',
			id : 'TOP_SEQ',
			name : 'TOP_SEQ'
		}, {
			xtype : 'hidden',
			id : 'PRNT_SEQ',
			name : 'PRNT_SEQ'
		}, {
			xtype : 'hidden',
			id : 'LEV',
			name : 'LEV'
		}, {
			xtype : 'hidden',
			id : 'STEP',
			name : 'STEP'
		}, {
			xtype : 'hidden',
			id : 'REPLY_FLAG',
			name : 'REPLY_FLAG'
		}, {
			xtype : 'hidden',
			id : 'PROG_ID',
			name : 'PROG_ID'
		} ],
		buttonAlign : 'center',
		buttons : [
				{
					text : '수정',
					id : 'btn_brd_read_edit',
					icon : '/images/icon/icon_popup_modify1.png',
					handler : function() {
						fnOpenModiPopup(Ext.getCmp('SEQ').getValue(), 'E');
					}
				},
				{
					text : '삭제',
					id : 'btn_brd_read_remove',
					icon : '/images/icon/icon_delete.png',
					handler : function() {
						fnRemoveBrd();
					}
				},				
				{
					text : '답글달기',
					id : 'btn_brd_read_repl',
					icon : '/images/icon/icon_popup_reply.png',
					hidden : true,
					handler : function() {
						fnOpenNewReplyPopup(Ext.getCmp('TOP_SEQ').getValue(),
								Ext.getCmp('SEQ').getValue(), Ext.getCmp('LEV')
										.getValue(), Ext.getCmp('STEP')
										.getValue(), Ext.getCmp('SUBJ_Read')
										.getValue());
					}
				}, {
					text : '닫기',
					id : 'btn_brd_read_close',
					icon : '/images/icon/icon_popup_close.png',
					handler : function() {
						fnCloseBrdPopup();
					}
				} ]
	});

	/** Edit Form 영역 End * */

	// 화면 출력 Panel
	Ext.create('Ext.panel.Panel', {
		renderTo : 'main_div',
		border : 0,
		padding : 0,
		margin : 0,
		width : 818,
		items : [ grid_panel, {
			xtype : 'tbspacer',
			height : 10
		}, form_write_form, form_read_form ]
	});

	/** Function Area Start * */

	// 게시판 조회.
	function fnGridSearch(){
		fnSetPanelShow('Grid');
		store.loadPage(1);
	}
	
	// 게시판 저장.
	function fnSubmitBrdPopup() {
		if(fnIsFormDfultValid(form_write_form)){
    		return;
    	}
		
		var frm = form_write_form.getForm();
		fnSetElMask();
		frm.submit({
			url : '/mng/brd/CommBrd/insertOrUpdateCommBrd.do',
			success : function(form, action) {
				fnSetElUnmask();
				fnShowMessage(action.result.message);// 저장을 완료하였습니다.
				fnGridSearch();
			},
			failure : function(form, action) {
				fnSetElUnmask();
				fnShowMessage(action.result.message);// 저장에 실패하였습니다.
			}
		});
	}
	
	//게시판 삭제.
	function fnRemoveBrd(){
		Ext.MessageBox.confirm('FCAS', parent.msgProperty.COM_IFO_0001, //삭제하시겠습니까?
			function(btnid){
    			if (btnid == 'yes') {
    				var frm = form_write_form.getForm();
    				fnSetElMask();
    				frm.submit({
    					url : '/mng/brd/CommBrd/deleteCommBrd.do',
    					success : function(form, action) {
    						fnSetElUnmask();
    						fnShowMessage(action.result.message);// 저장을 완료하였습니다.
    						fnGridSearch();
    					},
    					failure : function(form, action) {
    						fnSetElUnmask();
    						fnShowMessage(action.result.message);// 저장에 실패하였습니다.
    					}
    				});	    				
    			}
			}
		);
	}
	
	// 신규 게시물 입력 Popup Open
	function fnOpenNewBrdPopup() {
		form_write_form.getForm().reset();
		//초기화 Button 활성화
		Ext.getCmp('btn_brd_write_init').setVisible(true);		
		form_write_form.loadRecord(new COMM_BRD({
			BRD_ID : brdId,
			BRD_TYPE : brdType,
			TOP_SEQ : "",
			PRNT_SEQ : "",
			LEV : "0",
			STEP : "0",
			REPLY_FLAG : "N",
			NTIC_STRT_DATE: new Date(),
			NTIC_END_DATE: new Date(Date.parse(new Date()) + 604800000), //7 * 1000 * 60 * 60 * 24
			PROG_ID : progId
		}));
		fnSetPanelShow('WritePanel');
	}

	// 신규 댓글 입력 Popup Open
	function fnOpenNewReplyPopup(topSeq, seq, pmt_lev, pmt_step, subj) {
		form_write_form.getForm().reset();
		//초기화 Button 활성화
		Ext.getCmp('btn_brd_write_init').setVisible(true);		
		form_write_form.loadRecord(new COMM_BRD({
			BRD_ID : brdId,
			BRD_TYPE : brdType,
			SUBJ : '[답글] ' + subj,
			TOP_SEQ : topSeq,
			PRNT_SEQ : seq,
			LEV : pmt_lev,
			STEP : pmt_step,
			REPLY_FLAG : "Y",
			PROG_ID : progId
		}));
		fnSetPanelShow('WritePanel');
	}

	// 게시물 수정 Popup Open
	fnOpenModiPopup = function(seq, type) {
		var eParams = {
			BRD_ID : brdId,
			BRD_TYPE : brdType,
			SEQ : seq,
			PROG_ID : progId
		};
		form_store.proxy.extraParams = eParams;
		form_store.load({
			scope : this,
			callback : function(records, operation, success) {
				if (records.length == 1) {
					//작성자만 수정/삭제할 수 있습니다. - 추후 추가 사항 관리자는 무조건 수정 가능.
					if(records[0].get('REGI_ID') == parent.gvUserId){
						Ext.getCmp('btn_brd_read_edit').setVisible(true);
						Ext.getCmp('btn_brd_read_remove').setVisible(true);
					}else {
						Ext.getCmp('btn_brd_read_edit').setVisible(false);
						Ext.getCmp('btn_brd_read_remove').setVisible(false);
					}
					if (type == 'R') {
						form_read_form.loadRecord(records[0]);
						fnSetPanelShow('ReadPanel');

					} else {
						form_write_form.loadRecord(records[0]);
						fnSetPanelShow('WritePanel');
						//초기화 Button 제거 - 수정시에는 초기화 버튼이 필요없음.
						Ext.getCmp('btn_brd_write_init').setVisible(false);
						//수정은 댓글이던 아니건 상관이 없다.
						Ext.getCmp('REPLY_FLAG').setValue('N');						
					}

				} else {
					fnShowMessage(parent.msgProperty.COM_ERR_0007);
					return;
				}
			}
		});
	};

	// 게시판 입력 Popup Close
	function fnCloseBrdPopup() {
		fnSetPanelShow('Grid');
		store.loadPage(1);
	}

	// Grid, WritePanel, ReadPanel
	function fnSetPanelShow(type) {
		if (type == 'Grid') {
			grid_panel.setHeight(516);
			form_read_form.setVisible(false);
			form_write_form.setVisible(false);
		} else if (type == 'WritePanel') {
			grid_panel.setHeight(200);
			form_read_form.setVisible(false);
			form_write_form.setVisible(true);
			
		} else if (type == 'ReadPanel') {
			grid_panel.setHeight(200);
			form_read_form.setVisible(true);
			form_write_form.setVisible(false);
		}
	}

	// Ext.getCmp('CNTS_Read').toolbar.setHeight(0);
	// Ext.getCmp('CNTS_Read').toolbar.setVisible(false);

	/** Function Area End * */
	
	fnVerifyColumnValueByte(Ext.getCmp('CNTS_Edit'),8000);
	
	Ext.getCmp('CNTS_Read').getToolbar().setHeight(0);
    Ext.getCmp('CNTS_Read').getToolbar().setVisible(false);
    
    fnIframeHeight(730); //200 + 530
    
});
