import { Component } from '@angular/core';
import { AuthRecord } from './authentication_record';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-authentications',
  templateUrl: './authentications.component.html',
  styleUrls: ['./authentications.component.css'],
  standalone: true,
  imports: [NgFor]
})
export class AuthenticationsComponent {

  authentications: AuthRecord[] = [
    {id: 1, user: "Jan Fridrichovsky", authenticated: false},
    {id: 2, user: "Nekdo Jinej", authenticated: false}
  ];
}
