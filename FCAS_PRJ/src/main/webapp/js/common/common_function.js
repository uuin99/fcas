/** Common Function Global Value Area Start **/

var strAvailXType = "combobox,textfield,textarea,textareafield,htmleditor,numberfield,radiofield,radio,checkboxfield,checkbox,datefield,timefield,fileuploadfield,filefield,numericfield,hiddenfield,monthfield";

/** Common Function Global Value Area End **/

if (typeof Ext != 'undefined') {
    Ext.core.Element.prototype.unselectable = function(){
        return this;
    };
    Ext.view.TableChunker.metaRowTpl = [
        '<tr class="' + Ext.baseCSSPrefix + 'grid-row {addlSelector} {[this.embedRowCls()]}" {[this.embedRowAttr()]}>',
        '<tpl for="columns">',
        '<td class="{cls} ' + Ext.baseCSSPrefix + 'grid-cell ' + Ext.baseCSSPrefix + 'grid-cell-{columnId} {{id}-modified} {{id}-tdCls} {[this.firstOrLastCls(xindex, xcount)]}" {{id}-tdAttr}><div class="' + Ext.baseCSSPrefix + 'grid-cell-inner ' + Ext.baseCSSPrefix + 'selectable" style="{{id}-style}; text-align: {align};">{{id}}</div></td>',
        '</tpl>',
        '</tr>'
    ];
}

/* Grid 조회시 로딩 표시 */
Ext.override(Ext.view.AbstractView, {
	loadingText: '로딩 중...',
    onRender: function(){
        var me = this;
        me.callOverridden();
        if (me.mask && Ext.isObject(me.store)) {
            me.setMaskBind(me.store);
        }
    }
});
/*
Ext.override(Ext.window.MessageBox, {
	show: function(cfg) {
        var me = this,
            visibleFocusables;
        //me.y = 100;
        me.reconfigure(cfg);
        me.addCls(cfg.cls);
        me.doAutoSize();

        // Do not steal focus from anything that may be focused if the MessageBox has no visible focusable
        // items. For example, a "wait" message box should not get focus.
        visibleFocusables = me.query('textfield:not([hidden]),textarea:not([hidden]),button:not([hidden])');
        me.preventFocusOnActivate = !visibleFocusables.length;

        // Set the flag, so that the parent show method performs the show procedure that we need.
        // ie: animation from animTarget, onShow processing and focusing.
        me.hidden = true;
        me.callParent();
        return me;
    },

	onShow: function() {
        this.callParent(arguments);
        this.center();
    }
});
*/
Ext.override(Ext.form.field.Text, {
	labelAlign: 'right',
	labelSeparator: '',
	margin: 0,
	padding: 0,
	enableKeyEvents: true,
	initComponent: function(){
		var me = this;
		if(me.maxLength == 1.7976931348623157e+308){
			me.enforceMaxLength = false;
		}else {
			me.enforceMaxLength = true;
		}
		me.callOverridden();
        if (me.readOnly) {
        	me.fieldStyle = 'background:rgb(235,235,235);';
        }
	},
	onFocus: function(){
		var me = this;
		me.callOverridden();
	},
	onKeyDown: function(e) {
		var me = this;
		me.callOverridden();
		if (me.readOnly) {
			if(e.getKey() == e.BACKSPACE){
				e.stopEvent();
			}
		}
		if (me.numericVarcharFieldEnabled) {
			if(e.getKey() == e.SPACE ||fnKeyType(e.getKey()) == 'EM' || fnKeyType(e.getKey()) == 'KM' || fnKeyType(e.getKey()) == 'SM'){
				e.stopEvent();
			}
		}
        this.fireEvent('keydown', this, e);
    },

    onKeyUp: function(e) {
        this.fireEvent('keyup', this, e);
    },

    onKeyPress: function(e) {
        this.fireEvent('keypress', this, e);
    },
    onBlur : function(e) {
        var me = this,
            focusCls = me.focusCls,
            focusEl = me.getFocusEl();

        if (me.destroying) {
            return;
        }

        me.beforeBlur(e);
        if (focusCls && focusEl) {
            focusEl.removeCls(me.removeClsWithUI(focusCls, true));
        }
        if (me.validateOnBlur) {
            me.validate();
        }
        if (me.isValid()) {
        	me.hasFocus = false;
            me.fireEvent('blur', me, e);
            me.postBlur(e);
        } else {
        	var msg = me.regexText;
        	if(msg == null || msg == ''){
        		msg = me.invalidText;
        	}
        	fnShowMessage(msg);
        	me.focus();
        	return;
        }
    },
	fireKey: function(e){
        if(e.isSpecialKey()){
        	if(this.enterEventEnabled != undefined && this.enterEventEnabled){
        		/*
        		if (e.getKey() == e.ENTER) {
        			Ext.getCmp('btn_search').fireHandler(e);
        		}
        		*/
        	}
            this.fireEvent('specialkey', this, new Ext.EventObjectImpl(e));
        }
    },
	setReadOnly: function(readOnly) {
		var me = this,
        inputEl = me.inputEl;
	    readOnly = !!readOnly;
	    me[readOnly ? 'addCls' : 'removeCls'](me.readOnlyCls);
	    me.readOnly = readOnly;
	    if (inputEl) {
	        inputEl.dom.readOnly = readOnly;
	    } else if (me.rendering) {
	        me.setReadOnlyOnBoxReady = true;
	    }
	    if (!readOnly) {
        	me.setFieldStyle('background:rgb(255,255,255);');
        } else {
        	me.setFieldStyle('background:rgb(235,235,235);');
        }
	    me.fireEvent('writeablechange', me, readOnly);
    }
});

Ext.override(Ext.form.field.Date, {
	format: 'Y-m-d',
	altFormats: 'm,d,Y|m.d.Y|Ymd'
});

