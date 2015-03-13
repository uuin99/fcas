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
import fcas.mng.com.service.MenuMngtService;
import fcas.sys.com.dao.CommonDAO;
import fcas.sys.com.servlet.SystemMsg;
import fcas.sys.com.utl.CommonUtil;
import fcas.sys.com.utl.SessionUtil;

/**
 * @logicalName   Menu Management Service Impl.
 * @description
 * @version       $Rev: 1.0 $
 */
@Service("menumngtService")
public class MenuMngtServiceImpl extends AbstractServiceImpl implements MenuMngtService {

    @Resource(name="commonDAO")
    private CommonDAO commonDAO;

    /**
	 * 페이지가 있는 List를 조회한다.
	 * @param queryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView selectListMenuMngt(Map<String, Object> model) throws Exception {
    	List list = commonDAO.selectList("menumngt.getMenu", model);

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
	 * 저장과 수정, 삭제를 실행한다.
	 * @param iQueryId
	 * @param uQueryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView insertOrUpdateOrDeleteListMenuMngt(Map<String, Object> model) throws Exception {
		ModelAndView view = new ModelAndView("jsonView");
		Integer extCnt = 0;

		LoginModel loginModel = SessionUtil.getInstance().getLoginModel();

		List<HashMap<String, Object>> list = commonDAO.selectList("menumngt.getMenu", model);
		List<HashMap<String, Object>> deleteList = new ArrayList<HashMap<String,Object>>();
		deleteList.addAll(list);

    	List update_dataList = CommonUtil.getListFromJson(model.get("updateData").toString());
		if (update_dataList != null && !update_dataList.isEmpty()) {
			List tmpList = new ArrayList();
            for (int i=0; i<update_dataList.size(); i++) {
            	HashMap map = (HashMap)update_dataList.get(i);

            	if (map.get("MENU_ID").toString().equals("")) {
            		map.put("NEW_DATA", "Y"); //신규 구분자
            		map.put("MENU_ID", setMenuId());
            	} else {
            		map.put("NEW_DATA", "N"); //신규 구분자
            	}
            	map.put("ORDR_SEQ", i+1);
            	map.put("LEVL", map.get("depth"));
            	map.put("STEP", map.get("index"));
            	map.put("HAS_CHILD", (Boolean)map.get("leaf") ? "N" : "Y");
            	map.put("USE_YN", (Boolean)map.get("checked") ? "Y" : "N");
            	map.put("USER_ID", loginModel.getUserId());

            	tmpList.add(map);

            	//삭제할 대상을 추출한다.
            	for (Map<String, Object> deleteMap : list) {
            		if (deleteMap.get("MENU_ID").equals(map.get("MENU_ID"))) {
            			deleteList.remove(deleteMap);
            		}
            	}
            }

            for (int i=0; i<tmpList.size(); i++) {
            	HashMap map = (HashMap)tmpList.get(i);

            	map.put("PRNT_MENU_ID", setPrntMenuId(map.get("parentId").toString(), tmpList));

            	if (("Y").equals(map.get("NEW_DATA").toString())) {
            		extCnt += commonDAO.insertData("menumngt.insertMenu", map);
            	} else {
            		extCnt += commonDAO.updateData("menumngt.updateMenu", map);
            	}
            }
		}

		if (deleteList != null && !deleteList.isEmpty()) {
			for (HashMap<String, Object> map : deleteList) {
				extCnt += commonDAO.deleteData("menumngt.deleteMenu", map);
			}
		}

		view.addObject("data", null);
    	view.addObject("total", extCnt);
    	view.addObject("success", true);
    	view.addObject("message", SystemMsg.getMsg("COM_RST_0001")); //저장을 완료하였습니다.

    	return view;
	}

    /**
	 * 페이지가 있는 List를 조회한다.
	 * @param queryId
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    public ModelAndView selectListDeleteMenuValidMngt(Map<String, Object> model) throws Exception {
    	ModelAndView view = new ModelAndView("jsonView");
		List<Map<String, Object>> list = commonDAO.selectList("menumngt.getMenuOfAuthList", model);
		if(list.isEmpty()){
	    	view.addObject("success", true);
		}else {
			String strMenuOfAuth = "";
			for(Map<String, Object> map : list){
				strMenuOfAuth += strMenuOfAuth == "" ? map.get("MENU_NM") : ", "+map.get("MENU_NM");
			}
			strMenuOfAuth = SystemMsg.getMsg("COM_ERR_0044").replaceAll("param", strMenuOfAuth);
	    	view.addObject("success", false);
	    	view.addObject("message",strMenuOfAuth);
	    	view.addObject("messageCode","COM_ERR_0042");
		}
		
		return view;
    }    
    
    
    /**
	 * Menu ID를 생성한다.
	 * @return String
	 * @exception
	 */
    private String setMenuId(){
    	String tmpStr = "" + new java.rmi.dgc.VMID();
    	tmpStr = tmpStr.replaceAll(":", "");
    	tmpStr = tmpStr.replaceAll("-", "_");
    	return tmpStr;
    }

    /**
	 * List에서 Parent ID에 해당하는 상위 ID를 추출한다.
	 * @param parentId
	 * @param list
	 * @return String
	 * @exception
	 */
    private String setPrntMenuId(String parentId, List list){
    	if (parentId.equals("root")) {
    		return "root";
    	} else {
    		for (int i=0; i<list.size(); i++) {
        		HashMap map = (HashMap)list.get(i);
        		if (parentId.equals(map.get("id").toString())) {
        			return map.get("MENU_ID").toString();
        		}
        	}
    	}

    	return "";
    }
}
