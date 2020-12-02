<p align = 'center'>

<img src='./assets/images/logo.png'>

</p>


# [Anime.io](https://anime-io.herokuapp.com/)

[Anime.io](https://anime-io.herokuapp.com/) is a social networking website where you can make friends and communicate with them.

### Live
[Anime.io](https://anime-io.herokuapp.com/)


## <font color=""> Features </font>

* Uses Express as the application Framework.
* Real-time communication between client and server using Socket.io. 
  * Real-time Private Communication.
  * Real-time Group Communication.
  * Real-time Notification.
* Uses MongoDB, Mongoose and MongoDB Atlas for storing and querying data.
* Can Search people and follow them.
* Uses ejs(Embedded JavaScript) as templating language view engine.
* JWT is used for Authentication.
* Passwords are hashed using bcrypt-nodejs package.
* Uses dotenv to Load environment variables from .env file.


## Tools & Technology

* **Nodejs** : JavaScript runtime environment that executes JavaScript code outside a web browser. 
* **Express** : Uses Express as the application Framework.
* **Socket.io** : Real-time communication between a client and a server using Socket.io. 
* **MongoDB** : MongoDB is a cross-platform document-oriented database program. Classified as a NoSQL database program.
* **JWT** : JSON Web Token (JWT) is an open standard (RFC 7519) that defines a compact and self-contained way for securely transmitting information between parties as a JSON object. This information can be verified and trusted because it is digitally signed
* **Html & CSS** : Html and CSS is used for frontend design.


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

1. Create Config file(./config.env) and fill all environment variables.
```
NODE_ENV=development    // Node environment production/development
PORT=8000    // Port to run server
USER=L-lawliet07    // Username
DB_USERNAME=lawliet07    // mongo atlas username
DB_PASSWORD=<Password>    // mongo atlas password
DB=mongodb+srv://lawliet07:<PASSWORD>@cluster0-9p92d.mongodb.net/AnimeIo?retryWrites=true&w=majority    // mongo atlas connection string
DB_LOCAL=mongodb://localhost:27017/animeio     // local connection string
JWT_SECRET=this-is-32-character-long-secret
JWT_EXPIRES_IN=90d // JWT valid duration
JWT_COOKIE_EXPIRES_IN=90 
EMAIL_USERNAME=<USERNAME>
EMAIL_PASSWORD=<PASSWORD>
EMAIL_HOST=<HOST>
EMAIL_PORT=<PORT>

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

Make sure you have heroku installed on your machine and have heroku account.

1. Login to heroku on your machine.

```
$ heroku login
```

2. Now create a new app.

```
$ heroku create
```

3. Now push your code to heroku.

```
$ git push heroku master
```

4. Set environment variable on heroku.
    
    * Using Command line.
    ```
        $ heroku config:set <NAME>=<VALUE>
    ```
    * Using Heroku Website 
        
        1) Go to Settings -> Reveal Config Vars.
        2) Now add Environment variable.

5. Now run
```
$ heroku open
```

## Setup Configurations

#### Nodejs
Make sure you have node and npm installed on your machine. 

1. Install all the dependenceis using **npm install** command.
2. Now Go to ./config.env and fill.

```
    NODE_ENV=development    // Node environment production/development
    PORT=8000    // Port to run server
    USER=<USERNAME>    // Username
```

#### MongoDB

**Running Locally**

Make sure you have mongodb installed on your machine.

1. Run Mongo deamon on your computer.

```
    $ mongod
```
###### By default mongod will run on port 27017.

```
    $ mongod --port <PORT>
```
###### MongoDB will run on port <PORT>.

2. Now Go to ./config.env and fill.

```
    DB_LOCAL=mongodb://localhost:<PORT>/animeio
```
###### Here *animeio* is db name.

**Using MongoDB Atlas**

Make sure you have a mongodb account.

1. login to [mongodb.com](https://www.mongodb.com/).
2. Go to new project and enter project name.
3. Click build cluster.
4. Now goto connect and click allow access from anywhere.
5. Now choose connection method(connect your application).
6. Copy the connection string and fill config.env.
```
   DB_USERNAME=<Username>    // mongo atlas username
   DB_PASSWORD=<Password>    // mongo atlas password
   DB=<Connection String>    // mongo atlas connection string
```

#### JWT
 Go to ./config.env and fill.
```
   JWT_SECRET=this-is-32-character-long-secret // jwt secret to sign token
   JWT_EXPIRES_IN=90d // jwt token valid duration (90days)
   JWT_COOKIE_EXPIRES_IN=90 // jwt cookie valid duration (90days)
```

#### EMAIL
* To send email we have used Nodemailer. Nodemailer is a module for Node.js applications to allow easy as cake email sending.
* We have also used Mailtrap for fake smtp server for testing(You can user gmail services).
    
    Make sure you have mailtrap account.
    1. Login to [mailtrap.io](https://mailtrap.io/).
    2. Go to new project and enter inbox name.
    3. Then goto smtp setting copy the credentials and paste it to ./config.env.
    ```
        EMAIL_USERNAME=<USERNAME>
        EMAIL_PASSWORD=<PASSWORD>
        EMAIL_HOST= <HOST>
        EMAIL_PORT=<PORT>
    ```

# Support
If you find it useful, please give it a star and fork it.

---

<div align="center" style=" padding: 10px;"> 

  &lt; C'mon Fork it  /&gt;

</div>
