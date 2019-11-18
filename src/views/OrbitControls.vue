
<template>
  <div>
    <el-row>
      <div id="container" :style="{width: '100%', height: '1000px'}">
      </div>
    </el-row>
    <el-row>
      <div id="forceGraph" :style="{width: '100%', height: '1000px'}">
      </div>
    </el-row>
  </div>
</template>

<script>
import * as THREE from 'three'
import * as ThreeSpriteText from 'three-spritetext'

import dagreD3 from 'dagre-d3'
import * as dagre from 'dagre'

import { mapState } from 'vuex'
import {nodesObj} from '../assets/kg'
import {mapToObj, setCanvasContent} from '@/utils/helpers'
import TWEEN from '@tweenjs/tween.js'

import echarts from 'echarts'
require('echarts/theme/macarons')

const OrbitControls = require('three-orbit-controls')(THREE)

/*
* 这边主要在尝试做
* 1. 数据导入
* 2. spritematerial往sphere上贴图..
* 3. echarts forcelayout 和自定义节点symbol(只能2D自定义)
* 4. dagre布局 + tweenjs动画
 */

// kg data 自底向上
const customerSchema = [{name: 'Customer'}, {name: 'companyName'},
  {name: 'contactName'}, {name: 'city'}]

const orderSchema = [{name: 'Order'}, {name: 'orderID'},
  {name: 'requiredDate'}, {name: 'shippedDate'}]

const productSchema = [{name: 'Product'}, {name: 'unitPrice'},
  {name: 'productID'}, {name: 'quantity'}]

const customerSchemaLinks = [{source: 0, target: 1, label: 'prop1'}, {source: 0, target: 2, label: 'prop2'},
  {source: 0, target: 3, label: 'prop3'}]

const orderSchemaLinks = [{source: 0, target: 1}, {source: 0, target: 2},
  {source: 0, target: 3}, {source: 2, target: 3}]

const productSchemaLinks = [{source: 0, target: 1}, {source: 0, target: 2},
  {source: 0, target: 3}]

const boundingRadius = 10

