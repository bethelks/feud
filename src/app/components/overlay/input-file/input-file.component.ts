import { Component, EventEmitter, Input, OnInit, Output, HostListener} from '@angular/core';
import { RoundsFile } from 'src/app/model/model';
import { FileService } from 'src/app/services/file.service';

@Component({
  selector: 'app-input-file',
  templateUrl: './input-file.component.html',
  styleUrls: ['./input-file.component.css']
})
export class InputFileComponent implements OnInit {

  @Input() file: RoundsFile
  @Output() fileChange = new EventEmitter<RoundsFile>()
  fileName: string = ""

  constructor(private fileService: FileService) { }

  ngOnInit(): void {
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // Check if the pressed key is 'F' (you can use `event.key.toLowerCase()` to handle uppercase/lowercase cases)
    if (event.key === 'F' || event.key === 'f') {
      // Call the getFile function when 'F' is pressed
      const filePath = './assets/roundFiles/rounds_us.json'; // Define your filePath or get it from input
      this.getFile(filePath);
    }
  }

  getFile(filePath: string) {
    console.log("loaded getFile()");
    fetch(filePath)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then(fileContent => {
        console.log(fileContent);
  
        const obj = JSON.parse(fileContent);
        this.file = new RoundsFile(this.fileName, obj);
        this.fileChange.emit(this.file);
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
  }

} //working 9:30 10:46am