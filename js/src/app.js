import { run } from '@cycle/run';
import { makeDOMDriver } from '@cycle/dom';
import onionify from 'cycle-onionify';
import TimeRecordList from './TimeRecordList';

function main(sources) {
  const listSinks = TimeRecordList(sources);
  const vdom$ = listSinks.DOM;
  const reducer$ = listSinks.onion;

  return {
    DOM: vdom$,
    onion: reducer$
  };
}

const wrapperMain = onionify(main);

run(wrapperMain, {
  DOM: makeDOMDriver('#timerecord')
});