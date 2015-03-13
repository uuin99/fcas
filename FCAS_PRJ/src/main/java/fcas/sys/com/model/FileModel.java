package fcas.sys.com.model;

/**
 * @logicalName   FileModel Class
 * @description   
 * @version       $Rev: 1.0 $
 */
public class FileModel {
	//File Unique ID
    private String FILE_UID;
    //File Sequence
    private int FILE_SEQ;
    //File Name
    private String FILE_NM;
    //File Content
    private byte[] FILE_CONT;
    //File Size
    private int FILE_SIZE;
    //File Category
    private String FILE_CATE;

    public String getFILE_CATE() {
        return FILE_CATE;
    }

    public void setFILE_CATE(String FILE_CATE) {
        this.FILE_CATE = FILE_CATE;
    }

    public byte[] getFILE_CONT() {
        return FILE_CONT;
    }

    public void setFILE_CONT(byte[] FILE_CONT) {
        this.FILE_CONT = FILE_CONT;
    }

    public String getFILE_NM() {
        return FILE_NM;
    }

    public void setFILE_NM(String FILE_NM) {
        this.FILE_NM = FILE_NM;
    }

    public int getFILE_SEQ() {
        return FILE_SEQ;
    }

    public void setFILE_SEQ(int FILE_SEQ) {
        this.FILE_SEQ = FILE_SEQ;
    }

    public int getFILE_SIZE() {
        return FILE_SIZE;
    }

    public void setFILE_SIZE(int FILE_SIZE) {
        this.FILE_SIZE = FILE_SIZE;
    }

    public String getFILE_UID() {
        return FILE_UID;
    }

    public void setFILE_UID(String FILE_UID) {
        this.FILE_UID = FILE_UID;
    }
}
