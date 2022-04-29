# Remote File Browser - Design Document

## Purpose

To allow a user to browse directory content on a remote server.

## Overview

The application will be comprised of 3 major components - all containerized with Docker for portability

- Frontend written with React
- Nginx webserver
- Backend API written with NodeJS

## Details

### React frontend

The front end will define the user interface for the app and contain 4 custom components:
- App.js: Parent component for the application and contain UI elements that will be visible on each page. i.e. the header & footer
- Folder.js: Will do most of the work for the front end. It will interpret the directory objects returned by the API, display the list of files & directories and enable searching and sorting
- NotFound.js: Basic component that the user will be routed to if they enter a url path that doesn't exist in the file tree
- login.js: User will be routed here if they are not authenticated. Once entering valid credentials, they will be routed back to the url they originally tried to access.

### NodeJS backend API


### Nginx web server


### Docker container


