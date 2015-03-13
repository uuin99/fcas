package fcas.sys.com.web;

import java.io.BufferedOutputStream;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import fcas.sys.com.model.FileModel;
import fcas.sys.com.service.CommonService;
import fcas.sys.com.servlet.SystemMsg;
import fcas.sys.com.utl.CommonUtil;

/**
 * @logicalName   Common Controller.
 * @description
 * @version       $Rev: 1.0 $
 */
@Controller
public class CommonController {
    @Resource(name = "commonService")
    private CommonService commonService;


    /** Excel Export Start **/

    /**
	 * 공통 ExcelExport를 호출한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return ModelAndView
     * @throws Exception
	 * @exception
	 */
    @RequestMapping(value="/sys/com/Common/getExcelDownFile.do")
    public ModelAndView getExcelDownFile(HttpServletRequest request, HttpServletResponse response,
        @RequestParam Map<String, Object> model) throws Exception {
        String[] cols = model.get("COLS").toString().split(",");
        String[] cwds = null;
        if (model.get("WIDTHS") != null) {
            cwds = model.get("WIDTHS").toString().split(",");
        } else {
            cwds = new String[cols.length];
            for (int w=0;w<cwds.length;w++) {
                cwds[w] = "10";
            }
        }

        String[] titles = null;
        if (model.get("TITLE") == null) {
            titles = cols;
        } else {
            titles = model.get("TITLE").toString().split(",");
        }

        List list = commonService.selectExcelFieldDataList(model.get("SQLID").toString(), model);

        if (list != null) {
        	SimpleDateFormat mSimpleDateFormat = new SimpleDateFormat("yyyyMMddHHmmss", Locale.KOREA);
        	Date currentTime = new Date();
        	String mTime = mSimpleDateFormat.format(currentTime);
            String sheet_name = model.get("SHEET_NAME").toString();
            String file_name = sheet_name + "_" + mTime + ".xlsx";
            BufferedOutputStream outs = null;
            try {
                Workbook book = new XSSFWorkbook();

                Font font = book.createFont();
                font.setFontHeightInPoints((short)10);

                CellStyle headerStyle = null;
                headerStyle  =  book.createCellStyle();
                //headerStyle.
                headerStyle.setAlignment(CellStyle.ALIGN_LEFT);
                headerStyle.setBorderBottom(CellStyle.BORDER_THIN);
                headerStyle.setBorderLeft(CellStyle.BORDER_THIN);
                headerStyle.setBorderRight(CellStyle.BORDER_THIN);
                headerStyle.setBorderTop(CellStyle.BORDER_THIN);

                headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
                headerStyle.setFillPattern(CellStyle.SOLID_FOREGROUND);

                headerStyle.setFont(font);

                CellStyle lineStyle = null;
                lineStyle  =  book.createCellStyle();
                //lineStyle.
                lineStyle.setBorderBottom(CellStyle.BORDER_THIN);
                lineStyle.setBorderLeft(CellStyle.BORDER_THIN);
                lineStyle.setBorderRight(CellStyle.BORDER_THIN);
                lineStyle.setBorderTop(CellStyle.BORDER_THIN);

                lineStyle.setFont(font);

                book.createSheet(sheet_name);
                Sheet sheet = book.getSheet(sheet_name);

                for (int j=0; j<cols.length; j++) {
                    try {
                        sheet.setColumnWidth((short)(j), (short)(Integer.parseInt(cwds[j].trim())*256));
                    } catch(Exception err) {
                        err.printStackTrace();
                        continue;
                    }
                }

                Row title_row = sheet.createRow(0);
                for (int i=0; i<list.size(); i++) {
                    HashMap rowMap = (HashMap)list.get(i);
                    Row row = sheet.createRow(i+1);
                    for (int j=0 ; j<cols.length ; j++) {
                        String rowKey = cols[j];
                        String rowValue = rowMap.get(rowKey.trim()) == null ? "" : rowMap.get(rowKey.trim()).toString();

                        if (i == 0) {
                            Cell title_cell = title_row.createCell(j);
                            title_cell.setCellValue(titles[j]);
                            title_cell.setCellStyle(headerStyle);

                        }
                        Cell cell = row.createCell(j);
                        cell.setCellValue(rowValue);
                        cell.setCellStyle(lineStyle);
                    }
                }

                file_name = new String((file_name.toString()).getBytes("EUC-KR"), "8859_1");

                response.setContentType("application/x-msdownload; charset=EUC-KR");
                response.setHeader("Content-Disposition", "attachment; filename=" + file_name);
                response.setHeader("Content-Description", "JSP Generated Data");

                outs = new BufferedOutputStream(response.getOutputStream());

                book.write(outs);
            } catch(Exception e) {
                e.printStackTrace();
            } finally {
                if (outs != null) {
                    outs.close();
                }
            }
        }
        if(model.get("PROG_ID") != null && model.get("SC_MAP") != null){
        	commonService.insertFcaHistSearch(model.get("PROG_ID").toString(), "C", model);
        }
        return null;
    }

