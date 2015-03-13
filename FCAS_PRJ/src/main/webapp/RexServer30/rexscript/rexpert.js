// repert.js info
// version : rexpert 3.0
// date : 2012-04-12
//

// Rexpert context root url
var rex_gsRexServiceRootURL = window.location.protocol + "//" + window.location.host + "/RexServer30/";

// preview page
var rex_gsPreViewURL = rex_gsRexServiceRootURL + "rexpreview.jsp";

// rebfiles root directory
var rex_gsReportURL = rex_gsRexServiceRootURL + "rebfiles/";

// cab & plugin download directory
var rex_gsDownloadURL = rex_gsRexServiceRootURL + "cab/";

// setup page url
var rex_gsSetupURL = rex_gsRexServiceRootURL + "cab/download/setup.jsp";

// RexServer service url
var rex_gsRptServiceURL = rex_gsRexServiceRootURL + "rexservice.jsp";

// Export Service URL
var rex_gsRptExportServiceURL = rex_gsRexServiceRootURL + "exportservice.jsp";

// Export URL
var rex_gsRptExportURL = rex_gsRexServiceRootURL + "export.jsp";

// default DBconnection
var rex_gsUserService = "sql1";

// viewer Version
var rex_viewer_version = "1,0,0,179";
var rex_viewer_install = "EACH";  // EACH, ONCE, NONE

// setting CSV information
var rex_gsCsvSeparatorColumn = "|*|";
var rex_gsCsvSeparatorRow = "|#|";
var rex_gsCsvSeparatorDataSet = "|@|";
var rex_gsCsvEncoding = "utf-8"; 

// default XML xpath
var rex_gsXPath = "gubun/rpt1/rexdataset/rexrow";

// Rexpert Web Viewer Windows Size
var rex_gsPreViewFeatures = "center=yes,scrollbars=no,status=no,toolbar=no,resizable=1,location=no,menu=no,width=835,height=600";
var rex_gsPreViewFeaturesModal = "center:yes;resizable:no;scroll:no;status:no;dialogWidth:825px;dialogHeight:600px";

// Language information
var rex_gsViewerLanguage = "ko";

// RexServer 2.5 compatible
var rex_gsServerVersion = "3.0";	// 2.5, 3.0

// setting RexServer 2.5
var rex_gsRptServiceURL_RexServer25 = rex_gsRexServiceRootURL + "rexservice25.jsp";
var rex_gsCsvSeparatorColumn_RexServer25 = "|*|";
var rex_gsCsvSeparatorRow_RexServer25 = "|*|";
var rex_gsCsvSeparatorDataSet_RexServer25 = "|@|";
var rex_gsCsvEncoding_RexServer25 = "utf-8";
var rex_gsXPath_RexServer25 = "root/main/rpt1/rexdataset/rexrow";

// http timeout
var rex_gsHttpTimeout;

/*
var rex_gsHttpTimeout = {"connect.timeout": 30000
						, "control.send.timeout": 30000
						, "control.receive.timeout": 30000
						, "data.send.timeout": 30000
						, "data.receive.timeout": 30000};
*/

// setting css
var rex_gsCss;

/*
var rex_gsCss = [
	"appearance.pagemargin.visible=0"
	,"appearance.toolbar.button.print.enable=0"
	,"accessibility.enable=0"
	,"appearance.canvas.backcolor=rgb(255,255,0)"
	,"appearance.control.backcolor=rgb(255,0,0)"
	,"appearance.canvas.offsetx=0"
	,"appearance.toolbar.button.open.visible=0"
	,"appearance.toolbar.button.closewindow.visible=1"
	,"appearance.tabheader.close.enable=0"
	,"appearance.reportlist.visible=1"
	,"print.appearance.allreportprint.enable=1"
	,"print.allreportprint=1"
	...
];
*/

// call method
var rex_gsMethod;

/*
rex_gsMethod = [
            	"Zoom('wholepage')"
            	,"Zoom('pagewidth')"
            	,"Zoom('200')"
            	,"ZoomIn()"
            	,"ZoomOut()"
            ];
*/

// plugin - webcrypto
var rex_gsPluginTypeWeb;
var rex_gsPluginWebParam;

/*
var rex_gsPluginTypeWeb = "crypto.clipsoft";
var rex_gsPluginWebParam = {"name": "name",
						"common-enable-encode": "1",
						"common-enable-decode": "0",
						"common-delimiter": "|!|",
						"common-encoding": "euc-kr",
						"common-enable-log": "0",
						"common-log-filename": "c:\test2.log"};

var rex_gsPluginTypeWeb = "crypto.xecureweb";
var rex_gsPluginWebParam = {"name": "name",
						"common-enable-encode": "1",
						"common-enable-decode": "0",
						"common-delimiter": "|!|",
						"common-encoding": "euc-kr",
						"common-enable-log": "0",
						"common-log-filename": "c:\test2.log",
						"xecureweb-gateaddr": "ip-address:443:8080",
						"xecureweb-authtype": "",
						"xecureweb-mehtod": "POST",
						"xecureweb-sessionke": "0A0E390C189E00F32F9214B2D186F2561D7B1EAE1014A3"};
*/

/*
var rex_gsPluginTypeWeb = "crypto.initech...";
...
*/

// plugin - DRM
var rex_gsPluginType;
var rex_gsPluginParam;

/*
var rex_gsPluginType = "markany";
var rex_gsPluginParam = {"datapath": rex_gsRexServiceRootURL + "/plugin/markany/MaFpsCommon.jsp",
					"datafilename": "MaPrintInfoCUSTRP.dat",
					"enablecapture": "0",
					"enablespool": "0",
					"enableprinter": "0",
					"printeroption": "3",
					"imagesaferoption": "0"};

var rex_gsPluginType = "bcqure";
var rex_gsPluginParam = {"initpath": rex_gsRexServiceRootURL +  "/plugin/bcqre/prnInit/",
					"datapath": rex_gsRexServiceRootURL +  "/plugin/bcqre/bcqre.server.jsp",
					"docnumber": "ksfc",
					"docname": "ksfc",
					"barcodewidth": "600",
					"barcodeminheight": "50",
					"barcodemaxheight": "200"};
*/

// plugin - DRM file
var rex_gsPluginFileType;
var rex_gsPluginFileParam;

/*
var rex_gsPluginFileType = "markany.drm";
var rex_gsPluginFileParam = {"key1": "value1", "key2": "value2"};
*/

var rex_Agent = function () {
	var a = navigator.userAgent;

	function is(s,t) {
		return ((s||"").indexOf(t)>-1);
	};

	this.isWin = is(a,"Windows") || is(a.toLowerCase(),"msie");
	this.isMac = is(a,"Macintosh");
	this.isUnix = !(this.isWin || this.isMac);

	this.isVista = is(a.toLowerCase(), "nt 6");
	this.isWinXp = is(a.toLowerCase(), "nt 5.1");
	this.isW2k = is(a.toLowerCase(), "nt 5.0");
	this.isW98 = is(a.toLowerCase(), "windows 98");

	this.isOP = is(a.toLowerCase(),"opera");
	this.isIE = is(a.toLowerCase(),"msie");
	this.isFF = is(a.toLowerCase(),"firefox");
	this.isCR = is(a.toLowerCase(),"chrome");
	this.isSF = is(a.toLowerCase(),"safari");

	if (this.isIE) {
		this.isWin = true; //2010 01 06

		var v = parseFloat(a.match(/MSIE ([0-9\.]+)/)[1]);
		if (isNaN(v)) this.isIE0 = true;
		if (6 <= v && v < 7) {
			this.isIE6 = true;
			return;
		} else if (7 <= v && v < 8) {
			this.isIE7 = true;
			return;
		} else if (5.5 <= v && v < 6) {
			this.isIE55 = true;
			return;
		} else if (v < 5.5) {
			this.isIE5 = true;
			this.isIE = false;
			return;
		} else if (8 <= v) {
			this.isIE8 = true;
			return;
		}		
	}
};

