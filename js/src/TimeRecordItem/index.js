import intent from './intent';
import model from './model';
import view from './view';

function TimeRecordItem(sources) {
  const action$ = intent(sources);
  const reducer$ = model(action$);
  const vtree$ = view(sources);
  return {
    DOM: vtree$,
    onion: reducer$
  };
}

export default TimeRecordItem;