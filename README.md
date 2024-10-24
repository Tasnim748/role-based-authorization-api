# Role Based Authorization Node.js API

## Project Setup
After downloading the project enter command `npm install` in terminal for installing the node_modules packages.

## Run the project
Before running the server, MongoDB must be installed in your device. When packages are installed successfully and MongoDB is available in your device, enter command `npm run devStart` in terminal for running the server.

## Create an Admin User
Make a `POST` request with postman or any other tool to url: `http://localhost:3000/super/create-admin` and pass request body like this:

`{
    "username": "your_username",
    "password": "your_password"
}`
