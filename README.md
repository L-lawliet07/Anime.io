

# [Anime.io](https://anime-io.herokuapp.com/)

[Anime.io]() is a realtime chat application built using nodejs, express, mongodb and socket.io.

### Live
[Anime.io](https://anime-io.herokuapp.com/)



## <font color=""> Features </font>

* Uses Express as the application Framework.
* Passwords are hashed using bcrypt-nodejs package.
* Real-time communication between a client and a server using Socket.io. 
  * Real-time Private Communication.
  * Real-time Group Communication.
  * Real-time Notification.
* Uses dotenv to Load environment variables from .env file.
* Uses ejs(Embedded JavaScript) as templating language view engine.
* Uses MongoDB, Mongoose and MongoLab(mLab) for storing and querying data.
* Can Search people and follow them.
* JWT is used for Authentication.


## Tools & technology

* [Nodejs]() : JavaScript runtime environment that executes JavaScript code outside a web browser. 
* [Express]() : Uses Express as the application Framework.
* [Socket.io]() : Real-time communication between a client and a server using Socket.io. 
* [MongoDB]() : MongoDB is a cross-platform document-oriented database program. Classified as a NoSQL database program.
* [JWT]() : JSON Web Token (JWT) is an open standard (RFC 7519) that defines a compact and self-contained way for securely transmitting information between parties as a JSON object. This information can be verified and trusted because it is digitally signed



## Installation 


### Run locally

1. Clone or Download the repository
    
```
    $ git clone
    $ cd Anime.io
```

2. Install Dependencies

```
    $ npm install
```

3. Create Config file(./config.env) and fill all environment variables. see [Setup Configurations]()
```
NODE_ENV=development // Node environment production/development
PORT=8000 // Port to run server
USER=L-lawliet07 // Username
DB_USERNAME=lawliet07 // mongo cloud username
DB_PASSWORD=<Password> // mongo clound password
DB=mongodb+srv://lawliet07:<PASSWORD>@cluster0-9p92d.mongodb.net/AnimeIo?retryWrites=true&w=majority 
DB_LOCAL=mongodb://localhost:27017/animeio
JWT_SECRET=this-is-32-character-long-secret
JWT_EXPIRES_IN=90d // JWT valid duration
JWT_COOKIE_EXPIRES_IN=90 //
EMAIL_USERNAME=<USERNAME>
EMAIL_PASSWORD=<PASSWORD>
EMAIL_HOST= smtp.mailtrap.io
EMAIL_PORT=25

```

4. Run Parcel to bundle multiple javascript files to single file.

```
    $ npm run watch:js
    $ npm run bundle:js
```

5. Start the application

```
    $ npm start
```
Your app should now be running on [localhost:8000](https://localhost:8000/)

### Deploying to Heroku

Make sure you have heroku

## Setup Configurations

### Node 
