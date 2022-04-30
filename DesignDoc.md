# Remote File Browser - Design Document

## Purpose

To allow a user to browse directory content on a remote server.

## Overview

The application will be comprised of 3 major components - all containerized with Docker for portability

- Frontend written with React
- Nginx webserver
- Backend API written with NodeJS

![Overview Wireframe](/public/images/TeleportOverviewWF.png)

## Details

### React frontend

The front end will define the user interface for the app and contain 4 custom components:
- App.js: Parent component for the application and contain UI elements that will be visible on each page. i.e. the header & footer
- Folder.js: Will do most of the work for the front end. It will interpret the directory objects returned by the API, display the list of files & directories and enable searching and sorting
- NotFound.js: Basic component that the user will be routed to if they enter a url path that doesn't exist in the file tree
- login.js: User will be routed here if they are not authenticated. Once entering valid credentials, they will be routed back to the url they originally tried to access.

#### Dependencies

- react-router v6: useful for implementing strict url navigation

#### Error handling/test cases

- When a user navigates to a URL that does not map to a directory location, they will be routed to a page that tells them this. There should be a link that takes them back to the root directory of the file tree.

- Folder and file names that are very long should be truncated (in the display) before they disrupt the formatting of the page. The same goes for the search bar field.

- Should display relevant error messages to the user if there are any errors returned by any API calls.

#### Trade-offs

### NodeJS backend API

The backend API will receive requests for a directory location from the frontend and return the data in that directory. It will also provide authentication capabilities by verifying a user has an active session open each time they make an API call for new information.

#### Dependencies

- bcrypt: For hashing and comparing passwords

- jsonwebtoken: for creating and validating tokens issued to users after login *If I have time*


#### Error handling/test cases

- gracefully catch any errors thrown for each API call and return relevant messages to be communicated to the user by the frontend.

- User should be prevented from accessing any server directories outside the intended target directory.

#### Trade-offs

- If I do not have time, I will omit including authentication tokens.

### Nginx web server

fer survin it up

### Docker container

Instructions for building and running the container will be in the README.md file


