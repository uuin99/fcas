package fcas.sys.com.service;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.web.servlet.ModelAndView;

import fcas.sys.com.model.FileModel;

/**
 * @logicalName   Common Service.
 * @description
 * @version       $Rev: 1.0 $
 */
public interface CommonService {

	/** Excel Export Start **/
	List selectExcelFieldDataList(String queryId, Map<String, Object> model) throws Exception;
	/** Excel Export End **/

	/** File Upload / Download Start **/
	Map<String, Object> insertFile(Map<String, Object> setMap, HttpServletRequest request) throws Exception;
	List selectFileMastInfoList(Map<String, Object> model) throws Exception;
	FileModel selectFileMastInfo(Map<String, Object> model) throws Exception;
	ModelAndView deleteFileList(Map<String, Object> model) throws Exception;
	ModelAndView deleteFile(Map<String, Object> model) throws Exception;
	/** File Upload / Download End **/

	/** Sequence Manager Start **/
	String getSequenceValue(String seqId, String seqKey, int seqLeng, String seqType, String seqPreFix) throws Exception;
	String getSequenceValue(String seqId, int seqLeng, String seqType) throws Exception;
	String getSequenceValue(String seqId, int seqLeng, String seqType, String seqPreFix) throws Exception;
	String getSequenceValue(String seqId, int seqLeng) throws Exception;
	String getSequenceValue(String seqId, String seqKey, int seqLeng) throws Exception;
	/** Sequence Manager End **/

	/** FCA History Create Start **/
	//Login, Logout
	boolean insertFcaHistSession(String histType) throws Exception;
	//Search, Excel Export
	boolean insertFcaHistSearch(String progId, String evntType, Map<String, Object> model) throws Exception;
	//Data Transaction (Create, Update, Delete)
	boolean insertfcaHistTrans(String progId, String evntType) throws Exception;
	/** FCA History Create End **/

	/** 시간관련 Start **/
	Map getDbYmd() throws Exception;
	Map getDbYmdStandard() throws Exception;
	Map getDbYmdCustom(String ymd) throws Exception;
	/** 시간관련 End **/

	/** 날씨관련 Start**/
	Map getKwthInfo(Map<String, Object> param) throws Exception;
	/** 날씨관련 End**/
	
	/** Secheduling 관련 **/
	void runSmsBatch() throws Exception;
	void runMakeNecRawSample() throws Exception;
	void runMakeNecRaw() throws Exception;
}
