import { Component, } from '@angular/core';
import { FormGroup,FormControl, Validators } from '@angular/forms';
import IUser from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { RegisterValidators } from '../validators/register-validators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent  {
constructor(private auth: AuthService){}
inSubmission = false ;


  name = new FormControl('', [
    Validators.required,
    Validators.minLength(3),])
  email = new FormControl('',[Validators.required , Validators.email])
  age = new FormControl<number | null>(null , [Validators.required,
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
  }, [RegisterValidators.match])
// Register Function 
  async register(){
    this.inSubmission = true ;
    this.showAlert = true;
    this.alertMsg = 'Please wait your account is being created.';
    this.alertColor = 'blue'
    // Firebase
    try {
      await this.auth.createUser(this.registerForm.value as IUser);
 
    } catch (error) {
      console.log(error);
      
      this.alertMsg = 'Error occured ,Please try again later!';
      this.alertColor = 'red'
      this.inSubmission = false;
return
    }
    this.alertMsg = 'Account has been created';
    this.alertColor = 'green'
    
    
  }
}
