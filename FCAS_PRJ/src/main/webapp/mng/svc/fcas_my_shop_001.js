var isFormExpanded = false;
// 공통코드 Model
Ext.define('CODE', {
	extend : 'Ext.data.Model',
	fields : [ 'CD_TYPE', 'CD', 'CD_TYPE_DESC', 'CD_DESC', 'DISP_ORDR',
			'UP_CD_TYPE', 'UP_CD', 'USE_YN' ]
});

// 매장 Grid Model
Ext.define('SHOP_LIST', {
	extend : 'Ext.data.Model',
	idPropert : 'ROWNUM',
	fields : [ 'ROWNUM', 'COMP_ID', 'COMP_NM', 'SHOP_ID', 'SHOP_NM',
			'SRVC_STRT_DATE', 'SRVC_END_DATE', 'CMRA_CNT', 'SHOP_ADDR1',
			'SHOP_ADDR1_CODE', 'SHOP_ADDR2', 'BIZ_ITEM_1', 'BIZ_ITEM_2',
			'BIZ_ITEM_3', 'SHOP_RMRK', 'OPEN_TM', 'CLOSE_TM', 'FILE_UID',
			'REGI_ID', 'REGI_NM', 'REGI_DT', 'UPDT_ID', 'REGI_NM', 'UPDT_DT',
			'BIZ_ITEM_1_DESC', 'BIZ_ITEM_2_DESC', 'BIZ_ITEM_3_DESC',
			'SRVC_DATE', 'OPEN_CLOSE_TM' ]
});

// 매장 Form Model
Ext.define('SHOP', {
	extend : 'Ext.data.Model',
	idPropert : 'ROWNUM',
	fields : [ 'COMP_ID', 'COMP_NM', 'SHOP_ID', 'SHOP_NM', 'SRVC_STRT_DATE',
			'SRVC_END_DATE', 'CMRA_CNT', 'SHOP_ADDR1', 'SHOP_ADDR1_CODE',
			'SHOP_ADDR2', 'BIZ_ITEM_1', 'BIZ_ITEM_2', 'BIZ_ITEM_3',
			'SHOP_RMRK', 'OPEN_TM', 'CLOSE_TM', 'FILE_UID', 'REGI_ID',
			'REGI_NM', 'REGI_DT', 'UPDT_ID', 'REGI_INFO', 'REGI_NM', 'UPDT_DT',
			'UPDT_INFO' ]
});