    /** Excel Export End **/

    /** File Upload/Download 화면 Start **/

    /**
	 * File Manager Sample을 요청한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return String
	 * @exception
	 */
    @RequestMapping(value="/sys/com/Common/selectFileMastView.do")
    public String selectFileMastView( HttpServletRequest request, HttpServletResponse response , ModelMap model ) throws Exception {
    	return "common/filemast/fcas_file_mast_001";
	}

    /**
	 * File Upload Popup을 요청한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return String
	 * @exception
	 */
    @RequestMapping(value="/sys/com/Common/selectFileUploadView.do")
    public String selectFileUploadView( HttpServletRequest request, HttpServletResponse response , ModelMap model ) throws Exception {
    	model.addAttribute("FILE_UID", request.getAttribute("FILE_UID") == null ? "" : request.getAttribute("FILE_UID"));
    	return "common/filemast/commonFileUploadV01";
	}

    /** File Upload/Download Sample End **/

    /** File Upload / Download logic Start **/

    /**
	 * File 조회.
	 * @param request
	 * @param response
	 * @param model
	 * @return ModelAndView
     * @throws Exception
	 * @exception
	 * @notice Service단을 다른 Service나 Controller에서 호출이 가능하도록 하기 위하여 ModelAndView로 변환하는 작업을 Controller에서 진행함.
	 */
    @RequestMapping(value="/sys/com/Common/selectFileMastInfoList.do")
    public ModelAndView selectFileMastInfoList(HttpServletRequest request, HttpServletResponse response,
            @RequestParam Map<String, Object> model) throws Exception {
    	List selectList = commonService.selectFileMastInfoList(model);
    	return CommonUtil.setJsonView(selectList, selectList.size(), true, "");
    }

    /**
	 * File Download.
	 * @param request
	 * @param response
	 * @param model
	 * @return ModelAndView
     * @throws Exception
	 * @exception
	 */
    @RequestMapping(value="/sys/com/Common/getFileDownload.do")
    public ModelAndView getFileDownload(HttpServletRequest request, HttpServletResponse response,
            @RequestParam Map<String, Object> model) throws Exception {

    	FileModel fileModel = commonService.selectFileMastInfo(model);

        response.setContentType("application/x-msdownload; charset=EUC-KR");
        response.setHeader("Content-Disposition", "attachment; filename=" + new String((fileModel.getFILE_NM()).getBytes("EUC-KR"), "8859_1"));
        response.setHeader("Content-Description", "JSP Generated Data");
        BufferedOutputStream outs = new BufferedOutputStream(response.getOutputStream());
        byte[] b = fileModel.getFILE_CONT();
        final int nStartIdx = 0;
        outs.write(b, nStartIdx, b.length);
        outs.close();
        //-- response.getWriter() 나 response.getOutputStream()은 하나의 Response 에서 같이 사용하면 안된다.
        //-- 아래는 success를 리턴 시키면 response.getWriter() 를 사용하는것과 같으므로 에러가 발생한다.

    	return null;
    }


