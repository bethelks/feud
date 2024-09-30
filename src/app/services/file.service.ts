// file.service.ts
import { Injectable } from '@angular/core';
import { RoundsFile } from '../model/model'; // Adjust the path based on your project structure

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor() { }

  getFile(filePath: string): Promise<RoundsFile> {
    console.log("got here 1");
    return fetch(filePath)
      .then(response => {
        console.log("got here 2");
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then(fileContent => {
        console.log("got here 3");
        const obj = JSON.parse(fileContent);
        // Assume RoundsFile has a constructor that accepts fileName and content
        return new RoundsFile(filePath, obj);
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
      });
  }
}
