<%
/**
 * Send Message
 * success : Code=>0, CodeMsg=>Success!!, LastPoint=>9999
 * fail 1  : Code=>100, CodeMsg=>Not Registered ID
 * fail 2  : Code=>200, CodeMsg=>Not Enough Point
 * fail 3  : Code=>300, CodeMsg=>Login Fail
 * fail 4  : Code=>400, CodeMsg=>No Valid Number
 * fail 5  : Code=>500, CodeMsg=>No Valid Message
 * fail 6  : Code=>600, CodeMsg=>Auth Fail
 * fail 7  : Code=>700, CodeMsg=>Invalid Recall Number
 */
%>
<%@ page import = "whois.whoisSMS,java.util.*,java.text.*" session="true" contentType="text/html;charset=utf-8" %>
<jsp:useBean id="whois_sms" class="whois.whoisSMS" scope="session"/>
<jsp:setProperty name="whois_sms" property="*"/>
<h3>문자발송</h3>
<%
// 문자발송
/*
* 후이즈와 계약한 아이디와 패스워드로 아래 값을 변경해서 사용해주세요
*/

String sms_id = "smstest";
String sms_passwd = "smstest";
String sms_type = "L";	// 설정 하지 않는다면 80byte 넘는 메시지는 쪼개져서 sms로 발송, L 로 설정하면 80byte 넘으면 자동으로 lms 변환

// 로그인
whois_sms.login (sms_id, sms_passwd);

/*
* 문자발송에 필요한 발송정보
*/
// 받는사람번호
String sms_to = request.getParameter("sms_to");
// 보내는 사람번호
String sms_from = request.getParameter("sms_from");
// 발송예약시간 (현재시간보다 작거나 같으면 즉시 발송이며 현재시간보다 10분이상 큰경우는 예약발송입니다.)
String sms_date = request.getParameter("sms_date");
// 보내는 메세지
String sms_msg = request.getParameter("sms_msg");
// 발송시간을 파라메터로 받지 못한경우 현재시간을 입력해줍니다.
if (sms_date == null) {
   SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss",Locale.KOREA);
   Date cNow = new Date();
   sms_date = sdf.format(cNow);
}

// UTF-8 설정
whois_sms.setUtf8();

// 파라메터 설정
whois_sms.setParams (sms_to,sms_from,sms_msg,sms_date, sms_type);

// 문자발송
whois_sms.emmaSend();

// 결과값 가져오기
int retCode = whois_sms.getRetCode();

// 발송결과 메세지
String retMessage = whois_sms.getRetMessage();

// 성공적으로 발송한경우 남은 문자갯수( 종량제 사용의 경우, 남은 발송가능한 문자수를 확인합니다.)
int retLastPoint = whois_sms.getLastPoint();

%>
받는사람번호 sms_to = <%= sms_to %><br>
보내는사람번호 sms_from =<%= sms_from %><br>
발송요청일자 sms_date = <%= sms_date %><br>
보내는 메세지 sms_msg = <%= sms_msg %><br>
=============================================<br>
결과 코드 retCode = <%= retCode %><br>
결과 메세지 retMessage = <%= retMessage %><br>
잔여포인트 retLastPoint = <%= retLastPoint %><br>