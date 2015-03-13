package fcas.sys.com.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;

import egovframework.rte.fdl.cmmn.AbstractServiceImpl;
import egovframework.rte.fdl.idgnr.EgovIdGnrService;
import fcas.sys.com.model.LoginModel;
import fcas.sys.com.dao.CommonDAO;
import fcas.sys.com.model.FileModel;
import fcas.sys.com.service.CommonService;
import fcas.sys.com.servlet.SystemMsg;
import fcas.sys.com.utl.CommonUtil;
import fcas.sys.com.utl.SessionUtil;
import fcas.sys.com.utl.SmsSendUtil;

/**
 * @logicalName   Common Service Impl.
 * @description
 * @version       $Rev: 1.0 $
 */
@Service("commonService")
public class CommonServiceImpl extends AbstractServiceImpl implements CommonService {

    @Resource(name="commonDAO")
    private CommonDAO commonDAO;

    /** ID Generation */
    @Resource(name="egovIdGnrService")
    private EgovIdGnrService egovIdGnrService;

    public void setCommonDao(CommonDAO dao){
    	this.commonDAO = dao;
    }

    /** Excel Export Start **/
    /**
	 * Excel Export하기 위하여 임의의 Query Id를 Parameter로 받아 실행함.
	 * @param queryId
	 * @param model
	 * @return List
	 * @exception
	 */
    public List selectExcelFieldDataList(String queryId, Map<String, Object> model) throws Exception {
    	// 20130902 대용량 데이터 조회 제한 로직 추가 : view단에서 처리하기 때문에 필요없음. S
    	List cntList = commonDAO.selectList(queryId + "Count", model);
    	if (Integer.parseInt(cntList.get(0).toString()) > 10000){
    		return null;
    	} else {
    		return commonDAO.selectList(queryId, model);
    	}
        // 20130902 대용량 데이터 조회 제한 로직 추가 E
    }
    /** Excel Export End **/

