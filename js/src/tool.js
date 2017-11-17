import { padStart } from 'lodash';

function getHMS() {
  var date = new Date();
  return '' +
    pad(date.getHours()) + ':' + 
    pad(date.getMinutes()) + ':' +
    pad(date.getSeconds());
}

function pad(numb) {
  return padStart(numb, 2, 0);
}

export {
  getHMS
};