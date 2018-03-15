import crypto from 'crypto'
import { promisify } from 'util'

const randomBytes = promisify(crypto.randomBytes)

export async function genRandomString (length, encoding) {
  return (await randomBytes(length * 2))
    .toString(encoding)
    .substr(0, length)
}
