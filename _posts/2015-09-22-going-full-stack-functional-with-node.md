---
layout: post
title: Going full stack functional with Nodejs - Part I
tags: [Javascript, ReactJS, Functional Programming, NodeJS]
---

# Overview

This is the first part in a series of tutorials that outline the steps involved in building a complete (albeit simple) Node.js applications using principles from functional programming in a methodical test driven fashion. To simplify the code we use [livescript](http://livescript.net/) as the primary language, [ramda](http://ramdajs.com) as our utility toolkit, [koa](https://github.com/koajs/koa) for backend, [Redux](http://rackt.github.io/redux/) for unidirectional data synchronization, [React.js](https://facebook.github.io/react) for the user interface & [knex](http://knexjs.org/) for database abstraction. This series is primarily aimed at beginners so prior familiarity with none of the above is assumed.

The application we build is a simple movies database that allows users to vote for their favorite movie. Not something very complex, but at the same time not something so trivial that it is difficult extrapolate the ideas to a real world context.

# Bootstrapping the application

To keep things simple we will start from scratch rather than using any existing scaffold or project template. Our application will be non-imaginatively called movie-explorer. I will assume you have got nodejs already installed. Let us get started:

<img src="/images/movie_explorer_bootstrap.png">

Next we install the dependencies of our application.

```bash
$ npm install --save livescript ramda koa redux react knex pg
```

We intend to adopt a test driven approach for developing the application and hence install a few utilities to aid us in that:

```
$ npm install --save-dev mocha cucumber co-mocha
```

After all of the above is done, our package.json should look something like the following:

```
{
  "name": "movie_explorer",
  "version": "0.0.1",
  "description": "Sample application to demonstrate application of functional programming principles in the context of a nodejs web application",
  "main": "index.js",
  "scripts": {
    "test": "npm test"
  },
  "author": "Lorefnon <lorefnon@gmail.com> (http://lorefnon.me)",
  "license": "MIT",
  "dependencies": {
    "knex": "^0.8.6",
    "koa": "^1.0.0",
    "livescript": "^1.4.0",
    "pg": "^4.4.2",
    "ramda": "^0.17.1",
    "react": "^0.13.3",
    "redux": "^3.0.0"
  },
  "devDependencies": {
    "cucumber": "^0.5.3",
    "mocha": "^2.3.3"
  }
}

```

# Bootstrapping the database with knex

To start using knex the easiest approach is to define a Knexfile. Ours looks like the following. This should work out of the box for postgresapp on a mac. However for other configurations it may need to be tweaked.

After we `require` livescript we can directly require livescript files. So our `config/knex` file can be a livescript file:

`config/knex.ls` :

{% highlight livescript linenos %}
require! ramda: R

base-config =
  migrations:
    directory: "#{__dirname}/../db/migrations"
  client: \pg

module.exports =
  development:
    R.merge base-config,
      connection:
        host: '127.0.0.1'
        user: process.env.USER
        database: \movie_explorer_development
  production:
    R.merge base-config, connection: process.env.DATABASE_URL
{% endhighlight %}

We create our application database and then the rest of the table schema is specified through knex migrations. That way the schema of our application is version controlled along with our codebase.

```
create database movie_explorer_development;
create database movie_explorer_test;
```

In the spirit of TDD we will now create our first test. Before we do so we need to configure mocha. A file `test/mocha.opts` will be automatically picked up by mocha.

```
--ui bdd
--require co-mocha
--compilers ls:livescript
```

We also need to expose a configured knex instance through a module

`db/support/knex.ls`:

{% highlight livescript linenos %}
require! knex

module.exports = knex require('../../knexfile')[process.env.NODE_ENV]
{% endhighlight %}

Now comes our test:

{% highlight livescript linenos %}
require! {
  assert
  '../../../db/support/knex': knex
}

require! {
  assert
  '../../../db/support/knex': knex
}

describe \schema, ->
  describe \users, ->
    describe \table, ->
      specify 'should exist', ->*
        assert.ok yield knex.schema.has-table \users
        for column in <[id email username created_at updated_at]>
          assert.ok yield knex.schema.has-column \users, column
{% endhighlight %}

Now we can go back to the command line, run our tests and watch it bleed:

<img src='/images/movie_explorer_bleeding_tests.png'>

To make the test pass, we need to create the relevant schema. We can use the knex command line tools to generate our first migration:

```
node_modules/.bin/knex migrate:make create_users
```

If you also install knex globally, or add node_modules/.bin to your path then the complete path will not have to be provided each time.

We can use livescript for our migration files as well. To change the extension of generated files we can use the following shell command:

```
for i in $(ls); do mv $i $(echo $i | sed 's/.js/.ls/'); done
```

`db/migrations/20150921193358_create_users.ls`

{% highlight livescript linenos %}
module.exports =

  up: (knex)->
    knex.schema.create-table \users, (t)->

      t.integer \id
      t.string \username
      t.string \email

      t.index \username
      t.index \email

      t.timestamps!
      t.primary \id

  down: (knex)->
    knex.schema.drop-table \users
{% endhighlight %}

Now if our migrations run without error then our users table is set up properly and we can re-run the tests:

```
NODE_ENV=test knex migrate:latest
```

<img src="/images/movie_explorer_migrations_run.png">

```
NODE_ENV=test node_modules/.bin/mocha test/db/schema/users.ls
```

<img src="/images/movie_explorer_schema_test_success.png">

So we bootstrapped a knex and created our first table, using livescript and we have our first passing test. So far so good, the next part will focus on setting up authentication, after which we will move on to the client side application. Any suggestions/feedback is very much welcome.
