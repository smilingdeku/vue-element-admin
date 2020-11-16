<template>
  <div class="app-container">
    <el-container>
      <el-header style="display: flex;">
        <div class="filter-container" style="flex: 1;">
          <el-form>
            <el-form-item class="filter-item">
              <el-input v-model="queryParams.username" placeholder="请输入用户名" clearable />
            </el-form-item>
            <el-button size="small" type="primary" @click="query">查 询</el-button>
            <el-button size="small" @click="reset">重 置</el-button>
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
          :total="total"
          :page.sync="queryParams.pageIndex"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-footer>
    </el-container>
    <el-dialog :visible.sync="openEdit" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="form.username" :disabled="form.id" placeholder="请输入用户名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="!form.id" label="密码" prop="password">
              <el-input v-model="form.password" type="password" placeholder="请输入密码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名" prop="=realName">
              <el-input v-model="form.realName" placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="=email">
              <el-input v-model="form.email" placeholder="请输入邮箱" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="=phone">
              <el-input v-model="form.phone" placeholder="请输联系电话" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="=memo">
              <el-input v-model="form.memo" placeholder="请输联系备注" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="item in statusList"
                  :key="item.value"
                  :label="item.value"
                >{{ item.key }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer">
        <el-button type="primary" small @click="submitForm">确 定</el-button>
        <el-button small @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
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
        username: '',
        pageIndex: 1,
        pageSize: 10
      },
      openEdit: false,
      form: {},
      rules: {},
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
      this.loading = true
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
    reset() {
      this.queryParams = {
        pageIndex: 1,
        pageSize: 10
      }
      this.getList()
    },
    handleEdit(row) {
      this.openEdit = true
      this.form = row
    },
    handleDelete(row) {
      console.log(row)
    },
    submitForm() {

    },
    cancel() {
      this.openEdit = false
    },
    transStatus(val) {
      switch (val) {
        case 0:
          return '禁用'
        case 1:
          return '有效'
      }
    }
  }
}
</script>

<style scoped></style>
