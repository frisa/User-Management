import { Component, OnInit } from '@angular/core';
import { AuthRecord } from './authentication_record';
import { NgFor, NgIf } from '@angular/common';
import { UpperCasePipe } from '@angular/common';
import { Apollo } from 'apollo-angular';
import { GET_AUTHENTICATIONS } from '../graphql/graphql.queries';

@Component({
  selector: 'app-authentications',
  templateUrl: './authentications.component.html',
  styleUrls: ['./authentications.component.css'],
  standalone: true,
  imports: [NgFor, NgIf, UpperCasePipe]
})
export class AuthenticationsComponent implements OnInit {
  authentications: any[] = [];
  error: any;

  constructor(private apollo: Apollo) { }

  ngOnInit(): void {
    this.apollo.watchQuery({
      query: GET_AUTHENTICATIONS
    }).valueChanges.subscribe(({ data, error }: any) => {
      this.authentications = data.authentications;
      this.error = error;
    })
  }

}