function rex_writeRexCtl(sID) {
	var sWidth = "100%";
	var sHeight = "100%";

	if (arguments.length > 1) sWidth = arguments[1];
	if (arguments.length > 2) sHeight = arguments[2];

	document.write(rex_getRexCtl(sID, sWidth, sHeight));
}

function rex_getRexCtl() {
	var oAgent = new rex_Agent();
	var sCtl = "";

	var sID = "RexCtl";
	var sWidth = "100%";
	var sHeight = "100%";

	if (arguments.length > 0) sID = arguments[0];
	if (arguments.length > 1) sWidth = arguments[1];
	if (arguments.length > 2) sHeight = arguments[2];

	if (  (oAgent.isWin || oAgent.isIE) ) {
		if (oAgent.isIE) {
			var sCodeBase = "CODEBASE='" + rex_gsDownloadURL + "Rexpert30ViewerEXE.cab#version=" + rex_viewer_version + "'";

			if (rex_viewer_install.toUpperCase() == "NONE") sCodeBase = "";

			sCtl += "<object id='" + sID + "' classid='CLSID:FC035099-833E-4AB1-BF48-37D08F5E553C' " + sCodeBase + " width='" + sWidth + "' height='" + sHeight + "'>";
			sCtl += "<iframe id='rex_ifrmRexPreview' name='rex_ifrmRexPreview' src='" + rex_gsSetupURL + "?version=" + rex_viewer_version + "' style='width:100%;height:100%' width='100%' height='100%'></iframe>";
			sCtl += "</object>";
		} else {
			var pluginmime = "application/rexpert3.0.plugin,version=" + rex_viewer_version;

			var aVer = rex_viewer_version.split(",");

			var iVer = parseInt(aVer[0]) * 10000 + parseInt(aVer[1]) * 1000 + parseInt(aVer[2]) * 1000 + parseInt(aVer[3]) * 1;

			if (iVer < 10136)
			{
				pluginmime = "application/rexpert3.0.plugin,version=1.0.0.1";
			}

			if(oAgent.isCR || oAgent.isOP || oAgent.isSF || oAgent.isFF)
			{
				var mimetype = navigator.mimeTypes[pluginmime];
				if (!mimetype) {
					this.window.location.replace(rex_gsSetupURL + "?version=" + rex_viewer_version);
				}
			}

			sCtl += "<object id='" + sID + "' type='" + pluginmime + "' ";
			sCtl += " codebase='" + rex_gsDownloadURL + "rexpert30viewer.exe' ";
			sCtl += " pluginspage='" + rex_gsSetupURL + "?version=" + rex_viewer_version + "' " + " width='" + sWidth + "' height='" + sHeight + "'></object>";
		}

		if (oAgent.isIE || oAgent.isFF) {

			sCtl += "<script type='text/javascript' for='RexCtl' event='FinishDocument'>" + "\r\n";
			sCtl += "	OnFinishDocument();" + "\r\n";
			sCtl += "</script>" + "\r\n";

			sCtl += "<script language='javascript' for='RexCtl' event='FinishPrint'>" + "\r\n";
			sCtl += "	OnFinishPrint();" + "\r\n";
			sCtl += "</script>" + "\r\n";

			sCtl += "<script language='javascript' for='RexCtl' event='FinishExport(FileName)'>" + "\r\n";
			sCtl += "	OnFinishExport(FileName);" + "\r\n";
			sCtl += "</script>" + "\r\n";

			sCtl += "<script language='vbscript' for='RexCtl' event='HyperLinkClicked(Path, Cancel)'>";
			sCtl += "	Cancel = true" + "\r\n";

			sCtl += "	On Error Resume Next" + "\r\n";

			sCtl += "	If Not IsNull(goOOF.event.hyperlinkclicked) Then" + "\r\n";
			sCtl += "		Call goOOF.event.hyperlinkclicked(RexCtl, \"hyperlinkclicked\", MakeHyperLinkClickedArg(Path))" + "\r\n";
			sCtl += "	End If" + "\r\n";

			sCtl += "	Err.Clear" + "\r\n";

			sCtl += "</script>";

			sCtl += "<script language='javascript' for='RexCtl' event='FinishPrintResult(ResultCode)'>" + "\r\n";
			sCtl += "	OnFinishPrintResult(ResultCode);" + "\r\n";
			sCtl += "</script>" + "\r\n";

			//<script language="javascript" for="RexCtl" event="ButtonCloseWindowClickAfter()">
			//	confirm("do you want close window ?");
			//	self.window.close();
			//	top.window.opener = top;
			//	top.window.open('','_parent','');
			//	top.window.close();
			//</script>
		}
	} else {
		sCtl += "<iframe id='rex_ifrmRexPreview' name='rex_ifrmRexPreview' src='about:blank' width='99%' height='99%' scrolling='no'></iframe>";
	}

	return sCtl;
}

//********************************************************
//LocationHost() class declaration
//********************************************************
function rex_fnLocationHost()
{
	var str = "" + document.location;
	var header = "http://";
	var header_length = header.length;
	var pos = str.indexOf( "/" , header_length );
	var str_server	= str.substring( 0, pos );

	return str_server;
}

//********************************************************
//param class declaration
//********************************************************

var rex_goParamSet = {};

// 2010-07-22
var rex_gaReports = new Array();
var rex_gaReportsIndex = 0;

function GetfnParamSet() {
	if (arguments.length > 0)
	{
		return GetParamSet(arguments[0]);
	} else {
		return GetParamSet();
	}
}

function GetParamSet() {
	if (arguments.length > 0) {
		rex_goParamSet[arguments[0]] = new rex_ParamSet(arguments[0]);
		rex_goParamSet[arguments[0]].datatype = "CSV";
		return rex_goParamSet[arguments[0]];
	}
	else {
		rex_goParamSet["0"] = new rex_ParamSet("0");
		return rex_goParamSet["0"];
	}
}

