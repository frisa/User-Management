import { Component } from '@angular/core';
import { AuthenticationComponent} from './authentication/authentication.component'
import { AuthenticationsComponent } from './authentications/authentications.component';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports:[
    AuthenticationComponent,
    AuthenticationsComponent,
    UpperCasePipe,
  ],
})
export class AppComponent {
  title = 'wi-frontend';
  applicationName='WI Sumulation';
}
