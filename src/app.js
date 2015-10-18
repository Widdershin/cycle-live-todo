import {Rx} from '@cycle/core';
import {h} from '@cycle/dom';

export default function main ({DOM}) {
  return {
    DOM: Rx.Observable.just(h('.hi', 'Hello world'))
  };
}

