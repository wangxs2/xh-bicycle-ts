<template>
  <div class="bicy-trend-chart">
    <div class="trend-close iconfont icon-guanbi"
         @click="close">
    </div>
    <div class="trend-tit">{{params.name}} 数量-活跃率变化</div>
    <div ref="bicyActiveTrend"
         class="Chart"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Emit } from "vue-property-decorator";
import echarts from "echarts";

interface PropData {
  activeRate: Array<string | number>;
  bicycleNum: Array<string | number>;
  date: Array<string>;
  name: string;
  [propName: string]: any;
}

@Component
export default class BicyTrendChart extends Vue {
  // 图表容器
  private chartNode: any = null;

  @Prop()
  public params!: PropData;

  mounted() {
    this.initChart();
    this.echartsOption();
  }

  @Watch("params")
  onchanged(val: PropData, oldVal: PropData) {
    this.echartsOption();
  }

  // 关闭弹窗 清除数据
  @Emit()
  close() {}

  beforeDestroy() {
    this.chartNode.dispose();
    this.chartNode = null;
    window.removeEventListener("resize", this.resizeEvent);
  }

  // 初始化图表
  private initChart(): void {
    const Cnode: any = this.$refs.bicyActiveTrend;
    this.chartNode = echarts.init(Cnode);

    window.addEventListener("resize", this.resizeEvent);
  }

  // 事件执行
  private resizeEvent() {
    this.chartNode.resize();
  }

  // 配置
  private echartsOption(): void {
    const option = {
      tooltip: {
        trigger: "axis"
      },
      legend: {
        data: ["单车数量", "活跃率"],
        textStyle: {
          color: "#8FDBFF"
        }
      },
      grid: {
        top: 30,
        bottom: 45
      },
      xAxis: [
        {
          type: "category",
          axisLine: {
            lineStyle: {
              color: "#2779FF",
              opacity: 0.5
            }
          },
          axisLabel: {
            color: "#D1F0FF",
            rotate: 45
          },
          splitLine: {
            show: false
          },
          axisPointer: {
            show: true,
            lineStyle: {
              color: "#2779FF",
              opacity: 0.5
            }
          },
          data: this.params.date.map(
            (item: string): string => {
              return item.slice(5);
            }
          )
        }
      ],
      yAxis: [
        {
          type: "value",
          // min: 0,
          // max: 250,
          minInterval: 1,
          position: "left",
          axisLine: {
            lineStyle: {
              color: "#2779FF",
              opacity: 0.5
            }
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisLabel: {
            color: "#D1F0FF"
          }
        },
        {
          type: "value",
          // min: 0,
          // max: 25,
          minInterval: 1,
          position: "right",
          axisLine: {
            lineStyle: {
              color: "#2779FF",
              opacity: 0.5
            }
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisLabel: {
            color: "#D1F0FF"
          }
        }
      ],
      series: [
        {
          name: "单车数量",
          type: "bar",
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "#20C0FE" },
              { offset: 1, color: "#2779FF" }
            ])
          },
          barWidth: "8px",
          data: this.params.bicycleNum
        },
        {
          name: "活跃率",
          type: "line",
          yAxisIndex: 1,
          lineStyle: {
            width: 2,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "#FF8234" },
              { offset: 1, color: "#F1D251" }
            ])
          },
          smooth: true,
          showSymbol: false,
          hoverAnimation: true,
          itemStyle: {
            color: "#F1D251"
          },
          data: this.params.activeRate
        }
      ]
    };

    this.chartNode.setOption(option, true);
  }
}
</script>


<style lang="scss" scoped>
.bicy-trend-chart {
  width: vw(327);
  height: vw(184);
  position: absolute;
  top: vh(12);
  left: vw(10);
  background: rgba(11, 28, 61, 0.7);
  border: 1px solid rgba(153, 204, 255, 0.25);
  .trend-close {
    position: absolute;
    right: vw(10);
    top: vw(10);
    width: vw(9);
    height: vw(9);
    text-align: center;
    line-height: vw(9);
    font-size: vw(9);
    cursor: pointer;
    color: #fff;
  }
  .trend-tit {
    font-size: vw(9);
    color: #fff;
    text-align: center;
    padding-top: vw(10);
    box-sizing: border-box;
    line-height: 1;
  }
  .Chart {
    width: 100%;
    height: vw(165);
  }
}
</style>
