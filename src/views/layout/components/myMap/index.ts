import { Component, Vue } from 'vue-property-decorator'
import slideshow from '@/components/slideshow/index.vue'
import bicyTrendChart from './components/bicyTrendChart.vue'
import stationInfo from './components/stationInfo.vue'
import bluStatistics from './components/bluStatistics.vue'
import { arrGroup, refinedCal, eventDelegate } from '@/libs/util.ts'
import API from '@/api/index.ts'
import MyMap from './map'
import moment from 'moment'

moment.locale('zh-cn')

let myMap: any = null // 地图实例

interface DataFormat {
  centerLongitude: number // 中心点
  centerLatitude: number // 中心点
  polygonGeom: string // 边界
  gisLevel?: number // 放大级别
  name: string // 区域名称
  bicycleNum: number // 车辆数
  activeNum: number // 活跃数
  activeRate?: number // 活跃率
  warningFlag?: number // 预警状态
  companyCode?: string // 预警状态
}

@Component({
  components: {
    slideshow,
    bicyTrendChart,
    stationInfo,
    bluStatistics
  }
})
export default class Map extends Vue {
  private loadNum: number = 0 // 加载次数
  private cityPointData: any = {} // 市级点数据
  private areaPointData: any = {} // 区级点数据

  private settingShow: boolean = true // 设置是否打开

  // 企业数据
  private enterpriseData: Array<{}> = [
    {
      name: '摩拜',
      code: '07mobike'
    },
    {
      name: 'ofo',
      code: '05ofo'
    },
    {
      name: '哈罗',
      code: '03hellobike'
    }
  ]

  private selectEnterpriseCode: string = 'all' // 选择的企业

  // 设置项
  private settingItemData: Array<{}> = [
    {
      state: false,
      name: '热力图'
    },
    {
      state: true,
      name: '夜间模式'
    },
    {
      state: true,
      name: '街镇信息'
    },
    {
      state: true,
      name: '禁停区域'
    },
    {
      state: true,
      name: '单车治理'
    },
    {
      state: false,
      name: '治理轮循'
    }
    // {
    //   state: false,
    //   name: '预警播报'
    // }
  ]

  // 工单数据
  private workOrderObjData: any = {}
  // 不同状态的工单数据 点击图例用
  private sheetWorkOrder: Array<any> = []

  // 点覆盖添加的顺序
  private pointMarkerIndex: number = 0
  // 治理轮循
  private roundRobinData: Array<any> = []
  // 工单处理数据
  private workOrderDisposeData: any = null
  // 工单轮播配置
  private workOrderDisposeOptions: any = null
  // 是否显示工单详情
  private isShowWorkOrderDispose: boolean = false

  // 治理轮循数据
  private roundRobinOptions: any = null
  // 是否显示治理轮循
  private isShowRoundRobinData: boolean = false

  //是否显示图例
  private isShowLegend: boolean = true
  //是否显示表格
  private isShowLegendTab: boolean = false
  // 当前选中的图例
  private selectLegend: number | string = -1

  // 图例数据
  private legendData: Array<{ icon: any; name: string }> = [
    {
      icon: require('@img/icon_1@3x.png'),
      name: '自检'
    },
    {
      icon: require('@img/icon_2@3x.png'),
      name: '已派单'
    },
    {
      icon: require('@img/icon_3@3x.png'),
      name: '处理中'
    },
    {
      icon: require('@img/icon_4@3x.png'),
      name: '已处理'
    },
    {
      icon: require('@img/icon_5@3x.png'),
      name: '超时未处理'
    }
  ]

  // 图例统计数据
  private legendTabHead: Array<any> = [
    [
      {
        name: '自检时间',
        width: 30
      },
      {
        name: '自检单位',
        width: 26
      },
      {
        name: '整理数',
        width: 22
      },
      {
        name: '清运数',
        width: 22
      }
    ],
    [
      {
        name: '派单单位',
        width: 33
      },
      {
        name: '派单对象',
        width: 33
      },
      {
        name: '派单部门',
        width: 33
      }
    ],
    [
      {
        name: '派单时间',
        width: 33
      },
      {
        name: '派单对象',
        width: 33
      },
      {
        name: '已处理企业',
        width: 33
      }
    ],
    [
      {
        name: '派单时间',
        width: 25
      },
      {
        name: '派单对象',
        width: 20
      },
      {
        name: '处理时间',
        width: 25
      },
      {
        name: '整理数',
        width: 15
      },
      {
        name: '清运数',
        width: 15
      }
    ],
    [
      {
        name: '派单时间',
        width: 25
      },
      {
        name: '派单对象',
        width: 25
      },
      {
        name: '已处理企业',
        width: 25
      },
      {
        name: '超时企业',
        width: 25
      }
    ]
  ]

