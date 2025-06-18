import { Routes } from '@angular/router';
import { TodoHomeComponent } from './todo-home/todo-home.component';
import { TodoListComponent } from './todo-list/todo-list.component';
import { AboutComponent } from './about/about.component';
import { CalendarViewComponent } from './calendar-view/calendar-view.component';

export const routes: Routes = [
  { path: '', component: TodoHomeComponent },
  { path: 'calendar', component: CalendarViewComponent },
  { path: 'todo-list', component: TodoListComponent },
  { path: 'about', component: AboutComponent }
];