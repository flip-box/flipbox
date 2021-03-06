// instantiate, add file, run it, when done delete the require
module.exports = function(outputPath, helpers, cb) {
  const Mocha = require('mocha')

  // mocha --compilers ts:ts-node/register ..
  // https://github.com/mochajs/mocha/blob/master/mocha.js
  // https://github.com/mochajs/mocha/blob/3a718587115a8578c1d0a283bbe214d09a35831b/bin/_mocha#L364
  // Instantiate a Mocha instance.
  const mocha = new Mocha()

  mocha.addFile(outputPath)

  // Run the tests.
  const runner = mocha.run()
  runner.on('test', function() {
    console.log('RUNNER ON TEST', arguments)
  })
  runner.on('fail', function() {
    console.log('RUNNER ON FAIL', arguments)
  })
  runner.on('hook', function() {
    console.log('RUNNER ON HOOK', arguments)
  })
  runner.on('suite', function() {
    console.log('RUNNER ON SUITE', arguments)
  })
  runner.on('end', function() {
    // mocha uses require to initialize it's suite. We are now watching the
    // file so the file needs to be deleted from the cache.
    // see https://github.com/mochajs/mocha/blob/master/bin/_mocha#L358
    delete require.cache[outputPath]
    console.log('deleted mocha cache')
    if (cb) { cb() }
  })

  return runner
}
