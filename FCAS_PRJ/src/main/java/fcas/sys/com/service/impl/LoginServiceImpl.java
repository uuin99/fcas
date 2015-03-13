package fcas.sys.com.service.impl;

import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.ModelAndView;

import egovframework.rte.fdl.cmmn.AbstractServiceImpl;
import fcas.sys.com.service.LoginService;
import fcas.sys.com.dao.CommonDAO;
import fcas.sys.com.utl.CommonUtil;

/**
 * @logicalName   LoginServiceImpl Impl.
 * @description
 * @version       $Rev: 1.0 $
 */
@Service("loginService")
public class LoginServiceImpl extends AbstractServiceImpl implements LoginService {

    @Resource(name="commonDAO")
    private CommonDAO commonDAO;

    /**
	 * 로그인 정보를 체크한다
	 * @param model
	 * @return Map
	 * @exception
	 */
    public Map selectUserCheck(Map<String, Object> model) throws Exception {
    	// 비번 암호화 후 비교
    	model.put("ENCODE_LOGIN_PWD", CommonUtil.base64Encoder( CommonUtil.getObjToString(model.get("LOGIN_PWD") ) ) );
    	return (Map)commonDAO.selectData("loginmngt.selectUserCheck", model);
    }

    /**
	 * 세션 db 정보를 가져온다.
	 * @param model
	 * @return Map
	 * @exception
	 */
    public Map selectSessionDb(Map<String, Object> model) throws Exception {
    	return (Map)commonDAO.selectData("loginmngt.selectSessionDb", model);
    }

    /**
	 * 세션db에 로그인 정보가 존재하는지를 체크 한다.
	 * @param model
	 * @return int
	 * @exception
	 */
    public int selectSessionDbCount(Map<String, Object> model) throws Exception {
    	return (Integer) commonDAO.selectData("loginmngt.selectSessionDbCount" , model);
    }


    /**
	 * 세션db에 로그인 정보가 존재하는지를 체크 한다.
	 * @param model
	 * @return int
	 * @exception
	 */
    public Map selectSessionDbInfo(Map<String, Object> model) throws Exception {
    	return (Map) commonDAO.selectData("loginmngt.selectSessionDbInfo" , model);
    }


    /**
	 * 세션db에 로그인 정보를 저장한다.
	 * @param model
	 * @return int
	 * @exception
	 */
    public void insertSessionDb(Map<String, Object> model) throws Exception {
    	commonDAO.selectData("loginmngt.insertSessionDb" , model);
    }

    /**
	 * 세션db에 로그인 정보를 삭제한다.
	 * @param model
	 * @return int
	 * @exception
	 */
    public void deleteSessionDb(Map<String, Object> model) throws Exception {
    	commonDAO.selectData("loginmngt.deleteSessionDb" , model);

    }

    /**
	 * List를 조회한다.
	 * @param queryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView selectMainMenu(Map<String, Object> model) throws Exception {
        return commonDAO.selectListJsonView("loginmngt.getMainMenu", model);
    }
    
    /**
	 * 공지사항을 조회한다.
	 * @param queryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView selectNoticeData(Map<String, Object> model) throws Exception {
    	return commonDAO.selectListJsonView("loginmngt.getNoticeData", model);
    }
}
