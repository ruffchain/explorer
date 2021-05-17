import * as chainLib from '../../../../common/chain-lib'
import { getStrDate } from '../../../../common/utils'


export function getStatus(record) {
    if (record.type === 0) {
      return 'Checking'
    } else if (record.type === 1) {
      return 'Valid'
    } else if (record.type === 2) {
      return 'Accepted'
    } else if (record.type === 3) {
      return 'Completed'
    } else if (record.type === 10) {
      return 'Rejected'
    } else {
      return ''
    }
  }

  export function getAuthNormal(privateKey) {
    // let privateKey = dataReclaims
    let address = chainLib.addressFromSecretKey(privateKey)
    let pubkey = chainLib.publicKeyFromSecretKey(privateKey).toString('hex')

    let num = Math.floor(new Date().getTime() / 1000) - 1

    let hash = chainLib.hash256(Buffer.from(num + ''))

    return {
      date: num, // seconds
      address: address,
      pubkey: pubkey,
      signature: chainLib.sign(hash, privateKey).toString('hex')
    }
  }

  export function getDataReclaims(records){
    let out = []
    let index = 0
    for (let record of records) {
      out.push({
        index: index++,
        date: getStrDate(record.date),
        ruffAddr: record.ruffAddr,
        hecoAddr: record.hecoAddr,
        hecoTx: record.hecoTx,
        value: record.value,
        status: getStatus(record)
      })
    }
    return out
  }