    /** File Upload / Download Start **/
    /**
	 * File Upload.
	 * @param confMap
	 * @param multiRequest
	 * @param request
	 * @return List<Map<String, Object>>
	 * @exception
	 */
    public Map<String, Object> insertFile(Map<String, Object> confMap, HttpServletRequest request) throws Exception{

    	Map<String, Object>  retMap = new HashMap<String, Object>();
    	LoginModel loginModel = SessionUtil.getInstance().getLoginModel();

    	int fileCnt = 0;
    	List<Map<String, Object>> retFileInfoList = new ArrayList<Map<String, Object>>();
    	/** Parameter Validation Checking Start **/
    	if(! (request instanceof MultipartHttpServletRequest)){
    		retMap.put("MSG_CODE", "COM_ERR_0008"); //UPLOAD를 진행할 파일이 존재하지 않습니다.
    		retMap.put("MSG", SystemMsg.getMsg("COM_ERR_0008")); //UPLOAD를 진행할 파일이 존재하지 않습니다.
    		return retMap;
    	}

		final MultipartHttpServletRequest multiRequest = (MultipartHttpServletRequest) request;

    	/** Parameter Validation Checking End **/

    	/** Key Value Setting Start **/
    	String fileUid = "";
    	int fileSeq = -1;

    	if(confMap.get("FILE_UID") == null || "".equals(confMap.get("FILE_UID"))){
    		//File Upload 요청한 곳에 FILE_UID가 존재하지 않을 경우! [신규] - FILE_SEQ = 0
    		fileUid = CommonUtil.getFileUniqueId();
    		fileSeq = 0;
    	}else {
    		//File Upload 요청한 곳에 FILE_UID가 존재하지 않을 경우! [File 추가.] - FILE_SEQ 검색.
    		fileUid = confMap.get("FILE_UID").toString();
    		fileSeq = (Integer)commonDAO.selectData("common.getFileMastFileUidSeq", confMap);
    	}

    	retMap.put("FILE_UID", fileUid);
    	/** Key Value Setting End **/

    	/** File 초기화 Start **/
    	if("Y".equals(confMap.get("INIT_FILE_FLAG"))){
    		commonDAO.delete("common.deleteFileMast", retMap);
    		fileSeq = 0;
    	}
    	/** File 초기화 End **/

    	/** File 저장 Start **/
    	Iterator<String> fileNameIterator = multiRequest.getFileNames();
    	MultipartFile multiFile = null;
    	while (fileNameIterator.hasNext()) {
    		multiFile = multiRequest.getFile(fileNameIterator.next());
        	if (multiFile.isEmpty()) {
        		continue;
        	}

        	int iFileSize = (int)multiFile.getSize();
        	//File Size 20M (20 * 1024 * 1024)로 제약! - 최대 2G까지 가능.
        	if (iFileSize > 20971520) {
        		retMap.put("MSG_CODE", "COM_ERR_0009"); //업로드 가능한 최대 크기는 300MB입니다.
        		retMap.put("MSG", SystemMsg.getMsg("COM_ERR_0009")); //업로드 가능한 최대 크기는 300MB입니다.
        		return retMap;
        	}
        	//File Stream 형태로 변환. Read
        	byte[] buf = new byte[iFileSize];
        	multiFile.getInputStream().read(buf);

        	//Insert Map Setting.
        	HashMap<String, Object> map = new HashMap<String, Object>();
        	map.put("FILE_UID",	fileUid);
        	map.put("FILE_SEQ", ++fileSeq);
        	map.put("FILE_NM", 	multiFile.getOriginalFilename());
        	map.put("FILE_SIZE",iFileSize);
        	map.put("FILE_CONT",buf);
        	map.put("FILE_CATE","");
        	map.put("USER_ID",	loginModel.getUserId());

        	commonDAO.insert("common.insertFileMast", map);

        	//File Stream 형태로 변환. Close
        	multiFile.getInputStream().close();

        	//Retrun File Info에는 File Contencts는 제외.
        	map.remove("FILE_CONT");
        	retFileInfoList.add(map);

        	fileCnt ++;
        }
    	retMap.put("insertFileCnt", fileCnt);
    	/** File 저장 End **/

    	/** 저장 후 작업 Start **/
    	if (fileCnt == 0) {
    		retMap.put("MSG_CODE", "COM_ERR_0008"); //UPLOAD를 진행할 파일이 존재하지 않습니다.
    		retMap.put("MSG", SystemMsg.getMsg("COM_ERR_0008")); //UPLOAD를 진행할 파일이 존재하지 않습니다.
    		return retMap;
    	}

    	/** 저장 후 작업 End **/
    	retMap.put("FILE_INFO_LIST", retFileInfoList); //File 일반적인 정보를 Return 함.
    	retMap.put("MSG_CODE", "COM_RST_0004"); //성공적으로 파일이 업로드 되었습니다.
    	retMap.put("MSG", SystemMsg.getMsg("COM_RST_0004")); //성공적으로 파일이 업로드 되었습니다.
    	return retMap;
    };

    /**
	 * 파일정보리스트를 호출함.(단, File Content 제외.).
	 * @param model
	 * @return List
	 * @exception exception
	 * @notice FILE_UID는 필수임. FILE_SEQ는 선택임. (FILE_SEQ 입력 시 - 해당 FILE_SEQ에 해당하는 정보만 호출.; FILE_SEQ 미 입력 시 - FILE_UID에 해당하는 모든 정보를 호출;)
	 */
	public List selectFileMastInfoList(Map<String, Object> model) throws Exception{
		return commonDAO.selectList("common.selectFileMastInfoList", model);
	}

    /**
	 * 단일 파일정보를 호출함.(File Content 포함.).
	 * @param model
	 * @return FileModel
	 * @exception
	 * @notice FILE_UID, FILE_SEQ는 필수임.
	 */
	public FileModel selectFileMastInfo(Map<String, Object> model) throws Exception{

		return (FileModel)commonDAO.selectData("common.selectFileMastInfo", model);
	}

