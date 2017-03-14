const program = require('commander')
const pkg = require('./package.json')
const {execSync, spawnSync} = require('child_process')
const execSyncStd = (cmd) => execSync(cmd, {stdio: 'inherit'})

const path = require('path')
const fs = require('fs')
const mkdirp = require('mkdirp')
function read(dir) {
  return fs.readFileSync(dir, 'utf8')
}
function write(dir, contents) {
  // get the final dir excluding the file
  let finalOutputDir = dir.split('/')
  finalOutputDir.pop()
  finalOutputDir = finalOutputDir.join('/')

  // make the final dir if it does not exist
  if (!fs.existsSync(finalOutputDir)) {mkdirp.sync(finalOutputDir)}

  dir = path.resolve(__dirname, dir)
  return fs.writeFileSync(dir, contents, 'utf8')
}

function tryJSON(json) {
  try {
    const parsed = JSON.parse(json)
    return parsed
  } catch (e) {
    return false
  }
}

function addTogithugnore(line) {
  const file = './.gitignore'

  let gitignore = read(file)
  if (gitignore.includes(line)) {return}
  gitignore += '\n' + line

  write(file, gitignore)
}


// exec in child_process, capture the buffer output, assign to var
const npmBin = execSync('npm bin').toString().replace(/\n/gmi, '')
const lerna = `${npmBin}/lerna`
let lernaLog = '--loglevel="verbose"'

// const tsc = `${npmBin}/tsc`;
// const scope = '--scope="inferno"';
// const scope = '--scope="+(inferno|inferno-devtools)"';
// const lexec = '../../node_modules/.bin/tsc';
function lernaExec(node_module) {
  return '../../node_modules/.bin/' + node_module
}
function binFor(node_module) {
  return require.resolve(node_module)
  return npmBin + '/' + node_module
}


// "test:bench": "node test/karma/bench.js",
// "test:browser": "karma start test/karma/karma.unit.conf.js --log-level debug",
// "test:publish": "coveralls < coverage/lcov.info && rimraf coverage",
// "test:quick": "cross-env mocha",
function envFor(name, val) {

}
function flagFor(name, val) {
  return `--${name}="${val}"`
}
function prefixer(prefix, apps) {
  return apps.map(name => {
    if (!name.includes(prefix)) {
      name = prefix + '-' + name
    }
    return name
  })
}
function toGlob(apps) {
  return '+(' + apps.join('|') + ')'
}
function globFlag(prefix, apps) {
  apps = apps.split(',')
  apps = prefixer(prefix, apps)
  apps = toGlob(apps)
  return apps
}
function scope(apps) {
  if (apps) {
    apps = globFlag('inferno', apps)
    const flag = flagFor('scope', apps)
    return flag
  }
  return ''
}
function cmdFor({cmd, flags, env}) {
  const nodeFlags = ' --harmony --max_old_space_size=8000'
  return `${env} ${cmd} ${flags}`
}
function scriptFor(cmd, flags) {
  return cmdFor({
    env: '',
    cmd: binFor(cmd),
    flags,
  })
}
function runScriptFor(cmd, flags) {
  const script = scriptFor(cmd, flags)
  console.log(script)
  execSyncStd(script)
}
// const cross_env = 'cross-env'
// const cross_env = binFor(`cross-env`)
const cross_env = ''
function node_env(env) {
  return `${cross_env} NODE_ENV=${env}`
}
const browser_env = node_env('browser')
const dev_env = node_env('development')
const prod_env = node_env('production')

function saveOgPkg() {
  const ogPkg = JSON.stringify(pkg, null, 2)
  write('./.fliphub/package.json', ogPkg)
}
// saveOgPkg()

function updatePkg(updated) {
  write('./package.json', JSON.stringify(updated, null, 2))
}






// https://github.com/kentcdodds/cross-env/blob/master/src/command.js

// const isWindows = require('is-windows')
// const envUseUnixRegex = /\$(\w+)/g // $my_var
// const envUseWinRegex = /%(.*?)%/g // %my_var%
// /**
//  * Converts an environment variable usage to be appropriate for the current OS
//  * @param {String} command Command to convert
//  * @returns {String} Converted command
//  */
// function crossenv(command) {
//   const isWin = isWindows()
//   const envExtract = isWin ? envUseUnixRegex : envUseWinRegex
//   const match = envExtract.exec(command)
//   if (match) {
//     command = isWin ? `%${match[1]}%` : `$${match[1]}`
//   }
//   return command
// }

