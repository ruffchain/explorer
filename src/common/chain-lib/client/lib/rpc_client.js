var __awaiter =
  (this && this.__awaiter) ||
  function(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value))
        } catch (e) {
          reject(e)
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value))
        } catch (e) {
          reject(e)
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : new P(function(resolve) {
              resolve(result.value)
            }).then(fulfilled, rejected)
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next())
    })
  }
let XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest
export class RPCClient {
  constructor(chainUrl, logger) {
    this.logger = logger
    this.m_url = chainUrl
  }
  call(funName, funcArgs, onComplete) {
    let sendObj = {
      funName,
      args: funcArgs
    }
    this.logger.info(
      `RPCClient send request ${sendObj.funName}, params ${JSON.stringify(
        sendObj.args
      )}`
    )
    const xmlhttp = new XMLHttpRequest()
    xmlhttp.onreadystatechange = () => {
      if (xmlhttp.readyState === 4) {
        if (xmlhttp.status === 200) {
          let strResp = xmlhttp.responseText
          onComplete(strResp, xmlhttp.status)
        } else {
          onComplete(null, xmlhttp.status)
        }
      }
    }
    xmlhttp.ontimeout = err => {
      onComplete(null, 504)
    }
    xmlhttp.open('POST', this.m_url, true)
    xmlhttp.setRequestHeader('Content-Type', 'application/json')
    xmlhttp.send(JSON.stringify(sendObj))
  }
  callAsync(funcName, funcArgs) {
    return __awaiter(this, void 0, void 0, function*() {
      return new Promise((reslove, reject) => {
        this.call(funcName, funcArgs, (resp, statusCode) => {
          reslove({ resp, ret: statusCode })
        })
      })
    })
  }
}