function rex_ParamSet(id) {
	this.id = id;
	this.type;	//http, file, memo, ado(not used)
	this.opentype;
	this.rptname;

	this.exportservice = {};
	this.exportservice.param = {};

	this.exportservice.filename = null;
	this.exportservice.filetype = "pdf";

	this.datatype;

	this.rebfiles = {};
	this.subreports = {};
	this.params = {};
	this.httpparams = {};
	this.datasets = {};

	this.printoption;

	this.event = {};

	this.plugin = {};
	this.plugin.param = {};

	this.plugin.web = {};
	this.plugin.web.param = {};

	// 2010-07-22
	this.printinfo = {};
	this.saveinfo = {};

	// 2010-09-07
	this.title = "";

	this.win = null;

	rex_ParamSet.prototype.pushclear = function() {
		rex_gaReports = new Array();
		rex_gaReportsIndex = 0;
	};

	rex_ParamSet.prototype.push = function(oReport) {
		rex_gaReports.push(oReport);
	};

	rex_ParamSet.prototype.reb = function(id) {
		if (this.rebfiles[id] == undefined) {
			this.rebfiles[id] = new rex_RebFile(id);
		}

		return this.rebfiles[id];
	};
	
	rex_ParamSet.prototype.param  = function(id) {
		if (this.params[id] == undefined) {
			this.params[id] =  {};
		}

		return this.params[id];
	};
	
	rex_ParamSet.prototype.httpparam  = function(id) {
		if (this.httpparams[id] == undefined) {
			this.httpparams[id] =  {};
		}

		return this.httpparams[id];
	};

	rex_ParamSet.prototype.sub  = function(id) {
		if (this.subreports[id] == undefined) {
			this.subreports[id] = new rex_RebSubReport(id);
		}
	
		return this.subreports[id];
	};

	rex_ParamSet.prototype.con  = function(id) {
		if (this.subreports[id] == undefined) {
			this.subreports[id] = new rex_RebSubReport(id);
		}

		return this.subreports[id];
	};

	rex_ParamSet.prototype.dataset = function(id) {
		if (this.datasets[id] == undefined) {
			this.datasets[id] = {};
		}
		
		return this.datasets[id];
	};

	rex_ParamSet.prototype.toString = function() {
		var sb = "";

		var con = new rex_RebConnction();
		var oParam = {};

		var rebfile = new rex_RebFile();

		sb += "<?xml version='1.0' encoding='utf-8'?>";
		sb += "<oof version ='3.0'>";

		if (this.title != "")
		{
			sb += "<document title='" + this.title + "' enable-thread='0'>";
		} else {
			sb += "<document title='report' enable-thread='0'>";
		}

		//sb += "<document enable-thread='1'>";

		//sb += "<document>";
	
		if (this.type == undefined) this.type = "http";

		sb += "<file-list>";

		if(this.rptname != undefined)
		{
			sb += rebfile.toStringFile(this.rptname, "", "", "") + "";

			if (this.exportservice.filename == null) {
				this.exportservice.filename = this.rptname.substr(this.rptname.lastIndexOf("/") + 1);
			}
		}

		var sConnMain = "";
		var sConnSub = "";
		var sConn = "";

		for(var nkey in this.rebfiles)
		{
			sConn = "";
			
			for(var key in this.rebfiles[nkey].subreports)
			{
								
				if(key != undefined)
				{
					if(this.rebfiles[nkey].sub(key).namespace == undefined )
					{
						oParam["namespace"] = key;
					} else {
						oParam["namespace"] = this.rebfiles[nkey].sub(key).namespace;
					}

					oParam["type"] = this.rebfiles[nkey].sub(key).type;
					oParam["path"] = this.rebfiles[nkey].sub(key).path;
					oParam["data"] = this.rebfiles[nkey].sub(key).data;
					oParam["connectname"] = this.rebfiles[nkey].sub(key).connectname;
					oParam["datatype"] = this.rebfiles[nkey].sub(key).datatype;
					oParam["xpath"] = this.rebfiles[nkey].sub(key).xpath;
					oParam["encoding"] = this.rebfiles[nkey].sub(key).encoding;

					con = new rex_RebConnction();
					sConn += con.toString(oParam, this.rebfiles[nkey].sub(key).httpparams, this.rebfiles[nkey].sub(key).datasets);
				}
			}
			
			if (sConn == "") {

				// 2011-06-10
				if (this.type != "ado")
				{
				//if (this.rebfiles[nkey].connectname != undefined) {
					if (this.rebfiles[nkey].connectname != undefined && this.rebfiles[nkey].type != undefined) {
						oParam["type"] = this.rebfiles[nkey].type;
						oParam["namespace"] = this.rebfiles[nkey].namespace;
						oParam["path"] = this.rebfiles[nkey].path;
						oParam["data"] = this.rebfiles[nkey].data;
						oParam["connectname"] = this.rebfiles[nkey].connectname;
						oParam["datatype"] = this.rebfiles[nkey].datatype;
						oParam["xpath"] = this.rebfiles[nkey].xpath;
						oParam["encoding"] = this.rebfiles[nkey].encoding;

						con = new rex_RebConnction();
						sConn += con.toString(oParam, this.rebfiles[nkey].httpparams, this.rebfiles[nkey].datasets);
					}
				//}
				}

			}

			if (sConn != "") { 
				sConn = "<connection-list>" + sConn + "</connection-list>";
			}

			//alert(this.rebfiles[nkey].subreports["ADO2"]);
			if(this.rebfiles[nkey].rptname != undefined)
			{
				rebfile = new rex_RebFile();
				sb += rebfile.toStringFile(this.rebfiles[nkey].rptname, rebfile.toStringField(this.rebfiles[nkey].params), sConn, rebfile.toStringConfigParam(this.rebfiles[nkey].configparams)) + "";

				if (this.exportservice.filename == null) {
					this.exportservice.filename = this.rebfiles[nkey].rptname.substr(this.rebfiles[nkey].rptname.lastIndexOf("/") + 1);
				}
			}
		} // end for

		sb += "</file-list>";

		sConnMain = "";
		sConnSub = "";

		sConnMain += "<connection-list>";

		for(var nkey in this.subreports)
		{			
			if(this.subreports[nkey].namespace == undefined )
			{
				oParam["namespace"] = nkey;
			} else {
				oParam["namespace"] = this.subreports[nkey].namespace;
			}

			oParam["type"] = this.subreports[nkey].type;
			oParam["path"] = this.subreports[nkey].path;
			oParam["data"] = this.subreports[nkey].data;
			oParam["connectname"] = this.subreports[nkey].connectname;
			oParam["datatype"] = this.subreports[nkey].datatype;
			oParam["xpath"] = this.subreports[nkey].xpath;
			oParam["encoding"] = this.subreports[nkey].encoding;

			con = new rex_RebConnction();
			sConnSub += con.toString(oParam, this.subreports[nkey].httpparams, this.subreports[nkey].datasets);
		}

		if (sConnSub == "") {
			oParam["type"] = this.type;  // http, file, memo
			oParam["namespace"] = this.namespace;
			oParam["path"] = this.path;
			oParam["data"] = this.data;
			oParam["connectname"] = this.connectname;
			oParam["datatype"] = this.datatype;
			oParam["xpath"] = this.xpath;
			oParam["encoding"] = this.encoding;
	
			sConnMain += con.toString(oParam, this.httpparams, this.datasets);
		} else {
			sConnMain += sConnSub;
		}

		sConnMain += "</connection-list>";

		if (sConn == "") {
			// 2011-06-10
			if (this.type != "ado")
			{
				sb += sConnMain;
			}
		}

		sb += rebfile.toStringField(this.params);

		sb += "<plugin-list>";

		if (this.plugin.type != undefined) {
			sb += "	<plugin type='" + this.plugin.type + "'>";
			sb += "		 <config-param-list>";

			for(var nkey in rex_gsPluginParam)
			{
				sb += "	<config-param name='" + nkey + "'>" + rex_gsPluginParam[nkey] + "</config-param>";
			}

			/*
			for(var nkey in this.plugin.param)
			{
				sb += "	<config-param name='" + nkey + "'>" + this.plugin.param[nkey] + "</config-param>";
			}
			*/

			sb += "		 </config-param-list>";
			sb += "	</plugin>";	
		}

		if (rex_gsPluginTypeWeb != undefined) {
			sb += "	<plugin type='" + rex_gsPluginTypeWeb + "'>";
			sb += "		 <config-param-list>";

			for(var nkey in rex_gsPluginWebParam)
			{
				sb += "	<config-param name='" + nkey + "'>" + rex_gsPluginWebParam[nkey] + "</config-param>";
			}

			/*
			for(var nkey in this.plugin.web.type)
			{
				sb += "	<config-param name='" + nkey + "'>" + this.plugin.web.param[nkey] + "</config-param>";
			}
			*/

			sb += "		 </config-param-list>";
			sb += "	</plugin>";
		}

		if (rex_gsPluginFileType != undefined) {
			sb += "	<plugin type='" + rex_gsPluginFileType + "'>";
			sb += "		 <config-param-list>";

			for(var nkey in rex_gsPluginFileParam)
			{
				sb += "	<config-param name='" + nkey + "'>" + rex_gsPluginFileParam[nkey] + "</config-param>";
			}

			sb += "		 </config-param-list>";
			sb += "	</plugin>";
		}

		sb += "</plugin-list>";

		sb += "</document>";
		sb += "</oof>";

		return sb;
	};
} // end of rex_fnParamSet

