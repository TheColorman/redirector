import express from 'express';
import Database from 'better-sqlite3';

const db = Database('./db.sqlite3')
db.pragma('journal_mode = WAL')

const app = express();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});