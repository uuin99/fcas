package fcas.mng.brd.service.impl;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.ModelAndView;

import egovframework.rte.fdl.cmmn.AbstractServiceImpl;
import fcas.mng.brd.service.CommBrdService;
import fcas.sys.com.model.LoginModel;
import fcas.sys.com.dao.CommonDAO;
import fcas.sys.com.exception.ServiceException;
import fcas.sys.com.service.impl.CommonServiceImpl;
import fcas.sys.com.servlet.SystemMsg;
import fcas.sys.com.utl.CommonUtil;
import fcas.sys.com.utl.SessionUtil;

/**
 * @logicalName   Common Board Management Service Impl.
 * @description
 * @version       $Rev: 1.0 $
 */
@Service("commbrdService")
public class CommBrdServiceImpl extends AbstractServiceImpl implements CommBrdService {

    @Resource(name="commonDAO")
    private CommonDAO commonDAO;

    /**
	 * 게시판을 조회한다.
	 * @param queryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView selectListPageCommBrd(Map<String, Object> model) throws Exception {
        return commonDAO.selectListPageJsonView("commbrd.getCommBrdList", model);
    }

    /**
	 * 단일게시판을 조회한다.
	 * @param queryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView selectCommBrd(Map<String, Object> model, HttpServletRequest request) throws Exception {
		HashMap<String, String> loginInfo = new HashMap<String, String>();
		LoginModel loginModel = SessionUtil.getInstance().getLoginModel();
		loginInfo.put("RMTE_IP", loginModel.getUserIp());
		loginInfo.put("USER_ID", loginModel.getUserId());
		model.putAll(loginInfo);
    	commonDAO.updateData("commbrd.updateUpReadCnt", model);
        return commonDAO.selectListJsonView("commbrd.getCommBrd", model);
    }

    /**
	 * 게시판을 입력/수정한다.
	 * @param queryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView insertOrUpdateCommBrd(Map<String, Object> model, HttpServletRequest request) throws Exception {
    	ModelAndView view = new ModelAndView("jsonView");
		Integer extCnt = 0;
		int inCnt = 0;
		int upCnt = 0;
		HashMap<String, String> loginInfo = new HashMap<String, String>();
		LoginModel loginModel = SessionUtil.getInstance().getLoginModel();
		loginInfo.put("RMTE_IP", loginModel.getUserIp());
		loginInfo.put("USER_ID", loginModel.getUserId());
		CommonServiceImpl comSrvImpl = new CommonServiceImpl();
		comSrvImpl.setCommonDao(commonDAO);

		String seq = model.get("SEQ").toString();
    	String replyFlag = model.get("REPLY_FLAG").toString();

    	if ("".equals(seq) && "N".equals(replyFlag)) {
    		/** 게시판 글 입력. **/

    		/*신규 Seq 생성 Start*/

    		/*게시판일 경우 공지 기간에 대한 Validation Setting Start*/
    		if("NOTICE".equals(model.get("BRD_TYPE"))){
    			if(! "".equals(CommonUtil.getObjToString(model.get("NTIC_STRT_DATE")))){
    				String strNticStartDateValid = String.valueOf(commonDAO.selectData("commbrd.selectNticStrtDateValid", model));
    				if(strNticStartDateValid.startsWith("COM_ERR_")){
    					throw new ServiceException(strNticStartDateValid);
    				}
    			}
    		}
    		/*게시판일 경우 공지 기간에 대한 Validation Setting End*/
    		
    		//seq = (String)commonDAO.selectData("commbrd.getMaxSeq", model);
    		//seq = String.valueOf(Integer.parseInt(seq) + 1);
    		seq = comSrvImpl.getSequenceValue(model.get("BRD_ID").toString(), 13);
    		model.put("SEQ", seq);
    		model.put("TOP_SEQ", seq);
    		model.put("PRNT_SEQ", "");
    		model.put("LEV", "0");
    		model.put("STEP", "0");
    		model.put("READ_CNT", "0");
    		/*신규 Seq 생성 End*/
    		//Session Info Setting.
    		model.putAll(loginInfo);

