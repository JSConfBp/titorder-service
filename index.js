'use strict';
const Boom = require('boom');
const Hapi=require('hapi');

const parser = require('./parser')

// Create a server with a host and port
const server=Hapi.server({
    host:'0.0.0.0',
	port: 8000,
	cors: true
});

// Add the route
server.route({
    method:'POST',
	path:'/parse',
	options: {
		payload: {
			maxBytes: 2097152,
			allow: 'text/csv'
		},
	},
    handler: async function (request, h) {
		try {
			const result = await parser(request.payload)
			return result
		} catch(e) {
			return Boom.badRequest(e.message, e)
		}
    }
});

// Start the server
async function start() {

    try {
        await server.start();
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }

    console.log('Server running at:', server.info.uri);
};

start();