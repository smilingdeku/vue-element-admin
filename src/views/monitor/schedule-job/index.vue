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
          <el-button class="action-item" size="small" type="primary" @click="handleAdd">添 加</el-button>
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
          >
            <el-table-column :reserve-selection="true" type="selection" width="50" />
            <el-table-column align="center" prop="name" label="任务名称" show-overflow-tooltip />
            <el-table-column align="center" prop="group" label="任务组" show-overflow-tooltip />
            <el-table-column align="center" prop="beanName" label="Bean 名称" show-overflow-tooltip />
            <el-table-column align="center" prop="params" label="参数" show-overflow-tooltip />
            <el-table-column align="center" prop="cron" label="Cron 表达式" show-overflow-tooltip />
            <el-table-column align="center" prop="allowConcurrent" label="允许并发">
              <template slot-scope="{row}">
                {{ row.allowConcurrent ? '允许' : '不允许' }}
              </template>
            </el-table-column>
            <el-table-column align="center" prop="misfirePolicy" label="任务策略" show-overflow-tooltip />
            <el-table-column align="center" prop="memo" label="备注" show-overflow-tooltip />
            <el-table-column align="center" prop="status" label="状态">
              <template slot-scope="{row}">
                <el-tag :type="row.status | statusFilter">
                  {{ transStatus(row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <!-- <el-table-column align="center" prop="createdAt" label="创建时间" show-overflow-tooltip sortable="custom" />
            <el-table-column align="center" prop="updatedAt" label="更新时间" show-overflow-tooltip sortable="custom">
              <template slot-scope="{row}">{{ row.updatedAt || '-' }}</template>
            </el-table-column> -->
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <div class="operate-container">
                  <el-link class="operate-item" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-link>
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
import { page } from '@/api/system/schedule-job'
import Pagination from '@/components/Pagination'

export default {
  components: {
    Pagination
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: 'danger',
        1: 'primary'
      }
      return statusMap[status]
    }
  },
  props: {},
  data() {
    return {
      loading: false,
      tableKey: 0,
      ids: [],
      list: [],
      total: '0',
      queryParams: {
        keyword: '',
        pageIndex: 1,
        pageSize: 10,
        orderField: undefined,
        isAsc: true
      },
      statusList: [
        {
          key: '启用',
          value: 1
        },
        {
          key: '禁用',
          value: 0
        }
      ]
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
      page(this.queryParams).then(res => {
        this.list = res.data
        this.total = Number(res.total)
      })
    },
    resetQueryForm() {},
    query() {},
    handleAdd() {},
    handleBatchDelete() {},
    transStatus(val) {
      switch (val) {
        case 0:
          return '禁用'
        case 1:
          return '启用'
      }
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
