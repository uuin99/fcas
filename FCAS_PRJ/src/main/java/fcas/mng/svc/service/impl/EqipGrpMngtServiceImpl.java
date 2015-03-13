package fcas.mng.svc.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.ModelAndView;

import egovframework.rte.fdl.cmmn.AbstractServiceImpl;
import fcas.sys.com.model.LoginModel;
import fcas.mng.svc.service.EqipGrpMngtService;
import fcas.sys.com.dao.CommonDAO;
import fcas.sys.com.exception.ServiceException;
import fcas.sys.com.service.CommonService;
import fcas.sys.com.servlet.SystemMsg;
import fcas.sys.com.utl.CommonUtil;
import fcas.sys.com.utl.SessionUtil;

import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

/**
 * @logicalName   EqipGrpMngtServiceImpl
 * @description
 * @version       $Rev: 1.0 $
 */
@Service("eqipGrpMngtService")
public class EqipGrpMngtServiceImpl extends AbstractServiceImpl implements EqipGrpMngtService {

    @Resource(name="commonDAO")
    private CommonDAO commonDAO;

    @Resource(name = "commonService")
    private CommonService commonService;

    /**
	 * 페이지가 있는 List를 조회한다.
	 * @param queryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView selectListPageEqipGrpMngt(Map<String, Object> model) throws Exception {
        return commonDAO.selectListPageJsonView("eqipgrpmngt.getEqipGrpList", model);
    }

    /**
	 * 저장과 수정을 실행한다.
	 * @param iQueryId
	 * @param uQueryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView insertOrUpdateListEqipGrp(Map<String, Object> model) throws Exception {
		ModelAndView view = new ModelAndView("jsonView");
		Integer extCnt = 0;

		LoginModel loginModel = SessionUtil.getInstance().getLoginModel();

		List insert_dataList = CommonUtil.getListFromJson(model.get("insertData").toString());
    	if (insert_dataList != null && !insert_dataList.isEmpty()) {

            for (int i=0; i<insert_dataList.size(); i++) {

            	HashMap map = (HashMap) insert_dataList.get(i);

            	map.put("USER_ID", loginModel.getUserId());


            	if(map.get("COMP_ID") == null || map.get("COMP_ID").toString().equals("") ) {
            		throw new ServiceException( SystemMsg.getMsg("COM_ERR_0014").replace("param1", "고객사") );
            	}else if(map.get("SHOP_ID") == null || map.get("SHOP_ID").toString().equals("") ) {
            		throw new ServiceException( SystemMsg.getMsg("COM_ERR_0014").replace("param1", "매장") );
            	}


            	/* 로직추가  카메라 그룹으로 최초 등록될시  fca_floor_div 테이블에 1건을 무조건 인서트 해준다.
            	 * 단 key 중복의 우려가 있으므로.. fca_floor_div 테이블 조회후 있으면 pass 없으면 인서트 한다.
            	 * */
            	int chkCnt = (Integer)commonDAO.selectData("eqipgrpmngt.selectFloorDivCount", map);
            	if(chkCnt == 0) {
            		commonDAO.insertData("eqipgrpmngt.insertFloorDiv", map);
            	}

            	map.put("CMRA_GRP_ID", commonService.getSequenceValue("CMRAGRPID", 7 , "PE-ETC" , "CG") );

           		extCnt += commonDAO.insertData("eqipgrpmngt.insertEqipGrp", map);

            }
		}

    	List update_dataList = CommonUtil.getListFromJson(model.get("updateData").toString());

		if (update_dataList != null && !update_dataList.isEmpty()) {

			for (int i=0; i<update_dataList.size(); i++) {

				HashMap map = (HashMap) update_dataList.get(i);


            	if(map.get("COMP_ID") == null || map.get("COMP_ID").toString().equals("") ) {
            		throw new ServiceException( SystemMsg.getMsg("COM_ERR_0014").replace("param1", "고객사") );
            	} else if(map.get("SHOP_ID") == null || map.get("SHOP_ID").toString().equals("") ) {
            		throw new ServiceException( SystemMsg.getMsg("COM_ERR_0014").replace("param1", "매장") );
            	}

            	map.put("USER_ID", loginModel.getUserId());

            	extCnt += commonDAO.updateData("eqipgrpmngt.updateEqipGrp", map);

            }
		}

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
    public ModelAndView deleteListEqipGrp(Map<String, Object> model) throws Exception {
		ModelAndView view = new ModelAndView("jsonView");
		Integer extCnt = 0;

		List delete_dataList = CommonUtil.getListFromJson(model.get("deleteData").toString());
    	if (delete_dataList != null && !delete_dataList.isEmpty()) {
            for (int i=0; i<delete_dataList.size(); i++) {
            	HashMap map = (HashMap) delete_dataList.get(i);


            	// 삭제전 카메라 그룹에 등록된 카메라가 존재할 경우 Exception 발생
            	int cnt = (Integer)commonDAO.selectData("eqipgrpmngt.selectDupCheckEqip", map);

            	if(cnt == 0) {
                	extCnt += commonDAO.deleteData("eqipgrpmngt.deleteEqipGrp", map);

            		// 카메라를 삭제할때 floor 정보도 같이 삭제해준다. 단, 무조건 삭제하면 안되고 더이상 해당 카메라 그룹이 없을때만...삭제한다.
                	int grp_cnt = (Integer)commonDAO.selectData("eqipgrpmngt.selectEqipGrpCnt", map);
                	if(grp_cnt == 0) {
                		commonDAO.deleteData("eqipgrpmngt.deleteFloorDiv", map);
                	}

            	} else {
            		throw new ServiceException( SystemMsg.getMsg("COM_ERR_0039") ); //해당 카메라그룹에 연결되어있는 카메라가 존재합니다.
            	}




            }
		}

		view.addObject("data", null);
    	view.addObject("total", extCnt);
    	view.addObject("success", true);
    	view.addObject("message", SystemMsg.getMsg("COM_RST_0003")); //삭제를 완료하였습니다.

    	return view;
	}
}
