import xs from 'xstream';

function intent(sources) {
  const domSource = sources.DOM;

  const eventEdit$ = domSource
    .select('.-js-view')
    .events('dblclick')
    .mapTo({ type: 'EDIT' });

  const eventQuit$ = domSource
    .select('.-js-edit')
    .events('keyup')
    .filter(e => e.keyCode === 27)
    .mapTo({ type: 'QUIT' });

  const eventBlur$ = domSource
    .select('.-js-edit')
    .events('blur', true);

  const eventWrite$ = domSource
    .select('.-js-edit')
    .events('keyup')
    .filter(e => e.keyCode === 13)
    .compose(s => xs.merge(s, eventBlur$))
    .map(e => ({ content: e.target.value, type: 'WRITE' }));

  const eventRemove$ = domSource
    .select('.-js-delete')
    .events('click')
    .mapTo({ type: 'REMOVE' });

  const eventStop$ = domSource
    .select('.-js-stop')
    .events('click')
    .mapTo({ type: 'STOP' });

  const timeRecord$ = xs
    .periodic(1000)
    .startWith(0)
    .mapTo({ type: 'RECORD' })
    .endWhen(eventStop$);

  const eventRestart$ = domSource
    .select('.-js-restart')
    .events('click')
    .map(e => timeRecord$)
    .flatten();
    
  return xs.merge(
    eventEdit$,
    eventQuit$,
    eventWrite$,
    eventRemove$,
    eventStop$,
    timeRecord$,
    eventRestart$
  );
}

export default intent;