Ext.define('Ext.form.field.Month', {
    extend:'Ext.form.field.Date',
    alias: 'widget.monthfield',
    requires: ['Ext.picker.Month'],
    alternateClassName: ['Ext.form.MonthField', 'Ext.form.Month'],
    selectMonth: null,
    createPicker: function() {
        var me = this,
            format = Ext.String.format;
        return Ext.create('Ext.picker.Month', {
            pickerField: me,
            ownerCt: me.ownerCt,
            renderTo: document.body,
            floating: true,
            hidden: true,
            focusOnShow: true,
            minDate: me.minValue,
            maxDate: me.maxValue,
            disabledDatesRE: me.disabledDatesRE,
            disabledDatesText: me.disabledDatesText,
            disabledDays: me.disabledDays,
            disabledDaysText: me.disabledDaysText,
            format: me.format,
            showToday: me.showToday,
            startDay: me.startDay,
            minText: format(me.minText, me.formatDate(me.minValue)),
            maxText: format(me.maxText, me.formatDate(me.maxValue)),
            listeners: {
		        select:        { scope: me,   fn: me.onSelect     },
		        monthdblclick: { scope: me,   fn: me.onOKClick     },
		        yeardblclick:  { scope: me,   fn: me.onOKClick     },
		        OkClick:       { scope: me,   fn: me.onOKClick     },
		        CancelClick:   { scope: me,   fn: me.onCancelClick }
            },
            keyNavConfig: {
                esc: function() {
                    me.collapse();
                }
            },
            showButtons: false
        });
    },
    onCancelClick: function() {
        var me = this;
        me.selectMonth = null;
        me.collapse();
    },
    onOKClick: function() {
        var me = this;
	    if (me.selectMonth) {
	    	me.setValue(me.selectMonth);
	        me.fireEvent('select', me, me.selectMonth);
	    }
	    me.collapse();
    },
    onSelect: function(m, d) {
        var me = this;
        me.selectMonth = new Date(( d[0]+1 ) +'/1/'+d[1]);
        if (me.selectMonth) {
	    	me.setValue(me.selectMonth);
	        me.fireEvent('select', me, me.selectMonth);
	    }
	    me.collapse();
    }
});

function fnKeyType(keyCode){
	if(keyCode >= 65 && keyCode <= 90){
		return 'EM';//영문문자
	}else if(keyCode == 229){
		return 'KM';//한글문자
	}else if((keyCode >= 48 && keyCode <= 57) || (keyCode >= 96 && keyCode <= 105)){
		return 'N';//숫자
	}else if((keyCode >= 186 && keyCode <= 192) || (keyCode >= 219 && keyCode <= 222) || (keyCode >= 106 && keyCode <= 111)){
		return 'SM';//특수문자키
	}else if(keyCode >= 112 && keyCode <= 121){
		return 'F';//Function 키
	}else {
		return 'O';//기타 키
	}
}

/*Ext.override(Ext.form.field.ComboBox, {
	onBlur: function(){
		var me = this;
        var selectedInputValue = me.getValue();
        var isNotValid = true;
        if (selectedInputValue != null) {
            var storeCnt = me.store.getCount();
            for (var i=0; i<storeCnt; i++) {
                 if (me.store.getAt(i).data[me.valueField] == selectedInputValue) {
                    isNotValid = false;
                    break;
                }
            }
            if (isNotValid) {
            	me.setValue(null);
            	me.el.dom.value = '';
            }
        }
    }
});*/

Ext.Error = Ext.extend(Error, {
    statics: {
        ignore: false,
        raise: function(err){
            err = err || {};
            if (Ext.isString(err)) {
                err = {msg: err};
            }
            var method = this.raise.caller;
            if (method) {
                if (method.$name) {
                    err.sourceMethod = method.$name;
                }
                if (method.$owner) {
                    err.sourceClass = method.$owner.$className;
                }
            }
            if (Ext.Error.handle(err) !== true) {
                var msg = Ext.Error.prototype.toString.call(err);
                if(
                    msg.toUpperCase().indexOf("INVALID JSON STRING") > 0 &&
                    msg.toUpperCase().indexOf("<HTML") > 0 &&
                    msg.toUpperCase().indexOf("SECURITY_CHECK") > 0
                ) {
                    document.location.reload();
                }
                Ext.log({
                    msg: msg,
                    level: 'error',
                    dump: err,
                    stack: true
                });
            }
        },
        handle: function(){
            return Ext.Error.ignore;
        }
    },
    name: 'Ext.Error',
    constructor: function(config){
        if (Ext.isString(config)) {
            config = {msg: config};
        }
        var me = this;
        Ext.apply(me, config);
        me.message = me.message || me.msg;
    },
    toString: function(){
        var me = this,
            className = me.className ? me.className  : '',
            methodName = me.methodName ? '.' + me.methodName + '(): ' : '',
            msg = me.msg || '(No description provided)';
        return className + methodName + msg;
    }
});

var w = document.documentElement.clientWidth;
var h = document.documentElement.clientHeight;

var ynCode = Ext.create('Ext.data.Store', {
    fields: ['CD', 'CD_DESC'],
    data: [{'CD': 'Y', 'CD_DESC': 'Y'}, {'CD': 'N', 'CD_DESC': 'N'}]
});

var allYnCode = Ext.create('Ext.data.Store', {
    fields: ['CD', 'CD_DESC'],
    data: [{'CD': '', 'CD_DESC': 'ALL'},
           {'CD': 'Y', 'CD_DESC': 'Y'}, {'CD': 'N', 'CD_DESC': 'N'}]
});

function fnWindowResize(){
	var newW = document.documentElement.clientWidth;
	var newH = document.documentElement.clientHeight;
	if (Ext.getCmp('grid') != undefined) {
		//Ext.getCmp('grid').setSize(newW, newH);
	}
}

function fnRendererCode(store, value){
	var idx = store.find('CD', value);
	var rec = store.getAt(idx);
	if (rec) {
		return rec.get('CD_DESC');
	} else {
		return '';
	}
}