// lerna --scope=inferno exec -- foo bar
// mocha packages/inferno/__tests__/**/*.js*
// save data to file

// interactive, or with flags
// default program, and with named programs
//
// clean
//   - reinstall
//   - purge
//   - uninstall
//
// ops
//   build
//     - ts
//
// "build:packages": "lerna exec -- ../../node_modules/.bin/tsc",
// "build:browser": "cross-env NODE_ENV=browser lerna exec -- node ../../bin/rollup",
// "build:dev": "cross-env NODE_ENV=development lerna exec -- node ../../bin/rollup",
// "build:prod": "cross-env NODE_ENV=production lerna exec -- node ../../bin/rollup",
// "build": "npm run clean && npm run build:packages && npm run build:dev && npm run build:prod && npm run build:browser",
//
//   test
//      - all
//      - publish
//      - quick
//      - server
//     karma
//      - all
//      - chroma
//      - firefox
//      - ie
//     browser
//     bench
//
// env
//  - dev
//  - prod
//
// lint
//   - js
//   - ts
//   - all (default)


// "browser": "webpack-dev-server --config config/webpack.dev.conf.js",
// "build:packages": "lerna exec -- ../../node_modules/.bin/tsc",
// "build:browser": "cross-env NODE_ENV=browser lerna exec -- node ../../bin/rollup",
// "build:dev": "cross-env NODE_ENV=development lerna exec -- node ../../bin/rollup",
// "build:prod": "cross-env NODE_ENV=production lerna exec -- node ../../bin/rollup",
// "build": "npm run clean && npm run build:packages && npm run build:dev && npm run build:prod && npm run build:browser",
// "clean": "rimraf coverage/ packages/*/dist*/",
// "karma:all": "npm run karma:firefox && npm run karma:chrome && npm run karma:ie",
// "karma:chrome": "karma start test/karma/karma.unit.conf.js --browsers=Chrome",
// "karma:firefox": "karma start test/karma/karma.unit.conf.js --browsers=Firefox",
// "karma:ie": "karma start test/karma/karma.unit.conf.js --browsers=IE",
// "lint:js": "eslint config examples src packages/*/__tests__/*",
// "lint:ts": "tslint packages/*/src/*.ts",
// "lint": "npm run lint:ts && npm run lint:js",
// "packages:purge": "rimraf node_modules",
// "packages:reinstall": "npm run packages:purge && npm install",
// "postinstall": "lerna bootstrap && lerna exec --no-sort --concurrency 1 -- node ../../bin/link",
// "prepublish": "npm run build",
// "pretest:bench": "karma start test/karma/karma.bench.conf.js --log-level debug",
// "test:bench": "node test/karma/bench.js",
// "test:browser": "karma start test/karma/karma.unit.conf.js --log-level debug",
// "test:publish": "coveralls < coverage/lcov.info && rimraf coverage",
// "test:quick": "cross-env mocha",
// "tsc:dev": "lerna exec --no-sort --concurrency `ls -d packages/* | wc -l` -- tsc -w",
// "test:server": "cross-env nyc mocha",
// "test": "npm run lint && npm run build && npm run test:browser && npm run test:server",
// "uninstall": "rm -rf node_modules && lerna exec -- rm -rf node_modules"


// save as preset
// -> write file (json)
// -> read file
// -> add to argv (before processing)
// -> commander to run commander?














program
  .version(pkg.version)
  .command('[apps]')
  .option('-c, --clean', 'runs clean')
  .option('-t, --test', 'tests')
  .option('-n, --bench', 'benchmark')
  .option('-p, --production, --prod', 'use production env')
  .option('-d, --development, --dev', 'use development env')
  .option('-l, --lint', 'do linting')
  .option('-s, --server', 'use server')
  .option('-b, --build', 'build packages')
  .action(function(apps, options) {
  })

