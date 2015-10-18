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

function todoAppView (todos) {
  return (
    h('.todo-app', [
      h('input.new-todo'),
      h('button.add-todo', 'Add todo'),
      todosView(todos)
    ])
  );
}

export default function main ({DOM}) {
  const todos$ = Rx.Observable.just([
    {todo: 'Display todos', complete: true},
    {todo: 'Add todos', complete: false}
  ]);

  return {
    DOM: todos$.map(todoAppView)
  };
}

