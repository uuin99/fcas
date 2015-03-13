<%@page import="fcas.sys.com.servlet.SystemMsg"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge"/>
	<title>Face Insight</title>
	<style type="text/css">
	/* common */
	body {
		font-size:12px; font-family:'Arial','sans-serif','맑은 고딕','돋움','굴림';line-height:25px;
		margin:0; padding:0px; letter-spacing:-1px;
	}

	ul{
	list-style:none;
	padding:0px;margin:0px;
	}

	a {margin-top:5px; color:#505050;text-decoration:none;outline:none; select-dummy: expression(this.hideFocus=true);}
	a:hover, a:active{color:#0d68b5;text-decoration:none;}

	.space02{height:15px;clear:both;}

	input[type="checkbox"]{vertical-align:middle;outline-style:none;}
	input[type="text"],input[type="password"]{width:160px;height:28px;border:1px solid #8894ad;color:#A0A0A0;font-size:18px;
	;vertical-align:middle;outline-style:none;padding:2px 5px 0 5px;}
	input[type="image"]{vertical-align:middle;}
	label{cursor:pointer;font-size:11px;}

	/* Login Layout 시작 */
	.warp{margin:0;width:100%;height:100%;background-image:url('/images/login/main_bg.png'); background-repeat:repeat-x;}
	  .contents{margin:0 auto;width:929px;}
	    .head_image{margin:0; width:450px; float:left;}
	    .login_area{margin:0 auto; float:right;}
		  .login{margin:0 auto;}
		  .login ul{margin:0 auto;}
	      .login ul li{display:inline;list-style-type:none;margin:0 auto;}
		  .login_search{margin-left:348px;padding-top:15px;}
		  .login_search ul{margin:40px 0 0 0;color:#505050;}
	      .login_search ul li{display:inline;list-style-type:none;padding-right:7px;}
	      .login_search a {font-size:11px;}
	      .login_search a:hover, a:active{font-size:11px;}
	    .line_image{line-height:5px; width:929px;vertical-align:middle;overflow: hidden;}
	    .image{margin:10px 0 0 0; float:left;}
	    .roll_image{margin:10px 0 0 0; float:right;top:0;height:328px;}
		.notice_line{margin:10px 0 0 0; border-bottom:1px solid #d0d0d0;width:100%}
	  .notice_area{margin:0 10px 0 0 auto;width:910px;height:25px;}
		.notice_all{*display:inline-block;margin:6px 0 6px 0}
		.notice_all:after{display:block;clear:both;content:''}
	      .notice_icon{float:left;margin:0;width:67px;}
	      .notice_list{float:left;margin-left:5px;}
		    .notice_list ul{margin:1px 1px 1px 1px;height:25px;}
	        .notice_list ul li{height:25px;list-style-type:none;vertical-align:middle;}
		      .notice_list .news{width:530px;height:25px;float:left;display:block; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; -o-text-overflow:ellipsis; -ms-text-overflow:ellipsis;}
	            .notice_list .news a {height:25px; font-size:15px;}
	            .notice_list .news a:hover, a:active{height:25px; font-size:15px;}
		      .notice_list .date{width:95px;height:25px;font-size:15px;color:#505050;padding-left:5px;}
	      .notice_number{float:right;margin:0}
	        .notice_number ul{height:20px; margin:0;}
	        .notice_number ul li{float:left;text-indent:-9999px;display:inline;list-style-type:none;}
	        .notice_number a{display:block; width:100%; height:100%;}


		    .notice_number_01 a{width:16px; height:20px; background:url('/images/login/icon_notice_page.png') no-repeat;}
		    .notice_number_01 a:hover{width:16px; height:20px; background:url('/images/login/icon_notice_page_o.png') no-repeat;}
		    .notice_number_02 a{width:16px; height:20px; background:url('/images/login/icon_notice_page.png') no-repeat;}
		    .notice_number_02 a:hover{width:16px; height:20px; background:url('/images/login/icon_notice_page_o.png') no-repeat;}
		    .notice_number_03 a{width:16px; height:20px; background:url('/images/login/icon_notice_page.png') no-repeat;}
		    .notice_number_03 a:hover{width:16px; height:20px; background:url('/images/login/icon_notice_page_o.png') no-repeat;}
		    .notice_number_04 a{width:16px; height:20px; background:url('/images/login/icon_notice_page.png') no-repeat;}
		    .notice_number_04 a:hover{width:16px; height:20px; background:url('/images/login/icon_notice_page_o.png') no-repeat;}
		    .notice_number_05 a{width:16px; height:20px; background:url('/images/login/icon_notice_page.png') no-repeat;}
		    .notice_number_05 a:hover{width:16px; height:20px; background:url('/images/login/icon_notice_page_o.png') no-repeat;}

		    .notice_number_00s a{width:16px; height:20px; background:url('/images/login/icon_notice_page_s.png') no-repeat;}

		.main_content{float:right;margin:25px 0 25px 0}
		    .main_content ul{margin:0;}
	        .main_content ul li{float:left;display:inline;list-style-type:none;margin-right:10px;}
	        .main_content a{width:100%; height:100%;}
		.bottom_image{margin:20px 0 0 0;}
	/* Login Layout 끝 */

	/* Popup_Notice 시작 */
	.notice_wrap{
		position:absolute;z-index:0;top:7%;left:50%;margin-left:-280px;
		width:560px;height:500px;background-color:#fff; border:1px solid #8e8e8e;color:#505050;
	}
	  .notice_layout{width:480px;height:410px;margin:30px auto 30px auto;}
	    .notice_title{height:30px;line-height:30px;color:#515151;font-weight:bold;text-align:center;
		              background-color:#efefef;border-top:1px solid #d6d6d6; border-bottom:1px solid #d6d6d6;
		              display:block; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; -o-text-overflow:ellipsis; -ms-text-overflow:ellipsis;}
	      .notice_date{float:left;height:25px;line-height:25px;font-size:11px;color:#505050;}
		  .notice_download{float:right;height:25px;line-height:25px;font-size:11px;color:#505050;}
	        .notice_download a{color:#ff2424;font-size:11px;text-decoration:underline;}
	        .notice_download a:hover{color:#f45757;}

		.notice_content{margin-top:50px;overflow-y:auto;overflow-x:auto;height:330px;}
	  .notice_bottom{height:30px;line-height:30px;background-color:#2e2e2e;text-align:center;}
	    .notice_bottom a {color:#fff;font-weight:bold;font-size:12px;}
	    .notice_bottom a:hover{color:#d4d4d4;font-weight:bold;}
	/* Popup_Notice 끝 */

	/* Popup_service 시작 */

	.service_wrap{
		position:absolute;z-index:0;top:7%;left:50%;margin-left:-400px;
		width:800px;height:560px;background-color:#fff; border:1px solid #8e8e8e;color:#505050;
	    }
	  .service_layout{width:740px;height:470px;margin:30px auto 30px auto;}
	    .service_title{height:30px;line-height:30px;color:#515151;font-weight:bold;text-align:center;
		              background-color:#efefef;border-top:1px solid #d6d6d6; border-bottom:1px solid #d6d6d6;}

		.service_content{width:740px;height:410px;margin:30px auto auto auto; overflow:auto;}
	/* Popup_service 끝 */
	</style>

	<script type="text/javascript" src="/js/jquery/jquery-1.7.1.js"></script> <!-- jquery -->
	<script type="text/javascript" src="/js/jquery/blockUi/jquery.blockUI.js" ></script>


<!--  슬라이더 시작 -->
		<!-- jQuery library -->
		<!--<script type="text/javascript" src="../lib/js/external/_oldies/jquery-1.3.min.js"></script>-->
		<!--<script type="text/javascript" src="../lib/js/external/jquery-1.6.2.min.js"></script>-->

		<!-- jQuery Plugin scripts -->
		<script type="text/javascript" src="/js/jquery/slider/external/jquery.easing.1.3.min.js"></script>
		<script type="text/javascript" src="/js/jquery/slider/external/jquery.mousewheel.min.js"></script>

		<!-- Slider Kit scripts -->
		<script type="text/javascript" src="/js/jquery/slider/sliderkit/jquery.sliderkit.1.9.2.pack.js"></script>
		<script type="text/javascript" src="/js/jquery/slider/sliderkit/addons/sliderkit.timer.1.0.pack.js"></script>
		<script type="text/javascript" src="/js/jquery/slider/sliderkit/addons/sliderkit.counter.1.0.pack.js"></script>
		<script type="text/javascript" src="/js/jquery/slider/sliderkit/addons/sliderkit.imagefx.1.0.pack.js"></script>




		<script type="text/javascript">
			$(window).load(function(){ //$(window).load() must be used instead of $(document).ready() because of Webkit compatibility

				/*---------------------------------
				 *	Example #01 Simple usage
				 *---------------------------------*/
				$(".transition-demo01").sliderkit({
					auto:1,
					autostill:true,
					shownavitems:1,
					//timer:true,
					circular:true,
					panelfx:'fancy',
					imagefx:{
						fxType: 'random' // curtain, zipper, wave, fountain, random
					},
					debug:1
				});


				// Get the sliderkit object data
				var myGallery01 = $( '.transition-demo01' ).data( 'sliderkit' );
				myGallery01.options.imagefx.fxDelay = 50;
				myGallery01.options.imagefx.fxDuration = 500;


				/* Transitions settings
				$( '#transitionsSettings #fxDelay' ).change(function () {
					myGallery01.options.imagefx.fxDelay =  $( 'option:selected', $(this) ).text();
				});
				$( '#transitionsSettings #fxDuration' ).change(function () {
					myGallery01.options.imagefx.fxDuration =  parseInt($( 'option:selected', $(this) ).text());
				});
				*/


				setInterval("fnShowNotice2()",5000);
			});
	</script>






	<script type="text/javascript">
	var notice_no = "1";
	var autoNotice = 1;
	function fnConfirmSave(checkbox){
		if (checkbox.checked) {
			var isRemember = confirm("이 PC에  아이디를 저장하시겠습니까?\n공공장소에서는 개인정보가 유출될 수 있으니 주의해주세요.");
		  	if (!isRemember) {
		  		checkbox.checked = false;
		  	}
		}
	}

	function fnSetSave(name, value, expiredays){
		var today = new Date();
		today.setDate( today.getDate() + expiredays );
		document.cookie = name + "=" + escape( value ) + "; path=/; expires=" + today.toGMTString() + ";"
	}

	function fnDoLogin(checked, id){
		if (checked) {
			// userid 쿠키에 id 값을 7일간 저장
			fnSetSave("userid", id, 7);
		} else {
			// userid 쿠키 삭제
			fnSetSave("userid", id, -1);
		}
	}

	function fnGetLogin(){
		// userid 쿠키에서 id 값을 가져온다.
		var cook = document.cookie + ";";
		var idx = cook.indexOf("userid", 0);
		var val = "";

		if (idx != -1) {
			cook = cook.substring(idx, cook.length);
			begin = cook.indexOf("=", 0) + 1;
			end = cook.indexOf(";", begin);
			val = unescape( cook.substring(begin, end) );
		}

		// 가져온 쿠키값이 있으면
		if (val != "") {
			document.loginForm.LOGIN_ID.value = val;
			document.loginForm.ID_SAVE.checked = true;
			document.loginForm.LOGIN_PWD.focus();
		} else {
			document.loginForm.LOGIN_ID.focus();
		}

		fnShowNotice(notice_no);
	}



	function fnShowNotice(no){

		document.getElementById("notice_title").innerHTML = document.getElementById("n_title_"+no).value;
		document.getElementById("notice_date").innerHTML = document.getElementById("n_date_"+no).value;

		for (var i=1; i<=5; i++) {
			if (i == no) {
				document.getElementById("notice_number_"+i).className = "notice_number_00s";
			} else {
				document.getElementById("notice_number_"+i).className = "notice_number_0"+i;
			}
		}

		notice_no = no;
		autoNotice = parseInt(no)+1;
	}

	function fnShowNotice2(){

		document.getElementById("notice_title").innerHTML = document.getElementById("n_title_"+autoNotice).value;
		document.getElementById("notice_date").innerHTML = document.getElementById("n_date_"+autoNotice).value;

		for (var i=1; i<=5; i++) {
			if (i == autoNotice) {
				document.getElementById("notice_number_"+i).className = "notice_number_00s";
			} else {
				document.getElementById("notice_number_"+i).className = "notice_number_0"+i;
			}
		}
		autoNotice++;
		if(autoNotice == 6) autoNotice = 1;

	}

	function fnNoticeCntUp(){
		document.shForm.SEQ.value = document.getElementById("n_seq_"+notice_no).value;
		document.shForm.target = 'hiddenFrame';
		document.shForm.submit();
	}

	function fnNoticePop(){

		fnNoticeCntUp();

		document.getElementById("notice_pop_title").innerHTML = document.getElementById("n_title_"+notice_no).value;
		document.getElementById("notice_pop_date").innerHTML = document.getElementById("n_date_"+notice_no).value;
		document.getElementById("notice_pop_file").innerHTML = document.getElementById("n_file_"+notice_no).value;
		document.getElementById("notice_pop_content").innerHTML = document.getElementById("n_content_"+notice_no).value;
		//if (document.getElementById("notice_pop").style.display == "none") {
		//	document.getElementById("notice_pop").style.display = "";
		//}
		$.blockUI.defaults.showOverlay = "false";
		$.blockUI({
			message: $("#notice_pop")
			,css: {
				border: 'none',
				cursor: 'default',
				top: '0px',
				}
			, overlayCSS: { backgroundColor: '#000' }
		});


	}

	function addHidden(f,n,v) {
	    var i=document.createElement("input");
	    i.type="hidden";
	    i.name=n;
	    i.value=v;
	    //f.insertBefore(i);
	    f.appendChild(i);
	    return f;
	}

	function fnNoticeFileDownload(){
		var seq = document.getElementById("n_seq_"+notice_no).value;

		var fileDownForm = document.createElement("form");
		fileDownForm.name = "fileDownForm";
		fileDownForm.method = "POST";
		fileDownForm.action = '/sys/com/Common/getPublicBrdFileDownload.do';
		fileDownForm.target = '_self';

		fileDownForm=addHidden(fileDownForm, 'SEQ', seq);
		document.body.insertBefore(fileDownForm, null);
		fileDownForm.submit();
		document.body.removeChild(fileDownForm);
	}

	function fnPopClose(){
		$.unblockUI(
		);
	}

	function fnServicePop(no){
	    var service_no = "service_pop"+no

		$.blockUI.defaults.showOverlay = "false";
		$.blockUI({
			message: $("#"+service_no)
			,css: {
				border: 'none',
				cursor: 'default',
				top: '0px',
				}
			, overlayCSS: { backgroundColor: '#000' }
		});
	}
	</script>

</head>
<body onload="fnGetLogin();">

<form name="loginForm" method="post" action="/sys/com/Login/actionLogin.do">
  <div class="warp">
    <div class="contents">
      <div class="head_image"><img src="/images/login/head_img.png" /></div>
      <!-- 로그인 시작 -->
      <div class="login_area">
        <!-- 아이디 저장 시작 -->
        <div class="login_search">
          <ul>
            <li><input name="ID_SAVE" type="checkbox" value="" id="ID_SAVE" onclick="fnConfirmSave(this);"/><label for="ID_SAVE">아이디 저장</label></li>
          </ul>
        </div>
        <!-- 아이디 저장 끝 -->
        <div class="login">
          <ul>
            <li><input type="text" name="LOGIN_ID" id="LOGIN_ID" value="" /></li>
            <li><input type="password" name="LOGIN_PWD" id="LOGIN_PWD" value=""/></li>
            <li><input type="image" src="/images/login/btn_mainlogin_nor.png" onclick="fnDoLogin(loginForm.ID_SAVE.checked, loginForm.LOGIN_ID.value);" onMouseOver="this.src='/images/login/btn_mainlogin_click.png'" onMouseOut="this.src='/images/login/btn_mainlogin_nor.png'"/></li>
            <li><input type="hidden" name="reLogin" id="reLogin" value="N"/></li>
          </ul>
        </div>
      <!-- 로그인 끝 -->
      </div>



      <div class="line_image"><img src="/images/login/line_image.png" /></div>
      <div class="image"><img src="/images/login/top.png" /></div>
      <div class="roll_image transition-demo01">
					<div class="sliderkit-panels">
						<div class="sliderkit-panel">
							<img src="/images/login/roll_image01.png" alt="[Alternative text]" />
						</div>
						<div class="sliderkit-panel">
							<img src="/images/login/roll_image02.png" alt="[Alternative text]" />
						</div>
						<div class="sliderkit-panel">
							<img src="/images/login/roll_image03.png" alt="[Alternative text]" />
						</div>
						<div class="sliderkit-panel">
							<img src="/images/login/roll_image04.png" alt="[Alternative text]" />
						</div>
						<div class="sliderkit-panel">
							<img src="/images/login/roll_image05.png" alt="[Alternative text]" />
						</div>
					</div>

      </div>

      <div class="space02"></div>

    <!--  공지사항영역 시작  -->
      <div class="notice_area">
         <div class="notice_all">
           <div class="notice_icon"><img src="/images/login/icon_notice.jpg" /></div>
           <!-- 공지사항 목록 시작 -->
           <div class="notice_list">
             <ul>
               <li>
               <!--
                 <span class="news"><a href="#" onclick="fnNoticePop();" id="notice_title">Face Insight 서비스 소개</a></span>
                 <span class="date" id="notice_date">2013.01.08</span>
                -->
                 <span class="news"><a href="#" onclick="fnNoticePop();" id="notice_title"></a></span>
                 <span class="date" id="notice_date"></span>
               </li>
             </ul>
           </div>
           <!-- 공지사항 목록 끝 -->
           <!-- 공지사항 번호 시작 -->
           <div class="notice_number">
             <ul>
               <li id="notice_number_1" class="notice_number_01"><a href="#" onclick="fnShowNotice('1');">1</a></li>
               <li id="notice_number_2" class="notice_number_02"><a href="#" onclick="fnShowNotice('2');">2</a></li>
               <li id="notice_number_3" class="notice_number_03"><a href="#" onclick="fnShowNotice('3');">3</a></li>
               <li id="notice_number_4" class="notice_number_04"><a href="#" onclick="fnShowNotice('4');">4</a></li>
               <li id="notice_number_5" class="notice_number_05"><a href="#" onclick="fnShowNotice('5');">5</a></li>
             </ul>
           </div>
           <!-- 공지사항 번호 끝 -->
         </div>
      </div>
    <!--  공지사항 영역 끝 -->
    <div class="notice_line"></div>
    <div class="space02"></div>
    <!--  공지사항 영역 끝 -->
    <div class="main_content">
		<ul>
			<li><a href="#" target="_self"><img onclick="fnServicePop('1');" name="menu" src="/images/login/service1.jpg" border="0" title="매장분석서비스" style="cursor: pointer;"></a></li>
			<li><a href="#" target="_self"><img onclick="fnServicePop('2');" name="menu" src="/images/login/service2.jpg" border="0" title="상권분석서비스" style="cursor: pointer;"></a></li>
			<li><a href="#" target="_self"><img onclick="fnServicePop('3');" name="menu" src="/images/login/service3.jpg" border="0" title="영업지원서비스" style="cursor: pointer;"></a></li>
			<li><a href="#" target="_self"><img onclick="fnServicePop('4');" name="menu" src="/images/login/service4.jpg" border="0" title="서비스이용안내" style="cursor: pointer;"></a></li>
		</ul>
	</div>
    <!-- footer영역 시작 -->
    <div class="bottom_image"><img src="/images/login/bottom.jpg" border="0"/></div>
    <!-- footer영역 끝 -->
  </div>
	<!-- 공지사항 영역 시작 -->
	<div id="notice_pop" class="notice_wrap" style="display: none;">
		<div class="notice_layout">
			<div id="notice_pop_title" class="notice_title"></div>
			<div id="notice_pop_date" class="notice_date"></div>
			<div class="notice_download">첨부파일 : <a href="#" id="notice_pop_file" onclick="fnNoticeFileDownload();"></a></div>
			<div id="notice_pop_content" class="notice_content"></div>
		</div>
		<div class="notice_bottom"><a href="#" onclick="fnPopClose();">[닫기]</a></div>
	</div>
	<!-- 공지사항 영역 시작 -->

	<!-- 서비스 영역 시작 -->
	<div id="service_pop1" class="service_wrap" style="display: none;">
		<div class="service_layout">
			<div class="service_title">매장분석 서비스</div>
			<div class="service_content">
				<img src="/images/login/service1_1.png" style="border:0px;"/>
			</div>
		</div>
		<div class="notice_bottom"><a href="#" onclick="fnPopClose();">[닫기]</a></div>
	</div>
	<div id="service_pop2" class="service_wrap" style="display: none;">
		<div class="service_layout">
			<div class="service_title">상권분석 서비스</div>
			<div class="service_content">
				<img src="/images/login/service2_1.png" style="border:0px;"/>
			</div>
		</div>
		<div class="notice_bottom"><a href="#" onclick="fnPopClose();">[닫기]</a></div>
	</div>
	<div id="service_pop3" class="service_wrap" style="display: none;">
		<div class="service_layout">
			<div class="service_title">영업지원 서비스</div>
			<div class="service_content">
				<img src="/images/login/service3_1.png" style="border:0px;"/>
			</div>
		</div>
		<div class="notice_bottom"><a href="#" onclick="fnPopClose();">[닫기]</a></div>
	</div>
	<!-- 서비스 영역 끝 -->

	<!-- 서비스 영역 시작 -->
	<div id="service_pop4" class="service_wrap" style="display: none;">
		<div class="service_layout">
			<div class="service_title">서비스 이용안내</div>
			<div class="service_content">
				<img src="/images/login/serviceinfo.png" style="border:0px;"/>
			</div>
		</div>
		<div class="notice_bottom"><a href="#" onclick="fnPopClose();">[닫기]</a></div>
	</div>
	<!-- 서비스 영역 끝 -->

 </div>
</form>

<!-- 1번 공지사항 데이터 -->
<input type='hidden' id='n_title_1' value='${data_title_1}'/>
<input type='hidden' id='n_date_1' value='${data_date_1}'/>
<input type='hidden' id='n_seq_1' value='${data_seq_1}'/>
<input type='hidden' id='n_file_1' value='${data_file_1}'/>
<input type='hidden' id='n_content_1' value='${data_content_1}'/>

<!-- 2번 공지사항 데이터 -->
<input type='hidden' id='n_title_2' value='${data_title_2}'/>
<input type='hidden' id='n_date_2' value='${data_date_2}'/>
<input type='hidden' id='n_seq_2' value='${data_seq_2}'/>
<input type='hidden' id='n_file_2' value='${data_file_2}'/>
<input type='hidden' id='n_content_2' value='${data_content_2}'/>

<!-- 3번 공지사항 데이터 -->
<input type='hidden' id='n_title_3' value='${data_title_3}'/>
<input type='hidden' id='n_date_3' value='${data_date_3}'/>
<input type='hidden' id='n_seq_3' value='${data_seq_3}'/>
<input type='hidden' id='n_file_3' value='${data_file_3}'/>
<input type='hidden' id='n_content_3' value='${data_content_3}'/>

<!-- 4번 공지사항 데이터 -->
<input type='hidden' id='n_title_4' value='${data_title_4}'/>
<input type='hidden' id='n_date_4' value='${data_date_4}'/>
<input type='hidden' id='n_seq_4' value='${data_seq_4}'/>
<input type='hidden' id='n_file_4' value='${data_file_4}'/>
<input type='hidden' id='n_content_4' value='${data_content_4}'/>

<!-- 5번 공지사항 데이터 -->
<input type='hidden' id='n_title_5' value='${data_title_5}'/>
<input type='hidden' id='n_date_5' value='${data_date_5}'/>
<input type='hidden' id='n_seq_5' value='${data_seq_5}'/>
<input type='hidden' id='n_file_5' value='${data_file_5}'/>
<input type='hidden' id='n_content_5' value='${data_content_5}'/>

 <script type="text/javascript">
	var msg = '<c:out value="${msg}"/>';

	if (msg != '') {
	    alert(msg);
	}

	var loginFail = '<c:out value="${loginFail}"/>';

	if (loginFail != '') {
		var comRst0003 = "<%=SystemMsg.getMsg("COM_IFO_0005")%>";//비정상적으로 종료되었거나 다른 컴퓨터에서 이미 로그인 중입니다.<BR>기존 세션을 종료하고 로그인 하시겠습니까?

		var x = confirm( comRst0003 );
		if (x == true) {
	        document.loginForm.LOGIN_ID.value = '<c:out value="${commandMap.LOGIN_ID }" />';
	        document.loginForm.LOGIN_PWD.value = '<c:out value="${commandMap.LOGIN_PWD }" />';
	        document.loginForm.reLogin.value = 'Y';
	        document.loginForm.submit();
		}
	}
</script>

<form name="shForm" method="post" action="/sys/com/Common/getPublicBrdSearch.do" >
	<input type="hidden" name="SEQ" value="">
</form>

<iframe name="hiddenFrame" frameBorder="0" style="width:0px; height:0px; border:0;"></iframe>

</body>
</html>