<%
/**
 * @author 심상도
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
<h3>월별 발송 통계</h3>
[발송한 날짜] : [성공 건수] / [실패 건수]<br />
<%
// 월별 발송 통계
/*
* 후이즈와 계약한 아이디와 패스워드로 아래 값을 변경해서 사용해주세요
*/
String sms_id = "smstest";
String sms_passwd = "smstest";

// 로그인
whois_sms.login (sms_id, sms_passwd);

// 파라메터 설정
whois_sms.setParams (2008, 11);	// whois_sms.setParams ([년도], [월]);

// 월별 발송 통계
whois_sms.emmaStatistic();

// 결과값 가져오기
int retCode = whois_sms.getRetCode();

// 발송결과 메세지
String retMessage = whois_sms.getRetMessage();

// 잔여 포인트
int retLastPoint = whois_sms.getLastPoint();

// 월별 발송 통계 출력
Hashtable mStatistic = whois_sms.getStatistic();

// Sort hashtable.
Vector v = new Vector(whois_sms.getStatistic().keySet());
Collections.sort(v);

for (Enumeration e = v.elements(); e.hasMoreElements();) {
    String key = (String)e.nextElement();
    String val = (String)whois_sms.getStatistic().get(key);
    out.print(key + " : " + val + "<br />");
}
%>
결과 코드 retCode = <%= retCode %><br>
결과 메세지 retMessage = <%= retMessage %><br>
잔여포인트 retLastPoint = <%= retLastPoint %><br>