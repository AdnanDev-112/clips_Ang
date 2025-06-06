import { Component, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/compat/storage';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { last, switchMap } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';
import firebase from 'firebase/compat/app';
import { ClipService } from 'src/app/services/clip.service';
import { Router } from '@angular/router';
import { FfmpegService } from 'src/app/services/ffmpeg.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
})
export class UploadComponent implements OnDestroy {
  ngOnDestroy(): void {
    this.task?.cancel();
  }
// Screenshots
screenshots:string[]=[]
  // 
  selectedScreenshot = '';


  isDragOver = false;
  file: File | null = null;
  nextStep = false;

  showAlert = false;
  alertColor = 'blue';
  alertMsg = 'Please wait your clip is being Uploaded';
  inSubmission = false;
  percentage = 0;
  showPercentage = false;

  //
  user: firebase.User | null = null;
  //
  task?: AngularFireUploadTask;

  // Control
  title = new FormControl('', {
    validators: [Validators.required, Validators.minLength(3)],
    nonNullable: true,
  });

  uploadForm = new FormGroup({
    title: this.title,
  });

  constructor(
    private storage: AngularFireStorage,
    private auth: AngularFireAuth,
    private clipsService: ClipService,
    private router: Router,
    public ffmpegServ:FfmpegService
  ) {
    auth.user.subscribe((user) => (this.user = user));
    ffmpegServ.init()
  }

  async storeFile($event: Event) {

if(this.ffmpegServ.isRunning){
  return 
}

    this.isDragOver = false;
    this.file = ($event as DragEvent).dataTransfer
      ? ($event as DragEvent).dataTransfer?.files.item(0) ?? null
      : ($event.target as HTMLInputElement).files?.item(0) ?? null;
    if (!this.file || this.file.type !== 'video/mp4') {
      return;
    }

   this.screenshots =  await this.ffmpegServ.getScreenshots(this.file);
   this.selectedScreenshot = this.screenshots[0];

    this.title.setValue(this.file.name.replace(/\.[^/.]+$/, ''));

    this.nextStep = true;
  }

  uploadFile() {
    this.uploadForm.disable();
    //  Alert
    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMsg = 'Please wait your clip is being Uploaded';
    this.inSubmission = true;
    this.showPercentage = true;

    //
    const clipFileName = uuid();
    const clipPath = `clips/${clipFileName}.mp4`;
    this.task = this.storage.upload(clipPath, this.file);
    const clipRef = this.storage.ref(clipPath);
    this.task.percentageChanges().subscribe((progress) => {
      this.percentage = (progress as number) / 100;
    });

    this.task
      .snapshotChanges()
      .pipe(
        last(),
        switchMap(() => clipRef.getDownloadURL())
      )
      .subscribe({
        next: async (url) => {
          const clip = {
            uid: this.user?.uid as string,
            displayName: this.user?.displayName as string,
            title: this.title.value,
            fileName: `${clipFileName}.mp4`,
            url,
            timestamp:firebase.firestore.FieldValue.serverTimestamp()
          };
          const clipDocRef = await this.clipsService.createClip(clip);

          this.alertColor = 'green';
          this.alertMsg = 'Sucess , Your clip is ready to be shared';
          this.showPercentage = false;
          setTimeout(() => {
            this.router.navigate(['clip', clipDocRef.id]);
          }, 1000);
        },
        error: (error) => {
          this.uploadForm.enable();
          this.alertColor = 'red';
          this.alertMsg = 'Upload failed! Please try again later . ';
          this.inSubmission = true;
          this.showPercentage = false;
          console.log(error);
        },
      });
  }
}
