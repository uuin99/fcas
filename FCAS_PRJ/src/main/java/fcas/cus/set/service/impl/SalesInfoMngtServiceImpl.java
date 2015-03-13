package fcas.cus.set.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.ModelAndView;

import egovframework.rte.fdl.cmmn.AbstractServiceImpl;
import egovframework.rte.fdl.idgnr.EgovIdGnrService;
import fcas.cus.set.service.SalesInfoMngtService;
import fcas.sys.com.model.LoginModel;
import fcas.sys.com.dao.CommonDAO;
import fcas.sys.com.exception.ServiceException;
import fcas.sys.com.servlet.SystemMsg;
import fcas.sys.com.utl.CommonUtil;
import fcas.sys.com.utl.SessionUtil;

/**
 * @logicalName   Sales Info Management Service Impl.
 * @description
 * @version       $Rev: 1.0 $
 */
@Service("salesinfomngtService")
public class SalesInfoMngtServiceImpl extends AbstractServiceImpl implements SalesInfoMngtService {

    @Resource(name="commonDAO")
    private CommonDAO commonDAO;

    /**
	 * List를 조회한다.
	 * @param queryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView selectListSalesInfoMngt(Map<String, Object> model) throws Exception {
        return commonDAO.selectListJsonView("salesinfomngt.getSalesInfo", model);
    }

    /**
	 * List를 조회한다.
	 * @param queryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView selectListSalesInfoDetlMngt(Map<String, Object> model) throws Exception {
        return commonDAO.selectListJsonView("salesinfomngt.getSalesInfoDetl", model);
    }

    /**
	 * 저장과 수정을 실행한다.
	 * @param iQueryId
	 * @param uQueryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView insertOrUpdateListSalesInfoMngt(Map<String, Object> model) throws Exception {
		ModelAndView view = new ModelAndView("jsonView");
		Integer extCnt = 0;

		LoginModel loginModel = SessionUtil.getInstance().getLoginModel();
    	Map pMap = null;
		List main_dataList = CommonUtil.getListFromJson(model.get("mainData").toString());
    	Map dtlResultMap = null;
    	List detail_dataList = CommonUtil.getListFromJson(model.get("detailData").toString());

		String mas_CompId = "";
		String mas_shopId = "";
		String mas_stndDate = "";

		String dtl_CompId = "";
		String dtl_shopId = "";
		String dtl_stndDate = "";


    	if (main_dataList != null && !main_dataList.isEmpty()) {
            for (int i=0; i<main_dataList.size(); i++) {
            	HashMap map = (HashMap) main_dataList.get(i);
            	map.put("USER_ID", loginModel.getUserId());
            	if (CommonUtil.getObjToString(map.get("BUY_CS_CNT")).equals("")) {
            		map.put("BUY_CS_CNT", "0");
            	} else {
            		if("Y".equals( map.get("WORK_YN").toString() ) ) {
            			throw new ServiceException( SystemMsg.getMsg("COM_ERR_0063") ); // 휴일이 체크되어 있으면 데이터를 입력할수 없습니다.
            		}
            	}
            	if (CommonUtil.getObjToString(map.get("SALES_AMT")).equals("")) {
            		map.put("SALES_AMT", "0");
            	} else {
            		if("Y".equals( map.get("WORK_YN").toString() ) ) {
            			throw new ServiceException( SystemMsg.getMsg("COM_ERR_0063") ); // 휴일이 체크되어 있으면 데이터를 입력할수 없습니다.
            		}
            	}
            	if (CommonUtil.getObjToString(map.get("STND_DATE")).equals("")) {
            		map.put("STND_DATE", map.get("DATE"));
            		extCnt += commonDAO.insertData("salesinfomngt.insertSalesInfo", map);
            	} else {
            		extCnt += commonDAO.updateData("salesinfomngt.updateSalesInfo", map);
            	}

            	// 위 MAST ROW 저장후 DTL ROW 가 있더라면.. DTL ROW 와 갯수가 맞는지 체크한다.
            	int cnt = (Integer)commonDAO.selectData("salesinfomngt.selectSalesDetlCount", map);

            	if(cnt != 0) {
            		// CNT 가 0 아 아닐때는 기존 DTL 값과 비교하여 갯수를 비교해서 틀리면 에러 발생한다
            		// 단, 시간대별 정보가 화면에서 넘어 온값일때는 무조건 화면에서 넘어온 값을 기준으로 MAST를 인서트 하기때문에... 에러 PASS 한다.
            		mas_CompId = map.get("COMP_ID").toString();
            		mas_shopId = map.get("SHOP_ID").toString();
            		mas_stndDate = map.get("STND_DATE").toString();

            		// detail_dataList
            		if ( detail_dataList.size() != 0 ) {
                		dtl_CompId = ((HashMap) detail_dataList.get(0)).get("COMP_ID").toString();
                		dtl_shopId = ((HashMap) detail_dataList.get(0)).get("SHOP_ID").toString();
                		dtl_stndDate = ((HashMap) detail_dataList.get(0)).get("STND_DATE").toString();
            		}

            		if(mas_CompId.equals(dtl_CompId) && mas_shopId.equals(dtl_shopId) && mas_stndDate.equals(dtl_stndDate) ) {

            			// sum 비교 로직 패스...

            		} else {

            			// 인서트 한것과 같은 key 로 dtl sum 값을 비교하여 틀리면 에러발생..
            			dtlResultMap = (Map)commonDAO.selectData("salesinfomngt.selectSalesDetlSum", map);

	        			if ( Integer.parseInt( dtlResultMap.get("SUM_BUY_CS_CNT").toString() ) !=  Integer.parseInt( map.get("BUY_CS_CNT").toString() ) ) {
	                    	throw new ServiceException( SystemMsg.getMsg("COM_ERR_0058") ); // 일자별정보의 구매고객수가 시간대별 정보의 구매고객수의 합과 맞지 않습니다.
	        			}

	        			if ( Integer.parseInt( dtlResultMap.get("SUM_SALES_AMT").toString() ) !=  Integer.parseInt( map.get("SALES_AMT").toString() ) ) {
	                    	throw new ServiceException( SystemMsg.getMsg("COM_ERR_0059") ); //일자별정보의 매출금액이 시간대별 정보의 매출금액의 합과 맞지 않습니다.
	        			}

            		}




            	}

            }
		}




    	if (detail_dataList != null && !detail_dataList.isEmpty()) {
            for (int i=0; i<detail_dataList.size(); i++) {
            	HashMap map = (HashMap) detail_dataList.get(i);
            	map.put("USER_ID", loginModel.getUserId());
            	if (CommonUtil.getObjToString(map.get("BUY_CS_CNT")).equals("")) {
            		map.put("BUY_CS_CNT", "0");
            	}
            	if (CommonUtil.getObjToString(map.get("SALES_AMT")).equals("")) {
            		map.put("SALES_AMT", "0");
            	}
            	if (CommonUtil.getObjToString(map.get("TIME_CD")).equals("")) {
            		map.put("TIME_CD", map.get("TIME"));
            		extCnt += commonDAO.insertData("salesinfomngt.insertSalesInfoDetl", map);
            	} else {
            		extCnt += commonDAO.updateData("salesinfomngt.updateSalesInfoDetl", map);
            	}
            }
            // dtl 인서트 update 종료후.. sum 값을 재 조회해서 mast 에 delete insert 해준다..
            // 단 , msater 의 휴일이면.... 휴일입력 금지 익셉션 발생..

        	pMap = new HashMap();
			pMap.put("COMP_ID", ((HashMap) detail_dataList.get(0)).get("COMP_ID").toString() );
			pMap.put("SHOP_ID", ((HashMap) detail_dataList.get(0)).get("SHOP_ID").toString() );
			pMap.put("STND_DATE", ((HashMap) detail_dataList.get(0)).get("STND_DATE").toString() );
			dtlResultMap = (Map)commonDAO.selectData("salesinfomngt.selectSalesDetlSum", pMap);


			Map iMap = new HashMap();
			iMap.put("COMP_ID", pMap.get("COMP_ID") );
			iMap.put("SHOP_ID", pMap.get("SHOP_ID") );
			iMap.put("STND_DATE", pMap.get("STND_DATE") );
			iMap.put("BUY_CS_CNT", dtlResultMap.get("SUM_BUY_CS_CNT") );
			iMap.put("SALES_AMT", dtlResultMap.get("SUM_SALES_AMT") );
			iMap.put("USER_ID", loginModel.getUserId());

			// 일단 기존일자가 휴일이면 무조건 에러 발생.. 휴일이 아니면... 인서트 ..
			String workYn = (String)commonDAO.selectData("salesinfomngt.selectSalesWorkYnInfo" , iMap);
			if (workYn == null || workYn.equals("N")) {
				iMap.put("WORK_YN", "N");
				commonDAO.deleteData("salesinfomngt.deleteSalesInfo", iMap);
				extCnt += commonDAO.insertData("salesinfomngt.insertSalesInfo", iMap);
			} else {
				throw new ServiceException( SystemMsg.getMsg("COM_ERR_0063") ); // 휴일이 체크되어 있으면 데이터를 입력할수 없습니다.
			}
		}


/* 변경점 로직




		Map dtlResultMap = null;
    	Map pMap = null;
    	String p_key = null;
    	if (detail_dataList != null && !detail_dataList.isEmpty()) {
            for (int i=0; i<detail_dataList.size(); i++) {
            	HashMap map = (HashMap) detail_dataList.get(i);
            	//System.out.println("->"+map);
            	map.put("USER_ID", loginModel.getUserId());
            	if (CommonUtil.getObjToString(map.get("BUY_CS_CNT")).equals("")) {
            		map.put("BUY_CS_CNT", "0");
            	}
            	if (CommonUtil.getObjToString(map.get("SALES_AMT")).equals("")) {
            		map.put("SALES_AMT", "0");
            	}
            	if (CommonUtil.getObjToString(map.get("TIME_CD")).equals("")) {
            		map.put("TIME_CD", map.get("TIME"));
            		extCnt += commonDAO.insertData("salesinfomngt.insertSalesInfoDetl", map);
            	} else {
            		extCnt += commonDAO.updateData("salesinfomngt.updateSalesInfoDetl", map);
            	}
            }

            // 시간별 정보 가 있다면 시간대별 구매 고객수와 매출금액의 sum값을  변수에 저장해 놓고 , 일자별 정보 저장시.. 화면에서 넘어온 값으로 저장하지 않고.
            // 시간별 정보의 sum  값을... 저장한다.
        	pMap = new HashMap();
			pMap.put("COMP_ID", ((HashMap) detail_dataList.get(0)).get("COMP_ID").toString() );
			pMap.put("SHOP_ID", ((HashMap) detail_dataList.get(0)).get("SHOP_ID").toString() );
			pMap.put("STND_DATE", ((HashMap) detail_dataList.get(0)).get("STND_DATE").toString() );
			dtlResultMap = (Map)commonDAO.selectData("salesinfomngt.selectSalesDetlSum", pMap);

			p_key = ((HashMap) detail_dataList.get(0)).get("STND_DATE").toString();

			Map iMap = new HashMap();
			iMap.put("COMP_ID", pMap.get("COMP_ID") );
			iMap.put("SHOP_ID", pMap.get("SHOP_ID") );
			iMap.put("STND_DATE", pMap.get("STND_DATE") );
			iMap.put("BUY_CS_CNT", dtlResultMap.get("SUM_BUY_CS_CNT") );
			iMap.put("SALES_AMT", dtlResultMap.get("SUM_SALES_AMT") );
			iMap.put("USER_ID", loginModel.getUserId());

			// 기존 휴일 정보가 날아갈수도 있으므로 지우기 전에 휴일 정보를 가져온후 삭제후 인서트 한다.
			//String workYn = (String)commonDAO.selectData("salesinfomngt.selectSalesWorkYnInfo" , iMap);
			//if (workYn == null) workYn = "N";
			//iMap.put("WORK_YN", workYn);
			//commonDAO.deleteData("salesinfomngt.deleteSalesInfo", iMap);
			//extCnt += commonDAO.insertData("salesinfomngt.insertSalesInfo", iMap);

			// 위로직 변경됨..
			// 일단 기존일자가 휴일이면 무조건 에러 발생.. 휴일이 아니면... 인서트 ..
			String workYn = (String)commonDAO.selectData("salesinfomngt.selectSalesWorkYnInfo" , iMap);
			if (workYn == null) {
				iMap.put("WORK_YN", "N");
				commonDAO.deleteData("salesinfomngt.deleteSalesInfo", iMap);
				extCnt += commonDAO.insertData("salesinfomngt.insertSalesInfo", iMap);
			} else {
				throw new ServiceException( SystemMsg.getMsg("COM_ERR_0063") ); // 휴일이 체크되어 있으면 데이터를 입력할수 없습니다.
			}

		}

    	//System.out.println(dtlResultMap);

    	if (main_dataList != null && !main_dataList.isEmpty()) {
            for (int i=0; i<main_dataList.size(); i++) {
            	HashMap map = (HashMap) main_dataList.get(i);
            	//System.out.println("->"+map);

            	map.put("USER_ID", loginModel.getUserId());

            	// dtl이 있다면 위에서 이미 인서트를 했기때문에.....
            	String nowKey = null;
            	if (CommonUtil.getObjToString(map.get("STND_DATE")).equals("")) {
            		nowKey = map.get("DATE").toString();
            	} else {
            		nowKey = map.get("STND_DATE").toString();
            	}
            	//System.out.println("nowKey:"+nowKey + " / p_key:"+p_key);
            	if (p_key != null && p_key.equals( nowKey ) ) {

            		// 단, 휴일 정보가 넘어왔을수도 있기때문에 휴일 정보만 업데이트 한다.
            		map.put("STND_DATE", nowKey );


            		if("Y".equals( map.get("WORK_YN").toString() ) ) {
            			throw new ServiceException( SystemMsg.getMsg("COM_ERR_0063") ); // 휴일이 체크되어 있으면 데이터를 입력할수 없습니다.
            		} else {
            			extCnt += commonDAO.updateData("salesinfomngt.updateSalesInfoCus", map);
            		}




            	} else { // dtl 이 없는 경우에는 기존 로직 수행....
	            	if (CommonUtil.getObjToString(map.get("BUY_CS_CNT")).equals("")) {
	            		map.put("BUY_CS_CNT", "0");
	            	} else {

	            		if("Y".equals( map.get("WORK_YN").toString() ) ) {
	            			throw new ServiceException( SystemMsg.getMsg("COM_ERR_0063") ); // 휴일이 체크되어 있으면 데이터를 입력할수 없습니다.
	            		} else {
		            		// DTL 이 없는 경우에는 반드시 기존에 있는 정보와 현재 넘어온 마스터 정보의 갯수를 체크해주어야한다..
		                	pMap = new HashMap();
		        			pMap.put("COMP_ID", map.get("COMP_ID").toString() );
		        			pMap.put("SHOP_ID", map.get("SHOP_ID").toString() );
		        			pMap.put("STND_DATE", map.get("DATE").toString() );
		        			dtlResultMap = (Map)commonDAO.selectData("salesinfomngt.selectSalesDetlSum", pMap);
		        			//System.out.println("test->"+  dtlResultMap.get("SUM_BUY_CS_CNT").toString() + " / " + map.get("BUY_CS_CNT").toString());
		        			//System.out.println("->dtlResultMap1:"+dtlResultMap);
		        			if( dtlResultMap.get("SUM_BUY_CS_CNT") != null ) {
			        			if ( Integer.parseInt( dtlResultMap.get("SUM_BUY_CS_CNT").toString() ) !=  Integer.parseInt( map.get("BUY_CS_CNT").toString() ) ) {
			                    	throw new ServiceException( SystemMsg.getMsg("COM_ERR_0058") ); // 일자별정보의 구매고객수가 시간대별 정보의 구매고객수의 합과 맞지 않습니다.
			        			}
		        			}
	            		}

	            	}
	            	if (CommonUtil.getObjToString(map.get("SALES_AMT")).equals("")) {
	            		map.put("SALES_AMT", "0");
	            	} else {

	            		if("Y".equals( map.get("WORK_YN").toString() ) ) {
	            			throw new ServiceException( SystemMsg.getMsg("COM_ERR_0063") ); // 휴일이 체크되어 있으면 데이터를 입력할수 없습니다.
	            		} else {

		            		// DTL 이 없는 경우에는 반드시 기존에 있는 정보와 현재 넘어온 마스터 정보의 갯수를 체크해주어야한다..
		                	pMap = new HashMap();
		        			pMap.put("COMP_ID", map.get("COMP_ID").toString() );
		        			pMap.put("SHOP_ID", map.get("SHOP_ID").toString() );
		        			pMap.put("STND_DATE", map.get("DATE").toString() );
		        			dtlResultMap = (Map)commonDAO.selectData("salesinfomngt.selectSalesDetlSum", pMap);
		        			//System.out.println("test->"+  dtlResultMap.get("SUM_SALES_AMT").toString() + " / " + map.get("SALES_AMT").toString());

		        			//System.out.println("->dtlResultMap1:"+dtlResultMap);
		        			if( dtlResultMap.get("SUM_SALES_AMT") != null ) {
			        			if ( Integer.parseInt( dtlResultMap.get("SUM_SALES_AMT").toString() ) !=  Integer.parseInt( map.get("SALES_AMT").toString() ) ) {
			                    	throw new ServiceException( SystemMsg.getMsg("COM_ERR_0059") ); //일자별정보의 매출금액이 시간대별 정보의 매출금액의 합과 맞지 않습니다.
			        			}
		        			}
	            		}

	            	}

	            	if (CommonUtil.getObjToString(map.get("STND_DATE")).equals("")) {
	            		map.put("STND_DATE", map.get("DATE"));
	            		extCnt += commonDAO.insertData("salesinfomngt.insertSalesInfo", map);
	            	} else {
	            		extCnt += commonDAO.updateData("salesinfomngt.updateSalesInfo", map);
	            	}
            	}
            }
		}


 */
		view.addObject("data", null);
    	view.addObject("total", extCnt);
    	view.addObject("success", true);
    	view.addObject("message", SystemMsg.getMsg("COM_RST_0001")); //저장을 완료하였습니다.

    	return view;
	}

    /**
	 * 삭제를 실행한다.
	 * @param queryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView deleteSalesInfoDetlAll(Map<String, Object> model) throws Exception {
		ModelAndView view = new ModelAndView("jsonView");
		Integer extCnt = 0;

		extCnt += commonDAO.deleteData("salesinfomngt.deleteSalesInfo", model);
		extCnt += commonDAO.deleteData("salesinfomngt.deleteSalesInfoDetlAll", model);


		view.addObject("data", null);
    	view.addObject("total", extCnt);
    	view.addObject("success", true);
    	view.addObject("message", SystemMsg.getMsg("COM_IFO_0010")); //초기화를 완료하였습니다.

    	return view;
	}
}
