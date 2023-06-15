import { Component, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { Apollo } from 'apollo-angular';
import { GET_AUTHENTICATIONS, ADD_AUTHENTICATION } from './graphql/graphql.queries';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  authentications: any[] = [];
  error: any;
  title = 'frontend';
  loginForm = new FormGroup(
    {
      user: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    }
  );

  constructor(private apollo: Apollo) { }
  ngOnInit(): void {
    this.apollo.watchQuery({
      query: GET_AUTHENTICATIONS
    }).valueChanges.subscribe(({ data, error }: any) => {
      this.authentications = data.authentications;
      this.error = data.error;
    }
    );
  }
  onLogin() {
    this.apollo.mutate(
      {
        mutation: ADD_AUTHENTICATION,
        variables: {
          user: this.loginForm.value.user,
          password: this.loginForm.value.password,
        },
        refetchQueries: [
          {
            query: GET_AUTHENTICATIONS
          }
        ]
      }
    ).subscribe(({data}: any) => {
      this.loginForm.reset();
    }, (error) => {
      this.error = error;
    } )
  }
}
