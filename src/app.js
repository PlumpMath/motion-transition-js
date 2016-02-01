import React from 'react';
import ReactDOM from 'react-dom';
import MotionTransition from 'MotionTransition.js';

let motionProps = {
  transitions: {
    opacity: 0,
    scale: 0.5
  },
  enter(transition) {
    return transition
    .run(["opacity", 1, [800, 20]])
    .wait(200)
    .run(["scale", 1, [800, 20]])
    .complete();
  },
  leave(transition) {
    return transition
    .run(["opacity", 0, [800, 90]])
    .complete();
  }
};

function MotionBox(props) {
  let style = {
    ...props.style,
    background: 'black',
    height: 100,
    width: 100
  };
  return (
    <div style={style}>
    </div>
  );
}

let App = React.createClass({
  getInitialState() {
    return { show: true };
  },
  toggle(e) {
    e.preventDefault();
    this.setState({ show: !this.state.show });
  },
  render() {
    return (
      <div>
        <button onClick={this.toggle}>Toggle</button>
        <MotionTransition {...motionProps} visible={this.state.show}>
          {function(t) {
            let style = {
              opacity: t.opacity,
              transform: `scale(${t.scale})`
            };
            return <MotionBox style={style} />;
          }}
        </MotionTransition>
      </div>
    );
  }
});

ReactDOM.render(<App />, document.getElementById('app'));
