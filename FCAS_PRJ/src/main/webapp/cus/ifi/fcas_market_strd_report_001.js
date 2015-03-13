Ext.define('CODE', {
    extend: 'Ext.data.Model',
    fields: ['CD_TYPE', 'CD', 'CD_TYPE_DESC', 'CD_DESC', 'DISP_ORDR', 'UP_CD_TYPE', 'UP_CD', 'USE_YN']
});

function fnBtnShow() {
	Ext.getCmp('btn_search').setDisabled(false);
}

function fnShowBizCode() {
	// 매장찾기 후 실행되는 fn
	// 찾은 매장에 대한 업종 그룹 과 hidden 값인 주소코드를 매핑해준다.

	var params = null;
	// 매장은 찾기 버튼을 클릭할수 없으므로 무조건 자기 자신 shopId 만 사용함.
	if(parent.gvAuthType == 'C') {
		params = { SHOP_ID: parent.gvShopId };
	} else {
		params = { SHOP_ID: Ext.getCmp('s_shop_id').getValue() };
	}

	fnSubmitFormStore('/cus/ifi/MarketStrdReport/selectShopInfo.do', params, function(response, opts){
		var result = Ext.decode(response.responseText);

		Ext.getCmp('s_shop_addr1_code').setValue( result.resultMap.SHOP_ADDR1_CODE );

		if( result.resultMap.BIZ_ITEM_1 != null && result.resultMap.BIZ_ITEM_1 != '') {

			Ext.getCmp('s_biz_item_1').setValue( result.resultMap.BIZ_ITEM_1 );

	 		Ext.getCmp('s_biz_item_2').setValue('');
			Ext.getCmp('s_biz_item_2').getStore().clearFilter();
			Ext.getCmp('s_biz_item_2').getStore().filter([
			    {property: 'USE_YN', value: 'Y'},
			    {property: 'UP_CD', value: result.resultMap.BIZ_ITEM_1 },
			    {filterFn: function(item){
			    	return item.get("CD") != '0000';
			    }}
			]);

			if( result.resultMap.BIZ_ITEM_2 != null && result.resultMap.BIZ_ITEM_2 != '') {
				Ext.getCmp('s_biz_item_2').setValue( result.resultMap.BIZ_ITEM_2 );

				Ext.getCmp('s_biz_item_3').setValue('');
				Ext.getCmp('s_biz_item_3').getStore().clearFilter();
				Ext.getCmp('s_biz_item_3').getStore().filter([
				    {property: 'USE_YN', value: 'Y'},
				    {property: 'UP_CD', value: result.resultMap.BIZ_ITEM_2},
				    {filterFn: function(item){
				    	return item.get("CD") != '0000';
				    }}
				]);
			}

			if( result.resultMap.BIZ_ITEM_3 != null && result.resultMap.BIZ_ITEM_3 != '') {
				Ext.getCmp('s_biz_item_3').setValue( result.resultMap.BIZ_ITEM_3 );
			}
		}
	});
}

