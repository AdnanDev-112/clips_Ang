import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import IClip from 'src/app/models/clip.model';
import { ClipService } from 'src/app/services/clip.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit, OnDestroy, OnChanges {
  @Input() activeClip: IClip | null = null;
  clipID = new FormControl('', {
    validators: [Validators.required, Validators.minLength(3)],
    nonNullable: true,
  });
  // 
  showAlert = false;
  alertColor = 'blue';
  alertMsg = 'Please wait your clip is being Uploaded';
  inSubmission = false;

  // 
  @Output() update = new EventEmitter();

  constructor(private modal: ModalService, private clipService: ClipService) {}

  ngOnInit(): void {
    this.modal.register('editClip');
  }
  ngOnDestroy(): void {
    this.modal.unregister('editClip');
  }
  ngOnChanges(): void {
    if (!this.activeClip) return;



    this.inSubmission=false;
    this.showAlert = false ;
    this.clipID.setValue(this.activeClip.docID!);
    this.title.setValue(this.activeClip.title);
  }

  title = new FormControl('', {
    validators: [Validators.required, Validators.minLength(3)],
    nonNullable: true,
  });

  editForm = new FormGroup({
    title: this.title,
    id: this.clipID,
  });

  async submit() {
    if(!this.activeClip){
      return
    }



    this.inSubmission = true;
    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMsg = 'Please wait your clip is being updated';
    try {
      await this.clipService.updateClip(this.clipID.value, this.title.value);
    } catch (error) {
      console.log(error);
      this.inSubmission = false;
      this.showAlert = true;
      this.alertColor = 'red';
      this.alertMsg = 'Erro Occured, Please try again later';
      return;
    }
    this.activeClip.title = this.title.value;

this.update.emit(this.activeClip)

    this.inSubmission = false ;
    this.alertColor = 'green';
    this.alertMsg = 'Sucess!';
  }
  
}
