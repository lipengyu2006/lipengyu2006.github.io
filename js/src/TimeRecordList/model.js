import xs from 'xstream';

function model(action$) {
  const initReducer$ = xs.of((prev) => {
    return {
      isAddingStart: false,
      list: []
    };
  });
  return initReducer$;
}

export default model;