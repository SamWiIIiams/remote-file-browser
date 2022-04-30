# Remote File Browser

## Build instructions

1. `docker build -t remote-file-browser .`
    - Builds the docker container according to the included dockerfile

2. `docker run --rm -it -p 8080:80 remote-file-browser`
    - Starts the docker container and serves the app at port 8080

## Authentication

Each reviewer has an "account" already created for them.

- Username: github username
- password: goTeleport123

## Testing

If a testing case that involves changing the folder tree is desired, you can add any files or folders in the /public/root folder and rebuild the container