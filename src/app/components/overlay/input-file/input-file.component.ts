import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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

  public getFile(filePath: string) {
    console.log("51: " + filePath);
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
  

  // loadFile(filePath: string) {
  //   this.fileService.getFile(filePath)
  //     .then(file => {
  //       this.file = file;
  //       this.fileChange.emit(this.file);
  //     })
  //     .catch(error => {
  //       console.error('Error loading file:', error);
  //     });
  // }

}