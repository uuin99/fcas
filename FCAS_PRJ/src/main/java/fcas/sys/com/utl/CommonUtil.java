package fcas.sys.com.utl;

import java.util.Map;
import java.util.HashMap;
import java.util.List;
import java.util.StringTokenizer;
import java.util.UUID;

import net.sf.json.JSON;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import net.sf.json.JSONSerializer;

import org.springframework.web.servlet.ModelAndView;
import egovframework.rte.psl.dataaccess.util.EgovMap;

import fcas.sys.com.exception.ServiceException;

import sun.misc.BASE64Decoder;
import sun.misc.BASE64Encoder;

/**
 * @logicalName   Common Utility.
 * @description   Common Utility.
 * @version       $Rev: 1.0 $
 */
public class CommonUtil {

	/**
	 * List를 Json 형태로 변환한다.
	 * @param list
	 * @param cnt
	 * @param bool
	 * @param msg
	 * @return ModelAndView
	 * @exception
	 */
	public static ModelAndView setJsonView(List list, Integer cnt, Boolean bool, String msg){
		ModelAndView view = new ModelAndView("jsonView");
		view.addObject("data", list);
    	view.addObject("total", cnt);
    	view.addObject("success", bool);
    	view.addObject("message", msg);
		return view;
	}

	/**
	 * Json을 List 형태로 변환한다.
	 * @param strJson
	 * @return List
	 * @exception
	 */
	public static List getListFromJson(String strJson) {
        if (strJson.length() > 0) {
            JSON json = JSONSerializer.toJSON(strJson);

            if (json instanceof JSONArray) {
                JSONArray jarray = (JSONArray) json;
                List paramList = JSONArray.toList(jarray, HashMap.class);

                return paramList;
            }
        }

        return null;
    }

	/**
	 * List를 Json String 형태로 변환한다.
	 * @param HashMapList
	 * @return String
	 * @exception
	 */
	public static String getJsonFromList(List list) {
        StringBuilder rStr = new StringBuilder("[");
        for (int i=0; i<list.size(); i++) {
            if (i == 0) {
            	rStr.append("");
            } else {
            	rStr.append(",");
            }
            HashMap map = (HashMap)list.get(i);
            JSONObject json = JSONObject.fromObject(map);
            rStr.append(json.toString());
        }
        rStr.append("]");

        return rStr.toString();
    }

	/**
	 * List를 Json String 형태로 변환한다.
	 * @param HashMapList
	 * @return String
	 * @exception
	 */
	public static String getJsonFromListEgovMap(List list) {
        StringBuilder rStr = new StringBuilder("[");
        for (int i=0; i<list.size(); i++) {
            if (i == 0) {
            	rStr.append("");
            } else {
            	rStr.append(",");
            }
            EgovMap map = (EgovMap)list.get(i);
            JSONObject json = JSONObject.fromObject(map);
            rStr.append(json.toString());
        }
        rStr.append("]");

        return rStr.toString();
    }

	/**
	 * Map를 Json String 형태로 변환한다.
	 * @param HashMapList
	 * @return String
	 * @exception
	 */
	public static String getJsonFromMap(Map data) {
	    JSONObject json = new JSONObject();
	    json.putAll( data );

        return json.toString();
    }

	/**
	 * File Upload 시 산정하는 File Unique Id를 산정.
	 * @param HashMapList
	 * @return String
	 * @exception
	 * @notice File Unique Id 정책을 사정에 따라 바뀔 수 있는 내용으로서 Common Util로 빼었음.
	 */
	public static String getFileUniqueId(){
		String retStr = "";
		retStr = UUID.randomUUID().toString();
		return retStr;
	}

	/**
	 * Object를 String으로 변환.
	 * @param Object
	 * @return String
	 * @exception
	 */
	public static String getObjToString(Object obj){
		return obj == null ? "" : obj.toString();
	}

	/**
	 * 문자열을 받아서 Encoding 후 리턴 한다.
	 * @param sOriginStr
	 * @return encording된 문자열
	 */

	public static String  base64Encoder(String sOriginStr){
		String sEncoderStr = "";
		try{
			BASE64Encoder encoder = new BASE64Encoder();
	        byte[] byStr=null;

	        byStr = sOriginStr.getBytes();
	        sEncoderStr = encoder.encode(byStr);
		}catch(Exception e){
			System.err.println(e);
		}
		return sEncoderStr;
	}