  // 打开弹窗记录街镇名称
  private openTownName: string = ''

  // 十五天单车曲线数据
  private bicyActiveData: any = {}

  // 单车曲线是否展示
  private isBicyTrend: boolean = false

  // 当前选中区域的单车区域数据
  private nowBicyTrendData: any = null

  // 市级别 按三家企业分数据
  private cityCompanyData: any = null

  // 区级别 按三家企业分数据
  private townCompanyData: any = null

  // 定时器保存
  private timeoutObjs: Array<any> = []

  // 蓝牙设备数据
  private bleContainStatus: any = {}

  // 当前选中的蓝牙基站
  private thisBleStation: string = ''

  // 是否显示蓝牙点位信息
  private isBleStatus: boolean = false

  // 显示的蓝牙点位数据
  private BleStationData: any = null

  created() {
    this.getBicyActiveCurve()
  }

  mounted() {
    myMap = new MyMap({ el: 'mapContainer' })
    this.getTownBoundary()
    this.getBicyClePosition()
    this.getAreaIdAndDate()
    this.getBleContainStatus()

    this.stationFuncEvent()
  }

  // 获取区域15天的活跃曲线数据
  private getBicyActiveCurve(companyCode: string = ''): void {
    API.getBicyActiveCurve(companyCode).then(
      (res: any): void => {
        this.bicyActiveData = res.changeLine
      }
    )
  }

  // 获取蓝牙设备数据
  private getBleContainStatus(): void {
    API.getBleContainStatus().then(
      (res: any): void => {
        if (res.status === 0) {
          res.data.forEach(
            (item: any): void => {
              if (this.bleContainStatus[item.terminalId]) {
                myMap.updatedStationPoint(item)
              } else {
                myMap.addOverlayGroup(
                  'stationGroup',
                  myMap.createStationPoint(item)
                )
              }
              this.bleContainStatus[item.terminalId] = item
            }
          )

          myMap.stationGroupEvent((code: string) => {
            const data: any = this.bleContainStatus[code]
            myMap.closeStationFunc()

            if (this.thisBleStation !== code) {
              myMap.openStationFunc([data.centerLng, data.centerLat])
              this.thisBleStation = code
            } else {
              this.thisBleStation = ''
            }
          })
        }
      }
    )
  }

  /**
   * 蓝牙嗅探事件绑定
   */
  private stationFuncEvent(): void {
    eventDelegate('#mapContainer', '.station-func-box', 'click', (e: any) => {
      const type = e[0].target.dataset.type
      if (type) {
        switch (type) {
          case '点位':
            this.BleStationData = this.bleContainStatus[this.thisBleStation]
            this.isBleStatus = true
            break
          case '列表':
            break
          case '统计':
            break
          case '僵尸车':
            break
        }
      } else {
        myMap.closeStationFunc()
        this.thisBleStation = ''
      }
    })
  }

  /**
   * 选择设置项
   */
  private selectSetItem(data: any): void {
    data.state = !data.state

    switch (data.name) {
      case '热力图':
        myMap.isHeatMap(data.state)
        break
      case '夜间模式':
        myMap.setMapStyle(data.state ? 1 : 0)
        break
      case '街镇信息':
        myMap.isPointInfo = data.state
        myMap.pointGroupControl()
        break
      case '禁停区域':
        break
      case '单车治理':
        this.isShowLegend = data.state
        myMap.isWorkGroup(data.state)
        break
      case '治理轮循':
        this.$nextTick(function() {
          this.roundRobinOptions = {
            autoplay: true, //可选选项，自动滑动
            simulateTouch: false,
            observer: true, // 修改swiper自己或子元素时，自动初始化swiper
            observeParents: true, // 修改swiper的父元素时，自动初始化swiper
            $isPage: true,
            $isNav: true,
            pagination: {
              el: '.workOrders .swiper-pagination',
              clickable: true
            },
            navigation: {
              nextEl: '.workOrders .swiper-button-next',
              prevEl: '.workOrders .swiper-button-prev'
            },
            loop: true
          }
          this.isShowRoundRobinData = data.state
        })
        break
      case '预警播报':
        break
    }
  }

