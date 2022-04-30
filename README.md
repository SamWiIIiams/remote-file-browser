# Remote File Browser

## Build instructions

1. `docker build -t remote-file-browser .`
- Builds the docker container according to the included dockerfile

2. `docker run --rm -it -p 8080:80 remote-file-browser`
- Starts the docker container and serves the app at port 8080