function fnInitSearch(grid, panel) {
	if (grid == undefined) {
		return false;
	}

	if (grid.store.data.items.length > 0) {
        grid.getStore().clearData();
        grid.getStore().totalCount = 0;
        grid.getView().refresh();
    }

	if (grid.dockedItems != undefined) {
        for (var i=0; i<grid.dockedItems.items.length; i++) {
            if (grid.dockedItems.items[i].$className == 'Ext.toolbar.Paging') {
                var dockedItem = grid.dockedItems.items[i];
                var item = undefined;
                item = dockedItem.items.items[0];
                if (item != undefined) {
                	item.setDisabled(true);
                }
                item = dockedItem.items.items[1];
                if (item != undefined) {
                	item.setDisabled(true);
                }
                item = dockedItem.items.items[4];
                if (item != undefined) {
                	item.setDisabled(true);
                    item.setValue('0');
                }
                item = dockedItem.items.items[5];
                if (item != undefined) {
                    item.setText('/ 0');
                }
                item = dockedItem.items.items[7];
                if (item != undefined) {
                	item.setDisabled(true);
                }
                item = dockedItem.items.items[8];
                if (item != undefined) {
                	item.setDisabled(true);
                }
                item = dockedItem.items.items[12];
                if (item != undefined) {
                    item.setText(dockedItem.emptyMsg);
                }

                break;
            }
        }
    }

	if (panel == undefined) {
		return false;
	}

	var p = panel.items.items[0].items.items;
	if (p != undefined || p != null) {
		for (var i=0; i<p.length; i++) {
			if (strAvailXType.indexOf(p[i].getXType()) > -1) {
					p[i].setValue('');
			} else if(p[i].getXType() == 'panel') {
				var q = p[i].items.items;
				for (var j=0; j<q.length; j++) {
					if (strAvailXType.indexOf(q[j].getXType()) > -1) {
							q[j].setValue('');
					}
				}
			}
		}
		p[0].focus();
	}
}

function fnSetGridParams(records){
    var retParam = '';
    if (records != undefined) {
        retParam = '[';
        for (var i=0; i<records.length; i++) {
            var record = records[i];
            /********** 수정한 필드에 값이 들어있지 않을 경우 Null 처리를 한다.*********/
            for (var recordDataColumn in record.data) {
                if (record.get(recordDataColumn.toString()) == null) {
                    record.set(recordDataColumn.toString(), '');
                }
            }

            retParam += Ext.encode(record.data);
            if (i < records.length-1) {
                retParam += ",";
            }
        }
        retParam += "]";
    }
    return retParam;
}

function fnSetStoreParams(store, options){
    store.proxy.extraParams = {
    		'insertData': fnSetGridParams(options.create),
    		'updateData': fnSetGridParams(options.update),
    		'deleteData': fnSetGridParams(options.destroy)
    };
}

function fnGetTmStore(strt_tm, end_tm, blank){
    var tmStore = Ext.create('Ext.data.Store', {
        storeId : 'tmStore',
        fields: ['CD_NM', 'CD_DESC']
    });
    if (blank == true) {
        tmStore.add({'CD_NM': '', 'CD_DESC': ''});
    }
    for (var i=0; i<=(end_tm-strt_tm); i++) {
        var tm = Ext.String.leftPad((strt_tm + i), 2, '0') + ':00';
        tmStore.add({'CD_NM': tm, 'CD_DESC': tm});
    }
    return tmStore;
}

function fnSetFieldValues(array, data, afterFnc){
    for (var i=0; i<array.length; i++) {
        if (data.get(array[i].getId().toUpperCase()) != undefined && data.get(array[i].getId().toUpperCase()) != null) {
            setValue(array[i], data.get(array[i].getId().toUpperCase()).toString());
        }
    }
    if (afterFnc != undefined) {
        afterFnc();
    }
}

function fnSetValue(obj, value) {
    if (obj.$className == 'Ext.grid.Panel') {
    	//Grid일 경우에는 Value Setting이 불가능하다.
   	} else if (obj.$className == 'Ext.form.Label') {
        obj.setText(value);
    } else {
        obj.setValue(value);
    }
}

function fnReplaceAll(temp, replaceTarget, ReplaceStr) {
    return temp.split(replaceTarget).join(ReplaceStr);
}

function fnGetValue(obj){
    var retVal;
    if (obj == undefined) {
        return obj;
    }
    if (obj.$className == 'Ext.form.Label') {
        retVal = obj.text;
    } else if (obj.$className == 'Ext.form.field.Date') {
        retVal = obj.getRawValue();
    } else if (obj.$className == 'Ext.grid.Panel') {
        var datas = new Array;
        var items = obj.store.data.items;
        for (var i=0; i<items.length; i++) {
            datas.push(items[i].data);
        }
        return Ext.JSON.encode(datas);
    } else if (obj.$className == 'Ext.form.field.TextArea') {
        var objValue = obj.getValue();
        objValue = fnReplaceAll(objValue, "\\", "\\\\");
        objValue = fnReplaceAll(objValue, "\'", "\\\'");
        objValue = fnReplaceAll(objValue, "\"", "\\\"");
        objValue = objValue.replace(/\r\n/gi,"%%n");
        retVal = objValue;
        /*obj.getValue().replace(/\r\n/gi,"%%r%%n");
        ==> oracle : CHR(10)||CHR(13)*/
    } else if (obj.$className == 'Ext.form.field.HtmlEditor') {
        var objValue = obj.getValue();
        objValue = fnReplaceAll(objValue, "\\", "\\\\");
        objValue = fnReplaceAll(objValue, "\'", "\\\'");
        objValue = fnReplaceAll(objValue, "\"", "\\\"");
        objValue = objValue.replace(/\r\n/gi,"\\\n");
        retVal = objValue;
    } else if (obj.$className == 'Ext.form.field.Text') {
        var objValue = obj.getValue();
        objValue = fnReplaceAll(objValue, "\\", "\\\\");
        objValue = fnReplaceAll(objValue, "\'", "\\\'");
        objValue = fnReplaceAll(objValue, "\"", "\\\"");
        retVal = objValue;
    } else {
        retVal = obj.getValue();
    }
    return retVal == null ? '' : retVal;
}

function fnShowProxyMsg(proxy, response, operation, store, extraParams){
    var responseText = Ext.decode(response.responseText);
    var errorMsg = '';
    var errorFlag = false;
    try {
        if (responseText.success) {
            errorMsg = operation.error;
        } else {
            errorMsg = responseText.message;
            if(responseText != null) {
    	        if(responseText.reqLogin != undefined) {
    	        	errorFlag = true;
    	        }
            }
        }
    } catch(err) {
        errorMsg = parent.msgProperty.COM_ERR_0050; //예상치 않은 오류가 발생하였습니다. 관리자에게 문의해 주십시오.
    }
    Ext.MessageBox.show({
        title: 'FCAS',
        msg: errorMsg,
        icon: Ext.MessageBox.ERROR,
        buttons: Ext.Msg.OK,
        fn: function(buttonId, text, opt){
            if (buttonId == 'ok') {
                if (extraParams != undefined) {store.proxy.extraParams = extraParams;}
                if (store != undefined) {store.loadPage(1);}

                if(errorFlag) {
                	top.document.location.href = "/sys/com/Login/selectLoginView.do";
                }
            }
        }
    });


}

