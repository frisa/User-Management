import { Component } from '@angular/core';
import { AuthenticationComponent} from './authentication/authentication.component'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports:[
    AuthenticationComponent,
  ],
})
export class AppComponent {
  title = 'wi-frontend';
}
