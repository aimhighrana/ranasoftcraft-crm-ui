import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/_services/user/userservice.service';
import { Userdetails } from 'src/app/_models/userdetails';
@Component({
  selector: 'pros-home-layout',
  templateUrl: './home-layout.component.html',
  styleUrls: ['./home-layout.component.scss']
})
export class HomeLayoutComponent implements OnInit {

  userDetails: Userdetails;

  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    this.userDetails = new Userdetails();
    this.getUserDetails();
  }

  private getUserDetails() {
    this.userService.getUserDetails().subscribe(
      (response: Userdetails) => {
        this.userDetails = response;
      }
    );
  }

}
