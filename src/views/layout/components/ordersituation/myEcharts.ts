import echarts from 'echarts'

export default class MyEcharts {
  public echartContainer1: any = null
  public echartContainer2: any = null
  public echartContainer3: any = null

  constructor() {
    this.initEcharts()
  }

  // 初始化
  initEcharts(): void {
    const echartContainer1: any = document.querySelector('#echartContainer1')
    this.echartContainer1 = echarts.init(echartContainer1)

    const echartContainer2: any = document.querySelector('#echartContainer2')
    this.echartContainer2 = echarts.init(echartContainer2)

    const echartContainer3: any = document.querySelector('#echartContainer3')
    this.echartContainer3 = echarts.init(echartContainer3)

    window.addEventListener('resize', () => {
      this.echartContainer1.resize()
      this.echartContainer2.resize()
      this.echartContainer3.resize()
    })
  }

  // 清除
  clearContainer(el: string) {
    ;(this as any)[el].clear()
  }

  // 配置项
  // el: 容器id
  // x: x轴数据
  // bar: y轴数据 柱状图
  // line: y轴数据 折线图
  // name: 数据标题

  echartsOption(params: any): void {
    const option: any = {
      title: {
        text: params.name,
        left: 'center',
        textStyle: {
          color: '#FFFFFF',
          fontSize: '16',
          fontWeight: '100',
          align: 'center'
        }
      },
      grid: {
        top: '30',
        bottom: '30'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        show: false
      },
      textStyle: {
        color: '#657CA8'
      },
      xAxis: {
        type: 'category',
        nameTextStyle: {
          verticalAlign: 'bottom'
        },
        axisLine: {
          lineStyle: {
            color: '#39415A'
          }
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: ['#657CA8'],
            opacity: 0.1
          }
        },
        name: '(日)',
        data: params.x
      },
      yAxis: {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: '#39415A'
          }
        },
        axisTick: {
          show: false
        },
        nameTextStyle: {
          color: '#657CA8'
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: ['#657CA8'],
            opacity: 0.1
          }
        },
        minInterval: 1,
        name: '数量'
      },
      series: [
        {
          name: '督办工单',
          type: 'bar',
          itemStyle: {
            color: params.color[0],
            barBorderRadius: [3, 3, 0, 0]
          },
          barWidth: '6px',
          data: params.bar
        },
        {
          name: '自查工单',
          type: 'line',
          showSymbol: false,
          hoverAnimation: true,
          lineStyle: {
            width: 3,
            color: params.color[1]
          },
          itemStyle: {
            color: params.color[1]
          },
          markPoint: {
            itemStyle: {
              color: params.color[1]
            },
            label: {
              color: '#fff'
            },
            symbolSize: 40,
            data: [
              { type: 'max', name: '最大值' },
              { type: 'min', name: '最小值' }
            ]
          },
          smooth: true,
          data: params.line
        }
      ]
    }
    ;(this as any)[params.el].setOption(option, true)
  }
}
