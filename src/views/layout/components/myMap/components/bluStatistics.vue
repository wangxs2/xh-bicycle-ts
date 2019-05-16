<template>
  <div class="blu-statistics">
    <div class="close iconfont icon-guanbi" @click="close"></div>
    <div class="statis-head">图形统计 -- {{params.address}}</div>

    <div class="statis-body">
      <div class="body-left">
        <div class="body-tit">
          <span class="tit-label">实时车辆数</span>
          <span>统计时间：{{statisticDate}}</span>
        </div>
        <div class="chart" ref="currentTimeNum"></div>
      </div>
      <div class="body-right">
        <div class="body-tit">
          <span class="tit-label">{{selectCompany}} 近七天车辆变化曲线</span>
          <div class="screen">
            <!-- <div class="screen-item">
              <el-select v-model="company"
                         size='mini'
                         placeholder="请选择">
                <el-option v-for="item in companyData"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </div>-->
            <div class="screen-item">
              <el-date-picker
                size="mini"
                v-model="selectDate"
                :editable="false"
                :clearable="false"
                @change="getBleCompanyTrend"
                value-format="yyyy-MM-dd"
                type="date"
                :picker-options="pickerOptions"
                placeholder="选择日期"
              ></el-date-picker>
            </div>
          </div>
        </div>
        <div class="chart" ref="changingCurve"></div>
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
export default class BluStatistics extends Vue {
  // 选择公司
  public company: string = '';

  // 选择时间
  public selectDate: string = moment(new Date()).format('YYYY-MM-DD');

  // 选中的企业
  public selectCompany: string = '全部';
  public selectCompanyCode: string = '';

  // 企业数据
  public companyData: any[] = [];

  // 统计时间
  public statisticDate: string = '--';

  // 设置禁止选择的时间
  public pickerOptions: any = {
    disabledDate(time: Date) {
      return time.getTime() > Date.now();
    },
  };

  // 企业颜色
  public companyColors: any = {
    摩拜: '#FA6447',
    ofo: '#FBC303',
    哈啰: '#01A1FF',
    享骑: '#7CCA00',
    赳赳: '#FB2D3D',
  };

  @Prop()
  public params!: any;
  // 图表容器左边
  private chartLNode: any = null;
  // 右边
  private chartRNode: any = null;

  public mounted() {
    this.initChart();
    this.getBleCompanyTrend();
    this.getBleCompanyNum();
    this.$Bus.$on('updateScreen', this.resizeEvent);
  }

  @Watch('params')
  public onchanged(val: any, oldVal: any) {
    this.selectDate = moment(new Date()).format('YYYY-MM-DD');
    this.selectCompany = '全部';
    this.selectCompanyCode = '';

    this.getBleCompanyNum();
    this.getBleCompanyTrend();
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
    const lNode: any = this.$refs.currentTimeNum;
    const rNode: any = this.$refs.changingCurve;
    this.chartLNode = echarts.init(lNode);
    this.chartRNode = echarts.init(rNode);

    this.chartLNode.on(
      'click',
      (params: any): void => {
        if (params.name !== this.selectCompany && params.name !== '单车总数') {
          this.selectCompany = params.name;
          this.selectCompanyCode = params.data.code;
        } else {
          this.chartLNode.dispatchAction({
            type: 'pieUnSelect',
            name: this.selectCompany,
          });
          this.selectCompany = '全部';
          this.selectCompanyCode = '';
        }
        this.getBleCompanyTrend();
      },
    );

    window.addEventListener('resize', this.resizeEvent);
  }

  // 事件执行
  private resizeEvent() {
    this.chartLNode.resize();
    this.chartRNode.resize();
  }

  // 获取实时数据
  private getBleCompanyNum(): void {
    API.getBleCompanyNum({
      terminalId: this.params.terminalId,
    }).then(
      (res: any): void => {
        const legend: string[] = [];
        const sum: number = res.total;
        let data: any[] = [];
        const color: string[] = [];
        let statisticDate: number = 0;

        data = res.companyNum.map(
          (item: any): any => {
            legend.push(item.name);
            color.push(this.companyColors[item.name]);
            statisticDate =
              statisticDate < item.uploadTime ? item.uploadTime : statisticDate;
            return {
              code: item.companyCode,
              name: item.name,
              value: item.num,
            };
          },
        );
        this.statisticDate = moment(new Date(statisticDate)).format(
          'YYYY-MM-DD HH:mm:ss',
        );
        this.LechartsOption(legend, sum, color, data);
      },
    );
  }

