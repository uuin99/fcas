package fcas.sys.com.service.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.ModelAndView;

import egovframework.rte.fdl.cmmn.AbstractServiceImpl;
import fcas.sys.com.dao.CommonDAO;
import fcas.sys.com.model.LoginModel;
import fcas.sys.com.service.MainService;
import fcas.sys.com.utl.SessionUtil;

/**
 * @logicalName   LoginServiceImpl Impl.
 * @description
 * @version       $Rev: 1.0 $
 */
@Service("mainService")
public class MainServiceImpl extends AbstractServiceImpl implements MainService {

    @Resource(name="commonDAO")
    private CommonDAO commonDAO;
    
    public List selectCnctDate(Map<String, Object> model) throws Exception {
    	return commonDAO.selectList("mypage.getCnctDate", model);
    }
    
    public List selectHistInfo(Map<String, Object> model) throws Exception {
    	return commonDAO.selectList("mypage.getHistInfo", model);
    }
    
    public ModelAndView selectReportInfo(Map<String, Object> model) throws Exception {
    	return commonDAO.selectListJsonView("mypage.getReportInfo", model);
    }
    
    public Map<String, java.util.List<java.util.Map<String, Object>>> selectMyPageInfo(Map<String, Object> model) throws Exception{
    	Map<String, java.util.List<java.util.Map<String, Object>>> retMap = new java.util.HashMap<String, java.util.List<java.util.Map<String, Object>>>();
    	

    	//공지사항
    	retMap.put("NOTICE_INFO", commonDAO.selectList("mypage.getNoticeInfo", model));
    	//날씨정보
    	retMap.put("WEATHER_INFO", commonDAO.selectList("mypage.getWeatherInfo", model));
    	//기본정보
    	retMap.put("CNCT_DATE", commonDAO.selectList("mypage.getCnctDate", model));
    	//최근접속정보
    	retMap.put("HIST_INFO", commonDAO.selectList("mypage.getHistInfo", model));
    	//사이트이용현황, 매장방문현황
    	retMap.put("REPORT_INFO", commonDAO.selectList("mypage.getReportInfo", model));
    	
    	
    	return retMap;
    	
    }
    
    
}
