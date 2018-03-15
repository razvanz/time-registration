import { default as oAuth2, Request, Response } from '../auth'

export default function authenticate (scope) {
  return function (req, res, next) {
    const request = new Request(req)
    const response = new Response(res)

    ;(async () => {
      try {
        const { client, user } = await oAuth2.authenticate(request, response, { scope })

        req.client = client
        req.user = user
      } catch (e) {
        return next(e)
      }

      return next()
    })()
  }
}