function rex_RebFile() {
	this.id = arguments[0];
	this.subreports = {};
	this.params = {};
	this.httpparams = {};
	this.configparams = {};

	rex_RebFile.prototype.sub = function(id) {
		if (this.subreports[id] == undefined) {
			this.subreports[id] = new rex_RebSubReport(id);
		}

		return this.subreports[id];
	};

	rex_RebFile.prototype.con  = function(id) {
		if (this.subreports[id] == undefined) {
			this.subreports[id] = new rex_RebSubReport(id);
		}

		return this.subreports[id];
	};
	
	rex_RebFile.prototype.param = function(id) {
		if (this.params[id] == undefined) {
			this.params[id] = {};
		}
		
		return this.params[id];
	};

	rex_RebFile.prototype.httpparam  = function(id) {
		if (this.httpparams[id] == undefined) {
			this.httpparams[id] =  {};
		}

		return this.httpparams[id];
	};

	rex_RebFile.prototype.configparam = function(id) {
		if (this.configparams[id] == undefined) {
			this.configparams[id] = {};
		}
		
		return this.configparams[id];
	};
	
	rex_RebFile.prototype.toStringFile = function(rptname, param, connect, configparam) {
		var sb = "";

		if (rptname.length > 7) {
			if (rptname.substring( 0, 7 ) != "http://" && rptname.substring( 0, 8 ) != "https://") { 
				rptname = rex_gsReportURL + rptname + ".reb";
			}
		} else {
			rptname = rex_gsReportURL + rptname + ".reb";
		}

		sb += "<file type='reb' path='" + rptname + "'>";
		sb += param;
		sb += connect;
		sb += configparam;
		sb += "</file>";

		return sb;
	};

	rex_RebFile.prototype.toStringField = function(param) {
		var sb = "";

		sb += "<field-list>";
		for ( var key in param) {
			if (param[key].isnull != undefined) {
				sb += "<field name='" + key + "' isnull='1'><![CDATA[" + param[key].value + "]]></field>";
			} else {
				sb += "<field name='" + key + "'><![CDATA[" + param[key].value + "]]></field>";
			}
		}
		sb += "</field-list>";

		return sb;
	};

	rex_RebFile.prototype.toStringConfigParam = function(configparam) {
		var sb = "";

		sb += "<config-param-list>";
		for ( var key in configparam) {
			sb += "<config-param name='" + key + "'><![CDATA[" + configparam[key].value + "]]></config-param>";
		}
		sb += "</config-param-list>";

		return sb;
	};
} // end of rex_RebFile

function rex_RebSubReport() {
	this.id = arguments[0];
	this.params = {};
	this.httpparams = {};
	this.datasets = {}

	rex_RebSubReport.prototype.param = function(id) {
		if (this.params[id] == undefined) {
			this.params[id] = {};
		}

		return this.params[id];
	};

	rex_RebSubReport.prototype.httpparam  = function(id) {
		if (this.httpparams[id] == undefined) {
			this.httpparams[id] = {};
		}

		return this.httpparams[id];
	};

	rex_RebSubReport.prototype.dataset = function(id) {
		if (this.datasets[id] == undefined) {
			this.datasets[id] = {};
		}

		return this.datasets[id];
	};
} // end of rex_RebSubReport

