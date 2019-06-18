interface Params {
  el: string;
  [propName: string]: any;
}
import circleShow from './circleShow';
import { judgeType } from '@/libs/util.ts';

class MyMap {
  public el: string = ''; // 地图容器
  public map: any = null; // 地图实例
  public mapCenter: Array<number | string> = [107.608937, 33.429569]; // 默认地图中心点
  public mapStyle: string[] = ['amap://styles/normal', 'amap://styles/dark']; // 自定义地图 0 标准 1 自定义
  public heatmap: any = null; // 热力图

  public provincePointGroup: any = new AMap.OverlayGroup(); // 省级点集合 上海市
  public provinceBorderGroup: any = new AMap.OverlayGroup(); // 省级边界集合 上海市

  public cityPointGroup: any = new AMap.OverlayGroup(); // 市级点集合 徐汇区
  public cityBorderGroup: any = new AMap.OverlayGroup(); // 市级边界集合 徐汇区

  public areaPointGroup: any = new AMap.OverlayGroup(); // 区级点集合 街道
  public areaBorderGroup: any = new AMap.OverlayGroup(); // 区级边界集合 街道
  public ApointEvent: any[] = []; // 区级点事件
  public CpointEvent: any[] = []; // 市级点事件

  public isPointInfo: boolean = true; // 行政区域点是否显示

  public workOrderGroup: any = new AMap.OverlayGroup(); // 工单集合

  public workEvent: any[] = []; // 工单集合的事件

  public stationGroup: any = new AMap.OverlayGroup(); // 嗅探集合
  public rippleGroup: any = new AMap.OverlayGroup(); // 水波效果集合
  public stationFunc: any = null; // 嗅探功能点
  public stationEvent: any[] = []; // 蓝牙点事件

  public ripples: any = {}; // 水波纹效果实例

  public staffGroup: any = new AMap.OverlayGroup(); // 人员位置集合
  public staffEvent: any[] = []; // 人员位置事件集合

  public forbidGroup: any = new AMap.OverlayGroup(); // 禁停区集合
  public forbidEvent: any[] = []; // 禁停区事件集合

  constructor(data: Params) {
    this.el = data.el;

    this.initMap();
    this.initHeatMap();

    this.mapEvent();
    this.creactStationFunc();
  }

  // 创建禁停区
  public createForbid(data: any, flag: boolean): object {
    const polygon: any =  new AMap.Polygon({
      path: data.geom, // 点集合
      fillColor: 'red', // 多边形填充颜色
      fillOpacity: 0.2, // 填充颜色
      strokeColor: 'red', // 线条颜色
      strokeWeight: 2, // 线条宽度，默认为 1
      cursor: 'pointer',
      extData: data,
    });
    flag ? polygon.show() : polygon.hide();
    return polygon;
  }

  // 修改禁停区
  public upDataForbid(data: any): void {
    const target = this.forbidGroup.getOverlays().find(
      (item: any): boolean => {
        return item.he.extData.regionName === data.regionName;
      },
    );

    // target.setPath(data.geom);
    target.setExtData(data);
  }

  // 是否显示人员位置点
  public isForbidGroup(flag: boolean): void {
    flag ? this.forbidGroup.show() : this.forbidGroup.hide();
  }

  // 禁停区事件点
  public forbidGroupEvent(callback: any): void {
    // 事件先清除再添加
    this.forbidEvent.forEach((item: any) => {
      AMap.event.removeListener(item);
    });

    this.forbidEvent = [];

    this.forbidEvent.push(
      AMap.event.addListener(this.forbidGroup, 'click', (e: any) => {
        const data: string = e.target.getExtData().regionName;

        if (data) {
          callback(data);
        }
      }),
    );
  }

  // 创建人员位置点
  public createStaffPoint(data: any, icon: any, flag: boolean): object {
    const marker: any = new AMap.Marker({
      position: new AMap.LngLat(data.gpsLongitude, data.gpsLatitude),
      offset: new AMap.Pixel(-11, -11),
      topWhenClick: true,
      icon: new AMap.Icon({
        size: new AMap.Size(22, 22),
        image: icon,
        imageSize: new AMap.Size(22, 22),
      }), // 添加 Icon 图标 URL
      extData: { code: data.code, id: data.userId },
    });
    flag ? marker.show() : marker.hide();
    return marker;
  }

