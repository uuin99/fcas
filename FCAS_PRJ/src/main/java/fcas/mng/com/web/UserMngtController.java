package fcas.mng.com.web;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import com.thoughtworks.xstream.XStream;
import com.thoughtworks.xstream.converters.Converter;
import com.thoughtworks.xstream.converters.MarshallingContext;
import com.thoughtworks.xstream.converters.UnmarshallingContext;
import com.thoughtworks.xstream.converters.collections.AbstractCollectionConverter;
import com.thoughtworks.xstream.io.HierarchicalStreamReader;
import com.thoughtworks.xstream.io.HierarchicalStreamWriter;
import com.thoughtworks.xstream.io.xml.DomDriver;
import com.thoughtworks.xstream.mapper.Mapper;

import fcas.mng.com.service.UserMngtService;
import fcas.sys.com.exception.ServiceException;
import fcas.sys.com.model.LoginModel;
import fcas.sys.com.servlet.SystemMsg;
import fcas.sys.com.utl.CommonUtil;
import fcas.sys.com.utl.RexpertXmlUtil;
import fcas.sys.com.utl.SessionUtil;

/**
 * @logicalName   User Management Controller.
 * @description
 * @version       $Rev: 1.0 $
 */
@Controller
public class UserMngtController {
    @Resource(name = "usermngtService")
    private UserMngtService usermngtService;

    /**
	 * 사용자 관리 화면을 호출한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return String
	 * @exception
	 */
    @RequestMapping(value="/mng/com/UserMngt/selectUserMngtView.do")
    public String selectUserMngtView(HttpServletRequest request,
    		HttpServletResponse response,
    		ModelMap model) throws Exception {
    	/* 이력 부분 추가 예정 */
    	return "mng/com/fcas_user_001";
    }

    /**
	 * 페이지가 있는 List를 조회한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    @RequestMapping(value="/mng/com/UserMngt/selectUserList.do")
    public ModelAndView selectUserList(HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {

    	return usermngtService.selectListPageUserMngt(model);
    }

    /**
	 * 단일 Data를 조회한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    @RequestMapping(value="/mng/com/UserMngt/selectUser.do")
    public ModelAndView selectUser (HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {

    	return usermngtService.selectUser(model);
    }

    /**
	 * 저장과 수정을 실행한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    @RequestMapping(value="/mng/com/UserMngt/insertOrUpdateUser.do")
    public ModelAndView insertOrUpdateUser (HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {

    	ModelAndView view = new ModelAndView("jsonView");


    	try {

    		view = usermngtService.insertOrUpdateUser(model);


    	} catch(ServiceException se) {
    		view = null; view = new ModelAndView("jsonView");
    		view.addObject("data", null);
        	view.addObject("total", 0);
        	view.addObject("success", false);
        	view.addObject("message", se.getMessage() );//로그인ID가 이미 사용중입니다.
        	view.addObject("error", se.getLocalizedMessage());
    	} catch(Exception ex) {
    		view = null; view = new ModelAndView("jsonView");
    		view.addObject("data", null);
        	view.addObject("total", 0);
        	view.addObject("success", false);
        	view.addObject("message", SystemMsg.getMsg(CommonUtil.getExpToMsg(ex,"COM_ERR_0001")));//저장에 실패하였습니다.
        	view.addObject("error", ex.getLocalizedMessage());
    	}

    	return view;
    }

    /**
	 * 삭제를 실행한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    @RequestMapping(value="/mng/com/UserMngt/deleteUser.do")
    public ModelAndView deleteUser(HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {

    	ModelAndView view = new ModelAndView("jsonView");

    	try {
    		view = usermngtService.deleteUser(model);

    	} catch(Exception ex) {
    		view = null; view = new ModelAndView("jsonView");
    		view.addObject("data", null);
        	view.addObject("total", 0);
        	view.addObject("success", false);
        	view.addObject("message", SystemMsg.getMsg(CommonUtil.getExpToMsg(ex,"COM_ERR_0003")));//삭제에 실패하였습니다.
        	view.addObject("error", ex.getLocalizedMessage());
    	}

    	return view;
    }

    /**
	 * 정의된 값의 중복여부를 Checking 함.
	 * @param queryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    @RequestMapping(value="/mng/com/UserMngt/selectCheckLoginId.do")
    public ModelAndView selectCheckLoginId (HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {

    	return usermngtService.selectCheckLoginId(model);
    }



    /**
	 * 저장과 수정을 실행한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    @RequestMapping(value="/mng/com/UserMngt/updateUserMyinfo.do")
    public ModelAndView updateUserMyinfo (HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {

    	ModelAndView view = new ModelAndView("jsonView");

    	try {
    		view = usermngtService.updateUserMyinfo(model);

    	} catch(ServiceException se) {
    		view = null; view = new ModelAndView("jsonView");
    		view.addObject("data", null);
        	view.addObject("total", 0);
        	view.addObject("success", false);
        	view.addObject("message", se.getMessage() );//로그인ID가 이미 사용중입니다.
        	view.addObject("error", se.getLocalizedMessage());
    	} catch(Exception ex) {
     		view = null; view = new ModelAndView("jsonView");
    		view.addObject("data", null);
        	view.addObject("total", 0);
        	view.addObject("success", false);
        	view.addObject("message", SystemMsg.getMsg(CommonUtil.getExpToMsg(ex,"COM_ERR_0001")));//저장에 실패하였습니다.
        	view.addObject("error", ex.getLocalizedMessage());
    	}

    	return view;
    }

    /**
	 * 사용자 관리 화면을 호출한다. (고객사용)
	 * @param request
	 * @param response
	 * @param model
	 * @return String
	 * @exception
	 */
    @RequestMapping(value="/mng/com/UserMngt/selectMyUserMngtView.do")
    public String selectMyUserMngtView(HttpServletRequest request,
    		HttpServletResponse response,
    		ModelMap model) throws Exception {

    	return "mng/com/fcas_my_user_001";
    }

