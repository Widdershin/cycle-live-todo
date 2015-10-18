import {Rx} from '@cycle/core';
import {h} from '@cycle/dom';

import TimeTravel from 'cycle-time-travel';

function todoView ({todo, complete}, index) {
  return (
    h('.todo', [
      h('span.title', todo),
      h('input.toggle', {type: 'checkbox', checked: complete, todoId: index})
    ])
  );
}

function todosView (todos) {
  return (
    h('.todos', todos.map(todoView))
  );
}

function todoAppView (todos) {
  const completeCount = todos.filter(todo => todo.complete).length;

  return (
    h('.todo-app', [
      h('.complete-count', `Complete: ${completeCount}`),
      h('input.new-todo'),
      h('button.add-todo', 'Add todo'),
      h('div', [h('button.clear-complete', 'Clear Complete')]),
      todosView(todos)
    ])
  );
}

function addTodo (todo) {
  return (todos) => {
    return todos.concat([{todo, complete: false}]);
  };
}

function toggleTodo ({complete, index}) {
  return (todos) => {
    const newTodos = todos.slice(); // duplicate

    newTodos[index].complete = complete;

    return newTodos;
  };
}

function clearComplete () {
  return (todos) => todos.filter(todo => !todo.complete);
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

  const toggleTodo$ = DOM
    .select('.toggle')
    .events('click')
    .map(event => ({complete: event.target.checked, index: event.target.todoId}))
    .map(toggleTodo);

  const clearComplete$ = DOM
    .select('.clear-complete')
    .events('click')
    .map(clearComplete);

  const startingTodos = [
    {todo: 'Display todos', complete: true},
    {todo: 'Add todos', complete: true},
    {todo: 'Toggle todo', complete: true},
    {todo: 'Clear complete', complete: true},
    {todo: 'Display complete count', complete: false}
  ];

  const action$ = Rx.Observable.merge(
    addTodo$, toggleTodo$, clearComplete$
  );

  const todos$ = action$
    .startWith(startingTodos)
    .scan((todos, action) => action(todos));

  const timeTravel = TimeTravel(DOM, [
    {stream: todos$, label: 'todos$', feature: true},
    {stream: addTodo$, label: 'addTodo$'},
    {stream: newTodoText$, label: 'newTodoText$'},
    {stream: toggleTodo$, label: 'toggleTodo$'},
    {stream: clearComplete$, label: 'clearComplete$'}
  ]);

  const view$ = timeTravel.timeTravel.todos$.map(todoAppView);

  return {
    DOM: Rx.Observable.combineLatest(view$, timeTravel.DOM,
      (...vtrees) => h('div', vtrees)
    )
  };
}