    		commonDAO.insert("commbrd.insertBrd", model);
    		inCnt ++;
    	} else if ("".equals(seq) && "Y".equals(replyFlag)) {
    		/** 신규 - 댓글 글 입력. **/

    		//Session Info Setting.
    		model.putAll(loginInfo);
    		/*신규 Seq 생성 Start*/
    		seq = comSrvImpl.getSequenceValue(model.get("BRD_ID").toString(), 13);
    		model.put("SEQ", seq);
    		model.put("READ_CNT", "0");
    		/*신규 Seq 생성 End*/

    		/*Level Up Start*/
    		String lev = model.get("LEV").toString();
    		lev = String.valueOf(Integer.parseInt(lev) + 1);
    		model.put("LEV", lev);
    		/*Level Up End*/

    		/*Step Calculation Start*/
    		//댓글이 입력되는 Level에 Step 값 산정.
    		String inputStep = (String)commonDAO.selectData("commbrd.getBrdStepNo", model);
    		inputStep = String.valueOf(Integer.parseInt(inputStep) + 1);
    		model.put("STEP", inputStep);
    		/*Step Calculation End*/

    		commonDAO.insert("commbrd.insertBrd", model);
    		upCnt ++;
    	} else if (!"".equals(seq) && "N".equals(replyFlag)) {
    		/** 수정 - 게시판 글 수정. (게시판 수정은 댓글이건 아니건 상관이 없다.)**/
    		//Session Info Setting.
    		model.putAll(loginInfo);
    		commonDAO.insert("commbrd.updateBrd", model);
    	} else {
    		/** 뭐냐 넌? **/
    		throw new Exception("알 수 없는 게시판 입력/수정 유형입니다.");
    	}
    	extCnt = 1;

		view.addObject("data", null);
    	view.addObject("total", extCnt);
    	view.addObject("success", true);
    	view.addObject("message", SystemMsg.getMsg("COM_RST_0001"));
    	view.addObject("inCnt", inCnt);
    	view.addObject("upCnt", upCnt);
        return view;
    }

    /**
	 * 게시판(List)을 삭제한다.
	 * @param queryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView deleteCommBrdList(Map<String, Object> model) throws Exception {
    	ModelAndView view = new ModelAndView("jsonView");
		Integer extCnt = 0;
		String progId = "";
		//추가 Login 하단 Level에 존재하는 게시물도 삭제해야한다.
		List<Map<String, Object>> delete_dataList = CommonUtil.getListFromJson(model.get("deleteData").toString());
		for (Map<String, Object> map : delete_dataList) {
			//하위 답글이 존재하는지 여부를 검색. -- 하위 댓글 존재 시 같이 삭제.
			List<Map<String, Object>> delList = commonDAO.selectList("commbrd.selectBrdDelList", map);
			progId = map.get("PROG_ID").toString();
			for (Map<String, Object> delMap : delList) {
				extCnt += commonDAO.deleteData("commbrd.deleteBrd", delMap);
			}
		}
		view.addObject("data", null);
    	view.addObject("total", extCnt);
    	view.addObject("success", true);
    	view.addObject("message", SystemMsg.getMsg("COM_RST_0003"));
    	view.addObject("progId", progId);
        return view;
    }

    /**
	 * 게시판을 삭제한다.
	 * @param queryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView deleteCommBrd(Map<String, Object> model) throws Exception {
    	ModelAndView view = new ModelAndView("jsonView");
		Integer extCnt = 0;
		String progId = "";

		//하위 답글이 존재하는지 여부를 검색. -- 하위 댓글 존재 시 같이 삭제.
		List<Map<String, Object>> delList = commonDAO.selectList("commbrd.selectBrdDelList", model);
		progId = model.get("PROG_ID").toString();
		extCnt += commonDAO.deleteData("commbrd.deleteBrd", model);
		for (Map<String, Object> delMap : delList) {
			extCnt += commonDAO.deleteData("commbrd.deleteBrd", delMap);
		}

		view.addObject("data", null);
    	view.addObject("total", extCnt);
    	view.addObject("success", true);
    	view.addObject("message", SystemMsg.getMsg("COM_RST_0003"));
    	view.addObject("progId", progId);
        return view;
    }

    /**
	 * 게시판 Read Count를 Update한다.
	 * @param queryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView updateUpReadCnt(Map<String, Object> model) throws Exception {
    	ModelAndView view = new ModelAndView("jsonView");
		Integer extCnt = 0;
		try {
			extCnt = commonDAO.updateData("commbrd.updateUpReadCnt", model);
		} catch(Exception ex) {
    		view.addObject("data", null);
        	view.addObject("total", extCnt);
        	view.addObject("success", false);
        	view.addObject("message", ex.getLocalizedMessage());
        	return view;
    	}
		view.addObject("data", null);
    	view.addObject("total", extCnt);
    	view.addObject("success", true);
    	view.addObject("message", SystemMsg.getMsg("COM_RST_0001"));
        return view;
    }
    
    /**
	 * 로그인 하지 않은 상태에서 전체 게시판 첨부파일 Download 시 Download 가능한지 검증한다.
	 * @param queryId
	 * @param model
	 * @return String
	 * @exception
	 */
    public String getValidPublicBrdFileDownload(Map<String, Object> model) throws Exception {
        return String.valueOf(commonDAO.selectData("commbrd.getValidPublicBrdFileDownload", model));
    }    
    
    
    /**
	 * 로그인하지 않은 상테에서 전체 게시판 Read Count를 Update한다.
	 * @param queryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView publicBrdSearchCountUp(Map<String, Object> model) throws Exception {
    	ModelAndView view = new ModelAndView("jsonView");
		
    	/*
    	String strValid = String.valueOf(commonDAO.selectData("commbrd.getValidPublicBrdSearchCountUp", model));
    	
    	if(strValid.startsWith("COM_ERR")){
    		throw new ServiceException(strValid);
    	}
    	*/
    	Integer extCnt = commonDAO.updateData("commbrd.updateUpReadCnt", model);

		view.addObject("data", null);
    	view.addObject("total", extCnt);
    	view.addObject("success", true);
    	view.addObject("message", SystemMsg.getMsg("COM_RST_0001"));
        return view;    		
    }    
    
}
