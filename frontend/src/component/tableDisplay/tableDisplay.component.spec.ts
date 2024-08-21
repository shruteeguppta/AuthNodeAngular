import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { TableDisplayComponent } from './tableDisplay.component';

describe('TableDisplayComponent', () => {
  let component: TableDisplayComponent;
  let fixture: ComponentFixture<TableDisplayComponent>;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableDisplayComponent],
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableDisplayComponent);
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

  it('should fetch events on initialization', () => {
    const mockEvents = {
      currentPage: 1,
      pageCount: 5,
      totalEvents: 50,
      events: [
        { eventid: 1, description: 'Event 1', livestart: '2024-01-01', liveend: '2024-01-02' },
        { eventid: 2, description: 'Event 2', livestart: '2024-01-03', liveend: '2024-01-04' }
      ]
    };

    component.fetchEvents();

    const req = httpMock.expectOne('http://localhost:3000/events?page=1&limit=10');
    expect(req.request.method).toBe('GET');
    req.flush(mockEvents);

    expect(component.events.length).toBe(2);
    expect(component.groupedEvents.length).toBe(2);
    expect(component.isLoading).toBeFalse();
    expect(component.pageCount).toBe(5);
    expect(component.totalEvents).toBe(50);
  });

  it('should handle pagination and update current page', () => {
    const spyFetchEvents = spyOn(component, 'fetchEvents').and.callThrough();
    component.onPageChange(2);

    expect(spyFetchEvents).toHaveBeenCalledWith(2);
    expect(component.currentPage).toBe(2);
  });

  it('should group events by event ID', () => {
    const mockEvents = [
      { eventid: 1, description: 'Event 1', livestart: '2024-01-01', liveend: '2024-01-02' },
      { eventid: 1, description: 'Event 1 - Second Entry', livestart: '2024-01-01', liveend: '2024-01-02' },
      { eventid: 2, description: 'Event 2', livestart: '2024-01-03', liveend: '2024-01-04' }
    ];
    
    component.events = mockEvents;
    component.groupEventsByEventId();

    expect(component.groupedEvents.length).toBe(2);
    expect(component.groupedEvents[0].rows.length).toBe(2);
    expect(component.groupedEvents[1].rows.length).toBe(1);
  });

  it('should trigger download when downloadExcel is called', () => {
    const spyWindowOpen = spyOn(window, 'open').and.stub();
    component.downloadExcel();
    expect(spyWindowOpen).toHaveBeenCalledWith('http://localhost:3000/download-events', '_blank');
  });

  it('should sign out and navigate to login page', () => {
    const spyRouter = spyOn(router, 'navigate');
    component.signOut();
    expect(localStorage.getItem('token')).toBeNull();
    expect(spyRouter).toHaveBeenCalledWith(['/login']);
  });
});