  // 修改人员位置点
  public upDataStaffPoint(data: any): void {
    const target = this.staffGroup.getOverlays().find(
      (item: any): boolean => {
        return item.he.extData.id === data.userId;
      },
    );

    target.setPosition(new AMap.LngLat(data.gpsLongitude, data.gpsLatitude));
  }

  // 筛选人员位置点
  public screenStaffPoint(code: string): void {
    this.staffGroup.getOverlays().forEach(
      (item: any): void => {
        if (item.he.extData.code.includes(code)) {
          item.show();
        } else {
          item.hide();
        }
      },
    );
  }

  // 人员事件点
  public staffGroupEvent(callback: any): void {
    // 事件先清除再添加
    this.staffEvent.forEach((item: any) => {
      AMap.event.removeListener(item);
    });

    this.staffEvent = [];

    this.staffEvent.push(
      AMap.event.addListener(this.staffGroup, 'click', (e: any) => {
        const id: string = e.target.getExtData().id;

        if (id) {
          callback(id);
        }
      }),
    );
  }

  // 是否显示人员位置点
  public isStaffGroup(flag: boolean): void {
    flag ? this.staffGroup.show() : this.staffGroup.hide();
  }

  // 是否显示蓝牙嗅探相关
  public isStationPoint(flag: boolean): void {
    if (flag) {
      this.stationGroup.show();
      this.rippleGroup.show();

      Object.values(this.ripples).forEach((item: any) => {
        item.start();
      });
    } else {
      this.stationGroup.hide();
      this.rippleGroup.hide();
      this.stationFunc.hide();

      Object.values(this.ripples).forEach((item: any) => {
        item.end();
      });
    }
  }

  // 创建蓝牙嗅探（蓝牙基站）点
  public createStationPoint(data: any): object {
    const position = new AMap.LngLat(data.centerLng, data.centerLat);
    const marker: object = new AMap.Marker({
      position,
      offset: new AMap.Pixel(-11, -11),
      content: this.setStationContent(data),
      topWhenClick: true,
      extData: { code: data.terminalId },
    });

    const circle = new circleShow({
      center: position,
      radius: 30,
      level: 3,
      color: {
        fillColor: this.BleColor(data),
        fillOpacity: 1,
      },
    });

    this.ripples[data.terminalId] = circle;

    this.addOverlayGroup('rippleGroup', circle.circleGroup);

    return marker;
  }

  // 修改蓝牙点
  public updatedStationPoint(data: any): void {
    const target = this.stationGroup.getOverlays().find(
      (item: any): boolean => {
        return item.he.extData.code === data.terminalId;
      },
    );

    // 修改水波颜色
    this.ripples[data.terminalId].color.fillColor = this.BleColor(data);

    target.setContent(this.setStationContent(data));
  }

  // 蓝牙点事件
  public stationGroupEvent(callback: any): void {
    // 事件先清除再添加
    this.stationEvent.forEach((item: any) => {
      AMap.event.removeListener(item);
    });

    this.stationEvent = [];

    this.stationEvent.push(
      AMap.event.addListener(this.stationGroup, 'click', (e: any) => {
        const code: string = e.target.getExtData().code;

        if (code) {
          callback(code);
        }
      }),
    );
  }

  // 创建蓝牙嗅探（蓝牙基站） 功能点
  public creactStationFunc(): void {
    this.stationFunc = new AMap.Marker({
      position: new AMap.LngLat(0, 0),
      offset: new AMap.Pixel(-27, -27),
      content: this.setStationFuncContent(),
    });
    this.stationFunc.hide();
    this.map.add(this.stationFunc);
  }

  // 打开嗅探功能
  public openStationFunc(position: any): void {
    this.stationFunc.setPosition(position);
    this.stationFunc.show();
  }

