package fcas.mng.com.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import fcas.sys.com.utl.CommonUtil;


public class MenuNode {
	
	private String id = "root";
	private String parentId = "root";
	private int level = 0;
	private boolean hasChild = false;
	
    public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}
	
	public String getParentId() {
		return parentId;
	}

	public void setParentId(String parentId) {
		this.parentId = parentId;
	}
	
	public int getLevel() {
		return level;
	}

	public void setLevel(int level) {
		this.level = level;
	}
	
	public boolean isHasChild() {
		return hasChild;
	}

	public void setHasChild(boolean hasChild) {
		this.hasChild = hasChild;
	}

	private HashMap<String, Object> appendableMap = null;
	
	private String MENU_ID      = "";
	private String MENU_NM      = ""; 
	private String ORDR_SEQ     = "";
	private String PRNT_MENU_ID = "";
	private String LEVL         = "";
	private String STEP         = "";
	private String HAS_CHILD    = "";
	private String MENU_PATH    = "";
	private String PROG_ID      = "";
	private String PROG_NM      = "";
	private String TRGT_URL     = "";
	private String USE_YN       = "";
	private String REGI_ID      = "";
	private String REGI_NM      = "";
	private String REGI_DT      = "";
	private String UPDT_ID      = "";
	private String UPDT_NM      = "";
	private String UPDT_DT      = "";
	private boolean expandable  = false;
	private boolean leaf        = true;
	private boolean expanded    = false;
	private boolean checked     = false;

	public String getMENU_ID() {
		return MENU_ID;
	}

	public void setMENU_ID(String MENU_ID) {
		MENU_ID = MENU_ID;
	}

	public String getMENU_NM() {
		return MENU_NM;
	}

	public void setMENU_NM(String MENU_NM) {
		MENU_NM = MENU_NM;
	}

	public String getORDR_SEQ() {
		return ORDR_SEQ;
	}

	public void setORDR_SEQ(String ORDR_SEQ) {
		ORDR_SEQ = ORDR_SEQ;
	}

	public String getPRNT_MENU_ID() {
		return PRNT_MENU_ID;
	}

	public void setPRNT_MENU_ID(String PRNT_MENU_ID) {
		PRNT_MENU_ID = PRNT_MENU_ID;
	}

	public String getLEVL() {
		return LEVL;
	}

	public void setLEVL(String LEVL) {
		LEVL = LEVL;
	}

	public String getSTEP() {
		return STEP;
	}

	public void setSTEP(String STEP) {
		STEP = STEP;
	}

	public String getHAS_CHILD() {
		return HAS_CHILD;
	}

	public void setHAS_CHILD(String HAS_CHILD) {
		HAS_CHILD = HAS_CHILD;
	}
	
	public String getMENU_PATH() {
		return MENU_PATH;
	}

	public void setMENU_PATH(String MENU_PATH) {
		MENU_PATH = MENU_PATH;
	}

	public String getPROG_ID() {
		return PROG_ID;
	}

	public void setPROG_ID(String PROG_ID) {
		PROG_ID = PROG_ID;
	}
	
	public String getPROG_NM() {
		return PROG_NM;
	}

	public void setPROG_NM(String PROG_NM) {
		PROG_NM = PROG_NM;
	}
	
	public String getTRGT_URL() {
		return TRGT_URL;
	}

	public void setTRGT_URL(String TRGT_URL) {
		TRGT_URL = TRGT_URL;
	}

	public String getUSE_YN() {
		return USE_YN;
	}

	public void setUSE_YN(String USE_YN) {
		USE_YN = USE_YN;
	}

	public String getREGI_ID() {
		return REGI_ID;
	}

	public void setREGI_ID(String REGI_ID) {
		REGI_ID = REGI_ID;
	}

	public String getREGI_NM() {
		return REGI_NM;
	}

	public void setREGI_NM(String REGI_NM) {
		REGI_NM = REGI_NM;
	}

	public String getREGI_DT() {
		return REGI_DT;
	}

	public void setREGI_DT(String REGI_DT) {
		REGI_DT = REGI_DT;
	}

	public String getUPDT_ID() {
		return UPDT_ID;
	}

	public void setUPDT_ID(String UPDT_ID) {
		UPDT_ID = UPDT_ID;
	}

	public String getUPDT_NM() {
		return UPDT_NM;
	}

	public void setUPDT_NM(String UPDT_NM) {
		UPDT_NM = UPDT_NM;
	}

	public String getUPDT_DT() {
		return UPDT_DT;
	}

	public void setUPDT_DT(String UPDT_DT) {
		UPDT_DT = UPDT_DT;
	}

	public boolean isExpandable() {
		return expandable;
	}

	public void setExpandable(boolean expandable) {
		this.expandable = expandable;
	}

	public boolean isLeaf() {
		return leaf;
	}

	public void setLeaf(boolean leaf) {
		this.leaf = leaf;
	}

	public boolean isExpanded() {
		return expanded;
	}

	public void setExpanded(boolean expanded) {
		this.expanded = expanded;
	}
	
	public boolean isChecked() {
		return checked;
	}

	public void setChecked(boolean checked) {
		this.checked = checked;
	}

	public MenuNode(HashMap<String, Object> appendablePropertiesMap){
        appendableMap = appendablePropertiesMap;
        if (appendableMap != null) {
        	this.MENU_ID      = appendableMap.get("MENU_ID").toString();
            this.MENU_NM      = appendableMap.get("MENU_NM").toString(); 
            this.ORDR_SEQ     = String.valueOf(appendableMap.get("ORDR_SEQ"));
            this.PRNT_MENU_ID = appendableMap.get("PRNT_MENU_ID").toString();
            this.LEVL         = String.valueOf(appendableMap.get("LEVL"));
            this.STEP         = String.valueOf(appendableMap.get("STEP"));
            this.HAS_CHILD    = appendableMap.get("HAS_CHILD").toString();
            this.MENU_PATH    = CommonUtil.getObjToString(appendableMap.get("MENU_PATH"));
            this.PROG_ID      = CommonUtil.getObjToString(appendableMap.get("PROG_ID"));
            this.PROG_NM      = CommonUtil.getObjToString(appendableMap.get("PROG_NM"));
            this.TRGT_URL     = CommonUtil.getObjToString(appendableMap.get("TRGT_URL"));
            this.USE_YN       = CommonUtil.getObjToString(appendableMap.get("USE_YN"));
            this.REGI_ID      = CommonUtil.getObjToString(appendableMap.get("REGI_ID"));
            this.REGI_NM      = CommonUtil.getObjToString(appendableMap.get("REGI_NM"));
            this.REGI_DT      = CommonUtil.getObjToString(appendableMap.get("REGI_DT"));
            this.UPDT_ID      = CommonUtil.getObjToString(appendableMap.get("UPDT_ID"));
            this.UPDT_NM      = CommonUtil.getObjToString(appendableMap.get("UPDT_NM"));
            this.UPDT_DT      = CommonUtil.getObjToString(appendableMap.get("UPDT_DT"));
            this.expandable   = "Y".equals(appendableMap.get("HAS_CHILD").toString());
            this.leaf         = "N".equals(appendableMap.get("HAS_CHILD").toString());
            this.expanded     = "Y".equals(appendableMap.get("HAS_CHILD").toString());
            this.checked      = "Y".equals(CommonUtil.getObjToString(appendableMap.get("USE_YN")));
        }
    }
	
	private List<MenuNode> children = new ArrayList<MenuNode>();
	
	public void addChild(MenuNode node) {
        children.add(node);
    }
	
	public List getChildren() {
		return children;
	}
}
