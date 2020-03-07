<template>
  <div class="container">
    <div class="title">
      <h3 style="float: left; ">forEachFeatureAtPixel方法获取geoserveWMS服务发布的要素</h3>

      <el-button type="primary" @click="backHome" style="float: left;">返回Home</el-button>
      <br />
      <h3 style="float: left; ">getFeatureInfoUrl获取不到元素信息。自己配置查询图层</h3>
    </div>
    <div id="mapCon">
      <div id="popupDiv" style="width: 150px;">
        <div id="popupTitle">
          小区信息
          <a id="closeOverlay"></a>
        </div>
        <div id="popupContent"></div>
      </div>

      <div class="legend">
        <div class="legend-title">图例</div>
        <img src="#" id="legendImg" alt="图例" />
      </div>

      <div id="mouse-position"></div>
    </div>
  </div>
</template>

<script>
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import { Tile, Image as ImageLayer, Tile as TileLayer } from "ol/layer";
import { XYZ, TileWMS, ImageWMS, OSM } from "ol/source";
import { defaults, MousePosition } from "ol/control";
import { fromLonLat } from "ol/proj";

import Overlay from "ol/Overlay";
import { GeoJSON } from "ol/format";

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
      //加载图例图片
      let url =
        "http://localhost:8081/geoserver/yyc/wms?REQUEST=GetLegendGraphic&VERSION=1.1.0&FORMAT=image/png&WIDTH=40&HEIGHT=60&LAYER=yyc:panel_xiaoqu";
      $("#legendImg").attr("src", url);

      let tianditu_vec = new Tile({
        title: "天地图矢量图层",
        source: new XYZ({
          url: this.GISConfig.tianditu_vec.url,
          wrapX: false
        })
      });

      let xiaoquLayer = new TileLayer({
        source: new TileWMS({
          url: "http://localhost:8081/geoserver/yyc/wms?", //service=WMS",
          params: {
            // version: "1.1.0",
            layers: "yyc:panel_xiaoqu", //'yyc:polygon--point',//'yyc:panel_xiaoqu',//'yyc:shcool'
            styles: "",
            // bbox: '121.535021012,38.864993506000076,121.70835778400006,38.94694350700003',
            // width: '768',
            // height: '363',
            srs: "EPSG:4326"
          }
          // serverType: 'geoserver',
        }),
        zIndex: 2,
        // maxResolution: 8,
        name: "xiaoquWMSLayer" //这个名字用来移除图层，或者查找土层中数据avg:7008-45467
      });

      this.map = new Map({
        layers: [tianditu_vec, xiaoquLayer],
        target: "mapCon",
        view: new View({
          projection: "EPSG:4326", //使用这个坐标系4326 或3857 都可以加载geoserve的服务会自己转换
          center: [121.628, 38.912],
          // projection: "EPSG:3857",    //使用这个坐标系
          // center: [13541564.997373039, 4706614.965056401],
          zoom: 14
        }),
        controls: defaults().extend([
          new MousePosition({
            target: document.getElementById("mouse-position")
          })
        ])
      });

      //popup图层
      let popupLayer = new Overlay({
        element: document.getElementById("popupDiv"),
        autoPan: true,
        autoPanMargin: 100,
        positioning: "center-right",
        name: "popupLayer"
      });
      this.map.addOverlay(popupLayer);

      $("#closeOverlay").on("click", function(e) {
        popupLayer.setPosition(undefined);
      });

      const _this = this;
      this.map.on("singleclick", function(evt) {
        let featureUrl;
        let view = evt.map.getView();
        let layers = evt.map.getLayers().getArray();

        for (var i = 0; i < layers.length; i++) {
          if (
            layers[i].getProperties()["name"] &&
            layers[i].getProperties()["name"] == "xiaoquWMSLayer"
          ) {
            let source = layers[i].getSource();
            featureUrl = source.getFeatureInfoUrl(
              evt.coordinate,
              view.getResolution(),
              view.getProjection(),
              { INFO_FORMAT: "application/json" }
            );
            console.log(featureUrl);
          }
        }

        if (featureUrl) {
          featureUrl = featureUrl + "&QUERY_LAYERS=yyc:panel_xiaoqu"; ////////超级关键
          let format = new GeoJSON();
          _this.$axios
            .get(featureUrl)
            .then(res => {
              if (res.data.features) {
                let result = format.readFeatures(res.data);
                let feature = result[0];
                if (feature) {
                  let property = feature.getProperties();
                  console.log(property);
                  $("#popupContent").empty();
                  $("#popupContent").append(
                    `小区名字:<a href="${property.url}" target="_blank">${property.mingzi}</a><br/>
                  所在区:${property.area}<br/>
                  绿化率:${property.lhl}<br/>
                  rjl:${property.rjl}<br/>
                  物业费:${property.wyf}<br/>
                  停车费:${property["停车费"]}<br/>
                  年代:${property["年代"]}<br/>
                  户数:${property["户数"]}<br/>
                  栋数:${property["栋数_1"]}<br/>`
                  );
                  popupLayer.setPosition([
                    property.geometry.flatCoordinates[0],
                    property.geometry.flatCoordinates[1]
                  ]);
                } else {
                  console.log("查询失败");
                }
              }
            })
            .catch(error => {
              console.log("查询失败");
            });
        }
      });
    },
    backHome() {
      this.$router.replace("/"); //指定跳转地址
    }
  }
};
</script>

<style scoped>
</style>