    /**
	 * File Download.
	 * @param request
	 * @param response
	 * @param model
	 * @return ModelAndView
     * @throws Exception
	 * @exception
	 */
    @RequestMapping(value="/sys/com/Common/loadImage.do")
    public ModelAndView loadImage(HttpServletRequest request, HttpServletResponse response,
            @RequestParam Map<String, Object> model) throws Exception {

    	FileModel fileModel = commonService.selectFileMastInfo(model);

        //response.setContentType("application/x-msdownload; charset=EUC-KR");
    	String fileNm = fileModel.getFILE_NM();

        String mimeType = fileNm.endsWith(".gif")  ? "image/gif"  :
        	fileNm.endsWith(".jpg")  ? "image/jpeg" :
        	fileNm.endsWith(".jpeg") ? "image/jpeg" :
        	fileNm.endsWith(".png") ? "image/png" :
        	fileNm.endsWith(".bmp")  ? "image/bmp"  : null;

    	response.setContentType(mimeType);
        response.setHeader("Content-Disposition", "attachment; filename=" + new String((fileModel.getFILE_NM()).getBytes("EUC-KR"), "8859_1"));
        response.setHeader("Content-Description", "JSP Generated Data");
        BufferedOutputStream outs = new BufferedOutputStream(response.getOutputStream());
        byte[] b = fileModel.getFILE_CONT();
        final int nStartIdx = 0;
        outs.write(b, nStartIdx, b.length);
        outs.close();
        //-- response.getWriter() 나 response.getOutputStream()은 하나의 Response 에서 같이 사용하면 안된다.
        //-- 아래는 success를 리턴 시키면 response.getWriter() 를 사용하는것과 같으므로 에러가 발생한다.

    	return null;
    }

