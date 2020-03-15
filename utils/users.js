///////////////////////////////////////////////////////////
// @author : Mandeep Bisht
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// Users class will store group user related data
class Users {

    constructor() {
        //this array will store data related to current active user
        this.users = [];
    }

    /*
     * addUser function will add user to users array
     */
    addUser(id, username, crew) {

        // Cleaning data
        username = username.trim();
        crew = crew.trim();

        // Validate the data
        if (!username || !crew) {
            return {
                error: 'Username and crew are required'
            }
        }
        // Check for existing user
        const existingUser = this.users.find((user) => {
            return user.crew === crew && crew.username === username;
        });

        // Validate username
        if (existingUser) {
            return {
                error: 'Username is in use!'
            }
        }

        const user = { id, username, crew };
        this.users.push(user);
        return user;
    }

    /*
     * removeUser function will remove user to users array
     */
    removeUser(id) {
        const user = this.getUser(id);
        if (user) {
            this.users = this.users.filter((user) => user.id !== id);
        }
        return user;
    }

    /*
     * getUser function will retrive user data from Users array
     */
    getUser(id) {
        const user = this.users.find((user) => {
            return user.id === id;
        });
        return user;
    }

    /*
     * This function will return list of users in a particular group
     */
    getUserList(crew) {
        const users = this.users.filter((user) => user.crew === crew);

        const userArray = users.map((user) => {
            return user.username;
        });

        return userArray;
    }
}
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// exposing Users class
module.exports = Users;
///////////////////////////////////////////////////////////