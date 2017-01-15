'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * React component for Vimeo Loading Spinner created and rendered.
 * SVG Path is used for creating the spinner.
 */
exports.default = _react2.default.createClass({
  displayName: 'Spinner',

  render: function render() {
    return _react2.default.createElement(
      'div',
      { className: 'vimeo-loading' },
      _react2.default.createElement(
        'svg',
        {
          height: '32',
          viewBox: '0 0 32 32',
          width: '32',
          xmlns: 'http://www.w3.org/2000/svg' },
        _react2.default.createElement('path', {
          d: 'M16 0 A16 16 0 0 0 16 32 A16 16 0 0 0 16 0 M16 4 A12 12 0 0 1 16 28 A12 12 0 0 1 16 4',
          opacity: '.25' }),
        _react2.default.createElement('path', { d: 'M16 0 A16 16 0 0 1 32 16 L28 16 A12 12 0 0 0 16 4z' })
      )
    );
  }
}); /* eslint-disable max-len */

module.exports = exports['default'];