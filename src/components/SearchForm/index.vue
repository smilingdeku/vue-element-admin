<template>
  <el-form :label-width="labelWidth" label-position="right" size="small">
    <el-container class="filter-container">
      <el-row ref="target" type="flex">
        <slot />
        <div class="filter-button-group">
          <el-button type="primary" size="small" @click="$emit('query')">查 询</el-button>
          <el-button v-if="$slots.default" size="small" @click="$emit('reset')">重 置</el-button>
        </div>
      </el-row>
    </el-container>
  </el-form>
</template>

<script>
export default {
  name: 'SearchForm',
  props: {
    labelWidth: {
      type: String,
      default: '70px'
    }
  }
}
</script>
<style scoped>
</style>
