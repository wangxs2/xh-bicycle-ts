<template>
  <div class="bad-bicy-statistics">
    <div class="close iconfont icon-guanbi"
         @click="close">
    </div>
    <div class="statis-head">僵尸车统计 -- {{params.address}}</div>

    <div class="statis-body">
      <div class="body-tit">
        <div class="tit-label">企业僵尸车数量统计图</div>
        <div class="screen">
          <!--  @change="getBleCompanyTrend" -->
          <el-date-picker size='mini'
                          v-model="selectDate"
                          @change="getBadBikeInfo"
                          :editable="false"
                          :clearable="false"
                          value-format="yyyy-MM-dd"
                          type="date"
                          :picker-options="pickerOptions"
                          placeholder="选择日期">
          </el-date-picker>
        </div>
      </div>

      <div v-show="dateZone === ''"
           class="date-none">
        <div class="none-bg"></div>
        <div class="none-text">暂无僵尸车统计</div>
      </div>

      <div class="body-content"
           v-show="dateZone !== ''">
        <div class="content content-left">
          <div class="content-tit">{{dateZone}}</div>
          <div class="content-bar">
            <div ref="chartBar"
                 class="chartbox">
            </div>
            <!-- <div class="barChart-tooltip">123</div> -->
          </div>
        </div>
        <div class="content content-center">
          <div class="content-tit">{{selectCompany + '&nbsp;--'}} 僵尸车漏斗式分析</div>
          <div class="content-bar">
            <div ref="chartFunnel"
                 class="chartbox">
            </div>
            <!-- <div class="barChart-tooltip">123</div> -->
          </div>
        </div>
        <div class="content content-right">
          <div class="content-tit">{{selectCompany + '&nbsp;--'}} 僵尸车名单</div>
          <div class="content-bar">
            <div class="table">
              <div class="table-head">
                <table>
                  <tr>
                    <th class="td1">#</th>
                    <th class="td2">mac地址</th>
                    <th class="td3">车辆编码</th>
                  </tr>
                </table>
              </div>
              <div class="table-body">
                <el-scrollbar>
                  <table cellpadding='0'
                         cellspacing="0">
                    <tr v-for="(item,index) in abandonBikeMacTab"
                        :key="item">
                      <td class="td1">{{index + 1}}</td>
                      <td class="td2">{{item}}</td>
                      <td class="td3">--</td>
                    </tr>
                  </table>
                </el-scrollbar>
              </div>
            </div>
          </div>
        </div>
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
export default class BadBicyStatistics extends Vue {
  // 图表容器左边
  private chartLNode: any = null;
  // 右边
  private chartRNode: any = null;

  // 选择时间
  public selectDate: string = moment(new Date()).format("YYYY-MM-DD");

  // 选中的企业
  public selectCompany: string = "";

  // 统计时间
  public statisticDate: string = "--";

  // 设置禁止选择的时间
  public pickerOptions: any = {
    disabledDate(time: Date) {
      return time.getTime() > Date.now();
    }
  };

  // 检测时间
  public dateZone: string = "";

  // 企业颜色
  public companyColors: any = {
    摩拜: "#FA6447",
    ofo: "#FBC303",
    哈啰: "#01A1FF",
    享骑: "#7CCA00",
    赳赳: "#FB2D3D"
  };

  // 企业漏斗图颜色
  public companyFunnelColors: any = {
    摩拜: ["#ff5534", "#ff905a", "#ffb48f", "#ffdbc0"],
    ofo: ["#ffa800", "#fbc303", "#ffe68e", "#fff2c7"],
    哈啰: ["#0067db", "#01a1ff", "#6dc7fc", "#b6e4ff"],
    享骑: ["#43a905", "#7cca00", "#bde47f", "#e7ffc2"],
    赳赳: ["#fb2d3d", "#ff6d78", "#ffafb5", "#ffe3e5"]
  };

  // 漏斗模板
  public funnelTemp: Array<string> = [
    "嗅探蓝牙信号",
    "嗅探单车信号",
    "嗅探单车数量",
    "嗅探僵尸车辆数量"
  ];

  // 漏斗图数据
  public abandonBikeFunnel: any = {};

  // 企业僵尸车数据
  public abandonBikeMacList: any = {};

  // 僵尸车表格数据
  public abandonBikeMacTab: Array<string> = [];

  @Prop()
  public params!: any;

  mounted() {
    this.initChart();
    this.getBadBikeInfo();
  }