Ext
		.onReady(function() {
			Ext.QuickTips.init();

			/* Combo Store Start */
			// Email Combo Store
			var emailStore = Ext.create('Ext.data.JsonStore', {
				model : 'CODE',
				data : Ext.decode(email)
			});

			emailStore.filter([ {
				property : 'USE_YN',
				value : 'Y'
			}, {
				filterFn : function(item) {
					return item.get("CD") != '0000';
				}
			} ]);
			emailStore.insert(0, new CODE({
				CD : '[ 직접 입력 ]',
				CD_DESC : '[ 직접 입력 ]'
			}));

			var bizStore1 = Ext.create('Ext.data.JsonStore', {
				model : 'CODE',
				data : Ext.decode(biz_item_1)
			});

			bizStore1.filter([ {
				property : 'USE_YN',
				value : 'Y'
			}, {
				filterFn : function(item) {
					return item.get("CD") != '0000';
				}
			} ]);

			var bizStore2 = Ext.create('Ext.data.JsonStore', {
				model : 'CODE',
				data : Ext.decode(biz_item_2)
			});

			bizStore2.filter([ {
				property : 'USE_YN',
				value : 'Y'
			}, {
				property : 'UP_CD',
				value : 'ZZZZ'
			}, {
				filterFn : function(item) {
					return item.get("CD") != '0000';
				}
			} ]);

			var bizStore3 = Ext.create('Ext.data.JsonStore', {
				model : 'CODE',
				data : Ext.decode(biz_item_3)
			});

			bizStore3.filter([ {
				property : 'USE_YN',
				value : 'Y'
			}, {
				property : 'UP_CD',
				value : 'ZZZZ'
			}, {
				filterFn : function(item) {
					return item.get("CD") != '0000';
				}
			} ]);

			/* Combo Store End */

			// Gird Store
			var store = Ext.create('Ext.data.JsonStore', {
				pageSize : 20,
				model : 'SHOP_LIST',
				proxy : {
					type : 'ajax',
					api : {
						read : '/mng/svc/ShopMngt/selectMyShopList.do'
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
							// COMP_ID: Ext.getCmp('s_comp_id').getValue(),
							SHOP_NM : Ext.getCmp('s_shop_nm').getValue()
						};
						store.proxy.extraParams = eParams;
					}
				}
			});

			// 입력폼 Store
			var form_store = Ext.create('Ext.data.JsonStore', {
				pageSize : 10,
				model : 'SHOP',
				proxy : {
					type : 'ajax',
					api : {
						read : '/mng/svc/ShopMngt/selectShop.do'
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

					}
				}
			});

			// Main 검색 Panel
			var panel = Ext.create('Ext.panel.Panel', {
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
						width : 180
					},
					border : 0,
					layout : {
						type : 'hbox',
						align : 'stretch'
					},
					items : [/*
								 * { xtype: 'panel', border:0, padding: 0,
								 * margin: 0,
								 * bodyStyle:'background-color:transparent',
								 * width:240, layout: { type:'hbox',
								 * aligh:'stretch' }, items: [{ xtype:
								 * 'textfield', id: 's_comp_nm', fieldLabel:
								 * '고객사', readOnly: true, fieldStyle:
								 * 'background:rgb(235,235,235);', padding: 0,
								 * margin: 1, labelAlign: 'right',
								 * labelSeparator: '', enterEventEnabled:true,
								 * labelWidth: 70, width: 180 }, { xtype:
								 * 'button', text: '찾기', icon:
								 * '/images/icon/icon_popup_search02.png',
								 * width: 50, handler: function(){
								 * fnOpenCompFindForm('s_comp_id','s_comp_nm'); } }, {
								 * xtype: 'hidden', id: 's_comp_id', width: 0 }] },
								 */{
						xtype : 'textfield',
						id : 's_shop_nm',
						fieldLabel : '매장명',
						enterEventEnabled : true
					} ]
				}
			});

			var btn_excel = Ext.create('Ext.button.Button', {
				id : 'btn_excel',
				text : 'Excel Export',
				icon : '/images/icon/icon_excel.png',
				handler : function() {
					fnExcelExport();
				}
			});

			var btn_reset = Ext.create('Ext.button.Button', {
				id : 'btn_reset',
				text : '초기화',
				icon : '/images/icon/icon_reset.png',
				handler : function() {
					fnInitSearch(grid, panel);
					form.getForm().reset();
					form.collapse();
				}
			});

			var btn_search = Ext.create('Ext.button.Button', {
				id : 'btn_search',
				text : '조회',
				icon : '/images/icon/icon_search.png',
				handler : function() {
					fnSearchGrid();
				}
			});

			/* Button 정의 End */

			// Grid
			var grid = Ext.create('Ext.grid.Panel',
					{
						id : 'grid',
						columnLines : true,
						viewConfig : {
							enableTextSelection : true,
							stripeRows : true
						},
						height : 516,
						store : store,
						columns : [ {
							xtype : 'rownumberer',
							text : 'No',
							width : 40,
							align : 'center'
						}, {
							text : '고객사명',
							width : 200,
							dataIndex : 'COMP_NM'
						}, {
							text : '매장ID',
							width : 50,
							align : 'center',
							dataIndex : 'SHOP_ID'
						}, {
							text : '매장명',
							width : 150,
							dataIndex : 'SHOP_NM'
						}, {
							text : '이용기간',
							width : 130,
							dataIndex : 'SRVC_DATE'
						}, {
							text : '소재지역',
							width : 180,
							dataIndex : 'SHOP_ADDR1'
						}, {
							text : '업종대그룹명',
							width : 110,
							dataIndex : 'BIZ_ITEM_1_DESC'
						}, {
							text : '업중중그룹명',
							width : 110,
							dataIndex : 'BIZ_ITEM_2_DESC'
						}, {
							text : '업종소그룹명',
							width : 110,
							dataIndex : 'BIZ_ITEM_3_DESC'
						}, {
							text : '영업시간대',
							width : 80,
							dataIndex : 'OPEN_CLOSE_TM'
						}, {
							text : '등록정보',
							width : 110,
							dataIndex : 'REGI_DT'
						}, {
							text : '수정정보',
							width : 100,
							dataIndex : 'UPDT_DT'
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
							items : [
							/*
							 * btn_new, {xtype: 'tbspacer'}, btn_save, {xtype:
							 * 'tbspacer'}, btn_delete
							 */
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
							items : [
							// btn_excel,
							// {xtype: 'tbspacer'},
							btn_reset, {
								xtype : 'tbspacer'
							}, btn_search ]
						} ],
						dockedItems : [ {
							xtype : 'pagingtoolbar',
							displayInfo : true,
							dock : 'bottom',
							store : store
						} ],
						listeners : {
							select : function(rowModel, record, index) {
								fnOpenLoadForm(record.data.COMP_ID,
										record.data.SHOP_ID);
							}
						}
					});

			// 입력폼
			var form = Ext
					.create(
							'Ext.form.Panel',
							{
								id : 'form',
								title : '매장 상세',
								frame : true,
								height : 400,
								collapsed : true,
								collapsible : true,
								autoScroll : true,
								fieldDefaults : {
									padding : 0,
									margin : 1,
									labelAlign : 'right',
									labelSeparator : '',
									labelWidth : 100,
									width : 380
								},
								style : {
									backgroundColor : 'white'
								},
								layout : {
									type : 'table',
									columns : 2
								},
								items : [
										{
											xtype : 'fieldset',
											title : '매장기본정보',
											defaultType : 'textfield',
											layout : 'anchor',
											colspan : 2,
											margin : "1 10 1 10",
											style : {
												backgroundColor : 'rgb(223, 233, 246)'
											},
											defaults : {
												anchor : '100%'
											},
											layout : {
												type : 'table',
												columns : 2
											},
											items : [
													{
														xtype : 'panel',
														border : 0,
														padding : 0,
														margin : 0,
														bodyStyle : 'background-color:transparent',
														width : 380,
														fieldDefaults : {
															padding : 0,
															margin : 1,
															labelAlign : 'right',
															labelSeparator : ''
														},
														layout : {
															type : 'hbox',
															aligh : 'stretch'
														},
														items : [
																{
																	xtype : 'textfield',
																	id : 'COMP_NM',
																	name : 'COMP_NM',
																	fieldLabel : '고객사',
																	readOnly : true,
																	fieldStyle : 'background:rgb(235,235,235);',
																	width : 379
																},
																{
																	xtype : 'hidden',
																	id : 'COMP_ID',
																	name : 'COMP_ID'
																} ]
													},
													{
														xtype : 'textfield',
														id : 'SHOP_ID',
														name : 'SHOP_ID',
														readOnly : true,
														fieldStyle : 'background:rgb(235,235,235);',
														readOnly : true,
														fieldLabel : '매장ID'
													},
													{
														xtype : 'textfield',
														id : 'SHOP_NM',
														name : 'SHOP_NM',
														readOnly : true,
														afterLabelTextTpl : fnRequiredValue(),
														fieldLabel : '매장명'
													},
													{
														xtype : 'panel',
														border : 0,
														padding : 0,
														margin : 0,
														bodyStyle : 'background-color:transparent',
														fieldDefaults : {
															padding : 0,
															margin : 1,
															labelAlign : 'right',
															labelSeparator : ''
														},
														layout : {
															type : 'hbox',
															aligh : 'stretch'
														},
														items : [
																{
																	xtype : 'datefield',
																	id : 'SRVC_STRT_DATE',
																	name : 'SRVC_STRT_DATE',
																	fieldLabel : '이용기간',
																	format : 'Y-m-d',
																	labelWidth : 100,
																	readOnly : true,
																	width : 200
																},
																{
																	xtype : 'datefield',
																	id : 'SRVC_END_DATE',
																	name : 'SRVC_END_DATE',
																	fieldLabel : '~',
																	format : 'Y-m-d',
																	labelWidth : 10,
																	readOnly : true,
																	width : 110
																} ]
													},
													{
														xtype : 'AddrPanel',
														addr1Label : '매장주소',
														addr1FieldNm : 'SHOP_ADDR1',
														addr1CdFieldNm : 'SHOP_ADDR1_CODE',
														addr2Label : '매장상세주소',
														addr2FieldNm : 'SHOP_ADDR2',
														addrFieldWidth : 500,
														border : 0,
														padding : 0,
														margin : 0,
														colspan : 2,
														bodyStyle : 'background-color:transparent',
														readOnly : true,
														panelMode : 'read',
														fieldDefaults : {
															padding : 0,
															margin : 1,
															labelAlign : 'right',
															labelSeparator : ''
														}
													},
													{
														xtype : 'panel',
														border : 0,
														padding : 0,
														margin : 0,
														colspan : 2,
														bodyStyle : 'background-color:transparent',
														fieldDefaults : {
															padding : 0,
															margin : 1,
															labelAlign : 'right',
															labelSeparator : ''
														},
														layout : {
															type : 'hbox',
															aligh : 'stretch'
														},
														items : [
																{
																	xtype : 'combobox',
																	id : 'BIZ_ITEM_1',
																	name : 'BIZ_ITEM_1',
																	fieldLabel : '업종그룹',
																	store : bizStore1,
																	queryMode : 'local',
																	valueField : 'CD',
																	displayField : 'CD_DESC',
																	editable : false,
																	readOnly : true,
																	labelWidth : 100,
																	width : 250,
																	listeners : {
																		select : function(
																				combo,
																				records) {
																			Ext
																					.getCmp(
																							'BIZ_ITEM_2')
																					.setValue(
																							'');
																			Ext
																					.getCmp(
																							'BIZ_ITEM_2')
																					.getStore()
																					.clearFilter();
																			Ext
																					.getCmp(
																							'BIZ_ITEM_2')
																					.getStore()
																					.filter(
																							[
																									{
																										property : 'USE_YN',
																										value : 'Y'
																									},
																									{
																										property : 'UP_CD',
																										value : combo
																												.getValue()
																									},
																									{
																										filterFn : function(
																												item) {
																											return item
																													.get("CD") != '0000';
																										}
																									} ]);

																			Ext
																					.getCmp(
																							'BIZ_ITEM_3')
																					.setValue(
																							'');
																			Ext
																					.getCmp(
																							'BIZ_ITEM_3')
																					.getStore()
																					.clearFilter();
																			Ext
																					.getCmp(
																							'BIZ_ITEM_3')
																					.getStore()
																					.filter(
																							[
																									{
																										property : 'USE_YN',
																										value : 'Y'
																									},
																									{
																										property : 'UP_CD',
																										value : 'ZZZZ'
																									},
																									{
																										filterFn : function(
																												item) {
																											return item
																													.get("CD") != '0000';
																										}
																									} ]);
																		}
																	}
																},
																{
																	xtype : 'combobox',
																	id : 'BIZ_ITEM_2',
																	name : 'BIZ_ITEM_2',
																	fieldLabel : '→',
																	store : bizStore2,
																	queryMode : 'local',
																	valueField : 'CD',
																	displayField : 'CD_DESC',
																	editable : false,
																	readOnly : true,
																	labelWidth : 10,
																	width : 160,
																	listeners : {
																		select : function(
																				combo,
																				records) {
																			Ext
																					.getCmp(
																							'BIZ_ITEM_3')
																					.setValue(
																							'');
																			Ext
																					.getCmp(
																							'BIZ_ITEM_3')
																					.getStore()
																					.clearFilter();
																			Ext
																					.getCmp(
																							'BIZ_ITEM_3')
																					.getStore()
																					.filter(
																							[
																									{
																										property : 'USE_YN',
																										value : 'Y'
																									},
																									{
																										property : 'UP_CD',
																										value : combo
																												.getValue()
																									},
																									{
																										filterFn : function(
																												item) {
																											return item
																													.get("CD") != '0000';
																										}
																									} ]);
																		}
																	}
																},
																{
																	xtype : 'combobox',
																	id : 'BIZ_ITEM_3',
																	name : 'BIZ_ITEM_3',
																	fieldLabel : '→',
																	store : bizStore3,
																	queryMode : 'local',
																	valueField : 'CD',
																	displayField : 'CD_DESC',
																	labelWidth : 10,
																	width : 160,
																	readOnly : true,
																	editable : false
																} ]
													},
													{
														xtype : 'numericfield',
														id : 'CMRA_CNT',
														name : 'CMRA_CNT',
														fieldLabel : '카메라대수',
														readOnly : true
													},
													{
														xtype : 'panel',
														border : 0,
														padding : 0,
														margin : 0,
														bodyStyle : 'background-color:transparent',
														fieldDefaults : {
															padding : 0,
															margin : 1,
															labelAlign : 'right',
															labelSeparator : ''
														},
														layout : {
															type : 'hbox',
															aligh : 'stretch'
														},
														items : [
																{
																	xtype : 'textfield',
																	id : 'OPEN_TM',
																	name : 'OPEN_TM',
																	fieldLabel : '영업시간',
																	regex : new RegExp(
																			/^(01|02|03|04|05|06|07|08|09|10|11|12|13|14|15|16|17|18|19|20|21|22|23|24)?$/),
																	regexText : '24시간 형태로 입력하여 주시기 바랍니다.<br>(예: 오후 8시 --> 20시)',
																	labelWidth : 100,
																	width : 130,
																	readOnly : true,
																	maxLength : 2
																},
																{
																	xtype : 'textfield',
																	id : 'CLOSE_TM',
																	name : 'CLOSE_TM',
																	fieldLabel : '시 ~',
																	regex : new RegExp(
																			/^(01|02|03|04|05|06|07|08|09|10|11|12|13|14|15|16|17|18|19|20|21|22|23|24)?$/),
																	regexText : '24시간 형식으로 맞추어 주세요<br>(예:21:00)',
																	labelWidth : 22,
																	width : 52,
																	readOnly : true,
																	maxLength : 2
																},
																{
																	xtype : 'displayfield',
																	id : 'TM',
																	name : 'TM',
																	fieldLabel : '시',
																	labelWidth : 10,
																	width : 10
																} ]
													} ]
										},
										{
											xtype : 'fieldset',
											title : '특이사항',
											defaultType : 'textfield',
											layout : 'anchor',
											colspan : 2,
											margin : "1 10 1 10",
											style : {
												backgroundColor : 'rgb(223, 233, 246)'
											},
											defaults : {
												anchor : '100%'
											},
											layout : {
												type : 'table',
												columns : 2
											},
											items : [ {
												xtype : 'textarea',
												id : 'SHOP_RMRK',
												name : 'SHOP_RMRK',
												fieldLabel : '특이사항',
												width : 762,
												readOnly : true,
												colspan : 2
											} ]
										},
										{
											xtype : 'fieldset',
											title : '이력정보',
											defaultType : 'textfield',
											layout : 'anchor',
											colspan : 2,
											margin : "1 10 1 10",
											style : {
												backgroundColor : 'rgb(223, 233, 246)'
											},
											defaults : {
												anchor : '100%'
											},
											layout : {
												type : 'table',
												columns : 2
											},
											items : [ {
												xtype : 'displayfield',
												id : 'REGI_INFO',
												name : 'REGI_INFO',
												fieldLabel : '등록정보 : '
											}, {
												xtype : 'displayfield',
												id : 'UPDT_INFO',
												name : 'UPDT_INFO',
												fieldLabel : '수정정보 : '
											} ]

										} ],
								listeners : {
									collapse : function(panel) {
										grid.setHeight(516);
										isFormExpanded = false;
									},
									expand : function(panel) {
										grid.setHeight(200);
										isFormExpanded = true;
									}
								}
							});

			// 화면 출력 Panel
			Ext.create('Ext.panel.Panel', {
				renderTo : 'main_div',
				border : 0,
				padding : 0,
				margin : 0,
				width : 818,
				items : [ grid, {
					xtype : 'tbspacer',
					height : 10
				}, form ]
			});

			/** Function 정의 Start * */

			// Form Load
			function fnOpenLoadForm(compId, shopId) {
				var eParams = {
					COMP_ID : compId,
					SHOP_ID : shopId
				};
				form_store.proxy.extraParams = eParams;
				form_store.load({
					scope : this,
					callback : function(records, operation, success) {
						if (records.length == 1) {
							form.loadRecord(records[0]);
							fnLoadMultiComboVal(records[0].data.BIZ_ITEM_1,
									records[0].data.BIZ_ITEM_2,
									records[0].data.BIZ_ITEM_3);
							form.expand();
						} else {
							fnShowMessage("");
							return;
						}
					}
				});
			}

			// Multi Combo Load.
			function fnLoadMultiComboVal(biz1Val, biz2Val, biz3Val) {
				Ext.getCmp('BIZ_ITEM_2').setValue('');
				Ext.getCmp('BIZ_ITEM_2').getStore().clearFilter();
				Ext.getCmp('BIZ_ITEM_2').getStore().filter([ {
					property : 'USE_YN',
					value : 'Y'
				}, {
					property : 'UP_CD',
					value : biz1Val
				}, {
					filterFn : function(item) {
						return item.get("CD") != '0000';
					}
				} ]);

				Ext.getCmp('BIZ_ITEM_3').setValue('');
				Ext.getCmp('BIZ_ITEM_3').getStore().clearFilter();
				Ext.getCmp('BIZ_ITEM_3').getStore().filter([ {
					property : 'USE_YN',
					value : 'Y'
				}, {
					property : 'UP_CD',
					value : biz2Val
				}, {
					filterFn : function(item) {
						return item.get("CD") != '0000';
					}
				} ]);

				Ext.getCmp('BIZ_ITEM_1').setValue(biz1Val);
				Ext.getCmp('BIZ_ITEM_2').setValue(biz2Val);
				Ext.getCmp('BIZ_ITEM_3').setValue(biz3Val);

			}

			// Grid 조회
			function fnSearchGrid() {
				form.collapse();
				fnInitForm();
				store.loadPage(1);
			}

			// Form 초기화.
			function fnInitForm() {
				form.loadRecord(new SHOP({
					CMRA_CNT : 0,
					OPEN_TM : '01',
					CLOSE_TM : '24'
				}));
				Ext.getCmp('BIZ_ITEM_2').setValue('');
				Ext.getCmp('BIZ_ITEM_2').getStore().clearFilter();
				Ext.getCmp('BIZ_ITEM_2').getStore().filter([ {
					property : 'USE_YN',
					value : 'Y'
				}, {
					property : 'UP_CD',
					value : 'zzz'
				}, {
					filterFn : function(item) {
						return item.get("CD") != '0000';
					}
				} ]);

				Ext.getCmp('BIZ_ITEM_3').setValue('');
				Ext.getCmp('BIZ_ITEM_3').getStore().clearFilter();
				Ext.getCmp('BIZ_ITEM_3').getStore().filter([ {
					property : 'USE_YN',
					value : 'Y'
				}, {
					property : 'UP_CD',
					value : 'zzz'
				}, {
					filterFn : function(item) {
						return item.get("CD") != '0000';
					}
				} ]);
			}

			// Excel Export
			function fnExcelExport() {
				var excelFormObjs = {
					hiddenType : [
							{
								"NAME" : "SHEET_NAME",
								"VALUE" : "매장관리"
							},
							{
								"NAME" : "COLS",
								"VALUE" : "COMP_NM,SHOP_ID,SHOP_NM,SRVC_DATE,SHOP_ADDR1,BIZ_ITEM_1_DESC,BIZ_ITEM_2_DESC,BIZ_ITEM_3_DESC,OPEN_CLOSE_TM,REGI_DT,UPDT_DT"
							},
							{
								"NAME" : "TITLE",
								"VALUE" : "고객사명,매장ID,매장명,이용기간,소재지역,업종 대그룹 명,업종 중그룹 명,업종 소그룹 명,영업 시간대,등록정보,수정정보"
							},
							{
								"NAME" : "SQLID",
								"VALUE" : "shopmngt.getShopListExcel"
							},
							{
								"NAME" : "COMP_ID",
								"VALUE" : Ext.getCmp('s_comp_id').getValue() == null ? ""
										: Ext.getCmp('s_comp_id').getValue()
							}, // 상호
							{
								"NAME" : "SHOP_NM",
								"VALUE" : Ext.getCmp('s_shop_nm').getValue() == null ? ""
										: Ext.getCmp('s_shop_nm').getValue()
							} // 담당자명
					]
				};
				fnDownloadExcel(excelFormObjs);
			}
			/** Function 정의 End * */

			/* 입력폼 Byte Checking Start */

			fnVerifyColumnValueByte(Ext.getCmp('SHOP_NM'), 200);// 매장명
			fnVerifyColumnValueByte(Ext.getCmp('SHOP_ADDR2'), 200);// 매장상세주소
			fnVerifyColumnValueByte(Ext.getCmp('CMRA_CNT'), 5);// 카메라대수
			fnVerifyColumnValueByte(Ext.getCmp('SHOP_RMRK'), 8000);// 특이사항

			/* 입력폼 Byte Checking End */

			// Resize
			// Ext.getCmp('grid').setSize(w, h);
			// Default Value Setting
			// Ext.getCmp('s_use_yn').setValue('');
			fnIframeHeight(600);
		});
