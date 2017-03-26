const path = require('path')
const rooter = require('mono-root')
const timer = require('fliptime')
const is = require('izz')
const resolveObj = require('./resolveObj')
const resolveProps = require('./resolveProps')
const resolveArr = require('./resolveArr')

let instances = {}
let instance
class Resolver {
  static init(root) {
    if (instance) return instance
    timer.start('resolver')
    instance = new Resolver(root).fn()
    instance.setRoot(root)
    instance.scoped = Resolver.scoped
    timer.stop('resolver')
    return instance
  }
  constructor(root) {
    this.root = root
  }

  debug() {
    const log = require('fliplog')
    log
      .tags('resolve')
      .text('Resolver debug: ')
      .data(this)
      .verbose(true)
      .echo()
    timer.log('resolver')
  }

  // called if they need to change the root path explicitly
  // and it will be by ref on this Resolver instance
  setRoot(root) {
    if (is.obj(root)) this.root = rooter(root)
    else if (is.num(root)) this.root = rooter({depth: root})
    else if (root) this.root = root
    if (!this.root) this.root = rooter()
    // log.data(root, this.root, is.obj(root), is.num(root)).echo()

    instance.root = this.root
    return this
  }

  static scoped(named, root) {
    instances[named] = new Resolver(root).fn(named)
    instances[named].named = named
    instances[named] = instances[named]
    instances[named].scoped = Resolver.scoped
    return instances[named]
  }

  fn(named = false) {
    let self = instance
    if (named !== false && instances[named]) {
      self = instances[named]
    }

    // create
    const resolve = (paths) => {
      // handle root resolving only if needed
      // as it is expensive
      if (!self.root) self.root = rooter()
      return path.resolve(self.root, paths)
    }
    const resolver = (paths) => {
      if (!paths) return paths
      if (typeof paths !== 'string') {
        if (Array.isArray(paths)) return resolver.obj(paths)
        if (typeof paths === 'object') return resolver.obj(paths)
      }

      if (!paths || path.isAbsolute(paths)) return paths
      return resolve(paths)
    }

    // decorate
    resolver.resolveTo = (paths, dir) => path.resolve(dir, paths)
    resolver.resolve = resolve

    // bind this resolver as the first arg
    resolver.arr = resolveArr.bind(this, resolver)
    resolver.obj = resolveObj.bind(this, resolver)
    resolver.forKeys = resolveProps.bind(this, resolver)
    resolver.forProps = resolver.forKeys
    resolver.debug = this.debug
    resolver.setRoot = this.setRoot
    return resolver
  }
}

const resolver = Resolver.init()

module.exports = resolver