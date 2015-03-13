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
import fcas.cus.fad.service.CompChartService;
import fcas.sys.com.dao.CommonDAO;
import fcas.sys.com.servlet.SystemMsg;
import fcas.sys.com.utl.CommonUtil;

/**
 * @logicalName   Compare Chart Service Impl.
 * @description
 * @version       $Rev: 1.0 $
 */
@Service("compchartService")
public class CompChartServiceImpl extends AbstractServiceImpl implements CompChartService {

    @Resource(name="commonDAO")
    private CommonDAO commonDAO;

    /**
	 * Compare Chart Query를 생성한다.
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
    	if (sDiv.equals("1")) { //입장/체류객수
    		fromTable = "FCA_DAILY_STATS_CNT";
    	} else if (sDiv.equals("2") || sDiv.equals("3")) { //성별 입장객수, 연령대별 입장객수
    		fromTable = "FCA_DAILY_STATS_CLASS";
    	} else if (sDiv.equals("4") || sDiv.equals("5")) { //시간대별 입장객수, 시간대별 체류객수
    		fromTable = "FCA_TIMES_STATS_CNT";
    	} else { //시간대별-성별 입장객수
    		fromTable = "FCA_TIMES_STATS_CLASS";
    	}

    	if (sDiv.equals("1") || sDiv.equals("2") || sDiv.equals("3")) { //입장/체류객수, 별 입장객수, 연령대별 입장객수
    		for (int j=0; j<2; j++) {
    			if (j > 0) {
    				sQuery.append(" UNION ALL ");
    			}

    			sQuery.append(" SELECT ");
        		for (int i=0; i<keyFieldArray.length; i++) {
        			if (keyFieldArray[i].equals("DIV_NM")) {
        				if (j == 0) {
        					sQuery.append("'기준' AS 'DIV_NM' , ");
        				} else {
        					sQuery.append("'비교' AS 'DIV_NM' , ");
        				}
        			} else {
        				sQuery.append(keyFieldArray[i] + " , ");
        			}

        			/* 성별, 연령대별 */
        			if (keyFieldArray[i].equals("SEX_CD")) {
        				sQuery.append("dbo.FN_CODE_NM('sex_cd',SEX_CD) AS 'SEX_NM', ");
        			} else if (keyFieldArray[i].equals("AGE_CD")) {
        				sQuery.append("dbo.FN_CODE_NM('age_cd',AGE_CD) AS 'AGE_NM', ");
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
        						if (key.indexOf("STND_DATE") < 0) {
    								sQuery.append(" AND " + key + " = '" + model.get(key).toString() + "' ");
    							}
        					}
        				}
        			}
        		}

        		if (j == 0) {
        			sQuery.append("   AND STND_DATE >= '" + model.get("STND_DATE_F1").toString() + "' ");
            		sQuery.append("   AND STND_DATE <= '" + model.get("STND_DATE_T1").toString() + "' ");
        		} else {
        			sQuery.append("   AND STND_DATE >= '" + model.get("STND_DATE_F2").toString() + "' ");
            		sQuery.append("   AND STND_DATE <= '" + model.get("STND_DATE_T2").toString() + "' ");
        		}

        		sQuery.append(" AND STND_DATE NOT IN ");
        		sQuery.append("     (SELECT STND_DATE FROM FCA_SALES_INFO ");
        		sQuery.append("       WHERE COMP_ID   = '"+model.get("COMP_ID").toString()+"' ");
        		sQuery.append("         AND SHOP_ID   = '"+model.get("SHOP_ID").toString()+"' ");

        		if (j == 0) {
        			sQuery.append("         AND STND_DATE >= '" + model.get("STND_DATE_F1").toString() + "' ");
            		sQuery.append("         AND STND_DATE <= '" + model.get("STND_DATE_T1").toString() + "' ");
        		} else {
        			sQuery.append("         AND STND_DATE >= '" + model.get("STND_DATE_F2").toString() + "' ");
            		sQuery.append("         AND STND_DATE <= '" + model.get("STND_DATE_T2").toString() + "' ");
        		}

        		sQuery.append("         AND WORK_YN   = 'Y') ");

        		if (!keyFieldArray[0].equals("DIV_NM")) {
        			sQuery.append(" GROUP BY ");
        			for (int i=0; i<keyFieldArray.length; i++) {
        				sQuery.append(keyFieldArray[i]);
        				if (i < keyFieldArray.length-1) {
        					sQuery.append(" , ");
        				}
        			}
        		}
    		}

			sQuery.append(" ORDER BY ");
			for (int i=0; i<keyFieldArray.length; i++) {
				sQuery.append(keyFieldArray[i]);
				if (i < keyFieldArray.length-1) {
					sQuery.append(" , ");
				}
			}
    	} else if (sDiv.equals("4") || sDiv.equals("5")) { //시간대별 입장객수, 시간대별 체류객수
    		sQuery.append("SELECT A.TIME_CD ");
    		sQuery.append("     , dbo.FN_CODE_NM('time_cd',A.TIME_CD) AS 'TIME_NM' ");
    		sQuery.append("     , MAX(A." + sumAliasArray[0] + ") AS '" + sumAliasArray[0] + "' ");
    		sQuery.append("     , MAX(A." + sumAliasArray[1] + ") AS '" + sumAliasArray[1] + "' ");
    		sQuery.append("  FROM ( ");

    		for (int j=0; j<2; j++) {
    			if (j > 0) {
    				sQuery.append(" UNION ALL ");
    			}

    			sQuery.append("SELECT TIME_CD ");

    			if (j == 0) {
    				sQuery.append("     , CAST(ROUND(SUM(" + sumFieldArray[0] + ")/COUNT(DISTINCT STND_DATE),0) AS NUMERIC(10,0)) AS '" + sumAliasArray[0] + "' ");
            		sQuery.append("     , 0 AS '" + sumAliasArray[1] + "' ");
    			} else {
    				sQuery.append("     , 0 AS '" + sumAliasArray[0] + "' ");
    				sQuery.append("     , CAST(ROUND(SUM(" + sumFieldArray[1] + ")/COUNT(DISTINCT STND_DATE),0) AS NUMERIC(10,0)) AS '" + sumAliasArray[1] + "' ");
    			}

        		sQuery.append("  FROM " + fromTable);

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
    							if (key.indexOf("STND_DATE") < 0) {
    								sQuery.append(" AND " + key + " = '" + model.get(key).toString() + "' ");
    							}
    						}
    					}
    				}
    			}
        		if (j == 0) {
        			sQuery.append("   AND STND_DATE >= '" + model.get("STND_DATE_F1").toString() + "' ");
            		sQuery.append("   AND STND_DATE <= '" + model.get("STND_DATE_T1").toString() + "' ");
        		} else {
        			sQuery.append("   AND STND_DATE >= '" + model.get("STND_DATE_F2").toString() + "' ");
            		sQuery.append("   AND STND_DATE <= '" + model.get("STND_DATE_T2").toString() + "' ");
        		}

        		sQuery.append("   AND STND_DATE NOT IN ");
        		sQuery.append("       (SELECT STND_DATE FROM FCA_SALES_INFO ");
        		sQuery.append("         WHERE COMP_ID   = '"+model.get("COMP_ID").toString()+"' ");
        		sQuery.append("           AND SHOP_ID   = '"+model.get("SHOP_ID").toString()+"' ");

        		if (j == 0) {
        			sQuery.append("           AND STND_DATE >= '" + model.get("STND_DATE_F1").toString() + "' ");
            		sQuery.append("           AND STND_DATE <= '" + model.get("STND_DATE_T1").toString() + "' ");
        		} else {
        			sQuery.append("           AND STND_DATE >= '" + model.get("STND_DATE_F2").toString() + "' ");
            		sQuery.append("           AND STND_DATE <= '" + model.get("STND_DATE_T2").toString() + "' ");
        		}

        		sQuery.append("           AND WORK_YN   = 'Y') ");

        		sQuery.append(" GROUP BY TIME_CD ");
    		}

    		sQuery.append(" ) AS A ");
    		sQuery.append(" GROUP BY A.TIME_CD ");
    		sQuery.append(" ORDER BY A.TIME_CD ");
    	} else if (sDiv.equals("6") || sDiv.equals("7")) { //시간대별-성별 입장객수, 시간대별-연령대별 입장객수
    		sQuery.append("SELECT A.TIME_CD ");
    		sQuery.append("     , dbo.FN_CODE_NM('time_cd',A.TIME_CD) AS 'TIME_NM' ");
    		for (int i=0; i<sumAliasArray.length; i++) {
    			sQuery.append("     , MAX(A." + sumAliasArray[i] + ") AS '" + sumAliasArray[i] + "' ");
    		}
    		sQuery.append("  FROM ( ");

    		for (int j=0; j<2; j++) {
    			if (j > 0) {
    				sQuery.append(" UNION ALL ");
    			}

    			sQuery.append("SELECT TIME_CD ");

    			if (j == 0) {
    				int k = 0;
    				for (; k<sumAliasArray.length/2; k++) {
    					sQuery.append("     , CAST(ROUND(SUM(CASE WHEN "+caseField+" = '"+sumAliasArray[k].replace("CNT_A_", "")+"' THEN " + sumFieldArray[k] + " ELSE 0 END)/COUNT(DISTINCT STND_DATE),0) AS NUMERIC(10,0)) AS '" + sumAliasArray[k] + "' ");
    				}
    				for (; k<sumAliasArray.length; k++) {
    					sQuery.append("     , 0 AS '" + sumAliasArray[k] + "' ");
    				}
    			} else {
    				int k = 0;
    				for (; k<sumAliasArray.length/2; k++) {
    					sQuery.append("     , 0 AS '" + sumAliasArray[k] + "' ");
    				}
    				for (; k<sumAliasArray.length; k++) {
    					sQuery.append("     , CAST(ROUND(SUM(CASE WHEN "+caseField+" = '"+sumAliasArray[k].replace("CNT_B_", "")+"' THEN " + sumFieldArray[k] + " ELSE 0 END)/COUNT(DISTINCT STND_DATE),0) AS NUMERIC(10,0)) AS '" + sumAliasArray[k] + "' ");
    				}
    			}

    			sQuery.append("  FROM " + fromTable);

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
    							if (key.indexOf("STND_DATE") < 0) {
    								sQuery.append(" AND " + key + " = '" + model.get(key).toString() + "' ");
    							}
    						}
    					}
    				}
    			}

        		if (j == 0) {
        			sQuery.append("   AND STND_DATE >= '" + model.get("STND_DATE_F1").toString() + "' ");
            		sQuery.append("   AND STND_DATE <= '" + model.get("STND_DATE_T1").toString() + "' ");
        		} else {
        			sQuery.append("   AND STND_DATE >= '" + model.get("STND_DATE_F2").toString() + "' ");
            		sQuery.append("   AND STND_DATE <= '" + model.get("STND_DATE_T2").toString() + "' ");
        		}

        		sQuery.append("   AND STND_DATE NOT IN ");
        		sQuery.append("       (SELECT STND_DATE FROM FCA_SALES_INFO ");
        		sQuery.append("         WHERE COMP_ID   = '"+model.get("COMP_ID").toString()+"' ");
        		sQuery.append("           AND SHOP_ID   = '"+model.get("SHOP_ID").toString()+"' ");

        		if (j == 0) {
        			sQuery.append("           AND STND_DATE >= '" + model.get("STND_DATE_F1").toString() + "' ");
            		sQuery.append("           AND STND_DATE <= '" + model.get("STND_DATE_T1").toString() + "' ");
        		} else {
        			sQuery.append("           AND STND_DATE >= '" + model.get("STND_DATE_F2").toString() + "' ");
            		sQuery.append("           AND STND_DATE <= '" + model.get("STND_DATE_T2").toString() + "' ");
        		}

        		sQuery.append("           AND WORK_YN   = 'Y') ");

        		sQuery.append(" GROUP BY TIME_CD ");
    		}

    		sQuery.append(" ) AS A ");
    		sQuery.append(" GROUP BY A.TIME_CD ");
    		sQuery.append(" ORDER BY A.TIME_CD ");
    	}

		//System.out.println("sQuery : " + sQuery);
    	return sQuery;
    }

    /**
	 * Compare Chart를 조회한다.
	 * @param queryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView selectCompChart(Map<String, Object> model) throws Exception {
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





    /**
	 * Compare Chart Query를 생성한다.
	 * @param model
	 * @return StringBuilder
	 * @exception
	 */
    private StringBuilder getChartQueryNew(Map<String, Object> model){
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
    	if (sDiv.equals("1")) { //입장/체류객수
    		fromTable = "FCA_DAILY_STATS_CNT";
    	} else if (sDiv.equals("2") || sDiv.equals("3")) { //성별 입장객수, 연령대별 입장객수
    		for(int i = 0 ; i < sumFieldArray.length ; i++) {
    			sumFieldArray[i] = "ENTER_CNT";
    		}
    		fromTable = "FCA_DAILY_STATS_CLASS";
    	} else if (sDiv.equals("4") || sDiv.equals("5")) { //시간대별 입장객수, 시간대별 체류객수
    		fromTable = "FCA_TIMES_STATS_CNT";
    	} else { //시간대별-성별 입장객수
    		for(int i = 0 ; i < sumFieldArray.length ; i++) {
    			sumFieldArray[i] = "ENTER_CNT";
    		}
    		fromTable = "FCA_TIMES_STATS_CLASS";
    	}

    	if (sDiv.equals("1") || sDiv.equals("2") || sDiv.equals("3")) { //입장/체류객수, 별 입장객수, 연령대별 입장객수
    		for (int j=0; j<2; j++) {
    			if (j > 0) {
    				sQuery.append(" UNION ALL ");
    			}

    			sQuery.append(" SELECT ");
        		for (int i=0; i<keyFieldArray.length; i++) {
        			if (keyFieldArray[i].equals("DIV_NM")) {
        				if (j == 0) {
        					sQuery.append("'기준' AS 'DIV_NM' , ");
        				} else {
        					sQuery.append("'비교' AS 'DIV_NM' , ");
        				}
        			} else {
        				sQuery.append(keyFieldArray[i] + " , ");
        			}

        			/* 성별, 연령대별 */
        			if (keyFieldArray[i].equals("SEX_CD")) {
        				sQuery.append("dbo.FN_CODE_NM('sex_cd',SEX_CD) AS 'SEX_NM', ");
        			} else if (keyFieldArray[i].equals("AGE_CD")) {
        				sQuery.append("dbo.FN_CODE_NM('age_cd',AGE_CD) AS 'AGE_NM', ");
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
        						if (key.indexOf("STND_DATE") < 0) {
    								sQuery.append(" AND " + key + " = '" + model.get(key).toString() + "' ");
    							}
        					}
        				}
        			}
        		}

        		if (j == 0) {
        			sQuery.append("   AND STND_DATE >= '" + model.get("STND_DATE_F1").toString() + "' ");
            		sQuery.append("   AND STND_DATE <= '" + model.get("STND_DATE_T1").toString() + "' ");
        		} else {
        			sQuery.append("   AND STND_DATE >= '" + model.get("STND_DATE_F2").toString() + "' ");
            		sQuery.append("   AND STND_DATE <= '" + model.get("STND_DATE_T2").toString() + "' ");
        		}

        		sQuery.append(" AND STND_DATE NOT IN ");
        		sQuery.append("     (SELECT STND_DATE FROM FCA_SALES_INFO ");
        		sQuery.append("       WHERE COMP_ID   = '"+model.get("COMP_ID").toString()+"' ");
        		sQuery.append("         AND SHOP_ID   = '"+model.get("SHOP_ID").toString()+"' ");

        		if (j == 0) {
        			sQuery.append("         AND STND_DATE >= '" + model.get("STND_DATE_F1").toString() + "' ");
            		sQuery.append("         AND STND_DATE <= '" + model.get("STND_DATE_T1").toString() + "' ");
        		} else {
        			sQuery.append("         AND STND_DATE >= '" + model.get("STND_DATE_F2").toString() + "' ");
            		sQuery.append("         AND STND_DATE <= '" + model.get("STND_DATE_T2").toString() + "' ");
        		}

        		sQuery.append("         AND WORK_YN   = 'Y') ");

        		if (!keyFieldArray[0].equals("DIV_NM")) {
        			sQuery.append(" GROUP BY ");
        			for (int i=0; i<keyFieldArray.length; i++) {
        				sQuery.append(keyFieldArray[i]);
        				if (i < keyFieldArray.length-1) {
        					sQuery.append(" , ");
        				}
        			}
        		}
    		}

			sQuery.append(" ORDER BY ");
			for (int i=0; i<keyFieldArray.length; i++) {
				sQuery.append(keyFieldArray[i]);
				if (i < keyFieldArray.length-1) {
					sQuery.append(" , ");
				}
			}
    	} else if (sDiv.equals("4") || sDiv.equals("5")) { //시간대별 입장객수, 시간대별 체류객수
    		sQuery.append("SELECT A.TIME_CD ");
    		sQuery.append("     , dbo.FN_CODE_NM('time_cd',A.TIME_CD) AS 'TIME_NM' ");
    		sQuery.append("     , MAX(A." + sumAliasArray[0] + ") AS '" + sumAliasArray[0] + "' ");
    		sQuery.append("     , MAX(A." + sumAliasArray[1] + ") AS '" + sumAliasArray[1] + "' ");
    		sQuery.append("  FROM ( ");

    		for (int j=0; j<2; j++) {
    			if (j > 0) {
    				sQuery.append(" UNION ALL ");
    			}

    			sQuery.append("SELECT TIME_CD ");

    			if (j == 0) {
    				sQuery.append("     , CAST(ROUND(SUM(" + sumFieldArray[0] + ")/COUNT(DISTINCT STND_DATE),0) AS NUMERIC(10,0)) AS '" + sumAliasArray[0] + "' ");
            		sQuery.append("     , 0 AS '" + sumAliasArray[1] + "' ");
    			} else {
    				sQuery.append("     , 0 AS '" + sumAliasArray[0] + "' ");
    				sQuery.append("     , CAST(ROUND(SUM(" + sumFieldArray[1] + ")/COUNT(DISTINCT STND_DATE),0) AS NUMERIC(10,0)) AS '" + sumAliasArray[1] + "' ");
    			}

        		sQuery.append("  FROM " + fromTable);

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
    							if (key.indexOf("STND_DATE") < 0) {
    								sQuery.append(" AND " + key + " = '" + model.get(key).toString() + "' ");
    							}
    						}
    					}
    				}
    			}
        		if (j == 0) {
        			sQuery.append("   AND STND_DATE >= '" + model.get("STND_DATE_F1").toString() + "' ");
            		sQuery.append("   AND STND_DATE <= '" + model.get("STND_DATE_T1").toString() + "' ");
        		} else {
        			sQuery.append("   AND STND_DATE >= '" + model.get("STND_DATE_F2").toString() + "' ");
            		sQuery.append("   AND STND_DATE <= '" + model.get("STND_DATE_T2").toString() + "' ");
        		}

        		sQuery.append("   AND STND_DATE NOT IN ");
        		sQuery.append("       (SELECT STND_DATE FROM FCA_SALES_INFO ");
        		sQuery.append("         WHERE COMP_ID   = '"+model.get("COMP_ID").toString()+"' ");
        		sQuery.append("           AND SHOP_ID   = '"+model.get("SHOP_ID").toString()+"' ");

        		if (j == 0) {
        			sQuery.append("           AND STND_DATE >= '" + model.get("STND_DATE_F1").toString() + "' ");
            		sQuery.append("           AND STND_DATE <= '" + model.get("STND_DATE_T1").toString() + "' ");
        		} else {
        			sQuery.append("           AND STND_DATE >= '" + model.get("STND_DATE_F2").toString() + "' ");
            		sQuery.append("           AND STND_DATE <= '" + model.get("STND_DATE_T2").toString() + "' ");
        		}

        		sQuery.append("           AND WORK_YN   = 'Y') ");

        		sQuery.append(" GROUP BY TIME_CD ");
    		}

    		sQuery.append(" ) AS A ");
    		sQuery.append(" GROUP BY A.TIME_CD ");
    		sQuery.append(" ORDER BY A.TIME_CD ");
    	} else if (sDiv.equals("6") || sDiv.equals("7")) { //시간대별-성별 입장객수, 시간대별-연령대별 입장객수
    		sQuery.append("SELECT A.TIME_CD ");
    		sQuery.append("     , dbo.FN_CODE_NM('time_cd',A.TIME_CD) AS 'TIME_NM' ");
    		for (int i=0; i<sumAliasArray.length; i++) {
    			sQuery.append("     , MAX(A." + sumAliasArray[i] + ") AS '" + sumAliasArray[i] + "' ");
    		}
    		sQuery.append("  FROM ( ");

    		for (int j=0; j<2; j++) {
    			if (j > 0) {
    				sQuery.append(" UNION ALL ");
    			}

    			sQuery.append("SELECT TIME_CD ");

    			if (j == 0) {
    				int k = 0;
    				for (; k<sumAliasArray.length/2; k++) {
    					sQuery.append("     , CAST(ROUND(SUM(CASE WHEN "+caseField+" = '"+sumAliasArray[k].replace("CNT_A_", "")+"' THEN " + sumFieldArray[k] + " ELSE 0 END)/COUNT(DISTINCT STND_DATE),0) AS NUMERIC(10,0)) AS '" + sumAliasArray[k] + "' ");
    				}
    				for (; k<sumAliasArray.length; k++) {
    					sQuery.append("     , 0 AS '" + sumAliasArray[k] + "' ");
    				}
    			} else {
    				int k = 0;
    				for (; k<sumAliasArray.length/2; k++) {
    					sQuery.append("     , 0 AS '" + sumAliasArray[k] + "' ");
    				}
    				for (; k<sumAliasArray.length; k++) {
    					sQuery.append("     , CAST(ROUND(SUM(CASE WHEN "+caseField+" = '"+sumAliasArray[k].replace("CNT_B_", "")+"' THEN " + sumFieldArray[k] + " ELSE 0 END)/COUNT(DISTINCT STND_DATE),0) AS NUMERIC(10,0)) AS '" + sumAliasArray[k] + "' ");
    				}
    			}

    			sQuery.append("  FROM " + fromTable);

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
    							if (key.indexOf("STND_DATE") < 0) {
    								sQuery.append(" AND " + key + " = '" + model.get(key).toString() + "' ");
    							}
    						}
    					}
    				}
    			}

        		if (j == 0) {
        			sQuery.append("   AND STND_DATE >= '" + model.get("STND_DATE_F1").toString() + "' ");
            		sQuery.append("   AND STND_DATE <= '" + model.get("STND_DATE_T1").toString() + "' ");
        		} else {
        			sQuery.append("   AND STND_DATE >= '" + model.get("STND_DATE_F2").toString() + "' ");
            		sQuery.append("   AND STND_DATE <= '" + model.get("STND_DATE_T2").toString() + "' ");
        		}

        		sQuery.append("   AND STND_DATE NOT IN ");
        		sQuery.append("       (SELECT STND_DATE FROM FCA_SALES_INFO ");
        		sQuery.append("         WHERE COMP_ID   = '"+model.get("COMP_ID").toString()+"' ");
        		sQuery.append("           AND SHOP_ID   = '"+model.get("SHOP_ID").toString()+"' ");

        		if (j == 0) {
        			sQuery.append("           AND STND_DATE >= '" + model.get("STND_DATE_F1").toString() + "' ");
            		sQuery.append("           AND STND_DATE <= '" + model.get("STND_DATE_T1").toString() + "' ");
        		} else {
        			sQuery.append("           AND STND_DATE >= '" + model.get("STND_DATE_F2").toString() + "' ");
            		sQuery.append("           AND STND_DATE <= '" + model.get("STND_DATE_T2").toString() + "' ");
        		}

        		sQuery.append("           AND WORK_YN   = 'Y') ");

        		sQuery.append(" GROUP BY TIME_CD ");
    		}

    		sQuery.append(" ) AS A ");
    		sQuery.append(" GROUP BY A.TIME_CD ");
    		sQuery.append(" ORDER BY A.TIME_CD ");
    	}

		//System.out.println("sQuery : " + sQuery);
    	return sQuery;
    }

    /**
	 * Compare Chart를 조회한다.
	 * @param queryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView selectCompChartNew(Map<String, Object> model) throws Exception {
    	ArrayList<HashMap<String, Object>> tmpList = new ArrayList<HashMap<String, Object>>();
    	Connection conn = null;
    	Statement stmt = null;
    	try {
    		conn = commonDAO.getDataSource().getConnection();

    		stmt = conn.createStatement();
    		ResultSet rs = stmt.executeQuery(getChartQueryNew(model).toString());

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
