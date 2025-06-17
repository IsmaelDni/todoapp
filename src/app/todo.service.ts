import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Todo {
  selected: boolean; // Ajoute cette ligne pour la sélection multiple
  id: number;
  text: string;
  done: boolean; // Ajoute cette ligne
  priority: string; // (optionnel si tu utilises la priorité)
  due_date?: string; // (optionnel si tu utilises la date d'échéance)
}

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private apiUrl = 'http://localhost:3000/api/todos';

  constructor(private http: HttpClient) {}

    addTodo(text: string, priority: string, folderId?: number, due_date?: string): Observable<Todo> {
    return this.http.post<Todo>(this.apiUrl, { text, priority, folder_id: folderId, due_date });
  }
  // This method adds a new todo item with text, priority, optional folder ID, and due date
  getTodos(folderId?: number): Observable<Todo[]> {
    let params: any = {};
    if (folderId) params.folder_id = folderId;
    return this.http.get<Todo[]>(this.apiUrl, { params });
  }
  // This method retrieves all todos, optionally filtered by folder ID

  toggleDone(id: number, done: boolean): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/done`, { done }, { responseType: 'json' });
  }
  // This method toggles the done status of a todo item by its ID
    
  updateTodo(id: number, text: string, priority: string, due_date?: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, { text, priority, due_date });
  }
  // This method updates a todo item by its ID, text, and priority

  deleteTodo(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}