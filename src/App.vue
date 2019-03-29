 <template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="scss">
@import url("./assets/iconfont/iconfont.css");

html,
body {
  width: 100%;
  height: vh(540);
  padding: 0;
  margin: 0;
}

#app {
  overflow: hidden;
  width: 100%;
  height: 100%;
  font-size: 16px;
  font-family: Microsoft YaHei, Helvetica Neue, Helvetica, PingFang SC,
    Hiragino Sans GB, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  line-height: 1;
}
</style>
