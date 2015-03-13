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
import fcas.cus.fad.service.CondChartService;
import fcas.sys.com.dao.CommonDAO;
import fcas.sys.com.servlet.SystemMsg;
import fcas.sys.com.utl.CommonUtil;

/**
 * @logicalName   Present Condition Chart Service Impl.
 * @description
 * @version       $Rev: 1.0 $
 */
@Service("condchartService")
public class CondChartServiceImpl extends AbstractServiceImpl implements CondChartService {

    @Resource(name="commonDAO")
    private CommonDAO commonDAO;

    /**
	 * Present Condition Chart Query를 생성한다.
	 * @param model
	 * @return StringBuilder
	 * @exception
	 */
    private StringBuilder getChartQuery(Map<String, Object> model){
    	model.remove("limit");
    	model.remove("page");
    	model.remove("start");
    	model.remove("_dc");

    	StringBuilder sQuery = new StringBuilder();

    	String sDiv = model.get("DIV").toString();
    	model.remove("DIV");

    	String[] keyFieldArray = model.get("KEY_FIELDS").toString().split(",");
		model.remove("KEY_FIELDS");

		String caseField = model.get("CASE_FIELD").toString();
		model.remove("CASE_FIELD");

		String[] sumFieldArray = model.get("SUM_FIELDS").toString().split(",");
		model.remove("SUM_FIELDS");

		String[] sumAliasArray = model.get("SUM_ALIASES").toString().split(",");
		model.remove("SUM_ALIASES");

		String fromTable = "";
    	if (sDiv.equals("1") || sDiv.equals("4")) { //일별-입장객수, 월별-입장객수
    		fromTable = "FCA_DAILY_STATS_CNT";
    	} else {
    		fromTable = "FCA_DAILY_STATS_CLASS";
    	}

		sQuery.append(" SELECT ");
		for (int i=0; i<keyFieldArray.length; i++) {
			if (keyFieldArray[i].equals("STND_DATE")) {
				sQuery.append("SUBSTRING(STND_DATE,1,4)+'년'+SUBSTRING(STND_DATE,5,2)+'월'+SUBSTRING(STND_DATE,7,2)+'일' AS 'STND_DATE', ");
			} else if (keyFieldArray[i].equals("STND_YYMM")) {
				sQuery.append("SUBSTRING(STND_YYMM,1,4)+'년'+SUBSTRING(STND_YYMM,5,2)+'월' AS 'STND_YYMM', ");
			} else {
				sQuery.append(keyFieldArray[i] + " , ");
			}

			/* 성별, 연령대별, 요일별, 설치위치별, 이벤트별 */
			if (keyFieldArray[i].equals("SEX_CD")) {
				sQuery.append("dbo.FN_CODE_NM('sex_cd',SEX_CD) AS 'SEX_NM', ");
			} else if (keyFieldArray[i].equals("AGE_CD")) {
				sQuery.append("dbo.FN_CODE_NM('age_cd',AGE_CD) AS 'AGE_NM', ");
			} else if (keyFieldArray[i].equals("DOV_CD")) {
				sQuery.append("dbo.FN_CODE_NM('dov_cd',DOV_CD) AS 'DOV_NM', ");
			} else if (keyFieldArray[i].equals("CMRA_GRP_ID")) {
				sQuery.append("dbo.FN_CMRA_GRP_NM(CMRA_GRP_ID, COMP_ID, SHOP_ID) AS 'CMRA_GRP_NM', ");
			} else if (keyFieldArray[i].equals("EVNT_NO")) {
				sQuery.append("dbo.FN_EVNT_NM(COMP_ID, SHOP_ID, EVNT_NO) AS 'EVNT_NM', ");
			}
		}

		for (int i=0; i<sumFieldArray.length; i++) {
			if (caseField.equals("")) {
				sQuery.append("SUM("+sumFieldArray[i]+") AS '" + sumAliasArray[i] + "'");
			} else {
				sQuery.append("SUM(CASE WHEN "+caseField+" = '"+sumAliasArray[i].replace("_CNT", "")+"' THEN "+sumFieldArray[i]+" ELSE 0 END) AS '" + sumAliasArray[i] + "'");
			}
			if (i < sumFieldArray.length-1) {
				sQuery.append(" , ");
			}
		}

		sQuery.append(" FROM " + fromTable);

		sQuery.append(" WHERE 1 = 1 ");
		for (String key : model.keySet()) {
			if (!model.get(key).toString().equals("")) {
				String[] tmpStr = model.get(key).toString().split(",");
				if (tmpStr.length > 1) {
					sQuery.append(" AND " + key + " IN (");
					for (int i=0; i<tmpStr.length; i++) {
						if (i > 0) {
							sQuery.append(",");
						}
						sQuery.append("'" + tmpStr[i] + "'");
					}
					sQuery.append(")");
				} else {
					if (model.get(key).toString().equals("X")) {
						sQuery.append(" AND " + key + " <> 'T' ");
					} else if (model.get(key).toString().equals("XX")) {
						sQuery.append(" AND " + key + " <> 'TT' ");
					} else {
						sQuery.append(" AND " + key + " = '" + model.get(key).toString() + "' ");
					}
				}
			}
		}

		sQuery.append(" AND STND_DATE NOT IN ");
		sQuery.append("     (SELECT STND_DATE FROM FCA_SALES_INFO ");
		sQuery.append("       WHERE COMP_ID   = '"+model.get("COMP_ID").toString()+"' ");
		sQuery.append("         AND SHOP_ID   = '"+model.get("SHOP_ID").toString()+"' ");
		if (!model.get("STND_DATE").toString().equals("")) {
			sQuery.append("         AND STND_DATE = '"+model.get("STND_DATE").toString()+"' ");
		}
		if (!model.get("STND_YYMM").toString().equals("")) {
			sQuery.append("         AND STND_DATE LIKE '"+model.get("STND_YYMM").toString()+"%' ");
		}
		sQuery.append("         AND WORK_YN   = 'Y') ");

		sQuery.append(" GROUP BY ");
		for (int i=0; i<keyFieldArray.length; i++) {
			sQuery.append(keyFieldArray[i]);
			if (i < keyFieldArray.length-1) {
				sQuery.append(" , ");
			}
		}

		sQuery.append(" ORDER BY ");
		for (int i=0; i<keyFieldArray.length; i++) {
			sQuery.append(keyFieldArray[i]);
			if (i < keyFieldArray.length-1) {
				sQuery.append(" , ");
			}
		}
		//System.out.println("sQuery : " + sQuery);
    	return sQuery;
    }

