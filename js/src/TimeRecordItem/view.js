import { last } from 'lodash';
import { div, span, a, input } from '@cycle/dom';
import { table, thead, tbody, th, tr, td } from '@cycle/dom';
import { getHMS, getDur } from '../tool';

function view(sources) {
  const state$ = sources.onion.state$;

  return state$.map((state) => 
    tr({
      style: {
        opacity: '0',
        transition: 'opacity .5s',
        delayed: { opacity: '1' },
        remove: { opacity: '0' }
      }
    }, [
      th(`${state.id}`),
      td({
        class: {
          '-js-editing': state.isEditing
        }
      }, [
        input('.input.is-small.-js-edit', {
          props: { type: 'text', value: `${state.content[0]} ${state.content[1]}` },
          hook: {
            update: (oldVNode, { elm }) => {
              //elm.value = state.content;
              if (state.isEditingStart) {
                elm.focus();
                elm.selectionStart = elm.value.length;
              }
            }
          }
        }),
        div('.tags.has-addons.-js-view', [
          span('.tag.is-primary', `${state.content[0]}`),
          span('.tag', `${state.content[1]}`)
        ])
      ]),
      td(`${getStartTime(state.startTime)}`),
      td(`${getHMS(state.endTime)}`),
      td(`${getDur(state.startTime, state.pauseTime)}`),
      td(div('.tags.has-addons', [
        state.isStop ? 
          a('.tag.is-light.-js-restart', 'Pause') :
          a('.tag.is-light.-js-stop', 'Running'),
        a('.tag.is-delete.-js-delete'),
      ])),
      td()
    ])
  );
}

function getStartTime(arry) {
  var elLast = last(arry);
  return getHMS(elLast);
}

export default view;