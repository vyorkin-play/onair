import Cycle from '@cycle/core';
import CycleDOM, { makeDOMDriver } from '@cycle/dom';
import CycleHTTPDriver, { makeHTTPDriver } from '@cycle/http';

import bmi from './bmi';
import onAir from './onAir';

import styles from './index.css';

const drivers = {
  DOM: makeDOMDriver('#app'),
  HTTP: makeHTTPDriver()
};

Cycle.run(onAir, drivers);
