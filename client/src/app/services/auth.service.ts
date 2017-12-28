import { Injectable } from '@angular/core';
import{Http,Headers,RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import {tokenNotExpired} from 'angular2-jwt';

@Injectable()
export class AuthService {
   domain="";
  // domain='http:/'+'/localhost:9100/';
   user;
   authToken;
   options;



  constructor(private http:Http) { }


//creating headers to be sent after user login for every request
  createAuthenticationHeaders(){
  this.loadToken();
  this.options= new RequestOptions({
    headers: new Headers({
      'Content-Type':'application/json',
     'authorization': this.authToken
    })
  });

  }

//to get token stored in localstorage for the current user
loadToken(){

this.authToken=localStorage.getItem('token');

}

  registerUser(user){
  
   return this.http.post(this.domain+'authentication/register',user).map(res=>res.json());

  }


   checkUsername(username){
  
   return this.http.get(this.domain+'authentication/checkUsername/'+ username).map(res=>res.json());

  }

   checkEmail(email){
  
   return this.http.get(this.domain+'authentication/checkEmail/'+email).map(res=>res.json());

  }


login(user){

 return this.http.post(this.domain+'authentication/login',user).map(res=>res.json());

}


logout(){
  this.authToken=null;
  this.user=null;
  localStorage.clear();
}

storeUserData(token,user){
    localStorage.setItem('token',token);
    localStorage.setItem('user',JSON.stringify(user));
    this.authToken=token;
    this.user=user;
  }


  getProfile(){
 
    this.createAuthenticationHeaders();
   // console.log(this.options+'BBBBBB');
     return this.http.get(this.domain+'authentication/profile',this.options).map(res=>res.json());
  }
  


getPublicProfile(username){
this.createAuthenticationHeaders();
   // console.log(this.options+'BBBBBB');
     return this.http.get(this.domain+'authentication/publicProfile/'+username,this.options).map(res=>res.json());

}


  loggedIn(){
    return tokenNotExpired();
  }
}