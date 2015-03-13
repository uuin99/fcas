<%@ page language="java" contentType="text/html; charset=utf-8" %>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>sampleall</title>
<!--script language="javascript" src="./rexscript/rexpert.js"></script>
<script language="javascript" src="./rexscript/rexpert_properties.js"></script-->

<script type="text/javascript" src="./rexscript/getscript.jsp?f=rexpert"></script>
<script type="text/javascript" src="./rexscript/getscript.jsp?f=rexpert_properties"></script>


</head>
<script language="JavaScript">

//--------------------------
// 기본적인 사용 예
//--------------------------
function fnOpen()
{
	// 필수 - 레포트 생성 객체
	var oReport = GetfnParamSet();
	// 여러 iframe에 레포트를 보여주기 위해 레포트객체id 명시할 수 있음.
	//var oReport = GetfnParamSet("0");




	// 필수 - 레포트 파일명
	oReport.rptname = "sample";
	//oReport.rptname = "한글reb파일";
	//oReport.rptname = "http://localhost:8080/RexServer30/test/speed.reb";
	//oReport.rptname = "http://localhost.com:8080/RexServer30/getreport.jsp?filename=한글reb파일";
	//oReport.rptname = "samples/customers";
	//oReport.rptname = "samples/emp";
	//oReport.rptname = "speedtest";

	// 옵션 - 데이터타입(csv - 기본값, xml)
	//oReport.datatype= "xml";

	// 옵션 - 데이터베이스 연결 정보 (서버로 통해 데이터를 가져올 때)
	//oReport.connectname= "oracle1";
	//oReport.connectname= "Ora1";
	//oReport.connectname= "sql1";

	// 옵션 - 레포트 파라메터
	oReport.param("param1").value = "param1";
	//oReport.param("param2").value = "paramvalue2";
	//oReport.param("custid").value = "B";
	//oReport.param("custid").isnull = "1";
	//oReport.param("ename").value = "A";
	//oReport.param("ename").isnull = "1";
	//oReport.param("test").value = "가나다abc";

	// 옵션 - title
	//oReport.title = "리포트";

	//-------------------------------------
	// 1. xml file을 통해 데이터를 가져오는 방법
	//-------------------------------------
	/*
	oReport.type = "file";
	oReport.datatype = "xml";
	//oReport.xpath = "gubun/rpt1/rexdataset/rexrow";
	//oReport.path = "http://" + location.host + "/RexServer30/rebfiles/samples/oracle_emp.xml";
	oReport.path = "http://" + location.host + "/RexServer30/rebfiles/samples/sqlserver_customers_orders.xml";
	//oReport.path = "http://" + location.host + "/RexServer30/rebfiles/samples/oracle_emp.jsp?datatype=xml";
	//oReport.path = "D:\\rexpert30\\RexServer30\\rebfiles\\samples\\oracle_emp.xml";
	*/

	//-------------------------------------
	// 2. csv file을 통해 데이터를 가져오는 방법
	//-------------------------------------
	/*
	oReport.type = "file";
	oReport.datatype = "csv";
	oReport.path = "http://" + location.host + "/RexServer30/rebfiles/samples/oracle_emp.csv";
	//oReport.path = "http://" + location.host + "/RexServer30/rebfiles/samples/oracle_emp.jsp?datatype=csv";
	//oReport.path = "D:\\rexpert30\\RexServer30\\rebfiles\\samples\\oracle_emp.csv";
	*/

	//-----------------------------------------
	// 3. xml memo값을 통해 데이터를 가져오는 방법
	//-----------------------------------------
	/*
	var sData = "";
	sData += "<gubun><rpt1><rexdataset><rexrow><EMPNO><![CDATA[7369]]></EMPNO><ENAME><![CDATA[SMITH]]></ENAME><JOB><![CDATA[CLERK]]></JOB><MGR><![CDATA[7902]]></MGR><HIREDATE><![CDATA[1980-12-17 00:00:00.0]]></HIREDATE><SAL><![CDATA[800]]></SAL><COMM><![CDATA[null]]></COMM><DEPTNO><![CDATA[20]]></DEPTNO></rexrow>";
	sData += "<rexrow><EMPNO><![CDATA[8888]]></EMPNO><ENAME><![CDATA[honggil]]></ENAME><JOB><![CDATA[Tec]]></JOB><MGR><![CDATA[7788]]></MGR><HIREDATE><![CDATA[null]]></HIREDATE><SAL><![CDATA[200]]></SAL><COMM><![CDATA[null]]></COMM><DEPTNO><![CDATA[null]]></DEPTNO></rexrow></rexdataset></rpt1></gubun>";

	oReport.type = "memo";
	oReport.datatype = "xml";
	oReport.dataset("ADOSQLDS1").xpath = "gubun/rpt1/rexdataset/rexrow";
	//oReport.dataset("ADOSQLDS2").xpath = "gubun/rpt2/rexdataset/rexrow";
	//oReport.xpath = "gubun/rpt1/rexdataset/rexrow";
	oReport.data = sData;
	*/

	//-----------------------------------------
	// 4. csv memo값을 통해 데이터를 가져오는 방법
	//-----------------------------------------
	/*
	var sData = "";
	sData += "7369|*|SMITH|*|CLERK|*|7902|*|1980-12-17 00:00:00.0|*|800|*|null|*|20|#|";
	sData += "8888|*|홍길동|*|기술|*|7788|*|null|*|null|*|null|*|null";

	sData += "|@|";

	sData += "1|*|DEV|*|SEOUL|#|";
	sData += "2|*|SUP|*|SEOUL";

	oReport.type = "memo";
	oReport.datatype = "csv";
	oReport.data = sData;
	*/

	//------------------------------------------
	// 5. xml http(post)를 통해 데이터를 가져오는 방법
	//------------------------------------------
	/*
	oReport.type = "http";
	oReport.datatype = "xml";
	oReport.xpath = "gubun/rpt1/rexdataset/rexrow";
	oReport.path = "http://" + location.host + "/RexServer30/rebfiles/samples/oracle_emp.jsp";
	oReport.httpparam("datatype").value = "xml";
	*/

	//------------------------------------------
	// 6. csv http(post)를 통해 데이터를 가져오는 방법
	//------------------------------------------
	/*
	oReport.type = "http";
	oReport.datatype = "csv";
	oReport.path = "http://" + location.host + "/RexServer30/rebfiles/samples/oracle_emp.jsp";
	oReport.httpparam("datatype").value = "csv";
	*/

	//-----------------------------------------------------------
	//   참고: RexServer2.5를 통해 데이터를 가져오는 방법
	//             rexpert_properties.js 에서 rex_gsServerVersion = "2.5"로
	//             설정하면, 아래코드와 같이 동작함.(3.0서버가 없을 때 사용)
	//-----------------------------------------------------------
	/*
	oReport.type = "http";
	oReport.datatype = "XML";
	oReport.xpath = "root/main/rpt1/rexdataset/rexrow";
	oReport.path = "http://" + location.host + "/RexServer/RexService.jsp";
	oReport.httpparam("designtype").value = "run";
	oReport.httpparam("datatype").value = "XML";
	oReport.httpparam("sql").value = "{%auto%}";
	oReport.httpparam("split").value = "";
	oReport.httpparam("userservice").value = "Ora1";
	oReport.httpparam("image").value = "";
	oReport.httpparam("rex_param_sql").value = "";
	*/

	//-----------------------------------------------------------------------------------------------
	// event handler 정의(인자는 3개)
	//        oRexCtl : 렉스퍼트 객체
	//        sEvent : 이벤트명
	//                     "init" - 초기화, "finishdocument" - 레포트팅 완료, "finishprint" - 인쇄 완료, "finishexport" - 저장 완료,
	//			"hyperlinkclicked" - 하이퍼링크클릭시
	//        oArgs : 이벤트 파라메터(finishexport - filename, hyperlinkclicked - Path, finishprintresult - resultcode)
	//-----------------------------------------------------------------------------------------------
	//oReport.event.init = fnReportEvent;
	//oReport.event.finishdocument = fnReportEvent;
	//oReport.event.finishprint = fnReportEvent;
	//oReport.event.finishexport = fnReportEvent;
	//oReport.event.finishprintresult = fnReportEvent;
	//oReport.event.hyperlinkclicked = fnReportEvent;
	//oReport.event.finishexportserver = fnReportEvent;

	//-----------------------------
	// plugin - DRM
	//-----------------------------
	//oReport.plugin.type = "markany";
	//oReport.plugin.type = "bcqure";

	// auto refresh time
	//oReport.autorefeshtime = 5;

	//필수 - 레포트 실행
	oReport.iframe(ifrmRexPreview1);
	//oReport.open();
	//oReport.print(false, 1, -1, 1, "");   // 다이얼로그표시유무, 시작페이지, 끝페이지, 카피수, 옵션
	//oReport.printdirect("HP LaserJet 3050" , 260, 1, -1, 1, "");	// [프린터명],[트레이아이디],[시작페이지],[끝페이지],[출력매수],[옵션]
	//oReport.save(false, "pdf", "c:\\test.pdf", 1, -1, "");	// 다이얼로그표시유무, 파일타입, 파일명, 시작페이지, 끝페이지, 카피수, 옵션
									// saveoption : "export.run=0"
	//oReport.embed("RexCtl");   // 이벤트핸들링은 직접 이 페이지에서 해야 함
	//oReport.exportserver("testfile", "pdf");

	/*
	oReport.exportservice.filename = "filename2";
	oReport.exportservice.filetype = "pdf";
	oReport.exportservice.afterjob = "02";

	oReport.exportserver();
	*/



}

