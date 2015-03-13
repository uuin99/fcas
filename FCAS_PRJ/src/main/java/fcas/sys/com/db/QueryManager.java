package fcas.sys.com.db;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

/**
 * @logicalName   DB를 Direct로 연결 시 사용.
 * @description   DB를 Direct로 연결 시 사용한다.
 * @version       $Rev: 1.0 $
 */
public class QueryManager {

    private static QueryManager manager = null;
    
	/**
	 * QueryManager 생성
	 * @return 
	 * @exception 
	 */	    
    public synchronized static QueryManager getInstance(){
        if (manager == null) {
            manager = new QueryManager();
        }
        return manager;
    }
	
	/**
	 * DB에 연결된 Connection을 호출한다.
	 * @return conn
	 * @exception exception 
	 */	        
	public static Connection getConnection(String dbUrl, String dbId, String dbPass) throws Exception {
        Connection conn = null;
        try {
        	Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
            return conn = DriverManager.getConnection(dbUrl,dbId,dbPass);
        } catch(Exception e) {
            e.printStackTrace();
            return conn;
        }
    }
	
	/**
	 * 열려있는 ResultSet, Statement, Connection을 일괄적으로 Close한다.
	 * @param rset
	 * @param stmt
	 * @param conn
	 * @return conn
	 * @exception exception 
	 */	 	
    public static void closeAll(ResultSet rset, Statement stmt, Connection conn) {
        if (rset != null) try { rset.close(); } catch (Exception e) { e.printStackTrace(); }
        if (stmt != null) try { stmt.close(); } catch (Exception e) { e.printStackTrace(); }
        if (conn != null) try { conn.close(); } catch (Exception e) { e.printStackTrace(); }
    }
}

