# redirector
Redirector is a nodejs, express microservice with two simple features:  
1. Set `key`-`value` pairs with a POST request, `value`s being URLs.
2. Redirect to the specified URL (`value`) when a client navigates to `/key`.
  
It has the following endpoints:  
- `GET /routes`: Returns a json formatted list of routes in the database.  
- `GET /*`: Tries to find a matching path in the database and redirects to its specified target.  
- `POST /`: Takes a json object in the form
  ```json
  {
      "path": "example",
      "target": "https://example.com"
  }
  ```
  which sets up or updates a route from `/example` to `https://example.com`.
- `DELETE /`: Takes a json object in the form
  ```json
  {
      "path": "example"
  }
  ```
  which deletes a route from `/example`.  
  
All routes except `GET /*` requrie authorization via bearer token, stored as an array of strings in `tokens.json`.