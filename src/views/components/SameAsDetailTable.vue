<template>
  <div>
  <el-table
    :data="tableData"
    style="width: 100%"
    height="250">
    <el-table-column
      fixed
      prop="name"
      label="合同号"
      width="80">
    </el-table-column>
    <el-table-column
      prop="partyAName"
      label="甲方"
      width="120">
    </el-table-column>
    <el-table-column
      prop="partyBName"
      label="乙方"
      width="120">
    </el-table-column>
    <el-table-column
      prop="amount"
      label="金额"
      width="120">
    </el-table-column>
    <el-table-column
      prop="startTime"
      label="起始时间"
      width="300">
    </el-table-column>
    <el-table-column
      prop="endTime"
      label="结束时间"
      width="120">
    </el-table-column>
  </el-table>
  <el-button type="primary" icon="el-icon-edit" circle></el-button>
  <el-button type="info" icon="el-icon-delete" circle></el-button>
  </div>
</template>

<script>
const tableData = [{
  'name': '1009',
  'partyAName': '锐迪科微电子（上海）有限公司',
  'partyBName': '中芯国际集成电路制造（上海）有限公司',
  'amount': '99456.97',
  'startTime': '2017-10-27 06:10:18',
  'endTime': '2019-09-18 15:16:49',
  'location': '张江',
  'type': '0',
  'symbolSize': 20,
  'category': 1
}, {
  'name': '#2011',
  'partyAName': '锐迪科微电子（上海）有限公司',
  'partyBName': '中芯国际集成电路制造（上海）有限公司',
  'amount': '99456.97',
  'startTime': '2017-10-27 06:10:18',
  'endTime': '2019-09-18 15:16:49',
  'location': '张江',
  'type': '0',
  'symbolSize': 20,
  'category': 1
}]

export default {
  name: 'SameAsDetailTable',
  data () {
    return {
      tableData
    }
  }
}
</script>

<style scoped>

</style>
