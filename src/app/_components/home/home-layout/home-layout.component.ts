import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/_services/user/userservice.service';
import { Userdetails } from 'src/app/_models/userdetails';
import { LoadingService } from 'src/app/_services/loading.service';
@Component({
  selector: 'pros-home-layout',
  templateUrl: './home-layout.component.html',
  styleUrls: ['./home-layout.component.scss']
})
export class HomeLayoutComponent implements OnInit {

  userDetails: Userdetails;
  loadingSvc: LoadingService;

  constructor(
    private userService: UserService,
    private loadingService: LoadingService
  ) {
    this.loadingSvc = loadingService;
  }

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
