import {Rx} from '@cycle/core';
import {h} from '@cycle/dom';

import TimeTravel from 'cycle-time-travel';

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

function addTodo (todo) {
  return (todos) => {
    return todos.concat([{todo, complete: false}]);
  };
}

export default function main ({DOM}) {
  const newTodoText$ = DOM
    .select('.new-todo')
    .events('input')
    .map(event => event.target.value);

  const addTodo$ = DOM
    .select('.add-todo')
    .events('click')
    .withLatestFrom(newTodoText$, (_, todoText) => addTodo(todoText));

  const startingTodos = [
    {todo: 'Display todos', complete: true},
    {todo: 'Add todos', complete: false}
  ];

  const action$ = addTodo$;

  const todos$ = action$
    .startWith(startingTodos)
    .scan((todos, action) => action(todos));

  const timeTravel = TimeTravel(DOM, [
    {stream: todos$, label: 'todos$', feature: true},
    {stream: addTodo$, label: 'addTodo$'},
    {stream: newTodoText$, label: 'newTodoText$'}
  ]);

  const view$ = timeTravel.timeTravel.todos$.map(todoAppView);

  return {
    DOM: Rx.Observable.combineLatest(view$, timeTravel.DOM,
      (...vtrees) => h('div', vtrees)
    )
  };
}

