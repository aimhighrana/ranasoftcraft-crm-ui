import { Component, OnInit } from '@angular/core';
import { Users } from 'src/app/tab2/list/list.component';

@Component({
  selector: 'app-emp-today-attendance',
  templateUrl: './emp-today-attendance.component.html',
  styleUrls: ['./emp-today-attendance.component.scss'],
})
export class EmpTodayAttendanceComponent implements OnInit {

  users: Users[] = [{
    userName:'User 1',
    firstName: 'User',
    lastName: '1',
    email: 'user1@gmail.com',
    phone: '87686878778',
    lastActivateDate:'128778786',
    empType:'User'
  }, {
    userName:'User 2',
    firstName: 'User',
    lastName: '2',
    email: 'user2@gmail.com',
    phone: '87686878778',
    lastActivateDate:'128778786',
    empType:'User'
  } , {
    userName:'User 3',
    firstName: 'User',
    lastName: '3',
    email: 'user3@gmail.com',
    phone: '87686878778',
    lastActivateDate:'128778786',
    empType:'User'
  } , {
    userName:'User 4',
    firstName: 'User',
    lastName: '4',
    email: 'user4@gmail.com',
    phone: '87686878778',
    lastActivateDate:'128778786',
    empType:'User'
  } ,{
    userName:'User 5',
    firstName: 'User',
    lastName: '5',
    email: 'user1@gmail.com',
    phone: '87686878778',
    lastActivateDate:'128778786',
    empType:'User'
  } , {
    userName:'User 6',
    firstName: 'User',
    lastName: '6',
    email: 'user1@gmail.com',
    phone: '87686878778',
    lastActivateDate:'128778786',
    empType:'User'
  } , {
    userName:'User 7',
    firstName: 'User',
    lastName: '7',
    email: 'user1@gmail.com',
    phone: '87686878778',
    lastActivateDate:'128778786',
    empType:'User'
  } , {
    userName:'User 8',
    firstName: 'User',
    lastName: '8',
    email: 'user1@gmail.com',
    phone: '87686878778',
    lastActivateDate:'128778786',
    empType:'User'
  } , {
    userName:'User 9',
    firstName: 'User',
    lastName: '9',
    email: 'user1@gmail.com',
    phone: '87686878778',
    lastActivateDate:'128778786',
    empType:'User'
  } , {
    userName:'User 10',
    firstName: 'User',
    lastName: '10',
    email: 'user1@gmail.com',
    phone: '87686878778',
    lastActivateDate:'128778786',
    empType:'User'
  } , {
    userName:'User 11',
    firstName: 'User',
    lastName: '11',
    email: 'user1@gmail.com',
    phone: '87686878778',
    lastActivateDate:'128778786',
    empType:'User'
  } , {
    userName:'User 12',
    firstName: 'User',
    lastName: '12',
    email: 'user1@gmail.com',
    phone: '87686878778',
    lastActivateDate:'128778786',
    empType:'User'
  } , {
    userName:'User 13',
    firstName: 'User',
    lastName: '13',
    email: 'user1@gmail.com',
    phone: '87686878778',
    lastActivateDate:'128778786',
    empType:'User'
  }];

  constructor() { }

  ngOnInit() {}

}
