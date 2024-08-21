import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should login and redirect on success', () => {
    const mockToken = 'fake-jwt-token';
    const spyNavigate = spyOn(router, 'navigate');
    component.username = 'testuser';
    component.password = 'testpassword';

    component.login();

    const req = httpMock.expectOne('http://localhost:3000/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ username: 'testuser', password: 'testpassword' });
    req.flush({ token: mockToken });

    expect(localStorage.getItem('token')).toBe(mockToken);
    expect(spyNavigate).toHaveBeenCalledWith(['/tableDisplay']);
  });

  it('should handle login error', () => {
    component.username = 'testuser';
    component.password = 'testpassword';

    component.login();

    const req = httpMock.expectOne('http://localhost:3000/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ username: 'testuser', password: 'testpassword' });
    req.flush('Error', { status: 400, statusText: 'Bad Request' });

    expect(component.message).toBe('Error during login.');
  });
});
