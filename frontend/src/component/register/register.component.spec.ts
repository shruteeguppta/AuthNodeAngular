import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
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

  it('should register and redirect on success', () => {
    const spyNavigate = spyOn(router, 'navigate');
    component.username = 'newuser';
    component.password = 'newpassword';

    component.register();

    const req = httpMock.expectOne('http://localhost:3000/register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ username: 'newuser', password: 'newpassword' });
    req.flush({}); // Mock a successful response with an empty body

    expect(component.message).toBe('Registration successful!');
    expect(spyNavigate).toHaveBeenCalledWith(['/login']);
  });

  it('should handle registration error', () => {
    component.username = 'newuser';
    component.password = 'newpassword';

    component.register();

    const req = httpMock.expectOne('http://localhost:3000/register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ username: 'newuser', password: 'newpassword' });
    req.flush('Error', { status: 400, statusText: 'Bad Request' });

    expect(component.message).toBe('Error during registration.');
  });
});