function fnShowStoreMsg(store, operation, eOpts){
    var rtMsg = '';
    if (operation.action == 'create') {
        rtMsg = '저장 되었습니다.';
    } else if (operation.action == 'update') {
        rtMsg = '수정 되었습니다.';
    } else if (operation.action == 'destroy') {
        rtMsg = '삭제 되었습니다.';
    }
    Ext.MessageBox.show({
        title: 'FCAS',
        msg: rtMsg,
        icon: Ext.MessageBox.INFO,
        buttons: Ext.Msg.OK,
        fn: function(buttonId, text){
            if (buttonId == 'ok') {
                store.loadPage(1);
            }
        }
    });
}

function fnShowStoreMsgForPopup(store, operation, eOpts, afterAction){
    var rtMsg = '';
    if (operation.action == 'create') {
        rtMsg = '저장 되었습니다.';
    } else if (operation.action == 'update') {
        rtMsg = '수정 되었습니다.';
    } else if (operation.action == 'destroy') {
        rtMsg = '삭제 되었습니다.';
    }
    Ext.MessageBox.show({
        title: 'FCAS',
        msg: rtMsg,
        icon: Ext.MessageBox.INFO,
        buttons: Ext.Msg.OK,
        fn: afterAction == undefined ? function(buttonId, text, opt){
            if (buttonId == 'ok') {
                window.returnValue = true;
                window.close();
                store.loadPage(1);
            }
        } : afterAction
    });
}

function fnOpenModal(url, arg, style){
    try {
        if (arg == null || arg == undefined || arg == '') {
            arg = self;
        }
    } catch(e) {
        arg = self;
    }
    try {
        if (style == null || style == undefined) {
            style = 'status=no;';
        } else {
            style += 'status=no;';
        }
    } catch(e) {
        style = 'status=no;';
    }
    return window.showModalDialog(url, arg, style);
}

/****** formObjs JSON Data Definition
var formObjs = {
    hiddenType:[
        { "NAME":"EMPL_NM", "VALUE": "황현희" },
        { "NAME":"EMPL_NO", "VALUE": "12345" },
        { "NAME":"EMPL_CD", "VALUE": "GOOD" }
    ]
}
********/
function fnOpenWindow(url, name, style, hiddenObjs){
    var popupWin = null;
    try {
        if (name == null || name == undefined || name == '') {
            name = 'FCAS';
        }
    } catch(e) {
        name = '_exception_name';
    }
    try {
        if (style == null || style == undefined) {
            style = 'location=0, directoryies=0, resizable=0, status=0, toolbar=0, memubar=0, scrollbars=1';
        } else {
            style += ', location=0, directoryies=0, resizable=0, status=0, toolbar=0, memubar=0, scrollbars=1';
        }
    } catch(e) {
        style = 'location=0, directoryies=0, resizable=0, status=0, toolbar=0, memubar=0, scrollbars=1';
    }
    if (hiddenObjs == undefined) {
        popupWin = window.open(url, name, style);
    } else {
        popupWin = window.open('', name, style);
        var dynamicForm = document.createElement("form");
        dynamicForm.name = "popupForm";
        dynamicForm.method = "POST";
        dynamicForm.action = url;
        dynamicForm.target = name;
        for (var i=0; i<hiddenObjs.hiddenType.length; i++) {
            var hiddenObjInfo = hiddenObjs.hiddenType[i];
            var hiddenObj = document.createElement("input");
            hiddenObj.type = "hidden";
            hiddenObj.name = hiddenObjInfo.NAME;
            hiddenObj.value = hiddenObjInfo.VALUE;
            dynamicForm.insertBefore(hiddenObj, null);
        }
        document.body.insertBefore(dynamicForm, null);
        dynamicForm.submit();
        document.body.removeChild(dynamicForm);
    }
    return popupWin;
}

function fnShowMessage(messageStr, iconType, afterAction, buttons){

   Ext.MessageBox.show({
        title: 'FCAS',
        msg: messageStr,
        icon: iconType == undefined ? Ext.MessageBox.INFO : iconType,
        buttons: buttons == undefined ? Ext.Msg.OK : buttons,
        fn: afterAction == undefined ? function(buttonId, text, opt){try{parent.window.scrollTo(0, 0);}catch(e){self.scrollTo(0, 0);}} : afterAction
    });
}

function fnShowMessageButton(messageStr, iconType, buttons, afterAction){
   Ext.MessageBox.show({
        title: 'FCAS',
        msg: messageStr,
        icon: iconType == undefined ? Ext.MessageBox.INFO : iconType,
        buttons: buttons == undefined ? Ext.Msg.OK : buttons,
        fn: afterAction == undefined ? function(buttonId, text, opt){try{parent.window.scrollTo(0, 0);}catch(e){self.scrollTo(0, 0);}} : afterAction
    });
}

function fnShowMessageAfAct(messageStr, iconType, buttons, afterAction){
	Ext.MessageBox.show({
        title: 'FCAS',
        msg: messageStr,
        icon: Ext.MessageBox.INFO,
        buttons: Ext.Msg.OK,
        fn: afterAction == undefined ? function(buttonId, text, opt){try{parent.window.scrollTo(0, 0);}catch(e){self.scrollTo(0, 0);}} : afterAction
    });
}

function fnGetToday(){
    var day = new Date();
    var retDay = day.getFullYear() + '-' + (day.getMonth()+1) + '-' + day.getDate();
    return retDay;
}

function fnGetYyyyMm(mode){
	var day = new Date();
	if(mode == 'start') {
		return new Date(day.getFullYear() , (day.getMonth()) , '01');
	}else if(mode == 'end') {
		return new Date(day.getFullYear() , (day.getMonth())+1 , 0);
	}
}

