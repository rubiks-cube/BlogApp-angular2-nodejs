const mongoose = require('mongoose');
mongoose.Promise=global.Promise;
const Schema = mongoose.Schema;




let titleLengthChecker=(title)=>{
if(!title){
  return false;
   }else{
      if(title.length<5 || title.length>50){
        return false;
      }else{
        return true;
      }

   }
};

let alphanumericTitleChecker=(title)=>{
if(!title){
  return false;
}else{
  const regExp=new RegExp(/^[a-zA-Z0-9 ]+$/);
  return regExp.test(title);
}

};

let bodyLengthChecker=(body)=>{

if(!body){
  return false;
   }else{
      if(body.length<5 || body.length>500){
        return false;
      }else{
        return true;
      }

   }



};



let commentlengthChecker=(comment)=>{
if(!comments.comment){
  return false;
}else{
      if(comments.comment.length<2|| comments.comment.length>150){
        return false;
      }else{
        return true;
      }

   }

};

const titleValidators=[{
  validator:titleLengthChecker,
  message:'Title should be between 5-50 characters long'
  },
  {
   validator:alphanumericTitleChecker,
  message:'Title should not have special characters'

}];

const bodyValidators=[{
  validator:bodyLengthChecker,
  message:'body should be between 5-500 characters long'
  }];

const commentValidators=[{
  validator:commentlengthChecker,
  message:'comment should be between 8-150 characters long'

}];

const blogSchema = new Schema({
  
  title:{type:String,required:true,validate:titleValidators},
  body:{type:String,require:true,validate:bodyValidators},
  createdBy:{type:String},
  createdAt:{type:Date,default:Date.now()},
  likes:{type:Number,default:0},
  likedBy:{type:Array},
  dislikes:{type:Number,default:0},
  dislikedBy:{type:Array},
  comments:[
  {
  comment:{type:String},
  commentator:{type:String}
  
  }

  ]
},{usePushEach:true});





module.exports = mongoose.model('Blog', blogSchema);