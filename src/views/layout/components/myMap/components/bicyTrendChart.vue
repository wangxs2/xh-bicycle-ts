<template>
  <div class="bicy-trend-chart">
    <div class="trend-close iconfont icon-guanbi" @click="close"></div>
    <div class="trend-tit">{{params.name}} 数量-活跃率变化</div>
    <div ref="bicyActiveTrend" class="Chart"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Emit } from 'vue-property-decorator';
import echarts from 'echarts';
import { refinedCal } from '@/libs/util.ts';

interface PropData {
  activeRate: Array<string | number>;
  bicycleNum: Array<string | number>;
  date: string[];
  name: string;
  [propName: string]: any;
}

@Component
export default class BicyTrendChart extends Vue {
  @Prop()
  public params!: PropData;
  // 图表容器
  private chartNode: any = null;

  public mounted() {
    this.initChart();
    this.echartsOption();

    this.$Bus.$on('updateScreen', this.resizeEvent);
  }

  @Watch('params')
  public onchanged(val: PropData, oldVal: PropData) {
    this.echartsOption();
  }

  // 关闭弹窗 清除数据
  @Emit()
  public close() {
    //
  }

  public beforeDestroy() {
    this.chartNode.dispose();
    this.chartNode = null;
    window.removeEventListener('resize', this.resizeEvent);
    this.$Bus.$off('updateScreen', this.resizeEvent);
  }

  // 初始化图表
  private initChart(): void {
    const Cnode: any = this.$refs.bicyActiveTrend;
    this.chartNode = echarts.init(Cnode);

    window.addEventListener('resize', this.resizeEvent);
  }

  // 事件执行
  private resizeEvent() {
    this.chartNode.resize();
  }

  // 配置
  private echartsOption(): void {
    const option = {
      tooltip: {
        trigger: 'axis',
        formatter: '时间：{b0}<br /> 单车数量：{c0}辆<br />活跃率：{c1}%',
      },
      legend: {
        data: ['单车数量', '活跃率'],
        textStyle: {
          color: '#8FDBFF',
        },
      },
      grid: {
        top: 30,
        bottom: 45,
      },
      xAxis: [
        {
          type: 'category',
          axisLine: {
            lineStyle: {
              color: '#2779FF',
              opacity: 0.5,
            },
          },
          axisLabel: {
            color: '#D1F0FF',
            rotate: 45,
          },
          splitLine: {
            show: false,
          },
          axisPointer: {
            show: true,
            lineStyle: {
              color: '#2779FF',
              opacity: 0.5,
            },
          },
          data: this.params.date.map(
            (item: string): string => {
              return item.slice(5);
            },
          ),
        },
      ],
      yAxis: [
        {
          type: 'value',
          // min: 0,
          // max: 250,
          minInterval: 1,
          position: 'left',
          axisLine: {
            lineStyle: {
              color: '#2779FF',
              opacity: 0.5,
            },
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: false,
          },
          axisLabel: {
            color: '#D1F0FF',
          },
        },
        {
          type: 'value',
          // min: 0,
          // max: 25,
          minInterval: 1,
          position: 'right',
          axisLine: {
            lineStyle: {
              color: '#2779FF',
              opacity: 0.5,
            },
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: false,
          },
          axisLabel: {
            color: '#D1F0FF',
          },
        },
      ],
      series: [
        {
          name: '单车数量',
          type: 'bar',
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#20C0FE' },
              { offset: 1, color: '#2779FF' },
            ]),
          },
          barWidth: '8px',
          data: this.params.bicycleNum,
        },
        {
          name: '活跃率',
          type: 'line',
          yAxisIndex: 1,
          lineStyle: {
            width: 2,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#FF8234' },
              { offset: 1, color: '#F1D251' },
            ]),
          },
          smooth: true,
          showSymbol: false,
          hoverAnimation: true,
          itemStyle: {
            color: '#F1D251',
          },
          data: this.params.activeRate.map((item: any): number => {
            return refinedCal(
            `${item}*100`,
            2,
          );
          }),
        },
      ],
    };

    this.chartNode.setOption(option, true);
  }
}
</script>


<style lang="scss" scoped>
.bicy-trend-chart {
  @include vw2(width, 327);
  @include vw2(height, 184);
  position: absolute;
  @include vh2(top, 12);
  @include vw2(left, 10);
  background: rgba(11, 28, 61, 0.7);
  border: 1px solid rgba(153, 204, 255, 0.25);
  .trend-close {
    position: absolute;
    @include vw2(right, 10);
    @include vw2(top, 10);
    @include vw2(width, 9);
    @include vw2(height, 9);
    text-align: center;
    @include vw2(line-height, 9);
    @include vw2(font-size, 9);
    cursor: pointer;
    color: #fff;
  }
  .trend-tit {
    @include vw2(font-size, 9);
    color: #fff;
    text-align: center;
    @include vw2(padding-top, 10);
    box-sizing: border-box;
    line-height: 1;
  }
  .Chart {
    @include vw2(height, 165);
    width: 100%;
  }
}
</style>
