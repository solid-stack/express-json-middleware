# express-json-middleware

A simple minded way to pull in middleware based on a json config file.

This npm is very minimal. Currently its feature list is exactly what I need. If you need other types of routes supports,
pull requests / issues are welcome.

## Usage

Create a routes.json file (or just an in memory array), and pass it in along with the express, express app, and the path to your
middlewares directory:

```javascript
var express         = require('express'),
    app             = express(),
    createRoutes    = require('express-json-middleware'),
    routes          = require('./routes.json'),
    path            = require('path');
    

app.set('views'         , __dirname + '/views');
app.set('view engine'   , 'jade');

createRoutes({
    app         : app,
    express     : express,
    routes      : routes,
    middlewares : path.join(__dirname, 'middlewares')
});

app.listen(process.env.PORT);
```
    
Your routes array or routes.json should be an array of arrays. Each line has 3 items.

1. The first item is the express `use` command or an express supported verb.
    1. use will, `use` the middleware on the app
    1. a verb will create a new isolated router and use the middlewares listed in the third item
1. The second item is the routes that this should apply to, `null` if it should be set directly on the default router with no routes.
1. The third item is the array of middlewares to be run. Each string will be required in with the middlewares base prefixed to it.

Additionally you can create named stacks of middleware using the "stack" word for the first item, a name for the second
item, and a list of middlewares for the thired. These have to be 
included before being applied. You can include the named stack in your later lists of middlewares and it will be expanded
to the full list. This is handy if you have long lists of repeated middlewares.

```json
[
    [ "stack",  "addPageParts", ["addHeader", "addFotter"]],
    [ "GET",    "/",            ["addPageParts"]]
]
```


### routes.json


```json
[
  [ "use",      "/",                                ["static"]],
  [ "use",      "/api/v1",                          ["grasshopper"]],
  [ "GET",      "/admin*?",                         ["admin"]],
  [ "GET",      "/:category/:subcategory/:product", ["page/product", "notFound"]],
  [ "GET",      "/:category/:subcategory",          ["page/subcategory", "notFound"]],
  [ "GET",      "/:category",                       ["page/category", "notFound"]],
  [ "GET",      "*",                                ["notFound"]]
]
```