function rex_RebConnction() {
	rex_RebConnction.prototype.toString = function(oParam, oHttpParams, oDataSets) {		
		var sb = "";

		var type = oParam["type"];
		var namespace = oParam["namespace"];
		var path = oParam["path"];
		var isExistPath = false;
		var data = oParam["data"];
		var connectname = oParam["connectname"];
		var datatype = oParam["datatype"];
		var encoding = oParam["encoding"];
		var xpath = oParam["xpath"];

		if (type == undefined) type = "http";
		if (namespace == undefined) namespace = "*";

		if (path == undefined) {
			isExistPath = false;
			
			if (rex_gsServerVersion == "2.5") {
				path = rex_gsRptServiceURL_RexServer25;
			} else {
				path = rex_gsRptServiceURL;
			}
		} else {
			isExistPath = true;
		}

		if (data == undefined) data = "";
		
		if (connectname == undefined) {
			if (rex_gsServerVersion == "2.5") {
				connectname = "";
			} else {
				connectname = rex_gsUserService;
			}
		}

		if (datatype == undefined) datatype = "CSV";

		if (encoding == undefined) {
			
			if (rex_gsServerVersion == "2.5") {
				encoding = rex_gsCsvEncoding_RexServer25;
			} else {
				encoding = rex_gsCsvEncoding;
			}
		}

		if (xpath == undefined) {
			if (rex_gsServerVersion == "2.5") {
				//xpath = rex_gsXPath_RexServer25;
				
				if (type == "http") {
					if (!isExistPath) xpath = rex_gsXPath_RexServer25;
		 		} else {
		 			xpath = "{%dataset.xml.root%}";
		 		}
			} else {
				if (type == "http") {
					if (!isExistPath) xpath = rex_gsXPath;
		 		} else {
		 			xpath = "{%dataset.xml.root%}";
		 		}
		 	}
		 }

		sb += "<connection type='" + type + "' namespace='" + namespace + "'>";

		var sHttpParams = "";

		if(oHttpParams != undefined )
		{
			for(var key in oHttpParams)
			{	
				if (typeof(oHttpParams[key].value) == "object") {
					for(var i = 0; i < oHttpParams[key].value.length; i++) {
						sHttpParams += "<http-param name='" + key + "'><![CDATA[" + oHttpParams[key].value[i] + "]]></http-param>";
					}
				} else {
					sHttpParams += "<http-param name='" + key + "'><![CDATA[" + oHttpParams[key].value + "]]></http-param>";
					//sHttpParams += "<http-param name='" + key + "'>" + oHttpParams[key].value + "</http-param>";
				}
			}
		}

		if (type == "http") {

			/* 2011-06-10
			if (sHttpParams != "") {
				sHttpParams = "<http-param-list>" + sHttpParams + "</http-param-list>";
			} else 
			*/

			if (isExistPath == false) {
				if (rex_gsServerVersion == "2.5") {

					// 2011-06-10
					//sHttpParams += "<http-param-list>";

					var sHttpParamsAdd = sHttpParams;
					sHttpParams = ""
					sHttpParams += "<http-param-list>";
					sHttpParams += sHttpParamsAdd;

					sHttpParams += "<http-param name='designtype'>run</http-param>";
					sHttpParams += "<http-param name='datatype'>" + datatype.toUpperCase() + "</http-param>";
					sHttpParams += "<http-param name='sql'>{%auto%}</http-param>";
					sHttpParams += "<http-param name='xmldata'>{%dataset.ado.sql.xml.prepared%}</http-param>";
					sHttpParams += "<http-param name='split'></http-param>";
					sHttpParams += "<http-param name='userservice'>" + connectname + "</http-param>";
					sHttpParams += "<http-param name='image'></http-param>";
					sHttpParams += "<http-param name='rex_param_sql'></http-param>";

					sHttpParams += "<http-param name='presql'>{%dataset.ado.pre.sql%}</http-param>";
					sHttpParams += "<http-param name='postsql'>{%dataset.ado.post.sql%}</http-param>";

					if (rex_gsPluginTypeWeb != undefined) {		
						sHttpParams += "<http-param name='pSessionKey'>internal</http-param>";
					}

					sHttpParams += "</http-param-list>";

				} else {
					// 2011-06-10
					//sHttpParams += "<http-param-list>";

					var sHttpParamsAdd = sHttpParams;
					sHttpParams = ""
					sHttpParams += "<http-param-list>";
					sHttpParams += sHttpParamsAdd;

					sHttpParams += "<http-param name='Q1SQL'>{%auto%}</http-param>";
					//sHttpParams += "<http-param name='xmldata'>{%dataset.ado.sql.xml.prepared%}</http-param>";
					sHttpParams += "<http-param name='OE'>None</http-param>";
					sHttpParams += "<http-param name='CN'>" + connectname + "</http-param>";
					sHttpParams += "<http-param name='ID'>SD" + datatype.toUpperCase() + "</http-param>";

					if (rex_gsPluginTypeWeb != undefined) {	
						if (rex_gsPluginTypeWeb == "crypto.clipsoft")
						{
							sHttpParams += "<http-param name='pSessionKey'>internal</http-param>";
						}

						// not used!!
						sHttpParams += "<http-param name='PE'>TRUE</http-param>";
					} else {
						// not used!!
						sHttpParams += "<http-param name='PE'>FALSE</http-param>";
					}

					sHttpParams += "<http-param name='QC'>1</http-param>";
					sHttpParams += "<http-param name='OT'>DataOnly</http-param>";
					sHttpParams += "<http-param name='Q1Type'>SQL</http-param>";

					sHttpParams += "</http-param-list>";
				}
			} else {
				if (sHttpParams != "") {
					sHttpParams = "<http-param-list>" + sHttpParams + "</http-param-list>";
				}
			}

			sb += "<config-param-list>";
			sb += "<config-param name='path'>" + path + "</config-param>";
			sb += "<config-param name='cookie'><![CDATA[" +  document.cookie + "]]></config-param>";
			//sb += "<config-param name='temppath'>c:\\</config-param>";
			//sb += "<config-param name='tempfile'>csv.data</config-param>";

			if (rex_gsHttpTimeout != undefined) {
				for(var nkey in rex_gsHttpTimeout)
				{
					sb += "	<config-param name='" + nkey + "'>" + rex_gsHttpTimeout[nkey] + "</config-param>";
				}
			}

			sb += "</config-param-list>";
			sb += sHttpParams;
		} else if (type == "file") {
			sb += "<config-param-list>";
			sb += "<config-param name='connection.once'>1</config-param>";
			sb += "<config-param name='path'>" + path + "</config-param>";
			sb += "</config-param-list>";

			if (sHttpParams != "") {
				sb += sHttpParams;
			}
		} else if (type == "memo") {
			sb += "<config-param-list>";

			if (datatype.toUpperCase() == "CSV") {
				sb += "<config-param name='data'><![CDATA[" + data + "]]></config-param>";
			} else {
				sb += "<config-param name='data'>" + data + "</config-param>";
			}

			sb += "</config-param-list>";
		}

		if (datatype.toUpperCase() == "CSV") {
			if (rex_gsServerVersion == "2.5") {
				sb += "<content content-type='csv'>";

				if (type == "memo") {
					sb += "<content-param name='col-delim'>" + rex_gsCsvSeparatorColumn + "</content-param>";
					sb += "<content-param name='row-delim'>" + rex_gsCsvSeparatorRow + "</content-param>";
					sb += "<content-param name='dataset-delim'>" + rex_gsCsvSeparatorDataSet_RexServer25 + "</content-param>";
					sb += "<content-param name='dataset-index'>{%dataset.index%}</content-param>";

					encoding = "utf16le";
				} else {
					sb += "<content-param name='col-delim'>" + rex_gsCsvSeparatorColumn_RexServer25 + "</content-param>";
					sb += "<content-param name='row-delim'>" + rex_gsCsvSeparatorRow_RexServer25 + "</content-param>";
					sb += "<content-param name='dataset-delim'>" + rex_gsCsvSeparatorDataSet_RexServer25 + "</content-param>";
					//sb += "<content-param name='dataset-index'>{%dataset.index%}</content-param>";
				}

				sb += "<content-param name='encoding'>" + encoding + "</content-param>";
				sb += "</content>";
			} else {
				sb += "<content content-type='csv'>";
				sb += "<content-param name='col-delim'>" + rex_gsCsvSeparatorColumn + "</content-param>";
				sb += "<content-param name='row-delim'>" + rex_gsCsvSeparatorRow + "</content-param>";
				sb += "<content-param name='dataset-delim'>" + rex_gsCsvSeparatorDataSet + "</content-param>";

				if (type == "memo") {
					encoding = "utf16le";
					sb += "<content-param name='dataset-index'>{%dataset.index%}</content-param>";
				}

				sb += "<content-param name='encoding'>" + encoding + "</content-param>";
				sb += "</content>";
			}
		} else {
			var sDataSets = "";

			if(oDataSets != undefined )
			{
				for(var key in oDataSets)
				{
					sDataSets += "<content content-type='xml' namespace='" + key + "'>";
					sDataSets += "<content-param name='root'>" + oDataSets[key].xpath + "</content-param>";
					sDataSets += "<content-param name='preservedwhitespace'>1</content-param>";
					sDataSets += "<content-param name='bindmode'>name</content-param>";
					sDataSets += "</content>";
				}
			}

			if (sDataSets == "") {
				sDataSets += "<content content-type='xml'>";
				sDataSets += "<content-param name='root'>" + xpath + "</content-param>";
				sDataSets += "<content-param name='preservedwhitespace'>1</content-param>";
				sDataSets += "<content-param name='bindmode'>name</content-param>";
				sDataSets += "</content>";
			}

			sb += sDataSets;
		}

		sb += "</connection>";

		// 2011-06-10
		if (type == "ado") {
			sb = "";
		}

		return sb;
	};
} // end of rex_RebConnction

rex_ParamSet.prototype.open = function() {
	this.opentype = "open";

	//var oAgent = new rex_Agent();

	//if (oAgent.isWin) {
		this.win = window.open(rex_gsPreViewURL + "?id=" + this.id, "", rex_gsPreViewFeatures);
		
	//} else {
		// Mac, Unix(Linux)
	//	alert("Mac or Linux : PDF");
	//}
};

rex_ParamSet.prototype.iframe = function(oIframe) {
	this.opentype = "iframe";

	var oAgent = new rex_Agent();

	if (oAgent.isIE) {
		if (typeof(oIframe) ==  "object") {
			//oIframe.location.href = rex_gsPreViewURL + "?id=" + this.id;
			document.getElementById(oIframe.name).src = rex_gsPreViewURL + "?id=" + this.id;
		} else {
			document.getElementById(oIframe).src = rex_gsPreViewURL + "?id=" + this.id;
		}
	} else {
		if (typeof(oIframe) ==  "object") {
			document.getElementById(oIframe.name).contentWindow.location.href = rex_gsPreViewURL + "?id=" + this.id;
		} else {
			document.getElementById(oIframe).contentWindow.location.href = rex_gsPreViewURL + "?id=" + this.id;
		}
	}
};

