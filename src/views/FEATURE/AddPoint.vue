<template>
  <div class="container">
    <div class="title"> 
      <h3>add point添加点数据</h3>
      <el-button type="primary" @click="backHome">返回Home</el-button>
    </div>
    <div id="mapCon" >
        <div id="mouse-position" >
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
import { defaults, MousePosition } from "ol/control";
import { Point } from "ol/geom";
import { Style, Fill, Stroke, Circle } from "ol/style";
import { Feature } from "ol";

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
              url:"http://t0.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=ed66df47a9d2de65ea18e35d27209979", // 天地图及密钥
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
        controls: defaults().extend([
          new MousePosition({
            target: document.getElementById("mouse-position")
          })
        ])
      });
      //创建一个点
      var point = new Feature({
        geometry: new Point([11505912.0, 4011415.0])
      });
      //设置点1的样式信息
      point.setStyle(
        new Style({
          //填充色
          fill: new Fill({
            color: "rgba(255, 255, 255, 0.2)"
          }),
          //边线颜色
          stroke: new Stroke({
            color: "#ffcc33",
            width: 2
          }),
          //形状
          image: new Circle({
            radius: 17,
            fill: new Fill({
              color: "#ffcc33"
            })
          })
        })
      );

      //实例化一个矢量图层Vector作为绘制层
      var source = new VectorSource({
        features: [point]
      });
      //创建一个图层
      var vector = new VectorLayer({
        source: source
      });


    // //创建一个图层
    //   let vector = new VectorLayer({
    //     source:  new VectorSource({
    //       features: [point]
    //     }),
    //     style: new Style({
    //       fill: new Fill({
    //         color: "rgba(255, 255, 255, 0.2)"
    //       }),
    //       stroke: new Stroke({
    //         color: "#ffcc33",
    //         width: 2
    //       }),
    //       image: new Circle({
    //         radius: 17,
    //         fill: new Fill({color: "#ffcc33"})
    //       })
    //     })
    //   });

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