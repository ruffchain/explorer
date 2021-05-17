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
  const http = axios.create({ baseURL: '/chain-earnings-rpc', timeout: 8000 })

  http.interceptors.request.use((config) => {
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

// Added 2020-2-20
const callMintageRpc = (function () {
  const http = axios.create({ baseURL: '/chain-mintage-rpc', timeout: 8000 })

  http.interceptors.request.use((config) => {
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
  callEarningsRpc({
    method: 'get-account',
    args: {
      account: address
    }
  })
export const getEarningsConfig = () =>
  callEarningsRpc({
    method: 'get-config',
    args: {}
  })
export const setEarningsAccount = (address, usdt, pubkey, sign) =>
  // console.log('setEarningsAccount')
  // console.log({
  //   account: address,
  //   usdt_address: usdt,
  //   pubkey: pubkey,
  //   signature: sign
  // })

  callEarningsRpc({
    method: 'set-account',
    args: {
      account: address,
      usdt_address: usdt,
      pubkey: pubkey,
      signature: sign
    }
  })

export const getPurchased = (index, pagesize, inAuth) =>
  callMintageRpc({
    method: 'get-purchased',
    args: {
      page: index,
      page_size: pagesize
    },
    auth: inAuth
  })
export const getPurchasedConfig = () =>
  callMintageRpc({
    method: 'get-config',
    args: {}
  })
export const updatePurchasedHandled = (inTx, ruffValue, ruffTx, inAuth) =>
  callMintageRpc({
    method: 'update-purchased-handled',
    args: {
      tx: inTx,
      ruffvalue: ruffValue,
      rufftx: ruffTx
    },
    auth: inAuth
  })
export const getCashbackByAddr = (index, pagesize, inAuth) =>
  callMintageRpc({
    method: 'get-cashback-byaddr',
    args: {
      page: index,
      page_size: pagesize
    },
    auth: inAuth
  })
export const checkHecoAddr = (addr) =>
  callMintageRpc({
    method: 'check-usdt-address',
    args: {
      addr: addr
    }
  })
export const getCashback = (index, pagesize, inAuth) =>
  callMintageRpc({
    method: 'get-cashback',
    args: {
      page: index,
      page_size: pagesize
    },
    auth: inAuth
  })


export const setCashback = (inForeignAddr, inValue, inTx, inAuth) =>
  callMintageRpc({
    method: 'set-cashback',
    args: {
      foreign_addr: inForeignAddr,
      value: inValue,
      ruff_tx: inTx
    },
    auth: inAuth
  })

export const updateCashbackHandled = (tx, foreignvalue, foreigntx, inAuth) =>
  callMintageRpc({
    method: 'update-cashback-handled',
    args: {
      tx: tx,
      foreign_value: foreignvalue,
      foreign_tx: foreigntx,
    },
    auth: inAuth
  })

export const getInvalidCashback = (index, pagesize, inAuth) =>
  callMintageRpc({
    method: 'get-invalid-cashback',
    args: {
      page: index,
      page_size: pagesize
    },
    auth: inAuth
  })
export const getValidCashback = (index, pagesize, inAuth) =>
  callMintageRpc({
    method: 'get-valid-cashback',
    args: {
      page: index,
      page_size: pagesize
    },
    auth: inAuth
  })
export const getAcceptedCashback = (index, pagesize, inAuth) =>
  callMintageRpc({
    method: 'get-accepted-cashback',
    args: {
      page: index,
      page_size: pagesize
    },
    auth: inAuth
  })
export const getCompletedCashback = (index, pagesize, inAuth) =>
  callMintageRpc({
    method: 'get-completed-cashback',
    args: {
      page: index,
      page_size: pagesize
    },
    auth: inAuth
  })
export const getRejectedCashback = (index, pagesize, inAuth) =>
  callMintageRpc({
    method: 'get-rejected-cashback',
    args: {
      page: index,
      page_size: pagesize
    },
    auth: inAuth
  })
export const acceptCashback = (txhash, inAuth) =>
  callMintageRpc({
    method: 'accept-cashback',
    args: {
      tx: txhash
    },
    auth: inAuth
  })
export const completeCashback = (txhash, hecoHash, hecoVal, inAuth) =>
  callMintageRpc({
    method: 'complete-cashback',
    args: {
      tx: txhash,
      hecoTx: hecoHash,
      hecoValue: hecoVal
    },
    auth: inAuth
  })

// Reclaims
export const getReclaimsByAddr = (index, pagesize, inAuth) =>
  callMintageRpc({
    method: 'get-reclaim-byaddr',
    args: {
      page: index,
      page_size: pagesize
    },
    auth: inAuth
  })

export const setReclaim = (blocknum, hecoaddr, val, rufftx, hecotx, inAuth) =>
  callMintageRpc({
    method: 'set-reclaim',
    args:{
      blockNum: blocknum,
      hecoAddr: hecoaddr,
      value: val,
      ruffTx: rufftx,
      hecoTx: hecotx
    },
    auth: inAuth
  })
export const completeReclaim = (hecotx, rufftx, inAuth) =>
  callMintageRpc({
    method: 'complete-reclaim',
    args:{
      hecoTx: hecotx,
      ruffTx: rufftx
    },
    auth: inAuth
  })
export const getReclaimInvalid = (index, pagesize, inAuth) =>
  callMintageRpc({
    method: 'get-reclaim-invalid',
    args:{
      page: index,
      page_size: pagesize
    },
    auth: inAuth
  })
export const getReclaimAccepted = (index, pagesize, inAuth) =>
  callMintageRpc({
    method: 'get-reclaim-accepted',
    args:{
      page: index,
      page_size: pagesize
    },
    auth: inAuth
  })
export const getReclaimCompleted = (index, pagesize, inAuth) =>
  callMintageRpc({
    method: 'get-reclaim-completed',
    args:{
      page: index,
      page_size: pagesize
    },
    auth: inAuth
  })
export const getReclaimRejected = (index, pagesize, inAuth) =>
  callMintageRpc({
    method: 'get-reclaim-rejected',
    args:{
      page: index,
      page_size: pagesize
    },
    auth: inAuth
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
