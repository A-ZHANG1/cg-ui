<template>
  <el-row>
    <div id="container" :style="{width: '100%', height: '1000px'}">
    </div>
  </el-row>
</template>

<script>
import * as THREE from 'three'
import { mapState } from 'vuex'
// import brickTexture from '@/assets/brick_diffuse.jpg'

const OrbitControls = require('three-orbit-controls')(THREE)

/*
* 这边主要在尝试做
* 1.light,
* 2.texture往cube上贴图
* 3.particle分层
 */

export default {
  name: 'Layer3DAll',
  data () {
    return {
      camera: '',
      scene: '',
      renderer: '',
      mesh: '',
      fontsize: 10,
      light: '',
      brickTexture: require('../assets/brick_diffuse.jpg')
    }
  },
  computed: mapState({
    products: state => state.graphData.products
  }),
  methods: {
    init () {
      this.scene = new THREE.Scene()

      this.scene.add(new THREE.AmbientLight(0x404040))

      this.createLight()

      this.camera = this.createCamera()
      this.scene.add(this.camera)
      let axesHelper = new THREE.AxesHelper(50)
      this.scene.add(axesHelper)

      this.mesh = this.createMesh()
      this.scene.add(this.mesh)
      this.scene.add(this.createMeshTextureTest())
      this.scene.add(this.createPointSystem())
      this.createRenderer()
      // this.setControls()
    },
    createCamera () {
      // var camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.01, 10)
      var camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 10)
      camera.position.set(0, 0, 2)
      // camera.lookAt(new THREE.Vector3(0, -0.5, 0))
      camera.lookAt(this.scene.position)

      return camera
    },
    createLight () {
      var light = new THREE.DirectionalLight(0xdfebff, 0.9)// 从正上方（不是位置）照射过来的平行光，0.9的强度
      // light.position.set(0.2, 1, 0.4)
      light.position.set(0, 0, 4)
      // light.position.multiplyScalar(0.3)
      this.scene.add(light)
    },
    setCanvasContent (text) {
      // 暂时不用shader，text -> canvas -> texture -> map to sprite

      var canvas = document.createElement('canvas')
      var ctx = canvas.getContext('2d')

      // canvas 宽高一般要设置>256
      canvas.width = 256
      canvas.height = 256

      // 外框线
      ctx.fillStyle = '#700000'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // 内正方形
      ctx.fillStyle = 'white'
      ctx.fillRect(10, 10, canvas.width - 20, canvas.height - 20)

      // 文字
      ctx.font = `50pt Arial`
      ctx.fillStyle = 'black'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      ctx.fillText(text, canvas.width / 2, canvas.height / 2)
      return canvas
    },
    createMesh () {
      // var canvas1 = this.setCanvasContent('face1')
      // var texture1 = new THREE.CanvasTexture(canvas1)

      var textures = []
      var materials = []
      for (let i = 0; i < 6; i++) {
        let cv = this.setCanvasContent(i)
        textures.push(new THREE.CanvasTexture(cv))
        materials.push(new THREE.MeshStandardMaterial({map: textures[i]}))
      }

      // var classGeo = new THREE.CircleBufferGeometry(1, 3)
      var classGeo = new THREE.BoxBufferGeometry(0.1, 0.1, 0.1)
      // var material = new THREE.MeshStandardMaterial({color: '#700000', roughness: 0.9, metalness: 0.6, transparent: true, opacity: 0.6, map: texture})
      // var material = new THREE.MeshStandardMaterial({color: '#700000', roughness: 0.9, metalness: 0.6})

      // var material = new THREE.MeshBasicMaterial({map: texture})
      // var material = new THREE.SpriteMaterial({map: texture, transparent: false})
      // var material = new newTHREE.MeshBasicMaterial({color: '#700000', side: 'THREE.DoubleSide'})
      var mesh = new THREE.Mesh(classGeo, materials)

      mesh.position.set(0, -0.5, 0)
      return mesh
    },
    createMeshTextureTest () {
      var texture = new THREE.TextureLoader().load('https://file.iviewui.com/iview-admin/login_bg.jpg')
      // var geo = new THREE.PlaneBufferGeometry(1, 1)
      var geo = new THREE.SphereGeometry(1, 20, 20)

      // var material = new THREE.MeshBasicMaterial({map: texture})
      // var material = new THREE.MeshStandardMaterial({color:'#ff0000', map: THREE.ImageUtils.loadTexture('https://file.iviewui.com/iview-admin/login_bg.jpg')})
      // var material = new THREE.MeshStandardMaterial({color:'#ff0000', map: THREE.ImageUtils.loadTexture('../assets/brick_diffuse.jpg')})
      var material = new THREE.MeshStandardMaterial({color: '#ff0000', map: THREE.ImageUtils.loadTexture(this.brickTexture)})

      var mesh = new THREE.Mesh(geo, material)
      mesh.position.set(1, -0.5, 0)
      return mesh
    },
    createPointSystem () {
      let controls = new function () {
        this.size = 4
        this.transparent = true
        this.opacity = 0.6
        this.vertexColors = true
        this.color = 0xffffff
        this.sizeAttenuation = true
        this.rotateSystem = true
      }()

      let geo = new THREE.Geometry()
      var material = new THREE.PointCloudMaterial({
        size: controls.size,
        transparent: controls.transparent,
        opacity: controls.opacity,
        vertexColors: controls.vertexColors,
        sizeAttenuation: controls.sizeAttenuation,
        color: controls.color
      })


    },
    createRenderer () {
      this.renderer = new THREE.WebGLRenderer({ antialias: true })
      this.renderer.setSize(window.innerWidth, window.innerHeight)
      const container = document.getElementById('container')
      container.appendChild(this.renderer.domElement)

      // this.renderer.render(this.scene, this.camera)
    },
    animate () {
      requestAnimationFrame(this.animate)
      // // this.mesh.rotation.x += 0.01
      // this.mesh.rotation.y -= 0.01

      this.renderer.render(this.scene, this.camera)
    },
    getParticles () {
      this.$store.dispatch('GetProductNode').then(data => {
        console.log(this.products)
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
