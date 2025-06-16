import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Subtask {
  id: number;
  text: string;
  done: boolean;
  todo_id: number; // ID of the parent todo
}
@Injectable({
  providedIn: 'root'
})
export class SubtaskService {

  private apiUrl = 'http://localhost:3000/api/subtasks';

  constructor(private http:HttpClient) { }
    getSubtasks(todoId: number): Observable<Subtask[]> {
    return this.http.get<Subtask[]>(`${this.apiUrl}/todos/${todoId}/subtasks`);
  }

  addSubtask(todoId: number, text: string): Observable<Subtask> {
    return this.http.post<Subtask>(`${this.apiUrl}/todos/${todoId}/subtasks`, { text });
  }

  updateSubtask(id: number, text: string, done: boolean): Observable<any> {
    return this.http.patch(`${this.apiUrl}/subtasks/${id}`, { text, done });
  }

  deleteSubtask(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/subtasks/${id}`);
  }

}