rex_ParamSet.prototype.embed = function(sRexCtl) {
	this.opentype = "embed";

	var oAgent = new rex_Agent();

	var oOOF;
	var oRexCtl;

	oRexCtl = document.getElementById(sRexCtl);

	oOOF = rex_goParamSet[this.id];

	if (oAgent.isWin) {
		var printoption = oOOF.printoption;
		var exportoption = oOOF.exportoption;
		var toolbarbuttonoption = oOOF.toolbarbuttonoption;

		if(printoption != null) {
			rex_fnPrintSetting(oRexCtl,printoption);
		} 

		if(exportoption != null) {
			rex_fnExportVisible(oRexCtl, exportoption);
		}

		if(toolbarbuttonoption != null) {
			rex_fnToolBarButtonEnableTrue(oRexCtl,toolbarbuttonoption);
		}

		try {
			var sVer = oRexCtl.GetVersion();
		} catch(ex) {
			// activex not install !!
			return;
		}

		if (oOOF.event.init != undefined) {
			oOOF.event.init(oRexCtl, "init", null);
		}

		oRexCtl.CloseAll();
		oRexCtl.OpenOOF(oOOF.toString());
	} else {
		// Mac, Linux, Others
		document.getElementById("rex_ifrmRexPreview").contentWindow.location.href = rex_gsPreViewURL + "?id=" + this.id;

		/*
		frmExportService.action = rex_gsRptExportServiceURL;
		frmExportService.oof.value = oOOF.toString();
		frmExportService.filename.value = oOOF.export.filename;
		frmExportService.filetype.value = oOOF.export.filetype;	
		frmExportService.submit();
		*/
	}
};

rex_ParamSet.prototype.openmodal = function() {
	this.opentype = "openmodal";

	window.showModalDialog(rex_gsPreViewURL + "?id=" + this.id, window, rex_gsPreViewFeaturesModal);
};

rex_ParamSet.prototype.print = function() {
	this.opentype = "print";

	if (arguments.length > 0)
	{
		this.print = {};
		this.print.dialog = arguments[0];
		this.print.startpage = arguments[1];
		this.print.endpage = arguments[2];
		this.print.copycount = arguments[3];
		this.print.Option = ""; //arguments[4];
		this.printoption = arguments[4];
	} else {
		this.print = {};
		this.print.dialog = this.printinfo.dialog;
		this.print.startpage = this.printinfo.startpage;
		this.print.endpage = this.printinfo.endpage;
		this.print.copycount = this.printinfo.copycount;
		this.print.Option = ""; //this.printinfo.Option;
		this.printoption = this.printinfo.Option;
	}

	var oAgent = new rex_Agent();

	if (oAgent.isIE) {
		if (document.getElementById("rex_ifrmRexPreview") == null) {
			var sHTML = "<iframe id='rex_ifrmRexPreview' src='" + rex_gsPreViewURL + "?id=" + this.id + "' width='5' height='5'></iframe>";
			document.body.insertAdjacentHTML("beforeEnd", sHTML);
		} else {
			document.getElementById("rex_ifrmRexPreview").src = rex_gsPreViewURL + "?id=" + this.id;
		}

	} else {
		if (document.getElementById("rex_ifrmRexPreview") == null) {
			var sHTML = "<iframe id='rex_ifrmRexPreview' name='rex_ifrmRexPreview' src='" + rex_gsPreViewURL + "?id=" + this.id + "' width='5' height='5'></iframe>";

			//document.body.innerHTML += sHTML;
			document.body.insertAdjacentHTML("beforeEnd", sHTML);
		} else {
			document.getElementById("rex_ifrmRexPreview").contentWindow.location.href = rex_gsPreViewURL + "?id=" + this.id;
		}
	}
};

// 2010-07-22
rex_ParamSet.prototype.printall = function() {
	for (var i = 0; i < rex_gaReports.length; i++)
	{
		rex_gaReports[i].opentype = "print";

		if (arguments.length > 0)
		{
			rex_gaReports[i].printinfo = {};
			rex_gaReports[i].printinfo.dialog = arguments[0];
			rex_gaReports[i].printinfo.startpage = arguments[1];
			rex_gaReports[i].printinfo.endpage = arguments[2];
			rex_gaReports[i].printinfo.copycount = arguments[3];
			rex_gaReports[i].printinfo.Option = arguments[4];
		}

		if (this.event.beforeprintalleach != undefined) {
			rex_gaReports[i].event.beforeprintalleach = this.event.beforeprintalleach;
		}

		if (this.event.init != undefined) {
			rex_gaReports[i].event.init = this.event.init;
		}

		if (this.event.finishdocument != undefined) {
			rex_gaReports[i].event.finishdocument = this.event.finishdocument;
		}

		if (this.event.finishprintalleach != undefined) {
			rex_gaReports[i].event.finishprintalleach = this.event.finishprintalleach;
		}

		if (this.event.finishprintall != undefined) {
			rex_gaReports[i].event.finishprintall = this.event.finishprintall;
		}
	}

	rex_PrintAllEvent("", "", "");
};

function rex_PrintAllEvent(oRexCtl, sEvent, oArgs) {
	var oReport;

	if (rex_gaReportsIndex > 0)
	{
		oReport = rex_gaReports[rex_gaReportsIndex - 1];

		if (oReport.event.finishprintalleach != undefined) {
			oReport.event.finishprintalleach(oRexCtl, "finishprintalleach", {"report": oReport});
		}
	}

	if(rex_gaReports.length > 0 && rex_gaReports.length > rex_gaReportsIndex)
	{
		oReport = rex_gaReports[rex_gaReportsIndex];

		if (oReport.event.beforeprintalleach != undefined) {
			var oTmpReport = oReport.event.beforeprintalleach(oRexCtl, "beforeprintalleach", {"report": oReport});

			if (oTmpReport != null)
			{
				oReport = oTmpReport;
			}
		}

		oReport.event.finishprint = rex_PrintAllEvent;

		oReport.print();

		rex_gaReportsIndex++;

	} else {

		oReport = rex_gaReports[rex_gaReportsIndex - 1];

		if (oReport.event.finishprintall != undefined) {
			oReport.event.finishprintall(oRexCtl, "finishprintall", {"reports": rex_gaReports});
		}

		rex_gaReports = new Array();
		rex_gaReportsIndex = 0;
	}
}

rex_ParamSet.prototype.printdirect = function() {
	this.opentype = "printdirect";

	if (arguments.length > 0)
	{
		this.print = {};
		this.print.printname = arguments[0];
		this.print.trayid = arguments[1];
		this.print.startpage = arguments[2];
		this.print.endpage = arguments[3];
		this.print.copycount = arguments[4];
		this.print.Option = ""; //arguments[5];
		this.printoption = arguments[5];
	} else {
		this.print = {};
		this.print.printname = this.printinfo.printname;
		this.print.trayid = this.printinfo.trayid;
		this.print.startpage = this.printinfo.startpage;
		this.print.endpage = this.printinfo.endpage;
		this.print.copycount = this.printinfo.copycount;
		this.print.Option = ""; //this.printinfo.Option;
		this.printoption = this.printinfo.Option;
	}

	var oAgent = new rex_Agent();

	if (oAgent.isIE) {
		if (document.getElementById("rex_ifrmRexPreview") == null) {
			var sHTML = "<iframe id='rex_ifrmRexPreview' src='" + rex_gsPreViewURL + "?id=" + this.id + "' width='5' height='5'></iframe>";

			document.body.insertAdjacentHTML("beforeEnd", sHTML);
		} else {
			document.getElementById("rex_ifrmRexPreview").src = rex_gsPreViewURL + "?id=" + this.id;
		}

	} else {
		if (document.getElementById("rex_ifrmRexPreview") == null) {
			var sHTML = "<iframe id='rex_ifrmRexPreview' src='" + rex_gsPreViewURL + "?id=" + this.id + "' width='5' height='5'></iframe>";

			document.body.insertAdjacentHTML("beforeEnd", sHTML);
			//document.body.innerHTML += sHTML;
		} else {
			document.getElementById("rex_ifrmRexPreview").contentWindow.location.href = rex_gsPreViewURL + "?id=" + this.id;
		}
	}
};

