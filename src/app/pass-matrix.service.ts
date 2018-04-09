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
  // private postUrl = 'https://jsonplaceholder.typicode.com/posts';
  private postUrl = 'http://localhost:5000/';
  // Injecting the http client into the service
  constructor(private http: Http,
    public snackBar: MatSnackBar) { }

  isLoggedIn = false;
  currentUser = {
    username: ''
  };

  BASE64_MARKER = ';base64,';

  /**
   * This file contains common SERVICES used in pass-matrix application
   */

  /**
   * [IMPORTANT Services]
   * 1. register()
   * 2. getUserSelectedImage()
   * 3. login()
   */


  /**  Register service for passmatrix application
     * This is used to send final registration details to the server
     * 'data' parameter contains 3 properties namely
     * {
     *  username   : 'abcd',
     *  base64Image   'base64ImageString',
     *  selectedGridId: 'gridId'
     * }
     */

  register(data) {
    return this.http.post(this.postUrl + '/register', data);
  }

  /** First step in login
    * Get user selected image in base64 format while passing a registered username
    * 'data' parameter contains 3 properties namely
    * {
    *  username   : 'abcd'
    * }
    */

  getUserSelectedImage(data) {
    return this.http.get(this.postUrl + 'getuserimage?username=' + data.username);
  }

  /**  Login service for passmatrix application
     * This is used to send final login data to the server
     * 'data' parameter contains 3 properties namely
     * {
     *  username   : 'abcd',
     *  base64Image   'base64ImageString',
     *  selectedGridId: 'gridId'
     * }
     */

  login(data) {
    return this.http.post(this.postUrl + '/login', data);
  }


  /**
   * [HELPER services]
   */

  /**
  * Service to convert an imageURL to base64 data
  */
  getImage(imageUrl) {
    return this.http
      .get(imageUrl, { responseType: ResponseContentType.Blob })
      .map((res: Response) => res.blob());
  }

  /**
   * Convert a base64 data to imageFile
   */
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

  /**
   * Display snackbar on the screen
   * Snackbar will be hidden automatically after specified duration (2000ms)
   */
  showSnackBar(message, options = {}) {

    let snackBarMessage = message || '',
      snackBarAction = options['action'] || 'OK';

    this.snackBar.open(snackBarMessage, snackBarAction, {
      duration: 2000
    });
  }

  /**
   * Hide snackbar which is currently displayed on the screen
   */

  hideSnackBar() {
    this.snackBar.dismiss();
  }

  /**
   * Service to convert a text to speech
   */
  textToSpeech(text) {
    let msg = new SpeechSynthesisUtterance(text);
    msg.rate = 0.5;
    window.speechSynthesis.speak(msg);
  }

  /**
   * Check if a user is loggedIn successfully
   */
  isUserLoggedIn() {
    return this.isLoggedIn;
  }

  /**
   * Return the current user data
   */
  getCurrentUserData() {
    return this.currentUser;
  }




  convertDataURIToBinary(dataURI) {
    const base64Index = dataURI.indexOf(this.BASE64_MARKER) + this.BASE64_MARKER.length;
    const base64 = dataURI.substring(base64Index);
    const raw = window.atob(base64);
    const rawLength = raw.length;
    let array = new Uint8Array(new ArrayBuffer(rawLength));

    for (let i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    return array;
  }
}
