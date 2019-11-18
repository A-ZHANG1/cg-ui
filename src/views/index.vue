<template>
  <div>
    <el-row>
      <el-col :span="18">
        <div style="background:#1f2d3d;height:60px">合同</div>
      </el-col>
      <el-col span="6">
        <el-menu :default-active="$route.parth"
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

    <el-row >
      <el-col :span='2'>
        <el-button plain @click="$showLayer">概念结构分层布局</el-button>
      </el-col>
    </el-row>

    <el-row >
      <el-col :span='2'>
        <el-button plain @click="$showProductLayer">产品贴字</el-button>
      </el-col>
    </el-row>

    <el-row >
      <el-col :span='2'>
        <el-button plain @click="$playControls">类节点贴字</el-button>
      </el-col>
    </el-row>

    <el-row >
      <el-col :span='2'>
        <el-button plain @click="$d3Layout">D3Force2D布局</el-button>
      </el-col>
    </el-row>

    <el-row >
      <el-col :span='2'>
        <el-button plain @click="$d3demo">D3Demo</el-button>
      </el-col>
    </el-row>

    <el-row >
      <el-col :span='2'>
        <el-button plain @click="$d33DFake">D3Force3D实例分层布局</el-button>
      </el-col>
    </el-row>

    <el-row >
      <el-col :span='2'>
        <el-button plain @click="$dagreSchema">Dagre实现概念层布局</el-button>
      </el-col>
    </el-row>

    <el-row >
      <el-col :span='2'>
        <el-button plain @click="$user">1. 用户-模型查看页面</el-button>
      </el-col>
    </el-row>

    <el-row >
      <el-col :span='2'>
        <el-button plain @click="$user">2. 数据分析师-表单上传页面</el-button>
      </el-col>
    </el-row>

    <el-row >
      <el-col :span='2'>
        <el-button plain @click="$knowledgeEngineerView">3. 知识工程师-实体融合页面</el-button>
      </el-col>
    </el-row>

    <el-row >
      <el-col :span='2'>
        <el-button plain @click="$user">4. 平台业务人员-规则定义，反馈修改</el-button>
      </el-col>
    </el-row>


    <el-row>
      <div style="margin:0px 0px 20px 110px;padding:0;width:820px;height:0px;background-color:lightGrey;overflow:hidden;"></div>
    </el-row>

  </div>
</template>

<script>
import ForceGraph from '@/views/ForceGraph'
import SubGraph from '@/views/SubGraph'
import Layer3D from '@/views/Layer3D'
import OrbitControls from '@/views/OrbitControls'
import {mapState} from 'vuex'

export default {
  components: {
    ForceGraph,
    SubGraph,
    Layer3D,
    OrbitControls
  },
  data () {
    return {
    }
  },
  computed: mapState({

  }),
  mounted () {

  },
  methods: {
    handleSelect (key, keyPath) {
      console.log(key, keyPath)
    },
    $showLayer () {
      this.$router.push({
        name: 'layer3D'
        // params: {
        //   id: this.companyInfo.id,
        //   companyName: this.companyInfo.companyName
        // }
      })
    },
    $showProductLayer () {
      this.$router.push({
        name: 'layer3DAll'
      })
    },
    $playControls () {
      this.$router.push({
        name: 'orbitControls'
      })
    },
    $d3Layout () {
      this.$router.push({
        name: 'd3Layout'
      })
    },
    $d3demo () {
      this.$router.push({
        name: 'd3Force'
      })
    },
    $d33DFake () {
      this.$router.push({
        name: 'd33DFake'
      })
    },
    $dagreSchema () {
      this.$router.push({
        name: 'dagreSchema'
      })
    },
    $user () {
      this.$router.push({
        name: 'forceGraph'
      })
    },
    $knowledgeEngineerView () {
      this.$router.push({
        name: 'knowledgeEngineer'
      })
    }
  }
}
</script>
