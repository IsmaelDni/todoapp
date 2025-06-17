import { Component, Input, OnInit, OnChanges,SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SubtaskService, Subtask } from '../subtask.service';

@Component({
  selector: 'app-subtask-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './subtask-list.component.html'
})
export class SubtaskListComponent implements OnInit, OnChanges {
  @Input() todoId!: number;
  subtasks: Subtask[] = [];
  newSubtask: string = '';
  editId: number|null = null;
  editText: string = '';

  constructor(private subtaskService: SubtaskService) {}
  

  ngOnInit() {
    this.loadSubtasks();
  }

  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['todoId'] && !changes['todoId'].firstChange) {
      this.loadSubtasks();
    }
  }

  loadSubtasks() {
    if (this.todoId) {
      this.subtaskService.getSubtasks(this.todoId).subscribe(subs => this.subtasks = subs);
    }
  }

  addSubtask() {
    if (this.newSubtask.trim()) {
      this.subtaskService.addSubtask(this.todoId, this.newSubtask).subscribe(() => {
        this.newSubtask = '';
        this.loadSubtasks();
      });
    }
  }

  toggleDone(subtask: Subtask) {
    this.subtaskService.updateSubtask(subtask.id, subtask.text, subtask.done).subscribe();
  }

  startEdit(subtask: Subtask) {
    this.editId = subtask.id;
    this.editText = subtask.text;
  }

  saveEdit(subtask: Subtask) {
    if (this.editText.trim()) {
      this.subtaskService.updateSubtask(subtask.id, this.editText, subtask.done).subscribe(() => {
        this.editId = null;
        this.editText = '';
        this.loadSubtasks();
      });
    }
  }

  cancelEdit() {
    this.editId = null;
    this.editText = '';
  }

  deleteSubtask(subtask: Subtask) {
    if (confirm('Supprimer cette sous-tâche ?')) {
      this.subtaskService.deleteSubtask(subtask.id).subscribe(() => this.loadSubtasks());
    }
  }
}