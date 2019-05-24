<template>
  <div class="bad-bicy-statistics">
    <div class="close iconfont icon-guanbi" @click="close"></div>
    <div class="statis-head">僵尸车统计 -- {{params.address}}</div>

    <div class="statis-body">
      <div class="body-tit">
        <div class="tit-label">企业僵尸车数量统计图</div>
        <div class="screen">
          <!--  @change="getBleCompanyTrend" -->
          <el-date-picker
            size="mini"
            v-model="selectDate"
            @change="getBadBikeInfo"
            :editable="false"
            :clearable="false"
            value-format="yyyy-MM-dd"
            type="date"
            :picker-options="pickerOptions"
            placeholder="选择日期"
          ></el-date-picker>
        </div>
      </div>

      <div v-show="dateZone === ''" class="date-none">
        <div class="none-bg"></div>
        <div class="none-text">暂无僵尸车统计</div>
      </div>

      <div class="body-content" v-show="dateZone !== ''">
        <div class="content content-left">
          <div class="content-tit">{{dateZone}}</div>
          <div class="content-bar">
            <div ref="chartBar" class="chartbox"></div>
            <!-- <div class="barChart-tooltip">123</div> -->
          </div>
        </div>
        <div class="content content-center">
          <div class="content-tit">{{selectCompany + '&nbsp;--'}} 僵尸车漏斗式分析</div>
          <div class="content-bar">
            <div ref="chartFunnel" class="chartbox"></div>
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
                  <table cellpadding="0" cellspacing="0">
                    <tr v-for="(item,index) in abandonBikeMacTab" :key="item">
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
import API from '@/api/index.ts';
import { Component, Vue, Prop, Watch, Emit } from 'vue-property-decorator';
import echarts from 'echarts';
import moment from 'moment';

moment.locale('zh-cn');

@Component
export default class BadBicyStatistics extends Vue {
  // 选择时间
  public selectDate: string = moment(new Date()).format('YYYY-MM-DD');

  // 选中的企业
  public selectCompany: string = '';

  // 统计时间
  public statisticDate: string = '--';

  // 设置禁止选择的时间
  public pickerOptions: any = {
    disabledDate(time: Date) {
      return time.getTime() > Date.now();
    },
  };

  // 检测时间
  public dateZone: string = '';

  // 企业颜色
  public companyColors: any = {
    摩拜: '#FA6447',
    ofo: '#FBC303',
    哈啰: '#01A1FF',
    享骑: '#7CCA00',
    赳赳: '#FB2D3D',
  };

  // 企业漏斗图颜色
  public companyFunnelColors: any = {
    摩拜: ['#ff5534', '#ff905a', '#ffb48f', '#ffdbc0'],
    ofo: ['#ffa800', '#fbc303', '#ffe68e', '#fff2c7'],
    哈啰: ['#0067db', '#01a1ff', '#6dc7fc', '#b6e4ff'],
    享骑: ['#43a905', '#7cca00', '#bde47f', '#e7ffc2'],
    赳赳: ['#fb2d3d', '#ff6d78', '#ffafb5', '#ffe3e5'],
  };

  // 漏斗模板
  public funnelTemp: string[] = [
    '嗅探蓝牙信号',
    '嗅探单车信号',
    '嗅探单车数量',
    '嗅探僵尸车辆数量',
  ];

  // 漏斗图数据
  public abandonBikeFunnel: any = {};

  // 企业僵尸车数据
  public abandonBikeMacList: any = {};

  // 僵尸车表格数据
  public abandonBikeMacTab: string[] = [];

  @Prop()
  public params!: any;
  // 图表容器左边
  private chartLNode: any = null;
  // 右边
  private chartRNode: any = null;

  public mounted() {
    this.initChart();
    this.getBadBikeInfo();

    this.$Bus.$on('updateScreen', this.resizeEvent);
  }