    /**
	 * 페이지가 있는 List를 조회한다. (고객사용)
	 * @param request
	 * @param response
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    @RequestMapping(value="/mng/com/UserMngt/selectMyUserList.do")
    public ModelAndView selectMyUserList(HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {

		LoginModel loginModel = SessionUtil.getInstance().getLoginModel();
		model.put("COMP_ID" , loginModel.getCompId());

    	return usermngtService.selectListPageUserMngt(model);
    }

    /***********Combo 정의 영역 Start*******************/
    /**
	 * 영업담당자 List를 조회한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    @RequestMapping(value="/mng/com/UserMngt/selectSalesMnge.do")
    public ModelAndView selectSalesMnge (HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {

    	return usermngtService.selectSalesMnge(model);
    }
    /***********Combo 정의 영역 End*******************/



    @RequestMapping(value="/mng/com/Test/selectRxTestView.do")
    public void selectRxTestView(HttpServletRequest request,
    		HttpServletResponse response,
    		ModelMap model) throws Exception {
    	/* 이력 부분 추가 예정 */

    	java.util.List resultList = usermngtService.selectUserList(model);
    	java.util.List resultList2 = usermngtService.selectUserList2(model);



		//System.out.println(resultXML);
		//System.out.println(resultXML2);

		StringBuffer sb = new StringBuffer();
		sb.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
		sb.append( "<gubun>\n");

		sb.append( "	<rpt1>\n");
		sb.append( RexpertXmlUtil.toXML(resultList , "rexdataset" , "rexrow") +"\n");
		sb.append( "	</rpt1>\n");

		sb.append( "	<rpt2>\n");
		sb.append( RexpertXmlUtil.toXML(resultList2 , "rexdataset" , "rexrow") +"\n");
		sb.append( "	</rpt2>\n");

		sb.append( "</gubun>\n");

		System.out.println(sb.toString() );

    	response.setContentType("text/xml; charset=UTF-8");
    	response.getWriter().print(  sb.toString() );
    	//response.getWriter().print(  ((sb.toString()).replaceAll("!C!", "<![CDATA[")).replaceAll("!E!", "]]>") );

    	//return "mng/com/fcas_user_001";
    }

}
