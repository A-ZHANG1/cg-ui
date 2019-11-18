<template>
  <div>
    <el-row>
      <el-col :span="18">
        <div style="background:#1f2d3d;height:60px">合同</div>
      </el-col>
      <el-col span="6">
        <el-menu :default-active="$route.path"
                 mode="horizontal"
                 background-color="#1f2d3d"
                 text-color="#fff"
                 active-text-color="#ffd04b"
                 router>
          <el-menu-item index="/forceGraph">系统所有企业</el-menu-item>
          <el-menu-item index="/subGraph">小图</el-menu-item>
          <el-menu-item index="/contractUpload">合同批量导入</el-menu-item>
        </el-menu>
      </el-col>
    </el-row>

    <el-row>
      <div style="margin:0px 0px 20px 110px;padding:0;width:820px;height:0px;background-color:lightGrey;overflow:hidden;"></div>
    </el-row>

    <el-row>
      <div id="container" :style="{width: '100%', height: '1000px'}"></div>
      <!--      <div id="container" width="1200" height="900"></div>-->
    </el-row>

  </div>
</template>

<script>
import * as d3 from 'd3'
import * as Three from 'three'
import * as THREE from 'three'
import { mapState } from 'vuex'
import dagreD3 from 'dagre-d3'
import * as dagre from 'dagre'
import { setCanvasContent, setSpriteCanvasContent} from '@/utils/helpers'
import TWEEN from '@tweenjs/tween.js'

// import { TransformControls } from 'three-transform-controls'
import DragControls from 'drag-controls'
DragControls.install({THREE: THREE})

const TransformControls = require('three-transform-controls')(THREE)
const OrbitControls = require('three-orbit-controls')(THREE)
// const DragControls = require('drag-controls')

// kg data 自底向上
const nodesData = {
  companies: [ {name: '桂林'}, {name: '广州'}, {name: '厦门'}, {name: '杭州'}, {name: '上海'}, {name: '青岛'}, {name: '天津'} ],
  orders: [{source: 0, target: 8}, {source: 1, target: 8}, {source: 2, target: 8}, {source: 3, target: 8}, {source: 4, target: 8}, {source: 5, target: 8}, {source: 6, target: 8}],
  products: [{ID: '11'}, {ID: '12'}, {ID: '17'}]
}

const linksData = {
  companyLinks: [{source: 0, target: 1}, {source: 0, target: 2},
    {source: 0, target: 3}, {source: 1, target: 4},
    {source: 1, target: 5}, {source: 1, target: 6}],
  productLinks: [{source: 7, target: 8}, {source: 8, target: 9}],
  orders: [{source: 0, target: 8}, {source: 1, target: 8}, {source: 2, target: 8}, {source: 3, target: 8}, {source: 4, target: 8}, {source: 5, target: 8}, {source: 6, target: 8}]
}

const boundingRadius = 3

const userOpts = {
  range: 800,
  duration: 1800,
  delay: 0,
  easing: TWEEN.Easing.Quadratic.In
}

