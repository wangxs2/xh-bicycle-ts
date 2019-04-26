<template>
  <div class="blu-statistics">
    <div class="close iconfont icon-guanbi"
         @click="close">
    </div>
    <div class="statis-head">图形统计</div>

    <div class="statis-body">
      <div class="body-left">
        <div class="body-tit">
          <span class="tit-label">实时车辆数</span>
          <span>统计时间：2019-01-30 13:26:13</span>
        </div>
        <div class="chart"
             ref="currentTimeNum"></div>
      </div>
      <div class="body-right">
        <div class="body-tit">
          <span class="tit-label">近七天车辆变化曲线</span>
          <div class="screen">
            <div class="screen-item">
              <el-select v-model="company"
                         size='mini'
                         placeholder="请选择">
                <el-option v-for="item in companyData"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div class="screen-item">
              <el-date-picker size='mini'
                              v-model="selectDate"
                              :editable="false"
                              :clearable="false"
                              type="date"
                              placeholder="选择日期">
              </el-date-picker>
            </div>
          </div>
        </div>
        <div class="chart"
             ref="changingCurve"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import API from "@/api/index.ts";
import { Component, Vue, Prop, Watch, Emit } from "vue-property-decorator";
import echarts from "echarts";
import moment from "moment";

moment.locale("zh-cn");

@Component
export default class BluStatistics extends Vue {
  // 图表容器左边
  private chartLNode: any = null;
  // 右边
  private chartRNode: any = null;

  // 选择公司
  public company: string = "";

  // 选择时间
  public selectDate: string = moment(new Date()).format("YYYY-MM-DD");

  // 企业数据
  public companyData: Array<any> = [];

  @Prop()
  public params!: any;

  mounted() {
    this.initChart();
    // this.echartsOption();
    this.getBleCompanyTrend();
  }

  @Watch("params")
  onchanged(val: any, oldVal: any) {
    // this.echartsOption();
  }

  // 关闭弹窗 清除数据
  @Emit()
  close(): void {
    this.chartLNode.clear();
    this.chartRNode.clear();
    this.chartLNode = null;
    this.chartRNode = null;
    window.removeEventListener("resize", this.resizeEvent.bind(this));
  }

  // 初始化图表
  private initChart(): void {
    const lNode: any = this.$refs.currentTimeNum;
    const rNode: any = this.$refs.changingCurve;
    this.chartLNode = echarts.init(lNode);
    this.chartRNode = echarts.init(rNode);

    window.addEventListener("resize", this.resizeEvent.bind(this));
  }

  // 事件执行
  private resizeEvent() {
    this.chartLNode.resize();
    this.chartRNode.resize();
  }

  // 获取近七天蓝牙设备检测到的车辆情况
  private getBleCompanyTrend(): void {
    API.getBleCompanyTrend({
      terminalId: "E05E78338DE1",
      date: this.selectDate,
      companyCode: ""
    }).then(
      (res: any): void => {
        let DataX: Array<string> = [];
        let DataY: Array<number> = [];

        if (res.status === 0) {
          res.data.forEach(
            (item: any): void => {
              DataX.push(item.time.slice(5));
              DataY.push(item.num);
            }
          );
        }

        this.RechartsOption(DataX, DataY);
      }
    );
  }

  // 配置左边
  private LechartsOption(): void {
    const option = {};
  }

  // 配置右边
  private RechartsOption(DataX: Array<string>, DataY: Array<number>): void {
    const option = {
      tooltip: {
        trigger: "axis"
      },
      legend: {
        data: ["单车数量"],
        right: 0,
        top: "4",
        textStyle: {
          color: "#657CA8"
        }
      },
      grid: {
        left: 40,
        right: 10,
        top: 40,
        bottom: 54
      },
      dataZoom: [
        {
          type: "slider",
          xAxisIndex: 0,
          filterMode: "empty"
        },
        {
          type: "inside",
          xAxisIndex: 0,
          filterMode: "empty"
        }
      ],
      xAxis: {
        type: "category",
        axisLine: {
          lineStyle: {
            color: "#39415A"
          }
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          show: false,
          color: "#999999",
          rotate: 45
        },
        axisPointer: {
          show: true,
          lineStyle: {
            color: "#657CA8"
          }
        },
        axisTick: {
          show: false
        },
        data: DataX
      },
      yAxis: {
        name: "单位(辆)",
        nameTextStyle: {
          color: "#657CA8"
        },
        type: "value",
        minInterval: 1,
        axisLine: {
          lineStyle: {
            color: "#39415A"
          }
        },
        splitLine: {
          lineStyle: {
            color: "#657CA8",
            opacity: 0.1
          }
        },
        axisLabel: {
          color: "#657CA8"
        }
      },
      color: "#5883FF",
      series: [
        {
          name: "单车数量",
          data: DataY,
          type: "line",
          smooth: true
        }
      ]
    };
    this.chartRNode.setOption(option, true);
  }
}
</script>


<style lang="scss" scoped>
.blu-statistics {
  width: vw(664.8);
  height: vw(224);
  position: absolute;
  top: vh(60);
  left: vw(110);
  background: rgba(11, 28, 61, 0.7);
  border: 1px solid rgba(153, 204, 255, 0.25);
  display: flex;
  flex-direction: column;
  .close {
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
  .statis-head {
    width: 100%;
    // height: vw(19.2);
    background: rgba(153, 204, 255, 0.2);
    color: #fff;
    font-size: vw(10);
    line-height: vw(24);
    text-align: center;
  }
  .statis-body {
    width: 100%;
    height: 1px;
    flex: 1;
    display: flex;
    .body-left {
      width: vw(252);
      height: 100%;
      display: flex;
      flex-direction: column;
      padding: 0 vw(8);
      box-sizing: border-box;
    }
    .body-right {
      width: 1px;
      flex: 1;
      height: 100%;
      display: flex;
      flex-direction: column;
      padding: 0 vw(8);
      box-sizing: border-box;
    }

    .body-tit {
      width: 100%;
      height: vw(22);
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: vw(8);
      color: #999999;
      border-bottom: 1px solid rgba(153, 204, 255, 0.25);
      .tit-label {
        font-size: vw(9);
        color: #fff;
      }
      .screen {
        display: flex;
        align-items: center;
        .screen-item {
          width: vw(80);
          &:last-of-type {
            margin-left: vw(6);
          }
        }
      }
    }
    .chart {
      width: 100%;
      height: 1px;
      flex: 1;
    }
  }
}
</style>

<style lang="scss">
.blu-statistics {
  .screen-item {
    .el-select {
      .el-input {
        .el-input__inner {
          color: #fff;
          background-color: transparent;
          border: 1px solid rgba(153, 204, 255, 0.25);
        }
      }
    }
    .el-date-editor {
      width: vw(80);
      .el-input__inner {
        color: #fff;
        cursor: pointer;
        background-color: transparent;
        border: 1px solid rgba(153, 204, 255, 0.25);
        padding-right: 0;
      }
    }
  }
}
</style>
