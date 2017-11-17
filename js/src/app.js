import xs from 'xstream';
import isolate from '@cycle/isolate';
import { run } from '@cycle/run';
import onionify, { makeCollection } from 'cycle-onionify';
import { div, span, a, input, makeDOMDriver } from '@cycle/dom';
import { table, thead, tbody, th, tr, td } from '@cycle/dom';
import { abbr, button, p } from '@cycle/dom';
import Item from './Item';
import { getHMS } from './tool';

function intent(domSource) {
  const add$ = domSource
    .select('.add-one-item')
    .events('click')
    .mapTo({ type: 'ADD_ITEM', payload: 1 });

  return add$;
}

function model(action$) {
  let mutableLastId = 0;

  const initReducer$ = xs.of((prev) => {
    return {
      list: []
    };
  });

  const addReducer$ = action$
    .filter(action => action.type === 'ADD_ITEM')
    .map((action) => (prevState) => {
      return {
        list: prevState.list.concat({
          id: mutableLastId++,
          isStop: false,
          startTime: getHMS(),
          endTime: getHMS()
        })
      }
    });

  return xs.merge(initReducer$, addReducer$);
}

function view(listVNode$) {
  return listVNode$.map(listVnode =>
    div('.wrap', [
      a('.button.add-one-item', 'Add'),
      table('.table', [
        thead(tr([
          th(abbr({attrs: {title: 'Position'}}, 'Pos')),
          th('Section'),
          th('Start time'),
          th('End time'),
          th('Duration'),
          th('Status'),
          th('Content')
        ])),
        listVnode
      ])
    ])
  )
}

function main(sources) {
  const List = makeCollection({
    item: Item,
    itemKey: (s, k) => s.id,
    itemScope: (key) => key,
    collectSinks: (instances) => {
      return {
        DOM: instances.pickCombine('DOM')
          .map((itemVNodes) => tbody(itemVNodes)),
        onion: instances.pickMerge('onion')
      };
    }
  });
  const listSinks = isolate(List, 'list')(sources);
  const action$ = intent(sources.DOM);
  const parentReducer$ = model(action$);
  const listReducer$ = listSinks.onion;
  const reducer$ = xs.merge(parentReducer$, listReducer$);
  const vdom$ = view(listSinks.DOM);

  return {
    DOM: vdom$,
    onion: reducer$
  };
}

const wrapperMain = onionify(main);
run(wrapperMain, {
  DOM: makeDOMDriver('#timerecord')
});