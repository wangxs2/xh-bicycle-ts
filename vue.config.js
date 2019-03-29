/**
 * vue-cli 3.x配置文件
 */

const path = require('path')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin //Webpack包文件分析器
const CompressionPlugin = require('compression-webpack-plugin') //Gzip

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  //是否使用包含运行时编译器的 Vue 构建版本
  runtimeCompiler: false,
  // eslint-loader 是否在保存的时候检查
  lintOnSave: false,
  //生产环境是否生成 sourceMap 文件
  productionSourceMap: false,
  publicPath: process.env.pageUrl, // 部署项目路径
  // 默认情况下 babel-loader 会忽略所有 node_modules 中的文件。如果你想要通过 Babel 显式转译一个依赖，可以在这个选项中列出来。
  transpileDependencies: [],
  // 设置生成的 HTML 中 <link rel="stylesheet"> 和 <script> 标签的 crossorigin 属性。需要注意的是该选项仅影响由 html-webpack-plugin 在构建时注入的标签 - 直接写在模版 (public/index.html) 中的标签不受影响。
  crossorigin: undefined,
  // 在生成的 HTML 中的 <link rel="stylesheet"> 和 <script> 标签上启用 Subresource Integrity (SRI)。如果你构建后的文件是部署在 CDN 上的，启用该选项可以提供额外的安全性。需要注意的是该选项仅影响由 html-webpack-plugin 在构建时注入的标签 - 直接写在模版 (public/index.html) 中的标签不受影响。另外，当启用 SRI 时，preload resource hints 会被禁用，因为 Chrome 的一个 bug 会导致文件被下载两次。
  integrity: false,
  devServer: {
    port: 9090, // 端口号
    // host: 'localhost',
    https: false,
    open: false, //配置自动启动浏览器
    proxy: {
      '/sharebikesclean': {
        // target: 'http://10.1.4.73:8090/sharebikesclean',
        target: 'http://10.1.30.210:50081/sharebikesclean',
        changeOrigin: true,
        pathRewrite: {
          '^/sharebikesclean': '/'
        }
      }
    }
  },
  chainWebpack: config => {
    // 配置绝对路径
    config.resolve.alias.set('@img', resolve('src/assets/image'))
  },
  configureWebpack: config => {
    //生产环境
    let pluginsPro = [
      new CompressionPlugin({
        //文件开启Gzip，也可以通过服务端(如：nginx)(https://github.com/webpack-contrib/compression-webpack-plugin)
        filename: '[path].gz[query]', // 文件名称
        algorithm: 'gzip', // 压缩方法
        test: new RegExp('\\.(' + ['js', 'css'].join('|') + ')$'),
        threshold: 8192, // 对超过的数据进行压缩
        minRatio: 0.8 // 最小压缩比
      }),
      //	Webpack包文件分析器(https://github.com/webpack-contrib/webpack-bundle-analyzer)
      new BundleAnalyzerPlugin()
      // new webpack.ProvidePlugin({
      //   Swiper: 'swiper'
      // })
    ]

    //开发环境
    let pluginsDev = [
      // new webpack.ProvidePlugin({
      //   Swiper: 'swiper'
      // })
    ]

    if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置...process.env.NODE_ENV !== 'development'
      config.plugins = [...config.plugins, ...pluginsPro]
    } else {
      // 为开发环境修改配置...
      config.plugins = [...config.plugins, ...pluginsDev]
    }
  },
  css: {
    // 启用 CSS modules for all css / pre-processor files.
    // modules: false,
    // 是否使用css分离插件 ExtractTextPlugin
    // extract: true,
    // 开启 CSS source maps?
    // sourceMap: false,
    // css预设器配置项
    loaderOptions: {
      sass: {
        data: `@import "@/common/scss/index.scss";`
      }
    }
  }
}
