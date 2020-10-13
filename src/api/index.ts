import http from '@/libs/http';
import store from '@/stores/index';

const getKey = () => {
  return store.getters.key;
  // return sessionStorage.getItem('KEY');
};

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
          en: 1,
        },
      },
    );
  },

  /**
   * 获取共享单车投放量/周活跃量、各单车企业投放量/各单车企业单车周活跃量
   */
  getOrgBike(): Promise<{}> {
    return http('bicycleTotal/findOrgBikeTotalAndActiveNum/' + getKey());
  },

  /**
   * 获取重点区域的活跃度
   */
  getKeyArea(): Promise<{}> {
    return http('position/findChildOrgActiveRange/' + getKey());
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
        endTime,
      },
    });
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
        endDay,
      },
    });
  },

  /**
   * 获取区域边界及中心点坐标（高德坐标）
   */
  getDistrictBoundary(): Promise<{}> {
    return http('boundary/findOrgBoundary/' + getKey());
  },

  /**
   * 获取街镇边界及中心点坐标
   */
  getAreaBoundary(): Promise<{}> {
    return http('boundary/findOrgChildBoundary/' + getKey());
  },

  /**
   * 单车位置（热力图）
   */
  getBicyClePosition(companyCode: string = ''): Promise<{}> {
    return http('position/findAllOrgBikeHotGraph/' + getKey(), {
      params: {
        companyCode,
      },
    });
  },

  /**
   * 行政区域15天单车活跃曲线图
   */
  getBicyActiveCurve(companyCode: string = ''): Promise<{}> {
    return http('position/findOrgBicycleNumActiveChange/' + getKey(), {
      params: {
        companyCode,
      },
    });
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
    sheetStatus: string = '',
  ): Promise<{}> {
    return http('bikeDispatch/findBikeDispatchByAreaIdAndDate/' + getKey(), {
      params: {
        startDate,
        endDate,
        type,
        sheetStatus,
      },
    });
  },

  /**
   * 工单数据
   * @param {String} countType week周，month月
   */
  getWorkOrder(): Promise<{}> {
    return http('bikeDispatch/countRecentWeek/' + getKey(), {
      params: {
        countType: 'week',
      },
    });
  },

  /**
   * 企业处置率
   */
  getRoughHandling(): Promise<{}> {
    return http('bikeDispatch/dealRateRecentWeek/' + getKey(), {
      params: {
        countType: 'week',
      },
    });
  },

  /**
   * 获取蓝牙设备
   */
  getBleContainStatus(): Promise<{}> {
    return http('ble/findOrgAllBleContainStatus/' + getKey());
  },

  /**
   * 获取近七天蓝牙设备检测到的车辆情况
   */
  getBleCompanyTrend(params: any): Promise<{}> {
    return http('ble/findBleCompanyNumList/' + getKey(), {
      params,
    });
  },
  // 获取单车的信息
  getBleAllCar(params: any): Promise<{}> {
    return http('countJieZhen/getBikeStatus' + getKey(), {
      params,
    });
  },

  /**
   * 获取当前时间 蓝牙检测车辆数（按单车企业）统计
   */
  getBleCompanyNum(params: any): Promise<{}> {
    return http('ble/staticsBleCheckNumContainPerCompany/' + getKey(), {
      params,
    });
  },

  /**
   * 获取人员位置信息 http://10.1.4.72:8090/sharebikesclean/personPosition/getUserPositionMsg?UouLaDG9Dt931%7CVrNZp2nQ%3D%3D
   */
  getUserPositionMsg(): Promise<{}> {
    return http('personPosition/getUserPositionMsg/' + getKey());
  },

  /**
   * 获取嗅探设备检查的单车列表
   */
  getBikeDetailInfo(params: any): Promise<{}> {
    return http('ble/findBleCheckBikeDetailInfo/' + getKey(), {
      params,
    });
  },

  /**
   * 获取嗅探设备检查的僵尸车列表
   */
  getBadBikeInfo(params: any): Promise<{}> {
    return http('ble/findCompanyAbandonAnalysisResult/' + getKey(), {
      params,
    });
  },

  /**
   * 获取预警数据
   */
  getWaring(params: any): Promise<{}> {
    return http('position/findOrgWaringAndClearInfo/' + getKey(), {
      params,
    });
  },

  /**
   * 获取禁停区数据
   */
  getForbid(params: any): Promise<{}> {
    return http('boundary/findOrgJtRegionBoundaryAndBikeNum/' + getKey(), {
      params,
    });
  },

  /**
   * 获取页面配置
   */
  getConfig(url): Promise<{}> {
    return http('plat/findPlatFormConfig/' + url);
  },
};
