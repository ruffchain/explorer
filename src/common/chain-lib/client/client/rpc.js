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
import { ErrorCode } from '../../core/error_code'
import { BufferWriter } from '../../core/lib/writer'
import { fromStringifiable } from '../../core/serializable'
import { RPCClient } from '../lib/rpc_client'
export class HostClient {
  constructor(options) {
    this.m_logger = window.console
    this.m_client = new RPCClient(options.chainUrl, this.m_logger)
  }
  getBlock(params) {
    return __awaiter(this, void 0, void 0, function*() {
      let cr = yield this.m_client.callAsync('getBlock', params)
      if (cr.ret !== 200) {
        return { err: ErrorCode.RESULT_FAILED }
      }
      return JSON.parse(cr.resp)
    })
  }
  getTransactionReceipt(params) {
    return __awaiter(this, void 0, void 0, function*() {
      let cr = yield this.m_client.callAsync('getTransactionReceipt', params)
      if (cr.ret !== 200) {
        return { err: ErrorCode.RESULT_FAILED }
      }
      return JSON.parse(cr.resp)
    })
  }
  getNonce(params) {
    return __awaiter(this, void 0, void 0, function*() {
      let cr = yield this.m_client.callAsync('getNonce', params)
      if (cr.ret !== 200) {
        return { err: ErrorCode.RESULT_FAILED }
      }
      return JSON.parse(cr.resp)
    })
  }
  sendTransaction(params) {
    return __awaiter(this, void 0, void 0, function*() {
      let writer = new BufferWriter()
      let err = params.tx.encode(writer)
      if (err) {
        this.m_logger.error(`send invalid transactoin`, params.tx)
        return { err }
      }
      let cr = yield this.m_client.callAsync('sendTransaction', {
        tx: writer.render()
      })
      if (cr.ret !== 200) {
        this.m_logger.error(`send tx failed ret `, cr.ret)
        return { err: ErrorCode.RESULT_FAILED }
      }
      return { err: JSON.parse(cr.resp) }
    })
  }
  view(params) {
    return __awaiter(this, void 0, void 0, function*() {
      let cr = yield this.m_client.callAsync('view', params)
      if (cr.ret !== 200) {
        return { err: ErrorCode.RESULT_FAILED }
      }
      return fromStringifiable(JSON.parse(cr.resp))
    })
  }
  getPeers() {
    return __awaiter(this, void 0, void 0, function*() {
      let cr = yield this.m_client.callAsync('getPeers', {})
      return JSON.parse(cr.resp)
    })
  }
}