    /**
	 * File List Delete.
	 * @param model
	 * @return ModelAndView
	 * @exception
	 * @notice FILE_UID, FILE_SEQ는 필수임.
	 */
	public ModelAndView deleteFileList(Map<String, Object> model) throws Exception{
		ModelAndView view = new ModelAndView("jsonView");
		Integer extCnt = 0;

		//DB Delete
		List<Map<String, Object>> delete_dataList = CommonUtil.getListFromJson(model.get("deleteData").toString());
    	if (delete_dataList != null && !delete_dataList.isEmpty()) {
            for (Map<String, Object> map : delete_dataList) {
            	extCnt += commonDAO.delete("common.deleteFileMast", map);
            }
		}

		view.addObject("data", null);
    	view.addObject("total", extCnt);
    	view.addObject("success", true);
    	view.addObject("message", SystemMsg.getMsg("COM_RST_0003")); //삭제를 완료하였습니다.
    	return view;
	}

	/**
	 * One File Delete.
	 * @param model
	 * @return ModelAndView
	 * @exception
	 * @notice FILE_UID 필수, FILE_SEQ 옵션.
	 */
	public ModelAndView deleteFile(Map<String, Object> model) throws Exception{
		ModelAndView view = new ModelAndView("jsonView");
		Integer extCnt = 0;

		//DB Delete
        extCnt += commonDAO.delete("common.deleteFileMast", model);

		view.addObject("data", null);
    	view.addObject("total", extCnt);
    	view.addObject("success", true);
    	view.addObject("message", SystemMsg.getMsg("COM_RST_0003")); //삭제를 완료하였습니다.
    	return view;
	}

	/** File Upload / Download End **/

	/** Sequence Manager Start **/

	/**
	 * Sequence를 관리하는 Method
	 * @param seqId - 10 Byte
	 * @param seqKey
	 * @param seqLeng
	 * @param seqType
	 * @param seqPreFix
	 * @return String
	 * @exception
	 * @notice
	 */
	public String getSequenceValue(String seqId, String seqKey, int seqLeng, String seqType, String seqPreFix) throws Exception{

		/*
		 * seqType
		 * 	PE-YYYYMM 	: Prefix가 날짜형으로 YYYYMM형태를 가질 때.
		 *  PE-YYMM 	: Prefix가 날짜형으로 YYMM형태를 가질 때.
		 *  PE-XY4M2 	: Prefix가 사용자 지정 + 날짜형 YYYYMM형태를 가질 때.
		 *  PE-XY2M2 	: Prefix가 사용자 지정 + 날짜형 YYMM형태를 가질 때.
		 *  PE-XY4M2D2 	: Prefix가 사용자 지정 + 날짜형 YYYYMMDD형태를 가질 때.
		 *  PE-XY2M2D2 	: Prefix가 사용자 지정 + 날짜형 YYMMDD형태를 가질 때.		 *
		 *  PE-ETC		: Prefix가 날짜형을 포함하지 않고 사용자 지정형만 가질 때.
		 *  NO_PE		: Prefix가 존재하지 않을 때.
		 * */
		/** Default Parameter Setting Start **/
		LoginModel loginModel = SessionUtil.getInstance().getLoginModel();
		Map<String, Object> modelMap = new HashMap<String, Object>();
		modelMap.put("SEQ_ID", seqId);
		modelMap.put("SEQ_KEY", seqKey);
		modelMap.put("SEQ_TYPE", seqType);
		modelMap.put("SEQ_PREFIX", seqPreFix);
		modelMap.put("REGI_ID", loginModel.getUserId());
		modelMap.put("UPDT_ID", loginModel.getUserId());
		/** Default Parameter Setting End **/

		/** 이전 Data 확인  Start**/
		//Data 확인 - 미존 시 생성, 존재 시 Sequence Number Up.
		List<Map<String, Object>> seqTempMapList = (List<Map<String, Object>>)commonDAO.selectList("common.selectSeq", modelMap);

		if(seqTempMapList == null || seqTempMapList.size() == 0){
			commonDAO.insert("common.insertSeq", modelMap);
		}else if(seqTempMapList.size() == 1){
			commonDAO.update("common.updateSeq", modelMap);
		}else {
			throw new Exception("[ERROR] 중복된 Sequence Key가 존재합니다. 확인하여 주시기 바랍니다.");
		}
		/** 이전 Data 확인  End**/

		/** Return Data Setting Start **/
		Map<String, Object> seqMap = new HashMap<String, Object>();
		seqMap = (HashMap<String, Object>)commonDAO.selectData("common.selectSeq", modelMap);

		String prefixStr = seqMap.get("SEQ_PREFIX").toString();
		String retStr = seqMap.get("SEQ_NO").toString();

		//Return Data Size Setting.
		if ((retStr.length() + prefixStr.length()) < seqLeng) {
			int loopCnt = seqLeng - (retStr.length() + prefixStr.length());
			for (int s = 0 ; s < loopCnt ; s ++) {
				retStr = "0" + retStr;
			}
		}
		retStr = prefixStr + retStr;
		/** Return Data Setting End**/

		return retStr;
	}