  @Watch("params")
  onChangedParams(val: any, oldVal: any) {
    this.selectDate = moment(new Date()).format("YYYY-MM-DD");

    this.getBadBikeInfo();
  }

  // 选中企业
  @Watch("selectCompany")
  onChangedCompany(val: string, oldVal: string) {
    if (val) {
      const CompanyData: Array<string | number> = this.abandonBikeFunnel[
        val
      ].split(",");

      this.abandonBikeMacTab = this.abandonBikeMacList[val];
      const max: string | number = CompanyData[0];
      const min: string | number = CompanyData[CompanyData.length - 1];

      const data: any = CompanyData.map(
        (item: any, index: number): any => {
          return {
            name: this.funnelTemp[index],
            value: item
          };
        }
      );

      this.FunnelChartsOption(data, max, min, this.companyFunnelColors[val]);
    }
  }

  beforeDestroy() {
    this.chartLNode.dispose();
    this.chartRNode.dispose();
    this.chartLNode = null;
    this.chartRNode = null;
    window.removeEventListener("resize", this.resizeEvent);
  }

  // 关闭弹窗 清除数据
  @Emit("close")
  close(): void {}

  // 初始化图表
  private initChart(): void {
    const lNode: any = this.$refs.chartBar;
    const rNode: any = this.$refs.chartFunnel;
    this.chartLNode = echarts.init(lNode);
    this.chartRNode = echarts.init(rNode);

    this.chartLNode.on(
      "click",
      (params: any): void => {
        this.selectCompany = params.name;
      }
    );

    window.addEventListener("resize", this.resizeEvent);
  }

  // 事件执行
  private resizeEvent() {
    this.chartLNode.resize();
    this.chartRNode.resize();
  }

  // 获取漏斗图数据
  private getBadBikeInfo(): void {
    API.getBadBikeInfo({
      // terminalId: "DC500A0721D4",
      terminalId: this.params.terminalId,
      // date: "2019-04-27"
      date: this.selectDate
    }).then(
      (res: any): void => {
        let barX: Array<string> = [];
        let barY: Array<string | number> = [];
        let barColors: Array<string> = [];
        let first: string = "";

        if (res.status === 0) {
          this.dateZone = res.sampleDataZone;
          for (let key in res.abandonBikeNum) {
            if (this.companyColors[key]) {
              barColors.push(this.companyColors[key]);
            } else {
              barColors.push("#FFDBC0");
            }

            if (first === "") {
              first = key;
            }

            barX.push(key);
            barY.push(res.abandonBikeNum[key]);
          }
          this.abandonBikeFunnel = res.abandonBikeFunnel;
          this.abandonBikeMacList = res.abandonBikeMacList;
        }
        this.selectCompany = first;

        this.BarChartsOption(barColors, barX, barY);
      }
    );
  }

  // 配置漏斗图
  private FunnelChartsOption(
    data: any,
    max: string | number,
    min: string | number,
    colors: Array<string>
  ): void {
    const option = {
      tooltip: {
        trigger: "item",
        formatter: "{b} : {c}"
      },
      calculable: true,
      series: [
        {
          type: "funnel",
          left: "10%",
          right: "10%",
          top: 0,
          //x2: 80,
          bottom: 50,
          width: "70%",
          min: min,
          max: max,
          minSize: "0%",
          maxSize: "70%",
          sort: "none",
          funnelAlign: "center",
          gap: 0,
          label: {
            color: "#999999",
            formatter: "{b}"
          },
          labelLine: {
            show: false
          },
          itemStyle: {
            borderWidth: 0,
            opacity: 0
          },
          emphasis: {
            label: {
              fontSize: 20
            }
          },
          data: data
        },
        {
          type: "funnel",
          left: "10%",
          right: "10%",
          top: 0,
          //x2: 80,
          bottom: 50,
          width: "70%",
          min: 1,
          max: 138563,
          minSize: "0%",
          maxSize: "70%",
          sort: "none",
          funnelAlign: "center",
          gap: 0,
          label: {
            color: "#fff",
            show: true,
            formatter: function(params: any) {
              if (params.dataIndex < 2) {
                return params.value + "个";
              } else {
                return params.value + "辆";
              }
            },
            position: "inside"
          },
          itemStyle: {
            borderWidth: 0,
            color: function(params: any): string {
              return colors[params.dataIndex];
            }
          },
          emphasis: {
            label: {
              fontSize: 20
            }
          },
          data: data
        }
      ]
    };
    this.chartRNode.setOption(option, true);
  }

