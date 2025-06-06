import { Component, OnInit , Input} from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {
  @Input() colorBG:string = 'blue'

  get bgColor(){
    return `bg-${this.colorBG}-400`
  }

  constructor() { }

  ngOnInit(): void {
  }

}
