const express=require('express');
const app=express();
const  mongoose = require('mongoose');
const path =require('path');
const config=require('./config/database');
const authentication=require('./routes/authentication');
const blogs=require('./routes/blogs');
const bodyParser=require('body-parser');
const cors=require('cors');
const port=process.env.PORT || 9100;


mongoose.connect(config.uri,(err)=>{
	if(err){
		console.log(err);
	}
	else{
		console.log(config.db);

	}
});
mongoose.Promise = global.Promise;


app.use(cors({origin:'http://localhost:4200'}));

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


//static directory for frontend
app.use(express.static(__dirname+'/public'));
app.use('/authentication',authentication);
app.use('/blogs',blogs);

app.get('*',(req,res)=>{
res.sendFile(path.join(__dirname+'/public/index.html'));

});

app.listen(port,()=>{
	console.log('listening on ');
});