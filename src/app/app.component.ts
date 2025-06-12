import { Component } from '@angular/core';
import { RouterModule} from '@angular/router'; // Import RouterOutlet pour la navigation
import { TodoHomeComponent } from "./todo-home/todo-home.component"; // Ajoute cette ligne
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true, // Doit être "true"
  imports: [FormsModule,CommonModule,RouterModule], // Importe le composant ici
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  
})
export class AppComponent {
  title = 'todo-app';
}