// 2010-07-22
rex_ParamSet.prototype.printdirectall = function() {
	//rex_gaReports.reverse();

	for (var i = 0; i < rex_gaReports.length; i++)
	{
		rex_gaReports[i].opentype = "printdirect";

		if (arguments.length > 0)
		{
			rex_gaReports[i].printinfo = {};
			rex_gaReports[i].printinfo.printname = arguments[0];
			rex_gaReports[i].printinfo.trayid = arguments[1];
			rex_gaReports[i].printinfo.startpage = arguments[2];
			rex_gaReports[i].printinfo.endpage = arguments[3];
			rex_gaReports[i].printinfo.copycount = arguments[4];
			rex_gaReports[i].printinfo.Option = arguments[5];
		}

		if (this.event.finishprintdirectalleach != undefined) {
			rex_gaReports[i].event.finishprintdirectalleach = this.event.finishprintdirectalleach;
		}

		if (this.event.finishprintdirectall != undefined) {
			rex_gaReports[i].event.finishprintdirectall = this.event.finishprintdirectall;
		}
	}

	rex_PrintDirectAllEvent("", "", "");
};

function rex_PrintDirectAllEvent(oRexCtl, sEvent, oArgs) {
	var oReport;

	if (rex_gaReportsIndex > 0)
	{
		oReport = rex_gaReports[rex_gaReportsIndex - 1];

		if (oReport.event.finishprintdirectalleach != undefined) {
			oReport.event.finishprintdirectalleach(oRexCtl, "finishprintdirectalleach", {"report": oReport});
		}
	}

	if(rex_gaReports.length > 0 && rex_gaReports.length > rex_gaReportsIndex)
	{
		oReport = rex_gaReports[rex_gaReportsIndex];

		oReport.event.finishprint = rex_PrintDirectAllEvent;
		oReport.printdirect();

		rex_gaReportsIndex++;
	} else {
		oReport = rex_gaReports[rex_gaReportsIndex - 1];

		if (oReport.event.finishprintdirectall != undefined) {
			oReport.event.finishprintdirectall(oRexCtl, "finishprintdirectall", {"reports": rex_gaReports});
		}

		rex_gaReports = new Array();
		rex_gaReportsIndex = 0;
	}
}

rex_ParamSet.prototype.save = function() {
	this.opentype = "save";

	if (arguments.length > 0)
	{
		this.save = {};
		this.save.dialog = arguments[0];
		this.save.filetype = arguments[1];
		this.save.fileName = arguments[2];
		this.save.startpage = arguments[3];
		this.save.endpage = arguments[4];
		this.save.Option = arguments[5];
	} else {
		this.save = {};
		this.save.dialog = this.saveinfo.dialog;
		this.save.filetype = this.saveinfo.filetype;
		this.save.fileName = this.saveinfo.fileName;
		this.save.startpage = this.saveinfo.startpage;
		this.save.endpage = this.saveinfo.endpage;
		this.save.Option = this.saveinfo.Option;
	}

	var oAgent = new rex_Agent();

	if (oAgent.isIE) {
		if (document.getElementById("rex_ifrmRexPreview") == null) {
			var sHTML = "<iframe id='rex_ifrmRexPreview' src='" + rex_gsPreViewURL + "?id=" + this.id + "' width='5' height='5'></iframe>";
			document.body.insertAdjacentHTML("beforeEnd", sHTML);
		} else {
			document.getElementById("rex_ifrmRexPreview").src = rex_gsPreViewURL + "?id=" + this.id;
		}

	} else {
		//window.open(rex_gsPreViewURL + "?id=" + this.id, "", "center=yes,scrollbars=no,status=no,toolbar=no,resizable=0,location=no,menu=no, left=1000, top=1000, width=10,height=10");

		if (document.getElementById("rex_ifrmRexPreview") == null) {
			var sHTML = "<iframe id='rex_ifrmRexPreview' src='" + rex_gsPreViewURL + "?id=" + this.id + "' width='5' height='5'></iframe>";
			document.body.insertAdjacentHTML("beforeEnd", sHTML);
			//document.body.innerHTML += sHTML;
		} else {
			document.getElementById("rex_ifrmRexPreview").contentWindow.location.href = rex_gsPreViewURL + "?id=" + this.id;
		}
	}
};

// 2010-07-22
rex_ParamSet.prototype.saveall = function() {
	for (var i = 0; i < rex_gaReports.length; i++)
	{
		rex_gaReports[i].opentype = "save";

		if (arguments.length > 0)
		{
			rex_gaReports[i].saveinfo = {};
			rex_gaReports[i].saveinfo.dialog = arguments[0];
			rex_gaReports[i].saveinfo.filetype = arguments[1];
			rex_gaReports[i].saveinfo.fileName = arguments[2];
			rex_gaReports[i].saveinfo.startpage = arguments[3];
			rex_gaReports[i].saveinfo.endpage = arguments[4];
			rex_gaReports[i].saveinfo.Option = arguments[5];
		}
	}

	rex_SaveAllEvent("", "", "");
};

function rex_SaveAllEvent(oRexCtl, sEvent, oArgs) {
	var oReport;

	if (rex_gaReportsIndex > 0)
	{
//alert("finishsavealleach");
	}

	if(rex_gaReports.length > 0 && rex_gaReports.length > rex_gaReportsIndex)
	{
		oReport = rex_gaReports[rex_gaReportsIndex];

		oReport.event.finishexport = rex_SaveAllEvent;
		oReport.save();

		rex_gaReportsIndex++;
	} else {
//alert("finishsaveall");
		rex_gaReports = new Array();
		rex_gaReportsIndex = 0;
	}
}

rex_ParamSet.prototype.exportserver = function() {
	this.opentype = "export";

	if (arguments.length > 0) {
		this.exportservice = {};
		this.exportservice.filename = arguments[0];
		this.exportservice.filetype = arguments[1];
		this.exportservice.afterjob = arguments[2];
	}

	var oAgent = new rex_Agent();

	if (oAgent.isIE) {
		if (document.getElementById("rex_ifrmRexPreview") == null) {
			var sHTML = "<iframe id='rex_ifrmRexPreview' src='" + rex_gsPreViewURL + "?id=" + this.id + "' width='5' height='5'></iframe>";
			document.body.insertAdjacentHTML("beforeEnd", sHTML);
		} else {
			document.getElementById("rex_ifrmRexPreview").src = rex_gsPreViewURL + "?id=" + this.id;
		}

	} else {
		window.open(rex_gsPreViewURL + "?id=" + this.id, "", "center=yes,scrollbars=no,status=no,toolbar=no,resizable=0,location=no,menu=no, left=1000, top=1000, width=10,height=10");
	}
};

//********************************************************
//fnPrintSetting class declaration
//********************************************************
function rex_fnPrintSetting(oRexCtl,printoption)
{
		var sb = "";

		var arrprint = printoption.split(";");

		for(var i =0 ; i < arrprint.length; i++)
		{
			oRexCtl.SetCSS("print."+arrprint[i]);
			//sb += "RexCtl.SetCSS(\"print."+arrprint[i]+"\");");
		}
		oRexCtl.UpdateCSS();
		//sb += "RexCtl.UpdateCSS();");
		//return sb;
}

