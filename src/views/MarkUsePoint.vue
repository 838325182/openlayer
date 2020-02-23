<template>
  <div class="container">
    <div class="title">
      <h3>point实现文本图片标注</h3>
      <el-button type="primary"
                 @click="backHome">返回Home</el-button>
    </div>
    <div id="mapCon"
         style="width: 100%; height: 90%; position: absolute;">
      <div id="mouse-position"
           style="float: left; position: absolute; bottom: 5px; width: 350px; height: 20px; z-index: 2000;">
      </div>
    </div>
  </div>
</template>

<script>
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import { Tile, Vector as VectorLayer } from "ol/layer";
import { XYZ, Vector as VectorSource } from "ol/source";
import { defaults, MousePosition } from "ol/control";
import { Point } from "ol/geom";
import { Style, Icon, Text, Fill, Stroke } from "ol/style";
import { Feature } from "ol";
import { fromLonLat } from "ol/proj";
import blueIcon from '../images/label/blueIcon.png'

export default {
  data () {
    return {
      map: {}
    };
  },
  mounted () {
    this.initmap()
  },
  methods: {
    initmap () {
      var beijing = new fromLonLat([116.28, 39.54]);
      this.map = new Map({
        layers: [
          new Tile({
            title: "天地图矢量图层",
            source: new XYZ({
              url:
                "http://t0.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=ed66df47a9d2de65ea18e35d27209979",
              wrapX: false
            })
          }),
          new Tile({
            title: "天地图矢量注记图层",
            source: new XYZ({
              url:
                "http://t0.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=ed66df47a9d2de65ea18e35d27209979",
              wrapX: false
            })
          })
        ],
        //地图容器div的ID
        target: "mapCon",
        view: new View({
          //地图初始中心点
          center: beijing,
          minZoom: 2,
          zoom: 12
        }),
        controls: defaults().extend([
          new MousePosition({
            target: document.getElementById("mouse-position")
          })
        ])
      });
      var iconFeature = new Feature({
        geometry: new Point(beijing),
        name: '北京市',                         //名称属性
        population: 2115                       //人口数（万）
      });
      iconFeature.setStyle(
        new Style({
          image: new Icon({
            anchor: [0.5, 60],
            anchorOrigin: "top-right",
            anchorXUnits: "fraction",
            anchorYUnits: "pixels",
            offsetOrigin: "top-right",
            // offset:[0,10],
            //图标缩放比例
            // scale:0.5,
            //透明度
            //opacity: 0.75,
            //图标的url
            src: blueIcon
          }),
          text: new Text({
            textAlign: 'center',            //位置
            textBaseline: 'middle',         //基准线
            font: 'normal 14px 微软雅黑',    //文字样式
            text: iconFeature.get('name'),      //文本内容
            fill: new Fill({       //文本填充样式（即文字颜色)
              color: '#000'
            }),
            stroke: new Stroke({
              color: '#F00',
              width: 2
            })
          })
        })
      );
      var vSource = new VectorSource({
        features: [iconFeature]
      });
      var vLayer = new VectorLayer({
        source: vSource
      });
      this.map.addLayer(vLayer);
      const me=this;

      this.map.on('click', function (evt) {
        var coordinate = evt.coordinate;        //鼠标单击点的坐标
        //新建一个要素ol.Feature
        var newFeature = new Feature({
          geometry: new Point(coordinate),  //几何信息
          name: '标注点'
        });

        newFeature.setStyle(
          me.createLabelStyle(newFeature)
        );      //设置要素样式
        vSource.addFeature(newFeature);
      });
    },
          //矢量标注样式设置函数，设置image为图标ol.style.Icon
    createLabelStyle (feature) {
      return new Style({
        image: new Icon({
          anchor: [0.5, 60],              //锚点
          anchorOrigin: 'top-right',       //锚点源
          anchorXUnits: 'fraction',       //锚点X值单位
          anchorYUnits: 'pixels',         //锚点Y值单位
          offsetOrigin: 'top-right',      //偏移原点
          opacity: 0.75,
          src: blueIcon //图标的URL
        }),
        text: new Text({
          textAlign: 'center',            //位置
          textBaseline: 'middle',         //基准线
          font: 'normal 14px 微软雅黑',    //文字样式
          text: feature.get('name'),      //文本内容
          fill: new Fill({       //文本填充样式（即文字颜色)
            color: '#000'
          }),
          stroke: new Stroke({
            color: '#F00',
            width: 2
          })
        })
      });
    },
    backHome () {
      this.$router.replace('/')//指定跳转地址
    }
  }
};
</script>

<style scoped>
.container {
  margin: 0px;
  padding: 0px;
  widows: 100%;
  height: 100%;
}
.title {
  position: absolute; /*这里一定要设置*/
  z-index: 999999;
  margin-top: 10px;
  margin-left: 50px;
}
</style>