  // 关闭嗅探功能
  public closeStationFunc() {
    this.stationFunc.hide();
  }

  // 设置 蓝牙嗅探功能的样式
  public setStationFuncContent(): string {
    return `<div class="station-func-box animated rotateIn">
      <div class="point-location" data-type="点位"></div>
      <div class="list-info" data-type="列表"></div>
      <div class="statistics" data-type="统计"></div>
      <div class="bad" data-type="僵尸车"></div>
    </div>`;
  }

  // 判断蓝牙状态返回颜色
  public BleColor(data: any): string {
    let color: string = '';
    if (data.onLineStatus === '在线') {
      if (data.warningStatus === '正常') {
        // 绿色
        color = '#7ED321';
      } else if (data.warningStatus === '饱和') {
        // 黄色
        color = '#F5A623';
      } else if (data.warningStatus === '报警') {
        // 红色
        color = '#D0021B';
      } else {
        // 防报错 绿色
        color = '#7ED321';
      }
    } else {
      // 灰色
      color = '#979797';
    }

    return color;
  }

  // 设置蓝牙嗅探（蓝牙基站）点样式
  public setStationContent(data: any): string {
    return `<div style="width:22px;height:22px;background:${this.BleColor(data)};border-radius: 50%;"></div>`;
  }

  // 创建工单
  public createWorkPoint(data: any, icon: string): object {
    const marker: object = new AMap.Marker({
      position: new AMap.LngLat(data.lng, data.lat),
      offset: new AMap.Pixel(-11, -11),
      topWhenClick: true,
      icon: new AMap.Icon({
        size: new AMap.Size(22, 22),
        image: icon,
        imageSize: new AMap.Size(22, 22),
      }), // 添加 Icon 图标 URL
      extData: { code: data.sheetCode },
    });
    return marker;
  }

  // 修改工单状态
  public updateWorkPoint(index: number, icon: string): void {
    this.workOrderGroup.getOverlays()[index].setIcon(icon);
  }

  // 显示/隐藏 工单
  public isWorkGroup(flag: boolean): void {
    flag ? this.workOrderGroup.show() : this.workOrderGroup.hide();
  }

  // 工单事件
  public workGroupEvent(callback: any): void {
    // 事件先清除再添加
    this.workEvent.forEach((item: any) => {
      AMap.event.removeListener(item);
    });

    this.workEvent = [];

    this.workEvent.push(
      AMap.event.addListener(this.workOrderGroup, 'click', (e: any) => {
        const code: string = e.target.getExtData().code;

        if (code) {
          callback(code);
        }
      }),
    );
  }

  // 地图事件
  public mapEvent(): void {
    // 地图缩放级别
    this.map.on('zoomend', () => {
      this.pointGroupControl();
    });
  }

  // 行政区域显示/隐藏控制
  public pointGroupControl(): void {
    if (!this.isPointInfo) {
      this.provincePointGroup.hide();
      this.cityPointGroup.hide();
      this.areaPointGroup.hide();
      return;
    } else {
      const zoom: number = this.map.getZoom();

      // console.log(zoom)
      if (zoom < 14 && zoom > 11 && this.isPointInfo) {
        this.cityPointGroup.show();
      } else {
        this.cityPointGroup.hide();
      }

      if (zoom > 13 && zoom < 16 && this.isPointInfo) {
        this.areaPointGroup.show();
      } else {
        this.areaPointGroup.hide();
      }
    }
  }

  // 向组里面添加覆盖物
  public addOverlayGroup(item: string, overlay: any): any {
    const type: string = judgeType(overlay);
    if (type === 'object') {
      (this as any)[item].addOverlay(overlay);
    } else if (type === 'array') {
      (this as any)[item].addOverlays(overlay);
    }
    return (this as any)[item];
  }

  // 创建市级点
  public createCityPoint(markData: any): object {
    const marker: object = new AMap.Marker({
      position: new AMap.LngLat(markData.lng, markData.lat),
      offset: new AMap.Pixel(-65, -65),
      content: this.setContent(markData),
      extData: { data: markData },
    });
    return marker;
  }

