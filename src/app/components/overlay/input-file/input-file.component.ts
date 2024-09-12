import { Component, EventEmitter, Input, OnInit, Output, AfterViewInit, ElementRef, 
  ViewChild, HostListener } from '@angular/core';
import { RoundsFile } from 'src/app/model/model';
import { State } from 'src/app/model/model';

@Component({
  selector: 'app-input-file',
  templateUrl: './input-file.component.html',
  styleUrls: ['./input-file.component.css']
})
export class InputFileComponent implements AfterViewInit {

  @ViewChild('focusableElement') focusableElement!: ElementRef;

  @HostListener('window:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    if (event.key === 'f' || event.key === 'F') {
     console.log("test");

    //  console.log("51: "+event);
    // const reader = new FileReader();
    // reader.onload = (e: any) => {
    //   console.log(e.target.result)
    //   const obj = JSON.parse('./assets/roundFiles/rounds_us.json')
    //   this.file = new RoundsFile(this.fileName, obj)
    //   this.fileChange.emit(this.file)
    // };
    // const element = event.target as HTMLInputElement
    // if (element.files != null) {
    //   const f = element.files[0]
    //   this.fileName = f.name
    //   reader.readAsText(f)
    // }


    }
  }

  ngAfterViewInit() {
    this.focusableElement.nativeElement.focus(); // set focus
  }

  @Input() file: RoundsFile
  @Output() fileChange = new EventEmitter<RoundsFile>()
  fileName: string = ""

  @Input() state = new State()

  constructor() { }


  // keyUp(event: KeyboardEvent) {
  //   console.log("Key pressed:", event.key);
  //   //if (event.key === 'f' || event.key === 'F') {
  //     // Your code goes here
  //     console.log("pressed f");
  //     //this.state.instructionStep++;
  //     //this.advance();
  //   //}
  // }


  ngOnInit(): void {
    
  }

  getFile(event:Event) {
    console.dir(event);
    console.log("68: "+JSON.stringify(event, null, 2))
    const reader = new FileReader();
    reader.onload = (e: any) => {
      console.log(e.target.result)
      const obj = JSON.parse(e.target.result)
      this.file = new RoundsFile(this.fileName, obj)
      this.fileChange.emit(this.file)
    };
    const element = event.target as HTMLInputElement
    if (element.files != null) {
      const f = element.files[0]
      this.fileName = f.name
      reader.readAsText(f)
    }
  }

  onFileChange(event: Event): void {
    console.log("51: " + event);
    const reader = new FileReader();
  
    reader.onload = (e: any) => {
      // The result of reading the file is available in e.target.result
      console.log(e.target.result);
      
      try {
        // Parsing the JSON from the result of the FileReader
        const obj = JSON.parse(e.target.result);
  
        // Assuming RoundsFile is a class that you have defined elsewhere
        this.file = new RoundsFile(this.fileName, obj);
        this.fileChange.emit(this.file);
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    };
  
    const inputElement = event.target as HTMLInputElement;
  
    if (inputElement.files?.length) {
      const file = inputElement.files[0];
      this.fileName = file.name;
  
      // Read the file as text
      reader.readAsText(file);
    }
  }
}
//working point 5:29pm