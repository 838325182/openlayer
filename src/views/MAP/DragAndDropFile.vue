<template>
  <div class="container">
    <div class="title">
      <h5>也支持拖拽加载File：支持GPX/GeoJSON/IGC/KML/TopoJSON</h5>
      <el-button type="primary" @click="backHome">返回Home</el-button>
    </div>
    <div id="mapCon">
      <div id="info" style="background-color: #6495ed; opacity: 0.8; float: left; position: absolute; bottom: 25px; height: 20px; z-index: 2000;">&nbsp;</div>
      <div id="mouse-position">
      </div>
    </div>

    
  </div>
</template>

<script>
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import { Tile as TileLayer, Image as ImageLayer, Vector as VectorLayer } from "ol/layer";
import { XYZ, Vector as VectorSource } from "ol/source";
import { defaults, MousePosition } from "ol/control";
import { Style, Icon, Text, Fill, Stroke, Circle } from "ol/style";
import { GPX, GeoJSON, IGC, KML, TopoJSON } from "ol/format";
import { DragAndDrop, defaults as defaultsInt } from "ol/interaction";



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

      let dragAndDropInteraction = new DragAndDrop({
        formatConstructors: [   //支持加载的地理数据的格式
          GPX, GeoJSON, IGC, KML, TopoJSON
        ]
      });
      let defaultStyle = {
        'Point': new Style({ //点样式
          image: new Circle({
            fill: new Fill({
              color: 'rgba(255, 255, 0, 0.5)'
            }),
            radius: 5,
            stroke: new Stroke({
              color: '#FF0',
              width: 1
            })
          })
        }),
        //线样式
        'LineString': new Style({
          stroke: new Stroke({
            color: '#F00',
            width: 3
          })
        }),
        //多变形样式
        'Polygon': new Style({
          fill: new Fill({
            color: 'rgba(0, 255, 255, 0.5)'
          }),
          stroke: new Stroke({
            color: '#0FF',
            width: 1
          })
        }),
        //多点样式
        "MultiPoint": new Style({
          image: new Circle({
            fill: new Fill({
              color: 'rgba(255, 0, 255, 0.5)'
            }),
            radius: 5,
            stroke: new Stroke({
              color: '#F0F',
              width: 1
            })
          })
        }),
        //多线样式
        'MultiLineString': new Style({
          stroke: new Stroke({
            color: "#0f0",
            width: 3
          })
        }),
        //多多边形样式
        'MultiPolygon': new Style({
          fill: new Fill({
            color: 'rgba(0, 0, 255, 0.5)'
          }),
          stroke: new Stroke({
            color: '#00F',
            width: 1
          })
        })
      };

      let styleFunction = function (feature, resolution) {
        //地图变换一次分辨率，就执行一次本样式函数
        let featureStyleFunction = feature.getStyleFunction();   //获取要素的样式函数
        if (featureStyleFunction) {//如果要素拥有样式函数
          return featureStyleFunction.call(feature, resolution);
        } else {
          return defaultStyle[feature.getGeometry().getType()];
        }
      }

      let gaodeMap_vec = new TileLayer({
        title: "高德矢量图层",
        source: new XYZ({
          url:this.GISConfig.gaode_cva.url,
          wrapX: false
        }),
      });
      let gaodeMap_img = new TileLayer({
        title: "高德影像图层",
        source: new XYZ({
          url: this.GISConfig.gaode_img.url,
          wrapX: false
        }),
      });
      this.map = new Map({
        interactions: defaultsInt().extend([dragAndDropInteraction]),//添加控件到地图
        layers: [gaodeMap_img, gaodeMap_vec],
        target: "mapCon",
        view: new View({
          center: this.GISConfig.sichaun,
          projection: "EPSG:4326",    //使用这个坐标系
          // minZoom: 2,
          zoom: 12
        }),
        controls: defaults().extend([
          new MousePosition({
            target: document.getElementById("mouse-position")
          })
        ])
      });
      const _this = this;
      
      //为地图绑定'pointermove'事件的处理程序
      this.map.on('pointermove', function (evt) {
        if (evt.dragging) {
          //由于地图被鼠标拖拽也会触发'pointermove'事件，//所以这里返回return避免地图被拖拽时多次重复调用displayFeatureInfo//这样做提高了效率
          return;
        }
        let pixel = _this.map.getEventPixel(evt.originalEvent);
        displayFeatureInfo(pixel);
      });

      //为地图绑定'click'事件的事件处理程序
      this.map.on('click', function (evt) {
        displayFeatureInfo(evt.pixel);
      });

      //拖拽控件绑定添加要素事件，当文件数据拖拉到浏览器时触发该事件
      dragAndDropInteraction.on('addfeatures', function (event) { 
        let vectorSource = new VectorSource({
          features: event.features
        });

        _this.map.addLayer(new VectorLayer({              //初始化矢量图层并添加到地图
          renderMode: 'image',            //矢量图层渲染为图片
          source: vectorSource,
          style: styleFunction            //矢量图层的样式
        }));
        _this.map.getView().fit(vectorSource.getExtent());    //视图缩放至新添加的矢量要素
      });

      //显示新添加的要素的信息的方法
      let displayFeatureInfo = function (pixel) {
        let features = [];
        _this.map.forEachFeatureAtPixel(pixel, function (feature) {
          features.push(feature);
        });
        if (features.length > 0) {
          let info = [];
          let i, ii;
          for (i = 0, ii = features.length; i < ii; ++i) {
            info.push(features[i].get('name'));   //将要素的'name'属性添加到info数组
          }
          document.getElementById('info').innerHTML ="name:"+ info.join(', ') || '&nbsp';
        } else {
          document.getElementById('info').innerHTML = '&nbsp;';
        }
      };


    },
    backHome () {
      this.$router.replace('/')//指定跳转地址
    }
  }
};
</script>

<style scoped>
</style>