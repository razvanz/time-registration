const WEB_CLIENT = {
  id: 'CeXXc6iZOXHYIp2ymFcWLZD3uAd1v6hvBazN',
  secret: 'O90q3A8SSIQ3ZNItgxI4T90xVJp8NREm8ENpAczOyDHhjkh8Lg4jhAI2yyh91mtM',
  name: 'WebApplication',
  description: 'Time registration web application client',
  grants: ['password', 'refresh_token'],
  redirect_uris: [],
  user_id: null
}

exports.up = function (knex) {
  return knex('clients')
    .insert(WEB_CLIENT)
}

exports.down = function (knex) {
  return knex('clients')
    .where('id', WEB_CLIENT.id)
    .delete()
}