// event handler
function fnReportEvent(oRexCtl, sEvent, oArgs) {
	//alert(sEvent);

	if (sEvent == "init") {
		oRexCtl.SetCSS("appearance.canvas.offsetx=0");
		oRexCtl.SetCSS("appearance.canvas.offsety=0");
		oRexCtl.SetCSS("appearance.pagemargin.visible=0");

		oRexCtl.SetCSS("appearance.toolbar.button.open.visible=0");
		oRexCtl.SetCSS("appearance.toolbar.button.export.visible=0");
		oRexCtl.SetCSS("appearance.toolbar.button.refresh.visible=1");
		oRexCtl.SetCSS("appearance.toolbar.button.movefirst.visible=1");
		oRexCtl.SetCSS("appearance.toolbar.button.moveprev.visible=1");
		oRexCtl.SetCSS("appearance.toolbar.button.pagenumber.visible=1");
		oRexCtl.SetCSS("appearance.toolbar.button.pagecount.visible=1");
		oRexCtl.SetCSS("appearance.toolbar.button.movenext.visible=1");
		oRexCtl.SetCSS("appearance.toolbar.button.movelast.visible=1");
		oRexCtl.SetCSS("appearance.toolbar.button.zoom.visible=1");
		oRexCtl.SetCSS("appearance.toolbar.button.exportxls.visible=0");
		oRexCtl.SetCSS("appearance.toolbar.button.exportpdf.visible=0");
		oRexCtl.SetCSS("appearance.toolbar.button.exporthwp.visible=0");
		oRexCtl.SetCSS("appearance.toolbar.button.about.visible=0");

		//oRexCtl.SetCSS("appearance.pane.toc.visible=0");

		//oRexCtl.SetCSS("event.printfinishresult.enable=1");
		//<- 이 속성을 1로 설정해야 PrintFinishResult 이벤트가 발생합니다

		oRexCtl.UpdateCSS();
	} else if (sEvent == "finishdocument") {
		oRexCtl.Zoom("wholepage");
		//oRexCtl.SetCSS("appearance.toolbar.button.exportxls.option.sheetoption=2");
		//oRexCtl.UpdateCSS();
	} else if (sEvent == "finishprint") {

	} else if (sEvent == "finishexport") {
		//alert(oArgs.filename);

	} else if (sEvent == "finishprintresult") {
		//alert(oArgs.resultcode);
		/*
			0      : 성공
			1002 : 인쇄 작업이 일지정지
			1003 : 인쇄 작업중 오류 발생
			1004 : 인쇄 작업이 삭제중
			1005 : 프린터 오프라인상태
			1006 : 프린터 용지 부족
			1007 : 인쇄 작업이 삭제됨
			9999 : 알수 없는 오류 발생
		*/
	} else if (sEvent == "hyperlinkclicked") {
		//alert(oArgs.Path);
	}

	//window.close();
}

