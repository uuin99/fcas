package fcas.sys.com.scheduling;

import java.sql.Connection;
import org.apache.commons.dbcp.BasicDataSource;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.scheduling.quartz.QuartzJobBean;

public class SchedulingSample extends QuartzJobBean {
	
	BasicDataSource dataSource = new BasicDataSource();
	
	private String name;
	private Connection getDataSourceConnection() throws Exception{
		Connection conn = dataSource.getConnection();
		return conn;
	}
	public void setName(String name) {
		this.name = name;
	}
	
	@Override
	protected void executeInternal(JobExecutionContext arg0)
			throws JobExecutionException {
		Connection conn = null;
		try{
			System.out.println("Quartz Test : " + name);
			conn = getDataSourceConnection();			
			System.out.println("Quartz Connection : " + conn.toString());
		}catch (Exception e) {
			e.printStackTrace();
		}finally{
			try{
				if(conn != null){conn.close(); conn = null;} 
			}catch (Exception e) {
				// TODO: handle exception
			}
		}

	}
	 
}
