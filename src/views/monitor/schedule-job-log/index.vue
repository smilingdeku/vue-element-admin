<template>
  <div class="app-container">
    <el-container>
      <el-header style="display: flex;">
        <div class="filter-container" style="flex: 1;">
          <el-form ref="queryForm">
            <el-form-item class="filter-item">
              <el-input v-model="queryParams.keyword" placeholder="请输入任务名称" clearable @keyup.enter.native="getList()" />
            </el-form-item>
            <el-button size="small" type="primary" @click="query">查 询</el-button>
            <el-button size="small" @click="resetQueryForm">重 置</el-button>
          </el-form>
        </div>
        <div class="action-container">
          <el-button class="action-item" size="small" type="danger" @click="handleBatchDelete">删 除</el-button>
        </div>
      </el-header>
      <el-main>
        <el-card shadow="never">
          <el-table
            ref="table"
            :key="tableKey"
            v-loading="loading"
            :row-key="row => row.id"
            :data="list"
            :header-cell-style="{ fontWeight: 'bold' }"
            highlight-current-row
            @sort-change="handleSortChange"
            @selection-change="handleSelectionChange"
          >
            <el-table-column align="center" :reserve-selection="true" type="selection" />
            <el-table-column type="expand" width="50">
              <template slot-scope="{row}">
                <span style="font-weight:bold;">消息记录：</span>
                <span>{{ row.message || "无" }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="jobName" label="任务名称" />
            <el-table-column align="center" prop="beanName" label="Bean 名称" show-overflow-tooltip />
            <el-table-column align="center" prop="params" label="参数" show-overflow-tooltip />
            <el-table-column align="center" prop="status" label="执行状态">
              <template slot-scope="{row}">
                <el-tag :type="row.status === 1 ? success : danger">
                  {{ row.status === 1 ? '成功' : '失败' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="spendTime" label="耗时">
              <template slot-scope="{row}">
                {{ row.spendTime + 'ms' }}
              </template>
            </el-table-column>
            <el-table-column align="center" prop="createdAt" label="创建时间" show-overflow-tooltip sortable="custom" />
            <el-table-column align="center" width="150px" label="操作">
              <template slot-scope="scope">
                <div class="operate-container">
                  <el-link class="operate-item" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-link>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-main>
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
import { page, del } from '@/api/system/schedule-job-log'
import Pagination from '@/components/Pagination'

export default {
  components: {
    Pagination
  },
  props: {},
  data() {
    return {
      loading: false,
      tableKey: 0,
      ids: [],
      list: [],
      total: 0,
      queryParams: {
        keyword: '',
        pageIndex: 1,
        pageSize: 10,
        orderField: undefined,
        isAsc: true
      }
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getList()
  },
  mounted() {},
  methods: {
    getList() {
      this.loading = true
      page(this.queryParams).then(res => {
        this.list = res.data
        this.total = Number(res.total)
        setTimeout(() => {
          this.loading = false
        }, 1000)
      })
    },
    resetQueryForm() {
      if (this.$refs['queryForm']) {
        this.$refs['queryForm'].resetFields()
      }
      this.$refs['table'].clearSort()
      this.queryParams = {
        keyword: undefined,
        pageIndex: 1,
        pageSize: 10,
        orderField: undefined,
        isAsc: true
      }
      this.getList()
    },
    query() {
      this.getList()
    },
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
    },
    handleBatchDelete() {
      del(this.ids).then(res => {
        if (res.code === 0) {
          this.getList()
        }
      })
    },
    handleSortChange(val) {
      this.queryParams.orderField = val.prop
      this.queryParams.isAsc = val.order !== 'descending'
      this.getList()
    },
    handleDelete(row) {
      del(row.id).then(res => {
        if (res.code === 0) {
          this.getList()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-table ::v-deep td {
  border-bottom: 0px solid #dfe6ec;
}
::v-deep .el-table::before {
  height: 0px;
}
</style>
