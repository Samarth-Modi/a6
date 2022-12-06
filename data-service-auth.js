const db = 'mongodb+srv://dbUser:sdmodi@senecaweb.yduebyi.mongodb.net/?retryWrites=true&w=majority';

const bcrypt = require('bcryptjs');
const { Schema } = require('mongoose');

const userSchema = new Schema(
    {
        "UserName":
        {
            type:String,
            unique: true
        },
        "password": String,
        "email" : String,
        "loginHistory":[{dateTime: Date, userAgent:String}]
    });

    let User;

    module.exports.initialize = function()
    {
        return new Promise((res,rej) => 
        {
        User= mongoose.createConnection(db, { useNewUrlParser: true, useUnifiedTopology: true }, function(error){
            if(error){console.log(error);
            rej();
        }
        else {
            console.log("connection successful");
         User = User.model("users", userSchema); 
        res();           
        }
        });
    
    });
}

module.exports.registerUser = function(userData){
    return new Promise((resolve, reject)=> {
    if(userData.password === "" || userData.password2 === ""){
        reject("Error: user name cannot be empty or only white spaces! ");

    }else if(userData.password != userData.password2){
        console.log("Hello "+userData.password, userData.password2);
        reject("Error: Passwords do not match");
    }

    bcrypt.genSalt(10, function(err, salt) { // Generate a "salt" using 10 rounds
        bcrypt.hash(userData.password, salt, function(err, hashValue) { // encrypt the password: "myPassword123"
           if(err){
            reject("There was an error encrypting the password");   
           }else{
            userData.password = hashValue;

            let newUser = new  User(userData);
   
    newUser.save((err) => {
        if(err && err.code == 11000) {
          reject("User Name already taken");
        } else if(err && err.code != 11000) {
          reject("There was an error creating the user: "+err);
        }
        else{
            console.log("Working"); //delete
            resolve();
        }
      
      });
            
           }
        });
        });


    });
}

module.exports.checkUser = function(userData)
{
    return new Promise((res,rej)=>
    {
        User.findOne({username: userData.username}).exec().then((data)=>
        {
            if(!data)
            {
                console.log("Unable to find user:" +userData.username);
                rej();
            }else
            {
                bcrypt.compare(userData.password, data.password).then((res) => {
        
                    console.log("Hello "+userData.user);
                    if (res === true) {
                        console.log("It matches!");
                        data.loginHistory.push({dateTime: (new Date()).toString(), userAgent: userData.userAgent});
                        console.log("User found");
                        User.updateOne(
                            { userName: data.userName},
                            { $set: { loginHistory:  data.loginHistory} }
                          ).exec().then((userData) => {
                            console.log("Success");
                            res(data);
                          })
                          .catch((err) => {
                            console.log(err);
                            rej("Unable to find user: "+userData.user);
                          });
                      }
                      else if(res === false){
                        rej("Unable to find user: "+userData.userName);
                      }
                    });
    
            }
        })
    });
}


    