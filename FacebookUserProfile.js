/*
    @author: Vikas Pulluri
    @date: 29/07/2018
    @file: FacebookUserProfile.ts
    @description: This is simple facebook user profile handling lookalike concept.
                This file has multiple classes and each class can handle separate functionality.
*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * @description: This is basic data transfer object for every user. It contains all the basic
 *              properties and simple light weight functions associated with user. This is the
 *              object that carries the data between multiple processes.
 */
var UserDTO = /** @class */ (function () {
    function UserDTO(builder) {
        this.userId = builder.userId;
        this.firstName = builder._firstName;
        this.lastName = builder._lastName;
        this.dateOfBirth = builder._dateOfBirth;
        this.interests = builder._interests;
        this.about = builder._about;
        this.location = builder._location;
        this.phoneNumber = builder._phoneNumber;
        this.email = builder._email;
    }
    UserDTO.prototype.getEmail = function () {
        return this.email;
    };
    UserDTO.prototype.getPhoneNumber = function () {
        return this.phoneNumber;
    };
    UserDTO.prototype.toString = function () {
        return JSON.stringify(this);
    };
    return UserDTO;
}());
/**
 * @description: We can extend the user privilieges by giving him some additional powers.
 *               Infact, this is not implemented here in this app, but can be useful if
 *              we are going to use this in future.
 */
var VerifiedUserDTO = /** @class */ (function (_super) {
    __extends(VerifiedUserDTO, _super);
    function VerifiedUserDTO(builder) {
        var _this = _super.call(this, builder) || this;
        _this.isVerified = true;
        _this.hideDateOfBirth = true;
        return _this;
    }
    return VerifiedUserDTO;
}(UserDTO));
/**
 * @description: This class is responsible for building/constructing the user based on the given data
 *              and returns a new instance of Data transfer object(DTO). It implements the "Builder"
 *              design pattern in order to build the user based on the given data.
 *
 */
var UserBuilder = /** @class */ (function () {
    function UserBuilder(userId) {
        this.userId = userId;
        this._firstName = "";
        this._lastName = "";
        this._dateOfBirth = new Date;
        this._about = "";
        this._location = "";
        this._phoneNumber = 0;
        this._interests = [];
        this._email = '';
        this.userId = userId;
    }
    UserBuilder.prototype.getId = function () {
        return this.userId;
    };
    UserBuilder.prototype.firstName = function (name) {
        this._firstName = name;
        return this;
    };
    UserBuilder.prototype.lastName = function (name) {
        this._lastName = name;
        return this;
    };
    UserBuilder.prototype.birthDate = function (date) {
        this._dateOfBirth = date;
        return this;
    };
    UserBuilder.prototype.about = function (data) {
        this._about = data;
        return this;
    };
    UserBuilder.prototype.location = function (name) {
        this._location = name;
        return this;
    };
    UserBuilder.prototype.phone = function (num) {
        this._phoneNumber = num;
        return this;
    };
    UserBuilder.prototype.interests = function (str) {
        this._interests = str;
        return this;
    };
    UserBuilder.prototype.email = function (str) {
        this._email = str;
        return this;
    };
    UserBuilder.prototype.build = function () {
        return new UserDTO(this);
    };
    return UserBuilder;
}());
/**
 * @description: This class will handle individiul user functionalities like signing in, signing out
 *                 and fetching the user basic details like personal info and phonenumber, email etc
 * @methods: signIn(), signOut(), getAge(), getPhoneNumber(), getFullName(), getEmail()
 */
