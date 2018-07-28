/*
    @author: Vikas Pulluri
    @date: 29/07/2018
    @file: FacebookUserProfile.ts
    @description: This is simple facebook user profile handling lookalike concept.
                This file has multiple classes and each class can handle separate functionality.
*/

/**
 * @description: This is basic data transfer object for every user. It contains all the basic
 *              properties and simple light weight functions associated with user. This is the 
 *              object that carries the data between multiple processes.
 */
class UserDTO{
    public userId:string;
    public firstName:string;
    public lastName:string;
    public dateOfBirth:Date;
    public interests:string[];
    public about:string;
    public location:string;
    protected email:string;
    protected phoneNumber:number;

    constructor(builder:UserBuilder){
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

    public getEmail():string{
        return this.email;
    }
    public getPhoneNumber():number{
        return this.phoneNumber;
    }
    public toString():string{
        return JSON.stringify(this);
    }
}


/**
 * @description: We can extend the user privilieges by giving him some additional powers.
 *               Infact, this is not implemented here in this app, but can be useful if
 *              we are going to use this in future.
 */
class VerifiedUserDTO extends UserDTO{
    protected isVerified:boolean = true;
    public hideDateOfBirth:boolean = true;
    constructor(builder:UserBuilder){
        super(builder);
    }
}

/**
 * @description: This class is responsible for building/constructing the user based on the given data
 *              and returns a new instance of Data transfer object(DTO). It implements the "Builder" 
 *              design pattern in order to build the user based on the given data.
 *               
 */
class UserBuilder{
    public _firstName:string = "";
    public _lastName:string = "";
    public _dateOfBirth:Date = new Date;
    public _about:string = "";
    public _location:string = "";
    public _phoneNumber:number = 0;
    public _interests:string[] = [];
    public _email:string = '';
    constructor(public userId:string){
        this.userId = userId;
    }

    getId():string{
        return this.userId;
    }

    firstName(name:string):UserBuilder{
        this._firstName = name;
        return this;
    }

    lastName(name:string):UserBuilder{
        this._lastName = name;
        return this;
    }

    birthDate(date:Date):UserBuilder{
        this._dateOfBirth = date;
        return this;
    }

    about(data:string):UserBuilder{
        this._about = data;
        return this;
    }
    location(name:string):UserBuilder{
        this._location = name;
        return this;
    }
    phone(num:number):UserBuilder{
        this._phoneNumber = num;
        return this;
    }
    interests(str:string[]):UserBuilder{
        this._interests = str;
        return this;
    }
    email(str:string):UserBuilder{
        this._email = str;
        return this;
    }

    build(){
        return new UserDTO(this);
    }
    
}
/**
 * @description: This class will handle individiul user functionalities like signing in, signing out
 *                 and fetching the user basic details like personal info and phonenumber, email etc
 * @methods: signIn(), signOut(), getAge(), getPhoneNumber(), getFullName(), getEmail() 
 */

class FacebookUserProfile{
    public users = FacebookUsers.getInstance();
    public activeUser:{[k:string]:any} = {};
    public userStatus:string = 'inactive';
    constructor(){}

    signIn(userId:string){
        if(this.users.findUser(userId)){
            this.activeUser = this.users.getUser(userId);
            this.userStatus = 'active';
        }else{
            console.log('Please sign in first!!!')
        }
    }
    signOut(){
        this.activeUser = {};
    }
    getAge():number{
        let today:Date = new Date();
        let birthday:Date = this.activeUser.dateOfBirth;
        let todayMonth:number = today.getMonth();
        let birthmonth:number = birthday.getMonth()
        let todayDate:number = today.getDate();
        let birthdate:number = birthday.getDate();
        let totalYears:number = today.getFullYear() - birthday.getFullYear();
        let totalMonths:number = 0;
        if(todayMonth-birthmonth > 0 || (todayMonth-birthmonth == 0 && todayDate-birthdate>0)){
            totalMonths = todayMonth-birthmonth;
        }if(todayMonth-birthmonth > 0 && todayDate<=birthdate){
            totalMonths = totalMonths-1;
        }else if(todayMonth<birthmonth ||(todayMonth==birthmonth && todayDate<=birthdate)){
            totalYears--;
            if(todayMonth==birthmonth){
                totalMonths = 11 - birthmonth + todayMonth;
            }else{
                totalMonths = 12 - birthmonth + todayMonth;
            }
        }
        return Math.floor(totalYears + (totalMonths/12));
    }

