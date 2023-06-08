import { Component, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { Apollo } from 'apollo-angular';
import { GET_AUTHENTICATIONS } from './graphql/graphql.queries';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  authentications: any[] =[];
  error: any;
  title = 'frontend';
  constructor(private apollo: Apollo){}
  ngOnInit(): void {
    this.apollo.watchQuery({
      query: GET_AUTHENTICATIONS
    }).valueChanges.subscribe(({data, error}: any) =>{
      this.authentications = data.authentications;
      this.error = data.error;
    }
    );
  }
}
