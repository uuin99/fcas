package fcas.cus.fad.web;

import java.io.BufferedOutputStream;
import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.HashMap;
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

import com.sun.org.apache.xalan.internal.xsltc.util.IntegerArray;
import com.sun.xml.internal.fastinfoset.util.StringArray;

import fcas.cus.fad.service.ShopEnterMngtService;
import fcas.sys.com.service.CommonService;

/**
 * @logicalName   Shop Enter Management Controller.
 * @description
 * @version       $Rev: 1.0 $
 */
@Controller
public class ShopEnterController {
    @Resource(name = "shopentermngtService")
    private ShopEnterMngtService shopentermngtService;

    @Resource(name = "commonService")
    private CommonService commonService;    
    
    /**
	 * 화면을 호출한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return String
	 * @exception
	 */
    @RequestMapping(value="/cus/fad/ShopEnterMngt/selectShopEnterView.do")
    public String selectShopTimeView(HttpServletRequest request,
    		HttpServletResponse response,
    		ModelMap model) throws Exception {
    	/* 이력 부분 추가 예정 */
    	return "cus/fad/fcas_shop_enter_001";
    }
    
    /**
	 * List를 조회한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    @RequestMapping(value="/cus/fad/ShopEnterMngt/selectListTimeCd.do")
    public ModelAndView selectListTimeCd(HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {

		return shopentermngtService.selectListTimeCd(model);
    }
    
    /**
	 * List를 조회한다.
	 * @param request
	 * @param response
	 * @param model
	 * @return ModelAndView
	 * @exception
	 */
    @RequestMapping(value="/cus/fad/ShopEnterMngt/selectListShopEnter.do")
    public ModelAndView selectListShopEnter(HttpServletRequest request,
    		HttpServletResponse response,
    		@RequestParam Map<String, Object> model) throws Exception {
    	/*조회 로그 생성 Start*/
    	commonService.insertFcaHistSearch("fcas_shop_enter_001", "A", model);
    	//Chart는 Model의 Key를 검색 조건으로 사용되므로 사용된 내역은 삭제.
    	model.remove("SC_MAP");
    	model.remove("SC_MENU_DIV");
    	model.remove("SC_MENU_CD");
    	/*조회 로그 생성 End*/    	
		return shopentermngtService.selectListShopEnter(model);
    }
    
    @RequestMapping(value="/cus/fad/ShopEnterMngt/getExcelDownFile.do")
    public ModelAndView getExcelDownFile(HttpServletRequest request, HttpServletResponse response,
        @RequestParam Map<String, Object> model) throws Exception {
    	/*조회 로그 생성 Start*/
    	commonService.insertFcaHistSearch("fcas_shop_enter_001", "A", model);  
    	/*조회 로그 생성 End*/
    	String sSheetName = model.get("SHEET_NAME").toString();
        String[] colsArray = model.get("COLS").toString().split(",");
        String[] widthsArray = model.get("WIDTHS").toString().split(",");
        String[] titlesArray = model.get("TITLES").toString().split(",");
        String[] datasArray = model.get("DATAS").toString().split(",");
        
        String sFileName = sSheetName + ".xlsx";
        BufferedOutputStream outs = null;
        try {
            Workbook book = new XSSFWorkbook();
            
            Font font = book.createFont();
            font.setFontHeightInPoints((short)10);
            
            CellStyle headerStyle = null;
            headerStyle = book.createCellStyle();
            headerStyle.setAlignment(CellStyle.ALIGN_CENTER);
            headerStyle.setBorderBottom(CellStyle.BORDER_THIN);
            headerStyle.setBorderLeft(CellStyle.BORDER_THIN);
            headerStyle.setBorderRight(CellStyle.BORDER_THIN);
            headerStyle.setBorderTop(CellStyle.BORDER_THIN);
            headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());         
            headerStyle.setFillPattern(CellStyle.SOLID_FOREGROUND); 
            headerStyle.setFont(font);
            
            CellStyle lineStyle = null;
            lineStyle = book.createCellStyle();
            lineStyle.setBorderBottom(CellStyle.BORDER_THIN);
            lineStyle.setBorderLeft(CellStyle.BORDER_THIN);
            lineStyle.setBorderRight(CellStyle.BORDER_THIN);
            lineStyle.setBorderTop(CellStyle.BORDER_THIN);
            lineStyle.setFont(font);
            
            CellStyle sumStyle = null;
            sumStyle = book.createCellStyle();
            sumStyle.setBorderBottom(CellStyle.BORDER_THIN);
            sumStyle.setBorderLeft(CellStyle.BORDER_THIN);
            sumStyle.setBorderRight(CellStyle.BORDER_THIN);
            sumStyle.setBorderTop(CellStyle.BORDER_THIN);
            sumStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());         
            sumStyle.setFillPattern(CellStyle.SOLID_FOREGROUND); 
            sumStyle.setFont(font);
            
            book.createSheet(sSheetName);
            Sheet sheet = book.getSheet(sSheetName);
            
            for (int i=0; i<colsArray.length; i++) {
                try {
                    sheet.setColumnWidth((short)(i), (short)(Integer.parseInt(widthsArray[i].trim())*50));
                } catch(Exception err) {
                    err.printStackTrace();
                    continue;
                }
            }
            
            Row rTitleRow = sheet.createRow(0);
            for (int i=0; i<colsArray.length; i++) {
            	Cell cTitleCell = rTitleRow.createCell(i);
            	cTitleCell.setCellValue(titlesArray[i]);
            	cTitleCell.setCellStyle(headerStyle);
            }
            
            NumberFormat nf = NumberFormat.getInstance();
            int[] sumArray = new int[colsArray.length-2];
            
            for (int i=0; i<datasArray.length; i++) {
            	Row row = sheet.createRow(i+1);
            	String[] rowArray = datasArray[i].toString().split("&");
            	for (int j=0; j<rowArray.length; j++) {
            		String cellValue = rowArray[j].toString();
            		int iCellValue = 0;
            		Cell cell = row.createCell(j);
            		try {
            			iCellValue = nf.parse(cellValue).intValue();
                        cell.setCellValue(iCellValue);
                	} catch(Exception e) {
                		if (cellValue.equals("Y")) {
                			cell.setCellValue("휴무");
                		} else if (cellValue.equals("null")) {
                			cell.setCellValue("");
                		} else {
                			cell.setCellValue(cellValue);
                		}
                	}
                	cell.setCellStyle(lineStyle);
                	
                	if (j >= 2) {
                    	sumArray[j-2] += iCellValue;
                    }
            	}
            }
            
            Row rSumRow = sheet.createRow(sheet.getLastRowNum()+1);
            Cell cSumTitleCell = rSumRow.createCell(0);
            cSumTitleCell.setCellValue("합계");
            cSumTitleCell.setCellStyle(sumStyle);
            
            Cell cSumBlankCell = rSumRow.createCell(1);
            cSumBlankCell.setCellValue("");
            cSumBlankCell.setCellStyle(sumStyle);
            
            for (int i=2; i<colsArray.length; i++) {
            	Cell cSumCell = rSumRow.createCell(i);
            	cSumCell.setCellValue(sumArray[i-2]);
            	cSumCell.setCellStyle(sumStyle);
            }
            
            sFileName = new String((sFileName.toString()).getBytes("EUC-KR"), "8859_1");
            
            response.setContentType("application/x-msdownload; charset=EUC-KR");
            response.setHeader("Content-Disposition", "attachment; filename=" + sFileName);
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
        
        return null;
    }
}
