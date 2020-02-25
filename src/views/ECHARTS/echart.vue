<template>
  <div class="container">
    <div class="title">
      <h3>echarts环形图</h3>
      <el-button type="primary" @click="backHome">返回Home</el-button>
    </div>
    <div id="map">
      <div id="mouse-position"></div>
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
import { fromLonLat } from "ol/proj";
import { Style, Fill, Stroke, Circle } from "ol/style";
import { Feature, Overlay } from "ol";

export default {
  data() {
    return {
      map: {},
    };
  },
  mounted() {
    this.initmap();
  },
  methods: {
    initmap() {
      let sichaun = new fromLonLat( this.GISConfig.sichaun );
      this.map = new Map({
        layers: [
          new Tile({
            title: "天地图矢量图层",
            source: new XYZ({
              url:this.GISConfig.tianditu_vec.url,
              wrapX: false
            })
          }),
          new Tile({
            title: "天地图矢量注记图层",
            source: new XYZ({
              url:this.GISConfig.tianditu_cva.url,
              wrapX: false
            })
          })
        ],
        target: "map",
        view: new View({
          center: sichaun,
          minZoom: 2,
          zoom: 5
        }),
        controls: defaults().extend([
          new MousePosition({
            target: document.getElementById("mouse-position")
          })
        ])
      });
      //创建一个图层 并 打一个点
      let city_pointLayer = new VectorLayer({
        source: new VectorSource({
          features: [
            new Feature({
              geometry: new Point(sichaun)
            })
          ]
        }),
        style: new Style({
          fill: new Fill({
            color: "rgba(255, 255, 255, 0.2)"
          }),
          stroke: new Stroke({
            color: "#ffcc33",
            width: 2
          }),
          image: new Circle({
            radius: 10,
            fill: new Fill({ color: "#409EFF" })
          })
        })
      });
      this.map.addLayer(city_pointLayer);

      this.showEchartPopup();
    },
    showEchartPopup() {
      //标注坐标点数组
      var centerPointArr = [
        [11583887.545804752, 3588572.2097294],
        [12955737.898000848, 4851306.4806988],
        [10002000.898000848, 3908759.4806988]
      ];
      // var markLayerMaTM = null;
      var height = 44;
      var width = 24;
      $("#map").append('<div id="echartDiv"></div>');

      for (var i = 0; i < centerPointArr.length; i++) {
        let id = "chart" + i;
        let centerPoint = centerPointArr[i];
        //创建用来承载图表的div，注意：这里div的大小直接决定图表的大小
        $("#echartDiv").append(
          '<div id="'+id+'" ref="chart" style="position:absolute;width:120px;height:120px"></div>'
        );
        let myChart = this.$echarts.init(document.getElementById(id));
        myChart.setOption({
          tooltip: {
            trigger: "item",
            axisPointer: { type: "cross" },
          },
          series: [
            {
              name: "世界大洲",
              type: "pie",
              radius: ["30%", "70%"],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: false,
                  position: "center"
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    fontSize: "30",
                    fontWeight: "bold"
                  }
                }
              },
              labelLine: {
                normal: { show: true }
              },
              data: [
                { value: 4400, name: "亚洲" },
                { value: 3000, name: "非洲" },
                { value: 2400, name: "北美洲" },
                { value: 1800, name: "南美洲" },
                { value: 1000, name: "欧洲" },
                { value: 897, name: "大洋洲" }
              ]
            }
          ]
        });

         let chart_Overlay = new Overlay({
          position: centerPoint,
          positioning: "center-center",
          offset: [-60, -60],
          stopEvent: true,
          zIndex: 9,
          element: document.getElementById(id)
        });
        //将该对象添加到地图容器中
        this.map.addOverlay(chart_Overlay);
      }
    },
    backHome() {
      this.$router.replace("/"); //指定跳转地址
    }
  }
};
</script>

<style scoped></style>
