import { Component, HostListener } from "@angular/core";
import { MediaState, Music, Sound } from "../../model/media";
import { State, Screen, Round, Team, RoundsFile } from "../../model/model";

import { Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { FileService } from 'src/app/services/file.service';
import { InputFileComponent } from 'src/app/components/overlay/input-file/input-file.component';


//working 9/30/2024 10:44am
@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.css"],
})
export class MainComponent {

  state = new State();
  mediaState = new MediaState();
  team1 = this.state.team1; //mm
  team2 = this.state.team2; //hh
  selectedTeam: Team | null = null;
  teamBuzzed = false;
  teamhas3strikes = false;

  check = false;
  xVisible = false;
  isMenuVisible = false;

  constructor(private title: Title) {
    title.setTitle(environment.title);

  }

  ngOnInit() {}

  ngDoCheck(): void {
    console.log("check");
    if (this.state.secondWindow != null) {
      let state = {
        roundIndex: this.state.roundIndex,
        currentRound: this.state.currentRound,
      };
      this.state.secondWindow.postMessage(state, "*");
    }
  }

  roundsFileLoaded(roundsFile: RoundsFile) {
    this.state.file = roundsFile;
    this.state.rounds = Round.parse(roundsFile.json);
    this.state.reset();
  }

  @HostListener("window:keyup", ["$event"])
  keyUp(event: KeyboardEvent) {
    console.log(event.code);

    // ======= Menu
    if (event.code == "Escape") {
      this.isMenuVisible = !this.isMenuVisible;
      return;
    }

    // ======= Team selection
    if (!event.altKey) {
      if (event.code == "ArrowLeft") {
        this.toggleTeam(this.state.team1);
      }
      if (event.code == "ArrowRight") {
        this.toggleTeam(this.state.team2);
      }
      if (event.code == "ArrowUp") {
        this.addScoreToTeam(+1, false);
      }
      if (event.code == "ArrowDown") {
        this.addScoreToTeam(-1, false);
      }
    }

    // ======= Music
    if (event.altKey) {
      if (event.code == "Digit1") {
        this.mediaState.playMusic(Music.game);
      }
      if (event.code == "Digit2") {
        this.mediaState.playMusic(Music.millionaire);
      }
      if (event.code == "Digit3") {
        this.mediaState.playMusic(Music.jazz);
      }
      if (event.code == "KeyP") {
        this.mediaState.playPauseMusic();
      }
      if (event.code == "KeyO") {
        this.mediaState.toggleDuckMusic();
      }

      if (event.code == "ArrowUp") {
        this.mediaState.volumeUp();
      }
      if (event.code == "ArrowDown") {
        this.mediaState.volumeDown();
      }
    }

    if (this.isMenuVisible) return;

    // ======= Advance
    if (event.code == "Space") {
      this.advance();
    }
    else if(event.code == "KeyF" /**/|| event.code == "KeyG"  || event.code == "KeyH" 
      || event.code == "KeyJ" || event.code == "KeyK" || event.code == "KeyL"/**/){
      this.advance();
    }

    // ======= Reset
    if (event.code == "KeyR") {
      if (event.shiftKey) {
        this.resetHard();
      } else {
        this.reset();
      }
    }

    // =============== Only After Start ===============
    if (this.state.screen == Screen.start) {
      return;
    }

    // ======= Answers (Numbers)
    if (event.code == "KeyA" && event.shiftKey) {
      this.toggleRevealAllAnswers();
    }

    if (!event.altKey && event.code.includes("Digit")) {
      let number = parseInt(event.code.replace(/[^\d.]/g, ""));
      const shouldReveal = !event.shiftKey;
      this.controlAnswer(number, shouldReveal);
    }

    // ======= Strike
    if (event.code == "KeyX") {
      if (event.shiftKey) {
        this.unstrike();
      } else {
        this.strike(this.selectedTeam);
        if (this.selectedTeam != null && this.selectedTeam.strikes >= 3) {
        }
      }
    }

    // ======= Buzzer
    if (event.code == "KeyB") {
      this.hitBuzzer();
    }

    // ======= Score
    if (event.code == "KeyS" && this.check == false) {
      this.check = true;
      if (event.shiftKey) {
        this.addScoreToTeam(-this.state.tempScore);
      } else {
        this.addScoreToTeam(this.state.tempScore);
      }
    }
  }

