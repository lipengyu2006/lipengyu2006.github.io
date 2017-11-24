import xs from 'xstream';
import { getNumbers } from '../tool';

function model(actions$) {
  const editReducer$ = actions$
    .filter(action => action.type === 'EDIT')
    .mapTo(prevState => ({
      ...prevState,
      isEditing: true,
      isEditingStart: true
    }));

  const quitReducer$ = actions$
    .filter(action => action.type === 'QUIT')
    .mapTo(prevState => ({
      ...prevState,
      isEditing: false,
      isEditingStart: false
    }));

  const writeReducer$ = actions$
    .filter(action => action.type === 'WRITE')
    .map(action => {
      return (prevState) => ({
        ...prevState,
        content: getNumbers(action.content),
        isEditing: false,
        isEditingStart: false
      });
    });

  const deleteReducer$ = actions$
    .filter(action => action.type === 'REMOVE')
    .mapTo(prevState => undefined);

  const recordReducer$ = actions$
    .filter(action => action.type === 'RECORD')
    .mapTo(prevState => {
      const time = new Date().getTime();
      const startTime = prevState.isStop ? prevState.startTime.concat(time) : prevState.startTime;
      const endTime = prevState.isStop ? prevState.endTime : time;

      return {
        ...prevState,
        isStop: false,
        isEditingStart: false,
        startTime,
        endTime
      }
    });

  const stopReducer$ = actions$
    .filter(action => action.type === 'STOP')
    .mapTo(prevState => {
      const endTime = new Date().getTime();
      const pauseTime = prevState.pauseTime.concat(endTime);

      return {
        ...prevState,
        pauseTime,
        endTime,
        isStop: true
      }
    });

  return xs.merge(
    editReducer$,
    quitReducer$,
    writeReducer$,
    deleteReducer$,
    stopReducer$,
    recordReducer$
  );
}

export default model;