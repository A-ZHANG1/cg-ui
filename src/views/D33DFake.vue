
<template>
  <div>
    <h1>Instance Graph</h1>
    <div id="container" :style="{width: '100%', height: '1000px'}"></div>
    <div id="img" width="1200" height="900"></div>
  </div>
</template>

<script>
/*
实例层力导向布局
d3 force因为有ticked Action不能和tween合用
*/
import * as d3 from 'd3'
import * as dagreD3 from 'dagre-d3'
import * as THREE from 'three'
import {setSpriteCanvasContent} from '@/utils/helpers'
import TWEEN from '@tweenjs/tween.js'

import DragControls from 'drag-controls'
DragControls.install({THREE: THREE})

const TransformControls = require('three-transform-controls')(THREE)
const OrbitControls = require('three-orbit-controls')(THREE)

// kg data 自底向上
const nodesData = {
  companies: [ {name: '桂林'}, {name: '广州'}, {name: '厦门'}, {name: '杭州'}, {name: '上海'}, {name: '青岛'}, {name: '天津'} ],
  products: [{ID: '11'}, {ID: '12'}, {ID: '17'}]
}

const linksData = {
  companyLinks: [{source: 0, target: 1}, {source: 0, target: 2},
    {source: 0, target: 3}, {source: 1, target: 4},
    {source: 1, target: 5}, {source: 1, target: 6}],
  productLinks: [{source: 7, target: 8}, {source: 8, target: 9}],
  orders: [{source: 0, target: 8}, {source: 1, target: 8}, {source: 2, target: 8}, {source: 3, target: 8}, {source: 4, target: 8}, {source: 5, target: 8}, {source: 6, target: 8}]
}

const order = [{source: 0, target: 8}, {source: 1, target: 8}, {source: 2, target: 8}, {source: 3, target: 8}, {source: 4, target: 8}, {source: 5, target: 8}, {source: 6, target: 8}]

// product层数据
// const productInstance = [{ID: '11'}, {ID: '12'}, {ID: '17'}]
// const productInstanceLinks = [{source: 0, target: 1}, {source: 0, target: 2},
//   {source: 2, target: 3}]
const width = window.innerWidth
const height = window.innerHeight

