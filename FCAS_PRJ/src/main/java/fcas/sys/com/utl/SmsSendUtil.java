package fcas.sys.com.utl;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.Map;

import javax.annotation.Resource;

import whois.whoisSMS;
import fcas.mng.svc.service.SmsInfoMngtService;

public class SmsSendUtil {
		
	@Resource(name = "smsinfomngtService")
    private SmsInfoMngtService smsinfomngtService;
	
	private String retCode = "";
	private String retCodeMsg = "";
	private int retLastPoint = -1;
	private String smsSendDate= "";
	private java.util.Map<String, Object> model = null;
	private whoisSMS wsms = null;
	protected String smsId = "";
	protected String smsPass = ""; 
	protected String dftFromNum = "";
	
	public SmsSendUtil(String smstest
			 		 , String pSmsPass){
		smsId = smstest;
		smsPass = pSmsPass;
		dftFromNum = "";
	}
	
	public SmsSendUtil(String pSmsId
					 , String pSmsPass
					 , String pDftFromNum){
		smsId = pSmsId;
		smsPass = pSmsPass;
		dftFromNum = pDftFromNum;
	}
	
	public Map<String, Object> sendSms(String sms_to// 받는사람번호
					  , String sms_from// 보내는 사람번호
					  , String sms_date// 발송예약시간 (현재시간보다 작거나 같으면 즉시 발송이며 현재시간보다 10분이상 큰경우는 예약발송입니다.)
					  , String sms_msg// 보내는 메세지
					  , String sms_type// 설정 하지 않는다면 80byte 넘는 메시지는 쪼개져서 sms로 발송, L 로 설정하면 80byte 넘으면 자동으로 lms 변환
					  , String bizType
					  , String smsToId
					  , String smsTonm
					  , String regId
					  ){
			wsms = new whoisSMS();
			model = new java.util.HashMap<String, Object>();
			
			if(sms_from == null || "".equals(sms_from)){
				sms_from = dftFromNum;
			}
			
			if (sms_date == null || "".equals(sms_date.trim()) || "0".equals(sms_date.trim())) {
			   SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss",Locale.KOREA);
			   Date cNow = new Date();
			   sms_date = sdf.format(cNow);
			}
			
			wsms.login(smsId, smsPass);// 로그인
			wsms.setUtf8();// UTF-8 설정
			if(sms_type == null || "".equals(sms_type)){
				wsms.setParams (sms_to, sms_from, sms_msg, sms_date);
			}else {
				wsms.setParams (sms_to, sms_from, sms_msg, sms_date, sms_type);
			}
			
			wsms.emmaSend();
			
			smsSendDate = sms_date;
			retCode = String.valueOf(wsms.getRetCode());
			retCodeMsg = wsms.getRetMessage();
			retLastPoint = wsms.getLastPoint();
			
			model.put("SMS_TO", sms_to);
			model.put("SMS_FROM", sms_from);
			model.put("SMS_DATE", sms_date);
			model.put("SMS_MSG", sms_msg);
			model.put("SMS_TYPE", sms_type ==null ? "" : sms_type);
			model.put("RET_CODE", retCode);
			model.put("RET_MSG", retCodeMsg);
			model.put("RET_LAST_POINT", retLastPoint);
			model.put("BIZ_TYPE", bizType);
			model.put("SMS_TO_ID", smsToId == null ? "" : smsToId);
			model.put("SMS_TO_NM", smsTonm == null ? "" : smsTonm);
			model.put("REGI_ID", regId);
			
			return model;			
	}
	
	public Map<String, Object> sendSms(String sms_to// 받는사람번호
			  , String sms_from// 보내는 사람번호
			  , String sms_date// 발송예약시간 (현재시간보다 작거나 같으면 즉시 발송이며 현재시간보다 10분이상 큰경우는 예약발송입니다.)
			  , String sms_msg// 보내는 메세지
			  , String bizType
			  , String smsToId
			  , String smsTonm
			  , String regId
			  ){
		return sendSms(sms_to, sms_from, sms_date, sms_msg, null, bizType, smsToId, smsTonm, regId);
	}
	
	public String getSmsSendDate(){
		return smsSendDate;
	}
	
	public String getRetCode(){
		return retCode;
	}
	
	public String getRetCodeMsg(){
		return retCodeMsg;
	}
	
	public int getRetLastPoint(){
		return retLastPoint;
	}
}
