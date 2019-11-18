<template>
  <div>
    <h1>Knowledge Graph</h1>
    <div id="container" width="1200" height="900"></div>
  </div>
</template>

<script>
import * as d3 from 'd3'
import * as THREE from 'three'
/*
d3 4.x simulation layout 2d 计算所有node x,y坐标。嫁接到3D应用场景中仅能显示一个node
 */
export default {
  name: 'D3Force',
  data () {
    return {
    }
  },
  mounted () {
    // let svg = d3.select('svg')
    let width = 1200
    let height = 900

    let nodesData = [{name: '桂林'}, {name: '广州'},
      {name: '厦门'}, {name: '杭州'},
      {name: '上海'}, {name: '青岛'},
      {name: '天津'} ]
    let linksData = [{source: 0, target: 1}, {source: 0, target: 2},
      {source: 0, target: 3}, {source: 1, target: 4},
      {source: 1, target: 5}, {source: 1, target: 6}]

    let scene = new THREE.Scene()
    let renderer = new THREE.WebGLRenderer({antialias: true})
    renderer.setSize(width, height)
    let container = document.getElementById('container')

    container.appendChild(renderer.domElement)

    // let camera = new THREE.PerspectiveCamera(70, width / height, 1, 1000)
    let camera = new THREE.OrthographicCamera(0, width, height, 0, 1, 1000)

    // camera.position.set(50, 50, 350)
    camera.position.set(0, 0, 5)
    camera.lookAt(0, 0, 0)

    nodesData.forEach(node => {
      // node.geometry = new THREE.SphereBufferGeometry(1, 32, 32)
      node.geometry = new THREE.CircleBufferGeometry(5, 32)
      node.material = new THREE.MeshStandardMaterial({color: '#ffffff', transparent: 'true'})
      node.circle = new THREE.Mesh(node.geometry, node.material)
      scene.add(node.circle)
      console.log(node)
    })

    linksData.forEach(link => {
      link.geometry = new THREE.Geometry()
      link.material = new THREE.LineBasicMaterial({vertexColors: true, linewidth: 50})
      link.line = new THREE.Line(link.geometry, link.material)
      scene.add(link.line)
      console.log(link)
    })

    let simulation = d3.forceSimulation()

    simulation
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('link', d3.forceLink().distance(50))

    simulation.nodes(nodesData)
      .on('tick', tickAction)
      .force('link')
      .links(linksData)

    console.log(nodesData[0].x)

    let light = new THREE.AmbientLight(0xffffff, 0.5)
    light.position.set(0, 10, 0)
    scene.add(light)

    light = new THREE.SpotLight(0xffffff, 0.5)
    light.position.set(5, 5, -200)
    scene.add(light)

    light = new THREE.DirectionalLight(0xffffff, 0.5)
    light.position.set(-50, -50, 50)
    scene.add(light)

    renderer.render(scene, camera)

    function tickAction () {
      nodesData.forEach(node => {
        // value.body.position.set(value.x, value.y, 0)
        const { x, y, circle } = node
        circle.position.set(x, y, 0)
        // value.body.position.set(value.x, value.y, 0)
      })
      linksData.forEach((link) => {
        const { source, target, line } = link
        line.geometry.verticesNeedUpdate = true
        line.geometry.vertices[0] = new THREE.Vector3(source.x, source.y, 0)
        line.geometry.vertices[1] = new THREE.Vector3(target.x, target.y, 0)
      })
    }
  },
  methods: {

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
