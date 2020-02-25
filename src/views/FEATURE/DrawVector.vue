<template>
  <div class="container">
    <div class="title">
      <h3>画vectorFeature</h3>
      <el-select
        id="type"
        v-model="selectDrewType"
        placeholder="请选择回执类型"
        @change="startDrew(selectDrewType)"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-button type="primary" @click="clearDrawLayer">清空绘制层</el-button>
      <el-button type="primary" @click="backHome">返回Home</el-button>
    </div>

    <div id="map" class="map"></div>
  </div>
</template>

<script>
import "ol/ol.css";

import Feature from "ol/Feature";
import Map from "ol/Map";
import View from "ol/View";
import { Tile as TileLayer, Image, Vector as VectorLayer } from "ol/layer";
import { XYZ, ImageStatic, Vector as SourceVector } from "ol/source";
import { transform } from "ol/proj";
import { Point, Polygon } from "ol/geom";
import { Icon, Style, Fill, Stroke, Circle } from "ol/style";
import { Draw } from "ol/interaction";
import { createRegularPolygon } from "ol/interaction/Draw";

// ol.interaction.Draw

export default {
  data() {
    return {
      map: {},
      selectDrewType: "",
      draw: null,
      options: [
        {
          value: "None",
          label: "取消绘制"
        },
        {
          value: "Point",
          label: "点"
        },
        {
          value: "LineString",
          label: "线"
        },
        {
          value: "Polygon",
          label: "多边形"
        },
        {
          value: "Circle",
          label: "圆"
        },
        {
          value: "Square",
          label: "正方形"
        },
        {
          value: "Box",
          label: "长方形"
        }
      ],
      value: "",
      drawSource: null,
      drawLayer: null,
      drawing: null,
    };
  },
  mounted() {
    this.initmap();
    // this.addInteraction();
  },
  methods: {
    initmap() {
      var center = new transform(
        [104.06667, 30.66667],
        "EPSG:4326",
        "EPSG:3857"
      );
      var tiandituLayer = new TileLayer({
        title: "天地图矢量图层",
        source: new XYZ({
          url:
            "http://t0.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=ed66df47a9d2de65ea18e35d27209979",
          wrapX: false
        })
      });
      var Tianditu_cva = new TileLayer({
        title: "天地图矢量注记图层",
        source: new XYZ({
          url:
            "http://t0.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=bddab7f5ea24d221498b6a551b68b0f7",
          wrapX: false
        })
      });

      //实例化一个矢量图层Vector作为绘制层  drawSource drawLayer
      this.drawSource = new SourceVector({ wrapX: false });
      this.drawLayer = new VectorLayer({
        source: this.drawSource,
        style: new Style({
          fill: new Fill({ // 面
            color: '#f12756d1'
          }),
          stroke: new Stroke({
            color: '#4c40ff', // 线
            width: 8,
             lineDash: [1, 12]
          }),
          image: new Circle({// 点
            radius: 10,
            fill: new Fill({
              color: '#27d012'
            })
          })
        })
      });
      let img=require('@/images/img/dtsw.png');
      console.log(img);
      this.map = new Map({
        logo: true,
        logo: {src: img, href: 'https://www.baidu.com//'},    // 点击能跳转到对应页面
        
        layers: [ tiandituLayer, Tianditu_cva, this.drawLayer],
        target: "map",
        view: new View({
          center: center,
          zoom: 12
        })
      });
      this.map.on('doubleClick', function(evt) {
        console.log("dsaaaaa");
        this.map.removeInteraction(this.drawing);
      })

    },

    backHome() {
      this.$router.replace("/"); //指定跳转地址
    },

    startDrew(typeValue) {
      console.log("您选择了", typeValue);
      this.addInteraction(typeValue); //添加绘制图形控件
    },

    addInteraction(typeValue) {
      let geometryFunction;
      let maxPoints; //设置最大点数

      this.map.removeInteraction(this.drawing);        //移除绘制图形控件
      if (typeValue == "None") return;

      if (typeValue == "Square") { //正方形图形（圆）
        typeValue = "Circle";
        geometryFunction = new createRegularPolygon(4);
      } else if (typeValue == "Box") {
        typeValue = "LineString";
        maxPoints = 2;
        geometryFunction = function (coordinates, geometry) {
          if (!geometry) {
            geometry = new Polygon(); //多边形
          }
          console.log( coordinates );
          
          var start = coordinates[0];
          var end = coordinates[1];
          geometry.setCoordinates([
            [start, [start[0], end[1]], end, [end[0], start[1]], start]
          ]);
          return geometry;
        } 
      };

      //实例化交互绘制类对象并添加到地图容器中
      this.drawing = new Draw({
        source: this.drawSource, 
        type: typeValue, 
        maxPoints: maxPoints, 
        geometryFunction: geometryFunction, //几何信息变更时调用函数
        
      });
      this.map.addInteraction(this.drawing);
    },
    
    clearDrawLayer() {
      //清空绘制图形
      this.drawSource.clear();
      this.map.removeInteraction(this.drawing);
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

#menu {
  text-align: center;
  width: 100%;
  height: 20px;
  padding: 5px 10px;
  font-size: 14px;
  font-family: "微软雅黑";
  left: 10px;
}
</style>