export default {
  name: 'OrbitControls',
  data () {
    return {
      camera: '',
      scene: '',
      renderer: '',
      mesh: '',
      fontsize: 10,
      light: '',
      concepts: '',
      links: '',
      chart: '',
      container: ''
    }
  },
  computed: mapState({
    products: state => state.graphData.products
  }),
  methods: {
    init () {
      this.container = document.getElementById('container')
      this.scene = new THREE.Scene()

      this.scene.add(new THREE.AmbientLight(0x404040))

      let axesHelper = new THREE.AxesHelper(50)
      this.scene.add(axesHelper)

      this.createLight()

      this.camera = this.createCamera()
      this.scene.add(this.camera)

      // this.loadObj()
      // this.createConceptGraph()

      this.initAnimation()

      // var meshClass = this.createClassMesh()
      // var meshProp = this.createPropMesh()
      // this.scene.add(meshProp)
      // this.scene.add(meshClass)

      this.createRenderer()
      // this.setControls()
    },
    createCamera () {
      var camera = new THREE.PerspectiveCamera(70, this.container.clientWidth / this.container.clientHeight, 1, 1000)
      camera.position.set(20, 40, 100)
      camera.lookAt(this.scene.position)
      return camera
    },
    createLight () {
      let light = new THREE.AmbientLight(0xffffff, 0.5)
      light.position.set(0, 10, 0)
      this.scene.add(light)

      light = new THREE.DirectionalLight(0xffffff, 1) // intensity.default 1
      light.position.set(0, 100, 0)
      this.scene.add(light)
    },
    loadObj () {
      // 演示如何将js var转化为obj并查找某一属性。（iterator）
      this.products = mapToObj(nodesObj.products)
      // var productIDs = Object.values(this.products)
      console.log(this.products)
      // console.log(productIDs)

      this.concepts = nodesObj.concepts
      console.log(this.concepts)

      this.links = nodesObj.conc_prop_links
      console.log(this.links)
    },
    createClassMesh () {
      var productTexture = new THREE.TextureLoader().load('@/assets/brick_diffuse.jpg')
      var classMaterial = new THREE.MeshBasicMaterial({map: productTexture})

      var group = new THREE.Group()
      var classGeo = new THREE.SphereBufferGeometry(0.1, 32, 32)
      // var classMaterial = new THREE.MeshStandardMaterial({color: '#ffffff', transparent: 'true'})
      var mesh = new THREE.Mesh(classGeo, classMaterial)
      group.add(mesh)

      var spirteCanvas = setCanvasContent('Order')
      var spirteTexture = new THREE.CanvasTexture(spirteCanvas)

      var spriteMaterial = new THREE.SpriteMaterial({map: spirteTexture})
      var spriteObj = new THREE.Sprite(spriteMaterial)
      spriteObj.scale.set(0.1, 0.1, 0.01)
      spriteObj.position.set(0.5, -0.5, 0)

      group.add(spriteObj)
      group.position.set(0.5, -0.5, 0)

      //
      // mesh.add(spriteObj)
      //
      // mesh.position.set(0.5, -0.5, 0)
      // return mesh
      return group
    },
    createPropMesh () {
      var propTextures = []
      var propMaterials = []
      for (let i = 0; i < 6; i++) {
        let cv = setCanvasContent('Time')
        propTextures.push(new THREE.CanvasTexture(cv))
        propMaterials.push(new THREE.MeshStandardMaterial({map: propTextures[0]}))
      }
      // var propMaterial = new THREE.MeshStandardMaterial({map: propTexture})
      var propGeo = new THREE.BoxBufferGeometry(0.1, 0.1, 0.1)
      var mesh = new THREE.Mesh(propGeo, propMaterials)

      mesh.position.set(0.5, -0.5, 0)
      return mesh
    },
    // tweenjs 粒子动态效果
    initAnimation () {
      const userOpts = {
        range: 800,
        duration: 1800,
        delay: 0,
        easing: TWEEN.Easing.Quadratic.In
      }

      let group = new THREE.Group()
      let g = new dagreD3.graphlib.Graph()
      g.setGraph({})
      g.setDefaultEdgeLabel(function () { return {} })
      for (let name in customerSchema) {
        g.setNode(name, {width: 2, height: 2})
      }
      for (let link of customerSchemaLinks) {
        g.setEdge(link.source, link.target)
      }
      dagre.layout(g)

      for (let n = 0; n < Object.keys(g._nodes).length; n++) {
        let nodex = Math.random() * 20
        let nodey = Math.random() * 30
        let nodeMesh = this.addNode(nodex, 0, nodey)
        group.add(nodeMesh)
      }

      console.log(g)
      console.log(group)

      group.children.forEach((child, idx) => {
        var target = {
          x: g._nodes[idx].x,
          y: 0,
          z: g._nodes[idx].y
        }
        this.moveTo(child, target, userOpts)
      })

      this.scene.add(group)
    },
    moveTo (obj, target, userOpts, complete) {
      var current = {
        x: obj.position.x,
        y: obj.position.y,
        z: obj.position.z
      }
      var update = function () {
        obj.position.set(current.x, current.y, current.z)
      }
      complete = complete || function () {}
      var tweens = new TWEEN.Tween(current)
        .to(target, userOpts.duration)
        .delay(userOpts.delay)
        .easing(userOpts.easing)
        .onUpdate(update)
        .onComplete(complete)
        .start()
    },
    /*
       *dagre 或者graphviz 用来画流程图
       */
    createConceptGraph () {
      var g = new dagre.graphlib.Graph()
      g.setGraph({})
      g.setDefaultEdgeLabel(function () {
        return {}
      })
      for (var p in customerSchema) {
        g.setNode(p, {width: 0.1, height: 0.1})
      }
      for (var link of customerSchemaLinks) {
        g.setEdge(link.source, link.target)
        // g.setEdge(link.source, link.target, link.label)
      }
      dagre.layout(g)

      console.log(g)
      // console.log(g._edgeLabels)
      // console.log(g._nodes)
      // console.log(Object.keys(g._nodes).length)
      // console.log(g._nodes[0].x)
      // console.log(g._nodes[Object.values(g._edgeObjs)[0].v].x)

      var group = new THREE.Group()

      for (let n = 0; n < Object.keys(g._nodes).length; n++) {
        // let nodex = g._nodes[n].x
        // let nodey = g._nodes[n].y

        let nodex = Math.round(g._nodes[n].x) / boundingRadius
        let nodey = Math.round(g._nodes[n].y) / boundingRadius

        let nodeMesh = this.addNode(nodex, -50, nodey)
        // nodeMesh.position.set(nodex, -50, nodey)
        console.log(nodeMesh)
        group.add(nodeMesh)
      }

      for (let e = 0; e < Object.keys(g._edgeObjs).length; e++) {
        let sourceNode = Object.values(g._edgeObjs)[e].v
        let targetNode = Object.values(g._edgeObjs)[e].w

        // let sourceNodex = g._nodes[sourceNode].x
        // let sourceNodey = g._nodes[sourceNode].y
        // let targetNodex = g._nodes[targetNode].x
        // let targetNodey = g._nodes[targetNode].y

        let sourceNodex = Math.round(g._nodes[sourceNode].x) / boundingRadius
        let sourceNodey = Math.round(g._nodes[sourceNode].y) / boundingRadius
        let targetNodex = Math.round(g._nodes[targetNode].x) / boundingRadius
        let targetNodey = Math.round(g._nodes[targetNode].y) / boundingRadius

        group.add(this.addLink(new THREE.Vector3(sourceNodex, -50, sourceNodey),
          new THREE.Vector3(targetNodex, -50, targetNodey)))
      }
      console.log(group)
      this.scene.add(group)
    },
    /*
       *echarts 用来画关系图，SVG 自定义节点形状(2D)
       */
    echartsLayout () {
      var rightTriangle = 'path://M4616 3208 c-14 -18 -430 -440 -925 -938 -495 -498 -900 -906 -901 ' +
        '-908 0 -2 -9 -12 -20 -24 -11 -12 -20 -25 -20 -30 0 -4 437 -8 970 -8 l970 0 ' +
        '0 970 0 970 -24 0 c-15 0 -33 -12 -50 -32z'

      var graph = {}
      var nodes = nodesObj.concepts
      var links = nodesObj.conc_prop_links
      graph.nodes = nodes
      graph.links = links
      // console.log(graph)

      graph.nodes.forEach(node => {
        node.symbol = rightTriangle
      })

      this.chart = echarts.init(document.getElementById('forceGraph'), 'macarons')
      // console.log(this.chart)

      this.chart.setOption({
        toolbox: {
          show: true,
          feature: {
            dataView: {
              show: true,
              readOnly: true
            },
            restore: {
              show: true
            },
            saveAsImage: {
              show: true
            }
          }
        },
        animationDuration: 300,
        animationEasingUpdate: 'quinticInOut',
        series: [{
          name: '企业关系',
          type: 'graph',
          layout: 'force',
          height: 700,
          force: {
            repulsion: 30
          },
          categories: [
            {
              name: '普通企业',
              itemStyle: {
                normal: {
                  color: '#1f2d3d'
                }
              }
            },
            {
              name: '核心企业',
              itemStyle: {
                normal: {
                  color: '#f9a11b'
                }
              }
            }
          ],
          // data: this.nodes,
          // links: this.links,
          data: graph.nodes,
          links: graph.links,
          focusNodeAdjacency: true,
          roam: true,
          label: {
            normal: {
              show: false,
              position: 'top'

            }
          },
          lineStyle: {
            normal: {
              curveness: 0,
              type: 'solid'
            }
            // formatter: '{b}'
          },
          edgeLabel: {
            normal: {
              show: false,
              textStyle: {
                fontSize: 10
              }
            }
            // formatter: '{c}'
          }
        }]
      })
    },
    addLink (start, end, style = 'solid') {
      var geometry = new THREE.Geometry()
      geometry.vertices.push(start)
      geometry.vertices.push(end)
      var material
      if (style === 'solid') { material = new THREE.LineBasicMaterial({color: '#00ffff', linewidth: 0.5, transparent: true}) }
      // else if (style == 'dashed') { material = new THREE.LineDashedMaterial({color: color, linewidth: width, dashSize: 3, gapSize: 1, transparent: true, scale: 0.7}) }
      var line = new THREE.Line(geometry, material)
      line.computeLineDistances()
      return line
    },
    addNode (x, y, z) {
      var geo = new THREE.SphereBufferGeometry(1, 32, 32)
      var material = new THREE.MeshStandardMaterial({color: '#ffffff', transparent: 'true'})
      var mesh = new THREE.Mesh(geo, material)
      mesh.position.set(x, y, z)
      return mesh
    },
    createRenderer () {
      this.renderer = new THREE.WebGLRenderer({ antialias: true })
      this.renderer.setSize(window.innerWidth, window.innerHeight)
      const container = document.getElementById('container')
      container.appendChild(this.renderer.domElement)
    },
    animate () {
      requestAnimationFrame(this.animate)
      // // this.mesh.rotation.x += 0.01
      // this.mesh.rotation.y -= 0.01
      TWEEN.update()

      this.renderer.render(this.scene, this.camera)
    },
    getParticles () {
      this.$store.dispatch('GetProductNode').then(data => {
        // console.log(this.products)
      })
    }
  },
  mounted () {
    this.container = document.getElementById('container')

    this.init()
    this.animate()
  }
}
</script>

<style scoped>
  canvas { width: 100%; height: 100% }
</style>
