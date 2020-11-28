<template>
  <div class="app-container">
    <el-container>
      <el-header style="display: flex;">
        <div class="filter-container" style="flex: 1;">
          <el-form ref="queryForm">
            <el-form-item class="filter-item">
              <el-input v-model="queryParams.keyword" placeholder="请输入用户名" clearable @keyup.enter.native="getList()" />
            </el-form-item>
            <el-button size="small" type="primary" @click="query">查 询</el-button>
            <el-button size="small" @click="resetQueryForm">重 置</el-button>
          </el-form>
        </div>
        <div class="action-container">
          <el-button v-permission="['system:user:add']" class="action-item" size="small" type="primary" @click="handleAdd">添 加</el-button>
          <el-button v-permission="['system:user:delete']" class="action-item" size="small" type="danger" @click="handleBatchDelete">删 除</el-button>
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
            @selection-change="handleSelectionChange"
            @sort-change="handleSortChange"
          >
            <el-table-column :reserve-selection="true" type="selection" width="50" />
            <el-table-column align="center" prop="username" label="用户名" show-overflow-tooltip />
            <el-table-column align="center" prop="realName" label="姓名" show-overflow-tooltip />
            <el-table-column align="center" prop="avatar" label="头像" show-overflow-tooltip>
              <template slot-scope="{row}">
                <el-avatar shape="square" :src="row.avatar" />
              </template>
            </el-table-column>
            <el-table-column align="center" prop="email" label="邮箱" show-overflow-tooltip />
            <el-table-column align="center" prop="phone" label="联系电话" show-overflow-tooltip />
            <el-table-column align="center" prop="memo" label="备注" show-overflow-tooltip />
            <el-table-column align="center" prop="status" label="状态">
              <template slot-scope="{row}">
                <el-tag :type="row.status | statusFilter">
                  {{ transStatus(row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="createdAt" label="创建时间" show-overflow-tooltip sortable="custom" />
            <el-table-column align="center" prop="updatedAt" label="更新时间" show-overflow-tooltip sortable="custom">
              <template slot-scope="{row}">{{ row.updatedAt || '-' }}</template>
            </el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <div class="operate-container">
                  <el-link v-permission="['system:user:edit']" class="operate-item" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-link>
                  <el-link v-permission="['system:user:delete']" class="operate-item" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-link>
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
    <el-dialog :visible.sync="dialogVisible" width="600px" :close-on-click-modal="false" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="form.username" :disabled="form.id !== undefined" placeholder="请输入用户名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="密码" prop="password">
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
            <el-form-item label="角色" prop="=roleIds">
              <el-select v-model="form.roleIds" class="select" clearable multiple placeholder="请选择角色" @change="selectChange">
                <el-option
                  v-for="item in roles"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
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
        <el-button v-permission="['system:user:add', 'system:user:edit']" type="primary" small @click="submitForm">确 定</el-button>
        <el-button small @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { page, del, save, get, update, getRoles } from '@/api/system/user'
import { list } from '@/api/system/role'
import Pagination from '@/components/Pagination'
import permission from '@/directive/permission/index.js'

export default {
  components: {
    Pagination
  },
  directives: { permission },
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
      total: 0,
      queryParams: {
        keyword: '',
        pageIndex: 1,
        pageSize: 10,
        orderField: undefined,
        isAsc: true
      },
      dialogVisible: false,
      isSave: true,
      form: {
        id: undefined,
        username: '',
        password: '',
        realName: '',
        email: '',
        phone: '',
        memo: '',
        status: 1,
        roleIds: []
      },
      rules: {
        username: [
          { required: true, message: '用户名称不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      },
      roles: [],
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
    this.getRoleList()
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
    getRoleList() {
      list().then(res => {
        if (res.code === 0) {
          this.roles = res.data
        }
      })
    },
    query() {
      this.getList()
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
    resetForm() {
      if (this.$refs['form']) {
        this.$refs['form'].resetFields()
      }
      this.form = {
        id: undefined,
        username: '',
        password: '',
        realName: '',
        email: '',
        phone: '',
        memo: '',
        status: 1,
        roleIds: []
      }
    },
    handleAdd() {
      this.resetForm()
      this.isSave = true
      this.dialogVisible = true
    },
    handleBatchDelete() {
      del(this.ids).then(res => {
        if (res.code === 0) {
          this.getList()
        }
      })
    },
    handleEdit(row) {
      this.resetForm()
      this.isSave = false
      get(row.id).then(res => {
        if (res.code === 0) {
          this.form = res.data
          getRoles(row.id).then(res => {
            if (res.code === 0) {
              this.form.roleIds = res.data
              this.dialogVisible = true
            }
          })
        }
      })
    },
    handleDelete(row) {
      del(row.id).then(res => {
        if (res.code === 0) {
          this.getList()
        }
      })
    },
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
    },
    handleSortChange(val) {
      this.queryParams.orderField = val.prop
      this.queryParams.isAsc = val.order !== 'descending'
      this.getList()
    },
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.isSave) {
            save(this.form).then(res => {
              if (res.code === 0) {
                this.dialogVisible = false
                this.getList()
              }
            })
          } else {
            update(this.form).then(res => {
              if (res.code === 0) {
                this.dialogVisible = false
                this.getList()
              }
            })
          }
        }
      })
    },
    cancel() {
      this.dialogVisible = false
    },
    selectChange() {
      // 解决多选回显后无法编辑
      this.$forceUpdate()
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

<style lang="scss" scoped>
.select {
  width: 100%;
}
.el-table ::v-deep td {
  border-bottom: 0px solid #dfe6ec;
}
::v-deep .el-table::before {
  height: 0px;
}
</style>
