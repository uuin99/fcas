package fcas.cus.fad.service.impl;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.ModelAndView;

import egovframework.rte.fdl.cmmn.AbstractServiceImpl;
import fcas.cus.fad.service.ShopEnterMngtService;
import fcas.sys.com.dao.CommonDAO;
import fcas.sys.com.servlet.SystemMsg;
import fcas.sys.com.utl.CommonUtil;

/**
 * @logicalName   Shop Enter Management Service Impl.
 * @description
 * @version       $Rev: 1.0 $
 */
@Service("shopentermngtService")
public class ShopEnterMngtServiceImpl extends AbstractServiceImpl implements ShopEnterMngtService {

    @Resource(name="commonDAO")
    private CommonDAO commonDAO;
    
    /**
	 * Query를 조회한다.
	 * @param sQry
	 * @return ModelAndView
	 * @exception
	 */
    private ModelAndView getResult(StringBuilder sQry){
    	ArrayList<HashMap<String, Object>> tmpList = new ArrayList<HashMap<String, Object>>();
    	Connection conn = null;
    	Statement stmt = null;
    	try {
    		conn = commonDAO.getDataSource().getConnection();
    		
    		stmt = conn.createStatement();
    		ResultSet rs = stmt.executeQuery(sQry.toString());
    		
    		ResultSetMetaData rm = rs.getMetaData();
    		int columnCount = rm.getColumnCount();
    		ArrayList<String> colList = new ArrayList<String>();
    		for(int i=1; i<=columnCount; i++) {
    			colList.add(rm.getColumnLabel(i));
    		}
    		
    		HashMap<String, Object> tmpMap = null;
    		while (rs.next()) {
    			tmpMap = new HashMap<String, Object>();
    			for (int j=0; j<colList.size(); j++) {
    				tmpMap.put(colList.get(j), rs.getString(colList.get(j)));
    			}
    			tmpList.add(tmpMap);
    		}
    	} catch(Exception ex) {
    		CommonUtil.setJsonView(null, 0, false, SystemMsg.getMsg("COM_ERR_0016"));
    	} finally {
    		try {
    			if (stmt != null) {
    				stmt.close();
    				stmt = null;
    			}
    		} catch(Exception e) {}
    		
    		try {
    			if (conn != null) {
    				conn.close();
    				conn = null;
    			}
    		} catch (Exception e) {}
    	}
    	
        return CommonUtil.setJsonView(tmpList, tmpList.size(), true, "");
    }
    
