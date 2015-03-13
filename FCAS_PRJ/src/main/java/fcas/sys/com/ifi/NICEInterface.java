/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package fcas.sys.com.ifi;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.security.Security;
import java.util.Vector;
import javax.net.ssl.SSLSocket;
import javax.net.ssl.SSLSocketFactory;

/**
 *
 * @author zailot
 */
public class NICEInterface {

    /**
     * @param args the command line arguments
     */

    public static void main(String[] args) {
        NICEInterface niceIF = new NICEInterface();
        niceIF.requestOTPFromNICE();
        if(niceIF.isSuccessResponse()){
            System.out.println("-----------------------------");
            System.out.println(niceIF.getResponseCode());
            System.out.println(niceIF.getMessage());


            System.out.println(niceIF.getTockenKey());
            System.out.println("-----------------------------");
        }
    }

    public void requestOTPFromNICE(){
        // TODO code application logic here
        Security.addProvider(new com.sun.net.ssl.internal.ssl.Provider());
        SSLSocketFactory factory = (SSLSocketFactory)SSLSocketFactory.getDefault();
        SSLSocket soc = null;
        PrintWriter out = null;
        BufferedReader br = null;
        try{
            soc = (SSLSocket)factory.createSocket("www.nicebizmap.co.kr", 443);
            soc.setSoTimeout(10000);
            soc.setSoLinger(true, 10);
            soc.setKeepAlive(true);

            out = new PrintWriter(soc.getOutputStream());
            br = new BufferedReader(new InputStreamReader(soc.getInputStream()), 8*1024);
            NICEInterface.OTPResponse resultObj = getOTPResponse(out,br);
        }catch(IOException ioErr){
            ioErr.printStackTrace();
        }finally{
            try{
                if(out != null){
                    out.close();
                    out = null;
                }
            }catch(Exception e){}
            try{
                if(br != null){
                    br.close();
                    br = null;
                }
            }catch(Exception e){}
            try{
                if(soc != null){
                    soc.close();
                    soc = null;
                }
            }catch(Exception e){}
        }
    }

    public boolean isSuccessResponse() {
        return otpObj.isSuccessResponse();
    }
    public String getMessage() {
        return otpObj.getMessage();
    }
    public String getResponseCode() {
        return otpObj.getResponseCode();
    }
    public String getTockenKey() {
        return otpObj.getTockenKey();
    }

    private NICEInterface.OTPResponse otpObj = null;
    public OTPResponse getOTPResponse(PrintWriter out, BufferedReader in) throws IOException{
        StringBuffer sb = new StringBuffer();
        String contents = "corp_cd=A00400&corp_id=SIC&corp_pwd=footrace";
        out.println("POST https://www.nicebizmap.co.kr/getOTP.do HTTP/1.1");
        out.println("Host: www.nicebizmap.co.kr");
        out.println("Connection: Keep-Alive");
        out.println("Content-Type: application/x-www-form-urlencoded");
        out.println("Content-Length: " + contents.length());
        out.println();
        out.println(contents);
        out.println();
        out.flush();

        String line = null;
        int i=0;
        otpObj= new NICEInterface.OTPResponse();
        while((line = in.readLine()) != null){
            i++;
            if(i == 9) {
                sb.append(line);
                otpObj.parseResponse(line);
                break;
            }
        }
        return otpObj;
    }


    /**
     * 구분자와 같이 섞여있는 스트링문자열들을 파싱하여<br>
     * String[] 자료형으로 바꾸어줍니다.
     * 사용예: String strs[] = StringUtil.split("DE|||D|E","|");
     * 결과: strs[0]= [DE], strs[1]= [], strs[2]= [], strs[3]= [D], strs[4]= [E]
     * @param origns  구분자와 같이 섞여있는 스트링문자열
     * @param del     구분자 스트링문자열
     * @return       <code>Vector</code> 구분자에 의해 구별되도록 파싱된 데이터가 들어갈 자료형<br>
     * @since           JDK1.2
     */
    public static String[] split(String origns, String del){
        Vector <String>tmpVec = convertToVector(origns,del);
        int size = tmpVec.size();
        String strArr[] =new String[size];
        for(int i=0;i < size;i++) strArr[i] = tmpVec.get(i);
        return strArr;
    }
    /**
     * 구분자와 같이 섞여있는 스트링문자열들을 파싱하여<br>
     * java.util.Vector 자료형으로 바꾸어줍니다.
     * 사용예: Vector vec = StringUtil.convertToVector("DE|||D|E","|");
     * 결과: Vector(0)= [DE], Vector(1)= [], Vector(2)= [], Vector(3)= [D], Vector(4)= [E]
     * @param origns  구분자와 같이 섞여있는 스트링문자열
     * @param del     구분자 스트링문자열
     * @return       <code>Vector</code> 구분자에 의해 구별되도록 파싱된 데이터가 들어갈 자료형<br>
     * @since           JDK1.2
     */
    public static Vector<String> convertToVector(String origns, String del){
        Vector <String> retVec = null;
        try{
            int oldPos = 0,newPos=0;
            retVec = new Vector<String>();
            while((newPos = origns.indexOf(del,oldPos)) != -1){
                retVec.add(origns.substring(oldPos,newPos));
                oldPos = newPos+del.length();
            }
            retVec.add(origns.substring(oldPos,origns.length()));
        }catch(Exception psErr){
            psErr.printStackTrace();
            retVec = null;
        }
        return retVec;
    }
    private class OTPResponse {
        private String responseCode = "";
        private boolean isSuccessResponse = false;
        private String message = "";
        private String tockenKey = "";

        public OTPResponse(){

        }
        public void parseResponse(String resBody){
            if(resBody != null && resBody.length() > 0) {
                isSuccessResponse = true;
            }
            String msgs[] = split(resBody,"|");
            for(int i=0;i<msgs.length;i++){
                switch(i){
                    case 0:
                        responseCode = msgs[0];
                        break;
                    case 1:
                        message = msgs[1];
                        break;
                    case 2:
                        tockenKey = msgs[2];
                        break;
                }
            }
        }

        public boolean isSuccessResponse() {
            return isSuccessResponse;
        }
        public String getMessage() {
            return message;
        }
        public String getResponseCode() {
            return responseCode;
        }
        public String getTockenKey() {
            return tockenKey;
        }

        public String toString(){
            StringBuffer sb = new StringBuffer();
            sb.append("--------------- OTPResponse Descriptions ---------------");
            sb.append("responseCode: " + responseCode + "\n");
            sb.append("message: " + message + "\n");
            sb.append("tockenKey: " + tockenKey + "\n");
            sb.append("isSuccessResponse: " + isSuccessResponse + "\n");
            sb.append("--------------------------------------------------------");
            return  sb.toString();
        }
    }
}
