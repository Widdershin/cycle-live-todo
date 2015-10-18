import {Rx} from '@cycle/core';
import {h} from '@cycle/dom';

function todoView ({todo, complete}) {
  return (
    h('.todo', [
      h('span.title', todo),
      h('input.complete', {type: 'checkbox', checked: complete})
    ])
  );
}

function todosView (todos) {
  return (
    h('.todos', todos.map(todoView))
  );
}

export default function main ({DOM}) {
  const todos$ = Rx.Observable.just([
    {todo: 'Display todos', complete: true},
    {todo: 'Add todos', complete: false}
  ]);

  return {
    DOM: todos$.map(todosView)
  };
}

