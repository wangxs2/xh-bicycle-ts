import echarts from 'echarts';

export default class MyEcharts {
  public disContainer1: any = null;
  public disContainer2: any = null;
  public disContainer3: any = null;

  constructor() {
    this.initEcharts();
  }

  // 初始化
  public initEcharts(): void {
    const disContainer1: any = document.querySelector('#disContainer1');
    this.disContainer1 = echarts.init(disContainer1);

    const disContainer2: any = document.querySelector('#disContainer2');
    this.disContainer2 = echarts.init(disContainer2);

    const disContainer3: any = document.querySelector('#disContainer3');
    this.disContainer3 = echarts.init(disContainer3);

    window.addEventListener('resize', () => {
      this.disContainer1.resize();
      this.disContainer2.resize();
      this.disContainer3.resize();
    });
  }

  // 清除
  public clearContainer(el: string) {
    (this as any)[el].clear();
  }

  // 配置项
  // el: 容器id
  // x: x轴数据
  // bar: y轴数据 柱状图
  // line: y轴数据 折线图
  // name: 数据标题
  public echartsOption(params: any): void {
    const option: any = {
      color: params.color,
      title: {
        show: false,
      },
      series: [
        {
          name: '处置率',
          type: 'pie',
          radius: ['90%', '100%'],
          avoidLabelOverlap: false,
          hoverAnimation: false,
          label: {
            color: '#fff',
            show: false,
            position: 'center',
            textStyle: {
              fontSize: 15,
            },
            formatter: '{c}{a|%}',
            rich: {
              a: {
                fontSize: 18,
                color: '#fff',
              },
            },
          },
          data: [
            {
              value: params.value,
              name: '处置',
              label: {
                show: true,
              },
            },
            {
              value: params.unVal,
              name: '',
            },
          ],
        },
      ],
    };
    (this as any)[params.el].setOption(option, true);
  }
}
