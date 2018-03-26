process.env.LOG_LEVEL = 'ERROR'
process.env.DB_URL = `pg://root:@127.0.0.1:5432/time_registration`
process.env.SUPERUSER_PASSWORD = 'q1w2Q!W@'
process.env.HTTP_PORT = '3000'
process.env.SECURITY_SALT = '6swhicKtF9ERJhZnfTIg'
process.env.JWT_ALGORITHM = 'HS256'
process.env.JWT_VALIDITY = 15 * 60 // 15 minutes
process.env.JWT_SECRET = 'test_jwt_secret'
