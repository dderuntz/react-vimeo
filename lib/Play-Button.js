'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({
  displayName: 'PlayButton',

  propTypes: {
    onClick: _react2.default.PropTypes.func
  },

  render: function render() {
    return _react2.default.createElement(
      'button',
      {
        className: 'vimeo-play-button',
        onClick: this.props.onClick,
        type: 'button' },
      _react2.default.createElement(
        'svg',
        {
          version: '1.1',
          viewBox: '0 0 100 100',
          xmlns: 'http://www.w3.org/2000/svg' },
        _react2.default.createElement('path', { d: 'M79.674,53.719c2.59-2.046,2.59-5.392,0-7.437L22.566,1.053C19.977-0.993,18,0.035,18,3.335v93.331c0,3.3,1.977,4.326,4.566,2.281L79.674,53.719z' })
      )
    );
  }
}); /* eslint-disable max-len */

module.exports = exports['default'];