'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _keymirror = require('keymirror');

var _keymirror2 = _interopRequireDefault(_keymirror);

var _jsonp = require('jsonp');

var _jsonp2 = _interopRequireDefault(_jsonp);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _PlayButton = require('./Play-Button');

var _PlayButton2 = _interopRequireDefault(_PlayButton);

var _Spinner = require('./Spinner');

var _Spinner2 = _interopRequireDefault(_Spinner);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = (0, _debug2.default)('vimeo:player');
var noop = function noop() {};
var playerEvents = (0, _keymirror2.default)({
  cueChange: null,
  ended: null,
  loaded: null,
  pause: null,
  play: null,
  progress: null,
  seeked: null,
  textTrackChange: null,
  timeUpdate: null,
  volumeChange: null
});

function capitalize() {
  var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  return str.charAt(0).toUpperCase() + str.substring(1);
}

function getFuncForEvent(event, props) {
  return props['on' + capitalize(event)] || function () {};
}

function post(method, value, player, playerOrigin) {
  try {
    player.contentWindow.postMessage({ method: method, value: value }, playerOrigin);
  } catch (err) {
    return err;
  }
  return null;
}

exports.default = _react2.default.createClass({
  displayName: 'Vimeo',

  propTypes: {
    autoplay: _react.PropTypes.bool,
    className: _react.PropTypes.string,
    loading: _react.PropTypes.element,
    playButton: _react.PropTypes.node,
    playerOptions: _react.PropTypes.object,
    videoId: _react.PropTypes.string.isRequired,
    thumbnail: _react.PropTypes.string,
    hideOnStop: _react.PropTypes.bool,

    // event callbacks
    onCueChange: _react.PropTypes.func,
    onEnded: _react.PropTypes.func,
    onError: _react.PropTypes.func,
    onLoaded: _react.PropTypes.func,
    onPause: _react.PropTypes.func,
    onPlay: _react.PropTypes.func,
    onProgress: _react.PropTypes.func,
    onReady: _react.PropTypes.func,
    onSeeked: _react.PropTypes.func,
    onTextTrackChanged: _react.PropTypes.func,
    onTimeUpdate: _react.PropTypes.func,
    onVolumeChange: _react.PropTypes.func
  },

  getDefaultProps: function getDefaultProps() {
    var defaults = Object.keys(playerEvents).concat(['ready']).reduce(function (defaults, event) {
      defaults['on' + capitalize(event)] = noop;
      return defaults;
    }, {});

    defaults.className = 'vimeo';
    defaults.playerOptions = { autoplay: 1 };
    defaults.autoplay = false;
    return defaults;
  },
  getInitialState: function getInitialState() {
    var thumb = (this.props.thumbnail != undefined)? this.props.thumbnail: null;
    var hasThumb = (thumb != null);
    return {
      imageLoaded: hasThumb,
      playerOrigin: '*',
      showingVideo: this.props.autoplay,
      thumb: thumb
    };
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    if (nextProps.videoId !== this.props.videoId) {
      var thumb = (this.props.thumbnail != undefined)? this.props.thumbnail: null;
      var hasThumb = (thumb != null);
      this.setState({
        thumb: thumb,
        imageLoaded: hasThumb,
        showingVideo: false
      });
    }
  },
  componentDidMount: function componentDidMount() {
    this.fetchVimeoData();
  },
  componentDidUpdate: function componentDidUpdate() {
    this.fetchVimeoData();
  },
  componentWillUnmount: function componentWillUnmount() {
    var _context;

    var removeEventListener = typeof window !== 'undefined' ? (_context = window).removeEventListener.bind(_context) : noop;

    removeEventListener('message', this.onMessage);
  },
  addMessageListener: function addMessageListener() {
    var _context2;

    var addEventListener = typeof window !== 'undefined' ? (_context2 = window).addEventListener.bind(_context2) : noop;

    addEventListener('message', this.onMessage);
  },
  onError: function onError(err) {
    if (this.props.onError) {
      this.props.onError(err);
    }
    throw err;
  },
  onMessage: function onMessage(_ref) {
    var origin = _ref.origin,
        data = _ref.data;
    var onReady = this.props.onReady;
    var playerOrigin = this.state.playerOrigin;


    if (playerOrigin === '*') {
      this.setState({
        playerOrigin: origin
      });
    }

    // Handle messages from the vimeo player only
    if (!/^https?:\/\/player.vimeo.com/.test(origin)) {
      return false;
    }

    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (err) {
        debug('error parsing message', err);
        data = { event: '' };
      }
    }

    if (data.event === 'ready') {
      var player = this.refs.player;

      debug('player ready');
      this.onReady(player, playerOrigin === '*' ? origin : playerOrigin);
      return onReady(data);
    }
    if (data.event === 'ended') {
      debug('player ended');
      this.onEnded();
    }
    if (!data.event) {
      // we get messages when the first event callbacks are added to the frame
      return;
    }
    debug('firing event: ', data.event);
    getFuncForEvent(data.event, this.props)(data);
  },
  onReady: function onReady(player, playerOrigin) {
    var _this = this;

    Object.keys(playerEvents).forEach(function (event) {
      var err = post('addEventListener', event.toLowerCase(), player, playerOrigin);
      if (err) {
        _this.onError(err);
      }
    });
  },
  onEnded: function onEnded() {
    var _this = this;
    if (_this.props.hideOnStop) _this.setState({ showingVideo: false });
  },
  playVideo: function playVideo(e) {
    e.preventDefault();
    this.setState({ showingVideo: true });
  },
  getIframeUrl: function getIframeUrl() {
    var videoId = this.props.videoId;

    var query = this.getIframeUrlQuery();
    return '//player.vimeo.com/video/' + videoId + '?' + query;
  },
  getIframeUrlQuery: function getIframeUrlQuery() {
    var _this2 = this;

    var str = [];
    Object.keys(this.props.playerOptions).forEach(function (key) {
      str.push(key + '=' + _this2.props.playerOptions[key]);
    });

    return str.join('&');
  },
  fetchVimeoData: function fetchVimeoData() {
    var _this3 = this;

    if (this.state.imageLoaded) {
      return;
    }
    var id = this.props.videoId;

    (0, _jsonp2.default)('//vimeo.com/api/v2/video/' + id + '.json', {
      prefix: 'vimeo'
    }, function (err, res) {
      if (err) {
        debug('jsonp err: ', err.message);
        _this3.onError(err);
      }
      debug('jsonp response', res);
      _this3.setState({
        thumb: res[0].thumbnail_large,
        imageLoaded: true
      });
    });
  },
  renderImage: function renderImage() {
    if (this.state.showingVideo || !this.state.imageLoaded) {
      return;
    }

    var style = {
      backgroundImage: 'url(' + this.state.thumb + ')',
      display: !this.state.showingVideo ? 'block' : 'none',
      height: '100%',
      width: '100%'
    };

    var playButton = this.props.playButton ? (0, _react.cloneElement)(this.props.playButton, { onClick: this.playVideo }) : _react2.default.createElement(_PlayButton2.default, { onClick: this.playVideo });

    return _react2.default.createElement(
      'div',
      {
        className: 'vimeo-image',
        style: style },
      playButton
    );
  },
  renderIframe: function renderIframe() {
    if (!this.state.showingVideo) {
      return;
    }

    this.addMessageListener();

    var embedVideoStyle = {
      display: this.state.showingVideo ? 'block' : 'none',
      height: '100%',
      width: '100%'
    };

    return _react2.default.createElement(
      'div',
      {
        className: 'vimeo-embed',
        style: embedVideoStyle },
      _react2.default.createElement('iframe', {
        frameBorder: '0',
        ref: 'player',
        src: this.getIframeUrl() })
    );
  },
  renderLoading: function renderLoading(imageLoaded, loadingElement) {
    if (imageLoaded) {
      return;
    }
    if (loadingElement) {
      return loadingElement;
    }
    return _react2.default.createElement(_Spinner2.default, null);
  },
  render: function render() {
    return _react2.default.createElement(
      'div',
      { className: this.props.className },
      this.renderLoading(this.state.imageLoaded, this.props.loading),
      this.renderImage(),
      this.renderIframe()
    );
  }
});
module.exports = exports['default'];