  /**
   * 选择图例获取 对应状态工单
   */
  private showLegendTable(index: number | string) {
    this.$nextTick(function() {
      this.selectLegend = index
      this.isShowLegendTab = true
    })
  }

  /**
   * 无闪动刷新点
   */
  private refreshPointData(data: any): void {
    let workOrderObjItem: any = {},
      icon: any = null

    data.forEach((item: any, index: number) => {
      workOrderObjItem = this.workOrderObjData[item.sheetCode]

      if (workOrderObjItem) {
        // 工单存在 判断状态
        if (item.sheetStatus !== workOrderObjItem.sheetStatus) {
          // 状态改变了重新赋值
          for (let key in item) {
            this.workOrderObjData[item.sheetCode][key] = item[key]
          }
          // 改变图标
          icon = this.judgeStatus(item.sheetCode, item.sheetStatus).icon
          myMap.updateWorkPoint(workOrderObjItem.addIndex, icon)

          // 治理轮循 修改数据
          this.roundRobinData[
            workOrderObjItem.addIndex
          ] = this.disposeWorkOrderDetails(item.sheetCode, 2)
        }
      } else {
        // 工单不存在
        item.addIndex = this.pointMarkerIndex // 记录添加顺序

        this.workOrderObjData[item.sheetCode] = item
        icon = this.judgeStatus(item.sheetCode, item.sheetStatus).icon

        myMap.addOverlayGroup(
          'workOrderGroup',
          myMap.createWorkPoint(item, icon)
        ) // 直接添加

        // 治理轮循 添加数据
        this.roundRobinData.push(
          this.disposeWorkOrderDetails(item.sheetCode, 2)
        )

        this.pointMarkerIndex++
      }
    })
  }

  /**
   * 处理显示工单详情
   * @param {String} code 工单编码
   * @param {Number} type 返回类型 1工单详情 2治理轮循
   */
  private disposeWorkOrderDetails(code: string, type: number) {
    let data: any = this.workOrderObjData[code]

    let statusData: any = this.judgeStatus(code, data.sheetStatus) // 格式状态

    let detailsTexts: any = [
      {
        key: statusData.isDespatch ? '派单时间' : '自检时间',
        val: moment(data.dispatchTime).format('YYYY-MM-DD HH:mm:ss')
      },
      {
        key: statusData.isDespatch ? '地点' : '自检地点',
        val: data.handleAddr
      },
      {
        key: statusData.isDespatch ? '处理单位' : '自检单位',
        val: statusData.isDespatch ? data.dispatchReceive : data.dispatchOrgName
      }
    ]

    let detailsImgs: Array<any> = [],
      roundRobinimg: any = null

    if (
      data.sheetStatus == -1 ||
      data.sheetStatus == 0 ||
      data.sheetStatus == 1 ||
      data.sheetStatus == 3
    ) {
      if (type === 1) {
        // 工单详情的图片数组
        detailsImgs = data.dispatchPhotoURLs.map((item: any) => {
          return {
            text: '派单照片',
            url: process.env.VUE_APP_IMG_URL + item
          }
        })

        if (data.sheetStatus == -1) {
          // detailsTexts.push({
          //   key: '超时时长',
          //   val: new Date(data.voList[data.voList.length - 1].handleTime).Format('yyyy-MM-dd hh:mm:ss')
          // })
        }
      } else {
        // 治理轮循的图片单张
        roundRobinimg = data.dispatchPhotoURLs[0]
      }
    } else if (data.sheetStatus == 2 || data.sheetStatus == 4) {
      let addDetailsTexts = [
        {
          key: '处理时间',
          val: moment(data.voList[data.voList.length - 1].handleTime).format(
            'YYYY-MM-DD HH:mm:ss'
          )
        },
        {
          key: '整理数',
          val: data.arrangeNum
        },
        {
          key: '清运数',
          val: data.cleanNum
        }
      ]
      detailsTexts = [...detailsTexts, ...addDetailsTexts]

      if (type === 1) {
        // 工单详情的图片数组
        detailsImgs = []
        let dispatchReceive = ''
        data.voList.forEach((item: any) => {
          dispatchReceive = statusData.isDespatch
            ? item.dispatchReceive
            : item.dispatchOrgName
          item.dispatchBeforePhotoURLs.forEach((beforeItem: any) => {
            detailsImgs.push({
              text: `${dispatchReceive}处理前`,
              url: process.env.VUE_APP_IMG_URL + beforeItem
            })
          })
          item.dispatchAfterPhotoURLs.forEach((afterItem: any) => {
            detailsImgs.push({
              text: `${dispatchReceive}处理后`,
              url: process.env.VUE_APP_IMG_URL + afterItem
            })
          })
        })
      } else {
        // 治理轮循的图片单张
        roundRobinimg =
          process.env.VUE_APP_IMG_URL +
          data.voList[data.voList.length - 1].dispatchAfterPhotoURLs[0]
      }
    }

    if (type === 1) {
      // 工单详情格式数据
      this.workOrderDisposeData = {
        nowStatus: statusData.nowStatus, //当前状态
        despatchStatus: statusData.despatchStatus, // 处理的状态
        classTimestamp: `container${Date.now()}`,
        detailsImgs, // 处理照片
        detailsTexts // 处理记录
      }

      this.$nextTick(function() {
        this.workOrderDisposeOptions = {
          autoplay: true, //可选选项，自动滑动
          simulateTouch: false,
          loop: detailsImgs.length > 1
        }
        this.isShowWorkOrderDispose = true
      })
    } else {
      return {
        nowStatus: statusData.nowStatus, //当前状态
        despatchStatus: statusData.despatchStatus, // 处理的状态
        roundRobinimg, // 处理照片
        detailsTexts // 处理记录
      }
    }
  }

