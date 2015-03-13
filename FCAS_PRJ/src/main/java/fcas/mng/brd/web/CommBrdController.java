package fcas.mng.brd.web;

import java.io.BufferedOutputStream;
import java.io.PrintWriter;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import fcas.mng.brd.service.CommBrdService;
import fcas.sys.com.exception.ServiceException;
import fcas.sys.com.model.FileModel;
import fcas.sys.com.service.CommonService;
import fcas.sys.com.servlet.SystemMsg;

/**
 * @logicalName   Master Management Controller.
 * @description   
 * @version       $Rev: 1.0 $
 */
@Controller
public class CommBrdController {
    @Resource(name = "commbrdService")
    private CommBrdService commbrdService;
    
    @Resource(name = "commonService")
    private CommonService commonService;
    /**
	 * 게시판을 요청한다.
	 * @param request
	 * @param response
	 * @param model 
	 * @return String
	 * @exception 
	 */	
    @RequestMapping(value="/mng/brd/CommBrd/selectCommBrdHierView.do")
    public String selectCommBrdHierView( HttpServletRequest request, HttpServletResponse response , ModelMap model ) throws Exception {
    	model.addAttribute("BRD_ID", "HIERAR_001"); 		//게시판 ID
    	model.addAttribute("BRD_TYPE", "HIERAR");			//게시판 유형
    	model.addAttribute("PROG_ID", "fcas_comm_brd_001");	//PROGRAM ID
    	//model.addAttribute("SYS_USE_LOG_FLAG", "Y");		//System Use Log Create Flag
    	model.addAttribute("BRD_AUTH", "W");				//Board Auth A R W
    	return getBrdUrl("HIERAR");
	}
    @RequestMapping(value="/mng/brd/CommBrd/selectCommBrdNotiView.do")
    public String selectCommBrdNotiView( HttpServletRequest request, HttpServletResponse response , ModelMap model ) throws Exception {
    	model.addAttribute("BRD_ID", "NOTICE_001"); 		//게시판 ID
    	model.addAttribute("BRD_TYPE", "NOTICE");			//게시판 유형
    	model.addAttribute("PROG_ID", "fcas_comm_brd_002");	//PROGRAM ID
    	//model.addAttribute("SYS_USE_LOG_FLAG", "Y");		//System Use Log Create Flag
    	model.addAttribute("BRD_AUTH", "W");				//Board Auth A R W
    	return getBrdUrl("NOTICE");
	}
    @RequestMapping(value="/mng/brd/CommBrd/selectCommBrdEtcView.do")
    public String selectCommBrdEtcView( HttpServletRequest request, HttpServletResponse response , ModelMap model ) throws Exception {
    	model.addAttribute("BRD_ID", "GEN_001"); 		//게시판 ID
    	model.addAttribute("BRD_TYPE", "GEN");			//게시판 유형
    	model.addAttribute("PROG_ID", "fcas_comm_brd_001");	//PROGRAM ID
    	//model.addAttribute("SYS_USE_LOG_FLAG", "Y");		//System Use Log Create Flag
    	model.addAttribute("BRD_AUTH", "W");				//Board Auth A R W
    	return getBrdUrl("GEN");
	}
    @RequestMapping(value="/mng/brd/CommBrd/selectCommBrdNotiSearchView.do")
    public String selectCommBrdNotiSearchView( HttpServletRequest request, HttpServletResponse response , ModelMap model ) throws Exception {
    	model.addAttribute("BRD_ID", "NOTICE_001"); 		//게시판 ID
    	model.addAttribute("BRD_TYPE", "NOTICE_S");			//게시판 유형
    	model.addAttribute("PROG_ID", "fcas_comm_brd_001");	//PROGRAM ID
    	//model.addAttribute("SYS_USE_LOG_FLAG", "Y");		//System Use Log Create Flag
    	model.addAttribute("BRD_AUTH", "W");				//Board Auth A R W
    	return getBrdUrl("NOTICE_S");
	}    
    
