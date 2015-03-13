package fcas.sys.com.scheduling;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import fcas.sys.com.service.CommonService;

@Service("SmsScheduling")
public class SmsScheduling {

	@Resource(name = "commonService")
    private CommonService commonService;    
	
	public void runSmsBatch() throws Exception{
		commonService.runSmsBatch();
	} 
	
	public void runMakeNecRawSample() throws Exception{
		commonService.runMakeNecRawSample();
	}
	
	public void runMakeNecRaw() throws Exception{
		commonService.runMakeNecRaw();
	}	
}