    /**
	 * File Upload.
	 * @param request
	 * @param response
	 * @param model
	 * @return ModelAndView
     * @throws Exception
	 * @exception
	 * @notice Service단을 다른 Service나 Controller에서 호출이 가능하도록 하기 위하여 ModelAndView로 변환하는 작업을 Controller에서 진행함.
	 */
    @RequestMapping(value="/sys/com/Common/insertFile.do")
    public ModelAndView insertFile(HttpServletRequest request, HttpServletResponse response,
            @RequestParam Map<String, Object> model) throws Exception {

    	ModelAndView view = new ModelAndView("jsonView");
    	String fileUid = "";
    	String message = "";
    	String messageCd = "";
    	int extCnt = 0;
    	StringBuffer jsonBuffer = new StringBuffer();
    	try {
    		Map<String, Object> setMap = new HashMap<String, Object>();
    		setMap.put("FILE_UID", model.get("FILE_UID"));
    		setMap.put("INIT_FILE_FLAG", model.get("INIT_FILE_FLAG") == null ? "N" : model.get("INIT_FILE_FLAG").toString());
    		Map<String, Object> retMap = commonService.insertFile(setMap, request);
    		extCnt = Integer.parseInt(retMap.get("insertFileCnt") == null ? "0" : retMap.get("insertFileCnt").toString());
    		fileUid = CommonUtil.getObjToString(retMap.get("FILE_UID"));
    		messageCd = CommonUtil.getObjToString(retMap.get("MSG_CODE"));
    		message = CommonUtil.getObjToString(retMap.get("MSG"));
    		jsonBuffer
    			.append("{")
    			.append("\"message\":\"")
    			.append(message)
    			.append("\",")
    			.append("\"messageCd\":\"")
    			.append(messageCd)
    			.append("\",");
    		//성공일 경우에만 Success가 True 임.
    		if("COM_RST_0004".equals(messageCd)){
    			{
    			jsonBuffer
    			  	.append("\"FILE_INFO\":")
    			  	.append(CommonUtil.getJsonFromList((List<Map<String, Object>>)retMap.get("FILE_INFO_LIST")))
    			  	.append(",")
    			  	.append("\"total\":")
    			  	.append(extCnt)
    			  	.append(",")
				  	.append("\"FILE_UID\":\"")
				  	.append(fileUid)
				  	.append("\",")
				  	.append("\"success\":true,");
    			}
    		}else {
    			jsonBuffer
    				.append("\"error\":\"")
    				.append("사용자 정의 Error : "+message).append("\",")
    				.append("\"success\":false,");
    		}
    		jsonBuffer
    			.append("\"data\":null")
    			.append("}");
    		/*
    		view.addObject("FILE_UID", fileUid);
    		view.addObject("data", null);
        	view.addObject("total", extCnt);
        	view.addObject("success", true);
        	view.addObject("message", message);
        	*/
		} catch(Exception ex) {
			jsonBuffer.delete(0, jsonBuffer.length());
    		jsonBuffer
    			.append("{")
    			.append("\"message\":\"")
    			.append(SystemMsg.getMsg("COM_ERR_0010"))
    			.append("\",")
    			.append("\"messageCd\":\"")
    			.append("COM_ERR_0010")
    			.append("\",")
    			.append("\"error\":\"")
    			.append(ex.getLocalizedMessage())
    			.append("\",")
    			.append("\"total\":0,")
    			.append("\"success\":false,")
    			.append("\"data\":null")
    			.append("}");
    		/*
    		view.addObject("data", null);
        	view.addObject("total", 0);
        	view.addObject("success", false);
        	view.addObject("message", SystemMsg.getMsg("COM_ERR_0010"));
        	view.addObject("error", ex.getLocalizedMessage());
        	*/
    	}
		/**
		 * Response Setting.
		 * 		ModelAndView를 통해 Json을 넘길 경우 알수 없는 형변환으로 인하여 현재 화면은 특별히 response를 Setting 한다.
		 **/
		response.setContentType("text/html; charset=UTF-8");
        PrintWriter pw = response.getWriter();
        pw.println(jsonBuffer.toString());
        pw.close();

    	return null;
    }

    /**
	 * File List Delete.
	 * @param request
	 * @param response
	 * @param model
	 * @return ModelAndView
     * @throws Exception
	 * @exception
	 */
    @RequestMapping(value="/sys/com/Common/deleteFileList.do")
    public ModelAndView deleteFileList(HttpServletRequest request, HttpServletResponse response,
            @RequestParam Map<String, Object> model) throws Exception {

    	ModelAndView view = new ModelAndView("jsonView");

    	try {
    		view = commonService.deleteFileList(model);
    	} catch(Exception ex) {
    		view = null; view = new ModelAndView("jsonView");
    		view.addObject("data", null);
        	view.addObject("total", 0);
        	view.addObject("success", false);
        	view.addObject("message", SystemMsg.getMsg("COM_ERR_0003"));//삭제에 실패하였습니다.
        	view.addObject("error", ex.getLocalizedMessage());
    	}

        return view;
    }

    /**
	 * One File Delete.
	 * @param request
	 * @param response
	 * @param model
	 * @return ModelAndView
     * @throws Exception
	 * @exception
	 */
    @RequestMapping(value="/sys/com/Common/deleteFile.do")
    public ModelAndView deleteFile(HttpServletRequest request, HttpServletResponse response,
            @RequestParam Map<String, Object> model) throws Exception {

    	ModelAndView view = new ModelAndView("jsonView");

    	try {
    		view = commonService.deleteFile(model);
    	} catch(Exception ex) {
    		view = null; view = new ModelAndView("jsonView");
    		view.addObject("data", null);
        	view.addObject("total", 0);
        	view.addObject("success", false);
        	view.addObject("message", SystemMsg.getMsg("COM_ERR_0003"));//삭제에 실패하였습니다.
        	view.addObject("error", ex.getLocalizedMessage());
    	}

        return view;
    }

    /** File Upload / Download Logic End **/
}