  /**
   * 判断工单状态
   * @param {String} code 工单编号
   * @param {Number} status 工单状态
   * @return {Object} 对应工单的状态
   */
  private judgeStatus(code: string, status: number): any {
    let icon: any = null,
      nowStatus: string = '',
      despatchStatus: string = '',
      isDespatch: boolean = false
    // 自检
    if (code.includes('-CHECK-')) {
      isDespatch = false
      switch (status) {
        case 1:
          // 处理中
          nowStatus = '自检-处理中'
          despatchStatus = '企业处理中'
          icon = this.legendData[0].icon
          break
        case 2:
          // 已处理
          nowStatus = '自检完成'
          despatchStatus = '企业自检完毕'
          icon = this.legendData[0].icon
          break
      }
    }

    // 督办
    if (code.includes('-DISPATCH-')) {
      isDespatch = true
      switch (status) {
        case -1:
          // 超时
          nowStatus = '超时未处理'
          despatchStatus = '已推送街镇城运分中心,企业'
          icon = this.legendData[4].icon
          break
        case 0:
          // 未处理
          nowStatus = '已派单'
          despatchStatus = '已推送街镇城运分中心,企业'
          icon = this.legendData[1].icon
          break
        case 1:
          // 处理中
          nowStatus = '处理中'
          despatchStatus = '企业处理中'
          icon = this.legendData[2].icon
          break
        case 2:
          // 已处理
          nowStatus = '已处理'
          despatchStatus = '企业处理完毕'
          icon = this.legendData[3].icon
          break
        case 3:
          // 重新派单
          nowStatus = '已派单'
          despatchStatus = '已推送街镇城运分中心,企业'
          icon = this.legendData[1].icon
          break
        case 4:
          // 已完成
          nowStatus = '已处理'
          despatchStatus = '企业处理完毕'
          icon = this.legendData[3].icon
          break
      }
    }

    return { icon, nowStatus, despatchStatus, isDespatch }
  }

  /**
   * 获取指定街道/区单车治理情况
   */
  private getAreaIdAndDate(): void {
    let startTime: string = moment().format('YYYY-MM-DD')
    // let startTime = '2019-03-18'

    API.getAreaIdAndDate(startTime, startTime).then(
      (res: any): void => {
        if (res.status === 0) {
          // 先清除之前的请求
          if (this.timeoutObjs[0]) {
            clearTimeout(this.timeoutObjs[0])
            this.timeoutObjs[0] = null
          }
          // 数据处理
          this.refreshPointData(res.data)
          // 分拣不同状态工单
          this.sortOutWorkOrder(res.data)
          // 重置事件
          myMap.workGroupEvent((code: string) => {
            this.isShowWorkOrderDispose = false
            this.disposeWorkOrderDetails(code, 1)
          })

          // 定时刷新
          this.timeoutObjs[0] = setTimeout(() => {
            this.getAreaIdAndDate()
          }, 600000)
        }
      }
    )
  }

