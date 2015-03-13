Ext.define('CODE', {
    extend: 'Ext.data.Model',
    fields: ['CD_TYPE', 'CD', 'CD_TYPE_DESC', 'CD_DESC', 'DISP_ORDR', 'UP_CD_TYPE', 'UP_CD', 'USE_YN']
});

Ext.define('AUTH', {
    extend: 'Ext.data.Model',
    fields: ['AUTH', 'AUTH_DESC', 'AUTH_TYPE', 'AUTH_TYPE_DESC']
});

Ext.define('MENU', {
    extend: 'Ext.data.Model',
    fields: ['AUTH', 'MENU_ID', 'MENU_NM', 'ORDR_SEQ', 'PRNT_MENU_ID', 'LEVL', 'STEP',
             'HAS_CHILD', 'PROG_ID', 'PROG_NM', 'TRGT_URL', 'USE_YN',
             'REGI_ID', 'REGI_NM', 'REGI_DT', 'UPDT_ID', 'UPDT_NM', 'UPDT_DT']
});

var loadMask = null;

var currentAuth = '';

function fnAuthRenderer(value, metaData, record, rowIndex, colIndex, store, view){
	if (colIndex == 2) {
		metaData.tdAttr = 'data-qtip="'+fnReplaceAll(value,'\n','<br>')+'"';
	}
	
	return value;
}

