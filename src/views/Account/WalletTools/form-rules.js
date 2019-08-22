import {
  isValidAddress,
  addressFromSecretKey
} from '../../../common/chain-lib/core/address'
import * as chainApi from '../../../common/chain-api'

const handleCb = (cb, err) => {
  err ? cb(new Error(err)) : cb()
}

export const required = () => ({
  required: true,
  message: '请输入',
  trigger: ['change', 'blur']
})

export const greaterThan = num => ({
  validator: (rule, value, callback) => {
    let err
    if (value <= num) {
      err = `数字必须大于${num}`
    }
    handleCb(callback, err)
  },
  trigger: ['change', 'blur']
})

export const greaterOrEqualThan = num => ({
  validator: (rule, value, callback) => {
    let err
    if (value < num) {
      err = `数字不能小于${num}`
    }
    handleCb(callback, err)
  },
  trigger: ['change', 'blur']
})

export const lessOrEqualThan = num => ({
  validator: (rule, value, callback) => {
    let err
    if (value > num) {
      err = `数字不能大于${num}`
    }
    handleCb(callback, err)
  },
  trigger: ['change', 'blur']
})

export const validTokenPrecision = value => {
  return !(value > 9 || value < 0 || value.toString() !== (~~value).toString())
}

export const tokenPrecision = () => ({
  validator: (rule, value, callback) => {
    handleCb(
      callback,
      validTokenPrecision(value) ? '' : '必须为0到9之间的正整数'
    )
  },
  trigger: ['change', 'blur']
})

export const amountTooBig = () => ({
  validator: (rule, value, callback) => {
    let err
    if (value >= 1000000000000000000) {
      err = `数字太大`
    }
    handleCb(callback, err)
  },
  trigger: ['change', 'blur']
})

export const maxDecimalCount = count => ({
  validator: (rule, value, callback) => {
    let err
    const [, decimal] = value.toString().split('.') //3.141592654
    if (decimal && decimal.length > count) {
      err = `精度最大为小数点后${count}位`
    }
    handleCb(callback, err)
  },
  trigger: ['change', 'blur']
})

export const validAdress = () => ({
  validator: (rule, value, callback) => {
    let err
    try {
      if (!isValidAddress(value)) {
        err = `请输入有效账户`
      }
    } catch (e) {
      err = `请输入有效账户`
    }
    handleCb(callback, err)
  },
  trigger: ['change', 'blur']
})

export const validSecret = () => ({
  validator: (rule, value, callback) => {
    let err
    let address = null
    try {
      address = addressFromSecretKey(value)
    } catch (e) {}
    if (!address) {
      err = `请输入有效私钥`
    }
    handleCb(callback, err)
  },
  trigger: ['change', 'blur']
})

export const tokenIdToErrMessage = value => {
  let err
  if (/^[0-9]+/.test(value)) {
    err = '不能以数字开头'
  } else if (!/^[A-Za-z0-9]+$/.test(value)) {
    err = '字符只能包含英文字母和数字'
  } else if (value.length < 3 || value.length > 12) {
    err = '长度必须在3到12个字符之间'
  }
  return err
}

export const validTokenId = () => ({
  validator: (rule, value, callback) => {
    let err = tokenIdToErrMessage(value)
    handleCb(callback, err)
  },
  trigger: ['change', 'blur']
})

export const tokenShouldNotExist = () => ({
  validator: async (rule, value, callback) => {
    let err
    try {
      const res = await chainApi.getTokenInfo(value)
      if (res.name) {
        err = 'Token 已存在'
      }
    } catch (e) {
      err = '查询 Token 是否存在出错，请重试'
    } finally {
      handleCb(callback, err)
    }
  },
  trigger: ['blur']
})

/**
 * @param {string} tokenType token类型：bancor 或者 normal
 */
const tokenExist = async (tokenType, value) => {
  let err
  try {
    const res = await chainApi.getTokenInfo(value)
    if (!res.name || res.type != tokenType) {
      err = tokenType === 'bancor' ? '智能 Token 不存在' : '普通 Token 不存在'
    }
  } catch (e) {
    err = '查询token出错，请重试'
  }
  return err
}

export const bancorTokenShouldExist = () => ({
  validator: async (rule, value, callback) => {
    const err = await tokenExist('bancor', value)
    handleCb(callback, err)
  },
  trigger: ['blur']
})

export const normalTokenShouldExist = () => ({
  validator: async (rule, value, callback) => {
    const err = await tokenExist('normal', value)
    handleCb(callback, err)
  },
  trigger: ['blur']
})
