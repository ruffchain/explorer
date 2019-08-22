const BigNumber = require('bignumber.js')
import { Transaction, Receipt } from '../block/transaction'
import { ErrorCode } from '../serializable'
export class ValueTransaction extends Transaction {
  constructor() {
    super()
    this.m_value = new BigNumber(0)
    this.m_fee = new BigNumber(0)
  }
  get value() {
    return this.m_value
  }
  set value(value) {
    this.m_value = value
  }
  get fee() {
    return this.m_fee
  }
  set fee(value) {
    this.m_fee = value
  }
  _encodeHashContent(writer) {
    let err = super._encodeHashContent(writer)
    if (err) {
      return err
    }
    writer.writeBigNumber(this.m_value)
    writer.writeBigNumber(this.m_fee)
    return ErrorCode.RESULT_OK
  }
  _decodeHashContent(reader) {
    let err = super._decodeHashContent(reader)
    if (err) {
      return err
    }
    try {
      this.m_value = reader.readBigNumber()
      this.m_fee = reader.readBigNumber()
    } catch (e) {
      return ErrorCode.RESULT_INVALID_FORMAT
    }
    return ErrorCode.RESULT_OK
  }
  stringify() {
    let obj = super.stringify()
    obj.value = this.value.toString()
    obj.fee = this.fee.toString()
    return obj
  }
}
export class ValueReceipt extends Receipt {
  constructor() {
    super()
    this.m_cost = new BigNumber(0)
  }
  get cost() {
    const b = this.m_cost
    return b
  }
  set cost(c) {
    this.m_cost = c
  }
  encode(writer) {
    const err = super.encode(writer)
    if (err) {
      return err
    }
    try {
      writer.writeBigNumber(this.m_cost)
    } catch (e) {
      return ErrorCode.RESULT_INVALID_FORMAT
    }
    return ErrorCode.RESULT_OK
  }
  decode(reader) {
    const err = super.decode(reader)
    if (err) {
      return err
    }
    try {
      this.m_cost = reader.readBigNumber()
    } catch (e) {
      return ErrorCode.RESULT_INVALID_FORMAT
    }
    return ErrorCode.RESULT_OK
  }
  stringify() {
    let obj = super.stringify()
    obj.cost = this.m_cost.toString()
    return obj
  }
}