function fnGetStrToday(){
    var day = new Date();
    var yyyy = day.getFullYear();
    var mm = day.getMonth() + 1;
    if (mm < 10) {
    	mm = '0'+mm;
    }
    var dd = day.getDate();
    if (dd < 10) {
    	dd = '0'+dd;
    }
    var retDay = yyyy + '년 ' + mm + '월 ' + dd + '일';
    return retDay;
}

function fnGetExtraparams(fields, forms){
    var jsonObj = new Object();
    for (var i=0; i<fields.length; i++){
        var fieldValue = '';
        for (var j=0; j<forms.length; j ++){
            if (fields[i] == forms[j].getId().toUpperCase()) {
                if (forms[j].$className == 'Ext.form.field.Checkbox') {
                    if (fnGetValue(forms[j]) == true) {
                        fieldValue = 'Y';
                    } else if (fnGetValue(forms[j]) == false) {
                        fieldValue = 'N';
                    }
                } else {
                    fieldValue = fnGetValue(forms[j]);
                }
                break;
            }
        }
        if (fieldValue == null || fieldValue == undefined) {
        	fieldValue = '';
        }
        eval("jsonObj."+fields[i]+"= '"+fieldValue+"'");
    }
    return jsonObj;
}

function fnGetExtraparamsV2(fields, forms){
    var jsonObj = new Object();
    for (var i=0; i<fields.length; i++) {
        var fieldValue = '';
        for (var j=0; j<forms.length; j++) {
            if (fields[i] == forms[j].getId().toUpperCase()) {
                if (forms[j].$className == 'Ext.form.field.Checkbox') {
                    if (fnGetValue(forms[j]) == true) {
                        fieldValue = 'Y';
                    } else if (fnGetValue(forms[j]) == false) {
                        fieldValue = 'N';
                    }
                } else if (forms[j].$className == 'Ext.form.field.TextArea') {
                    fieldValue = fnGetValue(forms[j]).replace(/\r\n/gi,"%%n");
                    /*fieldValue = fnGetValue(forms[j]).replace(/\r\n/gi,"%%r%%n");
                    ==> oracle : CHR(10)||CHR(13)*/
                } else if (forms[j].$className == 'Ext.grid.Panel') {
                    var panel = forms[j];
                    eval("jsonObj."+fields[i]+"_INSERT = '"+setGridParams(panel.store.getNewRecords())+"'");
                    eval("jsonObj."+fields[i]+"_UPDATE = '"+setGridParams(panel.store.getUpdatedRecords())+"'");
                    eval("jsonObj."+fields[i]+"_DELETE = '"+setGridParams(panel.store.getRemovedRecords())+"'");
                    fieldValue = forms[j].$className;
                } else {
                    fieldValue = fnGetValue(forms[j]);
                }
                break;
            }
        }
        if (fieldValue == null || fieldValue == undefined) {
        	fieldValue = '';
        }
        if (fieldValue != 'Ext.grid.Panel') {
            eval("jsonObj."+fields[i]+"= '"+fieldValue+"'");
        }
    }
    return jsonObj;
}

function fnGetBytes(str) {
    var i, tmp = escape(str);
    var bytes = 0;
    for (i=0; i<tmp.length; i++) {
        if (tmp.charAt(i) == "%") {
            if (tmp.charAt(i + 1) == "u") {
                bytes += 2;
                i += 5;
            } else {
                bytes += 1;
                i += 2;
            }
        } else {
            bytes += 1;
        }
    }
    return bytes;
}

function fnAssertMsg(inMax, objValue){
    var msgLeng = objValue.length;
    var msgTemp = objValue;
    var tmp = '';
    var bytes = 0;
    var msg = '';
    for (var i=0; i<msgLeng; i++) {
        tmp = msgTemp.charAt(i);
        bytes += fnGetBytes(tmp);
        if (bytes > inMax) {
            break;
        } else {
            msg += tmp;
        }
    }
    return msg;
}

function fnVerifyColumnValueByte(obj, maxSize){
    obj.on('change',function(){
    	var objVal = obj.getValue();
    	var myLength = fnGetBytes(objVal);
    	if (maxSize < myLength) {
    		//fnShowMessage('해당 Column의 최대 '+maxSize+'Byte까지 입력이 가능합니다.<br>넘어선 글자들은 자동으로 제거됩니다.');
    		obj.setValue(fnAssertMsg(maxSize, objVal));
    		return;
    	}
    });
}

// 일 : 0 ~ 토 : 6 ==> 월 : 0 ~ 일 : 6
function fnTransDay(day){
    day -= 1;
    if (day < 0) {
        day = 6;
    }
    return day;
}

function fnSubmitGridStore(store, url, success_fn){
    var insert_params = fnSetGridParams(store.getNewRecords());
    var update_params = fnSetGridParams(store.getUpdatedRecords());
    var delete_params = fnSetGridParams(store.getRemovedRecords());
    store.removed = [];
    /*if (store.removed.length > 0){
        store.removed.delArr(0,store.removed.length);
    }*/
    Ext.Ajax.request({
        url: url,
        params: {insertData: insert_params, updateData:update_params, deleteData:delete_params},
        method: 'POST',
        callback: function(options, success, response){

        },
        success: function(response, opts){
            if (success_fn == undefined) {
                var result = Ext.decode(response.responseText);
                if (result.success) {
                    fnShowMessage("작업을 완료하였습니다.");
                } else {
                    var msg = '';
                    try {
                    	msg = result.message;
                    } catch(err) {
                    	msg = '작업에 실패하였습니다.';
                    }
                    fnShowMessage(msg);
                }
            } else {
                success_fn(response, opts);
            }
        },
        failure: function(response, opts){
            fnShowMessage('server-side failure with status code ' + response.status);
        }
    });
}

function fnSubmitFormStore(url, jsonParams, success_fn){
    Ext.Ajax.request({
        url: url,
        params: jsonParams,
        method: 'POST',
        callback: function(options, success, response){

        },
        success: function(response, opts){
            if (success_fn == undefined) {
                var result = Ext.decode(response.responseText);
                if (result.success) {
                    fnShowMessage("작업을 완료하였습니다.");
                } else {
                    var msg = '';
                    try {
                    	msg = result.message;
                    } catch(err) {
                    	msg = '작업에 실패하였습니다.[1]';
                    }
                    fnShowMessage(msg);
                }
            } else {
                success_fn(response, opts);
            }
        },
        failure: function(response, opts){
            fnShowMessage('server-side failure with status code ' + response.status);
        }
    });
}

