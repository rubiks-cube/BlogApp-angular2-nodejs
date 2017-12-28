const mongoose = require('mongoose');
mongoose.Promise=global.Promise;
const Schema = mongoose.Schema;
const bcrypt=require('bcrypt-nodejs');



let emailLengthChecker=(email)=>{
if(!email){
  return false;
   }else{
      if(email.length<5 || email.length>30){
        return false;
      }else{
        return true;
      }

   }
};

let validEmailChecker=(email)=>{
if(!email){
  return false;
}else{
  const regExp=new RegExp(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/);
  return regExp.test(email);
}

};

let usernameLengthChecker=(username)=>{

if(!username){
  return false;
   }else{
      if(username.length<5 || username.length>12){
        return false;
      }else{
        return true;
      }

   }



};

let validUsernameChecker=(username)=>{
if(!username){
  return false;
}else{
  const regExp=new RegExp(/^[a-zA-Z0-9]+$/);
  return regExp.test(username);
}

};

let passwordLengthChecker=(password)=>{

if(!password){
  return false;
   }else{
      if(password.length<8 || password.length>25){
        return false;
      }else{
        return true;
      }

   }



};

let validPasswordChecker=(password)=>{
if(!password){
  return false;
}else{
  const regExp=new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[\d])(?=.*?[\W])(?!.*\s).{8,25}$/);
  return regExp.test(password);
}

};

const emailValidators=[{
  validator:emailLengthChecker,
  message:'Email should be between 5-30 long'
  },
  {
   validator:validEmailChecker,
  message:'Email not valid'

}];

const usernameValidators=[{
  validator:usernameLengthChecker,
  message:'username should be between 5-12 long'
  },
  {
   validator:validUsernameChecker,
  message:'username not valid..ensure no special characters'

}];

const passwordValidators=[{
  validator:passwordLengthChecker,
  message:'password should be between 5-12 long'
  },
  {
   validator:validPasswordChecker,
  message:'password not valid..'

}];

const userSchema = new Schema({
  
  email:{type:String,required:true,unique:true,lowercase:true,validate: emailValidators},
  username:{type:String,required:true,unique:true,lowercase:true,validate:usernameValidators},
  password:{type:String,required:true,validate:passwordValidators}
});

userSchema.pre('save',function(next){

  if(!this.isModified('password')){
    return next();
  }

  bcrypt.hash(this.password,null,null,(err,hash)=>{
       if(err) return next(err);
           this.password=hash;
           next();
       
  });
});

userSchema.methods.comparePassword=function(password){
return bcrypt.compareSync(password,this.password);
};

module.exports = mongoose.model('User', userSchema);