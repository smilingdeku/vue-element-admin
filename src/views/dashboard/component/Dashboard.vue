<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '200px'
    },
    data: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      chart: null
    }
  },
  computed: {},
  watch: {
    data: {
      handler(newVal, oldVal) {
        this.initChart()
      },
      deep: true
    }
  },
  created() {},
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      if (!this.chart) {
        this.chart = echarts.init(this.$el, 'macarons')
      } else {
        this.chart.clear()
      }
      this.chart.setOption({
        series: [
          {
            name: '性能指标',
            type: 'gauge',
            center: ['50%', '45%'],
            radius: '80%', // 仪表大小
            // startAngle: 200, //开始角度
            // endAngle: -20, //结束角度
            // min: 0,
            // max: 1000,
            data: [this.data],
            axisLine: {
              show: false,
              lineStyle: { // 属性lineStyle控制线条样式
                color: [
                  [0.8, '#27D9C8'],
                  [1, '#FF6F90']
                ],
                shadowColor: '#ccc',
                // shadowBlur: 25,
                width: 10
              }
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: false
            },
            pointer: {
              length: '70%',
              color: '#4A90E2'
            },
            title: {
              show: true,
              offsetCenter: [0, '70%'],
              color: '#333',
              fontSize: 12,
              backgroundColor: '#D8d8d8',
              borderRadius: 20,
              padding: 5
            },
            detail: {
              // show: false,
              formatter: '{value}%',
              fontStyle: 'small'
            }
          }
        ]
      })
    }
  }
}
</script>

<style scoped>

</style>