  /**
   * 分拣不同状态的工单
   */
  private sortOutWorkOrder(res: any): void {
    // 判断工单的类型
    let item: Array<any> = [],
      sortArr: Array<any> = []
    res.forEach((data: any) => {
      if (data.sheetCode.includes('-CHECK-')) {
        // 自检
        if (data.sheetStatus === 2) {
          // 自检只要 自检完成的
          if (!sortArr[0]) {
            sortArr[0] = []
          }
          item = [
            moment(data.dispatchTime).format('YYYY-MM-DD HH:mm:ss'),
            data.dispatchOrgName,
            data.arrangeNum,
            data.cleanNum
          ]
          sortArr[0].push(item)
        }
      } else {
        // 督办
        switch (data.sheetStatus) {
          case -1:
            // 超时未处理
            if (!sortArr[4]) {
              sortArr[4] = []
            }

            let disposeCompany = data.voList.map((item: any) => {
              return item.dealCompany
            })

            item = [
              moment(data.dispatchTime).format('YYYY-MM-DD HH:mm:ss'),
              data.dispatchReceive,
              disposeCompany.join(',')
            ]
            sortArr[4].push(item)
            break
          case 0:
          case 3:
            // 未处理
            // 重新派单
            if (!sortArr[1]) {
              sortArr[1] = []
            }

            item = [
              moment(data.dispatchTime).format('YYYY-MM-DD HH:mm:ss'),
              data.dispatchReceive,
              data.dispatchOrgName
            ]
            sortArr[1].push(item)
            break
          case 1:
            // 处理中
            if (!sortArr[2]) {
              sortArr[2] = []
            }
            item = [
              moment(data.dispatchTime).format('YYYY-MM-DD HH:mm:ss'),
              data.dispatchReceive,
              data.voList
                .map((item: any) => {
                  return item.dealCompany
                })
                .join(',')
            ]
            sortArr[2].push(item)
            break
          case 2:
          case 4:
            // 已处理
            // 已完成
            if (!sortArr[3]) {
              sortArr[3] = []
            }
            item = [
              moment(data.dispatchTime).format('YYYY-MM-DD HH:mm:ss'),
              data.dispatchReceive,
              moment(data.voList[data.voList.length - 1].handleTime).format(
                'YYYY-MM-DD HH:mm:ss'
              ),
              data.arrangeNum,
              data.cleanNum
            ]
            sortArr[3].push(item)
            break
        }
      }
    })
    this.sheetWorkOrder = sortArr
  }

  /**
   * 选择企业
   * @param {String} code 单车企业编码
   */
  private selectEnterprise(code: string): void {
    if (this.selectEnterpriseCode !== code) {
      this.selectEnterpriseCode = code
    } else {
      this.selectEnterpriseCode = 'all'
    }

    this.getBicyClePosition(code)
    this.getBicyActiveCurve(code)
    this.disCityData(this.selectEnterpriseCode)
    this.disAreaData(this.selectEnterpriseCode)

    this.isBicyTrend && this.openFifteenWin(this.openTownName)
  }

  /**
   * 获取中心点 边界
   */
  private getTownBoundary(): void {
    Promise.all([API.getDistrictBoundary(), API.getAreaBoundary()]).then(
      (res: any) => {
        const AllCityData: DataFormat = res[0].boundary // 市级数据
        const DivideCityData: Array<DataFormat> = res[0].comanyBikeNums // 分企业的市级数据
        const DivideAreaData: Array<DataFormat> = res[1].dataCompany // 分企业的区级数据

        // 总的区级数据
        const AllAreaData: Array<DataFormat> = res[1].data.map(
          (item: any): any => {
            item.companyCode = 'all'
            return item
          }
        )

        // 边界只绘制一次
        if (this.loadNum === 0) {
          this.disCityBorder(AllCityData)
          this.disAreaBorder(AllAreaData)
          this.loadNum++
        }

        // 合并所有的区域数据
        const overallArea: Array<DataFormat> = [
          ...AllAreaData,
          ...DivideAreaData
        ]
        // 合并所有的市级数据
        AllCityData.companyCode = 'all'
        const overallCity: Array<DataFormat> = [AllCityData, ...DivideCityData]
        // const overallCity: Array<DataFormat> = []

        // 分类数据
        const disTypeData = this.disCompanyData(overallCity, overallArea)

        this.townCompanyData = disTypeData[1]
        this.cityCompanyData = disTypeData[0]

        this.disCityData(this.selectEnterpriseCode)
        this.disAreaData(this.selectEnterpriseCode)
      }
    )
  }