function fnSetStoreDisplay(obj, store, valueField, displayField, value){
    var objValue = '';
    if (value == undefined) {
        objValue = fnGetValue(obj);
    } else {
        objValue = value;
    }
    var storeIdx = store.find(valueField,objValue);
    var rec = store.getAt(storeIdx);
    if (rec) {
        return fnSetValue(obj,rec.get(displayField));
    } else {
        return fnSetValue(obj,'');
    }
}

function fnSetUppercase(obj){
    obj.setFieldStyle('text-transform: uppercase');
}

function fnGetElementByID(array,id){
    for (var i=0 ; i<array.length;  i++) {
        if (array[i].getId().toUpperCase() == id.toUpperCase()) {
            return array[i];
        }
    }
    return undefined;
}

function fnChkMandatory(objArray){
    var allObj = document.all;
    var clsNm, ndNm, id, tlt;
    var clsChk, ndChk, idChk = false;
    var obj;
    var objValue;
    for (var i=0; i<allObj.length; i++) {
        clsNm = allObj[i].className;
        ndNm = allObj[i].nodeName;
        id = allObj[i].id;
        if (clsNm == 'mandatory') {
            tlt = allObj[i-1].innerText.replace('*','');
            clsChk = true;
        }
        if (clsChk) {
            if (ndNm == 'DIV') {
                ndChk = true;
            }
        }
        if (clsChk && ndChk) {
            obj = fnGetElementByID(objArray, id.replace('_div', ''));
            objValue = fnGetValue(obj);
            if (objValue == undefined || objValue == '') {
                fnShowMessage('"' + tlt + '"은(는) 필수 항목입니다.');
                return false;
            }
            clsChk = false;
            ndChk = false;
        }
    }
    return true;
}

function fnToTimeObject(time){
    /*yyy-MM-dd형태의 일자를 Date 객체로 변환함.*/
    var year = eval(time.substr(0,4));
    var mon = eval(time.substr(5,2)) - 1;
    var day = eval(time.substr(8,2));
    return new Date(year, mon, day);
}

/* ********************************************************
 * 문자열 변환 20120101 -> 2012-01-01
 ******************************************************** */
function fnChangeFormatDash(str){
	if(str != null && str.length == 8){
	 	var yearStr = str.substring(0,4);
	 	var monthStr = str.substring(4,6);
	 	var dayStr = str.substring(6,8);
	 	return yearStr + '-' + monthStr + '-' + dayStr;
	}else {
		return str;
	}
}

function fnGetDayInterval(time1, time2){
   /*두개의 일자를 Parameter로 받아 차이를 구하는 Functioin. time2가 존재하지 않을 경우 오늘 일자로 Setting.*/
   var date1 = fnToTimeObject(time1);
   var date2 = null;
   if(time2 == undefined){
       date2 = new Date();
   }else {
       date2 = fnToTimeObject(time2);
   }
   var day = 86400000;//1000 * 3600 * 24;
   return parseInt((date2 - date1) / day, 10);
}

function fnGetDayIntervalDate(dateParam1, dateParam2){
   /*두개의 일자를 Parameter로 받아 차이를 구하는 Functioin. time2가 존재하지 않을 경우 오늘 일자로 Setting.*/
   var date1 = dateParam1;
   var date2 = null;
   if(dateParam2 == undefined){
       date2 = new Date();
   }else {
       date2 = dateParam2;
   }
   var day = 86400000;//1000 * 3600 * 24;
   return parseInt((date2 - date1) / day, 10);
}

function fnValidSearchDateOneMonth(dateObj1, dateObj2, labelParam){
	/*전제조건 : 한달의 기준은 31일로 한다.*/
	if(labelParam == undefined){
		labelParam = '해당 기간';
	}
	if(dateObj1.getValue() == null){
		fnShowMessage('검색조건 ' + labelParam + '의 시작일자를 입력하여 주십시요.');
		return false;
	}
	if(dateObj2.getValue() == null){
		fnShowMessage('검색조건 ' + labelParam + '의 종료일자를 입력하여 주십시요.');
		return false;
	}
	if((fnGetDayIntervalDate(dateObj1.getValue(), dateObj2.getValue()) + 1) > 31){
		fnShowMessage(labelParam + '은(는) 최대 31일을 초과하여 검색 또는 Excel Export를 할 수 없습니다.');
		return false;
	}
	return true;
}

function fnChkCommonField(objArray){
    var errCnt = 0;
    for (var i=0; i<objArray.length; i++) {
        try{
            if (objArray[i].getActiveError() != '') {
                errCnt++;
            }
        } catch(er){
        }
    }
    if (errCnt > 0) {
        fnShowMessage('현재 화면 상에 올바른 형식의 값이 아닌 Field가 총 '+errCnt+'개 존재합니다. 확인하여 보시기 바랍니다.');
        return false;;
    }
    return true;
}

function fnChkAllField(objArray){
    if (!fnChkMandatory(objArray)) {
        return false;
    } else if (!fnChkCommonField(objArray)) {
        return false;
    }
    return true;
}

/****** formObjs JSON Data Definition
var excelFormObjs = {
    hiddenType:[
        { "NAME":"SHEET_NAME", "VALUE": "사용자정보" },
        { "NAME":"COLS", "VALUE": "EMPL_NO,EMPL_NM,..." },
        { "NAME":"TITLE", "VALUE": "admin,관리자,..." },
        { "NAME":"SQLID", "VALUE": "sqlMap_namespace.statement_id" },
        { "NAME":"검색조건1", "VALUE": "검색조건1 값" },
        { "NAME":"검색조건2", "VALUE": "검색조건2 값" }, ...
        { "NAME":"검색조건N", "VALUE": "검색조건N 값" }, ...
    ]
}
********/
function fnDownloadExcel(hiddenObjs){
    if (hiddenObjs == undefined) {
        Ext.MessageBox.show({
            title: 'PTMS',
            msg: '엑셀다운을 할 수 없습니다.',
            icon: Ext.MessageBox.INFO,
            buttons: Ext.Msg.OK
        });
        return false;
    } else {
        var excelForm = document.createElement("form");
        excelForm.name = "excelForm";
        excelForm.method = "POST";
        excelForm.action = '/sys/com/Common/getExcelDownFile.do';
        excelForm.target = '_self';

        for(var i=0; i<hiddenObjs.hiddenType.length; i++){
            var hiddenObjInfo = hiddenObjs.hiddenType[i];
            var hiddenObj = document.createElement("input");
            hiddenObj.type = "hidden";
            hiddenObj.name = hiddenObjInfo.NAME;
            hiddenObj.value = hiddenObjInfo.VALUE;
            excelForm.insertBefore(hiddenObj, null);
        }
        document.body.insertBefore(excelForm, null);
        excelForm.submit();
        document.body.removeChild(excelForm);
    }
}

