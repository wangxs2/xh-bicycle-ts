<template>
  <div class="weather">
    <div class="weather-temperature">
      <div class="describe">
        <img :src="weatherData.img">
        <div>{{weatherData.desc}}</div>
      </div>
      <div>{{weatherData.low_temp}}~{{weatherData.high_temp}}°C</div>
    </div>
    <div class="weather-rank">
      <div>AQI</div>
      <div>{{weatherData.aqi}}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import API from '@/api/index.ts';

@Component
export default class Weather extends Vue {
  public weatherData: object = {};

  public created() {
    this.getWeather();
  }

  /**
   * 请求数据
   */
  public getWeather(): void {
    API.getWeather().then((res: any) => {
      if (res.message === 'success') {
        const aqi = res.data.en.quality ? res.data.en.quality : '良';
        const thisWeather = res.data.forcast[0];
        // 是否白天
        const timeType =
          new Date(res.data.update_time).getHours() < 17 ? 'day' : 'night';
        const desc = thisWeather[timeType].type;
        this.weatherData = {
          aqi,
          // img: require(`@img/weather/${desc}.png`),
          img: `${process.env.BASE_URL}weather/${desc}.png`,
          low_temp: thisWeather.low_temp.slice(0, -1),
          high_temp: thisWeather.high_temp.slice(0, -1),
          desc,
        };
      }
    });
  }
}
</script>

<style lang="scss" scoped>
.weather {
  line-height: vh(18);
  // margin-top: vh(3);
  width: vw(125);
  height: vh(48);
  padding: vh(6) vw(14);
  box-sizing: border-box;
  background: url("~@img/bg_border_2@2x.png") no-repeat center;
  background-size: 100% 100%;
  display: flex;
  justify-content: space-between;
  .weather-temperature {
    font-size: vw(14);
    color: #40cbff;
    .describe {
      display: flex;
      align-items: center;
      font-size: vw(13);
      color: #fff;
      img {
        margin-right: vw(6);
        width: vw(23);
        height: vw(18);
      }
    }
  }
  .weather-rank {
    text-align: center;
    font-size: vw(14);
    color: #40cbff;
  }
}
</style>