  // 获取近七天蓝牙设备检测到的车辆情况
  private getBleCompanyTrend(): void {
    API.getBleCompanyTrend({
      terminalId: this.params.terminalId,
      date: this.selectDate,
      companyCode: this.selectCompanyCode,
    }).then(
      (res: any): void => {
        const DataX: string[] = [];
        const DataY: number[] = [];

        if (res.status === 0) {
          res.data.forEach(
            (item: any): void => {
              // DataX.push(item.time.slice(5));
              DataX.push(item.time);
              DataY.push(item.num);
            },
          );
        }

        this.RechartsOption(DataX, DataY);
      },
    );
  }

  // 配置左边
  private LechartsOption(
    legend: string[],
    sum: number,
    color: string[],
    data: any[],
  ): void {
    const option = {
      color,
      legend: {
        bottom: 18,
        icon: 'circle',
        textStyle: {
          color: '#999999',
        },
        data: legend,
      },
      series: [
        {
          name: '总数',
          type: 'pie',
          color: ['#5883ff'],
          selectedMode: 'single',
          radius: [0, '30%'],
          center: ['50%', '40%'],
          label: {
            normal: {
              position: 'center',
              formatter: '{a|单车总数}\n{b|{c}}',
              rich: {
                a: {
                  color: '#ffffff',
                  verticalAlign: 'middle',
                  padding: [8, 0, 0, 0],
                },
                b: {
                  fontSize: 24,
                  color: '#ffffff',
                  verticalAlign: 'middle',
                },
              },
            },
          },
          selectedOffset: 0,
          data: [{ value: sum, name: '单车总数' }],
        },
        {
          name: '企业',
          type: 'pie',
          center: ['50%', '40%'],
          radius: ['40%', '58%'],
          selectedMode: 'single',
          label: {
            normal: {
              formatter: '{a|{b}：{c}辆}\n{a|占比：{d}%}',
              rich: {
                a: {
                  color: '#fff',
                  align: 'left',
                },
              },
            },
          },
          data,
        },
      ],
    };
    this.chartLNode.setOption(option, true);
  }

  // 配置右边
  private RechartsOption(DataX: string[], DataY: number[]): void {
    const option = {
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['单车数量'],
        right: 0,
        top: '4',
        textStyle: {
          color: '#657CA8',
        },
      },
      grid: {
        left: 40,
        right: 10,
        top: 40,
        bottom: 54,
      },
      dataZoom: [
        {
          type: 'slider',
          xAxisIndex: 0,
          backgroundColor: 'rgba(11, 28, 61, 0.7)',
          dataBackground: {
            lineStyle: {
              color: '#5883FF',
            },
            areaStyle: {
              color: '#5883FF',
            },
          },
          fillerColor: 'rgba(167,183,204,0.1)',
          borderColor: '#657CA8',
          textStyle: {
            color: '#657CA8',
          },
          filterMode: 'empty',
        },
        {
          type: 'inside',
          xAxisIndex: 0,
          filterMode: 'empty',
        },
      ],
      xAxis: {
        type: 'category',
        axisLine: {
          lineStyle: {
            color: '#39415A',
          },
        },
        splitLine: {
          show: false,
        },
        axisLabel: {
          show: false,
          color: '#999999',
          rotate: 45,
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
        data: DataX,
      },
      yAxis: {
        name: '单位(辆)',
        nameTextStyle: {
          color: '#657CA8',
        },
        type: 'value',
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
      color: '#5883FF',
      series: [
        {
          name: '单车数量',
          data: DataY,
          type: 'line',
          smooth: true,
        },
      ],
    };
    this.chartRNode.setOption(option, true);
  }
}
</script>


<style lang="scss" scoped>
.blu-statistics {
  @include vw2(width, 664.8);
  @include vw2(height, 224);
  position: absolute;
  @include vw2(top, 60);
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
    // height: vw(19.2);
    background: rgba(153, 204, 255, 0.2);
    color: #fff;
    @include vw2(font-size, 10);
    @include vw2(line-height, 24);
    text-align: center;
  }
  .statis-body {
    width: 100%;
    height: 1px;
    flex: 1;
    display: flex;
    .body-left {
      @include vw2(width, 252);
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
      @include vw2(height, 22);
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
        display: flex;
        align-items: center;
        .screen-item {
          @include vw2(width, 80);
          &:last-of-type {
            @include vw2(margin-left, 6);
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
}
</style>
