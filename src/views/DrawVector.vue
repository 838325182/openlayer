<template>
  <div class="container">
    <div class="title"> 
      <h3>创建vectorFeature</h3>
      <el-button type="primary" @click="backHome">返回Home</el-button>
      <el-select id="type" v-model="selectDrewType" placeholder="请选择" @change='startDrew(selectDrewType)'>
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>

    <div id="map" class="map"></div>
  </div>
</template>

<script>
import "ol/ol.css";

import Feature from "ol/Feature";
import Map from "ol/Map";
import View from "ol/View";
import { Tile as TileLayer, Image, Vector as VectorLayer} from "ol/layer";
import { XYZ, ImageStatic, Vector as SourceVector } from "ol/source";
import { transform } from "ol/proj";
import { Point, Polygon } from "ol/geom";
import { Icon, Style, Fill, Stroke, Circle } from "ol/style";
import { Draw } from "ol/interaction";

export default {
  data() {
    return {
      map: {},
      selectDrewType:'',
      draw: null,
      options: [ {
          value: 'None',
          label: '无'
        },{
          value: 'Point',
          label: '点'
        }, {
          value: 'LineString',
          label: '线'
        }, {
          value: 'Polygon',
          label: '面'
        }, {
          value: 'Circle',
          label: '圆'
        },  {
          value: 'Square',
          label: '正方形'
        }, {
          value: 'Box',
          label: '长方形'
        }],
        value: ''
    };
  },
  mounted() {
    this.initmap();
    this.addInteraction();
  },
  methods: {
    initmap() {
      var center = new transform([104.06667, 30.66667], 'EPSG:4326', 'EPSG:3857');
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
          url: "http://t0.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=bddab7f5ea24d221498b6a551b68b0f7",
          wrapX: false
        })
      });

      this.map = new Map({
        layers:[ tiandituLayer,Tianditu_cva ],
        target: 'map',
        view:new View({
            center: center,
            zoom: 12
        })
      });
    },
    backHome(){
      this.$router.replace('/')//指定跳转地址
    },


    startDrew( typeValue) {
       console.log('您选择了', typeValue)
      this.addInteraction(typeValue);                   //添加绘制图形控件
    },

    addInteraction(typeValue){
      // let geometryFunction;
      // let maxPoints;    //设置最大点数

      // this.map.removeInteraction(this.draw);        //移除绘制图形控件
      if(typeValue == 'None'){
        console.log("无操作");
        return
      }

      //实例化一个矢量图层Vector作为绘制层
      var sourceDraw = new SourceVector({ wrapX: false });
      var vectorLayerDraw = new VectorLayer({
        source: [sourceDraw],
        style: new Style({
          fill: new Fill({               //填充样式
            color: 'rgba(255, 255, 255, 0.2)'
          }),
          stroke: new Stroke({           //线样式
            color: '#ffcc33',
            width: 2
          }),
          image: new Circle({            //点样式
            radius: 7, 
            fill: new Fill({
              color: '#ffcc33'
            })
          })
        })
      });
      //将绘制层添加到地图容器中
      this.map.addLayer(vectorLayerDraw);

      

      let geometryFunction;
        let maxPoints;    //设置最大点数
        if (typeValue === 'Square') {
          typeValue = 'Circle';
          //正方形图形（圆）
          geometryFunction =new Draw.createRegularPolygon(4);
        }else if (typeValue === 'Box') {
          typeValue = 'LineString';
          maxPoints = 2;
          geometryFunction = function (coordinates, geometry) {
            if (!geometry) {
              geometry = new Polygon(null);//多边形
            }
            var start = coordinates[0];
            var end = coordinates[1];
            geometry.setCoordinates([
              [
                start, 
                [start[0], end[1]], 
                end, 
                [end[0], start[1]], 
                start
              ]
            ]);
            return geometry;
          };
        };

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