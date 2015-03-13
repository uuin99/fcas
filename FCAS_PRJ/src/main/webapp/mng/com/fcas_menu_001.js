Ext.define('MENU', {
    extend: 'Ext.data.Model',
    //idProperty: 'MENU_ID',
    fields: ['MENU_ID', 'MENU_NM', 'ORDR_SEQ', 'PRNT_MENU_ID', 'LEVL', 'STEP',
             'HAS_CHILD', 'MENU_PATH', 'PROG_ID', 'PROG_NM', 'TRGT_URL', 'USE_YN',
             'REGI_ID', 'REGI_NM', 'REGI_DT', 'UPDT_ID', 'UPDT_NM', 'UPDT_DT']
});

Ext.define('PROG', {
    extend: 'Ext.data.Model',
    fields: ['PROG_ID', 'PROG_NM', 'PROG_DESC', 'TRGT_URL']
});

var progStore = Ext.create('Ext.data.JsonStore', {
    autoLoad: true,
	model: 'PROG',
	proxy: {
		type: 'ajax',
		api: {
			read: '/mng/com/ProgMngt/selectProgMngt.do'
		},
		reader: {
			type: 'json',
			root: 'data',
			totalProperty: 'total',
			successProperty: 'success',
			messageProperty: 'message'
		}
	},
	listeners: {
		beforeload: function(store, operation){                
			var eParams = {
				start: ''
            };
            store.proxy.extraParams = eParams;
		},
		load: function(store, records, successful){
			store.insert(0, new PROG({
				PROG_NM: '== 선택하세요 =='
			}));
		}
	}
});


var loadMask = null;

var treeId = 0; //tree id 변수

function fnRenderer(value, metaData, record, rowIndex, colIndex, store, view){
	if (colIndex >= 3) {
		metaData.style = 'background-color:#f6f6f6;';
	}
	
	return value;
}

function fnContextMenu(tree, store, view, e, record, item, index){
	e.stopEvent();
	
	var tree_menu = Ext.create('Ext.menu.Menu', {
	    margin: '0 0 10 0',
	    items: [{
	        text: '메뉴 추가',
	        icon: '/images/icon/icon_add.png',
	        handler: function(){
	        	if (record == undefined) {
	        		var rootNode = tree.getRootNode();
		        	rootNode.appendChild(new MENU({
		        		id: treeId,
		        		expandable: false,
	        			leaf: true,
	        			expanded: false,
	        			checked: true
		        	}));
	        	} else {
	        		record.set('expandable', true);
	        		record.set('leaf', false);
	        		record.set('expanded', true);
	        		
	        		var node = store.getNodeById(record.get('id'));
	        		node.appendChild(new MENU({
	        			id: treeId,
	        			expandable: false,
	        			leaf: true,
	        			expanded: false,
	        			checked: true
		        	}));
	        	}
	        }
	    }, {
	        text: '메뉴 삭제',
	        icon: '/images/icon/icon_delete.png',
	        disabled: record === undefined,
	        handler: function(){
	        	Ext.MessageBox.confirm('FCAS', parent.msgProperty.COM_IFO_0009, //삭제 하시겠습니까?<br>※ 상위 메뉴를 삭제하면 하위 메뉴도 함께 삭제됩니다.
        			function(btnid){
            			if (btnid == 'yes') {
            				var record = tree.getSelectionModel().getSelection()[0];
            				fnSetElMask();
            				fnSubmitFormStore("/mng/com/MenuMngt/selectDeleteMenuValidMngt.do", {MENU_ID:record.get('id')}, function(response, opts){
            					var result = Ext.decode(response.responseText);
            					if (result.success) {
            						fnSetElUnmask();
            						var node = store.getNodeById(record.get('id'));
                    				node.remove(false);
                		        	if (record.get('parentId') != 'root') {
                		        		var parentNode = store.getNodeById(record.get('parentId'));
                		        		if (!parentNode.hasChildNodes()) {
                		        			parentNode.set('expandable', false);
                		        			parentNode.set('leaf', true);
                		        			parentNode.set('expanded', false);
                		        		}
                		        	}
            	                } else {
            	                	fnSetElUnmask();
            	                    var msg = '';
            	                    try {
            	                    	msg = result.message;
            	                    } catch(err) {
            	                    	msg = parent.msgProperty.COM_ERR_0003;
            	                    }
            	                    fnShowMessage(msg);
            	                }            					
            				});
            			}
	        		}
	        	);
	        }
	    }]
	});
	
	tree_menu.showAt(e.getXY());
	
	treeId++;
}

