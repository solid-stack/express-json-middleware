var path = require('path'),
    _ = require('lodash');

module.exports = routes;

function routes(options) {
    var app, express, routes, middlewares, stacks = {};

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
        case 'stack':
            stacks[route[1]] = route[2];
            break;
            // passing in a router or middleware that doesn't need verb
        case 'use':
            router = getMiddlewares(route[2], middlewareBase, stacks);
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
                getMiddlewares(route[2], middlewareBase, stacks)
            );
            app.use('/', router);
            break;
        }


    });
}

function getMiddlewares(middlewares, middlewareBase, stacks) {
    return _
        .chain(middlewares)
        .map(function(ware) {
            if (stacks[ware]) {
                return stacks[ware];
            } else {
                return ware;
            }
        })
        .flatten()
        .map(function(ware) {
            return require(path.join(middlewareBase, ware));
        })
        .value();
}
