<%@page import="fcas.sys.com.servlet.SystemCode"%>
<%@page import="fcas.sys.com.servlet.SystemMsg"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>레포트 출력</title>
	<script type="text/javascript" src="/RexServer30/rexscript/getscript.jsp?f=rexpert"></script>
	<script type="text/javascript" src="/RexServer30/rexscript/getscript.jsp?f=rexpert_properties"></script>
	<script type="text/javascript">
	function fnOpen(){
		var oReport = GetfnParamSet();
		oReport.rptname = "http://" + location.host + "/report/cus/fad/fcas_term_stat_rx_print.reb";
		
		oReport.con("XML1").type = "http";
		oReport.con("XML1").datatype = "xml";
		oReport.con("XML1").path = "http://" + location.host + "/cus/fad/SalesInfo/selectTermStatPrintXml.do?rxParam="+parent.rxParam;
		oReport.con("XML1").dataset("XMLDS1").xpath = "gubun/rpt1/rexdataset/rexrow";
		
		var param = parent.rxParam.split('|');
		var cond11 = param[2].replace('STND_DATE_F1:','');
		var cond12 = param[3].replace('STND_DATE_T1:','');
		oReport.param("COND1").value = '( 기준 : '
									+ cond11.substring(0,4)+'년 '+cond11.substring(4,6)+'월 '+cond11.substring(6,8)+'일'
									+ ' ~ '
									+ cond12.substring(0,4)+'년 '+cond12.substring(4,6)+'월 '+cond12.substring(6,8)+'일'
									+ ' )';
		var cond21 = param[4].replace('STND_DATE_F2:','');
		var cond22 = param[5].replace('STND_DATE_T2:','');
		oReport.param("COND2").value = '( 비교 : '
									+ cond21.substring(0,4)+'년 '+cond21.substring(4,6)+'월 '+cond21.substring(6,8)+'일'
									+ ' ~ '
									+ cond22.substring(0,4)+'년 '+cond22.substring(4,6)+'월 '+cond22.substring(6,8)+'일'
									+ ' )';
		
		oReport.event.init = fnReportEvent;
		//oReport.event.finishdocument = fnReportEvent;
		
		oReport.iframe(ifrmRexPreview1);
	}
	
	// event handler
	function fnReportEvent(oRexCtl, sEvent, oArgs){
		//alert(sEvent);
	
		if (sEvent == "init") {
			oRexCtl.SetCSS("appearance.canvas.offsetx=0");
			oRexCtl.SetCSS("appearance.canvas.offsety=0");
			oRexCtl.SetCSS("appearance.pagemargin.visible=0");
			oRexCtl.SetCSS("appearance.toolbar.button.open.visible=0");
			oRexCtl.SetCSS("appearance.toolbar.button.export.visible=1");
			oRexCtl.SetCSS("appearance.toolbar.button.refresh.visible=0");
			oRexCtl.SetCSS("appearance.toolbar.button.movefirst.visible=1");
			oRexCtl.SetCSS("appearance.toolbar.button.moveprev.visible=1");
			oRexCtl.SetCSS("appearance.toolbar.button.pagenumber.visible=1");
			oRexCtl.SetCSS("appearance.toolbar.button.pagecount.visible=1");
			oRexCtl.SetCSS("appearance.toolbar.button.movenext.visible=1");
			oRexCtl.SetCSS("appearance.toolbar.button.movelast.visible=1");
			oRexCtl.SetCSS("appearance.toolbar.button.zoom.visible=1");
			oRexCtl.SetCSS("appearance.toolbar.button.exportxls.visible=1");
			oRexCtl.SetCSS("appearance.toolbar.button.exportpdf.visible=1");
			oRexCtl.SetCSS("appearance.toolbar.button.exporthwp.visible=0");
			oRexCtl.SetCSS("appearance.toolbar.button.about.visible=0");
			oRexCtl.SetCSS("appearance.toolbar.button.movecontent.visible=0");
			oRexCtl.SetCSS("appearance.tabheader.visible=0");
			oRexCtl.SetCSS("appearance.statusbar.visible=0");
			oRexCtl.UpdateCSS();
		} else if (sEvent == "finishdocument") {
			oRexCtl.Zoom("pagewidth");
		} else if (sEvent == "finishprint") {
		} else if (sEvent == "finishexport") {
		} else if (sEvent == "finishprintresult") {
		} else if (sEvent == "hyperlinkclicked") {
		}
	}
	</script>
</head>
<body onload="fnOpen();" style="width:100%; height:100%; padding:0px; margin:0px;">
	<iframe name="ifrmRexPreview1" id="ifrmRexPreview1" src='/RexServer30/rexpreview.jsp'  style="width:816px; height:660px; padding:0px; border:1px; border-style:solid; border-color:#99BCE8;"></iframe>
	<script type="text/javascript">
		rex_writeRexCtl("RexCtl", "0", "0");
	</script>
</body>
</html>