program
.command('no-name-needed-just-flags')
.option('-c, --clean', 'runs clean')
.option('-t, --test', 'tests')
.option('-n, --bench', 'benchmark')
.option('-p, --production, --prod', 'use production env')
.option('-d, --development, --dev', 'use development env')
.option('-l, --lint', 'do linting')
.option('-s, --server', 'use server')
.option('-b, --build', 'build packages')
.action(function(apps, options) {
})

// https:// github.com/tj/commander.js/#custom-help
program.on('--help', () => {
  execSyncStd(`node ${__dirname + '/flip.js'} no-name-needed-just-flags --help`)
  execSyncStd(`node ${__dirname + '/flip.js'} clean --help`)
  execSyncStd(`node ${__dirname + '/flip.js'} bench --help`)
  execSyncStd(`node ${__dirname + '/flip.js'} test --help`)
  execSyncStd(`node ${__dirname + '/flip.js'} build --help`)
  execSyncStd(`node ${__dirname + '/flip.js'} lint --help`)
  execSyncStd(`node ${__dirname + '/flip.js'} preset --help`)
  execSyncStd(`node ${__dirname + '/flip.js'} make-preset --help`)
})


// @TODO: extract flags elsewhere?

program
  //  [apps]
  .command('clean')
  .option('-p, --purge', 'removes node modules')
  .option('-r, --reinstall', 'reinstall')
  .action(function(options) {
    runScriptFor('rfimraf', 'coverage/ packages/*/dist*/')
    if (options.purge) {
      runScriptFor('rimraf', 'node_modules')
    }
    if (options.reinstall) {
      execSyncStd('npm i')
    }
  })

program
.command('bench [apps]')
.action(function(apps, options) {
  const scoped = scope(apps)
  let env = ''
  if (scoped) {
    apps = globFlag('inferno', apps)
    const globbed = `BENCHMARK_GLOB="packages/${apps}/__benchmarks__/**/*.js*"`

    // console.log(globbed);
    try {
      // execSyncStd('node test/karma/bench.js');
			// execSyncStd('node test/karma/bench.js');
    } catch (e) {
      console.log(e)
    }
    // return execSyncStd(process.env.NODE + ' test/karma/bench.js ');
    // return execSyncStd(globbed + ' node test/karma/bench.js ');
    return execSyncStd(globbed + ' npm run test:bench ')
  }
	// execSyncStd('node test/karma/bench.js');
	// execSyncStd('npm run test:bench');
  // packages/*/__benchmarks__/**/*.js*
})

program
  .command('test [apps]')
  .option('-b, --browsers', 'browser')
  .option('-C, --chrome', 'karma.Chrome')
  .option('-I, --ie', 'karma.IE')
  .option('-F, --ff', 'karma.firefox')
  .option('-k, --karma', 'karma')
  .option('-q, --quick', 'test quick')
  .option('-f, --filter, --apps', 'filter / apps to use')
  .option('-s, --server, --server', 'use the server tests')
  .option('-c, --coverage, --publish, --coveralls', 'test the coverage for publish with coveralls')
  .action(function(apps, options) {
    const {karma, chrome, ie, ff, quick, filter, server, coverage} = options
    let {browsers} = options
    const hasBrowsers = (ff || chrome || ie)
    if (!browsers && hasBrowsers) {
      browsers = ``
      if (ff) browsers += 'FireFox,'
      if (ie) browsers += 'IE,'
      if (chrome) browsers += 'Chrome,'
      browsers = browsers.slice(0, browsers.length - 1)
    }

    const scoped = scope(apps)
    let env = ''
    if (scoped) {
      apps = globFlag('inferno', apps)
      const globbed = `PKG_FILTER="${apps}" `
      env = globbed
    }



    if (browsers) {
      browsers.split(',').forEach(browser => {
        execSyncStd(env + 'npm run karma:' + browser.toLowerCase())
        // runScriptFor('karma', 'start test/karma/karma.unit.conf.js --browsers=' + browsers)
      })
    }
    else if (karma) {
      execSyncStd(env + 'npm run karma:all')
    }
    if (quick) {
      execSyncStd(env + 'npm run test:quick')
    }
    if (server) {
      // runScriptFor('cross-env', 'nyc mocha');
      // runScriptFor('nyc', binFor('mocha'));
      execSyncStd(env + 'npm run test:server')
    }
    if (coverage) {
      execSyncStd(env + 'npm run test:publish')
      // runScriptFor('coveralls', '< coverage/lcov.info');
      // runScriptFor('rimraf', 'rimraf coverage');
    }

	// const s = scope(apps);
	// execSyncStd(`${lerna} exec ${ll} ${scope} -- ${lexec}`);
  })

