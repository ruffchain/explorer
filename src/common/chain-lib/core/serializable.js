import { BufferWriter } from './lib/writer'
export { BufferWriter } from './lib/writer'
export { BufferReader } from './lib/reader'
import { ErrorCode } from './error_code'
export { ErrorCode } from './error_code'
import { Encoding } from './lib/encoding'
import * as digest from './lib/digest'
const BigNumber = require('bignumber.js')
import {
  isUndefined,
  isNull,
  isNumber,
  isBuffer,
  isBoolean,
  isString,
  isArray,
  isObject
} from 'util'
export function MapToObject(input) {
  if (!(input instanceof Map)) {
    throw new Error('input MUST be a Map')
  }
  let ret = {}
  for (const [k, v] of input) {
    if (!isString(k)) {
      throw new Error('input Map`s key MUST be string')
    }
    ret[k] = v
  }
  return ret
}
export function SetToArray(input) {
  if (!(input instanceof Set)) {
    throw new Error('input MUST be a Set')
  }
  let ret = new Array()
  for (const item of input) {
    ret.push(item)
  }
  return ret
}
export function SetFromObject(input) {
  if (!isObject(input)) {
    throw new Error('input MUST be a Object')
  }
  let ret = new Set()
  input.forEach(v => ret.add(v))
  return ret
}
export function MapFromObject(input) {
  if (!isObject(input)) {
    throw new Error('input MUST be a Object')
  }
  let ret = new Map()
  for (const k of Object.keys(input)) {
    ret.set(k, input[k])
  }
  return ret
}
export function deepCopy(o) {
  if (isUndefined(o) || isNull(o)) {
    return o
  } else if (isNumber(o) || isBoolean(o)) {
    return o
  } else if (isString(o)) {
    return o
  } else if (o instanceof BigNumber) {
    return new BigNumber(o)
  } else if (isBuffer(o)) {
    return Buffer.from(o)
  } else if (isArray(o) || o instanceof Array) {
    let s = []
    for (let e of o) {
      s.push(deepCopy(e))
    }
    return s
  } else if (o instanceof Map) {
    let s = new Map()
    for (let k of o.keys()) {
      s.set(k, deepCopy(o.get(k)))
    }
    return s
  } else if (isObject(o)) {
    let s = Object.create(null)
    for (let k of Object.keys(o)) {
      s[k] = deepCopy(o[k])
    }
    return s
  } else {
    throw new Error('not JSONable')
  }
}
export function toEvalText(o) {
  if (isUndefined(o) || isNull(o)) {
    return JSON.stringify(o)
  } else if (isNumber(o) || isBoolean(o)) {
    return JSON.stringify(o)
  } else if (isString(o)) {
    return JSON.stringify(o)
  } else if (o instanceof BigNumber) {
    return `new BigNumber('${o.toString()}')`
  } else if (isBuffer(o)) {
    return `Buffer.from('${o.toString('hex')}', 'hex')`
  } else if (isArray(o) || o instanceof Array) {
    let s = []
    for (let e of o) {
      s.push(toEvalText(e))
    }
    return `[${s.join(',')}]`
  } else if (o instanceof Map) {
    throw new Error(`use MapToObject before toStringifiable`)
  } else if (o instanceof Set) {
    throw new Error(`use SetToArray before toStringifiable`)
  } else if (isObject(o)) {
    let s = []
    for (let k of Object.keys(o)) {
      s.push(`'${k}':${toEvalText(o[k])}`)
    }
    return `{${s.join(',')}}`
  } else {
    throw new Error('not JSONable')
  }
}
export function toStringifiable(o, parsable = false) {
  if (isUndefined(o) || isNull(o)) {
    return o
  } else if (isNumber(o) || isBoolean(o)) {
    return o
  } else if (isString(o)) {
    return parsable ? 's' + o : o
  } else if (o instanceof BigNumber) {
    return parsable ? 'n' + o.toString() : o.toString()
  } else if (isBuffer(o)) {
    return parsable ? 'b' + o.toString('hex') : o.toString('hex')
  } else if (isArray(o) || o instanceof Array) {
    let s = []
    for (let e of o) {
      s.push(toStringifiable(e, parsable))
    }
    return s
  } else if (o instanceof Map) {
    throw new Error(`use MapToObject before toStringifiable`)
  } else if (o instanceof Set) {
    throw new Error(`use SetToArray before toStringifiable`)
  } else if (isObject(o)) {
    let s = Object.create(null)
    for (let k of Object.keys(o)) {
      s[k] = toStringifiable(o[k], parsable)
    }
    return s
  } else {
    throw new Error('not JSONable')
  }
}
export function fromStringifiable(o) {
  // let value = JSON.parse(o);
  function __convertValue(v) {
    if (isString(v)) {
      if (v.charAt(0) === 's') {
        return v.substring(1)
      } else if (v.charAt(0) === 'b') {
        return Buffer.from(v.substring(1), 'hex')
      } else if (v.charAt(0) === 'n') {
        return new BigNumber(v.substring(1))
      } else {
        throw new Error(`invalid parsable value ${v}`)
      }
    } else if (isArray(v) || v instanceof Array) {
      for (let i = 0; i < v.length; ++i) {
        v[i] = __convertValue(v[i])
      }
      return v
    } else if (isObject(v)) {
      for (let k of Object.keys(v)) {
        v[k] = __convertValue(v[k])
      }
      return v
    } else {
      return v
    }
  }
  return __convertValue(o)
}
export class SerializableWithHash {
  constructor() {
    this.m_hash = Encoding.NULL_HASH
  }
  get hash() {
    return this.m_hash
  }
  _encodeHashContent(writer) {
    return ErrorCode.RESULT_OK
  }
  _decodeHashContent(reader) {
    return ErrorCode.RESULT_OK
  }
  encode(writer) {
    // writer.writeHash(this.hash);
    return this._encodeHashContent(writer)
  }
  decode(reader) {
    // this.m_hash = reader.readHash('hex');
    let err = this._decodeHashContent(reader)
    this.updateHash()
    return err
  }
  updateHash() {
    this.m_hash = this._genHash()
  }
  _genHash() {
    let contentWriter = new BufferWriter()
    this._encodeHashContent(contentWriter)
    let content = contentWriter.render()
    return digest.hash256(content).toString('hex')
  }
  _verifyHash() {
    return this.hash === this._genHash()
  }
  stringify() {
    return { hash: this.hash }
  }
}
