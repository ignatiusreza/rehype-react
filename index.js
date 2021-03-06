'use strict'

var toH = require('hast-to-hyperscript')
var tableCellStyle = require('@mapbox/hast-util-table-cell-style')

module.exports = rehypeReact

var own = {}.hasOwnProperty

// Add a React compiler.
function rehypeReact(options) {
  var settings = options || {}
  var createElement = settings.createElement

  this.Compiler = compiler

  function compiler(node) {
    var result = toH(h, tableCellStyle(node), settings.prefix)

    if (node.type === 'root') {
      // Invert <https://github.com/syntax-tree/hast-to-hyperscript/blob/d227372/index.js#L46-L56>.
      result =
        result.type === 'div' &&
        (node.children.length !== 1 || node.children[0].type !== 'element')
          ? result.props.children
          : [result]

      return createElement(settings.Fragment || 'div', {}, result)
    }

    return result
  }

  // Wrap `createElement` to pass components in.
  function h(name, props, children) {
    var component = name

    if (settings.components && own.call(settings.components, name)) {
      component = settings.components[name]

      if (settings.passNode) {
        props.node = this
      }
    }

    return createElement(component, props, children)
  }
}
