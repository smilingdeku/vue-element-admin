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
          <el-button v-permission="['system:role:add']" class="action-item" size="small" type="primary" @click="handleAdd">添 加</el-button>
          <el-button v-permission="['system:role:delete']" class="action-item" size="small" type="danger" @click="handleBatchDelete">删 除</el-button>
        </div>
      </el-header>
      <el-main>
        <el-card shadow="never">
          <el-table
            :key="tableKey"
            v-loading="loading"
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
              <template slot-scope="scope">
                <div class="operate-container">
                  <el-link v-permission="['system:role:edit']" class="operate-item" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-link>
                  <el-link v-permission="['system:role:delete']" class="operate-item" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-link>
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
    <el-dialog :visible.sync="dialogVisible" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="60px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="角色名" prop="name">
              <el-input v-model="form.name" placeholder="请输入角色名" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="memo">
              <el-input v-model="form.memo" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="权限">
              <el-tree
                ref="tree"
                :data="tree"
                :props="defaultProps"
                :default-expanded-keys="form.resourceIds"
                :default-checked-keys="form.resourceIds"
                check-strictly
                show-checkbox
                node-key="id"
                class="permission-tree"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer">
        <el-button v-permission="['system:role:add', 'system:role:edit']" type="primary" small @click="submitForm">确 定</el-button>
        <el-button small @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { page, getPermissions, get, save, update, del } from '@/api/system/role'
import Pagination from '@/components/Pagination'
import permission from '@/directive/permission/index.js'

export default {
  components: {
    Pagination
  },
  directives: { permission },
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
      },
      dialogVisible: false,
      isSave: true,
      form: {
        id: undefined,
        name: '',
        memo: '',
        resourceIds: []
      },
      rules: {},
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      tree: []
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
      this.loading = true
      page(this.queryParams).then(res => {
        this.list = res.data
        this.total = res.total
        setTimeout(() => {
          this.loading = false
        }, 1000)
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
    resetForm() {
      if (this.$refs['form']) {
        this.$refs['form'].resetFields()
      }
      this.form = {
        id: undefined,
        name: '',
        memo: '',
        resourceIds: []
      }
      this.tree = []
    },
    handleAdd() {
      this.resetForm()
      this.isSave = true
      getPermissions(0).then(res => {
        if (res.code === 0) {
          this.tree = res.data
          this.dialogVisible = true
        }
      })
    },
    handleBatchDelete() {
      del(this.ids).then(res => {
        if (res.code === 0) {
          this.getList()
        }
      })
    },
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
    },
    handleEdit(row) {
      this.resetForm()
      this.isSave = false
      get(row.id).then(res => {
        if (res.code === 0) {
          this.form = res.data
          this.form.resourceIds = []
        }
      })
      getPermissions(row.id).then(res => {
        if (res.code === 0) {
          this.tree = res.data
          this.findCheckedNodes(res.data)
          this.dialogVisible = true
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
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          debugger
          this.form.resourceIds = this.$refs['tree'].getCheckedKeys()
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
    findCheckedNodes(tree) {
      tree.forEach((item) => {
        if (item.hasPermission) {
          this.form.resourceIds.push(item.id)
        }
        if (item.children) {
          this.findCheckedNodes(item.children)
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
