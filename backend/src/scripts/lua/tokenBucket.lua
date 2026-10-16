-- Token Bucket Rate Limiter
-- KEYS[1] = bucket key (e.g. "rl:apiKeyId")
-- ARGV[1] = capacity (max tokens, e.g. 60)
-- ARGV[2] = refill rate (tokens per second, e.g. 1)
-- ARGV[3] = current timestamp (seconds)
-- ARGV[4] = tokens requested (e.g. 1)

local key = KEYS[1]
local capacity = tonumber(ARGV[1])
local refillRate = tonumber(ARGV[2])
local now = tonumber(ARGV[3])
local requested = tonumber(ARGV[4])

-- Get current state
local bucket = redis.call('HMGET', key, 'tokens', 'lastRefill')
local tokens = tonumber(bucket[1])
local lastRefill = tonumber(bucket[2])

-- Initialize if new bucket
if tokens == nil then
  tokens = capacity
  lastRefill = now
end

-- Refill tokens based on elapsed time
local elapsed = math.max(0, now - lastRefill)
local refill = elapsed * refillRate
tokens = math.min(capacity, tokens + refill)

-- Check if enough tokens
local allowed = 0
local retryAfter = 0

if tokens >= requested then
  tokens = tokens - requested
  allowed = 1
else
  -- Time until enough tokens
  local deficit = requested - tokens
  retryAfter = math.ceil(deficit / refillRate)
end

-- Save state
redis.call('HMSET', key, 'tokens', tokens, 'lastRefill', now)

-- Set TTL (bucket refill time + buffer)
local ttl = math.ceil(capacity / refillRate) + 60
redis.call('EXPIRE', key, ttl)

-- Return: [allowed, remaining, retryAfter]
return { allowed, math.floor(tokens), retryAfter }