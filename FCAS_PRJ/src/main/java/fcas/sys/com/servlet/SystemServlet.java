package fcas.sys.com.servlet;

import javax.print.attribute.standard.Severity;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;

/**
 * @logicalName   Common Code, Common Message Servlet.
 * @description   Common Code, Common Message를 Servlet으로 올린다.
 * @version       $Rev: 1.0 $
 */
public class SystemServlet extends HttpServlet {
	
	/**
	 * 초기화할 때 공통코드와 메세지의 인스턴스를 호출한다.
	 * @return 
	 * @exception 
	 */
	public void init(ServletConfig config) throws ServletException{
		String dbUrl = config.getInitParameter("jdbcUrl");
		String dbId = config.getInitParameter("id");
		String dbPass = config.getInitParameter("pass");
		SystemCode.getInstance(); //공통코드
		SystemCode.getInstance().initCode(dbUrl, dbId, dbPass);
		SystemMsg.getInstance(); //메세지
		SystemMsg.getInstance().initMsg(dbUrl, dbId, dbPass);
	}
}
