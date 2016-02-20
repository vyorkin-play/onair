import Rx from 'rx';
import styles from './index.css';

function main(sources) {
  const click$ = sources.DOM;
  const sinks = {
    DOM: click$
      .startWith('zalupa')
      .flatMapLatest(() =>
        Rx.Observable.timer(0, 1000).map(i => `tick: ${i}`)
      ),
    Log: Rx.Observable.timer(0, 2000).map(i => i * 2)
  };

  return sinks;
}

function DOMDriver(text$) {
  text$.subscribe(text => {
    const container = document.querySelector('#app');
    container.textContent = text;
  });

  const DOMSource = Rx.Observable.fromEvent(document, 'click');
  return DOMSource;
}

const consoleLogDriver = text$ =>
  text$.subscribe(t => console.log(t));

function run(mainFn, drivers) {
  const proxySources = {};
  Object.keys(drivers).forEach(key => {
    proxySources[key] = new Rx.Subject();
  });

  const sinks = mainFn(proxySources);
  Object.keys(drivers).forEach(key => {
    const source = drivers[key](sinks[key])
    source.subscribe(x => proxySources[key].onNext(x));
  });
}

const drivers = {
  DOM: DOMDriver
};

run(main, drivers);
