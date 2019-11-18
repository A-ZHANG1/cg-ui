import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('@/views/index')
    },
    {
      path: '/forceGraph',
      name: 'forceGraph',
      component: () => import('@/views/ForceGraph')
    },
    {
      path: '/layer3D',
      name: 'layer3D',
      component: () => import('@/views/Layer3D')
    },
    {
      path: '/layer3DAll',
      name: 'layer3DAll',
      component: () => import('@/views/Layer3DAll')
    },
    {
      path: '/orbitControls',
      name: 'orbitControls',
      component: () => import('@/views/OrbitControls')
    },
    {
      path: '/d3Layout',
      name: 'd3Layout',
      component: () => import('@/views/D3Layout')
    },
    {
      path: '/d3Force',
      name: 'd3Force',
      component: () => import('@/views/D3Force')
    },
    {
      path: '/d3Force',
      name: 'd3Force',
      component: () => import('@/views/D3Force')
    },
    {
      path: '/d33DFake',
      name: 'd33DFake',
      component: () => import('@/views/D33DFake')
    }, {
      path: '/dagreSchema',
      name: 'dagreSchema',
      component: () => import('@/views/Layer3DDagre')
    }, {
      path: '/subGraph',
      name: 'subGraph',
      component: () => import('@/views/SubGraph')
    },
    {
      path: '/contractUpload',
      name: 'contractUpload',
      component: () => import('@/views/contractUpload')
    },
    {
      path: '/knowledgeEngineer',
      name: 'knowledgeEngineer',
      component: () => import('@/views/knowledgeEngineer')
    }
  ]
})
