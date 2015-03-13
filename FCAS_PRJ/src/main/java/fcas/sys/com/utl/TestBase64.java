package fcas.sys.com.utl;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Locale;
import java.util.Set;

import sun.misc.BASE64Decoder;
import sun.misc.BASE64Encoder;

public class TestBase64 {

	public void testGo()// 뉴스를 뽑아냄 !!
	{
		SimpleDateFormat fmt = new SimpleDateFormat("yyyyMMdd");
		String now = fmt.format(new Date());

		System.out.println(now);

		// 시간 비교 테스트

		String n_time = "000520";  // 5분 20초
		String time = "020000";  // 2시간.

		int n_time_int = Integer.parseInt( n_time );
		int time_int = Integer.parseInt( time );
		System.out.println( "n_time_int"+n_time_int);
		System.out.println( "time_int"+time_int);

		if( n_time_int > time_int) {
			System.out.println( "접속 2시간 지난놈");
		} else {
			System.out.println( "접속 2시간 안지난놈");
		}



	    try {
	        GregorianCalendar reg_gc = new GregorianCalendar();
	        GregorianCalendar now_gc = new GregorianCalendar();

	        //비교한 시간을 13시(오후1시) 10분 10초로 설정
	        reg_gc.set(GregorianCalendar.HOUR_OF_DAY, 13);
	        reg_gc.set(GregorianCalendar.MINUTE, 34);
	        reg_gc.set(GregorianCalendar.SECOND, 10);

	        //비교한 시간을 13시(오후1시) 10분 10초로 설정
	        reg_gc.set(GregorianCalendar.HOUR_OF_DAY, 16);
	        reg_gc.set(GregorianCalendar.MINUTE, 10);
	        reg_gc.set(GregorianCalendar.SECOND, 10);

	       //현재시간과 비교한 시간을 MilliSecond로 빼줌
	        long diffMillis = now_gc.getTimeInMillis()- reg_gc.getTimeInMillis();

	        //MilliSecond는 1초의 1000/1임을 유의할것
	        long hour = diffMillis/1000/60/60;
	        long min = diffMillis/1000/60%60;
	        long second = diffMillis/1000%60%60;

	        //현재시간과 비교할시간의 차를 시분초로 출력
	        System.out.println(hour + ":" + min + ":" + second);


	       } catch (Exception e) {
	        // TODO Auto-generated catch block
	        e.printStackTrace();

	       }



	       // 오늘의 전일 구하기 함수


	       System.out.println("----");

	       String nowYmd = "20120901";

	       SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
	       Date date = null;
		try {
			date = sdf.parse(nowYmd);
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	       System.out.println(date);

	       Date preD = getBeforeDay(date , 1);

	       String preDay = sdf.format(preD);

	       System.out.println("전일 -->"+ preDay);


	       int a = 33333;
	       int b = 55555;
	       int tot = a+b;

	       double ccc = ((double)a / (double)tot) * 100;

	       System.out.println(ccc);
	       System.out.println((int)ccc);
	       System.out.println((int)ccc+" ");




	       // 전일 대비.. 증가 감소율 구하는 방법

			int b_day =  90;  // 전일
			int n_day = 100;  // 오늘

			int da = (int)( ( (double)n_day / (double)b_day ) * 100 );

			System.out.println("da:"+da);
			System.out.println("전일대비-->"+ ( da - 100 ) +"%.... 증가함");

			int b_day2 =  100;
			int n_day2 = 90;

			int da2 = (int)( ( (double)n_day2 / (double)b_day2 ) * 100 );

			System.out.println("da2:"+da2);
			System.out.println("전일대비-->"+ ( 100 - da2  ) +"%.... 감소함");


			System.out.println("=-=======================");

			String ssss = "20120905";

			System.out.println("ss"+ ssss.substring(0,4));
			System.out.println("ss"+ ssss.substring(4,6));
			System.out.println("ss"+ ssss.substring(6,8));





	}
    public static java.util.Date getBeforeDay( java.util.Date today, int day ) {
    	int calDay = day * 1000;
    	if ( today == null )
    		throw new IllegalStateException ( "today is null" );
    	java.util.Date rday = new java.util.Date ( );
    	rday.setTime ( today.getTime ( ) - ( (long) calDay * 60 * 60 * 24 ) );

    	return rday;
    }


	// 전일 구하기.. 근데 디플리 케이트 됫네 시발.
	 public static String getPreDay(String input_date) throws Exception{
	  String pre_month = "";
	  java.util.Date current_day = null;
	  SimpleDateFormat sdFormat = new SimpleDateFormat("yyyyMMdd");
	  current_day = new java.util.Date(Integer.parseInt(input_date.substring(0,4))-1900,Integer.parseInt(input_date.substring(4,6))-1,Integer.parseInt(input_date.substring(6,8))-1);
	  pre_month = sdFormat.format(current_day);
	  //System.out.println(pre_month[0]+"=="+pre_month[1]);

	  return pre_month;
	 }


	  public long diffOfMinutes(String begin, String end) throws Exception
	  {
	    SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");



	    Date beginDate = formatter.parse(begin);
	    Date endDate = formatter.parse(end);



	    return (endDate.getTime() - beginDate.getTime()) / (60 * 1000);
	  }


	public static void main( String args[] )
	{
		TestBase64 agent = new TestBase64();
//		agent.testGo();
//
//	    long ll = 0;
//
//		try {
//			ll = agent.diffOfMinutes("2000-09-03 09:45:10" , "2012-09-04 13:50:10");
//		} catch (Exception e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		}
//
//	    System.out.println("--->"+ll);

		String aa = base64Encoder("113");
		System.out.println("->"+aa);


	}


	public static String  base64Encoder(String sOriginStr){
		String sEncoderStr = "";
		try{
			BASE64Encoder encoder = new BASE64Encoder();
	        byte[] byStr=null;

	        byStr = sOriginStr.getBytes();
	        sEncoderStr = encoder.encode(byStr);
		}catch(Exception e){
			System.err.println(e);
		}
		return sEncoderStr;
	}


}
