## demo app - developing with Docker

This simple app allows to display and update a user profile

All components are docker-based

### With Docker

#### To start the application

Step 1: Create docker network

    docker network create mongo-network 

Step 2: start mongodb 

    docker run -d -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=password --name mongodb --net mongo-network mongo    

Step 3: start mongo-express
    
    docker run -d -p 8081:8081 -e ME_CONFIG_MONGODB_ADMINUSERNAME=admin -e ME_CONFIG_MONGODB_ADMINPASSWORD=password --net mongo-network --name mongo-express -e ME_CONFIG_MONGODB_SERVER=mongodb mongo-express   

_NOTE: creating docker-network is optional. You can start both containers in a default network. In this case, just emit `--net` flag in `docker run` command_

Step 4: open mongo-express from browser

    http://localhost:8081

Step 5: create `user-account` _db_ and `users` _collection_ in mongo-express

Step 6: Start your nodejs application 
- locally:
    $cd app
    $npm install 
    $node server.js --localhost or $npm run start

- in a container:
    docker build -f frontend.Dockerfile .

    
Step 7: Access you nodejs application UI from browser
    http://localhost:3000

### With Docker Compose

#### To start the application

- Running the server locally

Step 1: build the backend containers
    docker-compose -f backend-service.yaml up
    
_You can access the mongo-express under localhost:8080 from your browser_
        
Step 2: start node server 
    $cd app
    $npm install
    $node server.js

Step 3: access the nodejs application from browser 
    http://localhost:3000



- Running the server from a container

Step1: Build the backend and frontend containers
    docker-compose -f fullstack-app.yaml up

_You can access the mongo-express under localhost:8080 from your browser_

Step 2: access the nodejs application from browser 
    http://localhost:3000


#### To build a docker image from the front end application
    docker build -t profile-app-frontend:1.0 -f frontend.Dockerfile .       

#### To build a docker container from the back end application
    docker-compose -f backend-service.yaml up
