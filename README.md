# redis-require

  Require Redis Lua scripts with ease.

## API
```js
var requireRedis = require('require-redis')(require)
```

### requireRedis(path)

  `requireRedis` expects a path in the same form as `require`, but looks for files with the extension `.redis.lua`.
  It returns a function that expects a Redis client providing an `eval` method as `this`.

  The first line of the script specifies the name and signature of the command.
  It is expected to be a line of the form `-- EVAL name 2 foo bar baz`, where `name` is the name of the function, and the number is the amount of key parameters.
  The parameter names follow.
  See the [Redis documentation](http://redis.io/commands/eval) for more information.

### requireRedis(path).install(client)
### requireRedis(path).install(name, client)

  This installs the script on the client with the given name, so it is callable as `client.command`.
  If no name is given, the name from the documentation comment is used.

  You can easily add commands to all your Redis client instances:
```js
requireRedis('./getsetnx').install(Redis.RedisClient.prototype)
```

## Example script

  See [getsetnx.redis.lua](https://github.com/nathan7/redis-require/blob/master/getsetnx.redis.lua).

## License

  ISC