//********************************************************
//fnExportVisible class declaration
//********************************************************
function rex_fnExportVisible(oRexCtl, exportoption)
{
	var sb = "";
	var strexport = exportoption.split(";");
	var arrexport =[]   ;
	for(var i =0; i< strexport.length; i++)
	{
		arrexport[i] = strexport[i];
	}

	for(var i =0 ; i < arrexport.length; i++)
	{
		var lastexport = arrexport[i].split("=");
		//sb += "RexCtl.SetCSS(\"export.appearance."+lastexport[0]+".visible="+lastexport[1]+"\");");
		oRexCtl.SetCSS("export.appearance."+lastexport[0]+".visible="+lastexport[1]);
	 }
	//sb += "RexCtl.UpdateCSS();");
	oRexCtl.UpdateCSS();
	//return sb;
}

function rex_fnToolBarButtonEnableTrue(oRexCtl,toolbarbuttonoption)
{
	var sb = "";
	var strtoolbar = toolbarbuttonoption.split(";");
	var arrtoolbar =[]   ;
	for(var i =0; i< strtoolbar.length; i++)
	{
		arrtoolbar[i] = strtoolbar[i];
	}

	for(var i =0 ; i < arrtoolbar.length; i++)
	{
		var lasttoolbar = arrtoolbar[i].split("=");
		//sb += "RexCtl.SetCSS(\"export.appearance."+lastexport[0]+".visible="+lastexport[1]+"\");");
		oRexCtl.SetCSS("appearance.toolbar.button."+lasttoolbar[0]+".visible="+lasttoolbar[1]);
	 }
	//sb += "RexCtl.UpdateCSS();");
	oRexCtl.UpdateCSS()
}

//--------------- ajax ----------------------
function rex_gfGetAjaxRequest() {
    //if (window.XMLHttpRequest) {
    	// note IE
	//	return new XMLHttpRequest();
    //} else if (Window.ActiveXObject) {
    	// IE
	//	return  new ActiveXObject("Microsoft.XMLHTTP");
		//return new ActiveXObject("Msxml2.XMLHTTP");
    //}

	try {
		obj = new XMLHttpRequest();
	} catch (trymicrosoft) {
		try {
			obj = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (othermicrosoft) {
			try {
				alert("ssss");
				obj = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (failed) {
				obj = null;
			}  
		}
	}

	return obj;
}

function rex_GetgoAjax() {
	return new rex_goAjax();
}

function rex_goAjax() {
	this.Ajax = rex_gfGetAjaxRequest();

	this.SetRequestHeader = rex_goAjax_SetRequestHeader;

	this.AddParameter = rex_goAjax_AddParameter;

	this.Open = rex_goAjax_Open;

	this.Send = rex_goAjax_Send;

	//this.Response = rex_goAjax_Response;

	this.Ajax.onreadystatechange = rex_goAjax_onreadystatechange;

	this.Path = "";

	this.Parameter = "";

	this.Response = rex_goAjax_Response;

	//this.ReturnData = "";

	this.Method = "POST";
	this.isASync = false;

	this.DataType = "XML";

	this.isShowWait = false;

	//this.RequestHeader = new Object();
	// event
}

function rex_goAjax_Open() {
	this.Ajax.open(this.Method, this.Path, this.isASync);
}

function rex_goAjax_SetRequestHeader(sKey, sValue) {
	this.Ajax.setRequestHeader(sKey, sValue);

	//this.Ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	//this.Ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	//this.Ajax.setRequestHeader("Content-Type", "text/xml");
}

function rex_goAjax_AddParameter(sKey, sValue) {

	if (this.Parameter != "") this.Parameter += "&";
	
	//this.Parameter += sKey + "=" + encodeURI(sValue);

	sValue = sValue.replace(/%/g, "%25");

	sValue = sValue.replace(/\+/g, "%2B");

	sValue = sValue.replace(/=/g, "%3D");

	sValue = sValue.replace(/&/g, "%26");


	this.Parameter += sKey + "=" + sValue;
}

function rex_goAjax_Send(sParam) {
	//this.Ajax.send('async=true&org_id='+org_id+'&tbl_id='+tbl_id+'&lvl='+lvl+'&lang='+lang+'&curobjsn='+idx+'&obj_itm_sn='+obj_itm_sn+'&obj_var_id='+obj_var_id[idx]+'&idx='+idx+'&user=NSI&basicitem=&obj_item=13999001');

	if (arguments.length != 0) {
		this.Parameter = arguments[0];
	}

	if (this.isASync == false) {
		if (this.Method == "POST") {
			this.Ajax.send(this.Parameter);
		} else {
			this.Ajax.send("");
		}
		
		return;
	} else {	
		window.showModalDialog("RexProgress.jsp", this, "center:yes;resizable:no;scroll:no;status:no;dialogWidth:400px;dialogHeight:300px");

	} // end if
	
}

function rex_goAjax_onreadystatechange() {
/*
	if ( this.Ajax.readyState==4 )
	{
    	if (this.Ajax.status == 200) 
    	{
    		if (this.DataType == "XML") {
    			//rex_gsAjax_ReturnData = "<?xml " + rex_goAjax.responseXML.firstChild.nodeValue + "?>" + rex_goAjax.responseXML.lastChild.xml;
    			//rex_gsAjax_ReturnData = rex_goAjax.responseText;
    			
    			
    			//this.ReturnData = rex_goAjax.responseXML.xml;
    		} else if (this.DataType == "CSV") {
				//this.ReturnData = rex_goAjax.responseText;
			} else {
				//this.ReturnData = rex_goAjax.responseText;
			}
		} else { // error
			// rex_goAjax.getAllResponseHeaders()
			// rex_goAjax.getResponseHeader ("header name")

			// rex_goAjax.responseText;
			// rex_goAjax.responseXML
			// rex_goAjax.responseBody
			// rex_goAjax.responseStream
			// rex_goAjax.responseXML

			// rex_goAjax.status
			// rex_goAjax.statusText
		} // end if
	} // end if
	*/
}

function rex_goAjax_Response() {
	
	if ( this.Ajax.readyState==4 )
	{
    		if (this.Ajax.status == 200) 
    		{
	    		if (this.DataType == "XML") {
	    			//rex_gsAjax_ReturnData = "<?xml " + rex_goAjax.responseXML.firstChild.nodeValue + "?>" + rex_goAjax.responseXML.lastChild.xml;
	    			//rex_gsAjax_ReturnData = rex_goAjax.responseText;

					//return this.Ajax.responseText;
    				//return this.Ajax.responseXML.xml;
					return this.Ajax.responseXML;
	    		} else if (this.DataType == "CSV") {
				return this.Ajax.responseText;
			} else {
				return this.Ajax.responseText;
			}
		} else { //
			// rex_goAjax.getAllResponseHeaders()
			// rex_goAjax.getResponseHeader ("header name")

			// rex_goAjax.responseText;
			// rex_goAjax.responseXML
			// rex_goAjax.responseBody
			// rex_goAjax.responseStream
			// rex_goAjax.responseXML
			// rex_goAjax.status //
			// rex_goAjax.statusText //
			//return this.Ajax.rex_goAjax.statusText
			return "";
		} // end if
	} // end if
}

function rex_gfAjaxExcute(sMethod, isASync, sPath, sParam, sDataType, sRequestHeader) {
	var oConnection = rex_GetgoAjax();

	oConnection.Method = sMethod;
	oConnection.isASync = isASync;
	oConnection.Path = sPath;
	oConnection.DataType = sDataType;
	oConnection.Open();

	if (sRequestHeader != "") {
		oConnection.SetRequestHeader("Content-Type", sRequestHeader);
	} else {
		oConnection.SetRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=EUC-KR");
		//oConnection.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
	}

	if (sMethod == "POST") {
		if (sParam != "") {
			oConnection.Send(sParam);
		} else {
			oConnection.Send();
		}
	} else {
		oConnection.Send();
	}

	return oConnection;
}
// ----------- ajax end --------------------