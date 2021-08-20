const express =  require('express')
const router =  express.Router()
const votinguser = require('../models/voting')
const createuserteam = require('../models/create')
const vote = require('../models/vote')
const passport = require('passport')
const {ensureAuthenticated} = require('../passportaut/auth')


router.get('/',(req,res)=>{
    res.render('welcome',{title:'WELCOME'})
})

router.get('/dashboard',ensureAuthenticated,(req,res)=>{
    res.render('dashboard',{
        username:req.user.username,
        title:'DASHBOARD'
    })
})
router.get('/login',(req,res)=>{
    res.render('login',{title:'LOGIN  '})
})

router.get('/register',(req,res)=>{
    res.render('register',{title:'REGISTER  '})
})

router.post('/register',(req,res)=>{
    let errors = []
    if(!req.body.username || !req.body.email || !req.body.password || !req.body.confirmpassword){
        errors.push({msg:'Please fill all requirments'})
    }
    if(req.body.password != req.body.confirmpassword){
        errors.push({msg:'passwords do not match'})
    }
    if(req.body.password.length < 6){
        errors.push({msg:'password should be atleast 6 characters'})
    }
    if(errors.length>0){
        res.render('register',{
            errors
        })
    }
    else{
        votinguser.findOne({email:req.body.email})
        .then((user)=>{
            if(user){
                //user exsists
                errors.push({msg:'Email is already registered'})
                res.render('register',{errors})
            }
            else{
                votinguser.findOne({username:req.body.username})
                    .then(user1=>{
                        if(user1){
                            errors.push({msg:'username is already exsists'})
                            res.render('register',{errors})
                        }
                        else{
                            let userreg = new votinguser({
                                username : req.body.username,
                                email : req.body.email,
                                password : req.body.password
                            })
                            try{
                                userreg.save()
                                req.flash('success_msg','You are now registered and can log in' );
                                res.redirect('/login')
                            }catch(err){
                                console.log(err)
                            }
                        }
                    })
                }
            })           
    }
    
})
router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect: '/dashboard',
        failureRedirect:'/login',
        failureFlash:true
    })(req,res,next)
})

router.get('/logout',(req,res)=>{
    req.logOut()
    req.flash('success_msg','you are logged out')
    res.redirect('/login')
})

router.get('/createTeam',ensureAuthenticated,(req,res)=>{
    res.render('createTeam',{title:'CREATE TEAM '})
})

router.get('/exsistingTeam',ensureAuthenticated,(req,res)=>{
    createuserteam.find({username:req.user.username}).sort({createdAt : 'desc'})
    .then((result)=>{
        res.render('exsistingTeam',{createuserteam : result,title:'EXSISTING TEAMS'})
    })
    .catch((err)=>{
        console.log(err)
    })
})

router.get('/forvoting',ensureAuthenticated,(req,res)=>{
    res.render('voting',{title:'VOTING '})
})


router.post('/createTeam',(req,res)=>{
    let errors2 = []
    
    if(!req.body.teamname || !req.body.design1 || !req.body.design1 || !req.body.code ||!req.body.color1||!req.body.color2){
        errors2.push({msg:'Please fill all requirments'})
    }
    if(req.body.code.length !=4 ){
        errors2.push({msg:'please enter the code of 4 characters'})
    }
    if(errors2.length >0){
        res.render('createTeam',{errors2})
    }
    else{
        let createTeam = new createuserteam({
                username : req.user.username,
                teamname : req.body.teamname,
                design1 : req.body.design1,
                design2 : req.body.design2,
                code : req.body.code,
                color1 : req.body.color1,
                color2 : req.body.color2
            })
        try{
            createTeam.save()
            req.flash('success_msg','You are now registered and can log in' );
            res.redirect('/exsistingTeam')
        }catch(err){
            console.log(err)
        }
    }
})

router.get('/:id',ensureAuthenticated,(req,res)=>{
     createuserteam.findOne({username:req.user.username,_id:req.params.id})
        .then((result)=>{
            vote.find({username:result.username,teamname:result.teamname})
            .then(user=>{
                console.log(user)
                res.render('detailsofTeam', {create:result,vote :user,title:'TEAM'})
            })
            .catch(err=>{
                console.log(err)
            })
            router.post('/end',ensureAuthenticated,(req,res)=>{
                var user_id = result._id
                createuserteam.findByIdAndUpdate(user_id,{code:'123'},function(err,docs){
                    if(err){
                        consolelog(err)
                    }
                    else{
                        console.log(docs)
                    }
                })
                req.flash('success_msg','The voting is ended')
                res.redirect('/')
                console.log(result.code)
            })
        })
   .catch((err)=>{
       console.log('error is',err)
   })
   
})

router.get('/done',ensureAuthenticated,(req,res)=>{
    res.render('voting',{title:'VOTING'})
})

router.post('/forvoting',ensureAuthenticated,(req,res,next)=>{
    let errors1 = []
    if(!req.body.teamname || !req.body.username || !req.body.code){
        errors1.push({msg:"Please fill all the requirments"})
    }
    if(req.body.code !=4){
        errors1.push({msg:"Pin is incorrect OR the admin ended the voting"})
    }
    if(errors1.length>0){
        res.render('voting',{errors1,title:'VOTING'})
    }
    else{
        createuserteam.findOne({code:req.body.code,username:req.body.username})
        .then(user=>{
            if(user.code !=='-' && user.code == req.body.code && user.teamname ==req.body.teamname   &&  (user.username !== req.user.username)){
                var teamname1 = req.body.username
                var teamname2 = req.body.teamname
                res.render('votingpage',{create : user,title:'VOTING'})
                router.post('/done',(req,res)=>{
                    let errors3 = []
                    if(!req.body.participant || !req.body.design){
                        errors3.push({msg:'enter name and select the option to vote'})
                    }
                    if(errors3.length>0){
                        res.render('voting',{errors3,title:'VOTING'})
                    }
                    else{
                        vote.findOne({participant:req.body.participant})
                        .then(user=>{
                            if(user){
                                errors3.push({msg:'You have done your vote already'})
                                res.render('forvoting',{errors3})
                            }
                            else{
                                let votes = new vote({
                                    username:teamname1,
                                    teamname:teamname2,
                                    participant:req.body.participant,
                                    design:req.body.design
                                })
                                try{
                                    votes.save()
                                    res.redirect('/dashboard')
                                }catch(err){
                                    console.log(err)
                                }
                            }
                        })
                    }
                })
            }
            // else{
            //     req.flash('error_msg','enter code is incorrect OR There is no such team for voting OR Admin End the voting OR please fill the requirments')
            //     res.redirect('/forvoting')
            // }
        })
    }
})
module.exports.router = router