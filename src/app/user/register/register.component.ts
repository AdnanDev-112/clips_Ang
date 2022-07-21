import { Component, } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormGroup,FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent  {
constructor(private auth: AngularFireAuth){}


  name = new FormControl('', [
    Validators.required,
    Validators.minLength(3),])
  email = new FormControl('',[Validators.required , Validators.email])
  age = new FormControl('' , [Validators.required,
  Validators.min(18),
  Validators.max(120),
])
  password = new FormControl('',
  [Validators.required , 
    Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm)])
  confirm_password = new FormControl('',[Validators.required , 
    ])
  phoneNumber = new FormControl('', [
    Validators.required,
    Validators.min(17),
  Validators.max(17),

  ]);

  showAlert= false;
  alertMsg = 'Please wait your account is being created.';
  alertColor = 'blue'

  registerForm = new FormGroup({
    name : this.name,
    email : this.email,
    age : this.age,
    password : this.password,
    confirm_password : this.confirm_password,
    phoneNumber : this.phoneNumber,
  })
// Register Function 
  async register(){
    this.showAlert = true;
    this.alertMsg = 'Please wait your account is being created.';
    this.alertColor = 'blue'
    // Firebase
    const {email,password} = this.registerForm.value;
    try {
      const userCred = await this.auth.createUserWithEmailAndPassword(email as string,password as string)
    } catch (error) {
      this.alertMsg = 'Error occured ,Please try again later!';
      this.alertColor = 'red'
return
    }
    this.alertMsg = 'Accoutn has been created';
    this.alertColor = 'green'
    
    
  }
}
