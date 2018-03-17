import { clientDB } from '../../services/db'

export async function getClient (clientId, clientSecret) {
  const query = Object.assign(
    { id: clientId },
    clientSecret ? { secret: clientSecret } : {}
  )
  const [client] = await clientDB.find(query)

  if (!client) return null

  return {
    ...client,
    grants: `${client.grants}`.split(/\s/),
    redirectUris: `${client.redirect_uris}`.split(/\s/),
    userId: client.user_id
  }
}
