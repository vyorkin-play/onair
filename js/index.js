import Cycle from '@cycle/core';
import CycleDOM, {
  h,
  h1,
  span,
  label,
  input,
  hr,
  div,
  makeDOMDriver
} from '@cycle/dom';

import Rx from 'rx';
import styles from './index.css';

function main(sources) {
  const inputEv$ = sources.DOM.select('.field').events('input');
  const name$ = inputEv$.map(ev => ev.target.value).startWith('');

  return {
    DOM: name$.map(name =>
      div([
        label('Name:'),
        input('.field', { type: 'text' }),
        hr(),
        h1(name)
      ])
    )
  };
}

const drivers = {
  DOM: makeDOMDriver('#app')
};

Cycle.run(main, drivers);