	/**
	 * 문자열을 받아서 Decoding 후 리턴 한다.
	 * @param sEncoderStr encording 된 문자열
	 * @return decoding된 문자열
	 */
	public static String  base64Decoder(String sEncoderStr){
		String sDecoderStr = "";
		try{
			BASE64Decoder decoder = new BASE64Decoder();
			byte[] byStr = null;

			byStr = decoder.decodeBuffer(sEncoderStr);
			sDecoderStr = new String(byStr);
		}catch(Exception e){
			System.err.println(e);
		}
		return sDecoderStr ;
	}

	/**
	 * Exception을 분석하여 기본적인 문제를 Message에 Mapping한다.
	 * @param ex 발생된 Exception
	 * @param dfMsgCd Default로 출력될 Message
	 * @return 분석하여 출력된 MessageCode
	 */
	public static String getExpToMsg(Exception ex, String dfMsgCd){
		String retMsg = "";
		//DB Error 정의.

		if (ex.getCause().getCause() instanceof com.microsoft.sqlserver.jdbc.SQLServerException) {
			com.microsoft.sqlserver.jdbc.SQLServerException se = (com.microsoft.sqlserver.jdbc.SQLServerException)ex.getCause().getCause();
			int errCode = se.getErrorCode();// getSQLState();

			if (errCode == 2627) { //PRIMARY KEY 제약 조건 '{0}'을(를) 위반했습니다. 개체 '{1}'에 중복 키를 삽입할 수 없습니다.
				retMsg = "COM_ERR_0052"; //중복되는 Data가 존재합니다.
			} else if (errCode == 515) { //테이블 '{0}', 열 '{1}'에 NULL 값을 삽입할 수 없습니다. 열에는 NULL을 사용할 수 없습니다. {2}이(가) 실패했습니다.
				retMsg = "COM_ERR_0062"; //입력된 값 중 필수 입력이 누락되었습니다.
			} else if (errCode == 8152) { //문자열이나 이진 데이터는 잘립니다.
				retMsg = "COM_ERR_0056"; //입력된 값 중 최대 입력값을 넘은 필드가 존재합니다.
			} else {
				retMsg = "COM_ERR_0053"; //알 수 없는 데이터베이스 문제가 발생하였습니다. 담당자에게 문의하여 주시기 바랍니다.
			}
			/*if ("23000".equals(sqlStat)) { //Key.
				retMsg = "COM_ERR_0052"; //중복되는 Data가 존재합니다.
			} else if("22001".equals(sqlStat)){ //DB Column Size Over
				retMsg = "COM_ERR_0056"; //입력된 데이터 값 중 필드의 최대 입력값을 넘은 필드가 존재합니다.
			} else {
				retMsg = "COM_ERR_0053"; //알 수 없는 데이터베이스 문제가 발생하였습니다. 담당자에게 문의하여 주시기 바랍니다.
			}*/
		} else {
			retMsg = dfMsgCd;
		}

		return  retMsg ;
	}

	public static String  getExpToMsg(Exception ex){

		return  getExpToMsg(ex, "COM_ERR_0051"); //요청하신 처리를 실패하였습니다.
	}

    public static java.util.Date getBeforeDay( java.util.Date today, int day ) {
    	int calDay = day * 1000;
    	if ( today == null )
    		throw new IllegalStateException ( "today is null" );
    	java.util.Date rday = new java.util.Date ( );
    	rday.setTime ( today.getTime ( ) - ( (long) calDay * 60 * 60 * 24 ) );

    	return rday;
    }


    // 렉스퍼트 사용시.. xml 생성할떄 .do로 보내는 get방식 파라미터가 1개 밖에 안가져서 String 형태로 보내서 map으로 바꿔서 사용하기 위해 만듬..
    public static Map getStringToHashMap( String paramVal , String del1 , String del2 )  {
    	Map result = new HashMap();

		if (paramVal == null || paramVal.equals("")) {
			return result;
		}

		StringTokenizer tokenizer = new StringTokenizer(paramVal, del1);
		do {
			if (!tokenizer.hasMoreTokens())
				break;
			String str = tokenizer.nextToken();

			int keyIndex = str.indexOf(del2);
			if (keyIndex != -1) {
				String key = str.substring(0, keyIndex);
				if (key != null) {
					key = key.trim();
					if (!result.containsKey(key)) {
						String strVal = str.substring(keyIndex + 1, str.length());
						result.put(key, strVal);
					}
				}
			}
		} while(true);

		return result;
    }
}
