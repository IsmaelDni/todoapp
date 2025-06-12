import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Todo {
  selected: boolean; // Ajoute cette ligne pour la sélection multiple
  id: number;
  text: string;
  done: boolean; // Ajoute cette ligne
  priority: string; // (optionnel si tu utilises la priorité)
  
}

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private apiUrl = 'http://localhost:3000/api/todos';

  constructor(private http: HttpClient) {}

  addTodo(text: string, priority: string, folderId?: number): Observable<Todo> {
    return this.http.post<Todo>(this.apiUrl, { text, priority, folder_id: folderId });
  }

  getTodos(folderId?: number): Observable<Todo[]> {
    let params: any = {};
    if (folderId) params.folder_id = folderId;
    return this.http.get<Todo[]>(this.apiUrl, { params });
  }
    toggleDone(id: number, done: boolean): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/done`, { done }, { responseType: 'json' });
  }
    
    updateTodo(id: number, text: string, priority: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, { text, priority });
  }
  // This method updates a todo item by its ID, text, and priority

  deleteTodo(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}