//----------------------------------------------
// 커넥션별 데이터를 서로 다르게 각각 가져오는 예
// 디자인시 만든 커넥션에 따라 설정
//----------------------------------------------
function fnOpenEach()
{
	// 필수 - 레포트 생성 객체
	var oReport = GetfnParamSet();
	// 여러 iframe에 레포트를 보여주기 위해 레포트객체id 명시할 수 있음.
	//var oReport = GetfnParamSet("0");

	// 필수 - 레포트 파일명
	oReport.rptname = "samples/sqlserver_customers_orders";

	// 옵션 - 데이터베이스 연결 정보 (서버로 통해 데이터를 가져올 때)
	//oReport.connectname = "Sql1";

	// con = sub

	//----------------------------------------------------------
	// 1. 커넥션별 서로 다르게 데이터를 가져오는 방법(xml file, http csv)
	//----------------------------------------------------------
	/*
	oReport.con("ADO1").type = "file";
	oReport.con("ADO1").datatype = "xml";
	oReport.con("ADO1").path = "http://" + location.host + "/RexServer30/rebfiles/samples/sqlserver_customers_orders.xml";
	oReport.con("ADO1").dataset("ADOSQLDS1").xpath = "gubun/rpt1/rexdataset/rexrow";
	//oReport.con("ADO1").namespace = "ADO1";	// 생략하면, sub id를 사용

	oReport.con("ADO2").type = "http";
	oReport.con("ADO2").connectname = "Sql1";
	//oReport.con("ADO2").namespace = "ADO2";	// 생략하면, sub id를 사용
	*/

	//---------------------------------------------------------
	// 2. 커넥션별 서로 다르게 데이터를 가져오는 방법(csv file, http xml)
	//---------------------------------------------------------
	/*
	oReport.con("ADO1").type = "file";
	oReport.con("ADO1").path = "http://" + location.host + "/RexServer30/rebfiles/samples/sqlserver_customers.csv";
	//oReport.con("ADO1").namespace = "ADO1";	// 생략하면, sub id를 사용

	oReport.con("ADO2").type = "http";
	oReport.con("ADO2").datatype = "xml";
	oReport.con("ADO2").connectname = "Sql1";
	//oReport.con("ADO2").namespace = "ADO2";	// 생략하면, sub id를 사용
	*/

	// 참고 - 서브레포트별 xpath 설정
	/* */
	oReport.con("ADO1").type = "file";
	oReport.con("ADO1").datatype = "xml";
	oReport.con("ADO1").path = "http://" + location.host + "/RexServer30/rebfiles/samples/sqlserver_customers_orders.xml";
	oReport.con("ADO1").dataset("ADOSQLDS1").xpath = "gubun/rpt1/rexdataset/rexrow";
	oReport.con("ADO1").dataset("ADOSQLDS2").xpath = "gubun/rpt2/rexdataset/rexrow";
	//oReport.con("ADO1").namespace = "ADO1";	// 생략하면, sub id를 사용
	/**/

	//필수 - 레포트 실행
	oReport.iframe(ifrmRexPreview1);
	//oReport.open();
	//oReport.print(true, 1, -1, 1, "");   // 다이얼로그표시유무, 시작페이지, 끝페이지, 카피수, 옵션
	//oReport.printdirect("HP LaserJet 3050" , 260, 1, -1, 1, "");	// [프린터명],[트레이아이디],[시작페이지],[끝페이지],[출력매수],[옵션]
	//oReport.save(true, "pdf", "c:\\test.pdf", 1, -1, "");	// 다이얼로그표시유무, 파일타입, 파일명, 시작페이지, 끝페이지, 카피수, 옵션
	//oReport.embed("RexCtl");    // 이벤트핸들링은 직접 이 페이지에서 해야 함
}

