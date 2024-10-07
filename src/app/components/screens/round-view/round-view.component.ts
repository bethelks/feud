import { Component, Input, OnInit } from '@angular/core';
import { Round, Screen, Timer } from 'src/app/model/model';

@Component({
  selector: 'app-round-view',
  templateUrl: './round-view.component.html',
  styleUrls: ['./round-view.component.css']
})
export class RoundViewComponent implements OnInit {

  @Input() round: Round = new Round("", [])
  @Input() roundIndex: number = 0
  @Input() score: number = 0
  @Input() isSecondScreen = false
  @Input() numAnswers = 0
  numbers = new Array(8)
  selectedAnswerIndex: number | null = null;
  timerInstance: Timer;

  constructor() { 
  this.timerInstance = new Timer();
  }

  ngOnInit(): void {
    this.timerInstance.start();
    console.log(this.timerInstance.getTime())
  }
  getTime(): string {
      const [minutes, seconds] = this.timerInstance.getTime();
      console.log(minutes, seconds)
      if(seconds == 1 && minutes == 0){
        this.timerInstance.stop();
        return "Times up!"
        
      }
      return `${minutes}:${seconds}`
  }
  selectAnswer(index: number): void {
    this.selectedAnswerIndex = index;
}

}
