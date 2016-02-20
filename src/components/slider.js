import pick from 'lodash/pick';
import Cycle from '@cycle/core';
import CycleDOM, { div, label, input, makeDOMDriver } from '@cycle/dom';

function intent(DOMSource) {
  return DOMSource
      .select('.slider')
      .events('input')
      .map(e => e.target.value);
}

function model(newValue$, props$) {
  const initialValue$ = props$.map(props => props.init).first();
  const value$ = initialValue$.concat(newValue$);

  return Rx.Observable.combineLatest(
    value$,
    props$,
    (value, props) => ({ ...props, value })
  );
}

function view(state$) {
  return state$.map(state =>
    div('.slider', [
      label('.label', `${state.label}: ${state.value} ${state.unit}`),
      input('.input', { type: 'range', ...pick(state, 'min', 'max', 'value') })
    ])
  );
}

export default ({ DOM, props }) => {
  const value$ = intent(DOM);
  const state$ = model(value$, props);
  const vtree$ = view(state$);

  return { DOM: vtree$ };
}
