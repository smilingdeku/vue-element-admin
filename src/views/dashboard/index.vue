<template>
  <div class="dashboard-container">
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="6">
        <el-card class="box-card">
          <div slot="header">
            系统信息
            <!-- <el-button style="float: right; padding: 3px 0" type="text">刷新</el-button> -->
          </div>
          <div class="text-item">
            <svg-icon icon-class="ip" style="font-size: 20px;" /> <span>主机地址： {{ server.hostAddress }} </span>
          </div>
          <div class="text-item">
            <svg-icon icon-class="time" style="font-size: 20px;" /> <span>服务器时间：{{ server.time }}</span>
          </div>
          <div class="text-item">
            <svg-icon icon-class="date" style="font-size: 20px;" /> <span>已运行时间：{{ server.uptime }}</span>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="6">
        <el-card class="box-card">
          <div slot="header">
            硬件参数
          </div>
          <div class="text-item">
            <svg-icon icon-class="cpu" style="font-size: 20px;" /> <span>CPU 核心数：{{ server.coreNum }}</span>
          </div>
          <div class="text-item">
            <svg-icon icon-class="memory" style="font-size: 20px;" /> <span>内存：{{ server.memory }}</span>
          </div>
          <div class="text-item">
            <svg-icon icon-class="storage" style="font-size: 20px;" /> <span>存储空间：{{ server.storage }}</span>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="4">
        <el-card class="box-card">
          <dashboard :data="cpu" />
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="4">
        <el-card class="box-card">
          <dashboard :data="memory" />
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="4">
        <el-card class="box-card">
          <dashboard :data="disk" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Dashboard from './component/Dashboard'
import { info } from '@/api/system/server'

export default {
  name: 'Index',
  components: {
    Dashboard
  },
  data() {
    return {
      timer: undefined,
      server: {
        hostAddress: '',
        time: '',
        uptime: '',
        coreNum: '',
        memory: '',
        storage: ''
      },
      cpu: {
        value: 0,
        name: 'CPU 使用率'
      },
      memory: {
        value: 0,
        name: '内存使用率'
      },
      disk: {
        value: 0,
        name: '最大分区使用率'
      }
    }
  },
  computed: {
  },
  created() {
    this.getInfo()
    this.timer = setInterval(this.getInfo, 15 * 1000)
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    getInfo() {
      console.log('test..')
      info().then(res => {
        if (res.code === 0) {
          this.server = res.data
          this.cpu.value = this.server.cpuUsage
          this.memory.value = this.server.memoryUsage
          this.disk.value = this.server.maxSizePartitionUsage
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 32px;
  // background-color: rgb(240, 242, 245);
  position: relative;

  .box-card {
    font-size: 14px;
    background: #fff;
    // padding: 16px 16px 0;
    margin-bottom: 32px;
    height: 200px;
    .text-item {
      line-height: 32px;
    }
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
