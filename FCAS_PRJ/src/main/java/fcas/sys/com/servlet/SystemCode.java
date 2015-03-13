package fcas.sys.com.servlet;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

import fcas.sys.com.db.QueryManager;
import fcas.sys.com.utl.CommonUtil;

/**
 * @logicalName   Common Code를 관리.
 * @description   Common Code를 관리한다.
 * @version       $Rev: 1.0 $
 */
public class SystemCode{
	/* CD_TYPE, CD, CD_TYPE_DESC, CD_DESC, DISP_ORDR, UP_CD_TYPE, UP_CD, USE_YN */
	private static ConcurrentHashMap<String, List> codeMap = null;
	private static SystemCode codeObj = null;
	private String jdbcUrl = "";
	private String dbId = "";
	private String dbPass = "";
	
	private SystemCode(){
		codeMap = new ConcurrentHashMap<String, List>();
	}
	
	/**
	 * 
	 * @return SystemCode
	 * @exception 
	 */
	public static SystemCode getInstance(){
		if (codeObj == null) {
			codeObj = new SystemCode();
		}
		return codeObj;
	}
	
	/**
	 * 기존에 적재되어있는 Common Code를 초기화하고, DB에 있는 Common Code를 Load하여 적재한다.
	 * @return 
	 * @exception 
	 */	
	public void initCode(String dbUrl, String dbId, String dbPass){
		this.jdbcUrl = dbUrl;
		this.dbId = dbId;
		this.dbPass = dbPass;
		initCode();
	}
	
	/**
	 * 기존에 적재되어있는 Common Code를 초기화하고, DB에 있는 Common Code를 Load하여 적재한다.
	 * @return 
	 * @exception 
	 */	
	public void initCode(){
		Connection conn = null;
		ResultSet rset = null;
		Statement stmt = null;
		QueryManager.getInstance();
		try {
			String sqlStr = "SELECT * FROM FCA_CODE ORDER BY CD_TYPE, DISP_ORDR, CD";
			conn = QueryManager.getConnection(jdbcUrl, dbId, dbPass);
			stmt = conn.createStatement();
			rset = stmt.executeQuery(sqlStr);
			
			codeMap.clear();
			
			List tList = null;
			String sCdType = "";
			String tCdType = "";
			
			int i = 0;
			while (rset.next()) {
				if (i == 0) {
					sCdType = rset.getObject(1).toString();
					tList = new ArrayList();
				}
				HashMap<String, Object> tMap = new HashMap<String, Object>();
				tCdType = rset.getObject(1).toString();
				tMap.put("CD_TYPE", tCdType);
				tMap.put("CD", CommonUtil.getObjToString(rset.getObject(2)));
				tMap.put("CD_TYPE_DESC", CommonUtil.getObjToString(rset.getObject(3)));
				tMap.put("CD_DESC", CommonUtil.getObjToString(rset.getObject(4)));
				tMap.put("DISP_ORDR", CommonUtil.getObjToString(rset.getObject(5)));
				tMap.put("UP_CD_TYPE", CommonUtil.getObjToString(rset.getObject(6)));
				tMap.put("UP_CD", CommonUtil.getObjToString(rset.getObject(7)));
				tMap.put("USE_YN", CommonUtil.getObjToString(rset.getObject(8)));
				
				if (!sCdType.equals(tCdType)) {
					setCode(sCdType, tList);
					tList = new ArrayList();
				}
				
				tList.add(tMap);
				
				sCdType = tCdType;
				i++;
			}
			setCode(sCdType, tList);
			System.out.println(codeMap.size() + "건의 CODE를 동기화하였습니다.");
		} catch(Exception ex) {
			System.out.println("CODE 동기화에 실패하였습니다.");
			ex.printStackTrace();
		} finally {
			QueryManager.closeAll(rset, stmt, conn);
		}
	}
	
	/**
	 * 기존에 적재되어있는 Common Code에서 CD_TYPE을 찾아 Object로 치환한다.
	 * @param cdType
	 * @param cdList 
	 * @return 
	 * @exception 
	 * @notice CD_TYPE이 존재하지 않을 경우 작업을 하지 않는다.
	 */		
	public static void setCode(String cdType, List cdList){
		if (codeMap.get(cdType) != null) {
			codeMap.remove(cdType);
		}
		codeMap.put(cdType, cdList);
	}
	
	/**
	 * Common Code를 찾아 String을 Return 한다.
	 * @param cdType
	 * @return String
	 * @exception 
	 * @notice CD_TYPE이  존재하지 않을 경우 NULL을 Return 한다.
	 */
	public static String getCode(String cdType){
		if (codeMap.get(cdType) != null) {
			return CommonUtil.getJsonFromList(codeMap.get(cdType));
		} else {
			return null;
		}
	}
}
