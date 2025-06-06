import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import {  Observable, of } from 'rxjs';
import {  delay, map, filter , switchMap} from 'rxjs/operators';
import IUser from '../models/user.model';
import { ActivatedRoute , NavigationEnd} from '@angular/router';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
private userCollection : AngularFirestoreCollection<IUser>; 
public isAuthenticated$: Observable<boolean> ;  
public isAuthenticatedWithDelay$: Observable<boolean> ;  

private redirect = false ; 


constructor(  private router:Router,private auth: AngularFireAuth , private db : AngularFirestore
  ,private route: ActivatedRoute
  ) {
    this.userCollection = db.collection('users');
    
    this.isAuthenticated$ = auth.user.pipe(
      map(user => !!user),
     
    )
    this.isAuthenticatedWithDelay$ = this.isAuthenticated$.pipe(delay(1000))
  
    this.router.events.pipe(
    filter(e => e instanceof NavigationEnd),
    map(e => this.route.firstChild),
    switchMap(route => route?.data ?? of({}))
  ).subscribe(data => {
    this.redirect = data.authOnly ?? false ;
  }) 
  }
  
  public async createUser(userData :IUser){
    if(!userData.password){
      throw new Error('Password not Provided')
    }
    const userCred = await this.auth.createUserWithEmailAndPassword(userData.email as string,userData.password as string);
if(!userCred.user){
  throw new Error('User can\'t be Found');
}
    await this.userCollection.doc(userCred.user?.uid).set(
      {
        name: userData.name,
        email: userData.email,
        age: userData.age,
        phoneNumber: userData.phoneNumber
      }
    );

    userCred.user.updateProfile({
      displayName:userData.name
    });


  }

  public async logout($event?: Event) {
    if($event){
       $event.preventDefault();
    }
    await this.auth.signOut();
    if(this.redirect){
      await this.router.navigateByUrl('/');

    }
  }
}
