const TEST_SCHEMA = `time_registration_test_${(Math.random() + '').substr(2, 10)}`

process.env.LOG_LEVEL = 'FATAL'
process.env.DB_URL = process.env.DB_URL || `pg://root:@127.0.0.1:5432/${TEST_SCHEMA}`
process.env.SECURITY_SALT = 'test_salt'
process.env.JWT_ALGORITHM = 'HS256'
process.env.JWT_VALIDITY = 900 // seconds
process.env.JWT_SECRET = 'test_jwt_secret'