  @HostListener("window:keydown", ["$event"])
  keyDown(event: KeyboardEvent) {
    if (event.code == environment.buzzer1.keyCode) {
      this.hitBuzzer(this.state.team1);
    }

    if (event.code == environment.buzzer2.keyCode) {
      this.hitBuzzer(this.state.team2);
    }
  }

  advance() {
    switch (this.state.screen) {
      case Screen.start: {
        console.log("ADVANCE -> Intro");
        this.state.screen = Screen.intro;
        break;
      }
      case Screen.intro: {
        console.log("ADVANCE -> Instructions");
        this.state.screen = Screen.instructions;
        break;
      }

      case Screen.instructions: {         
        if(this.state.instructionStep >= 2) {
          console.log("ADVANCE -> Rounds")
          this.startRound(0)

        } else {
          this.state.instructionStep++;
          console.log("ADVANCE -> Instructions " + this.state.instructionStep);
        }
        break;
      }
      default: {
        console.log("ADVANCE -> Next Round or Advance in Round");
        this.showNextOrAdvanceInRound();
        break;
      }
    }
  }

  // Helpers
  overlayWants(key: string) {
    if (key == "reset") {
      this.reset();
    }
    if (key == "resetAll") {
      this.resetHard();
    }
  }

  reset() {
    this.teamBuzzed = false;
    this.selectedTeam = null;
  }

  resetHard() {
    this.isMenuVisible = false;
    this.state.reset();
    this.state.resetTeams();

    this.teamBuzzed = false;
    this.selectedTeam = null;
  }

  // ========= Round ============
  startRound(index: number) {
    this.state.currentRound = this.state.rounds[index];
    this.state.tempScore = 0;

    this.selectedTeam = null;
    this.teamBuzzed = false;
    this.state.roundIndex = index;
    this.state.screen = Screen.round;
  }

  showAnswerOptions() {
    if (!this.state.currentRound.isHidden) {
      return;
    }

    this.state.currentRound.isHidden = false;
    this.state.currentRound.answers.forEach((answer, index) => {
      answer.isHidden = true;
      setTimeout(() => {
        answer.isHidden = false;
        this.mediaState.playSound(Sound.click);
      }, index * 200);
    });
  }

  showNextOrAdvanceInRound() {
    this.check = false;
    this.teamBuzzed = false;
    this.teamhas3strikes = false;
    this.team1.strikes = 0;
    this.team2.strikes = 0;
    this.unstrike();
    if (this.state.currentRound.isHidden) {
      // SHOW ANSWER OPTIONS
      this.showAnswerOptions();
      // this.mediaState.duckMusic(true)
      // setTimeout(() => {
      //   this.mediaState.duckMusic(false)
      // }, 4500.0);
    } else if (!this.state.currentRound.isQuestionRevealed) {
      // SHOW QUESTION
      this.state.currentRound.isQuestionRevealed = true;
    } else if (!this.state.currentRound.isFullyRevealed) {
      // SHOW ALL ANSWERS
      this.toggleRevealAllAnswers();
    } else {
      if (this.state.roundIndex + 1 < this.state.rounds.length) {
        // SHOW NEXT ROUND
        this.startRound(this.state.roundIndex + 1);
      } else {
        // SHOW END
        this.state.screen = Screen.end;
      }
    }
  }

