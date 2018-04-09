import { Router } from '@angular/router';
import { PassMatrixService } from './../pass-matrix.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  username: '';
  userSelectedImage = '';
  currSelectedImage = null;

  isImageSelected = false;
  currSelectedImageIndex = null;

  isLoggedIn = false;

  images = [
    {
      url: '/assets/images/angry-bird.png'
    },
    {
      url: '/assets/images/dog.jpg'
    },
    {
      url: '/assets/images/galaxy.jpg'
    }
  ];


  letters = ['A', 'B', 'C'];
  numbers = [1, 2, 3];


  originalProcessedImages = this.images.map(function (imageItem) {
    return {
      type: 'normal',
      url: imageItem.url
    };
  });

  processedImages = [];

  loginCell = null;
  selectedGridId = null;
  selectedImage = null;


  constructor(private _formBuilder: FormBuilder,
    private passMatrixService: PassMatrixService,
    private router: Router) { }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });

    this.thirdFormGroup = this._formBuilder.group({
      thirdCtrl: ['', Validators.required]
    });
  }

  gotoNextStep(stepper) {
    if (stepper.selectedIndex === 1) {
      if (!this.username) {
        this.passMatrixService.showSnackBar('Please fill username field');
        stepper.selectedIndex = 0;
        // stepper.previous();
      } else {
        const data = {
          username: this.username
        };
        this.passMatrixService.getUserSelectedImage(data)
          .subscribe(function (resp) {
            if (resp._body == false) {
              this
                .passMatrixService
                .showSnackBar('No image set for this user. Please register first');
                stepper.selectedIndex = 0;
            } else {
              this.userSelectedImage = decodeURIComponent(resp._body);
              this.processedImages = this.originalProcessedImages;
              this.processedImages.splice(this.getRandomImageIndex(), 0, {
                imageData: this.userSelectedImage,
                type: 'base64'
              });

              stepper.selectedIndex = 1;
              this.passMatrixService.hideSnackBar();
            }
          }.bind(this));
      }
    }

    if (stepper.selectedIndex === 2) {
      if (!this.currSelectedImage || this.currSelectedImageIndex < 0) {
        this.passMatrixService.showSnackBar('Please select an image from the list');
        stepper.selectedIndex = 1;
      } else {
        stepper.selectedIndex = 2;
        this.passMatrixService.hideSnackBar();
      }
    }

    // if (stepper.selectedIndex === 3) {
    //   if (!this.selectedGridId) {
    //     this.passMatrixService.showSnackBar('Please select a tile');
    //     stepper.selectedIndex = 2;
    //   } else {
    //     stepper.selectedIndex = 3;
    //     this.passMatrixService.hideSnackBar();
    //   }
    // }
  }

  getRandomImageIndex() {
    return Math.floor(Math.random() * (this.images.length + 1));
  }

  getrandomElementFromArray(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  onClickImage(event, imageObj) {
    this.currSelectedImage = imageObj;
    this.currSelectedImageIndex = this.processedImages.indexOf(imageObj);
  }

  playVoice() {
    let char = this.getrandomElementFromArray(this.letters);
    let number = this.getrandomElementFromArray(this.numbers);
    this.loginCell = char + number;
    this.passMatrixService.textToSpeech(this.loginCell);
  }

  onGridSelected(obj) {
    this.selectedGridId = obj.selectedGridId,
      this.selectedImage = obj.selectedImage;


    if (!this.selectedImage || !this.selectedGridId) {
      return;
    }
  }

  submitData() {
    // submit login details to server
    if (this.selectedImage && this.selectedImage.type === 'normal') {
      this.passMatrixService.getImage(this.selectedImage.url)
        .subscribe(function (image) {
          this.passMatrixService.convertImageToBase64FromBlob(image)
            .subscribe(function (base64EncodedString) {
              const data = {
                username: this.username,
                imagedata: encodeURIComponent(base64EncodedString),
                cellid: this.selectedGridId
              };
              this.passMatrixService.login(data)
                .subscribe(function (resp) {
                  // check if login success here
                  console.log(resp);
                  if (resp.text() == 'true') {
                    this.isLoggedIn = true;
                    this.passMatrixService.showSnackBar(this.username + ' successfully loggedin');
                  } else {
                    this.isLoggedIn = false;
                    this.passMatrixService.showSnackBar('Please check your credentials');
                  }
                }.bind(this));
            }.bind(this));
        }.bind(this));
    }

    if (this.selectedImage && this.selectedImage.type === 'base64') {
      const data = {
        username: this.username,
        imagedata: encodeURIComponent(this.selectedImage.imageData),
        cellid: this.selectedGridId
      };
      this.passMatrixService.login(data)
        .subscribe(function (resp) {
          console.log(resp);
          if (resp.text() == 'true') {
            this.isLoggedIn = true;
            this.passMatrixService.showSnackBar(this.username + ' successfully loggedin');
          } else {
            this.isLoggedIn = false;
            this.passMatrixService.showSnackBar('Please check your credentials');
          }
        }.bind(this));
    }
  }
}
