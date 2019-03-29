interface Params {
  el: string
  [propName: string]: any
}

import { judgeType } from '@/libs/util.ts'

class MyMap {
  public el: string = '' // 地图容器
  public map: any = null // 地图实例
  public mapCenter: Array<number | string> = [107.608937, 33.429569] // 默认地图中心点
  public mapStyle: string[] = ['amap://styles/normal', 'amap://styles/dark'] // 自定义地图 0 标准 1 自定义
  public heatmap: any = null // 热力图

  public provincePointGroup: any = new AMap.OverlayGroup() // 省级点集合 上海市
  public provinceBorderGroup: any = new AMap.OverlayGroup() // 省级边界集合 上海市

  public cityPointGroup: any = new AMap.OverlayGroup() // 市级点集合 徐汇区
  public cityBorderGroup: any = new AMap.OverlayGroup() // 市级边界集合 徐汇区

  public areaPointGroup: any = new AMap.OverlayGroup() // 区级点集合 街道
  public areaBorderGroup: any = new AMap.OverlayGroup() // 区级边界集合 街道
  public ApointEvent: Array<any> = [] // 区级点事件

  public isPointInfo: boolean = true // 行政区域点是否显示

  public workOrderGroup: any = new AMap.OverlayGroup() // 工单集合

  public workEvent: any = {} // 工单集合的事件

  constructor(data: Params) {
    this.el = data.el

    this.initMap()
    this.initHeatMap()

    this.maoEvent()
  }

