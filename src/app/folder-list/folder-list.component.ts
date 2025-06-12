import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FolderService, Folder } from '../folder.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-folder-list',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './folder-list.component.html',
  styleUrl: './folder-list.component.css'
})
export class FolderListComponent implements OnInit {
  folders: Folder[] = [];
  newFolderName: string = '';
  selectedFolderId: number | null = null;

  @Output() folderSelected = new EventEmitter<number|null>();

  constructor(private folderService: FolderService) {}

  ngOnInit() {
    this.loadFolders();
  }

  loadFolders() {
    this.folderService.getFolders().subscribe(folders => this.folders = folders);
  }

  addFolder() {
    if (this.newFolderName.trim()) {
      this.folderService.addFolder(this.newFolderName).subscribe(folder => {
        this.folders.push(folder);
        this.newFolderName = '';
      });
    }
  }

  selectFolder(id: number | null) {
    this.selectedFolderId = id;
    this.folderSelected.emit(id);
  }

  deleteFolder(id: number){
    if (confirm('Supprimer ce dossier ? Les tâches associées seront supprimées.')) {
      this.folderService.deleteFolder(id).subscribe(() => {
        this.folders = this.folders.filter(f => f.id !== id);
        if (this.selectedFolderId === id) {
          // Sélectionne le premier dossier restant ou null si plus de dossier
          const next = this.folders.length > 0 ? this.folders[0].id : null;
          this.selectFolder(next);
        }
      });
    }
  }
}