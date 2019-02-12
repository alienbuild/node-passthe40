class Users {
    constructor() {
        this.users = [];
    }
    // Add user
    addUser(id, name, room){
        var user = {id, name, room};
        this.users.push(user);
        return user;
    }
    // Remove user
    removeUser(id){
        // Return user that was removed
        const user = this.getUser(id);

        if (user) {
            this.users = this.users.filter((user) => user.id !== id);
        }

        return user;
    }
    // Get user
    getUser(id){
        return this.users.filter((user) => user.id === id)[0];
    }
    // Get user list
    getUserList(room){
        const users = this.users.filter(user => user.room === room);
        var namesArray = users.map((user) => user);
        return namesArray;
    }
}

module.exports = {Users};