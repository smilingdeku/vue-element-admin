<template>
  <div class="app-container">
    <el-container>
      <el-header style="display: flex;">
        <div class="filter-container" style="flex: 1;">
          <el-form ref="queryForm">
            <el-form-item class="filter-item">
              <el-input v-model="queryParams.keyword" placeholder="请输入任务名称" clearable />
            </el-form-item>
            <el-form-item class="filter-item">
              <el-input v-model="queryParams.beanName" placeholder="beanName" clearable />
            </el-form-item>
            <el-button size="small" type="primary" @click="query">查 询</el-button>
            <el-button size="small" @click="resetQueryForm">重 置</el-button>
          </el-form>
        </div>
        <div class="action-container">
          <el-button
            class="action-item"
            size="small"
            type="primary"
            @click="handleAdd"
          >添 加</el-button>
          <el-button
            class="action-item"
            size="small"
            type="danger"
            @click="handleBatchDelete"
          >删 除</el-button>
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
          >
            <el-table-column :reserve-selection="true" type="selection" width="50" />
            <el-table-column align="center" prop="name" label="任务名称" show-overflow-tooltip />
            <el-table-column align="center" prop="group" label="任务组" show-overflow-tooltip />
            <el-table-column
              align="center"
              prop="beanName"
              label="Bean 名称"
              show-overflow-tooltip
            />
            <el-table-column align="center" prop="params" label="参数" show-overflow-tooltip />
            <el-table-column align="center" prop="cron" label="Cron 表达式" show-overflow-tooltip />
            <el-table-column align="center" prop="allowConcurrent" label="允许并发">
              <template slot-scope="{ row }">
                {{ row.allowConcurrent ? '允许' : '不允许' }}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="misfirePolicy"
              label="任务策略"
              show-overflow-tooltip
            >
              <template slot-scope="{ row }">
                {{ transMissfirePolicy(row.misfirePolicy) }}
              </template>
            </el-table-column>
            <el-table-column align="center" prop="status" label="状态">
              <template slot-scope="{ row }">
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
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入名称" />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="Bean" prop="beanName">
              <el-input v-model="form.beanName" placeholder="bean名称" />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="cron" prop="cron">
              <el-input v-model="form.cron" placeholder="cron表达式" />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="参数" prop="params">
              <el-input v-model="form.params" placeholder="任务参数" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="组别" prop="group">
              <el-select v-model="form.group" clearable placeholder="请选择类型">
                <el-option
                  v-for="item in groupOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="策略" prop="misfirePolicy">
              <el-select v-model="form.misfirePolicy" clearable placeholder="请选择策略">
                <el-option
                  v-for="item in misfirePolicyOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="并发" prop="allowConcurrent">
              <el-select v-model="form.allowConcurrent" clearable placeholder="状态">
                <el-option
                  v-for="item in allowConcurrentOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-select v-model="form.status" clearable placeholder="状态">
                <el-option
                  v-for="item in statusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer">
        <el-button
          v-permission="['monitor:schedule-job']"
          type="primary"
          small
          @click="submitForm"
        >确 定</el-button>
        <el-button small @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { page, get, save, update, del } from '@/api/system/schedule-job'
import permission from '@/directive/permission/index.js'
import Pagination from '@/components/Pagination'

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
      dialogVisible: false,
      loading: false,
      tableKey: 0,
      ids: [],
      list: [],
      total: 0,
      queryParams: {
        keyword: '',
        beanName: '',
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
      ],
      form: {
        id: undefined
      },
      rules: {
        name: [{ required: true, message: '任务名称不能为空', trigger: 'blur' }],
        beanName: [{ required: true, message: 'bean不能为空', trigger: 'blur' }],
        cron: [{ required: true, message: '定时表达式不能为空', trigger: 'blur' }],
        status: [{ required: true, message: '状态不能为空', trigger: 'blur' }]
      },
      groupOptions: [{ value: 'DEFAULT', label: '默认组' }],
      misfirePolicyOptions: [
        { value: 0, label: '默认策略' },
        { value: 1, label: '由他去吧' },
        { value: 2, label: '忽略' },
        { value: 3, label: '重试' }
      ],
      allowConcurrentOptions: [
        { value: false, label: '不允许' },
        { value: true, label: '允许' }
      ],
      statusOptions: [
        { value: 0, label: '禁用' },
        { value: 1, label: '启用' }
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
    resetQueryForm() {
      this.queryParams.keyword = ''
    },
    query() {
      this.getList()
    },
    handleAdd() {
      this.resetForm()
      this.isSave = true
      this.dialogVisible = true
    },
    handleEdit(row) {
      this.resetForm()
      this.isSave = false
      this.dialogVisible = true
      get(row.id).then(res => {
        if (res.code === 0) {
          this.form = res.data
        }
      })
    },
    submitForm() {
      this.$refs['form'].validate(valid => {
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
      })
    },
    cancel() {
      this.dialogVisible = false
    },
    handleDelete(row) {
      del(row.id).then(res => {
        if (res.code === 0) {
          this.dialogVisible = false
          this.getList()
        }
      })
    },
    resetForm() {
      if (this.$refs['form']) {
        this.$refs['form'].resetFields()
      }
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
    transMissfirePolicy(val) {
      switch (val) {
        case 0:
          return '默认'
        case 1:
          return '由他去吧'
        case 2:
          return '忽略'
        case 3:
          return '重试'
      }
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
.el-table ::v-deep td {
  border-bottom: 0px solid #dfe6ec;
}
::v-deep .el-table::before {
  height: 0px;
}
</style>
