import axios from 'axios'
import qs from 'qs'
// import router from '../router'

// 创建axios实例
const Axios = axios.create({
  baseURL: process.env.VUE_APP_API_URL + '/',
  timeout: 10000,
  withCredentials: true // 是否允许带cookie这些
})

// request拦截器
Axios.interceptors.request.use(
  config => {
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// response过滤器
Axios.interceptors.response.use(
  // 正确处理
  res => {
    let data = res.data
    return data
  },
  // 错误处理
  error => {
    let res = error.response
    if (res) {
      switch (
        res.status
        //401 登录过期 返回登录
        // case 401:
        //   router.replace({
        //     path: '/error401'
        //   })
        //   break
        // case 404:
        // case 500:
        //   router.replace({
        //     path: '/error404'
        //   })
        //   break
      ) {
      }
    } else {
      // console.log;
    }
    return Promise.reject(error)
  }
)

// url传参
function urlParams(method: string, url: string, params: object): Promise<{}> {
  return new Promise((resolve, reject) => {
    Axios({
      url,
      method,
      params,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })
      .then(
        res => {
          resolve(res)
        },
        error => {
          reject(error)
        }
      )
      .catch(error => {
        reject(error)
      })
  })
}

// body传参
function bodyParams(
  method: string,
  url: string,
  params: object,
  contentType: string
): Promise<{}> {
  return new Promise((resolve, reject) => {
    Axios({
      url,
      method,
      data: contentType == 'json' ? params : qs.stringify(params),
      headers: {
        'Content-Type':
          contentType == 'json'
            ? 'application/json;charset=UTF-8'
            : 'application/x-www-form-urlencoded;charset=UTF-8'
      }
    })
      .then(
        res => {
          resolve(res)
        },
        error => {
          reject(error)
        }
      )
      .catch(error => {
        reject(error)
      })
  })
}

/**
 * 请求
 * @param {String} url 请求路径
 * @param {Object} param1
 */
export default function http(
  url: string,
  { method = 'get', params = {}, contentType = '' } = {}
): Promise<{}> {
  if (method === 'get' || method === 'delete') {
    return urlParams(method, url, params)
  } else {
    return bodyParams(method, url, params, contentType)
  }
}