//----------------------------------------------
// 여러 레ì트파일을 한번에 ø리보기
//----------------------------------------------
function fnOpenMulti()
{
	// 필수 - 레포트 생성 객체
	var oReport = GetfnParamSet();
	// 여러 iframe에 레포트를 보여주기 위해 레포트객체id 명시할 수 있음.
	//var oReport = GetfnParamSet("0");

	// 필수 - reb 파일을 구분하기 위해 reb함수 사용(reb id는 파일별 구분자)
	oReport.reb("reb1").rptname = "samples/oracle_emp";
	oReport.reb("reb1").connectname = "oracle1";

	//----------------------------------------------------
	// 1. 특정 reb별 서로 다르게 데이터를 가져오는 방법(http csv)
	//----------------------------------------------------
	/**
	oReport.reb("reb2").rptname = "samples/sqlserver_customers_orders";
	oReport.reb("reb2").connectname = "Sql1";
	**/

	// con = sub

	//-------------------------------------------------------------------
	// 2. 특정 reb별 커넥션별 서로 다르게 데이터를 가져오는 방법(xml file, http csv)
	//-------------------------------------------------------------------
	/* *
	oReport.reb("reb2").rptname = "samples/sqlserver_customers_orders";
	oReport.reb("reb2").con("ADO1").type = "file";
	oReport.reb("reb2").con("ADO1").datatype = "xml";
	oReport.reb("reb2").con("ADO1").path = "http://" + location.host + "/RexServer30/rebfiles/samples/sqlserver_customers_orders.xml";
	oReport.reb("reb2").con("ADO1").dataset("ADOSQLDS1").xpath = "gubun/rpt1/rexdataset/rexrow";
	//oReport.reb("reb2").con("ADO1").namespace = "ADO1";	// 생략하면, sub id를 사용
	*/

	oReport.reb("reb2").rptname = "samples/sqlserver_customers_orders";
	oReport.reb("reb2").type = "file";
	oReport.reb("reb2").datatype = "xml";
	oReport.reb("reb2").path = "http://" + location.host + "/RexServer30/rebfiles/samples/sqlserver_customers_orders.xml";
	//oReport.reb("reb2").dataset("ADOSQLDS1").xpath = "gubun/rpt1/rexdataset/rexrow";

	//oReport.reb("reb2").con("ADO2").type = "http";
	//oReport.reb("reb2").con("ADO2").connectname = "Sql1";
	//oReport.reb("reb2").con("ADO2").namespace = "ADO2";	// 생략하면, sub id를 사용
	/* */

	//필수 - 레포트 실행
	oReport.iframe(ifrmRexPreview1);
	//oReport.open();
	//oReport.print(true, 1, -1, 1, "");   // 다이얼로그표시유무, 시작페이지, 끝페이지, 카피수, 옵션
	//oReport.printdirect("HP LaserJet 3050" , 260, 1, -1, 1, "");	// [프린터명],[트레이아이디],[시작페이지],[끝페이지],[출력매수],[옵션]
	//oReport.save(true, "pdf", "c:\\test.pdf", 1, -1, "");	// 다이얼로그표시유무, 파일타입, 파일명, 시작페이지, 끝페이지, 카피수, 옵션
	//oReport.embed("RexCtl");     // 이벤트핸들링은 직접 이 페이지에서 해야 함
}

