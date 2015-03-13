var rxParam = null;

Ext.onReady(function(){
    Ext.QuickTips.init();

    var s_panel = Ext.create('Ext.panel.Panel', {
    	id: 's_panel',
    	renderTo: 'search_div',
    	bodyPadding: 0,
    	border: 0,
    	items: {
    		defaults: {
    			labelWidth: 60,
    			width: 210
            },
    		border: 0,
            layout: {
        	    type: 'hbox',
        	    align: 'stretch'
        	},
            items: [{
        		xtype: 'panel',
        		border:0,
        		padding: 0,
	    		margin: 0,
	    		bodyStyle: 'background-color:transparent',
	    		width: 265,
	    		defaults: {
	    			labelWidth: 60,
	    			width: 210
	            },
        		layout: {
        			type: 'hbox',
        			aligh: 'stretch'
        		},
        		items: [{
            		xtype: 'textfield',
            		id: 's_shop_nm',
            		fieldLabel: '매장',
        			readOnly: true,
        			margin: 1
            	}, {
        			xtype: 'button',
        			id: 's_btn_shop',
        			text: '찾기',
        			icon: '/images/icon/icon_popup_search02.png',
        			width: 50,
        			margin: 1,
        	    	handler: function(){
        	    		document.getElementById('rex_iframe').src = '';
        	    		fnOpenShopFindForm('s_shop_id', 's_shop_nm', parent.gvCompId);
        	    	}
        		}, {
    	            xtype: 'hidden',
    	            id: 's_shop_id',
    	            search_cd:'SHOP_ID;00015',
    	            width: 0
    	        }]
        	}, {
        		xtype: 'textfield',
        		id: 's_yyyy',
        		fieldLabel: '기준년',
        		search_cd:'STND_YYYY;00019',
        		width: 160,
        		maxLength: 4,
        		listeners: {
        			focus: function(){
        				document.getElementById('rex_iframe').src = '';
        			}
        		}
        	}]
    	}
    });

	var btn_reset = Ext.create('Ext.button.Button', {
		id: 'btn_reset',
    	text: '초기화',
    	icon: '/images/icon/icon_reset.png',
    	handler: function(){
    		fnInit();
    	}
    });
	
	var btn_search = Ext.create('Ext.button.Button', {
		id: 'btn_search',
    	text: '조회',
    	icon: '/images/icon/icon_search.png',
    	handler: function(){
    		document.getElementById('rex_iframe').src = '';
    		
    		rxParam = "COMP_ID:"+parent.gvCompId
					+ "|SHOP_ID:"+Ext.getCmp('s_shop_id').getValue()
					+ "|STND_YYYY:"+Ext.getCmp('s_yyyy').getValue()
				    + "|SC_MAP:"+fnGetScMap(s_panel);

			// iframe 으로 보낸다.
			document.getElementById('rex_iframe').src = '/cus/fad/SalesInfo/selectMonthStatPrint.do';
    	}
	});
	
    var b_panel = Ext.create('Ext.panel.Panel', {
    	id: 'b_panel',
    	renderTo: 'main_div',
    	frame: true,
    	layout: {
    	    type: 'hbox',
    	    align: 'stretch'
    	},
    	items: [
	        {xtype: 'tbfill'},
    	    btn_reset,
    	    {xtype: 'tbspacer'},
    	    btn_search
    	]
    });
    
	function fnInit(){
		// 권한 타입이 매장일 경우에는 찾기 버튼 삭제한다.
		if (parent.gvAuthType == 'C') {
			Ext.getCmp('s_shop_nm').setValue( parent.gvShopNm );
			Ext.getCmp('s_shop_id').setValue( parent.gvShopId );
			Ext.getCmp('s_btn_shop').setVisible(false);
		}
		
		Ext.getCmp('s_yyyy').setValue(Ext.Date.format(new Date(), 'Y'));
		
		document.getElementById('rex_iframe').src = '';
	}
	
	fnInit();
    fnIframeHeight(1000);
});
