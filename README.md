# time-registration

Web application facilitating time registration

## Prerequisites

- [PostgreSQL](https://www.postgresql.org/)

## Usage

### Local

Configure environment variables:

- `LOG_LEVEL` - Decide how much you want the system to log. (example : `'ERROR'`)
- `DB_URL` - Connection URL for PostgreSQL database. (example : ``pg://root:@127.0.0.1:5432/time_registration``)
- `HTTP_HOST` - Host on which the server will listen. (example : `'0.0.0.0'`)
- `HTTP_PORT` - Port on which the server will listen. (example : `'3000'`)
- `SECURITY_SALT` - A "system secret" to be used for hashing passwords. (example : `'6swhicKtF9ERJhZnfTIg'`)
- `JWT_ALGORITHM` - Algorithm used to sign JWT token. (example : `'HS256'`)
- `JWT_VALIDITY` - JWT expiration period. (example : `15 * 60 // 15 minutes`)
- `JWT_SECRET` - A "system secred" to be used to sign the JWT token. (example : `'test_jwt_secret'`)


Install dependencies

```bash
npm install
```

Build assets

```bash
npm run build
```

Run the server

```bash
# Remember enviromnet variables
npm run start
```

### Development

For frontent work, a special npm script will watch client files and automatically build assets on change. It will however not watch and build the server.

Run with:

```bash
# Remember enviromnet variables
npm run watch
```

Navigate to [http://localhost:3000](http://localhost:3000) in preferred browser.

### Remote

Build docker container:

```bash
docker build -t time-registration:latest -f Dockerfile .
```

Deploy application container to remote and run it accordingly:

```bash
docker run -d \
	--name time-registration-app \
	-e LOG_LEVEL="INFO" \
	-e ... \
	-p 3000:80 \
	time-registration:latest
```
