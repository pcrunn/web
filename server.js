const moment = require('moment');
const r = require('rethinkdb');
const express = requre('express');
const app = express();

// connect to the database
let connection;
r.connect({ host: '127.0.0.1', port: 28015, db: 'carly' }, (error, connect) => {
    if (error) throw error;

    connection = connect;
});

// init handlebars
app.engine("handlebars", handlebars());
app.set("view engine", "handlebars");

// setup routes
app.get("/", (request, response) => response.render("home"));
app.get('/api/users', async (request, response) => {
    let result = await (await r.table('users').run(connection)).toArray();
    let names = result.map(user => user.name);

    return response.json(names);
});

app.get('/u/:name', async (request, response) => {
    let name = request.params['name'];
    let result = await (await r.table('users').run(connection)).toArray();

    if (result.length == 0) return response.send('404');

    let user = result[0];
    let formatted_playtime = moment.duration(user.playtime).humanize();

    return response.render('user', { user, formatted_playtime });
});

// start server
app.listen(4567, () => console.log("listening on port :4567"));
