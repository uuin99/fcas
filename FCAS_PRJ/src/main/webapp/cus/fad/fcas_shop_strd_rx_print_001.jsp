<%@page import="fcas.sys.com.servlet.SystemCode"%>
<%@page import="fcas.sys.com.servlet.SystemMsg"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />



<title>기본 레포트 출력</title>

<script type="text/javascript" src="/RexServer30/rexscript/getscript.jsp?f=rexpert"></script>
<script type="text/javascript" src="/RexServer30/rexscript/getscript.jsp?f=rexpert_properties"></script>

<script type="text/javascript" src="/js/jquery/jquery-1.7.1.js"></script>

<script type="text/javascript">

//var xmlMemo = "";

$(document).ready(function(){


    var data = "";
	var callurl = "/cus/fad/ShopStrdReport/selectShopStrdReportPrintXml.do";
	$.ajax({
		async: false,
		type: "post",
		url: callurl ,
		data:data,
		dataType: "json",
		success:function(returnData){

			var xmlMemo = returnData.xmlStr;
			fnOpen(xmlMemo);

		},
		error:function(){

		}
	});

	//fnOpen("1");
});



function fnOpen( xmlMemo )
{
	var oReport = GetfnParamSet();
	oReport.rptname = "http://" + location.host + "/report/cus/fad/fcas_shop_strd_rx_print.reb";

	//oReport.con("XML1").type = "memo";
	//oReport.con("XML1").type = "http";
	//oReport.con("XML1").datatype = "xml";
	//oReport.con("XML1").path = "http://" + location.host + "/cus/fad/ShopStrdReport/selectShopStrdReportPrintXml.do";
	oReport.data = xmlMemo;

	//sData += "<gubun><rpt1><rexdataset><rexrow><EMPNO><![CDATA[7369]]></EMPNO><ENAME><![CDATA[SMITH]]></ENAME><JOB><![CDATA[CLERK]]></JOB><MGR><![CDATA[7902]]></MGR><HIREDATE><![CDATA[1980-12-17 00:00:00.0]]></HIREDATE><SAL><![CDATA[800]]></SAL><COMM><![CDATA[null]]></COMM><DEPTNO><![CDATA[20]]></DEPTNO></rexrow>";
	//sData += "<rexrow><EMPNO><![CDATA[8888]]></EMPNO><ENAME><![CDATA[honggil]]></ENAME><JOB><![CDATA[Tec]]></JOB><MGR><![CDATA[7788]]></MGR><HIREDATE><![CDATA[null]]></HIREDATE><SAL><![CDATA[200]]></SAL><COMM><![CDATA[null]]></COMM><DEPTNO><![CDATA[null]]></DEPTNO></rexrow></rexdataset></rpt1></gubun>";




	//oReport.dataset("ADOSQLDS1").xpath = "gubun/rpt1/rexdataset/rexrow";
	oReport.type = "memo";
	oReport.datatype = "xml";
	oReport.dataset("XMLDS0").xpath = "gubun/rpt0/rexdataset/rexrow";
	//oReport.dataset("XMLDS1").xpath = "gubun/rpt1/rexdataset/rexrow";
	//oReport.dataset("XMLDS2").xpath = "gubun/rpt2/rexdataset/rexrow";
	//oReport.dataset("XMLDS3").xpath = "gubun/rpt3/rexdataset/rexrow";
	//oReport.data ="<gubun><rpt0><rexdataset><rexrow><compNm>(주)이마트</compNm><shopNm>이마트 구로점</shopNm><strdDate>2012년 09월 27일 목요일</strdDate><wthTemp></wthTemp><wthStr></wthStr><bDay>전일 2012.09.26 (수)</bDay><b7Day>전주동요일 2012.09.20 (목)</b7Day></rexrow></rexdataset></rpt0><rpt1><rexdataset><rexrow><stndDate>2012-09-26</stndDate><sumCnt>10886</sumCnt></rexrow><rexrow><stndDate>2012-09-27</stndDate><sumCnt>11044</sumCnt></rexrow></rexdataset></rpt1><rpt2><rexdataset><rexrow><time>21시~24시</time><cnt>1794</cnt></rexrow><rexrow><time>18시~21시</time><cnt>4234</cnt></rexrow><rexrow><time>15시~18시</time><cnt>2329</cnt></rexrow><rexrow><time>12시~15시</time><cnt>1863</cnt></rexrow><rexrow><time>09시~12시</time><cnt>824</cnt></rexrow><rexrow><time>06시~09시</time><cnt>0</cnt></rexrow><rexrow><time>03시~06시</time><cnt>0</cnt></rexrow><rexrow><time>00시~03시</time><cnt>0</cnt></rexrow></rexdataset></rpt2><rpt3><rexdataset><rexrow><sisa>기준일자의 총 입장객수는 전일대비 1%증가 했고시간대 별로는 18시~21시 사이에 가장 많이 방문했습니다.</sisa></rexrow></rexdataset></rpt3></gubun>";



//	oReport.con("XML1").dataset("XMLDS0").xpath = "gubun/rpt0/rexdataset/rexrow";
//	oReport.con("XML1").dataset("XMLDS1").xpath = "gubun/rpt1/rexdataset/rexrow";
//	oReport.con("XML1").dataset("XMLDS2").xpath = "gubun/rpt2/rexdataset/rexrow";
//	oReport.con("XML1").dataset("XMLDS3").xpath = "gubun/rpt3/rexdataset/rexrow";
//	oReport.con("XML1").dataset("XMLDS4").xpath = "gubun/rpt4/rexdataset/rexrow";
//	oReport.con("XML1").dataset("XMLDS5").xpath = "gubun/rpt5/rexdataset/rexrow";
//	oReport.con("XML1").dataset("XMLDS6").xpath = "gubun/rpt6/rexdataset/rexrow";
//	oReport.con("XML1").dataset("XMLDS7").xpath = "gubun/rpt7/rexdataset/rexrow";
//	oReport.con("XML1").dataset("XMLDS8").xpath = "gubun/rpt8/rexdataset/rexrow";
//	oReport.con("XML1").dataset("XMLDS9").xpath = "gubun/rpt9/rexdataset/rexrow";
//
//	oReport.con("XML1").dataset("XMLDS10").xpath = "gubun/rpt10/rexdataset/rexrow";
//	oReport.con("XML1").dataset("XMLDS11").xpath = "gubun/rpt11/rexdataset/rexrow";
//	oReport.con("XML1").dataset("XMLDS12").xpath = "gubun/rpt12/rexdataset/rexrow";
//	oReport.con("XML1").dataset("XMLDS13").xpath = "gubun/rpt13/rexdataset/rexrow";
//	oReport.con("XML1").dataset("XMLDS14").xpath = "gubun/rpt14/rexdataset/rexrow";
//	oReport.con("XML1").dataset("XMLDS15").xpath = "gubun/rpt15/rexdataset/rexrow";
//	oReport.con("XML1").dataset("XMLDS16").xpath = "gubun/rpt16/rexdataset/rexrow";
//	oReport.con("XML1").dataset("XMLDS17").xpath = "gubun/rpt17/rexdataset/rexrow";
//	oReport.con("XML1").dataset("XMLDS18").xpath = "gubun/rpt18/rexdataset/rexrow";
//	oReport.con("XML1").dataset("XMLDS19").xpath = "gubun/rpt19/rexdataset/rexrow";
//	oReport.con("XML1").dataset("XMLDS20").xpath = "gubun/rpt20/rexdataset/rexrow";
//	oReport.con("XML1").dataset("XMLDS21").xpath = "gubun/rpt21/rexdataset/rexrow";

	oReport.event.init = fnReportEvent;
	oReport.event.finishdocument = fnReportEvent;

	oReport.iframe(ifrmRexPreview1);
}

// event handler
function fnReportEvent(oRexCtl, sEvent, oArgs) {
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

<body>

	<iframe name="ifrmRexPreview1" id="ifrmRexPreview1" src='/RexServer30/rexpreview.jsp' width="100%" height="650"></iframe>

	<script type="text/javascript">
		rex_writeRexCtl("RexCtl", "0", "0");
	</script>

</body>
</html>