	/**
	 * Sequence를 관리하는 Method
	 * @param seqId - 10 Byte
	 * @param seqLeng
	 * @param seqType
	 * @return String
	 * @exception
	 * @notice Sequence Prefix가 고정(날짜 사용)이거나 사용하지 않을 경우 사용한다.
	 */
	public String getSequenceValue(String seqId, int seqLeng, String seqType) throws Exception{
		String retStr = getSequenceValue(seqId, "1", seqLeng, seqType, "");
		return retStr;
	}

	/**
	 * Sequence를 관리하는 Method
	 * @param seqId - 10 Byte
	 * @param seqLeng
	 * @param seqType
	 * @param seqPreFix
	 * @return String
	 * @exception
	 * @notice Sequence Prefix가 고정(날짜 사용)이거나 사용하지 않을 경우 사용한다.
	 */
	public String getSequenceValue(String seqId, int seqLeng, String seqType, String seqPreFix) throws Exception{
		String retStr = getSequenceValue(seqId, "1", seqLeng, seqType, seqPreFix);
		return retStr;
	}

	/**
	 * Sequence를 관리하는 Method
	 * @param seqId - 10 Byte
	 * @param seqLeng
	 * @param seqType
	 * @exception
	 * @notice Sequence Prefix를 사용하지 않을 경우 사용한다. (Sequence Key Default 값 사용.)
	 */
	public String getSequenceValue(String seqId, int seqLeng) throws Exception{
		String retStr = getSequenceValue(seqId, "1", seqLeng, "NO-PE", "");
		return retStr;
	}

	/**
	 * Sequence를 관리하는 Method
	 * @param seqId - 10 Byte
	 * @param seqKey
	 * @param seqLeng
	 * @param seqType
	 * @exception
	 * @notice Sequence Prefix를 사용하지 않을 경우 사용한다. (Sequence Key 설정 값 사용.)
	 */
	public String getSequenceValue(String seqId, String seqKey, int seqLeng) throws Exception{
		String retStr = getSequenceValue(seqId, seqKey, seqLeng, "NO-PE", "");
		return retStr;
	}

	/** Sequence Manager End **/

	/** FCA History Create Start **/

	/**
	 * 사용이력입력 - Session(Login, Logout) 부분
	 * @param histType
	 * @exception Exception
	 */
	public boolean insertFcaHistSession(String histType) throws Exception{
		boolean retBol = true;
		//이력유형이 로그인(A), 로그아웃(B)인 경우에만 사용 가능.
		if ("A".equals(histType) || "B".equals(histType)) {
			LoginModel loginModel = SessionUtil.getInstance().getLoginModel();
			Map<String, Object> paramMap = new HashMap<String, Object>();

			paramMap.put("LOGIN_ID", loginModel.getLoginId());//LOGIN 아이디
			paramMap.put("USER_ID", loginModel.getUserId());//사용자 아이디
			paramMap.put("COMP_ID", loginModel.getCompId());//고객사 아이디
			paramMap.put("SHOP_ID", loginModel.getShopId());//매장 아이디
			paramMap.put("DEPT_NM", loginModel.getDeptNm());//부서
			paramMap.put("POSI_NM", loginModel.getDeptNm());//직책
			paramMap.put("HIST_TYPE", histType);//이력유형
			paramMap.put("PROG_ID", "");//프로그램 아이디
			paramMap.put("EVNT_TYPE", "");//이벤트 유형
			paramMap.put("ACES_IP", loginModel.getUserIp());//접근 아이피
			paramMap.put("SRCH_DETL", "");//검색 상세
			commonDAO.insert("common.insertHist", paramMap);

		} else {
			retBol = false;
		}
		return retBol;
	}

