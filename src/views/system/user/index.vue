<template>
  <div class="app-container">
    <search-table
      :ref="tableRef"
      :table-loading="loading"
      :table-data="tableData"
      :label-width="'40px'"
      :row-keys="row => row.id"
      @query="
        currentPage = 1
        query()
      "
      @reset="doReset"
      @selectionChange="selectionChange"
    >
      <template v-slot:filter>
        <el-form-item class="filter-item" label="姓名">
          <el-input v-model="searchForm.name" placeholder="请输入内容" clearable />
        </el-form-item>
        <el-form-item class="filter-item" label="年龄">
          <el-input v-model="searchForm.age" placeholder="请输入内容" clearable />
        </el-form-item>
        <el-form-item class="filter-item" label="性别">
          <el-select v-model="searchForm.gender" placeholder="请选择" clearable>
            <el-option :label="'运行中'" :value="0" />
          </el-select>
        </el-form-item>
      </template>
      <template v-slot:actions>
        <el-button size="small" type="primary">新 建</el-button>
        <el-button size="small" type="primary">批量删除</el-button>
        <el-button size="small" type="primary">批量导出</el-button>
      </template>
      <template>
        <el-table-column :reserve-selection="true" type="selection" width="50" />
        <el-table-column prop="username" label="用户名" show-overflow-tooltip />
        <el-table-column prop="realName" label="姓名" show-overflow-tooltip />
        <el-table-column prop="email" label="邮箱" show-overflow-tooltip />
        <el-table-column prop="time" label="创建时间" show-overflow-tooltip />
      </template>
      <template v-slot:footer>
        <el-pagination
          background
          :current-page="currentPage"
          :page-sizes="pageSizes"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange"
        />
      </template>
    </search-table>
  </div>
</template>

<script>
import SearchTable from '@/components/SearchTable'

export default {
  components: {
    SearchTable
  },
  props: {},
  data() {
    return {
      tableData: [],
      loading: false,
      tableRef: 'tableRef',
      searchForm: {},
      currentPage: 1,
      pageSizes: [10, 20, 50],
      pageSize: 10,
      total: 0
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    query() {
      // 请求表格数据
    },
    doReset() {
      // 重置搜索条件
    },
    selectionChange() {
      // 表格选项发生变化
    },
    handleSizeChange(val) {
      // 改变每页条数
    },
    handleCurrentChange(val) {
      // 切换页码
    }
  }
}
</script>

<style scoped></style>
