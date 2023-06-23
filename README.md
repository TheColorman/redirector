# redirector
The goal of redirector is to be a microservice server with two simple features:  
1. Set `key`-`value` pairs with a POST request, `value`s being URLs.
2. Redirect to the specified URL (`value`) when a client navigates to `/key`.
