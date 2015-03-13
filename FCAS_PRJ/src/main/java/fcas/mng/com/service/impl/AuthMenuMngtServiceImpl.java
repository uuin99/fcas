package fcas.mng.com.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.ModelAndView;

import egovframework.rte.fdl.cmmn.AbstractServiceImpl;
import egovframework.rte.fdl.idgnr.EgovIdGnrService;
import fcas.sys.com.model.LoginModel;
import fcas.mng.com.service.AuthMenuMngtService;
import fcas.sys.com.dao.CommonDAO;
import fcas.sys.com.servlet.SystemMsg;
import fcas.sys.com.utl.CommonUtil;
import fcas.sys.com.utl.SessionUtil;

/**
 * @logicalName   Auth Menu Management Service Impl.
 * @description
 * @version       $Rev: 1.0 $
 */
@Service("authmenumngtService")
public class AuthMenuMngtServiceImpl extends AbstractServiceImpl implements AuthMenuMngtService {

    @Resource(name="commonDAO")
    private CommonDAO commonDAO;

    /**
	 * 페이지가 있는 List를 조회한다.
	 * @param queryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView selectListAuthMenuMngt(Map<String, Object> model) throws Exception {
        //return commonDAO.selectListJsonView("authmenumngt.getAuthMenu", model);

        List list = commonDAO.selectList("authmenumngt.getAuthMenu", model);

    	ArrayList<MenuNode> dList = new ArrayList<MenuNode>();
		MenuNode tmpNode = null;
		for (int i=0; i<list.size(); i++) {
			HashMap<String, Object> row = (HashMap<String, Object>)list.get(i);
			tmpNode = new MenuNode(row);
			tmpNode.setId(row.get("MENU_ID").toString());
            tmpNode.setParentId(row.get("PRNT_MENU_ID").toString());
            tmpNode.setLevel(Integer.parseInt(String.valueOf(row.get("LEVL"))));
            tmpNode.setHasChild(("Y".equals(row.get("HAS_CHILD").toString())));
			dList.add(tmpNode);
		}
		MenuNode rootNode = createRootNode();
		setupTreeNode(rootNode, dList);

		ModelAndView view = new ModelAndView("jsonView");
		view.addObject("children", rootNode.getChildren());
		view.addObject("total", list.size());
		view.addObject("success", true);
		view.addObject("message", "");

		return view;
    }

    private MenuNode createRootNode() {
		MenuNode rootNode = new MenuNode(null);
        return rootNode;
    }

    private void setupTreeNode(MenuNode parentNode, ArrayList<MenuNode> list) {
        ArrayList<MenuNode> subList = getSiblingList(parentNode.getId(), parentNode.getLevel()+1, list);
        for (MenuNode node : subList) {
            parentNode.addChild(node);
            if (node.isHasChild()) {
                setupTreeNode(node, list);
            }
        }
    }

    private ArrayList<MenuNode> getSiblingList(String parentId, int level, ArrayList<MenuNode> list) {
        ArrayList<MenuNode> rList = new ArrayList<MenuNode>();
        for (MenuNode node : list) {
            if (node.getParentId().equals(parentId) && node.getLevel() == level) {
                rList.add(node);
            }
        }
        return rList;
    }

    /**
	 * 삭제와 저장을 실행한다.
	 * @param dQueryId
	 * @param iQueryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView deleteOrInsertListAuthMenuMngt(Map<String, Object> model) throws Exception {
		ModelAndView view = new ModelAndView("jsonView");
		Integer extCnt = 0;

		LoginModel loginModel = SessionUtil.getInstance().getLoginModel();

		List dataList = CommonUtil.getListFromJson(model.get("updateData").toString());
    	if (dataList != null && !dataList.isEmpty()) {
        	HashMap map = (HashMap) dataList.get(0);
        	commonDAO.deleteData("authmenumngt.deleteAuthMenu", map);
		}
    	if (dataList != null && !dataList.isEmpty()) {
    		String sAuth = "";
            for (int i=0; i<dataList.size(); i++) {
            	HashMap map = (HashMap) dataList.get(i);
            	if (i == 0) {
            		sAuth = map.get("AUTH").toString();
            	}
            	if ((Boolean)map.get("checked")) {
            		map.put("AUTH", sAuth);
                	map.put("USE_YN", "Y");
                	map.put("USER_ID", loginModel.getUserId());
                	extCnt += commonDAO.insertData("authmenumngt.insertAuthMenu", map);
            	}
            }
		}

    	view.addObject("data", null);
    	view.addObject("total", extCnt);
    	view.addObject("success", true);
    	view.addObject("message", SystemMsg.getMsg("COM_RST_0001")); //저장을 완료하였습니다.

    	return view;
	}
}