//----------------------------------------------
// 여러 레포트파일을 한번에 미리보기
// 메인 레포트에 서브레포트를 붙이기
//----------------------------------------------
function fnOpenMulti_MainSub()
{
	// 필수 - 레포트 생성 객체
	var oReport = GetfnParamSet();

	// 필수 - reb 파일을 구분하기 위해 reb함수 사용(reb id는 파일별 구분자)
	oReport.reb("reb1").rptname = "samples/multi_main";
	oReport.reb("reb1").con("XML1").type = "file";
	oReport.reb("reb1").con("XML1").datatype = "xml";
	oReport.reb("reb1").con("XML1").path = "http://" + location.host + "/RexServer30/rebfiles/samples/sqlserver_customers_orders.xml";
	//oReport.reb("reb1").con("XML1").dataset("XMLDS1").xpath = "gubun/rpt1/rexdataset/rexrow";
	oReport.reb("reb1").param("param1").value = "multi-main";

	oReport.reb("reb2").rptname = "samples/multi_sub";
	//--- config-param start ---
	oReport.reb("reb2").configparam("append.section").value  = "1";
	oReport.reb("reb2").configparam("append.option.target").value  = "데이터바닥글1";
	oReport.reb("reb2").configparam("append.option.mainfollow").value  = "1";
	//--- config-param end ---
	oReport.reb("reb2").con("XML1").type = "file";
	oReport.reb("reb2").con("XML1").datatype = "xml";
	oReport.reb("reb2").con("XML1").path = "http://" + location.host + "/RexServer30/rebfiles/samples/sqlserver_customers_orders.xml";
	oReport.reb("reb2").param("param1").value = "multi-sub";

	oReport.reb("reb3").rptname = "samples/multi_sub";
	//--- config-param start ---
	oReport.reb("reb3").configparam("append.section").value  = "1";
	oReport.reb("reb3").configparam("append.option.target").value  = "데이터머리글2";
	oReport.reb("reb3").configparam("append.option.mainfollow").value  = "1";
	//--- config-param end ---
	oReport.reb("reb3").con("XML1").type = "file";
	oReport.reb("reb3").con("XML1").datatype = "xml";
	oReport.reb("reb3").con("XML1").path = "http://" + location.host + "/RexServer30/rebfiles/samples/sqlserver_customers_orders.xml";
	oReport.reb("reb3").param("param1").value = "multi-sub";

	//oReport.event.init = fnReportEvent;
	oReport.event.finishdocument = fnReportEvent;
	//oReport.event.finishprint = fnReportEvent;
	//oReport.event.finishexport = fnReportEvent;
	//oReport.event.hyperlinkclicked = fnReportEvent;

	//필수 - 레포트 실행
	oReport.iframe(ifrmRexPreview1);
	//oReport.open();
	//oReport.print(true, 1, -1, 1, "");   // 다이얼로그표시유무, 시작페이지, 끝페이지, 카피수, 옵션
   	//oReport.printdirect("HP LaserJet 3050" , 260, 1, -1, 1, "");	// [프린터명],[트레이아이디],[시작페이지],[끝페이지],[출력매수],[옵션]
	//oReport.save(true, "pdf", "c:\\test.pdf", 1, -1, "");	// 다이얼로그표시유무, 파일타입, 파일명, 시작페이지, 끝페이지, 카피수, 옵션
	//oReport.embed("RexCtl");     // 이벤트핸들링은 직접 이 페이지에서 해야 함
}

