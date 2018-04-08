import { HomeComponent } from './home/home.component';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Pass Matrix';
  innerHeight = window.innerHeight;
  innerWidth = window.innerWidth;

  public onClickLogin() {
    console.log('LOGIN CLICKED');
  }
  public onClickRegister() {
    console.log('REGISTER CLICKED');
  }

  onResize(event) {
    this.innerWidth = event.target.innerWidth;
    this.innerHeight = event.target.innerHeight;
  }
}