	/**
	 * 사용이력입력 - Session(Login, Logout) 부분
	 * @param histType
	 * @exception Exception
	 */
	public boolean insertFcaHistSearch(String progId, String evntType, Map<String, Object> model) throws Exception{
		/*
		 * 참고사항. model Parameter에 반드시 포함되어져야할 Parameter
		 * 	SC_MAP:[{"검색조건 ID":"검색 조건 Title",...}]
		 * 	※검색 조건이 존재하지 않을 경우에는 'SC_MAP:[{}]' 입력하면 된다.
		 */
		boolean retBol = true;
		String scMenuDiv = "";
		String scMenuCd = "";
		String scMenuNm = "";
		//Model에 검색조건(Search Criteria)에 대한 설정 값이 존재하지 않을 경우, "" Paging일 경우 Paging을 통한 조회를 한 경우.
		if (model.get("SC_MAP") == null || "".equals(model.get("SC_MAP"))) {
			retBol = false;
		//이벤트 유형이 조회(A), Excel Export(C) 일때만 사용한다.
		} else if("A".equals(evntType) || "C".equals(evntType)) {
			//검색조건에 대한 설정값을 Map형태로 수정.
			List<Map<String, Object>> searchCriteriaList = CommonUtil.getListFromJson(model.get("SC_MAP").toString());

			if(searchCriteriaList.size() == 1){

				Map<String, Object> searchCriteriaMap = searchCriteriaList.get(0);
				String srchDetl = "";
				Map<String, Object> histDetlMap = new HashMap<String, Object>();

				//Sub Menu Name Setting.
				scMenuDiv = CommonUtil.getObjToString(model.get("SC_MENU_DIV"));
				scMenuCd =  CommonUtil.getObjToString(model.get("SC_MENU_CD"));
				if((!"".equals(scMenuDiv)) && (!"".equals(scMenuCd))){
					scMenuNm = String.valueOf(commonDAO.selectData("common.selectCdToMenuDesc", model));
					histDetlMap.put(scMenuDiv + "|"+scMenuCd, scMenuNm);
					scMenuNm += " : ";
				}

				//검색 조건 Parmas Setting.
				if(!searchCriteriaMap.isEmpty()){
					for(String key : searchCriteriaMap.keySet()){

						if("00016".equals(searchCriteriaMap.get(key).toString()) //설치위치
								&& (model.get(key) != null)
								&& (!( "".equals(model.get(key)) || "TT".equals(model.get(key)) || "XX".equals(model.get(key))))
							){
							//00016(설치 위치)은 특수사항.
							histDetlMap.put(key, searchCriteriaMap.get(key));
							srchDetl += (srchDetl == "" ? (searchCriteriaMap.get(key)) : ("," + searchCriteriaMap.get(key)));
						}else if( (!"00016".equals(searchCriteriaMap.get(key).toString()))
								&& model.get(key) != null
								&& (!"".equals(model.get(key)))
								){
							histDetlMap.put(key, searchCriteriaMap.get(key));
							srchDetl += (srchDetl == "" ? (searchCriteriaMap.get(key)) : ("," + searchCriteriaMap.get(key)));
						}
					}
				}

				//검색 상세 - CD에서 CD_DESC으로 변환.
				if (! "".equals(srchDetl)) {
					String srchDetlTemp = "";
					srchDetlTemp = "'" + srchDetl.replaceAll(",", "','") + "'";
					Map<String, Object> tempMap = new HashMap<String, Object>();
					tempMap.put("CD_LIST", srchDetlTemp);
					List<Map<String, Object>> srchDetlList = commonDAO.selectList("common.selectCdToCddesc", tempMap);
					if(srchDetlList != null && srchDetlList.size() == srchDetlTemp.split(",").length){
						srchDetl = scMenuNm;
						for (Map<String, Object> map: srchDetlList) {
							srchDetl += (srchDetl == scMenuNm ? map.get("CD_DESC").toString() : "," + map.get("CD_DESC").toString());
						}
					}
				}
				//이력 Header 입력.
				LoginModel loginModel = SessionUtil.getInstance().getLoginModel();
				Map<String, Object> paramMap = new HashMap<String, Object>();

				paramMap.put("USER_ID", loginModel.getUserId());//사용자 아이디
				paramMap.put("LOGIN_ID", loginModel.getLoginId());//LOGIN 아이디
				paramMap.put("COMP_ID", loginModel.getCompId());//고객사 아이디
				paramMap.put("SHOP_ID", loginModel.getShopId());//매장 아이디
				paramMap.put("DEPT_NM", loginModel.getDeptNm());//부서
				paramMap.put("POSI_NM", loginModel.getPosiNm());//직책
				paramMap.put("HIST_TYPE", "C");//이력유형 - '화면사용' 고정
				paramMap.put("PROG_ID", progId);//프로그램 아이디
				paramMap.put("EVNT_TYPE", evntType);//이벤트 유형
				paramMap.put("ACES_IP", loginModel.getUserIp());//접근 아이피
				paramMap.put("SRCH_DETL", srchDetl);//검색 상세
				int histSeq = (Integer)commonDAO.selectData("common.selectMaxHistSeq", paramMap);
				histSeq ++;
				paramMap.put("HIST_SEQ", histSeq);//이력 시퀀스
				commonDAO.insert("common.insertHist2", paramMap);

				//이력 Detail 입력.
				Map<String, Object> paramDetlMap = new HashMap<String, Object>();
				if(! histDetlMap.isEmpty()){
					for(String key : histDetlMap.keySet()){
						paramDetlMap.put("USER_ID", loginModel.getUserId());
						paramDetlMap.put("HIST_SEQ", histSeq);
						paramDetlMap.put("SRCH_TILE_CD", histDetlMap.get(key));
						commonDAO.insert("common.insertHistDetl", paramDetlMap);
					}
				}

			}else {
				retBol = false;
			}
		//이외의 사항에 대해서도 허용되지 않음.
		} else {
			retBol = false;
		}

		return retBol;
	}

