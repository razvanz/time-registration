import { assert } from 'chai'
import crypto from 'crypto'
import uuid from 'uuid'
import * as jwt from '../../src/services/jwt'
import {
  clientDB,
  refreshTokenDB,
  userDB,
  userScopeDB
} from '../../src/services/db'
import {
  add1Day,
  subtract1Day,
  basicAuth,
  postForm,
  clientPostForm
} from './utils'

const users = [{
  id: uuid(),
  name: 'Test user 1',
  email: 'email1@test.client',
  password: 'secret password 1'
}, {
  id: uuid(),
  name: 'Test user 2',
  email: 'email2@test.client',
  password: 'secret password 2'
}]
const clients = [{
  id: crypto.randomBytes(50).toString('base64').substr(0, 36),
  secret: crypto.randomBytes(128).toString('base64'),
  name: 'Test client',
  description: '',
  grants: 'password client_credentials refresh_token',
  redirect_uris: 'http://localhost:3000/callback',
  userId: null
}, {
  id: crypto.randomBytes(50).toString('base64').substr(0, 36),
  secret: crypto.randomBytes(128).toString('base64'),
  name: 'Test client',
  description: '',
  grants: 'client_credentials',
  redirect_uris: 'http://localhost:3000/callback',
  userId: users[1].id
}]
const userScopes = [{
  id: uuid(),
  userId: users[0].id,
  scope: 'manager'
}, {
  id: uuid(),
  userId: users[1].id,
  scope: 'user'
}]

