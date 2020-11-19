<template>
  <div class="app-container">
    <el-container>
      <el-header style="display: flex;">
        <div class="filter-container" style="flex: 1;">
          <el-form ref="queryForm">
            <el-form-item class="filter-item">
              <el-input placeholder="请输入名称" clearable />
            </el-form-item>
            <el-button size="small" type="primary">查 询</el-button>
            <el-button size="small">重 置</el-button>
          </el-form>
        </div>
        <div class="action-container">
          <el-button
            class="action-item"
            size="small"
            type="primary"
            @click="handleAdd"
          >添 加</el-button>
          <!-- <el-button class="action-item" size="small" type="danger">删 除</el-button> -->
        </div>
      </el-header>
      <el-main>
        <el-table
          v-loading="loading"
          :data="list"
          row-key="id"
          :header-cell-style="{ fontWeight: 'bold' }"
          highlight-current-row
          :tree-props="{ children: 'children' }"
        >
          <!-- <el-table-column :reserve-selection="true" type="selection" width="50" /> -->
          <el-table-column align="center" label="名称">
            <template slot-scope="{ row }">
              <span :class="row.icon">{{ row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="type" label="类型">
            <template slot-scope="{ row }">
              {{ transType(row.type) }}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="path" label="路径" />
          <el-table-column align="center" prop="component" label="组件" />
          <el-table-column align="center" prop="permission" label="权限" />
          <el-table-column align="center" prop="sortNumber" label="序号" />
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <div class="operate-container">
                <el-link
                  class="operate-item"
                  icon="el-icon-edit"
                  @click="handleEdit(scope.row)"
                >编辑</el-link>
                <el-link
                  class="operate-item"
                  icon="el-icon-delete"
                  @click="handleDelete(scope.row)"
                >删除</el-link>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
    <el-dialog :visible.sync="dialogVisible" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="父级资源" prop="parentName">
              <el-select
                ref="resourceSelect"
                v-model="form.parentId"
                placeholder="请选择父级资源"
                clearable
                @clear="handleSelectClear"
              >
                <el-option key="parentId" hidden :value="form.parentId" :label="form.parentName" />
                <el-tree
                  :data="list"
                  :props="defaultProps"
                  :expand-on-click-node="false"
                  :check-on-click-node="true"
                  default-expand-all
                  @node-click="handleNodeClick"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="类型" prop="type">
              <el-select v-model="form.type" clearable placeholder="请选择类型">
                <el-option
                  v-for="item in typeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入名称" />
            </el-form-item>
          </el-col>
          <el-col v-if="form.type === 1" :span="12">
            <el-form-item label="图标" prop="icon">
              <el-input v-model="form.icon" placeholder="请选择图标" />
            </el-form-item>
          </el-col>
          <el-col v-if="form.type === 1" :span="12">
            <el-form-item label="路径" prop="path">
              <el-input v-model="form.path" placeholder="请输入路径" />
            </el-form-item>
          </el-col>
          <el-col v-if="form.type === 1" :span="12">
            <el-form-item label="组件" prop="component">
              <el-input v-model="form.component" placeholder="请输入组件名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="权限" prop="permission">
              <el-input v-model="form.permission" placeholder="请输入权限" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="序号" prop="sortNumber">
              <el-input-number v-model="form.sortNumber" controls-position="right" :min="0" />
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
import { list } from '@/api/system/resource'

export default {
  components: {},
  filters: {
    typeFilter(type) {
      const typeMap = {
        1: 'primary',
        2: 'warning'
      }
      return typeMap[type]
    }
  },
  props: {},
  data() {
    return {
      loading: false,
      dialogVisible: false,
      list: [],
      form: {
        id: undefined,
        parentId: undefined,
        parentName: '',
        name: '',
        type: 1,
        icon: '',
        path: '',
        component: '',
        permission: '',
        sortNumber: 0
      },
      rules: {},
      typeOptions: [
        {
          value: 1,
          label: '菜单'
        },
        {
          value: 2,
          label: '按钮'
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'name'
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
      list().then(res => {
        if (res.code === 0) {
          this.list = res.data
          setTimeout(() => {
            this.loading = false
          }, 1000)
        }
      })
    },
    resetForm() {
      if (this.$refs['form']) {
        this.$refs['form'].resetFields()
      }
      this.form = {
        id: undefined,
        parentId: undefined,
        parentName: '',
        name: '',
        type: 1,
        icon: '',
        path: '',
        component: '',
        permission: '',
        sortNumber: 0
      }
    },
    handleAdd() {
      this.resetForm()
      this.dialogVisible = true
    },
    handleEdit(row) {},
    handleDelete(row) {},
    submitForm() {},
    cancel() {
      this.dialogVisible = false
    },
    handleNodeClick(data) {
      this.form.parentName = data.name
      this.form.parentId = data.id
      this.$refs.resourceSelect.blur()
    },
    handleSelectClear() {
      this.form.parentId = undefined
      this.form.parentName = ''
    },
    transType(val) {
      switch (val) {
        case 1:
          return '菜单'
        case 2:
          return '按钮'
      }
    }
  }
}
</script>

<style scoped></style>
