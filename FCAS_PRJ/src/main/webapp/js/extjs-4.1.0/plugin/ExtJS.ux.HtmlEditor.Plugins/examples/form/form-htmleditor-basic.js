/**
 * @author Shea
 */

Ext.onReady(function(){

    Ext.QuickTips.init();

    Ext.create('Ext.form.Panel', {
        title       : 'HtmlEditor Plugins Form',
        renderTo    : 'test',
        width       : 950,
        height      : 400,
        border      : false,
        frame       : true,
        items       : [{
            xtype           : "htmleditor",
            //enableFont      : false,
            plugins         : Ext.ux.form.HtmlEditor.plugins()
        }],
        buttons     : [{
            text            : 'Save'
        }]
    });
    
 });