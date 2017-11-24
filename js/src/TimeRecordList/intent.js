import xs from 'xstream';

function intent(domSource) {
  const add$ = domSource
    .select('.-js-add-one-item')
    .events('keydown')
    .filter(e => {
      let trimmedVal = String(e.target.value).trim();
      return e.keyCode === 13 && trimmedVal;
    })
    .map(e => String(e.target.value).trim())
    .map( payload => ({ type: 'ADD_ITEM', payload }));

  return xs.merge(
    add$
  );
}

export default intent;