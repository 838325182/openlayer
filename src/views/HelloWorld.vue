<template>
  <div class="openlayers-map-container">
    <div class="map-menu">
      <el-button type="primary" size="small" @click="showPoint">坐标添加点</el-button>
      <el-button type="primary" size="small" @click="showLineString">坐标添加线</el-button>
      <el-button type="primary" size="small" @click="showCircle">坐标添加圆</el-button>
      <span>绘制任意图形</span>
      <el-select
        @change="drawArbitrarily"
        v-model="shapeValue"
        size="small"
        placeholder="请选择图形">
        <el-option
          v-for="item in shapeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
    <div class="mapCon" id="mapCon"></div>
  </div>
</template>

<script>
  import 'ol/ol.css'
  import Map from 'ol/Map'
  import View from 'ol/View'
  import Draw from 'ol/interaction/Draw'
  import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer'
  import {XYZ, Vector} from 'ol/source'
  import {Point, LineString, Circle as CircleString} from 'ol/geom'
  import Feature from 'ol/Feature'
  import {Style, Fill, Stroke, Circle as CircleStyle, Icon} from 'ol/style'
  import lineArrow from '../assets/linearrow.png'

  export default {
    name: 'GraphicsToMap',
    mounted() {
      this.initMap()
    },
    data() {
      return {
        map: null,
        shapeValue: '',
        shapeOptions: [{
          label: '线',
          value: 'LineString'
        }, {
          label: '面',
          value: 'Polygon'
        }, {
          label: '圆',
          value: 'Circle'
        }, {
          label: '停止',
          value: 'None'
        }],
        source: null,
        draw: null,
        styleFunction: null
      }
    },
    methods: {
      initMap() {
        this.styleFunction = function (feature) {
          let geometry = feature.getGeometry()
          let styles = [
            //设置线的样式
            new Style({
              stroke: new Stroke({
                color: '#ffcc33',
                width: 2
              })
            })
          ];
          geometry.forEachSegment(function (start, end) {
            let dx = end[0] - start[0]
            let dy = end[1] - start[1]
            let rotation = Math.atan2(dy, dx)
            //arrows
            styles.push(new Style({
              geometry: new Point(end),
              image: new Icon({
                src: lineArrow,
                anchor: [0.75, 0.5],
                rotateWithView: false,
                rotation: -rotation
              })
            }))
          })
          return styles;
        }
        this.source = new Vector({wrapX: false})
        let vectorLayer = new VectorLayer({
          source: this.source,
          style: this.styleFunction
        })
        //实例化Map对象加载地图,默认底图加载天地图
        this.map = new Map({
          layers: [
            new TileLayer({
              title: "天地图矢量图层",
              source: new XYZ({
                url: "http://t0.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=ed66df47a9d2de65ea18e35d27209979",
                wrapX: false
              })
            }),
            new TileLayer({
              title: "天地图矢量注记图层",
              source: new XYZ({
                url: "http://t0.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=ed66df47a9d2de65ea18e35d27209979",
                wrapX: false
              })
            }),
            vectorLayer
          ],
          //地图容器div的ID
          target: 'mapCon',
          view: new View({
            //地图初始中心点
            center: [12000000, 4000000],
            minZoom: 2,
            zoom: 3
          })
        })
      },
      showPoint() {
        //创建一个点
        let point = new Feature({
          geometry: new Point([11505912.0, 4011415.0])
        });
        //设置点1的样式信息
        point.setStyle(new Style({
          //填充色
          fill: new Fill({
            color: 'rgba(255, 255, 255, 0.2)'
          }),
          //边线颜色
          stroke: new Stroke({
            color: '#ffcc33',
            width: 2
          }),
          //形状
          image: new CircleStyle({
            radius: 17,
            fill: new Fill({
              color: '#ffcc33'
            })
          })
        }));

        //实例化一个矢量图层Vector作为绘制层
        let source = new Vector({
          features: [point]
        });
        //创建一个图层
        var vector = new VectorLayer({
          source: source
        });
        //将绘制层添加到地图容器中
        this.map.addLayer(vector)
      },
      showLineString() {
        //创建一个线
        let Line = new Feature({
          geometry: new LineString([[8208725.0, 3835304.0], [16055444.0, 4578883.0]])
        });

        //设置线的样式
        Line.setStyle(new Style({
          //填充色
          fill: new Fill({
            color: 'rgba(255, 255, 255, 0.2)'
          }),
          //边线颜色
          stroke: new Stroke({
            color: '#ffcc33',
            width: 5
          }),
          //形状
          image: new CircleStyle({
            radius: 7,
            fill: new Fill({
              color: '#ffcc33'
            })
          })
        }));

        //实例化一个矢量图层Vector作为绘制层
        let source = new Vector({
          features: [Line]
        });
        //创建一个图层
        var vector = new VectorLayer({
          source: source
        });
        //将绘制层添加到地图容器中
        this.map.addLayer(vector);
      },
      showCircle() {
        //创建一个圆
        let Circle = new Feature({
          geometry: new CircleString([9871995.0, 4344069.0], 1000000)
        });

        Circle.setStyle(new Style({
          //填充色
          fill: new Fill({
            color: 'rgba(255, 255, 255, 0.5)'
          }),
          //边线颜色
          stroke: new Stroke({
            color: '#ffcc33',
            width: 6
          }),
          //形状
          image: new CircleStyle({
            radius: 7,
            fill: new Fill({
              color: '#ffcc33'
            })
          })
        }));

        //实例化一个矢量图层Vector作为绘制层
        var source = new Vector({
          features: [Circle]
        });
        //创建一个图层
        var vector = new VectorLayer({
          source: source
        });
        //将绘制层添加到地图容器中
        this.map.addLayer(vector);
      },
      drawArbitrarily() {
        if (this.draw) {
          this.map.removeInteraction(this.draw)
        }
        this.addInteraction()
      },
      addInteraction() {
        if (this.shapeValue !== 'None') {
          this.draw = new Draw({
            source: this.source,
            type: this.shapeValue
            // freehand: true
          })
          this.map.addInteraction(this.draw)
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  .openlayers-map-container {
    height: 100%;
    overflow: hidden;

    .map-menu {
      width: 1500px;
      margin: 20px auto;
    }

    .mapCon {
      width: 100%;
      height: 100%;
    }
  }
</style>
