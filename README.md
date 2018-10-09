# Picky

## Setup

1. `git clone https://github.com/cybervinit/picky-appserver` to clone the repository

2. Ask a team member for `.env`, `pm2.json`, and `docker-compose.yml`. (Put it in the `picky-appserver` folder)

3. Run *Docker*

4. `docker-compose build` to build the project components (db, redis, appserver) into the Docker containers 

## Start up

1. `docker-compose up` to start the containers

## Other functionality

### Accessing container through the CLI (i.e. to access MongoDB CLI, etc):

1. `docker ps` (copy the `CONTAINER_ID`)

2. `docker exec -it [CONTAINER_ID] /bin/bash`