	/**
	 * 사용이력입력 - Transaction(Create, Update, Delete) 부분
	 * @param progId
	 * @param evntType
	 * @exception Exception
	 */
	public boolean insertfcaHistTrans(String progId, String evntType) throws Exception{
		boolean retBol = true;
		//이벤트 유형이 저장(B), 수정(D), 삭제(E)일때만 사용한다.
		if ("B".equals(evntType) || "D".equals(evntType) || "E".equals(evntType)) {
			LoginModel loginModel = SessionUtil.getInstance().getLoginModel();
			Map<String, Object> paramMap = new HashMap<String, Object>();

			paramMap.put("USER_ID", loginModel.getUserId());//사용자 아이디
			paramMap.put("LOGIN_ID", loginModel.getLoginId());//LOGIN 아이디
			paramMap.put("COMP_ID", loginModel.getCompId());//고객사 아이디
			paramMap.put("SHOP_ID", loginModel.getShopId());//매장 아이디
			paramMap.put("DEPT_NM", loginModel.getDeptNm());//부서
			paramMap.put("POSI_NM", loginModel.getDeptNm());//직책
			paramMap.put("HIST_TYPE", "C");//이력유형 - '화면사용' 고정
			paramMap.put("PROG_ID", progId);//프로그램 아이디
			paramMap.put("EVNT_TYPE", evntType);//이벤트 유형
			paramMap.put("ACES_IP", loginModel.getUserIp());//접근 아이피
			paramMap.put("SRCH_DETL", "");//검색 상세
			commonDAO.insert("common.insertHist", paramMap);
		} else {
			retBol = false;
		}

		return retBol;
	}

	/** FCA History Create End **/



	/**
	 * db yyyymmdd 값을 리턴 합니다.
	 */
	public Map getDbYmd() throws Exception{
		return (Map)commonDAO.selectData("common.getDbYmd", null);
	}


	/**
	 * db yyyymmdd 값을 리턴 합니다. ( 매장분석 기본레포트의 기준일을 가져온다 : 말이 기준일이지.. 오늘날짜 -1 일이다. )
	 */
	public Map getDbYmdStandard() throws Exception{
		return (Map)commonDAO.selectData("common.getDbYmdStandard", null);
	}

