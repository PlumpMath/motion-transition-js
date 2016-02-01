import React from "react";
import { Motion, spring } from "react-motion";
import { fromJS, Map, is } from "immutable";
import Promise from "bluebird";

function construct(promise) {
  promise.run = (t) =>
    construct.call(this, promise.then(() => this.run(t)));
  promise.runAll = (t) =>
    construct.call(this, promise.then(() => this.runAll(t)));
  promise.wait = (del) =>
    construct.call(this, Promise.delay(del));
  promise.complete = () => {
    this.setState({ __transitioning: false });
    return promise;
  };
  return promise;
}

function queue(state, [path, val, config]) {
  return state.setIn(["end", path], spring(val, config))
              .setIn(["next", path], val);
}

function batch(state, transitions) {
  return transitions.reduce(queue, state.transitions);
}

function setupTransitions(values) {
  return { transitions: fromJS({ start: values, end: values, next: values }) };
}

export default React.createClass({
  getDefaultProps() {
    return {
      enter: (transition) => transition.complete(),
      leave: (transition) => transition.complete(),
      transitions: {}
    };
  },
  runAll(allTransitions) {
    let transitions = batch(this.state, allTransitions);
    let next = () => this.setState({ transitions });
    let promise = Promise.resolve().then(next);
    promise.__transitions = transitions;
    return construct.call(this, promise);
  },
  run(t) {
    return this.runAll([t]);
  },
  getTransitions() {
    return this.state.transitions.toJS();
  },
  getInitialState() {
    let { transitions } = setupTransitions(this.props.transitions);
    return { transitions, shouldDisplay: false, __transitioning: false };
  },
  componentDidMount() {
    if (this.props.visible) {
      this.setState({ shouldDisplay: true });
      this.props.enter(construct.call(this, Promise.resolve()));
    }
  },
  reset() {
    this.setState({ shouldDisplay: false });
  },
  componentWillReceiveProps({ enter, leave, visible }) {
    if (this.props.visible === visible) return null;
    this.setState({ __transitioning: true });
    if (visible) {
      this.setState({
        shouldDisplay: true,
        ...setupTransitions(this.props.transitions)
      });
      return enter(construct.call(this, Promise.resolve()));
    }
    return leave(construct.call(this, Promise.resolve())).then(this.reset);
  },
  render() {
    let { start, end, next } = this.getTransitions();
    let { shouldDisplay, __transitioning } = this.state;
    let display = !shouldDisplay && !__transitioning;
    return <Motion defaultStyle={start} style={end}>
       {(t) => {
         if (is(Map(next), Map(t)) && display) return null;
         return this.props.children(t);
        }}
      </Motion>;
  }
});