function fnAddMonth(d, n){
    d.setMonth(d.getMonth() + n);
    var lastDate = 32 - (new Date(d.getFullYear(), d.getMonth(), 32).getDate());
    var toDay = new Date().getDate();
    d.setDate((toDay > lastDate) ? lastDate : toDay);
    return d;
}

function fnAddMonths(d, n, daySet){
    /**
     * daySet Code.
     *    F - 첫번째 날짜를 나타냄.
     *    T - 오늘 일자를 기준으로 진행됨.
     *    L - 마지막 날짜를 나타냄. [default]
     **/
    var daySetVal = -1;
    daySet = daySet.toUpperCase();
    d.setMonth(d.getMonth() + n);
    d.setDate(14);
    if (daySet != undefined && daySet == 'T') {
        daySetVal = new Date().getDate();
    } else if (daySet != undefined && daySet == 'F') {
        daySetVal = 1;
    } else {
        daySetVal = 32 - (new Date(d.getFullYear(), d.getMonth(), 32).getDate());
    }
    d.setDate(daySetVal);
    return d;
}

/**
 * 사용이력 저장 시 이력유형이 화면사용, 이벤트 유형이 조회, Excel Export 시 현재 화면의 검색 조건 List를 Map으로 변경하는 Function
 * Parmeter - searchPanel : 검색 조건 Panel Object를 입력하면 됨.
 * ※주의 사항.
 * 		반드시 검색조건이 되는 객체에 search_cd 값이 입력되어져 있어야 한다.
 * 		☞ 예시
 * 			{xtype: 'textfield', id: 's_cd', fieldLabel: '메시지 코드', search_cd: 'CD;00001'}
 * 			search_cd의 구조는 ';'를 기준으로 앞은 검색시 property 값이고, 뒤는 검색조건 타이틀 코드(cd_type=srch_tile_code)값이다.
 * **/
function fnGetScMap(searchPanel){

	var retVal = "";
	var tempObjList;
	var p = searchPanel.items.items[0].items.items;

	if (p != undefined || p != null) {
		retVal = "[{";
		for (var i=0; i<p.length; i++) {
			if(p[i].getXType() == 'panel'){
				var u = p[i].items.items;
				for (var m=0; m<u.length; m++) {
					if (strAvailXType.indexOf(u[m].getXType()) > -1) {
						if(u[m].search_cd != undefined && u[m].search_cd.indexOf(";") > -1){
							tempObjList = u[m].search_cd.split(';');
							retVal += (retVal == "[{" ? "\"" + tempObjList[0] + "\":\"" + tempObjList[1] + "\"" : ",\"" + tempObjList[0] + "\":\"" + tempObjList[1] + "\"") ;
							tempObjList = null;
						}
					}
				}
			}else if(strAvailXType.indexOf(p[i].getXType()) > -1) {
				if(p[i].search_cd != undefined && p[i].search_cd.indexOf(";") > -1){
					tempObjList = p[i].search_cd.split(';');
					retVal += (retVal == "[{" ? "\"" + tempObjList[0] + "\":\"" + tempObjList[1] + "\"" : ",\"" + tempObjList[0] + "\":\"" + tempObjList[1] + "\"") ;
					tempObjList = null;
				}
			}
		}
		retVal += "}]";
	}else {
		retVal = "[{}]";
	}

	return retVal;
}

//신규 Form 생성.
function createForm(nm,mt,at,tg) {
    var f=document.createElement("form");
    f.name=nm;
    f.method=mt;
    f.action=at;
    f.target=tg;
    return f;
}

//Form에 Hidden Value 입력.
function addHidden(f,n,v) {
    var i=document.createElement("input");
    i.type="hidden";
    i.name=n;
    i.value=v;
    //f.insertBefore(i);
    f.appendChild(i);
    return f;
}

/** Value성 Function Start**/

function fnRequiredValue(){
	return '<span style="color:red;font-weight:bold" data-qtip="필수">*</span>';
}



/** Value성 Function End**/


//그리드 컬럼을 지정한 numPer %별로 사이즈 지정한다.
function setColumnSize( cid , numPer, gridObj){
	var gw = gridObj.getWidth();
	var colWidth = Math.round((gw*numPer)/100)-1;
	Ext.getCmp( cid ).setWidth(colWidth);
};


// size : grid-form 형태일 경우 접혀진 그리드 높이 + form 펼처진 높이 를 더한값을 넘긴다. (예 200 + 422 = 622)
//        grid 형태일 경우 그리드의 높이를 넘긴다. (예 516)
function fnIframeHeight(size) {
	//var menu_height = document.getElementById("menu").clientHeight;
	var search_div_height = document.getElementById("search_div") == null ? -10 : document.getElementById("search_div").clientHeight;
	var prog_div_height = document.getElementById("prog_div") == null ? 0 : document.getElementById("prog_div").clientHeight;
	var contentHeight = search_div_height + prog_div_height + size + 170; // 170은 여백
	/*var screenHeight = window.outerHeight;
	screenHeight = screenHeight - 254;
	if (contentHeight < screenHeight) {
		contentHeight = screenHeight;
	}*/
	/*if (menu_height > contentHeight) {
		contentHeight = menu_height;
	}*/
	parent.document.getElementById("content_iframe").style.height = (contentHeight)+"px";
	parent.document.getElementById("main").style.height = (contentHeight)+"px";
}



