import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  message: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  register() {
    this.http.post('http://localhost:3000/register', { username: this.username, password: this.password })
      .subscribe(
        response => {
          this.message = 'Registration successful!';
          this.router.navigate(['/login']);
        },
        error => {
          this.message = 'Error during registration.';
        }
      );
  }
}
