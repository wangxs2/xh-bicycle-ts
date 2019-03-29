import http from '@/libs/http'

const getKey = () => {
  // return store.state.key
  return sessionStorage.getItem('KEY')
}

export default {
  /**
   * 获取天气
   * @param {String} cityName 查询城市
   */
  getWeather(): Promise<{}> {
    return http(
      'http://114.80.231.178:18080/openDataTest/weatherAction/getWeatherInfoEx',
      {
        params: {
          cityName: '上海',
          en: 1
        }
      }
    )
  },

  /**
   * 获取共享单车投放量/周活跃量、各单车企业投放量/各单车企业单车周活跃量
   */
  getOrgBike(): Promise<{}> {
    return http('bicycleTotal/findOrgBikeTotalAndActiveNum/' + getKey())
  },

  /**
   * 获取重点区域
   */
  getKeyArea(): Promise<{}> {
    return http('position/findChildOrgActiveRange/' + getKey())
  },

  /**
   * 重点区域 早晚高峰
   * @param {Date} startTime 开始时间
   * @param {Date} endTime 结束时间
   */
  getPeak(startTime: string, endTime: string): Promise<{}> {
    return http('kpHour/calOrgKeyRegionHotBicycleNum/' + getKey(), {
      params: {
        startTime,
        endTime
      }
    })
  },

  /**
   * 工单详情
   * @param {Date} beginDay 开始时间
   * @param {Date} endDay 结束时间
   */
  getWorkOrderDetails(beginDay: string, endDay: string): Promise<{}> {
    return http('bikeDispatch/dispatchList/' + getKey(), {
      params: {
        beginDay,
        endDay
      }
    })
  },

  /**
   * 获取区域边界及中心点坐标（高德坐标）
   */
  getDistrictBoundary(): Promise<{}> {
    return http('boundary/findOrgBoundary/' + getKey())
  },

  /**
   * 获取街镇边界及中心点坐标
   */
  getAreaBoundary(): Promise<{}> {
    return http('boundary/findOrgChildBoundary/' + getKey())
  },

  /**
   * 单车位置（热力图）
   */
  getBicyClePosition(companyCode: string = ''): Promise<{}> {
    return http('position/findAllOrgBikeHotGraph/' + getKey(), {
      params: {
        companyCode
      }
    })
  },

  /**
   * 获取指定街道/区单车治理情况 工单位置
   * @param {Date} startDate 开始日期，xxxx-xx-xx
   * @param {Date} endDate 结束日期，xxxx-xx-xx，若要查某天的数据，开始日期和结束日期一样即可
   */
  getAreaIdAndDate(
    startDate: string,
    endDate: string,
    type: string = '',
    sheetStatus: string = ''
  ) {
    return http('bikeDispatch/findBikeDispatchByAreaIdAndDate/' + getKey(), {
      params: {
        startDate,
        endDate,
        type,
        sheetStatus
      }
    })
  }
}