  @Watch('params')
  public onChangedParams(val: any, oldVal: any) {
    this.selectDate = moment(new Date()).format('YYYY-MM-DD');

    this.getBadBikeInfo();
  }

  // 选中企业
  @Watch('selectCompany')
  public onChangedCompany(val: string, oldVal: string) {
    if (val) {
      const CompanyData: Array<string | number> = this.abandonBikeFunnel[
        val
      ].split(',');

      this.abandonBikeMacTab = this.abandonBikeMacList[val];
      const max: string | number = CompanyData[0];
      const min: string | number = CompanyData[CompanyData.length - 1];

      const data: any = CompanyData.map(
        (item: any, index: number): any => {
          return {
            name: this.funnelTemp[index],
            value: item,
          };
        },
      );

      this.FunnelChartsOption(data, max, min, this.companyFunnelColors[val]);
    }
  }

  public beforeDestroy() {
    this.chartLNode.dispose();
    this.chartRNode.dispose();
    this.chartLNode = null;
    this.chartRNode = null;
    window.removeEventListener('resize', this.resizeEvent);
    this.$Bus.$off('updateScreen', this.resizeEvent);
  }

  // 关闭弹窗 清除数据
  @Emit('close')
  public close() {
    //
  }

  // 初始化图表
  private initChart(): void {
    const lNode: any = this.$refs.chartBar;
    const rNode: any = this.$refs.chartFunnel;
    this.chartLNode = echarts.init(lNode);
    this.chartRNode = echarts.init(rNode);

    this.chartLNode.on(
      'click',
      (params: any): void => {
        this.selectCompany = params.name;
      },
    );

    window.addEventListener('resize', this.resizeEvent);
  }

  // 事件执行
  private resizeEvent() {
    this.chartLNode.resize();
    this.chartRNode.resize();
  }

  // 获取漏斗图数据
  private getBadBikeInfo(): void {
    API.getBadBikeInfo({
      terminalId: this.params.terminalId,
      date: this.selectDate,
    }).then(
      (res: any): void => {
        const barX: string[] = [];
        const barY: Array<string | number> = [];
        const barColors: string[] = [];
        let first: string = '';

        if (res.status === 0) {
          this.dateZone = res.sampleDataZone;
          for (const key of Object.keys(res.abandonBikeNum)) {
            if (this.companyColors[key]) {
              barColors.push(this.companyColors[key]);
            } else {
              barColors.push('#FFDBC0');
            }

            if (first === '') {
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
      },
    );
  }

  // 配置漏斗图
  private FunnelChartsOption(
    data: any,
    max: string | number,
    min: string | number,
    colors: string[],
  ): void {
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{b} : {c}',
      },
      calculable: true,
      series: [
        {
          type: 'funnel',
          left: '10%',
          right: '10%',
          top: 0,
          // x2: 80,
          bottom: 50,
          width: '70%',
          min,
          max,
          minSize: '0%',
          maxSize: '70%',
          sort: 'none',
          funnelAlign: 'center',
          gap: 0,
          label: {
            color: '#999999',
            formatter: '{b}',
          },
          labelLine: {
            show: false,
          },
          itemStyle: {
            borderWidth: 0,
            opacity: 0,
          },
          emphasis: {
            label: {
              fontSize: 20,
            },
          },
          data,
        },
        {
          type: 'funnel',
          left: '10%',
          right: '10%',
          top: 0,
          // x2: 80,
          bottom: 50,
          width: '70%',
          min: 1,
          max: 138563,
          minSize: '0%',
          maxSize: '70%',
          sort: 'none',
          funnelAlign: 'center',
          gap: 0,
          label: {
            color: '#fff',
            show: true,
            formatter(params: any) {
              if (params.dataIndex < 2) {
                return params.value + '个';
              } else {
                return params.value + '辆';
              }
            },
            position: 'inside',
          },
          itemStyle: {
            borderWidth: 0,
            color(params: any): string {
              return colors[params.dataIndex];
            },
          },
          emphasis: {
            label: {
              fontSize: 20,
            },
          },
          data,
        },
      ],
    };
    this.chartRNode.setOption(option, true);
  }

  // 配置柱状图
  private BarChartsOption(
    barColors: string[],
    barX: string[],
    barY: Array<string | number>,
  ): void {
    const option = {
      tooltip: {
        trigger: 'axis',
        formatter: '{b0}: {c0}',
        // axisPointer: {
        //   type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
        // }
      },
      grid: {
        top: '30',
        left: '3%',
        right: '1%',
        bottom: '30',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          data: barX,
          axisLine: {
            lineStyle: {
              color: '#39415A',
            },
          },
          splitLine: {
            show: false,
          },
          axisPointer: {
            show: true,
            lineStyle: {
              color: '#657CA8',
            },
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: '#657CA8',
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          name: '单位(辆)',
          nameTextStyle: {
            color: '#657CA8',
          },
          minInterval: 1,
          axisLine: {
            lineStyle: {
              color: '#39415A',
            },
          },
          splitLine: {
            lineStyle: {
              color: '#657CA8',
              opacity: 0.1,
            },
          },
          axisLabel: {
            color: '#657CA8',
          },
        },
        {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#39415A',
            },
          },
        },
      ],
      series: [
        {
          type: 'bar',
          barWidth: '16',
          itemStyle: {
            barBorderRadius: [8, 8, 0, 0],
            color(params: any) {
              return barColors[params.dataIndex];
            },
          },
          data: barY,
        },
      ],
    };
    this.chartLNode.setOption(option, true);
  }
}
</script>


