-- EVAL getsetnx 1 key val
local key = KEYS[1]
local val = ARGV[1]

if redis.call('exists', key) == 1 then
  return redis.call('get', key)
else
  redis.call('set', key, val)
  return val
end
