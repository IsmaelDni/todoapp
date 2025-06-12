import { Component, OnInit } from '@angular/core';
import { TodoService, Todo } from '../todo.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Import RouterOutlet pour la navigation
import { FolderListComponent } from '../folder-list/folder-list.component';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [FormsModule,CommonModule, RouterModule, FolderListComponent],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.css'
})
export class TodoListComponent implements OnInit {

  newTodo: string = '';
  todos: Todo[] = [];
  newPriority: string = 'normal';

  editId: number | null = null; // This is used to track which todo is being edited
  editText: string = ''; // This is used to store the text of the todo being edited
  editPriority: string = 'normal';

  searchText: string = '';
  filterPriority: string = '';
  filterStatus: string = '';

  
  selectedFolderId: number | null = null; // This is used to track the selected folder ID
  selectAll: boolean = false;

  

  constructor(public todoService: TodoService) {}
  // This is the constructor where you inject the TodoService

  get filteredTodos() {
    return this.todos.filter(todo => {
      const matchText = this.searchText
        ? todo.text.toLowerCase().includes(this.searchText.toLowerCase())
        : true;
      const matchPriority = this.filterPriority
        ? todo.priority === this.filterPriority
        : true;
      const matchStatus = this.filterStatus
        ? (this.filterStatus === 'done' ? todo.done : !todo.done)
        : true;
      return matchText && matchPriority && matchStatus;
    });
  }

    selectedTodos(): Todo[] {
    return this.todos.filter(t => t.selected);
  }

  toggleSelectAll() {
    this.todos.forEach(t => t.selected = this.selectAll);
  }

  onSelectChange() {
    this.selectAll = this.todos.length > 0 && this.todos.every(t => t.selected);
  }

  deleteSelectedTodos() {
    if (confirm('Supprimer toutes les tâches sélectionnées ?')) {
      const ids = this.selectedTodos().map(t => t.id);
      // Appelle le service pour chaque id (ou crée une route batch côté API)
      ids.forEach(id => {
        this.todoService.deleteTodo(id).subscribe(() => {
          this.loadTodos();
        });
          this.selectAll = false; // <-- Décoche la case quand tout est supprimé
      });
    }
  }

  // This is the ngOnInit lifecycle hook that Angular calls after the component is created
  ngOnInit() {
    this.loadTodos();
  }

  onFolderChange(folderId: number | null) {
    this.selectedFolderId = folderId;
    this.loadTodos();
  }

  // This method loads the todos from the service when the component initializes
  loadTodos() {
  this.todoService.getTodos(this.selectedFolderId !== null ? this.selectedFolderId : undefined).subscribe(todos => this.todos = todos);
}
  // This method adds a new todo item with the specified text and priority
  addTodo(): void {
    if (this.newTodo.trim()) {
      this.todoService.addTodo(this.newTodo, this.newPriority, this.selectedFolderId !== null ? this.selectedFolderId : undefined).subscribe(() => {
        this.newTodo = '';
        this.newPriority = 'normal';
        this.loadTodos();
      });
    }
  }

  // This method toggles the done status of a todo item
  toggleDone(todo: Todo): void {
    this.todoService.toggleDone(todo.id, !todo.done).subscribe(() => this.loadTodos());
  }

  // This method deletes a todo item by its ID
  deleteTodo(id: number): void {
    this.todoService.deleteTodo(id).subscribe(() => this.loadTodos());
  }

    startEdit(todo: Todo) {
    this.editId = todo.id;
    this.editText = todo.text;
    this.editPriority = todo.priority;
  }

  saveEdit(todo: Todo) {
    if (this.editText.trim()) {
      this.todoService.updateTodo(todo.id, this.editText, this.editPriority).subscribe(() => {
        this.editId = null;
        this.editText = '';
        this.editPriority = 'normal';
        this.loadTodos();
      });
    } else {
      this.cancelEdit();
    }
  }

  cancelEdit() {
    this.editId = null;
    this.editText = '';
    this.editPriority = 'normal';
  }


}