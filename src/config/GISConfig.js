const gisConfig = 
{
  tianditu_vec:{
    name: "tianditu_vec",
    title: "天地图矢量图层",
    url:"http://t0.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=ed66df47a9d2de65ea18e35d27209979",
  },
  tianditu_cva:{
    name: "tianditu_cva",
    title: "天地图矢量注记图层",
    url:"http://t0.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=ed66df47a9d2de65ea18e35d27209979",
  },
  gaode_cva:{
    name: "gaode_cva",
    title: "高德矢量图层",
    url:"http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
  },
  gaode_img:{
    name: "gaode_img",
    title: "高德影像图层",
    url:"http://webst0{1-4}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",
  },
  sichaun:[104.07, 30.67],
  sichuan:[104.07, 30.67],
  dalian: [121.61, 38.89],
  beijing:[116.28, 39.54],
};

export default gisConfig;