function fnMain()
{
	//fnopen();
	fnSimple1();
	fnSimple2();
}

function fnSimple1()
{
	var oReport = GetfnParamSet("0");
	oReport.rptname = "unitest";
	oReport.datatype = "xml";
	oReport.iframe(ifrmRexPreview1);
}

function fnSimple2()
{
	var oReport = GetfnParamSet("1");
	oReport.rptname = "unitest2";
	oReport.type = "file";
	oReport.path = "http://localhost:8088/rexpert3/rebfiles/data.csv";
	//oReport.datatype = "xml";
	oReport.iframe(ifrmRexPreview2);
}

function fnGetPrinterInfo()
{
	var printerCombo = document.all.printerCombo;
 	for(i = printerCombo.length-1 ; i >= 0 ; i--)
 		printerCombo.options[i] = null;


 	var sPrinterList;
	var listPrinter;
	try
	{
		//******************************************************
		// 프린터 정보를 얻어 옵니다.
		//******************************************************
		sPrinterList = RexCtl.GetPrinterList("@");
		listPrinter = sPrinterList.split("@");
	}
	catch(e)
	{
		alert(e.message);
		return;
	}

 	for(i = 0; i < listPrinter.length; i++)
 	    printerCombo.options[i] = new Option(listPrinter[i], listPrinter[i]);
}

