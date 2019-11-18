
<template>
  <div>
    <el-row>
      <el-col :span=10>
        <SingleViewLeft :graphData = 'subGrpah1'/>
      </el-col>

      <el-col :offset=1 :span=10>
        <SingleViewRight/>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span=10>
        <ViewMerging/>
      </el-col>
      <el-col :offset=1 :span=10>
        <SameAsDetailTable/>
      </el-col>
    </el-row>

    <el-row>
      <el-button  @click="dialogVisible = true">New Knowledge</el-button>
      <el-button  @click="dialogVisible = true">Append Knowledge</el-button>
    </el-row>

    <el-dialog
      title="New Knowledge"
      :visible.sync="dialogVisible"
      width="30%">
      <el-form :model="entity" label-width="100px">
        <el-form-item label="EntityName">
          <el-input v-model="entity.name"></el-input>
        </el-form-item>
        <el-form-item label="Type">
          <el-radio-group v-model="entity.type">
            <el-radio label="SupplyChain"></el-radio>
            <el-radio label="Company"></el-radio>
            <el-radio label="Order"></el-radio>
            <el-radio label="Product"></el-radio>
          </el-radio-group>        </el-form-item>
        <el-form-item label="Source">
          <el-input v-model="entity.source"></el-input>
        </el-form-item>
        <el-form-item label="Properties">
          <el-input v-model="entity.properties"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
    </el-dialog>

  </div>
</template>

<script>

  import ViewMerging from './components/ViewMerging'
  import SingleViewLeft from './components/SingleViewLeft'
  import SingleViewRight from './components/SingleViewRight'
  import SameAsDetailTable from './components/SameAsDetailTable'
  import { ViewPoint1 } from '@/assets/kg.js'
  import {subGraph1} from '../assets/kg'

  // alignment/ 对齐/ 共指消解/ 同义不同名 -- SameAs
  export default {
    name: 'KnowlEngineerConflict'
    components: {
      SingleViewLeft,
      SingleViewRight,
      ViewMerging,
      SameAsDetailTable
    },
    data () {
      return {
        dialogVisible: false,
        entity: {
          name: '',
          type: '',
          source: '',
          properties: ''
        }
      },
        subGraph1: {
        nodes:
        li
      }
    },
    methods: {
      // initChart () {
      //   let chart = echarts.init(document.getElementById('myChart'), 'macarons')
      //   chart.setOption({
      //     toolbox: {
      //       show: true,
      //       feature: {
      //         dataView: {
      //           show: true,
      //           readOnly: true
      //         },
      //         restore: {
      //           show: true
      //         },
      //         saveAsImage: {
      //           show: true
      //         }
      //       }
      //     },
      //     animationDuration: 1500,
      //     animationEasingUpdate: 'quinticInOut',
      //     legend: [{
      //       data: categories,
      //       selected: {
      //         'SemanticRelation': false
      //       }
      //     }],
      //     tooltip: [{ show: 'true' }],
      //     series: [{
      //       name: '关联企业',
      //       type: 'graph',
      //       layout: 'force',
      //       height: 700,
      //       force: {
      //         repulsion: 3000,
      //         edgeLength: 50
      //       },
      //       categories: [
      //         {
      //           name: 'Company',
      //           itemStyle: {
      //             normal: {
      //               color: '#1f2d3d',
      //               borderColor: '#fff',
      //               borderWidth: 1,
      //               shadowBlur: 10,
      //               shadowColor: 'rgba(0, 0, 0, 0.3)'
      //             }
      //           }
      //         },
      //         {
      //           name: 'Order',
      //           itemStyle: {
      //             normal: {
      //               color: '#f9a100',
      //               borderColor: '#fff',
      //               borderWidth: 1,
      //               shadowBlur: 10,
      //               shadowColor: 'rgba(0, 0, 0, 0.3)'
      //             }
      //           }
      //         },
      //         {
      //           name: 'SemanticRelation',
      //           itemStyle: {
      //             normal: {
      //               color: '#99a1ff',
      //               borderColor: '#fff',
      //               borderWidth: 1,
      //               shadowBlur: 10,
      //               shadowColor: 'rgba(0, 0, 0, 0.3)'
      //             }
      //           }
      //         }
      //       ],
      //       // data: this.nodes,
      //       // links: this.links,
      //       // data: [{name: '克拉拉-乔布斯', value: 3}, {name: '劳伦-鲍威尔', value: 7}],
      //       data: company.concat(contract).concat(SameAsRel),
      //       // links: [{source: '克拉拉-乔布斯', target: '劳伦-鲍威尔'}],
      //       links: CapitalFlowLink.concat(SameAsLink),
      //       edgeSymbol: ['circle', 'arrow'],
      //       edgeSymbolSize: [0, 10],
      //       focusNodeAdjacency: true,
      //       roam: true,
      //       label: {
      //         normal: {
      //           show: true,
      //           position: 'top',
      //           textStyle: {
      //             fontSize: 16
      //           }
      //         }
      //       },
      //       lineStyle: {
      //         normal: {
      //           curveness: 0,
      //           type: 'solid'
      //         },
      //         formatter: '{b}'
      //       },
      //       edgeLabel: {
      //         normal: {
      //           show: false,
      //           textStyle: {
      //             fontSize: 10
      //           }
      //         },
      //         formatter: '{c}'
      //       }
      //     }]
      //   })
      // }
    }
  }
</script>

<style scoped>

</style>