Ext.onReady(function(){
    Ext.QuickTips.init();

    var bizStore1 = Ext.create('Ext.data.JsonStore', {
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
    			labelWidth: 90,
    			width: 220
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
            		id: 's_shop_nm',
            		fieldLabel: '매장',
        			readOnly: true,
    	    		fieldStyle: 'background:rgb(235,235,235);'
            	},{
        			xtype: 'button',
        			id: 'btn_shop_search',
        			text: '찾기',
        			icon: '/images/icon/icon_popup_search02.png',
        			margin: 1,
        			width: 50,
        	    	handler: function(){
        	    		document.getElementById('nice_iframe').src = '';
        	    		fnOpenShopFindWithCallBackForm( 's_shop_id','s_shop_nm' , parent.gvCompId , 'fnShowBizCode()' );
        	    	}
        		}, {
    	            xtype: 'hidden',
    	            id: 's_shop_id',
    	            width: 0
    	        }, {
    	            xtype: 'hidden',
    	            id: 's_shop_addr1_code',
    	            width: 0
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
            	    		document.getElementById('nice_iframe').src = '';

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
            	    		document.getElementById('nice_iframe').src = '';

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
            	    displayField: 'CD_DESC',
            	    listeners: {
            	    	select: function(combo, records){
            	    		document.getElementById('nice_iframe').src = '';
            	    	}
            	    }
            	}]
            }]
    	}
    });

    var btn_excel = Ext.create('Ext.button.Button', {
    	id: 'btn_excel',
    	text: 'Excel Export',
    	icon: '/images/icon/icon_excel.png',
    	handler: function(){
    		var excelFormObjs = {
    			    hiddenType:[
    			        { "NAME":"SHEET_NAME", 	"VALUE": "일자별 입장_체류" },
    			        { "NAME":"COLS", 		"VALUE": "COMP_ID,COMP_NM,SHOP_ID,SHOP_NM,CMRA_GRP_ID,CMRA_GRP_NM,STND_DATE,DOV_CD,DOV_CD_NM,STND_YYMM,ENTER_CNT,EXIT_CNT,TOTAL_CNT,STAY_CNT,WORK_DT" },
    			        { "NAME":"TITLE", 		"VALUE": "고객사ID,고객사명,매장ID,매장명,카메라그룹ID,카메라그룹ID명,기준일자,요일코드,요일코드명,기준월,입장객수,퇴장객수,전체객수,평균체류고객수,작업일시" },
    			        { "NAME":"SQLID", 		"VALUE": "datacnt.selectDailyCntList" },
    			        { "NAME":"COMP_ID", "VALUE": parent.gvCompId },
    			        { "NAME":"SHOP_ID", "VALUE": Ext.getCmp('s_shop_id').getValue() == null ? "" : Ext.getCmp('s_shop_id').getValue() },
    			        { "NAME":"STND_DATE_F", 	"VALUE": Ext.getCmp('s_date_f').getValue() == null ? "" : Ext.getCmp('s_date_f').getValue() },
    			        { "NAME":"STND_DATE_T", 	"VALUE": Ext.getCmp('s_date_t').getValue() == null ? "" : Ext.getCmp('s_date_t').getValue() }
    			    ]
    			};
    		fnDownloadExcel(excelFormObjs);
    	}
    });

	var btn_reset = Ext.create('Ext.button.Button', {
		id: 'btn_reset',
    	text: '초기화',
    	icon: '/images/icon/icon_reset.png',
    	handler: function(){
    		if(parent.gvAuthType == 'C') {
    			fnShowBizCode();
    			Ext.getCmp('s_shop_nm').setValue( parent.gvShopNm );
    			Ext.getCmp('s_shop_id').setValue( parent.gvShopId );
    			Ext.getCmp('btn_shop_search').setVisible(false);
    		}
    		document.getElementById('nice_iframe').src = '';
    	}
    });

	var btn_search = Ext.create('Ext.button.Button', {
		id: 'btn_search',
    	text: '조회',
    	icon: '/images/icon/icon_search.png',
    	handler: function(){
    		document.getElementById('nice_iframe').src = '';

			if( Ext.getCmp('s_shop_id').getValue() == null || Ext.getCmp('s_shop_id').getValue() == '') {
				fnShowMessage( parent.msgProperty.COM_ERR_0057.replace('param1', '매장'), 100 ); // 은 필수 검색조건입니다.
				return;
			}

			if( Ext.getCmp('s_biz_item_3').getValue() == null || Ext.getCmp('s_biz_item_3').getValue() == '') {
				fnShowMessage( parent.msgProperty.COM_ERR_0057.replace('param1', '업종소그룹'), 100 ); // 은 필수 검색조건입니다.
				return;
			}

			if( Ext.getCmp('s_shop_addr1_code').getValue() == null || Ext.getCmp('s_shop_addr1_code').getValue() == '') {
				fnShowMessage( parent.msgProperty.COM_ERR_0057.replace('param1', '주소코드'), 100 ); // 은 필수 검색조건입니다.
				return;
			}

			Ext.getCmp('btn_search').setDisabled(true);

			var params = {
					SHOP_ADDR1_CODE: Ext.getCmp('s_shop_addr1_code').getValue(),
					S_BIZ_ITEM_3: Ext.getCmp('s_biz_item_3').getValue(),
					S_SHOP_ID: Ext.getCmp('s_shop_id').getValue()
			};

			fnSubmitFormStore('/cus/ifi/MarketStrdReport/selectMarketStrdReport.do', params, function(response, opts){
				var result = Ext.decode(response.responseText);
				if(result.success) {
					//alert("연동성공");
					// 성공시.. nice에서 준 url을 <mainShow_div   에 뿌린다. >
					//alert("niceAddrCd:"+result.niceAddrCd);
					//alert("niceBizCode:"+result.niceBizCode);
					//alert("niceTockenKey:"+result.niceTockenKey);

					//http://www.nicebizmap.co.kr/joinIndex.jsp
					//?corp_cd=제휴사코드&admi_cd=행정동코드&upjong3_cd=업종코드&token=토큰키// &url= 제외

					setTimeout("fnBtnShow()",1500);

					var url ="http://www.nicebizmap.co.kr/joinIndex.jsp";
					var ifrObj = document.getElementById('nice_iframe');
					ifrObj.src = url + "?corp_cd=A00400&admi_cd="+result.niceAddrCd+"&upjong3_cd="+result.niceBizCode+"&token="+result.niceTockenKey;

				} else {
					fnShowMessage( result.message, 150);
				}

			});

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

    //Resize
    //Ext.getCmp('grid').setSize(w, h);

    //Default Value Setting

	// 권한 타입이 매장일 경우에는 찾기 버튼 삭제한다.
	if(parent.gvAuthType == 'C') {
		fnShowBizCode();
		Ext.getCmp('s_shop_nm').setValue( parent.gvShopNm );
		Ext.getCmp('s_shop_id').setValue( parent.gvShopId );
		Ext.getCmp('btn_shop_search').setVisible(false);
	}

    fnIframeHeight(5800);
});