    getPhoneNumber():number{
        return this.activeUser.getPhoneNumber();
    }
    getFullname():string{
        return `${this.activeUser.firstName} ${this.activeUser.lastName}`; 
    }

    getEmail():string{
        return this.activeUser.getEmail();
    }

}

/*
@description: 'FacebookUsers' class can keep track of all users, creating, reading, updating, deleting
                individual user and implemented in singleton pattern because we need to have single instance of
                this class throught the app runtime. This class works like a FB users database and serves the similar
                kind of functionality
@methods: createUser(), getUsers(), getUser(), findUser(), updateUser(), deleteUser()
*/
class FacebookUsers{
    private static _instance:FacebookUsers = new FacebookUsers();
    public users:UserDTO[] = [];
    constructor(){
        if(FacebookUsers._instance){
            throw new Error("Error: Instantiation failed: Use FacebookUsers.getInstance() instead of new.");
        }
        FacebookUsers._instance = this;
    }
    public static getInstance():FacebookUsers{
        return FacebookUsers._instance;
    }
    createUser(user:UserDTO){
        this.users.push(user);
    }
    getUsers(){
        console.log('All users:' + this.users);
        return this.users;
    }
    getUser(id:string):object{
        for(let user of this.users){
            if(user.userId === id){
                console.log(`User with id ${id} is ${user.toString()}`);
                return user;
            }
        }
        console.log('user not found with given id ' + id);
        return {};
    }
    findUser(id:string):boolean{
        for(let user of this.users){
            if(user.userId === id){
                return true;
            }
        }
        return false;
    }
    updateUser(id:string,updatedObject:object):object{
        for(let user of this.users){
            let index = this.users.indexOf(user);
            if(user.userId === id){
                this.users[index] = (<any>Object).assign(this.users[index],updatedObject);
                return user;
            }
        }
        return {};
    }
    deleteUser(id:string):object{
        for(let user of this.users){
            let index = this.users.indexOf(user);
            if(user.userId === id){
                this.users.splice(index,1);
                return this.users;
            }
        }
        return {};
    }
}


/*
    Constructing UserDTO by using UserBuilder. Created 3 UserDTO's
*/
let user1 = new UserBuilder("vikaspulluri")
                        .firstName('Vikas')
                        .lastName('Pulluri')
                        .location('Chennai')
                        .birthDate(new Date('1995-08-15'))
                        .about('working in TCS')
                        .phone(9494336401)
                        .email('vikasiiitn@gmail.com')
                        .interests(['coding','cricket'])
                        .build();
let user2 = new UserBuilder("sahitkumar")
                        .firstName('Sahit')
                        .lastName('Kumar')
                        .location('Chennai')
                        .birthDate(new Date('1995-07-12'))
                        .about('working in TCS')
                        .build();
let user3 = new UserBuilder("ganeshj")
                        .firstName('Ganesh')
                        .location('Chennai')
                        .birthDate(new Date('1995-07-15'))
                        .about('working in TCS')
                        .phone(9848526728)
                        .build();
//Get the main facebook instance and add the above users to instance
const fbUsers = FacebookUsers.getInstance();
fbUsers.createUser(user1);
fbUsers.createUser(user2);
fbUsers.createUser(user3);

//Create a instance for FacebookUserProfile and is the actual individual userProfile instance
const user = new FacebookUserProfile();

//simple signin by providing username
user.signIn('vikaspulluri');

//once the signin success, user status changes to 'active' and log the signedin user
if(user.userStatus === 'active'){
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
let updatedUser = fbUsers.updateUser('vikaspulluri',{lastName:'Acharyulu'});
console.log(updatedUser.toString());

//delete user by id
console.log('after deleting user sahitkumar');
fbUsers.deleteUser('sahitkumar');
fbUsers.getUsers();

//function to log all users data
function logData(fbUser:any){
    console.log(`
        Name: ${fbUser.getFullname()} \n
        Phone: ${fbUser.getPhoneNumber()} \n
        About: ${fbUser.activeUser.about} \n
        Location: ${fbUser.activeUser.location} \n
        Birthdate: ${fbUser.activeUser.dateOfBirth} \n
        Age: ${fbUser.getAge()} \n
        Phone: ${fbUser.getPhoneNumber()}
        `);
}