function fnChangePrinter()
{
	var paperbinCombo = document.all.paperbinCombo;
 	for(i = paperbinCombo.length-1 ; i >= 0 ; i--)
 		paperbinCombo.options[i] = null;

	var sPrinterName = printerCombo.value;
	var sPaperBin;
	var listPaperBin;

  	//alert(sPrinterName);
	try
	{
		//******************************************************
		// 프린터 트레이 정보를 얻어 옵니다.
		//******************************************************
		sPaperBin = RexCtl.GetPrinterBinInfoList(sPrinterName, "@");
		//alert(sPaperBin);
		listPaperBin = sPaperBin.split("@");
	}
	catch(e)
	{
		alert(e.message);
		return;
	}

	//******************************************************
	// 동일한 배열안에 트레이번호와 이름이 같이 포함됨
	// [번호1][이름1][번호2][이름2].....
	//******************************************************

 	for(i = 0; i < listPaperBin.length; i=i+2)
 	{
 		var sBinCode = listPaperBin[i];
 		var sBinName = listPaperBin[i+1];
 	    paperbinCombo.options[i/2] = new Option(sBinCode + " - " + sBinName ,sBinCode);
 	}



}

</script>
<body>
	<button onclick="fnOpen();">레포트 보기</button>
	&nbsp;<button onclick="fnOpenEach();">레포트 보기(Each)</button>
	&nbsp;<button onclick="fnOpenMulti();">레포트 보기(Multi)</button>
	&nbsp;<button onclick="fnOpenMulti_MainSub();">레포트 보기(Multi, main-sub)</button><br>
	<hr>
	<INPUT type="button" value="설치된 프린터목록" onClick="fnGetPrinterInfo()">
	<SELECT name="printerCombo" ID="printerCombo" OnChange="fnChangePrinter()">
  		<OPTION>========== 프린터 선택 ========== </OPTION>
  	</SELECT>
	<SELECT name="paperbinCombo" ID="paperbinCombo">
		<OPTION>========== 프린터 트레이 목록 ========== </OPTION>
	</SELECT>
  	<hr>
	<textarea id=txtData rows=3 cols=100></textarea><br>
	<iframe name="ifrmRexPreview1" id="ifrmRexPreview1" src='rexpreview.jsp' width="100%" height="400"></iframe>

	<script type="text/javascript">
		rex_writeRexCtl("RexCtl", "0", "0");
	</script>

	<!--  plugin
	<SCRIPT language=JavaScript SRC="/RexServer30/plugin/markany/js/markany.js"></SCRIPT>
	<SCRIPT language=JavaScript SRC="/RexServer30/plugin/bcqre/js/bcqre.js"></SCRIPT>
	-->
</body>
</html>