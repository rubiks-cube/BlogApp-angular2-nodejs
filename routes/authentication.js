const User=require('../models/user');
const express=require('express');
const jwt=require('jsonwebtoken');
const config=require('../config/database');
var router=express.Router();
module.exports=router;


router.post('/register',(req,res)=>{

if(req.body.email==null){
	res.json({success:false,message:'missing email'});
}else{
	if(!req.body.username==null){
		res.json({success:false,message:'missing username'});
	}else{
		if (!req.body.password==null) {
                  res.json({success:false,message:'missing pw'});
		}else{
			let user =  new User({
				email:req.body.email.toLowerCase(),
				username:req.body.username.toLowerCase(),
				password:req.body.password
			});

			user.save((err)=>{
				if(err){
                    if(err.code==11000){
                    	res.json({success:false,message:'Username or Password ALready Exists'});
                    }else{
                    	if(err.errors){
                    		if(err.errors.email){
                    			res.json({success:false,message:err.errors.email.message});
                    		}else if(err.errors.username){
                    			res.json({success:false,message:err.errors.username.message});
                    		}else{
                    			res.json({success:false,message:err.errors.password.message});
                    		}
                    	}else{
					res.json({success:false,message:'user not saved'});
				          }
				       }
				}
				else{
					res.json({success:true,message:'Registration successful!'});
				}
			});
          
		}
	}
	
}

});

router.get('/checkEmail/:email',(req,res)=>{
  
if(req.params.email==null ||  req.params.email==''){
	res.json({success:false,message:'Email not provided'});
  
}else{

	User.findOne({email:req.params.email},(err,user)=>{

		if(err){res.json({success:false,message:err});
	    }else{

           if(user){
           	res.json({success:false,message:'Email already exists'});
           }else{

           	res.json({success:true,message:'Email available'});
           }

	    }
	});
}


});



router.get('/checkUsername/:username',(req,res)=>{
if(req.params.username==null || req.params.username==''){
	res.json({success:false,message:'Username not provided'});
}else{

	User.findOne({username:req.params.username},(err,user)=>{

		if(err){res.json({success:false,message:err});
	    }else{

           if(user){
           	res.json({success:false,message:'Username already exists'});
           }else{

           	res.json({success:true,message:'Username available'});
           }

	    }
	});
}


});


router.post('/login',(req,res)=>{
  
if(!req.body.username){
	res.json({success:false, message:'Username empty'});
}else{
     if(!req.body.password){
     	res.json({success:false, message:'Password empty'});
     }else{

     	User.findOne({username:req.body.username.toLowerCase()},(err,user)=>{

           if(err) {
           	res.json({success:false, message:err});
           }else{
           	if(!user){
           		res.json({success:false, message:'Username not found'});
           	}else{

               const validPassword=user.comparePassword(req.body.password);
               if(!validPassword){
               	res.json({success:false, message:'Password not correct'});
               }else{

               	const token=jwt.sign({userId:user._id},config.secret,{expiresIn:'10h'});
               	res.json({success:true, message:'User authenticated...Success!',token:token,user:{username:user.username}});
               }

           	}
           }


     	});
     }

}


});


router.use(function(req,res,next){

const token=req.headers['authorization'];

if(!token){
    if(token==undefined){res.json({success:false});}
    else{
  res.json({success:false,message:'no token provided'});
}
}else{

  jwt.verify(token,config.secret,function(err,decoded){
    if(err){
      res.json({success:false,message:'token invalid'+err});
    }
    else{
       req.decoded=decoded;
       
       next();
    }

  });
}



});

router.get('/profile',(req,res)=>{
User.findOne({_id:req.decoded.userId}).select('username email').exec((err,user)=>{
if(err){
   res.json({success:false,message:err});
}else{
  if(!user){
     res.json({success:false,message:'User not found'});
  }else{

     res.json({success:true,user:user});
     //console.log(user);
  }
}


});

});


router.get('/publicProfile/:username', (req, res) => {
    // Check if username was passed in the parameters
    if (!req.params.username) {
      res.json({ success: false, message: 'No username was provided' }); // Return error message
    } else {
      // Check the database for username
      User.findOne({ username: req.params.username }).select('username email').exec((err, user) => {
        // Check if error was found
        if (err) {
          res.json({ success: false, message: 'Something went wrong.' }); // Return error message
        } else {
          // Check if user was found in the database
          if (!user) {
            res.json({ success: false, message: 'Username not found.' }); // Return error message
          } else {
            res.json({ success: true, user: user }); // Return the public user's profile data
          }
        }
      });
    }
  });
