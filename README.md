# time-registration

Web application facilitating time registration

## Prerequisites

- [`docker`](https://www.docker.com/community-edition)

## Usage

Build docker image

```bash
docker build time-registration -t latest .
```

### Local

Run in docker container

```bash
docker run -d \
	--name time-registration-app \
	-e DB_URL=<postgresql_connection_url> \
	-p 3000:80 \
	time-registration:latest
```

Navigate to [`http://localhost:3000`](http://localhost:3000) in preferred browser.

### Remote

Deploy application container to remote and run it accordingly.
