function saveExcel(grid, SaveFileName) {
    var store = grid.getView().getStore();
    var excelTable = '<table border=1>\r\n';
    var excelColumn = '<tr>';
    var columns = grid.getView().getHeaderCt().getGridColumns();
    
    for(var i=0; i<columns.length; i++){
        excelColumn += '<td style="background-color:darkGray; text-align:center; width:'+columns[i].width+';">'+columns[i].text+'</td>\r\n';
    }
    excelColumn += '</tr>\r\n';
    excelTable = excelTable + excelColumn;
    var excelBody = '';
    
    for (var j=0; j<store.data.items.length; j++) {
        var record = store.data.items[j];
        excelBody += '<tr>';
        for (var k=0; k<columns.length; k++) {
            var tmpStrs = record.get(columns[k].dataIndex);
            
            if (tmpStrs == undefined) {
            	excelBody += '<td>'+k+1+'</td>\r\n';
            } else {
            	excelBody += '<td>'+tmpStrs+'</td>\r\n';
            }
        }
        excelBody += '</tr>\r\n';
    }
    excelTable = excelTable + excelBody + '</table>\r\n';

    if (document.body) {
    	var excelFrame = null;
        if (document.body.lastChild.id != 'excelExportFrame') {
            excelFrame = document.createElement("iframe");
            excelFrame.id = "excelExportFrame";
            excelFrame.position = "absolute";
            excelFrame.style.zIndex = -1;
            excelFrame.style.top = "-10px";
            excelFrame.style.left = "-10px";
            excelFrame.style.height = "0px";
            excelFrame.style.width = "0px";
            excelFrame.style.display = "none";
            document.body.appendChild(excelFrame);
        }
        
        var frmTarget = excelFrame.contentDocument;
        
        frmTarget.charset="UTF-8";
        frmTarget.open("application/vnd.ms-excel","replace");
        frmTarget.write('<html>');
        frmTarget.write('<meta http-equiv=\"Content-Type\" content=\"application/vnd.ms-excel; charset=euc-kr\">\r\n');
        frmTarget.write('<body>');
        frmTarget.write(excelTable);
        frmTarget.write('</body>');
        frmTarget.write('</html>');
        frmTarget.close();
        
        if (!SaveFileName) {
            SaveFileName = 'test.xls';
        }
        
        if (!!window.ActiveXObject) { //IE
        	alert('IE');
        	frmTarget.execCommand('SaveAs','false',SaveFileName);
        } else {
        	alert('not IE');
        }
        
        document.body.removeChild(excelFrame);
    }
}