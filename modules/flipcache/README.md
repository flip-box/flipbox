// random, to easily strip types
// should have a 1 liner babel builder with all deps built in rc config,
// default in out
// babel-core-builder
// ^/node
// /web
//
// babel-core-builder index (outputs, then requires)
// babel-core-builder src out norequire

options {

}


monorepo reinstall


use env to pass configs

temp
  - metadata (in metadata file)
    - (written time)
    - tempfilename (abs)
    - originalfilename (abs) if null, no restoring
    - errored (require calling done)

- restore
- update (or add), use mkdirp
- has changed (fusebox)
- autoremove (timeout...) on sigkill, then restore
- remove