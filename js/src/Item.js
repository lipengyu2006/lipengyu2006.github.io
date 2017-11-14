import xs from 'xstream';
import {div, span, a, input} from '@cycle/dom';
import {table, thead, tbody, th, tr, td} from '@cycle/dom';

function intent(domSource) {
  return domSource.select('.is-delete').events('click')
    .mapTo({type: 'REMOVE'})
}

function model(props$, actions$) {

  return props$.map(props => {
      return {
        id: props.id
      };
    });

  //return props$.map(props => {
  //  return action$.startWith(null)
  //    .map(value => {
  //      return {
  //        id: props.id
  //      };
  //    })
  //}).flatten();
}

function view(state$) {
  return state$.map(({id}) => {
    return tr([
      th(`${id}`),
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
    ]);
  });
}

function Item(sources) {
  const action$ = intent(sources.DOM);
  const state$ = model(sources.Props, action$);
  const vtree$ = view(state$);
  return {
    DOM: vtree$,
    Remove: action$.filter(a => a.type === 'REMOVE')
  };
}


function makeListTr(props) {
  return tr([
    th(`${props.id}`),
    td(div('.tags.has-addons', [
      span('.tag.is-primary', '254'),
      span('.tag', 'б┘')
    ])),
    td('17:30:15'),
    td('17:31:15'),
    td('1ио30├в'),
    td(div('.tags.has-addons', [
      a('.tag.is-light', 'Stop'),
      a('.tag.is-delete'),
    ])),
    td(input('.input.is-small', {
      attrs: {type: 'text'}
    }))
  ]);
}

export default Item;