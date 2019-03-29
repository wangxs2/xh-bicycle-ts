export default function remoteLoad(url: string, hasCallback: any) {
  return createScript(url)
  /**
   * 创建script
   * @param url
   * @returns {Promise}
   */
  function createScript(url: string) {
    const scriptElement: any = document.createElement('script')
    document.body.appendChild(scriptElement)

    const promise = new Promise((resolve: any, reject: any) => {
      scriptElement.addEventListener(
        'load',
        (e: Event) => {
          removeScript(scriptElement)
          if (!hasCallback) {
            resolve(e)
          }
        },
        false
      )

      scriptElement.addEventListener(
        'error',
        (e: Event) => {
          removeScript(scriptElement)
          reject(e)
        },
        false
      )

      // if (hasCallback) {
      //   window.____callback____ = function() {
      //     resolve()
      //     window.____callback____ = null
      //   }
      // }
    })

    // if (hasCallback) {
    //   url += '&callback=____callback____'
    // }

    scriptElement.src = url

    return promise
  }

  /**
   * 移除script标签
   * @param scriptElement script dom
   */
  function removeScript(scriptElement: any) {
    document.body.removeChild(scriptElement)
  }
}