    /**
	 * 전체 공지사항 등록 게시판을 조회한다.
	 * @param request
	 * @param response
	 * @param model 
	 * @return String
	 * @exception 
	 */    
    @RequestMapping(value="/mng/brd/CommBrd/selectCommBrdAllNotiView.do")
    public String selectCommBrdAllNotiView( HttpServletRequest request, HttpServletResponse response , ModelMap model ) throws Exception {
    	model.addAttribute("BRD_ID", "NOTICE_002"); 		//게시판 ID
    	model.addAttribute("BRD_TYPE", "NOTICE");			//게시판 유형
    	model.addAttribute("PROG_ID", "fcas_comm_brd_001");	//PROGRAM ID
    	//model.addAttribute("SYS_USE_LOG_FLAG", "Y");		//System Use Log Create Flag
    	model.addAttribute("BRD_AUTH", "W");				//Board Auth A R W
    	return getBrdUrl("NOTICE");
	}
    /**
	 * 공지사항 등록 게시판을 조회한다.
	 * @param request
	 * @param response
	 * @param model 
	 * @return String
	 * @exception 
	 */    
    @RequestMapping(value="/mng/brd/CommBrd/selectCommBrdGenNotiView.do")
    public String selectCommBrdGenNotiView( HttpServletRequest request, HttpServletResponse response , ModelMap model ) throws Exception {
    	model.addAttribute("BRD_ID", "NOTICE_003"); 		//게시판 ID
    	model.addAttribute("BRD_TYPE", "NOTICE");			//게시판 유형
    	model.addAttribute("PROG_ID", "fcas_comm_brd_001");	//PROGRAM ID
    	//model.addAttribute("SYS_USE_LOG_FLAG", "Y");		//System Use Log Create Flag
    	model.addAttribute("BRD_AUTH", "W");				//Board Auth A R W
    	return getBrdUrl("NOTICE");
	}    
    /**
	 * 공지사항 등록 게시판을 조회한다.
	 * @param request
	 * @param response
	 * @param model 
	 * @return String
	 * @exception 
	 */       
    @RequestMapping(value="/mng/brd/CommBrd/selectCommBrdGenNotiSearView.do")
    public String selectCommBrdGenNotiSearView( HttpServletRequest request, HttpServletResponse response , ModelMap model ) throws Exception {
    	model.addAttribute("BRD_ID", "NOTICE_003"); 		//게시판 ID
    	model.addAttribute("BRD_TYPE", "NOTICE_S");			//게시판 유형
    	model.addAttribute("PROG_ID", "fcas_comm_brd_001");	//PROGRAM ID
    	//model.addAttribute("SYS_USE_LOG_FLAG", "Y");		//System Use Log Create Flag
    	model.addAttribute("BRD_AUTH", "W");				//Board Auth A R W
    	return getBrdUrl("NOTICE_S");
	}
    /**
	 * 업무형 게시판을 조회한다.
	 * @param request
	 * @param response
	 * @param model 
	 * @return String
	 * @exception 
	 */       
    @RequestMapping(value="/mng/brd/CommBrd/selectCommBrdWorkHierView.do")
    public String selectCommBrdWorkHierView( HttpServletRequest request, HttpServletResponse response , ModelMap model ) throws Exception {
    	model.addAttribute("BRD_ID", "HIERAR_002"); 		//게시판 ID
    	model.addAttribute("BRD_TYPE", "HIERAR");			//게시판 유형
    	model.addAttribute("PROG_ID", "fcas_comm_brd_001");	//PROGRAM ID
    	//model.addAttribute("SYS_USE_LOG_FLAG", "Y");		//System Use Log Create Flag
    	model.addAttribute("BRD_AUTH", "W");				//Board Auth A R W
    	return getBrdUrl("HIERAR");
	}
    
    
    private String getBrdUrl(String brdType){
    	String retStr = "";
    	if("HIERAR".equals(brdType)){// 계층형 게시판
    		retStr = "mng/brd/fcas_comm_brd_001";
    	}else if("NOTICE".equals(brdType)){//공지형게시판 - 관리
    		retStr = "mng/brd/fcas_comm_brd_002";
    	}else if("NOTICE_S".equals(brdType)){//공지형게시판 - 조회
    		retStr = "mng/brd/fcas_comm_brd_004";    		
    	}else {//일반 게시판
    		retStr = "mng/brd/fcas_comm_brd_003";
    	}
    	return retStr;
    }
       
    
    /**
	 * 게시판을 조회한다.
	 * @param request
	 * @param response
	 * @param model 
	 * @return ModelAndView
	 * @exception 
	 */
    @RequestMapping(value="/mng/brd/CommBrd/selectCommBrdList.do")
    public ModelAndView selectCommBrdList(HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {
		/* 사용자 이력 Log 부분 주석 처리
    	commonService.insertFcaHistSearch(model.get("PROG_ID").toString(), "A", model);
    	*/
    	return commbrdService.selectListPageCommBrd(model);
    }
    
    /**
	 * 게시판을 삭제한다.
	 * @param request
	 * @param response
	 * @param model 
	 * @return ModelAndView
	 * @exception 
	 */
    @RequestMapping(value="/mng/brd/CommBrd/deleteCommBrd.do")
    public ModelAndView deleteCommBrd(HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {
    	ModelAndView view = new ModelAndView("jsonView");
    	try {
    		view = commbrdService.deleteCommBrd(model);
    		/* 사용자 이력 Log 부분 주석 처리
    		if (! "0".equals(view.getModel().get("total"))) {
    			commonService.insertfcaHistTrans(view.getModel().get("progId").toString(), "E");
    		}
    		*/
    	} catch(Exception ex) {
    		view = null; view = new ModelAndView("jsonView");
    		view.addObject("data", null);
        	view.addObject("total", 0);
        	view.addObject("success", false);
        	view.addObject("message", SystemMsg.getMsg("COM_ERR_0003")); //삭제에 실패하였습니다.
        	view.addObject("error", ex.getLocalizedMessage());
    	}
    	return view;
    }
    
    /**
	 * 단일 게시판을 조회한다.
	 * @param request
	 * @param response
	 * @param model 
	 * @return ModelAndView
	 * @exception 
	 */
    @RequestMapping(value="/mng/brd/CommBrd/selectCommBrd.do")
    public ModelAndView selectCommBrd(HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {
    	return commbrdService.selectCommBrd(model, request);
    }
    
    /**
	 * 단일 게시판을 입력/수정한다.
	 * @param request
	 * @param response
	 * @param model 
	 * @return ModelAndView
	 * @exception 
	 */
    @RequestMapping(value="/mng/brd/CommBrd/insertOrUpdateCommBrd.do")
    public ModelAndView insertOrUpdateCommBrd(HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {
    	ModelAndView view = new ModelAndView("jsonView");
    	try {
    		System.out.println(model);
    		view = commbrdService.insertOrUpdateCommBrd(model, request);
    		/* 사용자 이력 Log 부분 주석 처리    		
    		if (! "0".equals(view.getModel().get("inCnt"))) {
    			commonService.insertfcaHistTrans(model.get("PROG_ID").toString(), "B");
    		}
    		if (! "0".equals(view.getModel().get("upCnt"))) {
    			commonService.insertfcaHistTrans(model.get("PROG_ID").toString(), "D");
    		}    		
    		*/
    	} catch(ServiceException se){
    		view = null; view = new ModelAndView("jsonView");
    		view.addObject("data", null);
        	view.addObject("total", 0);
        	view.addObject("success", false);
        	view.addObject("message", SystemMsg.getMsg(se.getLocalizedMessage()));
        	view.addObject("error", se.getLocalizedMessage());    		    		
    	} catch(Exception ex) {
    		view = null; view = new ModelAndView("jsonView");
    		view.addObject("data", null);
        	view.addObject("total", 0);
        	view.addObject("success", false);
        	view.addObject("message", SystemMsg.getMsg("COM_ERR_0001")); //저장에 실패하였습니다.
        	view.addObject("error", ex.getLocalizedMessage());
    	}
    	return view; 
    }
    
    /**
	 * 단일 게시판의 Read Count를 1 올린다.
	 * @param request
	 * @param response
	 * @param model 
	 * @return ModelAndView
	 * @exception 
	 */
    @RequestMapping(value="/mng/brd/CommBrd/updateUpReadCnt.do")
    public ModelAndView updateUpReadCnt(HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {
    	return commbrdService.updateUpReadCnt(model);
    }
    
    /**
	 * 로그인 하지 않은 상태에서 전체 게시판 첨부파일 Download 시 사용한다.
	 * @param request
	 * @param response
	 * @param model 
	 * @return String
	 * @exception 
	 */
    @RequestMapping(value="/sys/com/Common/getPublicBrdFileDownload.do")
    public String getPublicBrdFileDownload(HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {
    	
    	if(!"POST".equals(request.getMethod().toUpperCase())){
    		return null;
    	}
    	
    	model.put("BRD_ID", "NOTICE_002");
    	String strValid = commbrdService.getValidPublicBrdFileDownload(model);
    	
    	if(strValid.startsWith("COM_ERR_")){
    		
    		response.setContentType("text/html; charset=UTF-8");
            PrintWriter pw = response.getWriter();
            pw.println("<script type=\"text/javascript\">alert('"+SystemMsg.getMsg(strValid)+"');</script>");
            pw.close();    		
    		return null;
    	}
    	
    	java.util.Map<String, Object> downModel = new java.util.HashMap<String, Object>();
    	downModel.put("FILE_UID", strValid);
    	downModel.put("FILE_SEQ", "1");
    	
    	FileModel fileModel = commonService.selectFileMastInfo(downModel);
    	
        response.setContentType("application/x-msdownload; charset=EUC-KR");
        response.setHeader("Content-Disposition", "attachment; filename=" + new String((fileModel.getFILE_NM()).getBytes("EUC-KR"), "8859_1"));
        response.setHeader("Content-Description", "JSP Generated Data");        
        BufferedOutputStream outs = new BufferedOutputStream(response.getOutputStream());
        byte[] b = fileModel.getFILE_CONT();
        final int nStartIdx = 0;
        outs.write(b, nStartIdx, b.length);
        outs.close();    	
    	
    	return null;
    }    
    
    /**
	 * 전체 게시판 Count Up.
	 * @param request
	 * @param response
	 * @param model 
	 * @return ModelAndView
	 * @exception 
	 */
    @RequestMapping(value="/sys/com/Common/getPublicBrdSearch.do")
    public ModelAndView getPublicBrdSearch(HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {
    	
    	if(!"POST".equals(request.getMethod().toUpperCase())){
    		return null;
    	}
    	
    	ModelAndView view = new ModelAndView("jsonView");
    	model.put("BRD_ID", "NOTICE_002");
	    try{
	    	commbrdService.publicBrdSearchCountUp(model);
	    	view.addObject("succes",true);
	    } catch(ServiceException se){
	    	view.addObject("succes",false);
	    	view.addObject("message",SystemMsg.getMsg(se.getLocalizedMessage()));
		} catch(Exception ex) {
			view.addObject("succes",false);
			view.addObject("message",SystemMsg.getMsg("COM_ERR_0020"));
		}
		return null;     	
    }      
}