export default {

  name: 'Layer3DDagre',
  data () {
    return {
      camera: null,
      camProduct: null,

      scene: null,
      renderer: null,
      // 网格们
      mesh: null,
      mesh2: null,
      meshCom: null,

      plane: null,
      mesh3: null,

      cubeA: null,
      cubeB: null,
      light: null,
      control: '',
      dragControl: '',
      objects: ''
    }
  },
  computed: mapState({
    products: state => state.graphData.products
  }),
  mounted () {
    let container = document.getElementById('container')

    this.scene = new THREE.Scene()

    let light = new THREE.AmbientLight(0xffffff, 0.5)
    light.position.set(0, 10, 0)
    this.scene.add(light)

    light = new THREE.DirectionalLight(0xffffff, 1) // intensity.default 1
    light.position.set(0, 100, 0)
    this.scene.add(light)

    // 分层概念关联相机
    this.camera = new THREE.PerspectiveCamera(70, container.clientWidth / container.clientHeight, 1, 1000)
    this.camera.position.set(20, 40, 100)
    this.camera.lookAt(this.scene.position)

    let axesHelper = new THREE.AxesHelper(60)
    this.scene.add(axesHelper)

    // 底层 zan 客户层
    let customerLayerGroup = this.addLayer('Customer', nodesData.companies, linksData.companyLinks, -50)
    this.scene.add(customerLayerGroup)

    // 中间层 zan 订单层，企业和产品实体关联

    let orderLayerGroup = this.addLayer('Order', nodesData.orders, linksData.orders, 0)
    this.scene.add(orderLayerGroup)

    // 顶层 zan 产品层
    let productLayerGroup = this.addLayer('Product', nodesData.products, linksData.productLinks, 50)
    this.scene.add(productLayerGroup)

    // 关联
    var start = new THREE.Vector3(0, 0, 0)
    var end = new THREE.Vector3(0, 50, 0)
    var lineGeo = new THREE.Geometry()
    var lineMaterial = new THREE.LineBasicMaterial({ color: 0xffff00 })
    lineGeo.vertices.push(start)
    lineGeo.vertices.push(end)
    var line = new THREE.Line(lineGeo, lineMaterial)
    this.scene.add(line)

    // 3.一个网格
    var size = 100
    var divisions = 100
    var colorCenterLine = 0x444444
    var colorGrid = 0xffff00

    var gridHelper = new THREE.GridHelper(size, divisions, colorCenterLine, colorGrid)
    gridHelper.position.y = 50
    gridHelper.position.x = 0

    this.scene.add(gridHelper)

    var gridHelper2 = new THREE.GridHelper(size, divisions, colorCenterLine, colorGrid)
    gridHelper2.position.y = 0
    gridHelper2.position.x = 0

    this.scene.add(gridHelper2)

    var gridHelper3 = new THREE.GridHelper(size, divisions, colorCenterLine, colorGrid)
    gridHelper3.position.y = -50
    gridHelper3.position.x = 0

    this.scene.add(gridHelper3)

    this.objects = []
    var material = new Three.MeshBasicMaterial({color: 0xffff00, side: Three.DoubleSide})

    var orderGeo = new Three.BoxGeometry(10, 10, 10)
    this.cubeA = new THREE.Mesh(orderGeo, material)
    this.cubeA.position.set(0, -50, 0)
    this.scene.add(this.cubeA)
    this.objects.push(this.cubeA)

    // 渲染
    this.renderer = new Three.WebGLRenderer({ antialias: true })
    this.renderer.setSize(container.clientWidth, container.clientHeight)
    container.appendChild(this.renderer.domElement)

    this.initControls()

    // this.renderer.render(this.scene, this.camera)
    this.animate()
  },
  methods: {
    initControls () {
      this.control = new OrbitControls(this.camera, this.renderer.domElement)
      this.control.update()
      // this.control.addEventListener('change', this.render)

      this.dragControl = new DragControls(this.objects, this.camera, this.renderer.domElement)
      // this.dragControl.addEventListener('dragstart', function (event) {
      this.dragControl.addEventListener('mouseDown', function (event) {
        this.control.enabled = false
        event.object.material.emissive.set(0xaaaaaa)
      })
      // this.dragControl.addEventListener('dragend', function (event) {
      this.dragControl.addEventListener('mouseUp', function (event) {
        this.control.enabled = true

        event.object.material.emissive.set(0x000000)
      })
    },
    addLink (start, end, style = 'solid') {
      var geometry = new THREE.Geometry()
      geometry.vertices.push(start)
      geometry.vertices.push(end)
      var material
      if (style === 'solid') { material = new THREE.LineBasicMaterial({color: '#ff00ff', linewidth: 0.5, transparent: true}) }
      // else if (style == 'dashed') { material = new THREE.LineDashedMaterial({color: color, linewidth: width, dashSize: 3, gapSize: 1, transparent: true, scale: 0.7}) }
      var line = new THREE.Line(geometry, material)
      line.computeLineDistances()
      return line
    },
    addNode (className, x, y, z) {
      var geo = new THREE.SphereBufferGeometry(1, 32, 32)
      var material = new THREE.MeshStandardMaterial({color: '#ffffff', transparent: 'true'})
      var mesh = new THREE.Mesh(geo, material)
      mesh.position.set(x, y, z)
      return mesh
    },
    addLayer (className, schemaNodes, schemaLinks, zPos) {

      let group = new THREE.Group()
      let g = new dagreD3.graphlib.Graph()
      g.setGraph({})
      g.setDefaultEdgeLabel(function () { return {} })
      for (let name in schemaNodes) {
        g.setNode(name, {width: 2, height: 2})
      }
      for (let link of schemaLinks) {
        g.setEdge(link.source, link.target)
      }
      dagre.layout(g)

      for (let n = 0; n < Object.keys(g._nodes).length; n++) {
        // let nodex = g._nodes[n].x
        // let nodey = g._nodes[n].y

        // let nodex = Math.round(g._nodes[n].x) / boundingRadius
        // let nodey = Math.round(g._nodes[n].y) / boundingRadius

        let nodeMesh = this.addNode(className, Math.random() * 10, zPos, Math.random() * 15)
        // let nodeMesh = this.addNode(className, nodex, zPos, nodey)
        // nodeMesh.position.set(nodex, -50, nodey)
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

      // for (let e = 0; e < Object.keys(g._edgeObjs).length; e++) {
      //   let sourceNode = Object.values(g._edgeObjs)[e].v
      //   let targetNode = Object.values(g._edgeObjs)[e].w
      //
      //   // let sourceNodex = g._nodes[sourceNode].x
      //   // let sourceNodey = g._nodes[sourceNode].y
      //   // let targetNodex = g._nodes[targetNode].x
      //   // let targetNodey = g._nodes[targetNode].y
      //
      //   let sourceNodex = Math.round(g._nodes[sourceNode].x) / boundingRadius
      //   let sourceNodey = Math.round(g._nodes[sourceNode].y) / boundingRadius
      //   let targetNodex = Math.round(g._nodes[targetNode].x) / boundingRadius
      //   let targetNodey = Math.round(g._nodes[targetNode].y) / boundingRadius
      //
      //   group.add(this.addLink(new THREE.Vector3(sourceNodex, zPos, sourceNodey),
      //     new THREE.Vector3(targetNodex, zPos, targetNodey)))
      // }

      return group
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
    animate: function () {
      // 立方体的旋转
      requestAnimationFrame(this.animate)
      // this.mesh.rotation.x += 0.01
      // this.mesh.rotation.y += 0.01

      /* 正在这边尝试做高亮，但是级联显示效果不支持 */
      // var raycaster = new THREE.Raycaster()
      // var hightLightMaterial = new THREE.MeshBasicMaterial({color: 'red'})
      // raycaster.setFromCamera(mouse, this.camera)
      // var instersects = raycaster.intersectObjects(this.objects, true)

      TWEEN.update()

      this.renderer.render(this.scene, this.camera)
      // this.renderer.render(this.scene, this.camProduct)
    },

    getParticles () {
      this.$store.dispatch('GetProductNode').then(data => {
        console.log(this.products)
      })
    }
  }
}
</script>

<style scoped>
  #container {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }

</style>
