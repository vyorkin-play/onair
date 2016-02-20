import Cycle from '@cycle/core';
import CycleDOM, {
  h,
  div,
  label,
  button,
  p,
  makeDOMDriver
} from '@cycle/dom';

import Rx from 'rx';
import styles from './index.css';

function main(sources) {
  const decClick$ = sources.DOM.select('.dec').events('click');
  const incClick$ = sources.DOM.select('.inc').events('click');

  const incAction$ = incClick$.map(c => +1);
  const decAction$ = decClick$.map(c => -1);

  const number$ = Rx.Observable.of(0)
    .merge(incAction$)
    .merge(decAction$)
    .scan((p, c) => p + c);

  return {
    DOM: number$.map(number =>
      div([
        button('.dec', 'dec'),
        button('.inc', 'inc'),
        p([
          label(String(number))
        ])
      ])
    )
  };
}

const drivers = {
  DOM: makeDOMDriver('#app')
};

Cycle.run(main, drivers);
