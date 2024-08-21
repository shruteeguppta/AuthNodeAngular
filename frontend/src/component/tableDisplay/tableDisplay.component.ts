import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tableDisplay',
  templateUrl: './tableDisplay.component.html',
  styleUrls: ['./tableDisplay.component.scss']
})
export class TableDisplayComponent implements OnInit {
  events: any[] = [];
  groupedEvents: any[] = [];
  currentPage: number = 1;
  pageCount: number = 0;
  totalEvents: number = 0;
  limit: number = 10; // records per page
  isLoading: boolean = false;

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.fetchEvents();
  }

  fetchEvents(page: number = 1) {
    this.isLoading = true;
    this.http.get<any>(`http://localhost:3000/events?page=${page}&limit=${this.limit}`)
      .subscribe(response => {
        this.events = response.events;
        this.currentPage = response.currentPage;
        this.pageCount = response.pageCount;
        this.totalEvents = response.totalEvents;

        this.groupEventsByEventId();
        this.isLoading = false;
      }, error => {
        console.error('Failed to fetch events', error);
        this.isLoading = false;
      });
  }

  groupEventsByEventId() {
    const grouped = this.events.reduce((acc: any[], event) => {
      const existingGroup = acc.find((group: any) => group.eventid === event.eventid);
      if (existingGroup) {
        existingGroup.rows.push(event);
      } else {
        acc.push({
          eventid: event.eventid,
          rows: [event]
        });
      }
      return acc;
    }, []);
    this.groupedEvents = grouped;
  }

  onPageChange(page: number) {
    this.fetchEvents(page);
  }

  downloadExcel() {
    window.open('http://localhost:3000/download-events', '_blank');
  }

  signOut() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
