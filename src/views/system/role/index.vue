<template>
  <div class="app-container">
    <el-container>
      <el-header style="display: flex;">
        <div class="filter-container" style="flex: 1;">
          <el-form ref="queryForm">
            <el-form-item class="filter-item">
              <el-input v-model="queryParams.name" placeholder="请输入角色名" clearable />
            </el-form-item>
            <el-button size="small" type="primary" @click="query">查 询</el-button>
            <el-button size="small" @click="resetQueryForm">重 置</el-button>
          </el-form>
        </div>
        <div class="action-container">
          <el-button class="action-item" size="small" type="primary" @click="handleNew">新 建</el-button>
          <el-button class="action-item" size="small" type="danger" @click="handleBatchDelete">删 除</el-button>
        </div>
      </el-header>
      <el-mian>
        <el-table
          :key="tableKey"
          :table-loading="loading"
          :row-key="row => row.id"
          :data="list"
          :header-cell-style="{ fontWeight: 'bold' }"
          highlight-current-row
          @selection-change="handleSelectionChange"
        >
          <el-table-column align="center" :reserve-selection="true" type="selection" width="50" />
          <el-table-column align="center" prop="name" label="角色名" show-overflow-tooltip />
          <el-table-column align="center" prop="memo" label="备注" show-overflow-tooltip />
          <el-table-column align="center" label="操作">
            <!-- <template slot-scope="scope"> -->
            <template>
              <div class="operate-container">
                <el-link class="operate-item" icon="el-icon-edit">编辑</el-link>
                <el-link class="operate-item" icon="el-icon-delete">删除</el-link>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-mian>
      <el-footer>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageIndex"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-footer>

    </el-container>
  </div>
</template>

<script>
import { page } from '@/api/system/role'

export default {
  components: {},
  props: {},
  data() {
    return {
      loading: false,
      tableKey: 0,
      ids: [],
      list: [],
      total: 0,
      queryParams: {
        name: '',
        pageIndex: 1,
        pageSize: 10
      }
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getList()
  },
  mounted() {
  },
  methods: {
    getList() {
      page(this.queryParams).then(res => {
        this.list = res.data
        this.total = res.total
        setTimeout(() => {
          this.loading = false
        }, 1500)
      })
    },
    query() {
      this.getList()
    },
    resetQueryForm() {
      if (this.$refs['queryForm']) {
        this.$refs['queryForm'].resetFields()
      }
      this.queryParams = {
        name: undefined,
        pageIndex: 1,
        pageSize: 10
      }
      this.getList()
    },
    handleNew() {},
    handleBatchDelete() {},
    handleSelectionChange() {}
  }
}
</script>

<style scoped>

</style>