  // 配置柱状图
  private BarChartsOption(
    barColors: Array<string>,
    barX: Array<string>,
    barY: Array<string | number>
  ): void {
    const option = {
      tooltip: {
        trigger: "axis",
        formatter: "{b0}: {c0}"
        // axisPointer: {
        //   type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
        // }
      },
      grid: {
        top: "30",
        left: "3%",
        right: "1%",
        bottom: "30",
        containLabel: true
      },
      xAxis: [
        {
          type: "category",
          data: barX,
          axisLine: {
            lineStyle: {
              color: "#39415A"
            }
          },
          splitLine: {
            show: false
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
          axisLabel: {
            color: "#657CA8"
          }
        }
      ],
      yAxis: [
        {
          type: "value",
          name: "单位(辆)",
          nameTextStyle: {
            color: "#657CA8"
          },
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
        {
          type: "value",
          axisLine: {
            lineStyle: {
              color: "#39415A"
            }
          }
        }
      ],
      series: [
        {
          type: "bar",
          barWidth: "16",
          itemStyle: {
            barBorderRadius: [8, 8, 0, 0],
            color: function(params: any) {
              return barColors[params.dataIndex];
            }
          },
          data: barY
        }
      ]
    };
    this.chartLNode.setOption(option, true);
  }
}
</script>


<style lang="scss" scoped>
.bad-bicy-statistics {
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

  .date-none {
    width: 100%;
    height: 1px;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .none-bg {
      width: vw(246);
      height: vw(83);
      background: url("~@img/bad-none@3x.png") no-repeat;
      background-size: 100% 100%;
    }
    .none-text {
      color: #6796f9;
      margin-top: vw(10);
    }
  }

  .statis-body {
    width: 100%;
    height: 1px;
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 0 vw(10);
    box-sizing: border-box;
    .body-tit {
      box-sizing: border-box;
      margin-top: vw(15);
      padding-bottom: vw(3);
      width: 100%;
      height: vw(18);
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: vw(8);
      color: #ccc;
      border-bottom: 1px solid rgba(153, 204, 255, 0.25);
      .tit-label {
        font-size: vw(9);
        color: #fff;
      }
      .screen {
        width: vw(80);
      }
    }
    .body-content {
      width: 100%;
      height: 1px;
      flex: 1;
      display: flex;
      .content {
        // flex: 1;
        width: vw(214.9);
        height: 100%;
        display: flex;
        flex-direction: column;
        .content-tit {
          font-size: vw(9);
          font-family: MicrosoftYaHei;
          font-weight: 400;
          color: #fff;
          text-align: center;
          margin: vw(14) 0;
        }
        .content-bar {
          width: 100%;
          height: 1px;
          flex: 1;
          position: relative;
          .chartbox {
            width: vw(214.9);
            height: vw(131);
          }
          .barChart-tooltip {
            width: vw(34);
            height: vw(17);
            background: #000;
            position: absolute;
            top: 128px;
            left: 107px;
          }
        }
      }
      .content-right {
        .content-bar {
          .table {
            width: 100%;
            height: vw(118);
            display: flex;
            flex-direction: column;
            font-size: vw(8);
            line-height: vw(20);
            .td1 {
              width: 16%;
            }
            .td2 {
              width: 42%;
            }
            .td3 {
              width: 42%;
            }
            table {
              border-spacing: 0;
              width: 100%;
              padding: 0;
              margin: 0;
              tr,
              td,
              th {
                padding: 0;
                margin: 0;
              }
            }
            .table-head {
              background: rgba(153, 204, 255, 0.2);
              color: #aaaaaa;
              text-align: center;
              font-weight: bold;
              // margin-right: -1px;
              table {
                border: 1px solid #444444;
                th {
                  border-right: 1px solid #444444;
                  &:last-of-type {
                    border: none;
                  }
                }
              }
            }
            .table-body {
              flex: 1;
              height: 1px;
              color: #ffffff;
              text-align: center;
              width: 100%;
              table {
                border-left: 1px solid #444444;
                border-right: 1px solid #444444;
                td {
                  border-right: 1px solid #444444;
                  border-bottom: 1px solid #444444;
                  // &:last-of-type {
                  //   border-right: none;
                  // }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>

<style lang="scss">
.bad-bicy-statistics {
  .screen {
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

  .el-scrollbar {
    height: 100%;
    width: 100%;
    .el-scrollbar__wrap {
      overflow-x: hidden;
      margin-right: -18px !important;
    }
  }
}
</style>
