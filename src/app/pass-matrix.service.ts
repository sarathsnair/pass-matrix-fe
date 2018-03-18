import { Injectable } from '@angular/core';
import { Http, Response, ResponseContentType } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';


// All the RxJS stuff we need
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class PassMatrixService {

  // Url to API
  private postUrl = 'https://jsonplaceholder.typicode.com/posts';

  // Injecting the http client into the service
  constructor(private http: Http) { }

  // Method retrieve all the posts
  submitFormData(data) {
    return this.http.post(this.postUrl, data)
      .map(this.parseData)
      .catch(this.handleError);
  }

  // This method parses the data to JSON
  private parseData(res: Response) {
    return res.json() || [];
  }

  // Displays the error message
  private handleError(error: Response | any) {
    let errorMessage: string;

    errorMessage = error.message ? error.message : error.toString();

    // In real world application, call to log error to remote server
    // logError(error);

    // This returns another Observable for the observer to subscribe to
    return Observable.throw(errorMessage);
  }


  getImage(imageUrl: string): Observable<File> {
    return this.http
      .get(imageUrl, { responseType: ResponseContentType.Blob })
      .map((res: Response) => res.blob());
  }

  createImageToBase64FromBlob(blob) {
    const reader = new FileReader();
    if (blob) {
      reader.readAsDataURL(blob);
    }
    return Observable.create(observer => {
      reader.onloadend = () => {
        observer.next(reader.result);
        observer.complete();
      };
    });
  }


}