  // ========= Answer ============
  toggleRevealAllAnswers() {
    const unRevealedAnswers = this.state.currentRound.answers.filter(
      (a) => !a.isRevealed
    );
    this.team1.strikes = 0;
    this.team2.strikes = 0;
    if (unRevealedAnswers.length == 0) {
      this.state.currentRound.isFullyRevealed = false;
      this.state.currentRound.answers.forEach((a) => (a.isRevealed = false));
    } else {
      unRevealedAnswers
        .filter((a) => !a.isRevealed)
        .forEach((answer, index) => {
          setTimeout(() => {
            answer.isRevealed = true;
            this.mediaState.playSound(Sound.ding);
          }, index * 1000);
        });
      this.state.currentRound.isFullyRevealed = true;
    }
  }

  controlAnswer(num: number, show: Boolean) {
    const answerIndex = num - 1;
    if (show) {
      console.log(`Reveal Answer #${num}`);
      this.revealAnswer(answerIndex);
    } else {
      console.log(`Unreveal Answer #${num}`);
      this.unrevealAnswer(answerIndex);
    }
  }

  // ========= Team Actions ============
  toggleTeam(team: Team) {
    if (this.selectedTeam == team) {
      this.selectedTeam = null;
    } else {
      this.selectedTeam = team;
    }
  }

  hitBuzzer(team: Team | null = null) {
    if (this.teamBuzzed) {
      return;
    }
    if (team) {
      this.selectedTeam = team;
    }
    this.teamBuzzed = true;
    this.mediaState.playSound(Sound.buzzer); 
  }

  strike(team: Team | null = null) {
    if (this.selectedTeam != null) {
      console.log("selected team" + this.selectedTeam);

      
        this.selectedTeam.strikes++;

        this.mediaState.playSound(Sound.wrong);

        this.xVisible = true;
        if (this.selectedTeam.strikes == 3) {
          console.log(this.selectedTeam.name + " has 3 strikes");
          this.teamhas3strikes = true;
          this.switchTeam(
            this.selectedTeam,
            this.selectedTeam == this.team1 ? this.team2 : this.team1 //if selected team is team 1 swap to team2, else swap to team1
          );
        
        //if one team has 3 strikes, the other team must answer correctly to get all points
      }
      setTimeout(() => {
        this.xVisible = false;
      }, 2000);
    }
  }

  switchTeam(team1: Team, team2: Team) {
    if (this.selectedTeam == team1) {
      this.selectedTeam = team2;
    } else {
      this.selectedTeam = team1;
    }
  }

  unstrike(team: Team | null = null) {
    if (this.selectedTeam != null) {
      this.selectedTeam.strikes = 0;
    }
  }

  revealAnswer(index: number) {
    const answer = this.state.currentRound.answers[index];
    if (answer.isRevealed) {
      return;
    }
    answer.isRevealed = true;
    this.mediaState.playSound(Sound.correct);

    this.state.tempScore += answer.amount;
    this.reevaluateIsFullyRevealed();

    if (this.teamhas3strikes) {
      //if one team has 3 strikes, the other team must answer correctly to get all points
      this.addScoreToTeam(this.state.tempScore);
      setTimeout(() =>{
        this.advance();
      }, 2000)
    }
  }

  unrevealAnswer(index: number) {
    const answer = this.state.currentRound.answers[index];
    if (!answer.isRevealed) {
      return;
    }
    answer.isRevealed = false;
    this.mediaState.playSound(Sound.click);

    this.state.tempScore -= answer.amount;
    this.reevaluateIsFullyRevealed();
  }

  reevaluateIsFullyRevealed() {
    const unRevealedAnswers = this.state.currentRound.answers.filter(
      (a) => !a.isRevealed
    );
    this.state.currentRound.isFullyRevealed = unRevealedAnswers.length == 0;
    if (this.state.currentRound.isFullyRevealed) {
      this.addScoreToTeam(this.state.tempScore);
    }
  }

  addScoreToTeam(amount: number, playSound = true) {
    if (this.selectedTeam != null) {
      this.selectedTeam.score += amount;

      if (amount > 0 && playSound) {
        this.mediaState.playSound(Sound.win);
      }
    }
  }

}

