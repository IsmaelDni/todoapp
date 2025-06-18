import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import { TodoService } from '../todo.service';
import { FullCalendarModule } from '@fullcalendar/angular'; // Ajoute ceci
import dayGridPlugin from '@fullcalendar/daygrid'; // Ajoute cette ligne

@Component({
  selector: 'app-calendar-view',
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.css'],
  imports: [ FullCalendarModule ] // Importe le composant ici

})
export class CalendarViewComponent implements OnInit {
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
    events: []
  };

  constructor(private todoService: TodoService) {}

  // Note: The calendarOptions.events will be populated in ngOnInit
  ngOnInit() {
    this.todoService.getTodos().subscribe(todos => {
      this.calendarOptions.events = todos
        .filter(todo => todo.due_date)
        .map(todo => ({
          title: todo.text,
          date: todo.due_date
        }));
    });
  }
}