export default {
  name: 'D33DFake',
  data () {
    return {
      camera: '',
      scene: '',
      renderer: '',
      container: '',
      // mesh:''
      brickTexture: require('../assets/brick_diffuse.jpg'),

      orbitControl: '',
      dragControl: '',
      objects: ''
    }
  },
  mounted () {
    this.container = document.getElementById('container')
    this.init()
    this.initControls()

    this.animate()
  },
  methods: {
    init () {
      this.initScene()
      this.initLight()
      this.initCamera()

      // var classGeo = new THREE.SphereBufferGeometry(10, 32, 32)
      // var classMaterial = new THREE.MeshBasicMaterial({color: '#ffff00'})
      // var mesh = new THREE.Mesh(classGeo, classMaterial)
      // mesh.position.set(0, 0, 0)
      // this.scene.add(mesh)
      this.objects = []

      this.scene.add(this.createSpriteForLayer('Company', 0, 0, 0))
      this.scene.add(this.createSpriteForLayer('Order', 0, 20, 0))
      this.scene.add(this.createSpriteForLayer('Product', 0, 50, 0))
      let instanceGraphGroup = this.createInstanceGraph()
      this.scene.add(instanceGraphGroup)
      console.log(instanceGraphGroup)
      // for (let mesh in instanceGraphGroup.children) {
      for (let i = 0; i < instanceGraphGroup.children.length; i++) {
        console.log(instanceGraphGroup.children[i])
        this.objects.push(instanceGraphGroup.children[i])
      }
      // console.log(instanceGraphGroup.children[0])

      this.initRenderer()

      this.initControls(this.createInstanceGraph())
    },
    initScene () {
      this.scene = new THREE.Scene()

      // let axesHelper = new THREE.AxesHelper(50)
      // this.scene.add(axesHelper)
    },
    initCamera () {
      // this.camera = new THREE.PerspectiveCamera(75, width / height, 1, 1000)
      const frustumSize = 200
      var aspect = width / height

      this.camera = new THREE.OrthographicCamera(frustumSize * aspect / -2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / -2, 0.1, 1000)

      this.camera.position.set(20, 40, 100)
      this.camera.lookAt(0, 25, 0)
    },
    initRenderer () {
      this.renderer = new THREE.WebGLRenderer({antialias: true})
      this.renderer.setSize(width, height)
      // this.renderer.setClearColor( 0x000000, 1 );
      this.container.appendChild(this.renderer.domElement)
    },
    initLight () {
      let light = new THREE.AmbientLight(0xffffff, 0.5)
      light.position.set(0, 10, 0)
      this.scene.add(light)

      light = new THREE.DirectionalLight(0xffffff, 0.5)
      light.position.set(0, 1000, 0)
      this.scene.add(light)
    },
    initControls () {
      this.orbitControl = new OrbitControls(this.camera, this.renderer.domElement)
      this.orbitControl.update()
      // this.orbitControl.addEventListener('change', this.render)

      console.log(this.objects)

      this.dragControl = new DragControls(this.objects, this.camera, this.renderer.domElement)
      this.dragControl.addEventListener('dragstart', function (event) {
        this.orbitControl.enabled = false
        // event.object.material.emissive.set('#ff0000')
      })
      this.dragControl.addEventListener('dragend', function (event) {
        this.orbitControl.enabled = true
        // event.object.material.emissive.set('#ffffff')
      })
    },
    createSpriteForLayer (className, x, y, z) {
      var spirteCanvas = setSpriteCanvasContent(className)
      var spirteTexture = new THREE.CanvasTexture(spirteCanvas)

      var spriteMaterial = new THREE.SpriteMaterial({map: spirteTexture})
      var spriteObj = new THREE.Sprite(spriteMaterial)
      spriteObj.scale.set(10, 8, 1)
      spriteObj.position.set(x, y, z)
      return spriteObj
    },
    createInstanceGraph () {

      let simulation = d3.forceSimulation()

      simulation
        .force('charge', d3.forceManyBody())
        .force('center', d3.forceCenter(0, 0))
        .force('link', d3.forceLink())

      let nodes = []
      Object.values(nodesData).forEach(el => el.forEach(n => nodes.push(n)))
      let links = []
      Object.values(linksData).forEach(el => el.forEach(n => links.push(n)))

      simulation.nodes(nodes)
        .on('tick', this.tickAction)
        .force('link')
        .links(links)

      let group = new THREE.Group()
      group.name = 'companiesLayer'

      this.nodesPosition = []

      const userOpts = {
        range: 800,
        duration: 1800,
        delay: 0,
        easing: TWEEN.Easing.Quadratic.In
      }

      nodes.forEach((node, idx) => {
        if (idx < nodesData.companies.length) {
          // 布局企业节点
          node.geometry = new THREE.SphereBufferGeometry(2, 32, 32)
          // node.geometry = new THREE.CircleBufferGeometry(5, 32)
          node.material = new THREE.MeshStandardMaterial({color: '#ffffff', transparent: 'true'})
          node.circle = new THREE.Mesh(node.geometry, node.material)
          // node.circle.position.set(node.x, 0, node.y)
          node.circle.position.set(Math.random()*10, 0, Math.random()*15)
          let target = {
            x: node.x,
            y: 0,
            z: node.y
          }
          this.moveTo(node, target, userOpts)
          // console.log(node)
        } else {
          // node.geometry = new THREE.SphereBufferGeometry(1, 32, 8)

          // 布局产品节点
          const radiusTop = 2
          const radiusBottom = 2
          const height = 5
          const radialSegments = 12
          node.geometry = new THREE.CylinderBufferGeometry(radiusTop, radiusBottom, height, radialSegments)
          node.material = new THREE.MeshStandardMaterial({map: THREE.ImageUtils.loadTexture(this.brickTexture)})
          node.circle = new THREE.Mesh(node.geometry, node.material)

          node.x = node.x - 25
          node.y = node.y - 25
          node.circle.position.set(node.x, 50, node.y)
        }
        this.nodesPosition.push(node.circle.position)
        group.add(node.circle)
      })

      links.forEach((link, idx) => {
        // console.log(link)
        link.geometry = new THREE.Geometry()
        if (idx < linksData.companyLinks.length) {
          link.geometry.vertices.push(new THREE.Vector3(link.source.x, 0, link.source.y))
          link.geometry.vertices.push(new THREE.Vector3(link.target.x, 0, link.target.y))
        } else if (idx < linksData.companyLinks.length + linksData.productLinks.length) {
          link.geometry.vertices.push(new THREE.Vector3(link.source.x, 50, link.source.y))
          link.geometry.vertices.push(new THREE.Vector3(link.target.x, 50, link.target.y))
        } else {
          link.geometry.vertices.push(new THREE.Vector3(link.source.x, 0, link.source.y))
          link.geometry.vertices.push(new THREE.Vector3(link.target.x, 50, link.target.y))
        }
        link.material = new THREE.LineBasicMaterial({color: '#ffff00', linewidth: 0.5})
        link.line = new THREE.Line(link.geometry, link.material)
        group.add(link.line)
      })
      console.log(group)
      // console.log(order[0])

      // order.forEach((order, idx) => {
      //   let orderGeo = new THREE.Geometry()
      //
      //   orderGeo.vertices.push(this.nodesPosition[order.source])
      //   orderGeo.vertices.push(this.nodesPosition[order.target])
      //   let orderMat = new THREE.LineBasicMaterial({color: '#00ff00', linewidth: 0.5})
      //   let orderLine = new THREE.Line(orderGeo, orderMat)
      //   group.add(orderLine)
      // })

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
    tickAction () {
      nodesData.companies.forEach(node => {
        const {x, y, circle} = node
        circle.position.set(x, 0, y)
      })
      nodesData.products.forEach(node => {
        const {x, y, circle} = node
        circle.position.set(x, 50, y)
      })
      linksData.companyLinks.forEach((link) => {
        const {source, target, line} = link
        line.geometry.verticesNeedUpdate = true
        line.geometry.vertices[0] = new THREE.Vector3(source.x, 0, source.y)
        line.geometry.vertices[1] = new THREE.Vector3(target.x, 0, target.y)
      })
      linksData.productLinks.forEach((link) => {
        const {source, target, line} = link
        line.geometry.verticesNeedUpdate = true
        line.geometry.vertices[0] = new THREE.Vector3(source.x, 50, source.y)
        line.geometry.vertices[1] = new THREE.Vector3(target.x, 50, target.y)
      })
      linksData.orders.forEach(o => {
        // let companyNode = nodesData.companies[o.source]
        // let productNode = nodesData.products[o.target - nodesData.companies.length]
        //
        // let sourcePos = new THREE.Vector3(companyNode.x, 0, companyNode.y)
        // let targetPos = new THREE.Vector3(productNode.x, 0, productNode.y)
        // this.addLink(sourcePos, targetPos)
        const {source, target, line} = o
        line.geometry.verticesNeedUpdate = true
        line.geometry.vertices[0] = new THREE.Vector3(source.x, 0, source.y)
        line.geometry.vertices[1] = new THREE.Vector3(target.x, 50, target.y)
      })
    },
    animate () {
      requestAnimationFrame(this.animate)
      TWEEN.update()
      this.renderer.render(this.scene, this.camera)
    }
  }
}
</script>
<style scoped>
  svg {
    border: 1px solid #ccc;
  }
</style>
<style>
  .links line {
    stroke: #999;
    stroke-opacity: 0.6;
  }
  .nodes circle {
    stroke: #fff;
    stroke-width: 1.5px;
  }
</style>
