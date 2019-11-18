<template>
  <div>
    <el-row>
      <el-col :span=10>
        <SingleViewLeft :nodes = "nodes" :links = "links" :nodeCategories = "nodeCategories"/>
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

// alignment/ 对齐/ 共指消解/ 同义不同名 -- SameAs
export default {
  name: 'knowledgeEngineer',
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
      },
      nodes: ViewPoint1.company.concat(ViewPoint1.contract),
      links: ViewPoint1.capitalFlowLink,
      nodeCategories: ViewPoint1.nodeCategories
    }
  },
  methods: {}

}
</script>

<style scoped>

</style>
