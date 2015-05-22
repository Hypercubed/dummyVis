(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'd3', 'model'], factory);
  } else if (typeof exports !== 'undefined') {
    factory(exports, require('d3'), require('model'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.d3, global.Model);
    global.dummyVis = mod.exports;
  }
})(this, function (exports, _d3, _model) {
  // This module implements a dummy visualization that is intended
  // to show how to create a simple Chiasm plugin using D3.
  //
  // Draws from previous work found at
  // https://github.com/curran/phd/blob/gh-pages/prototype/src/dummyVis.js
  // https://github.com/curran/model-contrib/blob/gh-pages/modules/dummyVis.js
  //
  // Created by Curran Kelleher May 2015

  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });

  var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

  var _d32 = _interopRequire(_d3);

  var _Model2 = _interopRequire(_model);

  var __useDefault = true;

  exports.__useDefault = __useDefault;

  var DummyViz = (function (_Model) {
    function DummyViz(chiasm) {
      _classCallCheck(this, DummyViz);

      _get(Object.getPrototypeOf(DummyViz.prototype), 'constructor', this).call(this, {
        publicProperties: [
        // The background color, a CSS color string.
        'color',

        // The string that gets displayed in the center of the box.
        'text',

        // The width in pixels of lines for the X.
        'lineWidth',

        // The relative size of this component, used by the layout plugin.
        'size'],

        color: 'white',
        text: '',
        lineWidth: 8,
        size: 1
      });

      if (!(this instanceof DummyViz)) {
        return new DummyViz(chiasm);
      }

      var model = this;

      // Append an SVG to the chiasm container.
      // Use CSS `position: absolute;` so setting `left` and `top` CSS
      // properties later will position the SVG relative to containing div.

      // TODO refactor the Chiasm layout plugin such that it creates a DIV for each
      // component and sets that as model.container.
      var svg = _d32.select(chiasm.container).append('svg').style('position', 'absolute');

      // Add a background rectangle to the SVG.
      // The location of the rect will be fixed at (0, 0)
      // with respect to the containing SVG.
      var rect = svg.append('rect').attr('x', 0).attr('y', 0);

      // Add a text element to the SVG,
      // which will render the `text` model property.
      var text = svg.append('text').attr('font-size', '7em').attr('text-anchor', 'middle').attr('alignment-baseline', 'middle');

      // Make the X lines draggable. This shows how to add
      // interaction to visualization modules.
      var lineDrag = (function () {
        var x1, x2;
        return _d32.behavior.drag().on('dragstart', function (d) {
          x1 = _d32.event.sourceEvent.pageX;
        }).on('drag', function (d) {
          var x2 = _d32.event.sourceEvent.pageX,
              newLineWidth = model.lineWidth + x2 - x1;
          newLineWidth = newLineWidth < 1 ? 1 : newLineWidth;

          // dragging updates the `lineWidth` model property,
          // which is visible to other visualizations in the chiasm.
          model.lineWidth = newLineWidth;
          x1 = x2;
        });
      })();

      // Update the color and text based on the model.
      model.when('color', function (color) {
        return rect.attr('fill', color);
      });

      // Update the text based on the model.
      model.when('text', text.text, text);

      // When the size of the visualization is set
      // by the chiasm layout engine,
      // TODO refactor Chiasm layout plugin to use containerWidth and containerHeight
      // rather than box, so width and height changes can be handled independently.
      model.when('box', function (box) {

        // Set the CSS `left` and `top` properties to move the
        // SVG to `(box.x, box.y)` relative to its container.
        svg.style('left', box.x + 'px').style('top', box.y + 'px');

        // Set the size of the SVG and background rect.
        svg.attr('width', box.width).attr('height', box.height);

        rect.attr('width', box.width).attr('height', box.height);

        // Update the text label to be centered.
        text.attr('x', box.width / 2).attr('y', box.height / 2);
      });

      // Update the X lines whenever either
      // the `box` or `lineWidth` model properties change.
      model.when(['box', 'lineWidth'], function (box, lineWidth) {
        var w = box.width,
            h = box.height,
            lines = svg.selectAll('line').data([{ x1: 0, y1: 0, x2: w, y2: h }, { x1: 0, y1: h, x2: w, y2: 0 }]);
        lines.enter().append('line');
        lines.attr('x1', function (d) {
          return d.x1;
        }).attr('y1', function (d) {
          return d.y1;
        }).attr('x2', function (d) {
          return d.x2;
        }).attr('y2', function (d) {
          return d.y2;
        }).style('stroke-width', lineWidth).style('stroke-opacity', 0.2).style('stroke', 'black').call(lineDrag);
      });

      // Clean up the DOM elements when the component is destroyed.
      model.destroy = function () {
        chiasm.container.removeChild(svg.node());
      };
    }

    _inherits(DummyViz, _Model);

    return DummyViz;
  })(_Model2);

  exports['default'] = DummyViz;
});

//# sourceMappingURL=dummyVis.js.map