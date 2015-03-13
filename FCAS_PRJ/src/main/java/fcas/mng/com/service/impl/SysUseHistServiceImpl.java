package fcas.mng.com.service.impl;

import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.ModelAndView;

import egovframework.rte.fdl.cmmn.AbstractServiceImpl;
import fcas.mng.com.service.SysUseHistService;
import fcas.sys.com.dao.CommonDAO;

/**
 * @logicalName   System Use History Service Impl.
 * @description   
 * @version       $Rev: 1.0 $
 */
@Service("sysusehistService")
public class SysUseHistServiceImpl extends AbstractServiceImpl implements SysUseHistService {
	
    @Resource(name="commonDAO")
    private CommonDAO commonDAO;
    
    /**
	 * 시스템 사용 이력을 조회한다.
	 * @param model 
	 * @return ModelAndView
	 * @exception 
	 */	
    public ModelAndView selectListPageHist(Map<String, Object> model) throws Exception {
        return commonDAO.selectListPageJsonView("sysusehist.selectHistList", model);
    }
    
}