	/**
	 * db yyyymmdd 값을 리턴 합니다.
	 */
	public Map getDbYmdCustom(String ymd) throws Exception{
		return (Map)commonDAO.select("common.getDbYmdCustom", ymd);
	}

	/**
	 * 날씨를 가져옵니다.
	 * param내용:   STND_DATE=요청날짜
	 * param내용:   TIME_GRP=오전오후그룹코드
	 * param내용:   SHOP_ID=매장ID
	 * param내용:   COMP_ID=고객사ID
	 */
	public Map getKwthInfo(Map<String, Object> param) throws Exception{
		return (Map)commonDAO.selectData("common.getKwthInfo", param);
	}

	/**
	 * Sms Scheduling
	 */
	public void runSmsBatch() throws Exception{
		System.out.println("Run Sms Batch!!!!!");
		Integer extCnt = 0;
		int totlCnt = 0;
    	int succCnt = 0;
    	int failCnt = 0;
		try{
			Map<String, Object> model = new HashMap<String, Object>();
			model.put("SMS_DATE", "0");
			Map<String, Object> loginMap = (HashMap<String, Object>)commonDAO.selectData("smsmngt.getSmsIdPass", model);
	    	if(loginMap.get("REV_TIME_VALID").toString().startsWith("COM_ERR_")){
	    		throw new Exception(SystemMsg.getMsg(loginMap.get("REV_TIME_VALID").toString()));
	    	}

	    	SmsSendUtil smsUtil = new SmsSendUtil(loginMap.get("ID").toString(), loginMap.get("PASS").toString());
	    	List<Map<String, Object>> dataList = commonDAO.selectList("common.getSmsSendList", model);

	    	if(!dataList.isEmpty()){
	    		totlCnt = dataList.size();
		    	for(Map<String, Object>map : dataList){
		    		Map<String, Object> tempModel = smsUtil.sendSms(map.get("SMS_TO").toString(), map.get("SMS_FROM").toString(), map.get("SMS_DATE") == null ? "" : map.get("SMS_DATE").toString(), map.get("SMS_MSG").toString(), "G", map.get("SMS_TO_ID") == null ? "" : map.get("SMS_TO_ID").toString(), map.get("SMS_TO_NM").toString(), map.get("REGI_ID") == null ? "" : map.get("REGI_ID").toString());
		    		tempModel.put("SMS_SEQ", map.get("SMS_SEQ"));
		    		extCnt +=commonDAO.update("common.updateSmsInfo", tempModel);
		    		if("0".equals(smsUtil.getRetCode())){
	            		succCnt ++;
	            	}else {
	            		failCnt ++;
	            	}
		    	}
		    	System.out.println("SMS Send Scheduling Result");
		    	System.out.println("Total :  "+dataList.size()+", Success : "+succCnt+", Failed "+failCnt);
	    	}else {
	    		System.out.println("Is Not SMS");
	    	}
		}catch(Exception ex){
			System.out.println("SMS 전송 Scheduling를 실행 중 ");
    		if(totlCnt > 0){System.out.print("총 "+totlCnt+"건이 실행 예정이었는데, ");}
    		if(succCnt > 0){System.out.print(succCnt+"건이 성공하였으며, ");}
    		if(failCnt > 0){System.out.print(failCnt+"건이 실패하고 ");}
    		System.out.print("다음과 같은 문제가 발생하였습니다.");
			ex.printStackTrace();
		}

		System.out.println("End Sms Batch!!!!!");
	}

	public void runMakeNecRawSample() throws Exception{
		System.out.println("Run New Raw Sample Data Create!!!");

		commonDAO.update("common.runMakeNecRawSample", new HashMap<String, Object>());

		System.out.println("End New Raw Sample Data Create!!!");
	}

	public void runMakeNecRaw() throws Exception{
		System.out.println("Run New Raw Data Create!!!");

		commonDAO.update("common.runMakeNecRaw", new HashMap<String, Object>());

		System.out.println("End New Raw Data Create!!!");
	}

}
