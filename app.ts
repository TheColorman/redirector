import express, { NextFunction, Request, Response } from "express"
import cors from "cors"
import Database from "better-sqlite3"
import type { Route } from "./types"
import tokens from "./tokens.json"

const db = Database("./db.sqlite3")
db.pragma("journal_mode = WAL")

// Database setup
db.prepare(
  "CREATE TABLE IF NOT EXISTS routes (id INTEGER PRIMARY KEY, path TEXT, target TEXT)"
).run()

function getRoute(path: string) {
  const route = db.prepare("SELECT * FROM routes WHERE path = ?").get(path)
  return route ? (route as Route) : null
}
function setRoute(path: string, target: string) {
  const route = getRoute(path)

  route
    ? db
        .prepare("UPDATE routes SET target = ? WHERE id = ?")
        .run(target, route.id)
    : db
        .prepare("INSERT INTO routes (path, target) VALUES (?, ?)")
        .run(path, target)
}
function delRoute(path: string) {
  const route = getRoute(path)

  route && db.prepare("DELETE FROM routes WHERE id = ?").run(route.id)
}

const app = express()
app.use(cors())

function checkToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send("Unauthorized")
  }
  const token = authHeader.slice(7)

  if (!tokens.includes(token)) {
    return res.status(403).send("Forbidden")
  }

  next()
}
function json(req: Request, res: Response, next: NextFunction) {
  if (req.headers["content-type"] !== "application/json") {
    return res.status(400).send("Bad Request")
  }

  // Convert request body to JSON
  let body = ""
  req.on("data", chunk => {
    body += chunk
  })
  req.on("end", () => {
    if (body.length > 1e4) {
      res.status(413).send("Payload Too Large")
      return
    }

    try {
      req.body = JSON.parse(body)
      next()
    } catch (e) {
      res.status(400).send("Bad Request")
    }
  })
}

app.get("/routes", checkToken, (req, res) => {
  const routes = db.prepare("SELECT * FROM routes").all()
  console.log("Loaded routes")
  res.json(routes)
})

app.get("/*", (req, res) => {
  const path = req.path.slice(1)
  const route = getRoute(path)

  console.log(`Redirecting ${path} to ${route?.target}`)

  route ? res.redirect(route.target) : res.status(404).send("Not Found")
})

app.post("/", json, checkToken, (req, res) => {
  const { path, target } = req.body
  if (typeof path !== "string" || typeof target !== "string") {
    res.status(400).send("Bad Request")
    return
  }

  setRoute(path, target)
  console.log(`Created route ${path} -> ${target}`)
  res.status(201).send("Created")
})

app.delete("/", json, checkToken, (req, res) => {
  const path = req.body.path

  if (typeof path !== "string") {
    res.status(400).send("Bad Request")
    return
  }

  delRoute(path)
  console.log(`Deleted route ${path}`);
  res.status(200).send("OK")
})

app.listen(3000, () => {
  console.log("Redirector listening on port 3000")
})
