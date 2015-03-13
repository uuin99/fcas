<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8" import="java.sql.*" %>
<%@ page import="javax.servlet.http.*" %>
<%@ page import="java.util.ResourceBundle" %>
<%@ page import="java.util.Vector" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<%
String compId = (request.getParameter("compId") == null) ? "" : request.getParameter("compId");
if(compId.equals("")){
	compId = "CM00029";
}
%>


<html>
	<head>
	<!-- CSS goes in the document HEAD or added to your external stylesheet -->
	<style type="text/css">
	table.gridtable {
		font-family: verdana,arial,sans-serif;
		font-size:11px;
		color:#333333;
		border-width: 1px;
		border-color: #666666;
		border-collapse: collapse;
	}
	table.gridtable th {
		border-width: 1px;
		padding: 8px;
		border-style: solid;
		border-color: #666666;
		background-color: #dedede;
	}
	table.gridtable td {
		border-width: 1px;
		padding: 8px;
		border-style: solid;
		border-color: #666666;
		background-color: #ffffff;
	}
	</style>
	<!-- Table goes in the document BODY -->
		<title> FA장비상태확인 </title>
	</head>
	<body>

	<%
		java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("MM월dd일hh시");
		String today = sdf.format(new java.util.Date());
		Connection conn = null;
		Statement stmt = null;
		Statement stmt2 = null;
		ResultSet rs = null;
		ResultSet rs2 = null;
		ResourceBundle bundle = null;
		try	{
			bundle = ResourceBundle.getBundle("kjs");
			String url = bundle.getString("url");
			String dbid = bundle.getString("dbid");
			String dbpw = bundle.getString("dbpw");
			// DBConnection JDBC 드라이버 로드
			Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
			conn = DriverManager.getConnection(url, dbid, dbpw);

			String query2 = "select comp_id, comp_nm from fcatbs.dbo.fca_comp where comp_id in ('CM00029', 'CM00033', 'CM00034');";
			stmt2 = conn.createStatement();
			rs2 = stmt2.executeQuery(query2);
			Vector c_code = new Vector();
			Vector c_name = new Vector();
			while(rs2.next()){
				c_code.addElement(rs2.getString(1));
				c_name.addElement(rs2.getString(2));
    		}
 	%>
 		<h5 style="font-family:verdana;"> <%=today%>
		<select name="comp_select" onChange="document.location='./pcinfoselect.jsp?compId='+this.value;">
		<%
			String strselected;
			for(int j=0;j<c_code.size();j++){
				if( compId.equals(c_code.elementAt(j).toString())){
					strselected = "selected";
				} else {
					strselected = "";
				}
			%>
			<option value="<%=c_code.elementAt(j)%>" <%=strselected%>><%=c_name.elementAt(j)%></option>
			<%
			}
		%>
		</select>
		현재 측정장비 상태 </h5>
		<table class="gridtable">
		<tr>
			<th> NO </th>
			<th> 매장 </th>
			<th> 카메라그룹 </th>
			<th> 카메라ID </th>
			<th> 0 </th>
			<th> 1 </th>
			<th> 2 </th>
			<th> 3 </th>
			<th> 4 </th>
			<th> 5 </th>
			<th> 6 </th>
			<th> 7 </th>
			<th> 8 </th>
			<th> 9 </th>
			<th> 10</th>
			<th> 11</th>
			<th> 12</th>
			<th> 13</th>
			<th> 14</th>
			<th> 15</th>
			<th> 16</th>
			<th> 17</th>
			<th> 18</th>
			<th> 19</th>
			<th> 20</th>
			<th> 21</th>
			<th> 22</th>
			<th> 23</th>
		</tr>
<%

			// Statement 객체를 통해서 쿼리를 수행
			StringBuffer query = new StringBuffer();
query.append(" select ROW_NUMBER() OVER (ORDER BY cmra_no) rnum, s.shop_nm as shop_nm, s.cmra_grp_nm as cmra_grp_nm, s.cmra_no as sid, ");
query.append(" 		isnull(f.t0 ,'X') as t0 ,isnull(f.t1 ,'X') as t1 ,isnull(f.t2 ,'X') as t2 ,isnull(f.t3 ,'X') as t3 , ");
query.append(" 		isnull(f.t4 ,'X') as t4 ,isnull(f.t5 ,'X') as t5 ,isnull(f.t6 ,'X') as t6 ,isnull(f.t7 ,'X') as t7 , ");
query.append(" 		isnull(f.t8 ,'X') as t8 ,isnull(f.t9 ,'X') as t9 ,isnull(f.t10,'X') as t10,isnull(f.t11,'X') as t11, ");
query.append(" 		isnull(f.t12,'X') as t12,isnull(f.t13,'X') as t13,isnull(f.t14,'X') as t14,isnull(f.t15,'X') as t15, ");
query.append(" 		isnull(f.t16,'X') as t16,isnull(f.t17,'X') as t17,isnull(f.t18,'X') as t18,isnull(f.t19,'X') as t19, ");
query.append(" 		isnull(f.t20,'X') as t20,isnull(f.t21,'X') as t21,isnull(f.t22,'X') as t22,isnull(f.t23,'X') as t23 ");
query.append(" from (select fcatbs.dbo.FN_SHOP_NM(fcatbs.DBO.FN_COMP_ID_BY_CMRA_NO(cmra_no),fcatbs.dbo.FN_SHOP_ID_BY_CMRA_NO(cmra_no)) as shop_nm, ");
query.append(" 	  fcatbs.dbo.FN_CMRA_GRP_NM(fcatbs.DBO.FN_CMRA_GRP_ID_BY_CMRA_NO(cmra_no),fcatbs.DBO.FN_COMP_ID_BY_CMRA_NO(cmra_no),fcatbs.dbo.FN_SHOP_ID_BY_CMRA_NO(cmra_no)) as cmra_grp_nm, cmra_no ");
query.append(" 	  from fcatbs.dbo.fca_eqip  ");
query.append(" 	  where comp_id = '"+compId+"') as s ");
query.append(" left outer join ");
query.append(" 	(select sid, min(t0 ) as t0, min(t1 ) as t1, min(t2 ) as t2, min(t3 ) as t3, min(t4 ) as t4, min(t5 ) as t5, min(t6 ) as t6, min(t7 ) as t7,  ");
query.append(" 			min(t8 ) as t8, min(t9 ) as t9, min(t10 ) as t10, min(t11 ) as t11, min(t12 ) as t12, min(t13 ) as t13, min(t14 ) as t14, min(t15 ) as t15,  ");
query.append(" 			min(t16 ) as t16, min(t17 ) as t17, min(t18 ) as t18, min(t19 ) as t19, min(t20 ) as t20, min(t21 ) as t21, min(t22 ) as t22, min(t23 ) as t23 ");
query.append("      from ( select  ");
query.append(" 			case when d.stime=0 and d.etc='OK' then 'O' when d.stime=0 and d.etc='NG' then '△' else 'X' end as t0,  ");
query.append(" 			case when d.stime=1 and d.etc='OK' then 'O' when d.stime=1 and d.etc='NG' then '△' else 'X' end as t1,  ");
query.append(" 			case when d.stime=2 and d.etc='OK' then 'O' when d.stime=2 and d.etc='NG' then '△' else 'X' end as t2,  ");
query.append(" 			case when d.stime=3 and d.etc='OK' then 'O' when d.stime=3 and d.etc='NG' then '△' else 'X' end as t3,  ");
query.append(" 			case when d.stime=4 and d.etc='OK' then 'O' when d.stime=4 and d.etc='NG' then '△' else 'X' end as t4,  ");
query.append(" 			case when d.stime=5 and d.etc='OK' then 'O' when d.stime=5 and d.etc='NG' then '△' else 'X' end as t5,  ");
query.append(" 			case when d.stime=6 and d.etc='OK' then 'O' when d.stime=6 and d.etc='NG' then '△' else 'X' end as t6,  ");
query.append(" 			case when d.stime=7 and d.etc='OK' then 'O' when d.stime=7 and d.etc='NG' then '△' else 'X' end as t7,  ");
query.append(" 			case when d.stime=8 and d.etc='OK' then 'O' when d.stime=8 and d.etc='NG' then '△' else 'X' end as t8,  ");
query.append(" 			case when d.stime=9 and d.etc='OK' then 'O' when d.stime=9 and d.etc='NG' then '△' else 'X' end as t9,  ");
query.append(" 			case when d.stime=10 and d.etc='OK' then 'O' when d.stime=10 and d.etc='NG' then '△' else 'X' end as t10,  ");
query.append(" 			case when d.stime=11 and d.etc='OK' then 'O' when d.stime=11 and d.etc='NG' then '△' else 'X' end as t11,  ");
query.append(" 			case when d.stime=12 and d.etc='OK' then 'O' when d.stime=12 and d.etc='NG' then '△' else 'X' end as t12,  ");
query.append(" 			case when d.stime=13 and d.etc='OK' then 'O' when d.stime=13 and d.etc='NG' then '△' else 'X' end as t13,  ");
query.append(" 			case when d.stime=14 and d.etc='OK' then 'O' when d.stime=14 and d.etc='NG' then '△' else 'X' end as t14,  ");
query.append(" 			case when d.stime=15 and d.etc='OK' then 'O' when d.stime=15 and d.etc='NG' then '△' else 'X' end as t15,  ");
query.append(" 			case when d.stime=16 and d.etc='OK' then 'O' when d.stime=16 and d.etc='NG' then '△' else 'X' end as t16,  ");
query.append(" 			case when d.stime=17 and d.etc='OK' then 'O' when d.stime=17 and d.etc='NG' then '△' else 'X' end as t17,  ");
query.append(" 			case when d.stime=18 and d.etc='OK' then 'O' when d.stime=18 and d.etc='NG' then '△' else 'X' end as t18,  ");
query.append(" 			case when d.stime=19 and d.etc='OK' then 'O' when d.stime=19 and d.etc='NG' then '△' else 'X' end as t19,  ");
query.append(" 			case when d.stime=20 and d.etc='OK' then 'O' when d.stime=20 and d.etc='NG' then '△' else 'X' end as t20,  ");
query.append(" 			case when d.stime=21 and d.etc='OK' then 'O' when d.stime=21 and d.etc='NG' then '△' else 'X' end as t21,  ");
query.append(" 			case when d.stime=22 and d.etc='OK' then 'O' when d.stime=22 and d.etc='NG' then '△' else 'X' end as t22,  ");
query.append(" 			case when d.stime=23 and d.etc='OK' then 'O' when d.stime=23 and d.etc='NG' then '△' else 'X' end as t23,  ");
query.append(" 			d.sid ");
query.append(" 			from (   ");
query.append(" 				select c.sid, datepart(hh,c.wdt) as stime, c.etc ");
query.append("   				from fcatbs.dbo.fca_eqip as b ");
query.append("   				inner join fcatbs.dbo.fca_pc_stat_test c ");
query.append("   				ON b.cmra_no = c.sid ");
query.append(" 				where b.comp_id = '"+compId+"' ");
query.append(" 				and c.wdt > CONVERT(VARCHAR(10), GETDATE(), 121) ");
query.append(" 			) d ) e ");
query.append(" 			group by sid ) as f ");
query.append(" On s.cmra_no = f.sid ");
			//System.out.println(query.toString());
			stmt = conn.createStatement();
			rs = stmt.executeQuery(query.toString());

			while(rs.next()){
				String rnum = rs.getString("rnum");
				String shop_nm = rs.getString("shop_nm");
				String cmra_grp_nm = rs.getString("cmra_grp_nm");
				String sid = rs.getString("sid");
				String t0 = rs.getString("t0");
				String t1 = rs.getString("t1");
				String t2 = rs.getString("t2");
				String t3 = rs.getString("t3");
				String t4 = rs.getString("t4");
				String t5 = rs.getString("t5");
				String t6 = rs.getString("t6");
				String t7 = rs.getString("t7");
				String t8 = rs.getString("t8");
				String t9 = rs.getString("t9");
				String t10 = rs.getString("t10");
				String t11 = rs.getString("t11");
				String t12 = rs.getString("t12");
				String t13 = rs.getString("t13");
				String t14 = rs.getString("t14");
				String t15 = rs.getString("t15");
				String t16 = rs.getString("t16");
				String t17 = rs.getString("t17");
				String t18 = rs.getString("t18");
				String t19 = rs.getString("t19");
				String t20 = rs.getString("t20");
				String t21 = rs.getString("t21");
				String t22 = rs.getString("t22");
				String t23 = rs.getString("t23");
%>
				<tr>
					<td> <%= rnum %> </td>
					<td> <%= shop_nm %> </td>
					<td> <%= cmra_grp_nm %> </td>
					<td> <%= sid %> </td>
					<td> <%= t0 %> </td>
					<td> <%= t1 %> </td>
					<td> <%= t2 %> </td>
					<td> <%= t3 %> </td>
					<td> <%= t4 %> </td>
					<td> <%= t5 %> </td>
					<td> <%= t6 %> </td>
					<td> <%= t7 %> </td>
					<td> <%= t8 %> </td>
					<td> <%= t9 %> </td>
					<td> <%= t10 %> </td>
					<td> <%= t11 %> </td>
					<td> <%= t12 %> </td>
					<td> <%= t13 %> </td>
					<td> <%= t14 %> </td>
					<td> <%= t15 %> </td>
					<td> <%= t16 %> </td>
					<td> <%= t17 %> </td>
					<td> <%= t18 %> </td>
					<td> <%= t19 %> </td>
					<td> <%= t20 %> </td>
					<td> <%= t21 %> </td>
					<td> <%= t22 %> </td>
					<td> <%= t23 %> </td>
				</tr>
<%
			}
		} catch(Exception e){
				e.printStackTrace();
		} finally {
			if(rs != null)
				try{rs.close();}catch(SQLException sqle){}
			if(stmt != null)
				try{stmt.close();}catch(SQLException sqle){}
			if(rs2 != null)
				try{rs.close();}catch(SQLException sqle){}
			if(stmt2 != null)
				try{stmt.close();}catch(SQLException sqle){}
			if(conn != null)
				try{conn.close();}catch(SQLException sqle){}
		}
%>
		</table>
	</body>
</html>
