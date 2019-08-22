const BigNumber = require('bignumber.js')
import { TokenType, TOKEN_EXCHANGE_TYPE } from '../../../common/enums'

export const genTransferTx = data => {
  const { tokenType, to, tokenId, amount, fee } = data

  const method =
    tokenType === TokenType.sys
      ? 'transferTo'
      : tokenType === TokenType.normal
      ? 'transferTokenTo'
      : 'transferBancorTokenTo'

  const tx = {}
  tx.method = method
  tx.fee = new BigNumber(fee)
  if (tokenType === TokenType.sys) {
    tx.value = new BigNumber(amount)
    tx.input = { to }
  } else {
    tx.input = { to, tokenid: tokenId, amount }
  }
  return tx
}

export const genCreateTokenTx = data => {
  let {
    tokenType,
    fee,
    tokenId,
    preBalances,
    nonLiquidity,
    cost,
    factor,
    precision //普通token 精度
  } = data

  const method =
    tokenType === TokenType.normal ? 'createToken' : 'createBancorToken'

  if (tokenType === TokenType.normal) {
    preBalances = preBalances.map(({ address, amount }) => {
      return {
        address,
        amount
      }
    })
  }
  if (tokenType === TokenType.smart) {
    preBalances = preBalances.map(
      ({ address, amount, time_expiration, lock_amount, lock }) => {
        if (lock) {
          time_expiration = Math.floor(
            (new Date(time_expiration) - Date.now()) / (60 * 1000)
          )
        } else {
          time_expiration = '0'
          lock_amount = '0'
        }

        return {
          address,
          amount,
          lock_amount,
          time_expiration
        }
      }
    )
  }

  const tx = {}
  tx.method = method
  tx.fee = new BigNumber(fee)
  tx.input = { tokenid: tokenId, precision, preBalances }
  if (tokenType === TokenType.smart) {
    tx.value = new BigNumber(cost)
    tx.input = {
      tokenid: tokenId,
      preBalances,
      factor,
      nonliquidity: nonLiquidity
    }
  }
  return tx
}

export const genExchangeTokenTx = data => {
  const { tokenExchangeType, tokenId, amount, cost, fee } = data

  const method =
    tokenExchangeType === TOKEN_EXCHANGE_TYPE.BUY
      ? 'buyBancorToken'
      : 'sellBancorToken'

  const tx = {}
  tx.method = method
  tx.fee = new BigNumber(fee)

  if (tokenExchangeType === TOKEN_EXCHANGE_TYPE.BUY) {
    tx.value = new BigNumber(cost)
    tx.input = {
      tokenid: tokenId
    }
  } else {
    tx.input = {
      tokenid: tokenId,
      amount: amount
    }
  }
  return tx
}

export const genMortgageTx = (amount, fee) => {
  return {
    method: 'mortgage',
    fee: new BigNumber(fee),
    value: new BigNumber(amount),
    input: amount
  }
}

export const genUnMortgageTx = (amount, fee) => {
  return {
    method: 'unmortgage',
    fee: new BigNumber(fee),
    input: amount
  }
}

export const genVoteTx = (candidates, fee) => {
  return {
    method: 'vote',
    fee: new BigNumber(fee),
    input: candidates
  }
}
