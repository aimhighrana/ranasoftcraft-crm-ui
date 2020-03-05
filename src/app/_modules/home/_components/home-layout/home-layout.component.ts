import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/_services/user/userservice.service';
import { Userdetails } from 'src/app/_models/userdetails';
import { LoadingService } from 'src/app/_services/loading.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'pros-home-layout',
  templateUrl: './home-layout.component.html',
  styleUrls: ['./home-layout.component.scss']
})
export class HomeLayoutComponent implements OnInit, OnDestroy {

  udSub: Subscription;
  userDetails: Userdetails = new Userdetails();;

  constructor(
    private userService: UserService,
    private loadingService: LoadingService
  ) {
  }

  ngOnInit() {
    this.udSub = this.userService.getUserDetails().subscribe(
      (response: Userdetails) => {
        this.userDetails = response;
      }
    );
  }

  isLoading() {
    return this.loadingService.isLoading();
  }

  ngOnDestroy() {
    this.udSub.unsubscribe();
  }

}
