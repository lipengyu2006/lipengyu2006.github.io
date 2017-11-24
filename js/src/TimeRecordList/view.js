import { table, thead, th, tr } from '@cycle/dom';
import { div, abbr } from '@cycle/dom';

function view(vNode$) {
  return vNode$.map(([listVNode, inputVNode]) =>
    div('.wrap', [
      table('.table', [
        thead([
          inputVNode,
          tr([
            th(abbr({ attrs: { title: 'Serial number' }}, 'SN')),
            th('Page part'),
            th('Start time'),
            th('End time'),
            th('Duration'),
            th('Status')
          ])
        ]),
        listVNode
      ])
    ])
  )
}

export default view;