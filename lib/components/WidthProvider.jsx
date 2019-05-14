// @flow
import React from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import type { ComponentType as ReactComponentType } from "react";

type WPProps = {
  className?: string,
  measureBeforeMount: boolean,
  style?: Object,
  breakpointFromViewport: boolean,
  resizeDelay: number
};

type WPState = {
  width: number,
  viewportWidth: number
};

/*
 * A simple HOC that provides facility for listening to container resizes.
 */
export default function WidthProvider<
  Props,
  ComposedProps: { ...Props, ...WPProps }
>(
  ComposedComponent: ReactComponentType<Props>
): ReactComponentType<ComposedProps> {
  class WidthProvider extends React.Component<ComposedProps, WPState> {
    static defaultProps = {
      measureBeforeMount: false,
      breakpointFromViewport: false,
      resizeDelay: 0
    };

    static propTypes = {
      // If true, will not render children until mounted. Useful for getting the exact width before
      // rendering, to prevent any unsightly resizing.
      measureBeforeMount: PropTypes.bool,
      breakpointFromViewport: PropTypes.bool,
      resizeDelay: PropTypes.number
    };

    state = {
      width: 1280,
      viewportWidth: 1280
    };

    mounted: boolean = false;
    resizeTimeout: ?TimeoutID = null;

    componentDidMount() {
      this.mounted = true;

      window.addEventListener('resize', this.onWindowResize);
      // Call to properly set the breakpoint and resize the elements.
      // Note that if you're doing a full-width element, this can get a little wonky if a scrollbar
      // appears because of the grid. In that case, fire your own resize event, or set `overflow: scroll` on your body.
      this.calculateWidth();
    }

    componentWillUnmount() {
      this.mounted = false;
      window.removeEventListener('resize', this.onWindowResize);
    }

    onWindowResize = (_event: ?Event) => {
      const { resizeDelay } = this.props;

      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(() => {
        this.calculateWidth();
      }, resizeDelay);
    };

    calculateWidth = () => {
      if (!this.mounted) return;

      let newState = {};
      const node = ReactDOM.findDOMNode(this); // Flow casts this to Text | Element
      if (node instanceof HTMLElement) {
        newState.width = node.offsetWidth;
      }
      if (this.props.breakpointFromViewport && typeof window !== "undefined") {
        newState.viewportWidth = window.innerWidth;
      }

      if (Object.keys(newState).length)
        this.setState(newState);
    };

    render() {
      const { measureBeforeMount, ...rest } = this.props;
      if (measureBeforeMount && !this.mounted) {
        return (
          <div className={this.props.className} style={this.props.style} />
        );
      }

      return (
        <ComposedComponent {...rest} {...this.state} />
      );
    }
  }

  return React.forwardRef((props, ref) => {
    return <WidthProvider {...props} forwardedRef={ref} />;
  });
}
