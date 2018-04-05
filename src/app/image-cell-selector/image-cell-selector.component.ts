import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-image-cell-selector',
  templateUrl: './image-cell-selector.component.html',
  styleUrls: ['./image-cell-selector.component.css']
})
export class ImageCellSelectorComponent implements OnInit {
  @Input() size: number;
  @Input() image: Object;
  @Input() loginCellId: string;
  @Output() onGridSelected: EventEmitter<any> = new EventEmitter<any>();

  letters: Array<string>;
  numbers: Array<number>;

  num = 16;
  gridCells = [];
  selectedCell = null;
  selectedGrid = null;

  constructor() { }

  ngOnInit() {

    this.letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    this.numbers = Array(this.size).fill(1).map((x, y) => x + y);
    this.letters.length = this.size;
    this.letters.shuffle();
    this.numbers.shuffle();

    this.recalculateGridCells();
  }

  onClickArrow(position: string) {
    switch (position) {
      case 'top': this.numbers.rotate(1); break;
      case 'bottom': this.numbers.rotate(-1); break;
      case 'left': this.letters.rotate(1); break;
      case 'right': this.letters.rotate(-1); break;
      case 'default': break;
    }
    this.recalculateGridCells();
  }

  recalculateGridCells() {
    this.gridCells = [];
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        this.gridCells.push(this.letters[j] + this.numbers[i]);
      }
    }
  }

  onClickOkButton() {
    let char = this.loginCellId[0];
    let number = this.loginCellId[1];
    this.selectedCell = char + number;
    this.selectedGrid = this.gridCells.indexOf(this.selectedCell) + 1;
    this.onGridSelected.emit({
      selectedGridId: this.selectedGrid,
      selectedImage: this.image
    });
  }
}