  // 市级点 事件
  public CityPointEvent(): void {
    // 事件先清除再添加
    this.CpointEvent.forEach((item: any) => {
      AMap.event.removeListener(item);
    });
    this.CpointEvent = [];

    this.CpointEvent.push(
      AMap.event.addListener(this.cityPointGroup, 'click', (e: any) => {
        this.setZoomAndCenter(14, e.lnglat);
      }),
    );
    this.CpointEvent.push(
      AMap.event.addListener(this.cityPointGroup, 'mousemove', (e: any) => {
        const tagNode = e.target.he.contentDom.children[0];
        tagNode.style.backgroundColor = this.getColor(1000);
      }),
    );
    this.CpointEvent.push(
      AMap.event.addListener(this.cityPointGroup, 'mouseout', (e: any) => {
        const tagNode = e.target.he.contentDom.children[0];
        tagNode.style.backgroundColor = this.getColor(-1);
      }),
    );
  }

  // 修改市级点
  public upDateCityPoint(markData: any): void {
    this.cityPointGroup.getOverlays()[0].setContent(this.setContent(markData));
  }

  // 状态转颜色
  public getColor(state: number = -1): string {
    let color: string = '';
    switch (state) {
      case -1:
        color = '#8094dd';
        break;
      case 1:
        color = '#fe4a5d';
        break;
      case 0:
        color = '#ff6d10';
        break;
      default:
        color = '#db36f5';
    }
    return color;
  }

  // 设置内容 蓝色： #8094dd 紫色：#db36f5 黄色：#FF6D10
  public setContent(row: any, state: number = -1): string {
    return `<div class="adminPoint" style="font-size:16px;font-weight:bold;background-color: ${this.getColor(
      state,
    )};opacity: 0.8;color:#ffffff; height: 130px; width: 130px; border-radius: 50%;">
        <div style="width:100%;
                    height:100%;
                    display:flex;
                    flex-direction:column;
                    justify-content:center;
                    align-items: center;">
          <p style="margin:0;padding-bottom:10px">${row.name}</p>
          <p style="margin:0">总量:${row.bicycleNum}</p>
          <p style="margin:0;margin-top:5px;">活跃率:${row.activeNum}</p>
        </div>
      </div>
    `;
  }

  // 创建区级 边界
  public createAreaBorder(path: Array<[]>, name: string): object {
    const polygon: object = new AMap.Polygon({
      path,
      strokeColor: '#db36f5',
      strokeWeight: 2,
      strokeOpacity: 1,
      fillColor: '#0d2055',
      fillOpacity: 0,
      extData: {
        name,
      },
    });
    return polygon;
  }

  // 创建区级点
  public createAreaPoint(markData: any): object {
    const marker: object = new AMap.Marker({
      position: new AMap.LngLat(markData.lng, markData.lat),
      offset: new AMap.Pixel(-65, -65),
      topWhenClick: true,
      content: this.setContent(markData, markData.state),
      extData: {
        index: markData.index,
        name: markData.name,
        state: markData.state,
      },
    });
    return marker;
  }

  // 区级点 事件
  public AreaPointEvent(callback: any): void {
    // 小优化
    let nameFlag: string = '';
    // 事件先清除再添加
    this.ApointEvent.forEach((item: any) => {
      AMap.event.removeListener(item);
    });
    this.ApointEvent = [];

    this.ApointEvent.push(
      AMap.event.addListener(this.areaPointGroup, 'click', (e: any) => {
        const name: string = e.target.getExtData().name;

        if (name) {
            callback(name);
          }
      }),
    );
    this.ApointEvent.push(
      AMap.event.addListener(this.areaPointGroup, 'mousemove', (e: any) => {
        const name: string = e.target.getExtData().name;
        if (nameFlag !== name) {
          const tagNode = e.target.he.contentDom.children[0];
          // 显示边界
          this.areaBorderGroup
            .getOverlays()
            .find(
              (item: any): boolean => {
                return item.he.extData.name === name;
              },
            )
            .show();
          nameFlag = name;
          // 选中状态
          tagNode.style.backgroundColor = this.getColor(100);
        }
      }),
    );
    this.ApointEvent.push(
      AMap.event.addListener(this.areaPointGroup, 'mouseout', (e: any) => {
        const params: any = e.target.getExtData();
        const name: string = params.name;
        const state: number = params.state;
        const tagNode = e.target.he.contentDom.children[0];
        // 隐藏边界
        this.areaBorderGroup
          .getOverlays()
          .find(
            (item: any): boolean => {
              return item.he.extData.name === name;
            },
          )
          .hide();
        tagNode.style.backgroundColor = this.getColor(state);
        nameFlag = '';
      }),
    );
  }

