import { Injectable } from '@angular/core';
import { RoundsFile } from 'src/app/model/model';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor() { }

  getFile(filePath: string): Promise<RoundsFile> {
    console.log("got to service");
    return fetch(filePath)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then(fileContent => {
        const obj = JSON.parse(fileContent);
        // Assuming RoundsFile constructor takes name and data
        console.log("done with service");
        return new RoundsFile(filePath, obj); // or however you want to construct it
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        throw error; // Optional: re-throw the error for further handling
      });
  }
}