program
.command('browser [apps]')
.action(function(apps, options) {
  runScriptFor('webpack-dev-server', '--config config/webpack.dev.conf.js')
})

program
.command('lint')
.option('-j, --js, --javascript', 'lint js')
.option('-t, --ts, --typescript', 'lint ts')
.action(function(options) {
  const {javascript, typescript} = options
  if (javascript)
    execSyncStd('npm run lint:js')
  if (typescript)
    execSyncStd('npm run lint:ts')
})

program
  .command('build [apps]')
  .option('-b, --browser', 'build for browser')
  .option('-p, --prod, --production', 'build for prod')
  .option('-d, --dev, --development', 'build for dev')
  .option('-l, --log', 'log output')
  // .option('-s, --scope', 'scope for packages')
  .action(function(name, options) {
    const tsc = lernaExec('tsc')
    const rollup = '../../bin/rollup'
    const named = name || options.scope
    const scoped = scope(named)
    // const lernad = 'lerna'
    const lernad = lerna

    // console.log(pkg)
    const tmpScripts = {
      ['flip:lerna:scoped:prod:' + named]: `${prod_env} ${lernad} exec ${lernaLog} ${scoped} -- node ${rollup}`,
      ['flip:lerna:scoped:dev:' + named]: `${browser_env} ${lernad} exec ${lernaLog} ${scoped} -- node ${rollup}`,
      ['flip:lerna:scoped:browser:' + named]: `${dev_env} ${lernad} exec ${lernaLog} ${scoped} -- node ${rollup}`,
    }
    pkg.scripts = Object.assign(pkg.scripts, tmpScripts)
    execSyncStd(`${lerna} exec ${lernaLog} ${scoped} -- ${tsc}`)
    Object.values(tmpScripts).forEach(script => {
      execSyncStd(script)
    })


    // console.log(pkg.scripts)
    // updatePkg(pkg)
    // execSyncStd(one)
    // execSyncStd(two)
    // const args = {stdio: 'inherit'}
    // lernaLog += ' --concurrency=1'
    // spawnSync(lerna, [
    //   'exec',
    //   lernaLog,
    //   scoped,
    //   '--',
    //   tsc,
    // ].filter(flag => flag), {stdio: 'inherit', env: process.env})
    //
    // if (options.prod) {
    //   process.env.NODE_ENV = 'production'
    //   spawnSync(lerna, [
    //     'exec',
    //     lernaLog,
    //     scoped,
    //     '--',
    //     rollup,
    //   ].filter(flag => flag), {stdio: 'inherit', env: process.env})
    // }
    // if (options.dev) {
    //   process.env.NODE_ENV = 'development'
    //   spawnSync(lerna, [
    //     'exec',
    //     lernaLog,
    //     scoped,
    //     '--',
    //     rollup,
    //   ].filter(flag => flag), {stdio: 'inherit', env: process.env})
    // }
    // if (options.browser) {
    //   process.env.NODE_ENV = 'browser'
    //   spawnSync(lerna, [
    //     'exec',
    //     lernaLog,
    //     scoped,
    //     '--',
    //     rollup,
    //   ].filter(flag => flag), {stdio: 'inherit', env: process.env})
    // }


    // execSyncStd(`${lerna} exec ${lernaLog} ${scoped} -- ${tsc}`)
    // if (options.browser)
    //   execSyncStd(`${browser_env} ${lerna} exec ${lernaLog} ${scoped} -- ${rollup}`)
    // spawned = execSyncStd(`${prod_env} ${lerna} exec ${lernaLog} ${scoped} -- ${rollup}`)

    // try {
    //   // if (options.prod)
    //   //   execSyncStd(`${prod_env} ${lerna} exec ${scoped} -- ${rollup}`)
    //   // if (options.dev)
    //   //   execSyncStd(`${dev_env} ${lerna} exec ${lernaLog} ${scoped} -- ${rollup}`)
    //
    //   console.log(spawned)
    // } catch (e) {
    //   console.log(e)
    // }
    // console.log(`${lerna} exec ${lernaLog} ${scoped} -- ${tsc}`)
    // console.log([
    //   'exec',
    //   lernaLog,
    //   scoped,
    //   '--',
    //   tsc,
    // ])

    //  exec --scope="inferno" ../../node_modules/.bin/tsc`);
	  //  execSyncStd('npm run build:packages -- --scope="inferno"');
    //  lerna exec -- ../../node_modules/.bin/tsc
  })

