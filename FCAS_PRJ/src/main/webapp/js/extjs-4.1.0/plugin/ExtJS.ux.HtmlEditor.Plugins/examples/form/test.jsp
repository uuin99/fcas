<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>

<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title>HtmlEditor Plugins Window Example</title>
	<script src="/js/extjs-4.1.0/ext-all.js"></script>
    <link rel="stylesheet" type="text/css" href="/js/extjs-4.1.0/resources/css/ext-all.css" />
    <link rel="stylesheet" type="text/css" href="/js/extjs-4.1.0/plugin/ExtJS.ux.HtmlEditor.Plugins/resources/css/htmleditorplugins.css" />	
    <script src="/js/extjs-4.1.0/plugin/ExtJS.ux.HtmlEditor.Plugins/src/Ext.ux.form.HtmlEditor.MidasCommand.js"></script>
    <script src="/js/extjs-4.1.0/plugin/ExtJS.ux.HtmlEditor.Plugins/src/Ext.ux.form.HtmlEditor.Divider.js"></script>
    <script src="/js/extjs-4.1.0/plugin/ExtJS.ux.HtmlEditor.Plugins/src/Ext.ux.form.HtmlEditor.HR.js"></script>
    <script src="/js/extjs-4.1.0/plugin/ExtJS.ux.HtmlEditor.Plugins/src/Ext.ux.form.HtmlEditor.Image.js"></script>
    <script src="/js/extjs-4.1.0/plugin/ExtJS.ux.HtmlEditor.Plugins/src/Ext.ux.form.HtmlEditor.RemoveFormat.js"></script>
    <script src="/js/extjs-4.1.0/plugin/ExtJS.ux.HtmlEditor.Plugins/src/Ext.ux.form.HtmlEditor.IndentOutdent.js"></script>
    <script src="/js/extjs-4.1.0/plugin/ExtJS.ux.HtmlEditor.Plugins/src/Ext.ux.form.HtmlEditor.SubSuperScript.js"></script>
    <script src="/js/extjs-4.1.0/plugin/ExtJS.ux.HtmlEditor.Plugins/src/Ext.ux.form.HtmlEditor.RemoveFormat.js"></script>
    <script src="/js/extjs-4.1.0/plugin/ExtJS.ux.HtmlEditor.Plugins/src/Ext.ux.form.HtmlEditor.FindAndReplace.js"></script>
    <script src="/js/extjs-4.1.0/plugin/ExtJS.ux.HtmlEditor.Plugins/src/Ext.ux.form.HtmlEditor.Table.js"></script>
    <script src="/js/extjs-4.1.0/plugin/ExtJS.ux.HtmlEditor.Plugins/src/Ext.ux.form.HtmlEditor.Word.js"></script>
    <script src="/js/extjs-4.1.0/plugin/ExtJS.ux.HtmlEditor.Plugins/src/Ext.ux.form.HtmlEditor.Link.js"></script>
    <script src="/js/extjs-4.1.0/plugin/ExtJS.ux.HtmlEditor.Plugins/src/Ext.ux.form.HtmlEditor.SpecialCharacters.js"></script>
    <script src="/js/extjs-4.1.0/plugin/ExtJS.ux.HtmlEditor.Plugins/src/Ext.ux.form.HtmlEditor.UndoRedo.js"></script>
    <script src="/js/extjs-4.1.0/plugin/ExtJS.ux.HtmlEditor.Plugins/src/Ext.ux.form.HtmlEditor.Heading.js"></script>
    <script src="/js/extjs-4.1.0/plugin/ExtJS.ux.HtmlEditor.Plugins/src/Ext.ux.form.HtmlEditor.Plugins.js"></script>
	<!--<script src="http://ext-test/htmleditorplugins/Ext.ux.HtmlEditor.Plugins-all-debug.js"></script>-->
	<script>
	    // this is how to override language strings in Midas Buttons
		if(Ext.ux.form.HtmlEditor.UndoRedo){
		   Ext.ux.form.HtmlEditor.UndoRedo.prototype.midasBtns[1].tooltip.title = "Oh crap - go back to the way it was!";
		}
	</script>
    <script src="form-htmleditor-basic.js"></script>
</head>
<body>

<h1>HtmlEditor with Plugins Form</h1>
<p>This example shows how to use plugins with the HtmlEditor component.</p>
<p>Note that the js is not minified so it is readable. See <a href="../../src/">the 'src' folder</a> and <a href="form-htmleditor-basic.js">form-htmleditor-basic.js</a> for the full source code.</p>

<div id="test"></div>

</body>
</html>
