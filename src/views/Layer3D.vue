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
import { setCanvasContent, setSpriteCanvasContent} from '@/utils/helpers'
// import { TransformControls } from 'three-transform-controls'
// const TransformControls = require('three-transform-controls')(THREE)
// const OrbitControls = require('three-orbit-controls')(THREE)

// kg data 自底向上
const customerSchema = [{name: 'Customer'}, {name: 'companyName'},
  {name: 'contactName'}, {name: 'city'}]

const orderSchema = [{name: 'Order'}, {name: 'orderID'},
  {name: 'requiredDate'}, {name: 'shippedDate'}]

const productSchema = [{name: 'Product'}, {name: 'unitPrice'},
  {name: 'productID'}, {name: 'quantity'}]

const customerSchemaLinks = [{source: 0, target: 1}, {source: 0, target: 2},
  {source: 0, target: 3}]

const orderSchemaLinks = [{source: 0, target: 1}, {source: 0, target: 2},
  {source: 0, target: 3}, {source: 2, target: 3}]

const productSchemaLinks = [{source: 0, target: 1}, {source: 0, target: 2},
  {source: 0, target: 3}]

const OrbitControls = require('three-orbit-controls')(THREE)

export default {

  name: 'Layer3D',
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
      control: ''

    }
  },
  computed: mapState({
    products: state => state.graphData.products
  }),
  mounted () {
    let container = document.getElementById('container')

    this.scene = new Three.Scene()

    let light = new THREE.AmbientLight(0xffffff, 0.5)
    light.position.set(0, 10, 0)
    this.scene.add(light)

    light = new THREE.DirectionalLight(0xffffff, 1) // intensity.default 1
    light.position.set(0, 100, 0)
    this.scene.add(light)

    // 分层概念关联相机
    this.camera = new Three.PerspectiveCamera(70, container.clientWidth / container.clientHeight, 1, 1000)
    this.camera.position.set(20, 40, 100)
    this.camera.lookAt(this.scene.position)

    let axesHelper = new THREE.AxesHelper(60)
    this.scene.add(axesHelper)

    const boundingRadius = 0.5

    // 底层 zan 客户层
    let simulation = d3.forceSimulation()

    simulation
      .force('charge', d3.forceManyBody().strength(-100)) // strength + 引力， - 斥力
      .force('center', d3.forceCenter(-50, -50))// 重力
      .force('link', d3.forceLink().distance(30))// 弹力及稳定时的长度
      // .force('link', d3.forceLink().id(function (d) { return d.index }).distance(5))// 弹力及稳定时的长度

    simulation.nodes(customerSchema)
      .on('tick', this.customerTickAction)
      .force('link')
      .links(customerSchemaLinks)

    let customerGroup = new THREE.Group()
    customerGroup.name = 'customerLayer'

    customerSchema.forEach(node => {
      if (node.name === 'Customer') {
        node.circle = this.createClassMesh('Customer')
        var spriteObj = this.createClassSprite(node.name, node.x, -50, node.y)
        // var spriteObj = this.createClassSprite('Customer', 0, 0, 0)
        this.mesh = spriteObj
      } else {
        node.circle = this.createPropMesh(node.name)
      }

      customerGroup.add(spriteObj)

      node.circle.position.set(node.x, -50, node.y)
      customerGroup.add(node.circle)
    })

    customerSchemaLinks.forEach(link => {
      link.geometry = new THREE.Geometry()
      link.geometry.vertices.push(new THREE.Vector3(link.source.x, -50, link.source.y))
      link.geometry.vertices.push(new THREE.Vector3(link.target.x, -50, link.target.y))
      link.material = new THREE.LineBasicMaterial({color: '#700000', linewidth: 1})
      link.line = new THREE.Line(link.geometry, link.material)

      console.log(link)
      customerGroup.add(link.line)
    })
    this.scene.add(customerGroup)

    // 中间层 zan 订单层，企业和产品实体关联
    let orderSimulation = d3.forceSimulation()

    orderSimulation
      .force('charge', d3.forceManyBody().strength(-100)) // strength + 引力， - 斥力
      .force('center', d3.forceCenter(0, 0))// 重力
      .force('link', d3.forceLink().distance(30))// 弹力及稳定时的长度
      // .force('link', d3.forceLink().id(function (d) { return d.index }).distance(5))// 弹力及稳定时的长度

    orderSimulation.nodes(orderSchema)
      .on('tick', this.customerTickAction)
      .force('link')
      .links(orderSchemaLinks)

    let orderGroup = new THREE.Group()
    orderGroup.name = 'customerLayer'

    orderSchema.forEach(node => {
      if (node.name === 'Order') {
        node.circle = this.createClassMesh('Order')
        var spriteObj = this.createClassSprite(node.name, node.x, 0, node.y)
        // var spriteObj = this.createClassSprite('Customer', 0, 0, 0)
        this.mesh = spriteObj
      } else {
        node.circle = this.createPropMesh(node.name)
      }

      customerGroup.add(spriteObj)

      node.circle.position.set(node.x, 0, node.y)
      orderGroup.add(node.circle)
    })

    orderSchemaLinks.forEach(link => {
      link.geometry = new THREE.Geometry()
      link.geometry.vertices.push(new THREE.Vector3(link.source.x, 0, link.source.y))
      link.geometry.vertices.push(new THREE.Vector3(link.target.x, 0, link.target.y))
      link.material = new THREE.LineBasicMaterial({color: '#700000', linewidth: 1})
      link.line = new THREE.Line(link.geometry, link.material)

      console.log(link)
      customerGroup.add(link.line)
    })
    this.scene.add(orderGroup)

    // 顶层 zan 产品层
    let productSimulation = d3.forceSimulation()

    productSimulation
      .force('charge', d3.forceManyBody().strength(-100)) // strength + 引力， - 斥力
      .force('center', d3.forceCenter(50, 50))// 重力
      .force('link', d3.forceLink().distance(30))// 弹力及稳定时的长度
      // .force('link', d3.forceLink().id(function (d) { return d.index }).distance(5))// 弹力及稳定时的长度

    productSimulation.nodes(productSchema)
      .on('tick', this.productTickAction)
      .force('link')
      .links(productSchemaLinks)

    let productGroup = new THREE.Group()
    productGroup.name = 'productLayer'

    productSchema.forEach(node => {
      if (node.name === 'Product') {
        node.circle = this.createClassMesh('Product')
        console.log(node.x)
        console.log(node.y)
        var spriteObj = this.createClassSprite(node.name, node.x, 50, node.y)
        // var spriteObj = this.createClassSprite(node.name, 0, 50, 0)
      } else {
        node.circle = this.createPropMesh(node.name)
      }

      productGroup.add(spriteObj)

      node.circle.position.set(node.x, 50, node.y)
      productGroup.add(node.circle)
    })

    productSchemaLinks.forEach(link => {
      link.geometry = new THREE.Geometry()
      link.geometry.vertices.push(new THREE.Vector3(link.source.x, 50, link.source.y))
      link.geometry.vertices.push(new THREE.Vector3(link.target.x, 50, link.target.y))
      link.material = new THREE.LineBasicMaterial({color: '#700000', linewidth: 1})
      link.line = new THREE.Line(link.geometry, link.material)

      console.log(link)
      productGroup.add(link.line)
    })
    this.scene.add(productGroup)

    // 其他概念层
    // var material = new Three.MeshBasicMaterial({color: 0xffff00, side: Three.DoubleSide})
    //
    // // 企业
    // var radius = 5
    // var companyGeo = new THREE.IcosahedronBufferGeometry(radius)
    // this.meshCom = new Three.Mesh(companyGeo, material)
    // this.scene.add(this.meshCom)
    // this.meshCom.position.set(0, 50, 0)
    //
    // // 订单
    // var group = new THREE.Group()
    //
    // var orderGeo = new Three.BoxGeometry(10, 10, 10)
    // this.cubeA = new THREE.Mesh(orderGeo, material)
    // this.cubeA.position.set(0, -50, 0)
    //
    // this.cubeB = new THREE.Mesh(orderGeo, material)
    // this.cubeB.position.set(20, -50, 0)
    //
    // group.add(this.cubeA, this.cubeB)
    // this.scene.add(group)

    // 关联
    var start = new THREE.Vector3(0, 0, 0)
    var end = new THREE.Vector3(0, 50, 0)
    var lineGeo = new THREE.Geometry()
    var lineMaterial = new THREE.LineBasicMaterial({ color: 0xffff00 })
    lineGeo.vertices.push(start)
    lineGeo.vertices.push(end)
    var line = new THREE.Line(lineGeo, lineMaterial)
    this.scene.add(line)

    // 2.一个不旋转的平面
    // var geometry3 = new Three.PlaneBufferGeometry(2, 2)
    // geometry3.rotateX(-Math.PI / 2)
    //
    // // var material3 = new Three.MeshBasicMaterial({color: 0xffff00, side: Three.DoubleSide})
    // var material3 = new Three.MeshBasicMaterial({color: 0xffff00, visible: false})
    // this.plane = new Three.Mesh(geometry3, material3)
    //
    // this.scene.add(this.plane)

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

    // 渲染
    this.renderer = new Three.WebGLRenderer({ antialias: true })
    this.renderer.setSize(container.clientWidth, container.clientHeight)
    container.appendChild(this.renderer.domElement)

    // this.renderer.render(this.scene, this.camera)
    this.initControls()
    this.animate()
  },
  methods: {
    initControls () {
      this.control = new OrbitControls(this.camera, this.renderer.domElement)
      this.control.update()
      this.control.addEventListener('change', this.render)
    },
    customerTickAction () {
      customerSchema.forEach(node => {
        const { x, y, circle } = node

        // let x = node.x
        // let y = node.y
        // let circle = node.circle

        circle.position.set(x, -50, y)

        // node.circle.position.set(node.x, 0, node.y)
      })
      customerSchemaLinks.forEach((link) => {
        const { source, target, line } = link
        line.geometry.verticesNeedUpdate = true
        line.geometry.vertices[0] = new THREE.Vector3(source.x, -50, source.y)
        line.geometry.vertices[1] = new THREE.Vector3(target.x, -50, target.y)
      })
    },
    productTickAction () {
      productSchema.forEach(node => {
        const { x, y, circle } = node

        // let x = node.x
        // let y = node.y
        // let circle = node.circle

        circle.position.set(x, 50, y)

        // node.circle.position.set(node.x, 0, node.y)
      })
      productSchemaLinks.forEach((link) => {
        const { source, target, line } = link
        line.geometry.verticesNeedUpdate = true
        line.geometry.vertices[0] = new THREE.Vector3(source.x, 50, source.y)
        line.geometry.vertices[1] = new THREE.Vector3(target.x, 50, target.y)
      })
    },
    createClassMesh (className) {
      var classGeo = new THREE.SphereBufferGeometry(5, 32, 32)
      var classMaterial = new THREE.MeshStandardMaterial({color: '#ffffff', transparent: 'true'})
      var mesh = new THREE.Mesh(classGeo, classMaterial)
      return mesh
    },
    createClassSprite (className, x, y, z) {
      // var spirteCanvas = setCanvasContent(className)
      var spirteCanvas = setSpriteCanvasContent(className)
      var spirteTexture = new THREE.CanvasTexture(spirteCanvas)

      var spriteMaterial = new THREE.SpriteMaterial({map: spirteTexture})
      var spriteObj = new THREE.Sprite(spriteMaterial)
      spriteObj.scale.set(10, 8, 1)
      spriteObj.position.set(x, y + 10, z)
      return spriteObj
    },
    createPropMesh (propName) {
      var propTextures = []
      var propMaterials = []
      for (let i = 0; i < 6; i++) {
        let cv = setCanvasContent(propName)
        propTextures.push(new THREE.CanvasTexture(cv))
        propMaterials.push(new THREE.MeshStandardMaterial({map: propTextures[0]}))
      }
      // var propMaterial = new THREE.MeshStandardMaterial({map: propTexture})
      var propGeo = new THREE.BoxBufferGeometry(10, 10, 10)
      var mesh = new THREE.Mesh(propGeo, propMaterials)

      // mesh.position.set(0, -50, 0)
      return mesh
    },
    animate: function () {
      // 立方体的旋转
      requestAnimationFrame(this.animate)
      this.mesh.rotation.x += 0.01
      this.mesh.rotation.y += 0.01

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
