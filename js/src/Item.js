import xs from 'xstream';
import { div, span, a, input } from '@cycle/dom';
import { table, thead, tbody, th, tr, td } from '@cycle/dom';
import { getHMS } from './tool';

function intent(sources) {
  const domSource = sources.DOM;

  const eventRemove$ = domSource
    .select('.-delete')
    .events('click')
    .mapTo({ type: 'REMOVE' });

  const eventStop$ = domSource
    .select('.-stop')
    .events('click')
    .mapTo({ type: 'STOP' });

  const timeRecord$ = xs
    .periodic(1000)
    .startWith(0)
    .mapTo({ type: 'RECORD' })
    .endWhen(eventStop$);

  const eventRestart$ = domSource
    .select('.-restart')
    .events('click')
    .map(e => timeRecord$)
    .flatten();
    
  return xs.merge(
    eventRemove$,
    eventStop$,
    timeRecord$,
    eventRestart$
  );
}

function model(actions$) {
  const deleteReducer$ = actions$
    .filter(action => action.type === 'REMOVE')
    .mapTo(prevState => undefined);

  const recordReducer$ = actions$
    .filter(action => action.type === 'RECORD')
    .mapTo(prevState => {
      const endTime = prevState.isStop ? prevState.endTime : getHMS();
      return {
        ...prevState,
        isStop: false,
        endTime
      }
    });

  const stopReducer$ = actions$
    .filter(action => action.type === 'STOP')
    .mapTo(prevState => {
      return {
        ...prevState,
        isStop: true
      }
    });

  return xs.merge(
    deleteReducer$,
    stopReducer$,
    recordReducer$
  );
}

function view(sources) {
  const state$ = sources.onion.state$;

  return state$.map((state) => 
    tr([
      th(`${state.id}`),
      td(div('.tags.has-addons', [
        span('.tag.is-primary', '254'),
        span('.tag', '①')
      ])),
      td(`${state.startTime}`),
      td(`${state.endTime}`),
      td('1分30秒'),
      td(div('.tags.has-addons', [
        state.isStop ? 
          a('.tag.is-light.-restart', 'Pause') :
          a('.tag.is-light.-stop', 'Running'),
        a('.tag.is-delete.-delete'),
      ])),
      td(input('.input.is-small', {
        attrs: {type: 'text'}
      }))
    ])
  );
}

function Item(sources) {
  const action$ = intent(sources);
  const reducer$ = model(action$);
  const vtree$ = view(sources);
  return {
    DOM: vtree$,
    onion: reducer$
  };
}

export default Item;