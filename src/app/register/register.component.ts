import { PassMatrixService } from './../pass-matrix.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
    private passMatrixService: PassMatrixService) { }

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
        }
      }, function (error) {
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
}
