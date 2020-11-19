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
          <el-button class="action-item" size="small" type="primary">添 加</el-button>
          <!-- <el-button class="action-item" size="small" type="danger">删 除</el-button> -->
        </div>
      </el-header>
    </el-container>
    <el-main>
      <el-table
        v-loading="loading"
        :data="list"
        row-key="id"
        :header-cell-style="{ fontWeight: 'bold' }"
        highlight-current-row
        default-expand-all
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column align="center" label="名称">
          <template slot-scope="{row}">
            <span :class="row.icon">{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="type" label="类型">
          <template slot-scope="{row}">
            <el-tag :type="row.type | typeFilter">
              {{ transType(row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="path" label="路径" />
        <el-table-column align="center" prop="component" label="组件" />
        <el-table-column align="center" prop="permission" label="权限" />
        <el-table-column align="center" prop="sortNumber" label="序号" />
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <div class="operate-container">
              <el-link class="operate-item" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-link>
              <el-link class="operate-item" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-link>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
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
      list: []
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
    handleEdit(row) {},
    handleDelete(row) {},
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
