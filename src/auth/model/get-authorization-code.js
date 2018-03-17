import { authorizationCodeDB, clientDB, userDB } from '../../services/db'

export async function getAuthorizationCode (authCode) {
  const [data] = await authorizationCodeDB.find({ id: authCode })

  if (!data) return null

  const client = await clientDB.get(data.client_id)
  const user = await userDB.get(data.user_id)

  return {
    code: data.id,
    expiresAt: data.expires_at,
    redirectUri: data.redirect_uri,
    scope: data.scope,
    client: {
      ...client,
      grants: `${client.grants}`.split(/\s/),
      redirectUris: `${client.redirect_uris}`.split(/\s/),
      userId: client.userId
    },
    user
  }
}
