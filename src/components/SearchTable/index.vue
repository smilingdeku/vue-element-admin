<template>
  <el-container class="table-container">
    <el-header v-if="$slots.filter">
      <search-form
        ref="form"
        :label-width="labelWidth"
        @query="$emit('query')"
        @reset="$emit('reset')"
      >
        <template>
          <slot name="filter" /><!-- 搜索条件 & 按钮 -->
        </template>
      </search-form>
    </el-header>
    <el-main>
      <el-row v-if="$slots.actions" ref="actions">
        <el-col :span="24">
          <slot name="actions" /><!-- 操作按钮 -->
        </el-col>
      </el-row>
      <el-table
        ref="tableRef"
        v-loading="tableLoading"
        class="table"
        :height="tableHeight"
        :data="tableData"
        :empty-text="emptyText"
        stripe
        border
        highlight-current-row
        :row-class-name="rowClassName"
        tooltip-effect="light"
        :header-cell-style="{ fontWeight: 'bold' }"
        size="mini"
        :row-key="rowKeys"
        :default-sort="defaultSort"
        @sort-change="handleSortChange"
        @selection-change="
          selection => {
            this.$emit('selectionChange', selection)
          }
        "
        @select-all="
          selection => {
            this.$emit('selectAll', selection)
          }
        "
      >
        <slot />
      </el-table>
    </el-main>
    <el-footer v-if="$slots.footer" class="table-footer" height="42px">
      <slot name="footer" />
    </el-footer>
  </el-container>
</template>

<script>
import SearchForm from '@/components/SearchForm'

export default {
  name: 'SearchTable',
  components: { SearchForm },
  props: {
    labelWidth: {
      type: String,
      default: '70px'
    },
    tableData: {
      type: Array,
      default: () => []
    },
    emptyText: {
      type: String,
      default: ''
    },
    rowClassName: {
      type: Function,
      default: function() {}
    },
    rowKeys: {
      type: Function,
      default: function() {}
    },
    tableLoading: Boolean,
    defaultSort: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      // tableHeight: '600px' // table表格高度
    }
  },
  methods: {
    // 表格排序
    handleSortChange(event) {
      const { prop, order } = event
      this.$emit('sortChange', {
        prop,
        order: order ? String.prototype.replace.call(order, 'ending', '') : null
      })
    }
  }
}
</script>

<style scoped>
.table {
    margin-top: 10px;
}
</style>>