  // 处理数据 按企业分
  private disCompanyData(
    city: Array<DataFormat>,
    town: Array<DataFormat>
  ): Array<any> {
    let cityData: any = {}
    let townData: any = {}

    // 数据类型
    const typeData: Array<any> = [
      {
        name: '全部',
        code: 'all'
      },
      ...this.enterpriseData
    ]

    typeData.forEach(
      (item: any): void => {
        townData[item.code] = []
        cityData[item.code] = {}

        city.forEach(
          (subItem: DataFormat): void => {
            if (subItem.companyCode === item.code) {
              cityData[item.code] = {
                lng: subItem.centerLongitude,
                lat: subItem.centerLatitude,
                name: subItem.name,
                bicycleNum: subItem.bicycleNum,
                activeNum: refinedCal(`${subItem.activeRate}*100`, 2) + '%'
              }
            }
          }
        )
        town.forEach(
          (subItem: DataFormat): void => {
            if (subItem.companyCode === item.code) {
              townData[item.code].push({
                lng: subItem.centerLongitude,
                lat: subItem.centerLatitude,
                name: subItem.name,
                bicycleNum: subItem.bicycleNum,
                activeNum: refinedCal(`${subItem.activeRate}*100`, 2) + '%',
                state: subItem.warningFlag
              })
            }
          }
        )
      }
    )

    return [cityData, townData]
  }

  // 处理市的数据
  private disCityData(key: string): void {
    const CityData: DataFormat = this.cityCompanyData[key]

    // 有修改 没有就添加
    if (this.cityPointData.name == CityData.name) {
      myMap.upDateCityPoint(CityData)
    } else {
      this.cityPointData = CityData
      myMap
        .addOverlayGroup('cityPointGroup', myMap.createCityPoint(CityData))
        .hide()
    }
    myMap.CityPointEvent()
  }

  // 处理市级边界
  private disCityBorder(cityData: any): void {
    // 地图 中心点
    const center: number[] = [cityData.centerLongitude, cityData.centerLatitude]
    // 边界 遮罩
    const border: Array<[]> = this.FormatGolygon(cityData.polygonGeom)

    myMap.setZoomAndCenter(cityData.gisLevel, center)
    myMap.initShade(border)
  }

  // 处理区级点
  private disAreaData(key: string): void {
    const data: Array<any> = this.townCompanyData[key]

    data.forEach((item: any) => {
      if (this.areaPointData[item.name]) {
        myMap.upDateAreaPoint(item.name, item)
      } else {
        this.areaPointData[item.name] = item
        myMap
          .addOverlayGroup('areaPointGroup', myMap.createAreaPoint(item))
          .hide()
      }
    })

    myMap.AreaPointEvent(this.openFifteenWin)
  }

  // 打开街镇 十五天趋势弹窗
  private openFifteenWin(name: string): void {
    let fifteenData: any = (this as any).bicyActiveData[name]
    this.openTownName = fifteenData.name = name

    this.isBicyTrend = true

    this.nowBicyTrendData = fifteenData
  }

  // 处理区级边界
  private disAreaBorder(AreaData: Array<DataFormat>): void {
    let border: Array<[]> = [] // 边界
    let overlays: Array<{}> = [] // 覆盖物集合
    AreaData.forEach(
      (item: DataFormat, index: number): void => {
        border = this.FormatGolygon(item.polygonGeom)
        overlays.push(myMap.createAreaBorder(border, item.name))
      }
    )

    myMap.addOverlayGroup('areaBorderGroup', overlays).hide()
  }

  // 格式边界数据
  private FormatGolygon(polygon: string): Array<[]> {
    const polygonGeom: Array<number | string> = polygon
      .slice(9, -2)
      .split(/\,|\s/)

    return arrGroup(polygonGeom, 2)
  }

  /**
   * 单车位置 热力图
   * @param {String} companyCode 单车企业编码
   */
  private getBicyClePosition(companyCode?: string): void {
    API.getBicyClePosition(companyCode === 'all' ? '' : companyCode).then(
      (res: any): void => {
        if (res.status === 0) {
          myMap.setHeatMapData(res.hotGraph)
        }
      }
    )
  }
}