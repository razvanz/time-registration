import { default as oAuth2, Request, Response } from '../auth'

export default function authenticate (reqScope) {
  return function (req, res, next) {
    const request = new Request(req)
    const response = new Response(res)

    ;(async () => {
      try {
        const {
          client,
          user,
          scope
        } = await oAuth2.authenticate(request, response, { scope: reqScope })

        req.client = client
        req.user = user
        req.user.scope = scope
      } catch (e) {
        return next(e)
      }

      return next()
    })()
  }
}