  // 初始化地图
  private initMap(): void {
    this.map = new AMap.Map(this.el, {
      mapStyle: this.mapStyle[1], // 自定义地图样式
      zoom: 4, // 地图级别
      center: this.mapCenter, // 中心点
      resizeEnable: true, //监控地图容器尺寸变化
      expandZoomRange: true // 是否支持可以扩展最大缩放级别 到20级
    })

    // 添加图层
    this.map.add([
      this.workOrderGroup,
      this.provincePointGroup,
      this.provinceBorderGroup,
      this.cityPointGroup,
      this.cityBorderGroup,
      this.areaPointGroup,
      this.areaBorderGroup
    ])
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
        imageSize: new AMap.Size(22, 22)
      }), // 添加 Icon 图标 URL
      extData: { code: data.sheetCode }
    })
    return marker
  }

  // 修改工单状态
  public updateWorkPoint(index: number, icon: string): void {
    this.workOrderGroup.getOverlays()[index].setIcon(icon)
  }

  // 显示/隐藏 工单
  public isWorkGroup(flag: boolean): void {
    flag ? this.workOrderGroup.show() : this.workOrderGroup.hide()
  }

  // 工单事件
  public workGroupEvent(callback: Function): void {
    AMap.event.removeListener(this.workEvent)

    this.workEvent = AMap.event.addListener(
      this.workOrderGroup,
      'click',
      callback
    )
  }

  // 地图事件
  public maoEvent(): void {
    // 地图缩放级别
    this.map.on('zoomend', () => {
      this.pointGroupControl()
    })
  }

  // 行政区域显示/隐藏控制
  public pointGroupControl(): void {
    if (!this.isPointInfo) {
      this.provincePointGroup.hide()
      this.cityPointGroup.hide()
      this.areaPointGroup.hide()
      return
    } else {
      const zoom: number = this.map.getZoom()

      // console.log(zoom)
      if (zoom < 14 && zoom > 11 && this.isPointInfo) {
        this.cityPointGroup.show()
      } else {
        this.cityPointGroup.hide()
      }

      if (zoom > 13 && zoom < 16 && this.isPointInfo) {
        this.areaPointGroup.show()
      } else {
        this.areaPointGroup.hide()
      }
    }
  }

  //向组里面添加覆盖物
  public addOverlayGroup(item: string, overlay: any): any {
    const type: string = judgeType(overlay)
    if (type == 'object') {
      ;(this as any)[item].addOverlay(overlay)
    } else if (type === 'array') {
      ;(this as any)[item].addOverlays(overlay)
    }
    return (this as any)[item]
  }

  // 创建市级点
  public createCityPoint(markData: any): object {
    const marker: object = new AMap.Marker({
      position: new AMap.LngLat(markData.lng, markData.lat),
      offset: new AMap.Pixel(-40, -40),
      content: this.setContent(markData),
      extData: { code: markData.name }
    })
    return marker
  }

  // 修改市级点
  public upDateCityPoint(markData: any): void {
    this.cityPointGroup.getOverlays()[0].setContent(this.setContent(markData))
  }

  // 设置内容
  public setContent(row: any): string {
    return `<div class="adminPoint" style="background-color: #db36f5;opacity: 0.8;color:#ffffff; height: 110px; width: 110px; border-radius: 50%;">
        <div style="padding-top:20px;text-align: center;">
          <p style="margin:0;padding-bottom:10px">${row.name}</p>
          <p style="margin:0">总量:${row.bicycleNum}</p>
          <p style="margin:0">活跃率:${row.activeNum}</p>
        </div>
      </div>
    `
  }

  // 创建区级 边界
  public createAreaBorder(path: Array<[]>): object {
    const polygon: object = new AMap.Polygon({
      path: path,
      strokeColor: '#db36f5',
      strokeWeight: 2,
      strokeOpacity: 1,
      fillColor: '#0d2055',
      fillOpacity: 0
    })
    return polygon
  }

  // 创建区级点
  public createAreaPoint(markData: any): object {
    const marker: object = new AMap.Marker({
      position: new AMap.LngLat(markData.lng, markData.lat),
      offset: new AMap.Pixel(-40, -40),
      topWhenClick: true,
      content: this.setContent(markData),
      extData: { index: markData.index }
    })
    return marker
  }

  // 区级点 事件
  public AreaPointEvent(): void {
    // 事件先清除再添加
    this.ApointEvent.forEach((item: any) => {
      AMap.event.removeListener(item)
    })
    this.ApointEvent = []

    this.ApointEvent.push(
      AMap.event.addListener(this.areaPointGroup, 'mousemove', (e: any) => {
        const index: number = e.target.getExtData().index
        this.areaBorderGroup.getOverlays()[index].show()
      })
    )
    this.ApointEvent.push(
      AMap.event.addListener(this.areaPointGroup, 'mouseout', (e: any) => {
        const index: number = e.target.getExtData().index
        this.areaBorderGroup.getOverlays()[index].hide()
      })
    )
  }

  // 修改市级点
  public upDateAreaPoint(index: number, markData: any): void {
    this.areaPointGroup
      .getOverlays()
      [index].setContent(this.setContent(markData))
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
            1: 'red'
          }
        })
      }
    )
    this.isHeatMap(false)
  }

  // 显示/隐藏 热力图
  public isHeatMap(flag: boolean): void {
    flag ? this.heatmap.show() : this.heatmap.hide()
  }

  // 设置热力图展现的数据集
  public setHeatMapData(points: any, max: number = 80): void {
    this.heatmap.setDataSet({ data: points, max })
  }

  // 绘制 遮罩 行政边界
  public initShade(path: Array<string | number>): void {
    // 全图大遮罩
    let pathArray: Array<{}> = [
      [
        new AMap.LngLat(-360, 90, true),
        new AMap.LngLat(-360, -90, true),
        new AMap.LngLat(360, -90, true),
        new AMap.LngLat(360, 90, true)
      ]
    ]

    // 抠图
    pathArray.push.apply(pathArray, [path])

    const polygon: any = new AMap.Polygon({
      path: pathArray,
      // strokeColor: '#db36f5',
      strokeColor: '#6A37CB',
      strokeWeight: 2,
      strokeOpacity: 1,
      fillColor: '#0d2055',
      fillOpacity: 0.4
    })

    // polygon.setPath(pathArray)
    this.map.add(polygon)
  }

  // 设置地图样式id：0 标准 1 自定义
  public setMapStyle(id: number = 0): void {
    this.map.setMapStyle(this.mapStyle[id])
  }

  // 设置地图中心点和缩放级别 coord 数组
  public setZoomAndCenter(
    zoom: number = 10,
    coord: Array<string | number> = this.mapCenter
  ): void {
    this.map.setZoomAndCenter(zoom, coord)
  }
}

export default MyMap
