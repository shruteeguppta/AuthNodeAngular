import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  message: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    this.http.post<{ token: string }>('http://localhost:3000/login', { username: this.username, password: this.password })
      .subscribe(
        response => {
          localStorage.setItem('token', response.token);
          this.router.navigate(['/tableDisplay']);
        },
        error => {
          this.message = 'Error during login.';
        }
      );
  }
}
