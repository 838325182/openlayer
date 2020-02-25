<template>
  <div class="container">
    <div class="title"> 
      <h3>Line添加线</h3>
      <el-button type="primary" @click="backHome">返回Home</el-button>
    </div>
    <div id="mapCon" style="width: 100%; height: 90%; position: absolute;">
        <div id="mouse-position" style="float: left; position: absolute; bottom: 5px; width: 350px; height: 20px; z-index: 2000;">
        </div>
    </div>
  </div>
</template>

<script>
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import { Tile,Vector as VectorLayer } from "ol/layer";
import { XYZ,Vector as VectorSource } from "ol/source";
import { MousePosition } from "ol/control";
import { Feature } from "ol";
import { LineString } from "ol/geom";
import { Style, Fill, Stroke, Circle } from "ol/style";
import {} from "ol/";

export default {
  data() {
    return {
      map: {}
    };
  },
  mounted() {
    this.initmap();
  },
  methods: {
    initmap() {
      //实例化Map对象加载地图,默认底图加载天地图
      this.map = new Map({
        layers: [
          new Tile({
            title: "天地图矢量图层",
            source: new XYZ({
              url:"http://t0.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=ed66df47a9d2de65ea18e35d27209979",
              wrapX: false
            })
          }),
          new Tile({
            title: "天地图矢量注记图层",
            source: new XYZ({
              url:"http://t0.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=ed66df47a9d2de65ea18e35d27209979",
              wrapX: false
            })
          })
        ],
        //地图容器div的ID
        target: "mapCon",
        view: new View({
          //地图初始中心点
          center: [12000000, 4000000],
          minZoom: 2,
          zoom: 3
        }),
        controls: [
          new MousePosition({
            target: document.getElementById("mouse-position")
          })
        ]
      });
      //创建一个线
      var Line = new Feature({
        geometry: new LineString([
          [8208725.0, 3835304.0],
          [16055444.0, 4578883.0]
        ]),
        // style:new Style({
        //   //填充色
        //   fill: new Fill({ color: "rgba(255, 255, 255, 0.2)" }),
        //   //边线颜色
        //   stroke: new Stroke({ color: "#ffcc33", width: 5 }),
        //   //形状
        //   image: new Circle({ 
        //     radius: 7,
        //     fill: new Fill({ color: "#ffcc33" })
        //   })
        // }),
      });

      // 设置线的样式
      Line.setStyle(
        new Style({
          //填充色
          fill: new Fill({
            color: "rgba(255, 255, 255, 0.2)"
          }),
          //边线颜色
          stroke: new Stroke({
            color: "#ffcc33",
            width: 5,
            lineDash: [1, 12, 3, 4, 5, 6],
          }),
          //形状
          image: new Circle({
            radius: 7,
            fill: new Fill({
              color: "#ffcc33"
            })
          })
        })
      );
      console.log(Line)
      //实例化一个矢量图层Vector作为绘制层
      var source = new VectorSource({
        features: [Line]
      });
      //创建一个图层
      var vector = new VectorLayer({
        source: source
      });
      //将绘制层添加到地图容器中
      this.map.addLayer(vector);
    },
    backHome(){
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
.title{
position: absolute;/*这里一定要设置*/
z-index: 999999;
margin-top: 10px;
margin-left: 50px;
}
</style>