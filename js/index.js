import Cycle from '@cycle/core';
import Rx from 'rx';
import styles from './index.css';

function h(tagName, children) {
  return { 
    tagName,
    children
  };
}

function main(sources) {
  const over$ = sources.DOM.selectEvents('span', 'mouseover');
  const sinks = {
    DOM: over$
      .startWith(null)
      .flatMapLatest(() => Rx.Observable.timer(0, 1000).map(i =>
        h('h1', [h('span', [`elapsed: ${i}`])])
      )),
    Log: Rx.Observable.timer(0, 2000).map(i => i * 2)
  };

  return sinks;
}

function makeDOMDriver(mountSelector) {
  return function DOMDriver(obj$) {
    function createElement(element) {
      const { tagName, children } = element;
      const el = document.createElement(tagName);

      children
        .filter(c => typeof c === 'object')
        .map(createElement)
        .forEach(c => el.appendChild(c));

      children
        .filter(c => typeof c === 'string')
        .forEach(s => el.innerHTML += s);

      return el;
    }

    obj$.subscribe(obj => {
      const container = document.querySelector(mountSelector);
      container.innerHTML = '';
      const el = createElement(obj);
      container.appendChild(el);
    });

    const DOMSource = {
      selectEvents: (tagName, eventType) =>
        Rx.Observable
          .fromEvent(document, eventType)
          .filter(e => e.target.tagName === tagName.toUpperCase())
    };

    return DOMSource;
  }
}

const consoleLogDriver = text$ =>
  text$.subscribe(t => console.log(t));

const drivers = {
  DOM: makeDOMDriver('#app')
};

Cycle.run(main, drivers);