  // 修改区级点
  public upDateAreaPoint(name: string, markData: any): void {
    const Evnet = this.areaPointGroup.getOverlays().find(
      (item: any): boolean => {
        return item.he.extData.name === name;
      },
    );

    Evnet.setContent(this.setContent(markData, markData.state));
    Evnet.setExtData({
      index: markData.index,
      name: markData.name,
      state: markData.state,
    });
  }

  // 初始化热力图
  public initHeatMap(): void {
    this.map.plugin(
      ['AMap.Heatmap'],
      (): void => {
        this.heatmap = new AMap.Heatmap(this.map, {
          radius: 20,
          opacity: [0, 0.8],
          gradient: {
            0.1: 'yellow',
            0.25: 'yellow',
            0.55: 'yellow',
            0.85: 'yellow',
            1: 'red',
          },
        });
      },
    );
    this.isHeatMap(false);
  }

  // 显示/隐藏 热力图
  public isHeatMap(flag: boolean): void {
    flag ? this.heatmap.show() : this.heatmap.hide();
  }

  // 设置热力图展现的数据集
  public setHeatMapData(points: any, max: number = 80): void {
    this.heatmap.setDataSet({ data: points, max });
  }

  // 绘制 遮罩 行政边界
  public initShade(path: Array<string | number>): void {
    // 全图大遮罩
    const pathArray: Array<{}> = [
      [
        new AMap.LngLat(-360, 90, true),
        new AMap.LngLat(-360, -90, true),
        new AMap.LngLat(360, -90, true),
        new AMap.LngLat(360, 90, true),
      ],
    ];

    // 抠图
    pathArray.push.apply(pathArray, [path]);

    const polygon: any = new AMap.Polygon({
      path: pathArray,
      // strokeColor: '#db36f5',
      strokeColor: '#6A37CB',
      strokeWeight: 2,
      strokeOpacity: 1,
      fillColor: '#0d2055',
      fillOpacity: 0.4,
    });

    // polygon.setPath(pathArray)
    this.map.add(polygon);
  }

  // 设置地图样式id：0 标准 1 自定义
  public setMapStyle(id: number = 0): void {
    this.map.setMapStyle(this.mapStyle[id]);
  }

  // 设置地图中心点和缩放级别 coord 数组
  public setZoomAndCenter(
    zoom: number = 10,
    coord: any = this.mapCenter,
  ): void {
    this.map.setZoomAndCenter(zoom, coord);
  }

  // 初始化地图
  private initMap(): void {
    this.map = new AMap.Map(this.el, {
      mapStyle: this.mapStyle[1], // 自定义地图样式
      zoom: 4, // 地图级别
      center: this.mapCenter, // 中心点
      resizeEnable: true, // 监控地图容器尺寸变化
      expandZoomRange: true, // 是否支持可以扩展最大缩放级别 到20级
    });

    // 添加图层
    this.map.add([
      this.workOrderGroup,
      this.provincePointGroup,
      this.provinceBorderGroup,
      this.cityPointGroup,
      this.cityBorderGroup,
      this.areaPointGroup,
      this.areaBorderGroup,
      this.stationGroup,
      this.rippleGroup,
      this.staffGroup,
      this.forbidGroup,
    ]);
  }
}

export default MyMap;
