module.exports = {
    ensureAuthenticated:function(req,res,next){
        if(req.isAuthenticated()){
            return next()
        }
        req.flash('error_msg','Please Login to go to voting page');
        res.redirect('/login')
    }
}