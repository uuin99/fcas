package fcas.sys.com.servlet;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.concurrent.ConcurrentHashMap;

import net.sf.json.JSON;
import net.sf.json.JSONObject;
import net.sf.json.JSONString;

import fcas.sys.com.db.QueryManager;
import fcas.sys.com.utl.CommonUtil;

/**
 * @logicalName   Message Code를 관리.
 * @description   Message Code를 관리한다.
 * @version       $Rev: 1.0 $
 */
public class SystemMsg{
	
	private static ConcurrentHashMap<String, String> msgMap = null;
	private static SystemMsg msgObj = null;
	private String jdbcUrl = "";
	private String dbId = "";
	private String dbPass = "";

	/**
	 * SystemMsg 생성자
	 * @return 
	 * @exception 
	 */	
	private SystemMsg(){
		msgMap = new ConcurrentHashMap<String, String>();
	}
    
	/**
	 * 
	 * @return SystemMsg
	 * @exception 
	 */
	public static SystemMsg getInstance(){
		if (msgObj == null) {
			msgObj = new SystemMsg();
		}
		return msgObj;
	}
	
	/**
	 * 기존에 적재되어있는 Message Code를 초기화하고, DB에 있는 Message코드를 Load하여 적재한다.
	 * @param dbDrv
	 * @param dbUrl
	 * @param dbId
	 * @param dbPass
	 * @return 
	 * @exception 
	 */	
	public void initMsg(String dbUrl, String dbId, String dbPass){
		this.jdbcUrl = dbUrl;
		this.dbId = dbId;
		this.dbPass = dbPass;
		initMsg();
	}

	/**
	 * 기존에 적재되어있는 Message Code를 초기화하고, DB에 있는 Message코드를 Load하여 적재한다.
	 * @return 
	 * @exception 
	 */
	public void initMsg(){
		Connection conn = null;
		ResultSet rset = null;
		Statement stmt = null;
		QueryManager.getInstance();
		try {
			String sqlStr = "SELECT CD, CD_DESC FROM FCA_MSG";
			conn = QueryManager.getConnection(jdbcUrl, dbId, dbPass);
			stmt = conn.createStatement();
			rset = stmt.executeQuery(sqlStr);
			msgMap.clear();
			while (rset.next()) {
				setMsg(rset.getObject(1).toString(), CommonUtil.getObjToString(rset.getObject(2).toString()));
			}
			System.out.println(msgMap.size() + "건의 Message를 동기화하였습니다.");
		} catch(Exception ex) {
			System.out.println("동기화에 실패하였습니다.");
			ex.printStackTrace();
		} finally {
			QueryManager.closeAll(rset, stmt, conn);
		}
	}
	
	/**
	 * 기존에 적재되어있는 Message Code에서 Message Code를 찾아 msgDesc로 치환한다.
	 * @param msgCode
	 * @param msgDesc 
	 * @return 
	 * @exception 
	 * @notice msgCode가 존재할 경우에만 삭제한다.
	 */		
	public static void setMsg(String msgCode, String msgDesc){
		if (msgMap.get(msgCode) != null) {
			msgMap.remove(msgCode);
		}
		msgMap.put(msgCode, msgDesc);
	}
	
	/**
	 * 기존에 적재되어있는 Message Code에서 Message Code를 찾아 삭제한다.
	 * @param msgCode
	 * @return 
	 * @exception 
	 */		
	public static void removeMsg(String msgCode){
		msgMap.remove(msgCode);
	}
	
	/**
	 * Message Code를 찾아 Message Description을 Return 한다.
	 * @param msgCode
	 * @return msgDesc
	 * @exception 
	 * @notice msgCode가 존재하지 않을 경우 "NOT_FOUND_MESSAGE"를 출력한다.
	 */			
	public static String getMsg(String msgCode){ 
		if (msgMap.get(msgCode) != null) {
			return msgMap.get(msgCode);
		} else {
			return "NOT_FOUND_MESSAGE";
		}
	}
	
	/**
	 * Message Map을 Return 한다.
	 * @return String
	 * @exception 
	 */			
	public static String getMsgMap(){
		return JSONObject.fromObject(msgMap).toString();
	}
}