    /**
	 * Present Condition Chart를 조회한다.
	 * @param queryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView selectCondChart(Map<String, Object> model) throws Exception {
    	ArrayList<HashMap<String, Object>> tmpList = new ArrayList<HashMap<String, Object>>();
    	Connection conn = null;
    	Statement stmt = null;
    	try {
    		conn = commonDAO.getDataSource().getConnection();

    		stmt = conn.createStatement();
    		ResultSet rs = stmt.executeQuery(getChartQuery(model).toString());

    		ResultSetMetaData rm = rs.getMetaData();
    		int columnCount = rm.getColumnCount();
    		ArrayList<String> colList = new ArrayList<String>();
    		ArrayList<Integer> typeList = new ArrayList<Integer>();
    		for(int i=1; i<=columnCount; i++) {
    			colList.add(rm.getColumnLabel(i));
    			typeList.add(new Integer(rm.getColumnType(i)));
    		}

    		HashMap<String, Object> tmpMap = null;
    		while (rs.next()) {
    			tmpMap = new HashMap<String, Object>();
    			for (int j=0; j<colList.size(); j++) {
    				if (typeList.get(j).intValue() == java.sql.Types.NUMERIC) {
    					tmpMap.put(colList.get(j), new Integer(rs.getInt(colList.get(j))));
        			} else {
        				tmpMap.put(colList.get(j), rs.getString(colList.get(j)));
        			}
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
}
