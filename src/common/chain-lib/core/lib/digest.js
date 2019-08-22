/*!
 * digest.js - hash functions for bcoin
 * Copyright (c) 2014-2017, Christopher Jeffrey (MIT License).
 * https://github.com/bcoin-org/bcoin
 */
'use strict'
/**
 * @module crypto.digest
 */
const assert = require('assert')
const crypto = require('crypto')
const POOL64 = Buffer.allocUnsafe(64)
/**
 * Hash with chosen algorithm.
 * @param {String} alg
 * @param {Buffer} data
 * @returns {Buffer}
 */
export function hash(alg, data) {
  return crypto
    .createHash(alg)
    .update(data)
    .digest()
}
/**
 * Hash with ripemd160.
 * @param {Buffer} data
 * @returns {Buffer}
 */
export function ripemd160(data) {
  return hash('ripemd160', data)
}
/**
 * Hash with sha1.
 * @param {Buffer} data
 * @returns {Buffer}
 */
export function sha1(data) {
  return hash('sha1', data)
}
export function md5(data) {
  return hash('md5', data)
}
/**
 * Hash with sha256.
 * @param {Buffer} data
 * @returns {Buffer}
 */
export function sha256(data) {
  return hash('sha256', data)
}
/**
 * Hash with sha256 and ripemd160 (OP_HASH160).
 * @param {Buffer} data
 * @returns {Buffer}
 */
export function hash160(data) {
  return ripemd160(sha256(data))
}
/**
 * Hash with sha256 twice (OP_HASH256).
 * @param {Buffer} data
 * @returns {Buffer}
 */
export function hash256(data) {
  return sha256(sha256(data))
}
/**
 * Hash left and right hashes with hash256.
 * @param {Buffer} left
 * @param {Buffer} right
 * @returns {Buffer}
 */
export function root256(left, right) {
  const data = POOL64
  assert(left.length === 32)
  assert(right.length === 32)
  left.copy(data, 0)
  right.copy(data, 32)
  return hash256(data)
}
/**
 * Create an HMAC.
 * @param {String} alg
 * @param {Buffer} data
 * @param {Buffer} key
 * @returns {Buffer} HMAC
 */
export function hmac(alg, data, key) {
  const ctx = crypto.createHmac(alg, key)
  return ctx.update(data).digest()
}