Ext.onReady(function(){
	Ext.QuickTips.init();
    
    var store = Ext.create('Ext.data.TreeStore', {
    	model: 'MENU',
    	//folderSort: true,
    	root: { children: [] },
    	proxy: {
			type: 'ajax',
			api: {
				read: '/mng/com/MenuMngt/selectMenuMngt.do'
			},
			reader: {
				type: 'json',
				root: 'children',
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
				loadMask = new Ext.LoadMask(tree.getView(), {msg: '로딩중...'});
				loadMask.show();
			},
			load: function(store, node, records, successful){
				loadMask.hide();
			}
		}
    });
    
    var btn_save = Ext.create('Ext.button.Button', {
    	id: 'btn_save',
    	text: '저장',
    	icon: '/images/icon/icon_save.png',
    	width: 60,
    	handler: function(){
    		tree.expandAll(); //collapse된 node는 데이터가 넘어오지 않음.
    		
    		var records = tree.getView().getRecords(tree.getView().getNodes());
			for (var i=0; i<records.length; i++) {
    			records[i].commit();
    		}
            var update_params = fnSetGridParams(records);
            var delete_params = fnSetGridParams(store.getRemovedRecords());
            
            Ext.Ajax.request({
                url: '/mng/com/MenuMngt/insertOrUpdateOrDeleteMenuMngt.do',  
                params: {updateData: update_params, deleteData: delete_params}, 
                method: 'POST',
                callback: function(options, success, response){
                    
                },
                success: function(response){
                	var result = Ext.decode(response.responseText);
                    if (result.success) {
                        fnShowMessage(parent.msgProperty.COM_RST_0001, //저장을 완료하였습니다. 
                        	Ext.MessageBox.INFO, function(buttonId, text){
	                            if (buttonId == 'ok') {
	                                store.load();
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
                        fnShowMessage(msg);
                    }
                }, 
                failure: function(response){
                    fnShowMessage('server-side failure with status code ' + response.status);
                }
            });
    	}
    });
    
    var btn_reset = Ext.create('Ext.button.Button', {
		id: 'btn_reset',
    	text: '초기화',
    	icon: '/images/icon/icon_reset.png',
    	handler: function(){
    		var rootNode = tree.getRootNode();
    		rootNode.removeAll(false);
    	}
    });
	
	var btn_search = Ext.create('Ext.button.Button', {
		id: 'btn_search',
    	text: '조회',
    	icon: '/images/icon/icon_search.png',
    	handler: function(){
    		store.load();
    	}
	});
	
	var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
		clicksToEdit: 1
	});
    
    var tree = Ext.create('Ext.tree.Panel', {
    	id: 'tree',
    	renderTo: 'main_div',
    	columnLines: true,
    	rowLines: true,
    	viewConfig: {
        	enableTextSelection: true,
        	plugins: {
                ptype: 'treeviewdragdrop',
                dragText: '{0}개 선택'
            }
        },
    	height: 516,
    	store: store,
    	plugins: [cellEditing],
    	rootVisible: false,
    	useArrows: true,
    	columns: [{
            xtype: 'treecolumn',
            text: '메뉴명'+fnRequiredValue(),
            width: 250,
            dataIndex: 'MENU_NM',
            editor: {
            	
            }
        }, {
            text: '메뉴 경로',
            width: 199,
            dataIndex: 'MENU_PATH',
            renderer: fnRenderer,
            editor: {
            	
            }
        }, {
            text: '프로그램ID',
            width: 150,
            dataIndex: 'PROG_ID',
            renderer: fnRenderer,
            editor: {
            	xtype: 'combobox',
                store: progStore,
                valueField: 'PROG_ID',
                displayField: 'PROG_NM',
                queryMode: 'local',
                listeners: {
                	focus: function(comp, e){
                		comp.selectText();
                	},
                	select: function(combo, records){
                		var record = tree.getSelectionModel().getSelection()[0];
                		if (records[0].get('PROG_ID') != '') {
                			record.set('PROG_NM', records[0].get('PROG_NM'));
                    		record.set('TRGT_URL', records[0].get('TRGT_URL'));
                		} else {
                			record.set('PROG_NM', '');
                    		record.set('TRGT_URL', '');
                		}
                	},
                	blur: function(comp, e){
                		var record = tree.getSelectionModel().getSelection()[0];
                        var selectedInputValue = this.getValue();
                        var isNotValid = true;
                        if (selectedInputValue != null) {
                            var storeCnt = this.store.getCount();
                            for (var i=0; i<storeCnt; i++) {
                                 if (this.store.getAt(i).data[this.valueField] == selectedInputValue) {
                                    isNotValid = false;
                                    break;
                                }
                            }
                            if (isNotValid) {
                            	this.setValue(null);
                            	this.el.dom.value = '';
                            	record.set('PROG_ID', '');
                            	record.set('PROG_NM', '');
                        		record.set('TRGT_URL', '');
                            }
                        }
                    }
                }
            }
        }, {
            text: '프로그램명',
            width: 200,
            dataIndex: 'PROG_NM',
            renderer: fnRenderer
        }, {
            text: '접근주소',
            width: 300,
            dataIndex: 'TRGT_URL',
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
        	    /*btn_reset,
        	    {xtype: 'tbspacer'},*/
        	    btn_search
        	]
        }],
        listeners: [{
        	afterrender: function(comp){
        		store.sort('ORDR_SEQ', 'ASC');
        	}
        }]
    });
    
    Ext.getCmp('tree').on('containercontextmenu', function(view, e) {
		fnContextMenu(tree, store, view, e);
	});
	
	Ext.getCmp('tree').on('itemcontextmenu', function(view, record, item, index, e) {
		fnContextMenu(tree, store, view, e, record, item, index);
	});
	
	/*Ext.getCmp('tree').getView().on('beforedrop', function(node, data, overModel, dropPosition, dropHandler){
		if (!overModel.hasChildNodes()) {
			overModel.set('expandable', true);
			overModel.set('leaf', false);
			overModel.set('expanded', true);
		}
	});*/
	
	function fnGetAllChildNodes(node){
		if(!Ext.value(node, false)){ 
            return []; 
		}
		
		if (node.hasChildNodes()) {
			var allNodes = new Array();
			allNodes.push(node);
			node.eachChild(function(childNode) {
				allNodes = allNodes.concat(fnGetAllChildNodes(childNode));
		    });
			return allNodes;
		} else {
			return node;
		}
	}
	
	Ext.getCmp('tree').on('checkchange', function(node, checked) {
		if (node.hasChildNodes()) {
			var nodes = fnGetAllChildNodes(node);
			for (var i=0; i<nodes.length; i++) {
				nodes[i].set('checked', checked);
			}
		}
	});
	
	fnIframeHeight(516);
});
