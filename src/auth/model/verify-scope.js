export async function verifyScope (token, scope) {
  const authorizedScopes = `${token.scope}`.split(/\s/)
  const requestedScopes = `${scope}`.split(/\s/)
  const isScopeAuthorized = authorizedScopes.includes.bind(authorizedScopes)

  if (!authorizedScopes || !authorizedScopes.length) return false
  if (authorizedScopes.includes('admin')) return true

  return requestedScopes.every(isScopeAuthorized)
}
