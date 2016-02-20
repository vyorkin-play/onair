import Cycle from '@cycle/core';
import CycleDOM, {
  h,
  h1,
  span,
  makeDOMDriver
} from '@cycle/dom';

import Rx from 'rx';
import styles from './index.css';

function main(sources) {
  const over$ = sources.DOM.select('span').events('mouseover');
  const sinks = {
    DOM: over$
      .startWith(null)
      .flatMapLatest(() => Rx.Observable.timer(0, 1000).map(i =>
        h1([span([`elapsed: ${i}`])])
      )),
    Log: Rx.Observable.timer(0, 2000).map(i => i * 2)
  };

  return sinks;
}

const consoleLogDriver = text$ =>
  text$.subscribe(t => console.log(t));

const drivers = {
  DOM: makeDOMDriver('#app')
};

Cycle.run(main, drivers);
