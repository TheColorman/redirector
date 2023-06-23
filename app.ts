import express from "express"
import Database from "better-sqlite3"

const db = Database("./db.sqlite3")
db.pragma("journal_mode = WAL")

// Database setup
db.prepare(
  "CREATE TABLE IF NOT EXISTS routes (id INTEGER PRIMARY KEY, path TEXT, target TEXT)"
).run()

const app = express()

app.get("/*", (req, res) => {
  const path = req.path.slice(1)

  res.send("Hello World!\n" + req.path)
})

app.listen(3000, () => {
  console.log("Example app listening on port 3000!")
})
