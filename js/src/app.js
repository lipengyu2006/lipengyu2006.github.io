import xs from 'xstream';
import isolate from '@cycle/isolate'
import {run} from '@cycle/run';
import {div, span, a, input, makeDOMDriver} from '@cycle/dom';
import {table, thead, tbody, th, tr, td} from '@cycle/dom';
import {abbr} from '@cycle/dom';
import Item from './Item';

function intent(domSource, itemRemove$) {
  return xs.merge(
    domSource.select('.add-one-item').events('click')
      .mapTo({type: 'ADD_ITEM', payload: 1}),

    itemRemove$.map(id => ({type: 'REMOVE_ITEM', payload: id}))
  );
}

function model(action$, itemFn) {
  const addItemReducer$ = action$
    .filter(a => a.type === 'ADD_ITEM')
    .map(action => {
      const amount = action.payload;
      let newItems = [];
      for (let i=0; i<amount; i++) {
        newItems.push(createNewItem());
      }
      return function addItemReducer(listItems) {
        return listItems.concat(newItems);
      };
    });

  const removeItemReducer$ = action$
    .filter(a => a.type === 'REMOVE_ITEM')
    .map(action => function removeItemReducer(listItems) {
      return listItems.filter(item => item.id !== action.payload)
    });

  let mutableLastId = 0;
  function createNewItem() {
    const id = mutableLastId++;
    const sinks = itemFn(id);
    return {
      id,
      DOM: sinks.DOM,
      Remove: sinks.Remove
    };
  }

  return xs.merge(addItemReducer$, removeItemReducer$).fold((listItems, reducer) => reducer(listItems), []);
}

function view(items$) {
  return items$.map(items => {
    const itemVNodeStreamsByKey = items.map(item => {
      return item.DOM.map(vnode => {
        vnode.key = item.id;
        return vnode;
      })
    });
    return xs.combine(...itemVNodeStreamsByKey)
      .map(vnodes => makeSkeleton(vnodes));
  }).flatten();
}

function main(sources) {
  const proxyItemRemove$ = xs.create();
  const itemWrapper = makeItemWrapper(sources);
  const action$ = intent(sources.DOM, proxyItemRemove$);
  const items$ = model(action$, itemWrapper);
  const itemRemove$ = items$
    .map(items => {
      const itemRemoveStreams = items.map(item => item.Remove);
      return xs.merge(...itemRemoveStreams);
    }).flatten()
  proxyItemRemove$.imitate(itemRemove$);
  const vtree$ = view(items$);
  return {
    DOM: vtree$
  };
}

function makeItemWrapper(sources) {
  return function itemWrapper(id) {
    const item = isolate(Item)({...sources, Props: xs.of({id})});
    return {
      DOM: item.DOM,
      Remove: item.Remove.mapTo(id)
    }
  }
}

function makeSkeleton(listItems) {
  return div('.wrap', [
    a('.button.add-one-item', 'Add'),
    table('.table', [
      thead(tr([
        th(abbr({attrs: {title: 'Position'}}, 'Pos')),
        th('Section'),
        th('Start time'),
        th('End time'),
        th('Duration'),
        th('Operate'),
        th('Content')
      ])),
      tbody(listItems)
    ])
  ]);
}

run(main, {
  DOM: makeDOMDriver('#timerecord')
});