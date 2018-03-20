import _ from 'lodash'
import crypto from 'crypto'
import ResourceDB from '../../../lib/resource-db'
import { genRandomString } from '../utils'

const hashFn = (data, salt) => crypto
  .createHash('sha256')
  .update(`${process.env.SECURITY_SALT}${salt}${data}`)
  .digest('base64')

const isValidPassword = (password, passwordHash) => {
  const salt = passwordHash.substr(0, 20)
  const hash = passwordHash.substr(20)

  return hashFn(password, salt) === hash
}

export default class UserDB extends ResourceDB {
  async create (...values) {
    values = await Promise.all(_.map(values, async v => {
      const salt = await genRandomString(20, 'base64')
      const hash = hashFn(v.password, salt)

      return {
        ...v,
        password: `${salt}${hash}`
      }
    }))

    return super.create(...values)
  }

  async update (...criteria) {
    const v = criteria.pop()

    if (v.password) {
      const salt = await genRandomString(20, 'base64')
      const hash = hashFn(v.password, salt)
      v.password = `${salt}${hash}`
    }

    return super.update(...criteria, v)
  }

  async getByCredentials (email, password) {
    const [user] = await this.find({ email })

    if (!user || !await isValidPassword(password, user.password)) return null

    return user
  }
}
