#!/usr/bin/env node
var spawnSync = require('child_process').spawnSync
var fs = require('fs')
var mustache = require('mustache')
var path = require('path')

var source = fs.readFileSync('polyform.md', 'utf8')

var release = 'release'
try {
  fs.mkdirSync(release)
} catch (error) {
  if (error.code !== 'EEXIST') throw error
}

var variants = {
  '-CL-DL': { CL: true, DL: true },
  '-CL': { CL: true },
  '-DL': { DL: true },
  '-IB': { IB: true },
  '-SB': { SB: true },
  '': {}
}

Object.keys(variants).forEach(function (suffix) {
  var view = variants[suffix]
  var rendered = mustache.render(source, view)
    .replace(/\n+/g, '\n\n')
  var formatted = spawnSync(
    'fmt', [ '--width', '60', '--uniform-spacing' ],
    { input: rendered }
  )
  fs.writeFileSync(
    path.join(release, 'Polyform' + suffix + '.md'),
    formatted.stdout.toString().trim() + '\n'
  )
})
