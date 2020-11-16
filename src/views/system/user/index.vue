<template>
  <div class="app-container">
    <el-container>
      <el-header style="display: flex;">
        <div class="filter-container" style="flex: 1;">
          <el-form>
            <el-form-item class="filter-item">
              <el-input placeholder="请输入内容" clearable />
            </el-form-item>
            <el-button size="small" type="primary">查 询</el-button>
            <el-button size="small" @click="$emit('reset')">重 置</el-button>
          </el-form>
        </div>
        <div class="action-container">
          <el-button class="action-item" size="small" type="primary">新 建</el-button>
          <el-button class="action-item" size="small" type="danger">删 除</el-button>
        </div>
      </el-header>
      <el-main>
        <el-table
          :key="tableKey"
          :table-loading="loading"
          :row-key="row => row.id"
          :data="list"
          :header-cell-style="{ fontWeight: 'bold' }"
          highlight-current-row
        >
          <el-table-column :reserve-selection="true" type="selection" width="50" />
          <el-table-column prop="username" label="用户名" show-overflow-tooltip />
          <el-table-column prop="realName" label="姓名" show-overflow-tooltip />
          <el-table-column prop="avatar" label="头像" show-overflow-tooltip>
            <template slot-scope="{row}">
              <el-avatar shape="square" :src="row.avatar" />
            </template>
          </el-table-column>
          <el-table-column prop="email" label="邮箱" show-overflow-tooltip />
          <el-table-column prop="phone" label="联系电话" show-overflow-tooltip />
          <el-table-column prop="memo" label="备注" show-overflow-tooltip />
          <el-table-column prop="status" label="状态">
            <template slot-scope="{row}">
              <el-tag :type="row.status | statusFilter">
                {{ transStatus(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <div class="operate-container">
                <el-link class="operate-item" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-link>
                <el-link class="operate-item" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-link>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer>
        <pagination
          v-show="total > 0"
          style="text-align: right; margin-top: 10px"
          small
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
import { page } from '@/api/user'
import Pagination from '@/components/Pagination'

export default {
  components: {
    Pagination
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: 'danger',
        1: 'success'
      }
      return statusMap[status]
    }
  },
  props: {},
  data() {
    return {
      loading: false,
      tableKey: 0,
      list: [],
      total: 0,
      queryParams: {
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
  mounted() {},
  methods: {
    getList() {
      this.loading = true
      page(this.queryParams).then(res => {
        this.list = res.data
        this.total = res.total

        setTimeout(() => {
          this.loading = false
        }, 1000)
      })
    },
    handleEdit(row) {
      console.log(row)
    },
    handleDelete(row) {
      console.log(row)
    },
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

<style scoped></style>
