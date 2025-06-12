const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = !app.isPackaged;

// ...existing code...
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const appExpress = express();
appExpress.use(cors());
appExpress.use(express.json());

const db = new sqlite3.Database('todos.db');
// Créer la table si elle n'existe pas
db.serialize(() => {

  db.run(`
    CREATE TABLE IF NOT EXISTS folders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    )
  `);
  db.run(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT,
    done INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    priority TEXT DEFAULT 'normal',
    folder_id INTEGER,
    FOREIGN KEY(folder_id) REFERENCES folders(id) ON DELETE CASCADE
  )
`);
  db.run("PRAGMA foreign_keys = ON");
});

// Récupérer les todos
appExpress.get('/api/todos', (req, res) => {
  const folderId = req.query.folder_id;
  let sql = "SELECT * FROM todos";
  let params = [];
  if (folderId) {
    sql += " WHERE folder_id = ?";
    params.push(folderId);
  }
  sql += " ORDER BY created_at DESC";
  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({error: err.message});
    res.json(rows);
  });
});

// Ajouter un todo
appExpress.post('/api/todos', (req, res) => {
  const { text, priority, folder_id } = req.body;
  db.run(
    "INSERT INTO todos(text, priority, folder_id) VALUES(?, ?, ?)",
    [text, priority || 'normal', folder_id || null],
    function(err) {
      if (err) return res.status(500).json({error: err.message});
      res.json({ id: this.lastID, text, priority: priority || 'normal', done: 0, folder_id: folder_id || null });
    }
  );
});

appExpress.delete('/api/folders/:id', (req, res) => {
  const folderId = req.params.id;
  // Supprime d'abord les todos du dossier
  db.run("DELETE FROM todos WHERE folder_id = ?", [folderId], function(err) {
    if (err) return res.status(500).json({error: err.message});
    // Puis supprime le dossier
    db.run("DELETE FROM folders WHERE id = ?", [folderId], function(err2) {
      if (err2) return res.status(500).json({error: err2.message});
      res.json({ deleted: this.changes });
    });
  });
});
// Mettre à jour le nom d'un dossier


// Récupérer les dossiers
appExpress.get('/api/folders', (req, res) => {
  db.all("SELECT * FROM folders", [], (err, rows) => {
    if (err) return res.status(500).json({error: err.message});
    res.json(rows);
  });
});

// Ajouter un dossier
appExpress.post('/api/folders', (req, res) => {
  const { name } = req.body;
  db.run("INSERT INTO folders(name) VALUES(?)", [name], function(err) {
    if (err) return res.status(500).json({error: err.message});
    res.json({ id: this.lastID, name });
  });
});

// Supprimer un todo
appExpress.delete('/api/todos/:id', (req, res) => {
  db.run("DELETE FROM todos WHERE id = ?", [req.params.id], function(err) {
    if (err) return res.status(500).json({error: err.message});
    res.json({ deleted: this.changes });
  });
});

// Marquer comme fait/non fait
appExpress.patch('/api/todos/:id/done', (req, res) => {
  db.run("UPDATE todos SET done = ? WHERE id = ?", [req.body.done ? 1 : 0, req.params.id], function(err) {
    if (err) return res.status(500).json({error: err.message});
    res.json({ updated: this.changes });
  });
});

// Modifier le texte ou la priorité
appExpress.put('/api/todos/:id', (req, res) => {
  const { text, priority } = req.body;
  db.run("UPDATE todos SET text = ?, priority = ? WHERE id = ?", [text, priority, req.params.id], function(err) {
    if (err) return res.status(500).json({error: err.message});
    res.json({ updated: this.changes });
  });
});

appExpress.listen(3000, () => console.log('API listening on port 3000'));
// ...existing code...

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  });

 win.loadURL(
  isDev
    ? 'http://localhost:4200'
    : `file://${path.join(__dirname, 'dist/todo-app/browser/index.html')}`
);

  if (isDev) {
    win.webContents.openDevTools();
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  db.close();
  // Si besoin, ferme aussi le serveur Express
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Dans main.js
