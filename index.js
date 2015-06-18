var path = require('path');

module.exports = routes;

function routes(options) {
    var app, express, routes, middlewares;

    if (!options) {
        throw new Error('No options object supplied.');
    }

    app             = options.app;
    express         = options.express;
    routes          = options.routes;
    middlewareBase  = options.middlewares;

    if (!app || !routes || !middlewareBase) {
        throw new Error('No app, express, routes, or middlewares value supplied: ' + JSON.stringify(options));
    }

    routes.forEach(function(route) {
        var router;

        switch (route[0]) {
            // passing in a router or middleware that doesn't need verb
            case 'use':
                router = getMiddlewares(route[2], middlewareBase);
                if (!!route[1]) {
                    app.use(route[1], router);
                } else {
                    app.use(router);
                }
                break;
            // Passing in middlewares
            default:
                router = express.Router();
                router
                    .route(route[1])
                    [route[0].toLowerCase()](
                    getMiddlewares(route[2], middlewareBase)
                );
                app.use('/', router);
                break;
        }


    });
}

function getMiddlewares(middlewares, middlewareBase) {
    return middlewares.map(function(ware) {
        return require(path.join(middlewareBase, ware));
    });
}
