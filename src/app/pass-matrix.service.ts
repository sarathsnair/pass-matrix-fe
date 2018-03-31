import { MatSnackBar } from '@angular/material';
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
  constructor(private http: Http,
    public snackBar: MatSnackBar) { }

  // submit data to the server
  submitFormData(data) {
    return this.http.post(this.postUrl, data);
  }


  getImage(imageUrl) {
    return this.http
      .get(imageUrl, { responseType: ResponseContentType.Blob })
      .map((res: Response) => res.blob());
  }

  convertImageToBase64FromBlob(blob) {
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

  showSnackBar(message, options = {}) {

    let snackBarMessage = message || '',
        snackBarAction = options['action'] || 'OK',
        snackBarDuration = options['duration'] || null;


    this.snackBar.open(snackBarMessage, snackBarAction, {
      duration: snackBarDuration
    });
  }

  hideSnackBar() {
    this.snackBar.dismiss();
  }

}
