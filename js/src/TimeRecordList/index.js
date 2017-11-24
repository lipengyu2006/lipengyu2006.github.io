import xs from 'xstream';
import isolate from '@cycle/isolate';
import { makeCollection } from 'cycle-onionify';
import { tbody } from '@cycle/dom';
import TimeRecordItem from '../TimeRecordItem';
import TimeRecordAdd from '../TimeRecordAdd';
//import intent from './intent';
import model from './model';
import view from './view';
import { lensList, lensAdd } from './lenses';

function TimeRecordList(sources) {
  const List = makeCollection({
    item: TimeRecordItem,
    itemKey: (s, k) => k,
    itemScope: (key) => key,
    collectSinks: (instances) => {
      return {
        DOM: instances.pickCombine('DOM')
          .map((itemVNodes) => tbody(itemVNodes)),
        onion: instances.pickMerge('onion')
      };
    }
  });

  const sinksList = isolate(List, { onion: lensList })(sources);
  const sinksInputAdd = isolate(TimeRecordAdd, { onion: lensAdd })(sources);

  //const action$ = intent(sources.DOM);
  //const parentReducer$ = model(action$);
  const parentReducer$ = model();

  const reducer$ = xs.merge(
    parentReducer$,
    sinksList.onion,
    sinksInputAdd.onion
  );

  const vdom$ = xs.combine(
    sinksList.DOM,
    sinksInputAdd.DOM
  );

  return {
    DOM: view(vdom$),
    onion: reducer$
  };
}

export default TimeRecordList;