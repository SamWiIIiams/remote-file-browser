# Remote File Browser - Design Document

## Purpose

To allow a user to browse directory content on a remote server.

## Overview

The application will be comprised of 3 major components - all containerized with Docker for portability

- Frontend written with React
- Nginx reverse proxy
- Backend API written with NodeJS and ExpressJS

![Overview Wireframe](/public/images/TeleportOverviewWF.png)

## Details

### React frontend

The front end will define the user interface for the app and contain 4 custom components:
- App.js: Parent component for the application and contain UI elements that will be visible on each page. i.e. the header & footer
- Folder.js: Will do most of the work for the front end. It will interpret the directory objects returned by the API, display the list of files & directories and enable searching and sorting
- NotFound.js: Basic component that the user will be routed to if they enter a url path that doesn't exist in the file tree
- login.js: User will be routed here if they are not authenticated. Once entering valid credentials, they will be routed back to the url they originally tried to access.

#### URL structure

- domain/ - Navigating to the base url will route you to the root folder in the directory (domain/directories/). each child directory from there will append to the url (domain/directories/child).

- domain/directories - this is the root directory that contains the base directory the users have access to.

- domain/directories/any/folder - If a user is unauthenticated, the route will remain but they will only ever see the login screen until authenticated.

#### Dependencies and libraries

- `react-router-dom` useful for implementing strict url navigation.
- `font-awesome` for adding fancy folder and file symbols

#### Error handling/test cases

- When a user navigates to a URL that does not map to a directory location, they will be routed to a page that tells them this. There should be a link that takes them back to the root directory of the file tree.

- Folder and file names that are very long should be truncated (in the display) before they disrupt the formatting of the page. The same goes for the search bar field.

- Should display relevant error messages to the user if there are any errors returned by any API calls.

### NodeJS web server & API

The nodeJS backend will use ExpressJS to create a lightweight server for serving the static files from the React application. The API will receive requests for a directory location from the frontend and return the data in that directory. It will also provide authentication capabilities by verifying a user has provided a valid csrf token and session cookie corresponding to a valid session each time they make an API call for new information.

#### Dependencies and libraries

- `bcrypt` For hashing and comparing passwords
- `ExpressJS` Framework for making simple and lightweight web service and RESTful API
- `express.static` middleware for serving static assets
- `cookie-parser` parses cookies attached to the client request object

#### Endpoints

- All endpoints will return a `200` status code if successful.
- /login: POST request that receives the username and password in the body. finds the username, hashes the password, and compares it with the stored password.
    - If the username does not exist, returns an error with status code `401`.
    - If the password hashes do not match, returns an error with status code `401`.
- /logout: DELETE request that destroys the session provided in the session cookie. User will be routed to the login page.
    - If there isn't an active session that matches the users cookie i.e. the session expired and the static assets are cached, response code `400` is returned and the user is redirected to the login screen.
- /login: GET request that is used to check whether a user is logged in upon first navigating to or refreshing the app.
    - If the request does not contain a valid session cookie, will return an error with status code `401`. Frontend will redirect to login page.
    - If successfully authenticated, server will create and maintain a session for this user until it expires or the user logs off. It will return a `200` status and issue a session cookie to be used for future API calls to the server.
- /directory: GET request that receives the path denoted in the url in the body and returns the directory information in its response.
    - If the request does not contain a valid session cookie, returns an error with status code `401`.
    - If the directory does not exist, returns an error with status code `404`.
    - If the directory requested is outside of the root directory, return an error with status code `403`.
    - If successful, the returned directory information will pass a JSON object to the front end. It will contain an array of directory objects that can be found at the path provided by the user. Each request only returns the objects at that reside at that location, and not any children of directory objects.
    - directory objects have the following JSON format: 
    {
        "name": "name of current directory",
        "result": [
            {
                "name": "nameOfFile",
                "type": "dir or file",
                "size": "humanReadableSize",
                "id": "assigned an ID"
            }
        ]
    }

### Nginx reverse proxy

The Nginx reverse proxy will act as the middleman between the client and the ExpressJS webserver. It will take requests made from the client and pass them on to the ExpressJS server.

### Docker container

Instructions for building and running the container will be in the README.md file. Will use docker-compose to setup multi-stage build

### Security considerations

- XSS: React does a good job at securing the site on its own, however there are a few areas to consider. 
    - At this point in the design process, I see no reason to allow the user to input text that will be rendered on the page. If this changes during the development process, it will be important to ensure that the user is not able to directly modify the DOM. Since react outputs data between JSX elements using auto-escaping, This would be the place to render user-supplied text if it becomes necessary
    - There will certainly be no need to render any HTML elements dynamically from a variable and therefore no need to ever set `innerHTML`.
- CSRF: CORS will be enabled on the server which will halt any api calls that are not made by the client. This will only be respected by modern browsers, however, so to truly secure it, I will include a CSRF token with each request. CSRF tokens will sent in the headers of requests to the server so they are not automatically transmitted in the case of a CSRF attack
- Open Redirect: The one place where an open redirect could occur in this app design is when the user is automatically routed to and away from the login page. In order to avoid this, the login page does not have its own route and therefore there is no need to excecute a redirect using a value from the url path. For example, had I passed a prop into the login component that contained the original url a user tried to access, for example `localhost:port/teleport&next=www.evilwebsite`, and an unauthenticated user clicked that link, after authenticating they would be redirected to `www.evilwebsite`. In this way, there is no direct route to the login page; an authenticated user will never see the login screen and an unauthenticated user always will.
- Directory traversal attack: Since this app is designed to serve directory content from a server, it is important to restrict them only to the folders I want them to have access to. Node allows the setting of a root directory which is a good start. It will also be important to normalize the supplied path to ensure there are no `../../` or poison null bytes included
- Cookies: the app will make use of cookies for session management
    - cookies will have the `HttpOnly` attribute set to provide protection from XSS attacks. this way they will not be accessible by scripts.
    - cookies will remain valid until the user logs out or the session expires as determined by `maxAge` attribute
    - *stretch goal: setup an SSL/TLS connection and send cookies with the `secure` attribute*
    

### Deployment plan

The first few PRs will contain only the code relevant to the level 2 implementation. While this will ultimately create more work as I will have to adapt the app to get the directory data from an actual directory via the backend API, I believe it is useful to create a functioning POC that customers (interviewers) can see early in the development process.

