import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private auth : AngularFireAuth) { }
  credentials  = {
    email: '',
    password: '',

  }
  showAlert = false ; 
  alertMsg = ' Please wait'
  alertColor = 'blue'
  inSubmission = false ; 

  ngOnInit(): void {
  }
 async login(){
  this.showAlert = true;
  this.alertMsg = 'Please Wait!'
  this.alertColor = 'blue'
  this.inSubmission = true ; 
  try {
    await this.auth.signInWithEmailAndPassword(this.credentials.email , this.credentials.password)
    
  } catch (error) {
    this.inSubmission = false;
    this.alertMsg = ' An unexpected error occured '
    this.alertColor = 'red'
    return
    
  }
  this.alertColor = 'green'
  this.alertMsg = ' Sucessfully Logged In '
  

}
}
