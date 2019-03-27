"use strict";

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = WidthProvider;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactDom = require("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
 * A simple HOC that provides facility for listening to container resizes.
 */
function WidthProvider(ComposedComponent) {
  var _class, _temp2;

  return _temp2 = _class = function (_React$Component) {
    _inherits(WidthProvider, _React$Component);

    function WidthProvider() {
      var _temp, _this, _ret;

      _classCallCheck(this, WidthProvider);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.state = {
        width: 1280,
        viewportWidth: 1280
      }, _this.mounted = false, _this.iframe = null, _this.onIframeResize = function (_event) {
        if (!_this.mounted) return;
        var node = _reactDom2.default.findDOMNode(_this); // Flow casts this to Text | Element
        if (node instanceof HTMLElement) {
          _this.setState({ width: _this.iframe.offsetWidth });
        }
        if (_this.props.breakpointFromViewport && typeof window !== "undefined") {
          _this.setState({ viewportWidth: window.innerWidth });
        }
      }, _this.saveIframe = function (iframe) {
        _this.iframe = iframe;
      }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    WidthProvider.prototype.componentDidMount = function componentDidMount() {
      this.mounted = true;

      this.iframe.contentWindow.addEventListener("resize", this.onIframeResize);
      // Call to properly set the breakpoint and resize the elements.
      // Note that if you're doing a full-width element, this can get a little wonky if a scrollbar
      // appears because of the grid. In that case, fire your own resize event, or set `overflow: scroll` on your body.
      this.onIframeResize();
    };

    WidthProvider.prototype.componentWillUnmount = function componentWillUnmount() {
      this.mounted = false;
      this.iframe.contentWindow.removeEventListener("resize", this.onIframeResize);
    };

    WidthProvider.prototype.render = function render() {
      var _props = this.props,
          measureBeforeMount = _props.measureBeforeMount,
          rest = _objectWithoutProperties(_props, ["measureBeforeMount"]);

      if (measureBeforeMount && !this.mounted) {
        return _react2.default.createElement("div", { className: this.props.className, style: this.props.style });
      }

      return _react2.default.createElement(
        "span",
        null,
        _react2.default.createElement("iframe", {
          ref: this.saveIframe,
          style: {
            height: 0,
            margin: 0,
            padding: 0,
            opacity: 0,
            overflow: "hidden",
            borderWidth: 0,
            position: "absolute",
            backgroundColor: "transparent",
            width: "100%"
          }
        }),
        _react2.default.createElement(ComposedComponent, _extends({}, rest, this.state))
      );
    };

    return WidthProvider;
  }(_react2.default.Component), _class.defaultProps = {
    measureBeforeMount: false,
    breakpointFromViewport: false
  }, _class.propTypes = {
    // If true, will not render children until mounted. Useful for getting the exact width before
    // rendering, to prevent any unsightly resizing.
    measureBeforeMount: _propTypes2.default.bool,
    breakpointFromViewport: _propTypes2.default.bool
  }, _temp2;
}