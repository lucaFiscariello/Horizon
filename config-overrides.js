// config-overrides.js
module.exports = function override(config, env) {
    config.resolve.fallback =  { 
        "timers": require.resolve("timers-browserify"),
        "stream": require.resolve("stream-browserify"),
      }

    return config
}