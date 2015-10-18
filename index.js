import {run} from '@cycle/core';
import {makeDOMDriver} from '@cycle/dom';

import main from './src/app';

if (module.hot) module.hot.accept();

run(main, {
  DOM: makeDOMDriver('.app')
});