var FacebookUserProfile = /** @class */ (function () {
    function FacebookUserProfile() {
        this.users = FacebookUsers.getInstance();
        this.activeUser = {};
        this.userStatus = 'inactive';
    }
    FacebookUserProfile.prototype.signIn = function (userId) {
        if (this.users.findUser(userId)) {
            this.activeUser = this.users.getUser(userId);
            this.userStatus = 'active';
        }
        else {
            console.log('Please sign in first!!!');
        }
    };
    FacebookUserProfile.prototype.signOut = function () {
        this.activeUser = {};
    };
    FacebookUserProfile.prototype.getAge = function () {
        var today = new Date();
        var birthday = this.activeUser.dateOfBirth;
        var todayMonth = today.getMonth();
        var birthmonth = birthday.getMonth();
        var todayDate = today.getDate();
        var birthdate = birthday.getDate();
        var totalYears = today.getFullYear() - birthday.getFullYear();
        var totalMonths = 0;
        if (todayMonth - birthmonth > 0 || (todayMonth - birthmonth == 0 && todayDate - birthdate > 0)) {
            totalMonths = todayMonth - birthmonth;
        }
        if (todayMonth - birthmonth > 0 && todayDate <= birthdate) {
            totalMonths = totalMonths - 1;
        }
        else if (todayMonth < birthmonth || (todayMonth == birthmonth && todayDate <= birthdate)) {
            totalYears--;
            if (todayMonth == birthmonth) {
                totalMonths = 11 - birthmonth + todayMonth;
            }
            else {
                totalMonths = 12 - birthmonth + todayMonth;
            }
        }
        return Math.floor(totalYears + (totalMonths / 12));
    };
    FacebookUserProfile.prototype.getPhoneNumber = function () {
        return this.activeUser.getPhoneNumber();
    };
    FacebookUserProfile.prototype.getFullname = function () {
        return this.activeUser.firstName + " " + this.activeUser.lastName;
    };
    FacebookUserProfile.prototype.getEmail = function () {
        return this.activeUser.getEmail();
    };
    return FacebookUserProfile;
}());
/*
@description: 'FacebookUsers' class can keep track of all users, creating, reading, updating, deleting
                individual user and implemented in singleton pattern because we need to have single instance of
                this class throught the app runtime. This class works like a FB users database and serves the similar
                kind of functionality
@methods: createUser(), getUsers(), getUser(), findUser(), updateUser(), deleteUser()
*/
var FacebookUsers = /** @class */ (function () {
    function FacebookUsers() {
        this.users = [];
        if (FacebookUsers._instance) {
            throw new Error("Error: Instantiation failed: Use FacebookUsers.getInstance() instead of new.");
        }
        FacebookUsers._instance = this;
    }
    FacebookUsers.getInstance = function () {
        return FacebookUsers._instance;
    };
    FacebookUsers.prototype.createUser = function (user) {
        this.users.push(user);
    };
    FacebookUsers.prototype.getUsers = function () {
        console.log('All users:' + this.users);
        return this.users;
    };
    FacebookUsers.prototype.getUser = function (id) {
        for (var _i = 0, _a = this.users; _i < _a.length; _i++) {
            var user_1 = _a[_i];
            if (user_1.userId === id) {
                console.log("User with id " + id + " is " + user_1.toString());
                return user_1;
            }
        }
        console.log('user not found with given id ' + id);
        return {};
    };
    FacebookUsers.prototype.findUser = function (id) {
        for (var _i = 0, _a = this.users; _i < _a.length; _i++) {
            var user_2 = _a[_i];
            if (user_2.userId === id) {
                return true;
            }
        }
        return false;
    };
    FacebookUsers.prototype.updateUser = function (id, updatedObject) {
        for (var _i = 0, _a = this.users; _i < _a.length; _i++) {
            var user_3 = _a[_i];
            var index = this.users.indexOf(user_3);
            if (user_3.userId === id) {
                this.users[index] = Object.assign(this.users[index], updatedObject);
                return user_3;
            }
        }
        return {};
    };
    FacebookUsers.prototype.deleteUser = function (id) {
        for (var _i = 0, _a = this.users; _i < _a.length; _i++) {
            var user_4 = _a[_i];
            var index = this.users.indexOf(user_4);
            if (user_4.userId === id) {
                this.users.splice(index, 1);
                return this.users;
            }
        }
        return {};
    };
    FacebookUsers._instance = new FacebookUsers();
    return FacebookUsers;
}());
/*
    Constructing UserDTO by using UserBuilder. Created 3 UserDTO's
*/
var user1 = new UserBuilder("vikaspulluri")
    .firstName('Vikas')
    .lastName('Pulluri')
    .location('Chennai')
    .birthDate(new Date('1995-08-15'))
    .about('working in TCS')
    .phone(9494336401)
    .email('vikasiiitn@gmail.com')
    .interests(['coding', 'cricket'])
    .build();
var user2 = new UserBuilder("sahitkumar")
    .firstName('Sahit')
    .lastName('Kumar')
    .location('Chennai')
    .birthDate(new Date('1995-07-12'))
    .about('working in TCS')
    .build();
var user3 = new UserBuilder("ganeshj")
    .firstName('Ganesh')
    .location('Chennai')
    .birthDate(new Date('1995-07-15'))
    .about('working in TCS')
    .phone(9848526728)
    .build();
//Get the main facebook instance and add the above users to instance
var fbUsers = FacebookUsers.getInstance();
fbUsers.createUser(user1);
fbUsers.createUser(user2);
fbUsers.createUser(user3);
//Create a instance for FacebookUserProfile and is the actual individual userProfile instance
var user = new FacebookUserProfile();
//simple signin by providing username
user.signIn('vikaspulluri');
//once the signin success, user status changes to 'active' and log the signedin user
if (user.userStatus === 'active') {
    console.log('active user:');
    logData(user);
}
//get all users in the app instance
fbUsers.getUsers();
//get user by id
console.log('get user by id:');
fbUsers.getUser('sahitkumar');
//update user by id
console.log('after updating lastname:');
var updatedUser = fbUsers.updateUser('vikaspulluri', { lastName: 'Acharyulu' });
console.log(updatedUser.toString());
//delete user by id
console.log('after deleting user sahitkumar');
fbUsers.deleteUser('sahitkumar');
fbUsers.getUsers();
//function to log all users data
function logData(fbUser) {
    console.log("\n        Name: " + fbUser.getFullname() + " \n\n        Phone: " + fbUser.getPhoneNumber() + " \n\n        About: " + fbUser.activeUser.about + " \n\n        Location: " + fbUser.activeUser.location + " \n\n        Birthdate: " + fbUser.activeUser.dateOfBirth + " \n\n        Age: " + fbUser.getAge() + " \n\n        Phone: " + fbUser.getPhoneNumber() + "\n        ");
}
