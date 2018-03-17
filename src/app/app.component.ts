import { HomeComponent } from './home/home.component';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  public onClickLogin() {
    console.log('LOGIN CLICKED');
  }
  public onClickRegister() {
    console.log('REGISTER CLICKED');
  }
}
