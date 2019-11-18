<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ this.nodeCategories }}</span>
      </div>
      <div id = 'singleViewLeft' :style="{width: '600px', height: '500px', float:'right'}"/>
    </el-card>
  </div>
</template>

<script>
// import { ViewPoint1, SubGraph1} from '@/assets/kg.js'
import echarts from 'echarts'
require('echarts/theme/macarons')

export default {
  name: 'SingleViewLeft',
  props: {
    nodes: Array,
    links: Array,
    nodeCategories: Array
  },
  data () {
    return {
    }
  },
  mounted () {
    console.log(this.nodes)
    this.initChart()
  },
  methods: {
    // $getSameAs () {
    //   this.initChart()
    // },
    initChart () {
      let chart = echarts.init(document.getElementById('singleViewLeft'), 'macarons')
      chart.setOption({
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
        animationDuration: 1500,
        animationEasingUpdate: 'quinticInOut',
        legend: [{
          data: this.nodeCategories,
          selected: {
            'SemanticRelation': false
          }
        }],
        tooltip: [{ show: 'true' }],
        series: [{
          name: '关联企业',
          type: 'graph',
          layout: 'force',
          height: 700,
          force: {
            repulsion: 3000,
            edgeLength: 50
          },
          categories: [
            {
              name: 'Company',
              itemStyle: {
                normal: {
                  color: '#1f2d3d',
                  borderColor: '#fff',
                  borderWidth: 1,
                  shadowBlur: 10,
                  shadowColor: 'rgba(0, 0, 0, 0.3)'
                }
              }
            },
            {
              name: 'Order',
              itemStyle: {
                normal: {
                  color: '#f9a100',
                  borderColor: '#fff',
                  borderWidth: 1,
                  shadowBlur: 10,
                  shadowColor: 'rgba(0, 0, 0, 0.3)'
                }
              }
            }
          ],
          // data: this.nodes,
          // links: this.links,\

          // data: [{name: '克拉拉-乔布斯', value: 3}, {name: '劳伦-鲍威尔', value: 7}],
          // links: [{source: '克拉拉-乔布斯', target: '劳伦-鲍威尔'}],
          //
          data: this.nodes,
          links: this.links,
          edgeSymbol: ['circle', 'arrow'],
          edgeSymbolSize: [0, 10],
          focusNodeAdjacency: true,
          roam: true,
          label: {
            normal: {
              show: true,
              position: 'top',
              textStyle: {
                fontSize: 16
              }
            }
          },
          lineStyle: {
            normal: {
              curveness: 0,
              type: 'solid'
            },
            formatter: '{b}'
          },
          edgeLabel: {
            normal: {
              show: false,
              textStyle: {
                fontSize: 10
              }
            },
            formatter: '{c}'
          }
        }]
      })
    }
  }
}
</script>

<style scoped>

</style>
