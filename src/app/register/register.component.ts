import { PassMatrixService } from './../pass-matrix.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  images = [
    {
      url: '/assets/images/cat.jpg'
    },
    {
      url: '/assets/images/fruit.jpg'
    },
    {
      url: '/assets/images/jeep.jpg'
    },
    {
      url: '/assets/images/paris.jpg'
    }
  ];

  currSelectedImage = null;
  selectedGridId = null;

  gridSize = {
    columns: 3,
    rows: 3
  };
  username = '';
  gridCells = Array(this.gridSize.columns * this.gridSize.rows)
    .fill(0)
    .map((x, i) => i + 1);
  self = this;

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

  onClickImage(event, imageObj) {
    this.currSelectedImage = imageObj;
  }

  onSelectGridTile(event, gridId) {
    this.selectedGridId = gridId;
  }

  submitDataToServer(data) {
    this.passMatrixService.submitFormData(data)
      .subscribe(function (data) {
        if (data) {
          // registration success
          this.passMatrixService.showSnackBar('Data submitted successfully. Redirecting to Login');
          this.router.navigateByUrl('/login');
        }
      }.bind(this), function (error) {
        console.log(error);
      });
  }

  submitData() {
    if (!this.currSelectedImage || !this.selectedGridId) {
      return;
    }

    const imageUrl = this.currSelectedImage.url;
    const gridId = this.selectedGridId;

    this.passMatrixService.getImage(imageUrl)
      .subscribe(function (image) {
        this.passMatrixService.convertImageToBase64FromBlob(image)
          .subscribe(function (base64EncodedString) {
            const obj = {
              username: this.username,
              base64Image: base64EncodedString,
              gridid: gridId
            };
            this.submitDataToServer(obj);
          }.bind(this));
      }.bind(this));
  }

  gotoNextStep(stepper) {
    if (stepper.selectedIndex === 1) {
      if (!this.username) {
        this.passMatrixService.showSnackBar('Please fill username field');
        stepper.selectedIndex = 0;
        // stepper.previous();
      } else {
        stepper.selectedIndex = 1;
        this.passMatrixService.hideSnackBar();
      }
    }

    if (stepper.selectedIndex === 2) {
      if (!this.currSelectedImage) {
        this.passMatrixService.showSnackBar('Please select an image from the list');
        stepper.selectedIndex = 1;
      } else {
        stepper.selectedIndex = 2;
        this.passMatrixService.hideSnackBar();
      }
    }

    if (stepper.selectedIndex === 3) {
      if (!this.selectedGridId) {
        this.passMatrixService.showSnackBar('Please select a tile');
        stepper.selectedIndex = 2;
      } else {
        stepper.selectedIndex = 3;
        this.passMatrixService.hideSnackBar();
      }
    }
  }
}
