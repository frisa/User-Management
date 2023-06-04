import { Component } from '@angular/core';
import { AuthRecord } from './authentication_record';

@Component({
  selector: 'app-authentications',
  templateUrl: './authentications.component.html',
  styleUrls: ['./authentications.component.css'],
  standalone: true
})
export class AuthenticationsComponent {
  authentication: AuthRecord = {
    id: 1, user: "Jan Fridrichovsky", authenticated: false,
  };
}
