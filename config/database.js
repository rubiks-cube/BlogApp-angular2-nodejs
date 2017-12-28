const crypto=require('crypto').randomBytes(256).toString('hex');

module.exports={
       uri:'mongodb://xyz:qwerty@ds143330.mlab.com:43330/blogapp',
	//uri: 'mongodb://localhost:27017/blogapp',
	secret: crypto,
	db: 'blogapp'
}