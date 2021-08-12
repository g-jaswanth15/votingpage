const LocalStrategy = require('passport-local').Strategy;

const votinguser = require('../models/voting')
const createuserteam = require('../models/create')

module.exports = function(passport){
    passport.use(
        new LocalStrategy({usernameField:'username'},(username,password,done)=>{
            //Matching the user
            votinguser.findOne({username:username})
            .then(user =>{
                if(!user){
                    return done(null,false,{message:'the username is not registered under your email'})
                }
                if(password !== user.password){
                    return done(null,false,{message:'password is incorrect'})
                }
                else{
                    return done(null,user)
                }
            })
        //     createuserteam.findOne({teamname:username})
        //     .then(user1=>{
        //         if(!user1){
        //             return done(null,false,{message:'the team does not exsist'})
        //         }
        //         if(password !== user1.code){
        //             return done(null,false,{message:'code is incorrect'})
        //         }
        //         else{
        //             return done(null,user1)
        //         }
        //     })
        })
    )
    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
    
    passport.deserializeUser(function(id, done) {
        votinguser.findById(id, function(err, user) {
          done(err, user);
        });
    });
}