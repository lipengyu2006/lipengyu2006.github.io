import xs from 'xstream';
import { div, tr, th, input } from '@cycle/dom';
import { getNumbers } from '../tool';

function InputAdd(sources) {
  let mutableLastId = 0;
  const state$ = sources.onion.state$;
  const vdom$ = state$.map((state) => 
    tr([
      th('.-js-record-item-add', { attrs: { colspan: 6 } }, [
        div('.control', [
          input('.input.-js-add-one-item', {
            props: {
              type: 'text',
              placeholder: 'Page part'
            },
            hook: {
              update: (oldVNode, { elm }) => {
                if (state.isAddingStart) {
                  elm.value = '';
                }
              }
            }
          })
        ])
      ])
    ])
  );
  const reducer$ = sources.DOM
    .select('.-js-add-one-item')
    .events('keydown')
    .filter(e => {
      let trimmedVal = String(e.target.value).trim();
      return e.keyCode === 13 && trimmedVal;
    })
    .map(e => String(e.target.value).trim())
    .map( payload => ({ type: 'ADD_ITEM', payload }))
    .map((action) => (prevState) => {
      const timestamp = new Date().getTime();
      return {
        isAddingStart: true,
        list: prevState.list.concat({
          id: mutableLastId++,
          isStop: false,
          isEditing: false,
          isEditingStart: false,
          content: getNumbers(action.payload),
          startTime: [timestamp],
          pauseTime: [],
          endTime: timestamp
        })
      }
    });

  return {
    DOM: vdom$,
    onion: reducer$
  };
}

export default InputAdd;