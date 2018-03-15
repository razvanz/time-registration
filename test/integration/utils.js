import request from 'supertest'
import api from '../../src/express'

export const DAY_MS = 24 * 60 * 60 * 1000

export const add1Day = (date) => new Date(date.getTime() + DAY_MS)
export const subtract1Day = (date) => new Date(date.getTime() - DAY_MS)
export const basicAuth = (username, password) =>
  'Basic ' + Buffer.from(`${username}:${password}`).toString('base64')

export const get = endpoint => request(api).get(endpoint)
export const post = endpoint => request(api).post(endpoint)

export const clientGet = (endpoint, client) =>
  get(endpoint)
    .set('authorization', basicAuth(client.id, client.secret))

export const postForm = endpoint =>
  post(endpoint)
    .set('content-type', 'application/x-www-form-urlencoded')

export const clientPostForm = (endpoint, client) =>
  postForm(endpoint)
    .set('authorization', basicAuth(client.id, client.secret))