describe('/oauth2/token', () => {
  let res

  before(async () => {
    await clientDB.create(...clients)
    await userDB.create(...users)
    await userScopeDB.create(...userScopes)
  })

  after(async () => {
    await clientDB.delete('id', 'is not', null)
    await refreshTokenDB.delete('id', 'is not', null)
    await userDB.delete('id', 'is not', null)
    await userScopeDB.delete('id', 'is not', null)
  })

  describe('unsupported grant', () => {
    before(async () => {
      res = await clientPostForm('/oauth2/token', clients[0])
        .send({ grant_type: 'unsupported_grant' })
    })

    it('returns 400', () => assert.equal(res.statusCode, 400))
    it('responds with error', () => {
      assert.equal(res.body.code, 'E_UNSUPPORTED_GRANT_TYPE')
    })
  })

  describe('password', () => {
    describe('success', () => {
      before(async () => {
        res = await clientPostForm('/oauth2/token', clients[0])
          .send({
            grant_type: 'password',
            username: users[0].email,
            password: users[0].password
          })
      })

      it('returns 200', () => assert.equal(res.statusCode, 200))
      it('responds with accessToken', () => {
        assert.property(res.body, 'accessToken')
        assert.property(res.body, 'accessTokenExpiresAt')
        assert.notEqual(
          new Date(res.body.accessTokenExpiresAt).toString(),
          'Invalid Date'
        )
      })
      it('responds with refreshToken', () => {
        assert.property(res.body, 'refreshToken')
        assert.property(res.body, 'refreshToken')
        assert.notEqual(
          new Date(res.body.refreshTokenExpiresAt).toString(),
          'Invalid Date'
        )
      })
      it('responds with scope', () => {
        assert.equal(res.body.scope, 'manager')
      })
    })

    describe('fail - missing credentials', () => {
      before(async () => {
        res = await clientPostForm('/oauth2/token', clients[0])
          .send({
            grant_type: 'password',
            username: users[0].email
          })
      })

      it('returns 400', () => assert.equal(res.statusCode, 400))
      it('responds with error', () => {
        assert.equal(res.body.code, 'E_INVALID_REQUEST')
      })
    })

    describe('fail - invalid credentials', () => {
      before(async () => {
        res = await clientPostForm('/oauth2/token', clients[0])
          .send({
            grant_type: 'password',
            username: users[0].email,
            password: 'bad password'
          })
      })

      it('returns 400', () => assert.equal(res.statusCode, 400))
      it('responds with error', () => {
        assert.equal(res.body.code, 'E_INVALID_GRANT')
      })
    })

    describe('fail - invalid scope', () => {
      before(async () => {
        res = await clientPostForm('/oauth2/token', clients[0])
          .send({
            grant_type: 'password',
            username: users[0].email,
            password: users[0].password,
            scope: 'admin'
          })
      })

      it('returns 400', () => assert.equal(res.statusCode, 400))
      it('responds with error', () => {
        assert.equal(res.body.code, 'E_INVALID_SCOPE')
      })
    })
  })

  describe('refresh_token', () => {
    const refreshTokens = [{
      id: crypto.randomBytes(128).toString('base64'),
      expiresAt: add1Day(new Date()),
      scope: 'manager',
      clientId: clients[0].id,
      userId: users[0].id
    }, {
      id: crypto.randomBytes(128).toString('base64'),
      expiresAt: subtract1Day(new Date()),
      scope: 'admin',
      clientId: clients[0].id,
      userId: users[0].id
    }]

    describe('success', () => {
      before(async () => {
        await refreshTokenDB.create(...refreshTokens)

        res = await clientPostForm('/oauth2/token', clients[0])
          .send({
            grant_type: 'refresh_token',
            refresh_token: refreshTokens[0].id
          })
      })

      after(async () => {
        await refreshTokenDB.delete('id', 'is not', null)
      })

      it('returns 200', () => assert.equal(res.statusCode, 200))
      it('responds with accessToken', () => {
        assert.property(res.body, 'accessToken')
        assert.property(res.body, 'accessTokenExpiresAt')
        assert.notEqual(
          new Date(res.body.accessTokenExpiresAt).toString(),
          'Invalid Date'
        )
      })
      it('responds with new refreshToken', () => {
        assert.property(res.body, 'refreshToken')
        assert.property(res.body, 'refreshToken')
        assert.notEqual(
          new Date(res.body.refreshTokenExpiresAt).toString(),
          'Invalid Date'
        )
      })
      it('responds with scope', () => {
        assert.equal(res.body.scope, 'manager')
      })

      describe('revokes old token', () => {
        before(async () => {
          res = await clientPostForm('/oauth2/token', clients[0])
            .send({
              grant_type: 'refresh_token',
              refresh_token: refreshTokens[0].id
            })
        })

        it('returns 400', () => assert.equal(res.statusCode, 400))
        it('responds with error', () => {
          assert.equal(res.body.code, 'E_INVALID_GRANT')
        })
      })
    })

    describe('success - ignores extra scope', () => {
      before(async () => {
        await refreshTokenDB.create(...refreshTokens)

        res = await clientPostForm('/oauth2/token', clients[0])
          .send({
            grant_type: 'refresh_token',
            refresh_token: refreshTokens[0].id,
            scope: 'manager admin'
          })
      })

      after(async () => {
        await refreshTokenDB.delete('id', 'is not', null)
      })

      it('returns 200', () => assert.equal(res.statusCode, 200))
      it('returns refresh token scope', async () => {
        const { accessToken, scope } = res.body
        const { scope: tokenScope } = await jwt.decode(accessToken)
        assert.equal(tokenScope, refreshTokens[0].scope)
        assert.equal(scope, refreshTokens[0].scope)
      })
    })

    describe('fail - missing token', () => {
      before(async () => {
        res = await clientPostForm('/oauth2/token', clients[0])
          .send({ grant_type: 'refresh_token' })
      })

      it('returns 400', () => assert.equal(res.statusCode, 400))
      it('responds with error', () => {
        assert.equal(res.body.code, 'E_INVALID_REQUEST')
      })
    })

    describe('fail - invalid token', () => {
      before(async () => {
        res = await clientPostForm('/oauth2/token', clients[0])
          .send({
            grant_type: 'refresh_token',
            refresh_token: crypto.randomBytes(128).toString('base64')
          })
      })

      it('returns 400', () => assert.equal(res.statusCode, 400))
      it('responds with error', () => {
        assert.equal(res.body.code, 'E_INVALID_GRANT')
      })
    })

    describe('fail - expired token', () => {
      before(async () => {
        await refreshTokenDB.create(...refreshTokens)

        res = await clientPostForm('/oauth2/token', clients[0])
          .send({
            grant_type: 'refresh_token',
            refresh_token: refreshTokens[1].id
          })
      })

      after(async () => {
        await refreshTokenDB.delete('id', 'is not', null)
      })

      it('returns 400', () => assert.equal(res.statusCode, 400))
      it('responds with error', () => {
        assert.equal(res.body.code, 'E_INVALID_GRANT')
      })
    })
  })

  describe('client_credentials', () => {
    describe('success', () => {
      before(async () => {
        res = await clientPostForm('/oauth2/token', clients[1])
          .send({ grant_type: 'client_credentials' })
      })

      it('returns 200', () => assert.equal(res.statusCode, 200))
      it('responds with accessToken', () => {
        assert.property(res.body, 'accessToken')
        assert.property(res.body, 'accessTokenExpiresAt')
        assert.notEqual(
          new Date(res.body.accessTokenExpiresAt).toString(),
          'Invalid Date'
        )
      })
      it('responds with scope', () => {
        assert.equal(res.body.scope, 'user')
      })
    })

    describe('fail - client without user', () => {
      const clientWithoutUser = {
        id: crypto.randomBytes(50).toString('base64').substr(0, 36),
        secret: crypto.randomBytes(128).toString('base64'),
        name: 'Client without user',
        description: '',
        grants: 'client_credentials',
        redirect_uris: 'http://localhost:3000/cb',
        userId: null
      }

      before(async () => {
        await clientDB.create(clientWithoutUser)

        const auth = basicAuth(clientWithoutUser.id, clientWithoutUser.secret)
        res = await postForm('/oauth2/token')
          .set('authorization', auth)
          .send({ grant_type: 'client_credentials' })
      })

      after(async () => {
        await clientDB.delete({ id: clientWithoutUser.id })
      })

      it('returns 400', () => assert.equal(res.statusCode, 400))
      it('responds with error', () => {
        assert.equal(res.body.code, 'E_INVALID_GRANT')
      })
    })

    describe('fail - missing credentials', () => {
      before(async () => {
        res = await postForm('/oauth2/token')
          .send({ grant_type: 'client_credentials' })
      })

      it('returns 400', () => assert.equal(res.statusCode, 400))
      it('responds with error', () => {
        assert.equal(res.body.code, 'E_INVALID_CLIENT')
      })
    })

    describe('fail - invalid credentials', () => {
      before(async () => {
        res = await postForm('/oauth2/token')
          .set('authorization', basicAuth('invalid-id', 'invalid-secret'))
          .send({ grant_type: 'client_credentials' })
      })

      it('returns 400', () => assert.equal(res.statusCode, 400))
      it('responds with error', () => {
        assert.equal(res.body.code, 'E_INVALID_CLIENT')
      })
    })

    describe('fail - invalid scope', () => {
      before(async () => {
        res = await clientPostForm('/oauth2/token', clients[1])
          .send({
            grant_type: 'client_credentials',
            scope: 'admin'
          })
      })

      it('returns 400', () => assert.equal(res.statusCode, 400))
      it('responds with error', () => {
        assert.equal(res.body.code, 'E_INVALID_SCOPE')
      })
    })
  })
})