Ext.onReady(function(){
    Ext.QuickTips.init();
    
    var auth_store = Ext.create('Ext.data.JsonStore', {
		model: 'AUTH',
		proxy: {
			type: 'ajax',
			api: {
				read: '/mng/com/AuthMngt/selectAuthMngt.do'
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
    
    var menu_store = Ext.create('Ext.data.TreeStore', {
    	model: 'MENU',
    	//folderSort: true,
    	root: { children: [] },
    	proxy: {
			type: 'ajax',
			api: {
				read: '/mng/com/AuthMenuMngt/selectAuthMenuMngt.do'
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
				loadMask = new Ext.LoadMask(menu_tree.getView(), {msg: '로딩중...'});
				loadMask.show();
			},
			load: function(store, node, records, successful){
				for (var i=0; i<records.length; i++) {
                	records[i].set('AUTH', currentAuth);
                }
				loadMask.hide();
			}
		}
    });
    
    var btn_reset = Ext.create('Ext.button.Button', {
		id: 'btn_reset',
    	text: '초기화',
    	icon: '/images/icon/icon_reset.png',
    	handler: function(){
    		if (auth_grid.store.data.items.length > 0) {
    			auth_grid.getStore().clearData();
    			auth_grid.getStore().totalCount = 0;
    			auth_grid.getView().refresh();
    	    }
    		menu_tree.root = { children: [] };
    	}
    });
    
    var btn_search = Ext.create('Ext.button.Button', {
		id: 'btn_search',
    	text: '조회',
    	icon: '/images/icon/icon_search.png',
    	handler: function(){
    		menu_tree.root = { children: [] };
    		auth_store.load();
    	}
	});
    
    var btn_save = Ext.create('Ext.button.Button', {
    	id: 'btn_save',
    	text: '저장',
    	icon: '/images/icon/icon_save.png',
    	width: 60,
    	handler: function(){
    		menu_tree.expandAll(); //collapse된 node는 데이터가 넘어오지 않음.
    		
    		var records = menu_tree.getView().getRecords(menu_tree.getView().getNodes());
			for (var i=0; i<records.length; i++) {
    			records[i].commit();
    		}
            var update_params = fnSetGridParams(records);
            fnSetElMask();
            Ext.Ajax.request({
                url: '/mng/com/AuthMenuMngt/deleteOrInsertAuthMenuMngt.do',  
                params: {updateData: update_params}, 
                method: 'POST',
                callback: function(options, success, response){
                    
                },
                success: function(response, opts){
                	var result = Ext.decode(response.responseText);
                    if (result.success) {
                    	fnSetElUnmask();
                        fnShowMessage(parent.msgProperty.COM_RST_0001, //저장을 완료하였습니다.
                        	Ext.MessageBox.INFO, function(buttonId, text, opt){
	                            if (buttonId == 'ok') {
	                            	var eParams = {
	                					AUTH: currentAuth
	                                };
	                            	menu_store.proxy.extraParams = eParams;
	                            	menu_store.load();
	                            }
	                        }
                        );
                    } else {
                    	fnSetElUnmask();
                        var msg = '';
                        try {
                            msg = result.message;
                        } catch(err) {
                            msg = parent.msgProperty.COM_ERR_0001; //저장에 실패하였습니다.
                        }
                        fnShowMessage(msg);
                    }
                }, 
                failure: function(response, opts){
                    fnShowMessage('server-side failure with status code ' + response.status);
                }
            });
    	}
    });
    
    var auth_grid = Ext.create('Ext.grid.Panel', {
    	id: 'auth_grid',
        columnLines: true,
        viewConfig: {
        	enableTextSelection: true,
            stripeRows: true
        },
        width: 459,
        height: 516,
        store: auth_store,
        columns: [{
        	xtype: 'rownumberer',
        	text: 'No',
        	width: 40,
        	align: 'center'
        }, {
            text: '권한',
            width: 100,
            dataIndex: 'AUTH',
            renderer: fnAuthRenderer
        }, {
            text: '권한 설명',
            width: 200,
            dataIndex: 'AUTH_DESC',
            renderer: fnAuthRenderer
        }, {
            text: '권한 유형',
            width: 100,
            dataIndex: 'AUTH_TYPE_DESC',
            renderer: fnAuthRenderer
        }],
        tbar: [{
        	xtype: 'label',
        	text: '[ 권한 ]',
        	height: 22,
        	style: 'font-size:13px;font-weight:bold;'
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
        	    btn_reset,
        	    {xtype: 'tbspacer'},
        	    btn_search
        	]
        }],
        listeners: {
            itemclick: function(view, record, item, index, e){
            	currentAuth = record.get('AUTH');
                var eParams = {
					AUTH: currentAuth
                };
                menu_store.proxy.extraParams = eParams;
                menu_store.load();
            }
        }
    });
    
    var menu_tree = Ext.create('Ext.tree.Panel', {
    	id: 'menu_tree',
        columnLines: true,
        rowLines: true,
        viewConfig: {
        	enableTextSelection: true
        },
        width: 349,
        height: 516,
        store: menu_store,
        rootVisible: false,
    	useArrows: true,
        columns: [{
        	xtype: 'treecolumn',
            text: '메뉴명',
            width: 330,
            dataIndex: 'MENU_NM'
        }],
        tbar: [{
        	xtype: 'label',
        	text: '[ 메뉴 ]',
        	height: 22,
        	style: 'font-weight:bold;'
        }, {
    	   xtype: 'tbfill'
        }, {
        	xtype: 'panel',
        	id: 'l_panel',
        	bodyPadding: 0,
        	bodyStyle: 'background-color:transparent;',
        	border: 0,
        	layout: {
        	    type: 'hbox',
        	    align: 'stretch'
        	},
        	items: [btn_save]
        }]
    });
    
    Ext.create('Ext.panel.Panel', {
    	renderTo: 'main_div',
    	margin: 0,
    	padding: 0,
    	border: 0,
    	width: 818,
    	height: 516,
    	layout: {
    		type: 'hbox',
    		align: 'stretch'
    	},
    	items: [auth_grid, {xtype: 'tbspacer', width: 10}, menu_tree]
    });
    
    //Resize
    //Ext.getCmp('grid').setSize(w, h);
    
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
	
	Ext.getCmp('menu_tree').on('checkchange', function(node, checked) {
		if (node.hasChildNodes()) {
			var nodes = fnGetAllChildNodes(node);
			for (var i=0; i<nodes.length; i++) {
				nodes[i].set('checked', checked);
			}
		}
	});
	
	fnIframeHeight(516);
});
