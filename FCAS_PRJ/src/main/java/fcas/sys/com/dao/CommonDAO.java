package fcas.sys.com.dao;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;
import org.springframework.web.servlet.ModelAndView;

import egovframework.rte.psl.dataaccess.EgovAbstractDAO;
import fcas.sys.com.utl.CommonUtil;

/**
 * @logicalName   Common DAO.
 * @description   Common DAO.
 * @version       $Rev: 1.0 $
 */
@Repository("commonDAO")
public class CommonDAO extends EgovAbstractDAO {

	/**
	 *
	 * @param queryId
	 * @param model
	 * @return List
	 * @exception
	 */
    public List selectList(String queryId, Map<String, Object> model) throws Exception {
        return list(queryId, model);
    }

    /**
	 *
	 * @param queryId
	 * @param model
	 * @return Object
	 * @exception
	 */
    public Object selectData(String queryId, Map<String, Object> model) throws Exception {
        return selectByPk(queryId, model);
    }

    // 쿼리 파라미터가 맵으로 밖에 안되서 String 으로 도 할수있도록 추가함..
    public Object select(String queryId, Object param) {
        return getSqlMapClientTemplate().queryForObject(queryId, param);
    }

    /**
	 *
	 * @param queryId
	 * @param model
	 * @return int
	 * @exception
	 */
    public int insertData(String queryId, Map<String, Object> model) throws Exception {
		return update(queryId, model);
	}

    /**
	 *
	 * @param queryId
	 * @param model
	 * @return int
	 * @exception
	 */
    public int updateData(String queryId, Map<String, Object> model) throws Exception {
		return update(queryId, model);
	}

    /**
	 *
	 * @param queryId
	 * @param model
	 * @return int
	 * @exception
	 */
    public int deleteData(String queryId, Map<String, Object> model) throws Exception {
        return delete(queryId, model);
    }

    /**
	 *
	 * @param queryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView selectListJsonView(String queryId, Map<String, Object> model) throws Exception {
    	List list = selectList(queryId, model);

        return CommonUtil.setJsonView(list, list.size(), true, "");
    }

    /**
	 *
	 * @param queryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView selectListPageJsonView(String queryId, Map<String, Object> model) throws Exception {
    	List list = selectList(queryId, model);
    	Integer iTotalCnt = (Integer)selectData(queryId+"Count", model);

        return CommonUtil.setJsonView(list, iTotalCnt, true, "");
    }
}
