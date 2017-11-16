import xs from 'xstream';
import { div, span, a, input } from '@cycle/dom';
import { table, thead, tbody, th, tr, td } from '@cycle/dom';

function intent(domSource) {
  return domSource
    .select('.is-delete')
    .events('click')
    .mapTo({ type: 'REMOVE' })
}

function model(actions$) {
  const deleteReducer$ = actions$
    .filter(action => action.type === 'REMOVE')
    .mapTo(function removeReducer(prevState) {
      return undefined;
    })

  return deleteReducer$;
}

function view(state$) {
  return state$.map((state) => 
    tr([
      th(`${state.id}`),
      td(div('.tags.has-addons', [
        span('.tag.is-primary', '254'),
        span('.tag', '①')
      ])),
      td('17:30:15'),
      td('17:31:15'),
      td('1分30秒'),
      td(div('.tags.has-addons', [
        a('.tag.is-light', 'Stop'),
        a('.tag.is-delete'),
      ])),
      td(input('.input.is-small', {
        attrs: {type: 'text'}
      }))
    ])
  );
}

function Item(sources) {
  const state$ = sources.onion.state$;
  const action$ = intent(sources.DOM);
  const reducer$ = model(action$);
  const vtree$ = view(state$);
  return {
    DOM: vtree$,
    onion: reducer$
  };
}

export default Item;