program
  .command('preset [name]')
  .action(function(name, options) {
    const preset = tryJSON(read('./.fliphub/' + name + '.json'))
    console.log(preset)
  })


const inquirer = require('inquirer')
function checkboxPresets(name, apps, options) {
  const choices = {
    view: [
      new inquirer.Separator(' ==== Testing ==== '),
      new inquirer.Separator(' => Server (server with jsdom)'),
      // ...
      {
        name: 'mocha',
        value: 'test.mocha',
        checked: true,
      },
      {
        name: 'chrome',
        value: 'test.browser.chrome',
        checked: true,
      },
      {
        name: 'firefox',
        value: 'test.browser.firefox',
        checked: true,
      },
      {
        name: 'ie',
        value: 'test.browser.ie',
        checked: true,
      },
      new inquirer.Separator(' => Browser '),
      {
        name: 'dev server (webpack dev server)',
        value: 'test.browser.devserver',
        checked: false,
      },
			// {
			// 	name: 'karma (browsers with jsdom)',
			// 	value: 'karma',
			// 	checked: true,
			// },
      new inquirer.Separator(' = Bench = '),
      // @TODO: make this toggle automatically?
      {
        name: 'before tests',
        value: 'bench.before',
        checked: false,
				// disabled: true,
      },
      {
        name: 'after tests',
        value: 'bench.after',
        checked: true,
      },

      // before each test? needs thought...
      new inquirer.Separator(' = Build (before tests) = '),
      {
        name: 'production',
        value: 'build.production',
        checked: true,
      },
      {
        name: 'development',
        value: 'build.development',
        checked: true,
      },
      {
        name: 'browser',
        value: 'build.browser',
        checked: true,
      },
      new inquirer.Separator(' = Cleaning (before tests) = '),
      {
        name: 'dists (clean built before tests)',
        value: 'clean.node_modules',
        checked: false,
      },
      {
        name: 'node_modules',
        value: 'clean.node_modules',
        checked: false,
      },
      {
        name: 'uninstall (all packages node_modules)',
        value: 'clean.uninstall',
        checked: false,
      },
      {
        name: 'reinstall',
        value: 'clean.reinstall',
        checked: false,

        // @TODO:
        when: (answers) => {
          answers['clean.uninstall'] !== false
        },
      },

      new inquirer.Separator(' = Lint = '),
      // @TODO: make this toggle automatically?
      {
        name: 'js',
        value: 'lint.js',
        checked: false,
      },
      {
        name: 'ts',
        value: 'lint.ts',
        checked: false,
      },
    ],
  }

  const steps = [
    {
      type: 'checkbox',
      name: 'presets',
      message: 'options:',
      choices: choices.view,
      default: false,
    },
  ]
  inquirer.prompt(steps).then(answers => {
    answers.name = name
    answers.apps = apps
    const preset = JSON.stringify(answers, null, 2)
    console.log(preset)
    write('./.fliphub/' + name + '.json', preset)
  })
}

function interactivePresets(name, options) {}

program
  .command('make-preset [name] [apps]')
  .option('-c, --checkbox', '(default) use checkbox mode')
  .option('-i, --interactive', 'use interactive mode')
  .action(function(name, apps, opts) {
    addTogithugnore('.fliphub')
    if (opts.interactive) {
      return interactivePresets(name, apps, opts)
    }
    checkboxPresets(name, apps, opts)
  })

program.parse(process.argv)