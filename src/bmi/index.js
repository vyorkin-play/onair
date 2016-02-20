import Rx from 'rx';
import Cycle from '@cycle/core';
import CycleDOM, {
  h,
  div,
  input,
  label,
  button
} from '@cycle/dom';

import Slider from '../components/slider';
import styles from './styles';

function style(name) {
  const className = styles[name];
  return `.${className}`;
}

export default function(sources) {
  return Slider({
    ...sources,
    props: Rx.Observable.of({
      label: 'test',
      unit: '%',
      min: 0,
      max: 100,
      init: 50
    })
  });
}