<style lang="scss" scoped>
.bad-bicy-statistics {
  @include vw2(width, 664.8);
  @include vw2(height, 224);
  position: absolute;
  @include vh2(top, 60);
  @include vw2(left, 110);
  background: rgba(11, 28, 61, 0.7);
  border: 1px solid rgba(153, 204, 255, 0.25);
  display: flex;
  flex-direction: column;
  .close {
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
  .statis-head {
    width: 100%;
    background: rgba(153, 204, 255, 0.2);
    color: #fff;
    @include vw2(font-size, 10);
    @include vw2(line-height, 24);
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
      @include vw2(width, 246);
      @include vw2(height, 83);
      background: url('~@img/bad-none@3x.png') no-repeat;
      background-size: 100% 100%;
    }
    .none-text {
      color: #6796f9;
      @include vw2(margin-top, 10);
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
      @include vw2(margin-top, 15);
      @include vw2(padding-bottom, 3);
      width: 100%;
      @include vw2(height, 18);
      display: flex;
      justify-content: space-between;
      align-items: center;
      @include vw2(font-size, 8);
      color: #ccc;
      border-bottom: 1px solid rgba(153, 204, 255, 0.25);
      .tit-label {
        @include vw2(font-size, 9);
        color: #fff;
      }
      .screen {
        @include vw2(width, 80);
      }
    }
    .body-content {
      width: 100%;
      height: 1px;
      flex: 1;
      display: flex;
      .content {
        // flex: 1;
        @include vw2(width, 214.9);
        height: 100%;
        display: flex;
        flex-direction: column;
        .content-tit {
          @include vw2(font-size, 9);
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
            @include vw2(width, 214.9);
            @include vw2(height, 131);
          }
          .barChart-tooltip {
            @include vw2(width, 34);
            @include vw2(height, 17);
            background: #000;
            position: absolute;
            // @include vw2(height, 17);
            // top: 128px;
            // left: 107px;
          }
        }
      }
      .content-right {
        .content-bar {
          .table {
            width: 100%;
            @include vw2(height, 118);
            display: flex;
            flex-direction: column;
            @include vw2(font-size, 8);
            @include vw2(line-height, 20);
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
      @include vw2(width, 80);
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