    /**
	 * List를 조회한다.
	 * @param queryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView selectListTimeCd(Map<String, Object> model) throws Exception {
    	StringBuilder sQuery = new StringBuilder();
    	sQuery.append("SELECT DISTINCT TIME_CD ");
    	sQuery.append("     , dbo.FN_CODE_NM('time_cd',TIME_CD) AS 'TIME_NM' ");
    	sQuery.append("  FROM FCA_TIMES_STATS_CNT ");
    	sQuery.append(" WHERE COMP_ID = '"+model.get("COMP_ID").toString()+"' ");
    	sQuery.append("   AND STND_DATE = '"+model.get("STND_DATE").toString()+"' ");
    	sQuery.append(" ORDER BY TIME_CD");
    	
    	return getResult(sQuery);
    }

    /**
	 * List를 조회한다.
	 * @param queryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView selectListShopEnter(Map<String, Object> model) throws Exception {
    	String div = model.get("DIV").toString();
    	
    	StringBuilder sQuery = new StringBuilder();
    	
    	if (div.equals("TERM")) {
    		String[] sexFieldArray = model.get("SEX_FIELDS").toString().split(",");
    		String[] ageFieldArray = model.get("AGE_FIELDS").toString().split(",");
    		
    		sQuery.append("SELECT COMP_ID, SHOP_ID ");
    		sQuery.append("     , dbo.FN_SHOP_NM(COMP_ID, SHOP_ID) AS SHOP_NM ");
    		sQuery.append("     , SUM(CNT_ENTER) AS CNT_ENTER ");
    		sQuery.append("     , SUM(CNT_SUM) AS CNT_SUM ");
    		for (int i=0; i<sexFieldArray.length; i++) {
    			sQuery.append("     , SUM("+sexFieldArray[i]+") AS "+sexFieldArray[i]);
    		}
    		for (int i=0; i<ageFieldArray.length; i++) {
    			sQuery.append("     , SUM("+ageFieldArray[i]+") AS "+ageFieldArray[i]);
    		}
    		sQuery.append("  FROM ( ");
    		sQuery.append("SELECT A.COMP_ID, A.SHOP_ID ");
    		sQuery.append("     , SUM(CASE WHEN 'N'=ISNULL(B.WORK_YN,'N') THEN A.ENTER_CNT ELSE 0 END) AS CNT_ENTER ");
    		sQuery.append("     , 0 AS CNT_SUM ");
    		for (int i=0; i<sexFieldArray.length; i++) {
    			sQuery.append("     , 0 AS "+sexFieldArray[i]);
    		}
    		for (int i=0; i<ageFieldArray.length; i++) {
    			sQuery.append("     , 0 AS "+ageFieldArray[i]);
    		}
    		sQuery.append("  FROM FCA_DAILY_STATS_CNT AS A ");
    		sQuery.append("  LEFT OUTER JOIN FCA_SALES_INFO AS B ");
    		sQuery.append("    ON A.COMP_ID = B.COMP_ID ");
    		sQuery.append("   AND A.SHOP_ID = B.SHOP_ID ");
    		sQuery.append("   AND A.STND_DATE = B.STND_DATE ");
    		sQuery.append("   AND B.STND_DATE BETWEEN '"+model.get("STND_DATE_F").toString()+"' AND '"+model.get("STND_DATE_T").toString()+"' ");
    		sQuery.append(" WHERE A.COMP_ID = '"+model.get("COMP_ID").toString()+"' ");
    		sQuery.append("   AND A.STND_DATE BETWEEN '"+model.get("STND_DATE_F").toString()+"' AND '"+model.get("STND_DATE_T").toString()+"' ");
    		sQuery.append("   AND A.CMRA_GRP_ID = 'TT' ");
    		sQuery.append(" GROUP BY A.COMP_ID, A.SHOP_ID ");
    		sQuery.append(" UNION ");
    		sQuery.append("SELECT A.COMP_ID, A.SHOP_ID ");
    		sQuery.append("     , 0 AS CNT_ENTER ");
    		sQuery.append("     , SUM(CASE WHEN 'N'=ISNULL(B.WORK_YN,'N') THEN A.ENTER_CNT ELSE 0 END) AS CNT_SUM ");
    		for (int i=0; i<sexFieldArray.length; i++) {
    			sQuery.append("     , SUM(CASE WHEN SEX_CD='"+sexFieldArray[i].replace("CNT_", "")+"' THEN (CASE WHEN 'N'=ISNULL(B.WORK_YN,'N') THEN A.ENTER_CNT ELSE 0 END) ELSE 0 END) AS "+sexFieldArray[i]);
    		}
    		for (int i=0; i<ageFieldArray.length; i++) {
    			sQuery.append("     , SUM(CASE WHEN AGE_CD='"+ageFieldArray[i].replace("CNT_", "")+"' THEN (CASE WHEN 'N'=ISNULL(B.WORK_YN,'N') THEN A.ENTER_CNT ELSE 0 END) ELSE 0 END) AS "+ageFieldArray[i]);
    		}
    		sQuery.append("  FROM FCA_DAILY_STATS_CLASS AS A ");
    		sQuery.append("  LEFT OUTER JOIN FCA_SALES_INFO AS B ");
    		sQuery.append("    ON A.COMP_ID = B.COMP_ID ");
    		sQuery.append("   AND A.SHOP_ID = B.SHOP_ID ");
    		sQuery.append("   AND A.STND_DATE = B.STND_DATE ");
    		sQuery.append("   AND B.STND_DATE BETWEEN '"+model.get("STND_DATE_F").toString()+"' AND '"+model.get("STND_DATE_T").toString()+"' ");
    		sQuery.append(" WHERE A.COMP_ID = '"+model.get("COMP_ID").toString()+"' ");
    		sQuery.append("   AND A.STND_DATE BETWEEN '"+model.get("STND_DATE_F").toString()+"' AND '"+model.get("STND_DATE_T").toString()+"' ");
    		sQuery.append("   AND A.CMRA_GRP_ID = 'TT' ");
    		sQuery.append("   AND A.SEX_CD != 'T' ");
    		sQuery.append("   AND A.AGE_CD != 'TT' ");
    		sQuery.append(" GROUP BY A.COMP_ID, A.SHOP_ID ");
    		sQuery.append(") AS Z ");
    		sQuery.append(" WHERE 1 = 1 ");
    		sQuery.append(" GROUP BY COMP_ID, SHOP_ID ");
    		sQuery.append(" ORDER BY COMP_ID, SHOP_ID ");
    	} else {
    		String caseField = model.get("CASE_FIELD").toString();
        	String[] fieldArray = model.get("FIELDS").toString().split(",");
        	
    		sQuery.append("SELECT SHOP_ID, dbo.FN_SHOP_NM(COMP_ID, SHOP_ID) AS SHOP_NM ");
    		if (div.equals("TIME")) {
    			for (int i=2; i<fieldArray.length; i++) {
    				sQuery.append("     , SUM(CASE WHEN "+caseField+"='"+fieldArray[i].replace("CNT_", "")+"' THEN (CASE WHEN ENTER_CNT=-1000 THEN 0 ELSE ENTER_CNT END) ELSE 0 END) AS '"+fieldArray[i]+"' ");
    			}
    			sQuery.append("  FROM (SELECT A.COMP_ID, A.SHOP_ID, A.TIME_CD ");
    		} else if (div.equals("DAY")) {
    			for (int i=2; i<fieldArray.length; i++) {
    				sQuery.append("     , MAX(CASE WHEN "+caseField+"='"+fieldArray[i].replace("CNT_", "")+"' THEN (CASE WHEN ENTER_CNT=-1000 THEN 'Y' ELSE CONVERT(VARCHAR, ENTER_CNT) END) ELSE NULL END) AS '"+fieldArray[i]+"' ");
    			}
    			sQuery.append("  FROM (SELECT A.COMP_ID, A.SHOP_ID, A.STND_DATE ");
    		} else if (div.equals("MONTH")) {
    			for (int i=2; i<fieldArray.length; i++) {
    				sQuery.append("   , SUM(CASE WHEN "+caseField+"='"+fieldArray[i].replace("CNT_", "")+"' THEN (CASE WHEN ENTER_CNT=-1000 THEN 0 ELSE ENTER_CNT END) ELSE 0 END) AS '"+fieldArray[i]+"' ");
    			}
    			sQuery.append("  FROM (SELECT A.COMP_ID, A.SHOP_ID, A.STND_YYMM ");
    		}
    		sQuery.append("             , (CASE WHEN 'N'=ISNULL(B.WORK_YN,'N') THEN A.ENTER_CNT ELSE -1000 END) AS ENTER_CNT ");
    		if (div.equals("TIME")) {
    			sQuery.append("          FROM FCA_TIMES_STATS_CNT AS A ");
    		} else {
    			sQuery.append("          FROM FCA_DAILY_STATS_CNT AS A ");
    		}
    		sQuery.append("          LEFT OUTER JOIN FCA_SALES_INFO AS B ");
    		sQuery.append("            ON A.COMP_ID = B.COMP_ID ");
    		sQuery.append("           AND A.SHOP_ID = B.SHOP_ID ");
    		sQuery.append("           AND A.STND_DATE = B.STND_DATE ");
    		if (div.equals("TIME")) {
    			sQuery.append("           AND B.STND_DATE = '"+model.get("STND_DATE").toString()+"' ");
    		} else if (div.equals("DAY")) {
    			sQuery.append("           AND B.STND_DATE LIKE '"+model.get("STND_YYMM").toString()+"%' ");
    		} else if (div.equals("MONTH")) {
    			sQuery.append("           AND B.STND_DATE LIKE '"+model.get("STND_YYYY").toString()+"%' ");
    		}
    		sQuery.append("         WHERE A.COMP_ID = '"+model.get("COMP_ID").toString()+"' ");
    		if (div.equals("TIME")) {
    			sQuery.append("           AND A.STND_DATE = '"+model.get("STND_DATE").toString()+"' ");
    		} else if (div.equals("DAY")) {
    			sQuery.append("           AND A.STND_YYMM = '"+model.get("STND_YYMM").toString()+"' ");
    		} else if (div.equals("MONTH")) {
    			sQuery.append("           AND A.STND_YYMM LIKE '"+model.get("STND_YYYY").toString()+"%' ");
    		}
    		sQuery.append("           AND A.CMRA_GRP_ID = 'TT') AS Z ");
    		sQuery.append(" GROUP BY COMP_ID, SHOP_ID ");
    		sQuery.append(" ORDER BY COMP_ID, SHOP_ID ");
    	}
    	
    	return getResult(sQuery);
    }
}