/* *
 * Form Validation Default Function
 * Parameter : frm - 사용 Form.
 * 			   othValidFilds - 기타 검증 Fields.
 * return 	 : 0 (false) - 문제 없음.
 * 			   1 (true) - 뭔가 문제 있음.
 * */
function fnIsFormDfultValid(frm, othValdFilds){
	var mandaObj = fnChkMandaFields(frm, othValdFilds);
	if(!frm.getForm().isValid()){
		fnShowMessage(msgProperty.COM_ERR_0023);//입력 폼 중 입력 폼에 맞지 않게 입력된 값이 있습니다.<br>빨간 줄로 표시된 입력 폼을 확인하여 주시기 바랍니다.
		return 1;
	}else if(mandaObj){
		fnMandaShowMsg(mandaObj);
		return 1;
	}
	return 0;
}

/* *
 * Mandatory Field Check Function
 * Parameter : form - 검증할 Form Object.
 * 			   othFields - form 이외 검증해야할 Field 또는 하단 panel 부분 주석 참조.(예시: 'SHOP_CD,COMP_ID')
 *
 * */
function fnChkMandaFields(form, othFields){

	//검증 가능한 Field를 모두 검증 한 후.
	var p = form.items.items;
	if (p != undefined || p != null) {
		for (var i=0; i<p.length; i++) {
			if (p[i].getXType() == 'fieldset') {
				var t = p[i].items.items;
				for (var l = 0 ; l < t.length ; l++) {
					if (strAvailXType.indexOf(t[l].getXType()) > -1) {
						if ((t[l].afterLabelTextTpl == fnRequiredValue() || t[l].mandatoryLabel != undefined) &&
								(t[l].getValue() == '' || t[l].getValue() == null)) {
							return t[l];
						}
					//Panel은 1단만 검증하면 됨. Form Object에서  panel이  2단 이상 진행될 경우 화면에 무리가 옴. 가능하면 사용하지 말 것(만약 사용 해야할 경우에는 othFields를 이용하길 바람.)
					} else if(t[l].getXType() == 'panel') {
						var u = t[l].items.items;
						for (var m=0; m<u.length; m++) {
							if (strAvailXType.indexOf(u[m].getXType()) > -1) {
								if((u[m].afterLabelTextTpl == fnRequiredValue() || u[m].mandatoryLabel != undefined) &&
										(u[m].getValue() == '' || u[m].getValue() == null)){
		    						return u[m];
		    					}
							}
						}
					}
				}
			} else {
				//일반적인 Field
				if (strAvailXType.indexOf(p[i].getXType()) > -1) {
					if ((p[i].afterLabelTextTpl == fnRequiredValue() || p[i].mandatoryLabel != undefined) &&
							(p[i].getValue() == '' || p[i].getValue() == null)) {
						return p[i];
					}
				//Panel은 1단만 검증하면 됨. Form Object에서  panel이  2단 이상 진행될 경우 화면에 무리가 옴. 가능하면 사용하지 말 것(만약 사용 해야할 경우에는 othFields를 이용하길 바람.)
				} else if(p[i].getXType() == 'panel') {
					var q = p[i].items.items;
					for (var j=0; j<q.length; j++) {
						if (strAvailXType.indexOf(q[j].getXType()) > -1) {
							if ((q[j].afterLabelTextTpl == fnRequiredValue() || q[j].mandatoryLabel != undefined) &&
									(q[j].getValue() == '' || q[j].getValue() == null)) {
	    						return q[j];
	    					}
						}
					}
				}
			}
		}
	}
	//Form Object이외의 것들은 othFields를 이용하여 처리함.
	if (othFields != undefined && othFields != "" ) {
		var fieldArray = othFields.split(',');
		for (var i = 0 ; i < fieldArray.length ; i++) {
			var r = Ext.getCmp(fieldArray[i]);
			if (strAvailXType.indexOf(r.getXType()) > -1) {
    			if ((r.afterLabelTextTpl == fnRequiredValue() || r.mandatoryLabel != undefined) &&
    					(r.getValue() == '' || r.getValue() == null)) {
    				return r;
    			}
			}else if(r.getXType() == 'panel') {
				var s = r.items.items;
				for (var k=0; k<s.length; k++) {
					if (strAvailXType.indexOf(s[k].getXType()) > -1) {
						if((s[k].afterLabelTextTpl == fnRequiredValue() || s[k].mandatoryLabel != undefined) &&
								(s[k].getValue() == '' || s[k].getValue() == null)){
    						return s[k];
    					}
					}
				}
			}
		}
	}
	return null;
}

function fnMandaShowMsg(obj){
	var label = '';
	if(obj.mandatoryLabel != undefined){
		label = obj.mandatoryLabel;
	}else{
		label = obj.getFieldLabel();
	}
	Ext.MessageBox.show({
        title: 'FCAS',
        msg: label + '는(은) 필수값입니다.',
        icon: Ext.MessageBox.INFO,
        buttons: Ext.Msg.OK,
        fn: function(buttonId, text, opt){
        	if(buttonId == 'ok'){
        		obj.focus();
        	}
        }
    });
}

//화면을 Mask 처리함.
function fnSetElMask(obj){
	if(obj == undefined){
		Ext.getBody().mask('처리 중...');
	}else {
		obj.getEl().mask('처리 중...');
	}
}

//화면을 Unmask 처리함.
function fnSetElUnmask(obj){
	if(obj == undefined){
		Ext.getBody().unmask();
	}else {
		obj.getEl().unmask();
	}
}

//숫자 타입에서 쓸 수 있도록 format() 함수 추가
//숫자 타입 test
//var num = 123456.012;
//console.log(num.format());               // 123,456.012
//num = 13546745;
//console.log(num.format());               // 13,546,745
Number.prototype.format = function(){
	if(this==0) return 0;

	var reg = /(^[+-]?\d+)(\d{3})/;
	var n = (this + '');

	while (reg.test(n)) n = n.replace(reg, '$1' + ',' + '$2');

	return n;
};

//문자열 타입에서 쓸 수 있도록 format() 함수 추가
//문자열 타입 test
//console.log("12348".format());           // 12,348
//console.log("12348.6456".format());      // 12,348.6456
String.prototype.format = function(){
	var num = parseFloat(this);
	if( isNaN(num) ) return "0";

	return num.format();
};
