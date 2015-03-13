package fcas.sys.com.utl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import com.thoughtworks.xstream.XStream;
import com.thoughtworks.xstream.converters.Converter;
import com.thoughtworks.xstream.converters.MarshallingContext;
import com.thoughtworks.xstream.converters.UnmarshallingContext;
import com.thoughtworks.xstream.converters.collections.AbstractCollectionConverter;
import com.thoughtworks.xstream.io.HierarchicalStreamReader;
import com.thoughtworks.xstream.io.HierarchicalStreamWriter;
import com.thoughtworks.xstream.io.xml.DomDriver;
import com.thoughtworks.xstream.mapper.Mapper;


/**
 * @logicalName   RexpertXmlUtil
 * @description   RexpertXmlUtil
 * @version       $Rev: 1.0 $
 */
public class RexpertXmlUtil {


	private static String rootNodeName = "";

	private static String nodeName = "";

	public static String toXML(List<Map<String, Object>> mapList , String path1 , String path2 ) {

		XStream xStream = new XStream(new DomDriver("UTF-8"));
		Mapper mapper = xStream.getMapper();

		rootNodeName = path1;
		nodeName = path2;

		xStream.alias(rootNodeName, List.class);
		xStream.registerConverter(new MapConverter(mapper));

		return xStream.toXML(mapList);
	}


	public static class MapConverter extends AbstractCollectionConverter implements Converter {
		/**
		 * Map 객체가 될 Node 명
		 */


		public MapConverter(Mapper mapper) {
			super(mapper);
		}

		/**
		 * Converting 가능한 샘플인지 판단
		 */
		@Override
		public boolean canConvert(Class type) {
			boolean flag = type.equals(java.util.ArrayList.class);
			return flag;
		}

		/** Map을 XML로 변환하는 규칙 */
		@Override
		public void marshal(Object source, HierarchicalStreamWriter writer, MarshallingContext context) {
			List<Map<String, Object>> list = (List<Map<String, Object>>) source;
			for(int inx=0; inx<list.size(); inx++) {
				Map<String, Object> data = list.get(inx);
				writer.startNode(nodeName);
				for (Object obj : data.entrySet()) {
					Entry<String, Object> ety = (Entry<String, Object>)obj;
					writer.startNode(ety.getKey().toString());
					//System.out.println(ety.getKey().toString());
					if (ety.getValue() != null) {
						writer.setValue( ety.getValue().toString() );
					} else {
						writer.setValue( "" );
					}
					//writer.setValue("!C!"+ety.getValue().toString()+"!E!");
					//System.out.println("<![CDATA["+ety.getValue().toString()+"]]>");
					writer.endNode();
				}
				writer.endNode();
			}
		}

		/** XML을 List<Map>으로 변환하는 규칙 */
		@Override
		public Object unmarshal(HierarchicalStreamReader reader, UnmarshallingContext context) {
			List<Map<String, Object>> resultList = new ArrayList<Map<String, Object>>();
			Map<String, Object> element = null;
			for (; reader.hasMoreChildren(); reader.moveUp()) {
				reader.moveDown();
				element = new HashMap<String, Object>();
				for (; reader.hasMoreChildren(); reader.moveUp()) {
					reader.moveDown();
					String tempValue = reader.getValue();
					String tempKey = reader.getNodeName();

					if (tempValue != null) {
						tempValue = tempValue.trim().replaceAll("\n", "");
					}
					element.put(tempKey, tempValue);
				}
				resultList.add(element);
			}
			return resultList;
		}

	}

}
