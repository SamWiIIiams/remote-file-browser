# Remote File Browser

## Build instructions

1. `docker build -t remote-file-browser .`
    - Builds the docker container according to the included dockerfile

2. `docker run --rm -it -p 8080:5000 remote-file-browser`
    - Starts the docker container and serves the app at port 8080

3. Navigate to http://localhost:8080
    - Username: Sam
    - Password: 123

4. The directory structure that is being served as the root folder is in /server/root. You can add files and folders in that directory and rebuild the container to test different cases