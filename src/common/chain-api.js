import axios from 'axios'
const BigNumber = require('bignumber.js')
import {
  ValueTransaction,
  HostClient,
  addressFromSecretKey
} from './chain-lib/index'
import { delay } from './utils'

const chainClient = new HostClient({ chainUrl: window.origin + '/chain-rpc' })

// Added 2020-12-30
const callEarningsRpc = (function () {
  const http = axios.create({ baseURL: '/chain-earnings-rpc', timeout: 5000 })

  http.interceptors.request.use((config)=>{
    config.headers.Authorization = '16heLGkcJepHVjYFfGDtViKnXM8u7MdRAU'
    return config
  })

  http.interceptors.response.use(
    res => res.data,
    err => {
      throw err
    }
  )

  return (args = {}) =>
    http.post('', args)
})()

export const getEarningsAccount = address =>
  callEarningsRpc( {
    method: 'get-account',
    args:{
      account: address 
    }
  })
export const getEarningsConfig = () =>
  callEarningsRpc({
    method: 'get-config',
    args:{}
  })
export const setEarningsAccount = (address, usdt, pubkey,sign) =>
  // console.log('setEarningsAccount')
  // console.log({
  //   account: address,
  //   usdt_address: usdt,
  //   pubkey: pubkey,
  //   signature: sign
  // })

  callEarningsRpc({
    method: 'set-account',
    args:{
      account: address,
      usdt_address: usdt,
      pubkey: pubkey,
      signature: sign
    }
  })

//////////////////////////////////////////
const callChainRpc = (function () {
  const http = axios.create({ baseURL: '/chain-rpc', timeout: 5000 })
  http.interceptors.response.use(
    res => res.data,
    err => {
      throw err
    }
  )

  return (funName, args = {}) =>
    http.post('', {
      funName,
      args
    })
})()

export const checkReceipt = async tx => {
  await delay(500)
  for (let i = 0; i < 10; i++) {
    try {
      let res = await callChainRpc('getTransactionReceipt', { tx })
      if (res.receipt.returnCode === 0) {
        return true
      }
    } catch (e) { }
    await delay(3000)
  }
  return false
}

export const sendTransaction = async (transaction, privateKey) => {
  let tx = new ValueTransaction()
  Object.entries(transaction).forEach(([key, value]) => {
    tx[key] = value
  })

  const address = addressFromSecretKey(privateKey)
  const { err, nonce } = await chainClient.getNonce({ address })
  if (err) {
    throw `getNonce failed for ${err}`
  }
  tx.nonce = nonce + 1
  tx.sign(privateKey)

  let sendRet = await chainClient.sendTransaction({ tx })
  if (sendRet.err) {
    throw `sendTransaction failed for ${sendRet.err}`
  }
  const confirmed = await checkReceipt(tx.hash)
  return {
    confirmed,
    tx: tx.stringify()
  }
}

export const getStacks = address =>
  callChainRpc('view', {
    method: 'getStake',
    params: { address }
  })

export const getTicket = address =>
  callChainRpc('view', {
    method: 'getTicket',
    params: address
  })

export const getCandidateInfo = address =>
  callChainRpc('view', {
    method: 'getCandidateInfo',
    params: {
      address
    }
  })

const callQueryRpc = (function () {
  const http = axios.create({ baseURL: '/chain-info-rpc', timeout: 5000 })
  http.interceptors.response.use(
    res => res.data,
    err => {
      throw err
    }
  )

  return (funName, args, config = {}) =>
    http.post(
      '',
      {
        funName,
        args
      },
      config
    )
})()

export const search = str => callQueryRpc('getName', str)

export const getChainOverview = () => callQueryRpc('getChainOverview')

export const getBlock = (which, transactions = true) =>
  callQueryRpc('getBlock', {
    which,
    transactions
  })

export const getTransaction = tx =>
  callQueryRpc('getTransactionReceipt', {
    tx
  })

export const getLatestBlocks = () =>
  callQueryRpc('getLatestBlocks', {
    page: 1,
    pageSize: 8
  })

export const getLatestTxs = () =>
  callQueryRpc('getLatestTxs', {
    page: 1,
    pageSize: 8
  })

export const getCandidates = () => callQueryRpc('getCandidates', {})

export const getTokensByAddress = address =>
  callQueryRpc('getTokensByAddress', address)

export const getTxsByAddress = data => callQueryRpc('getTxsByAddress', data)

export const getTokenInfo = token => callQueryRpc('getTokenInfo', token)

export const getTokenPrice = token => callQueryRpc('getTokenPrice', token)

export const getBancorTokenParams = token =>
  callQueryRpc('getBancorTokenParams', token)

export const getFortuneRanking = data => callQueryRpc('getFortuneRanking', data)

export const getCandy = data => callQueryRpc('getCandy', data, { timeout: 0 })

export const getTokenBySys = (numF, numS, numR, num) => {
  let F = new BigNumber(numF)
  let S = new BigNumber(numS)
  let R = new BigNumber(numR)
  // To calculate the cost
  let e = new BigNumber(num)
  let out = e.dividedBy(R)
  out = out.plus(new BigNumber(1.0))
  let temp1 = out.toNumber()

  out = new BigNumber(Math.pow(temp1, F.toNumber()))

  out = out.minus(new BigNumber(1))
  out = out.multipliedBy(S)

  return out.toNumber()
}

export const getSysByToken = (numF, numS, numR, num) => {
  let F = new BigNumber(numF) // Can not be zero
  let S = new BigNumber(numS)
  let R = new BigNumber(numR)

  let e = new BigNumber(num)

  let out = e.dividedBy(S)
  out = new BigNumber(1).minus(out)
  let temp1 = out.toNumber()
  out = new BigNumber(Math.pow(temp1, 1 / F.toNumber()))
  out = new BigNumber(1).minus(out)
  out = out.multipliedBy(R)

  return out.toNumber()
}
