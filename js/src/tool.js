import { padStart } from 'lodash';

function getDur(start, parse) {
  let duration = 0;
  const now = new Date().getTime();
  const lastIndex = start.length - 1;
  if (!parse[lastIndex]) {
    duration = now - start[lastIndex];
  }
  for (const i of parse.keys()) {
    duration += (parse[i] - start[i]);
  }

  const days = Math.floor(duration / (24 * 3600 * 1000));
  let laveSec = duration % (24 * 3600 * 1000);
  const hours = Math.floor(laveSec / (3600 * 1000));
  laveSec = laveSec % (3600 * 1000);
  const minutes = Math.floor(laveSec / (60 * 1000));
  laveSec = laveSec % (60 * 1000);
  const seconds = Math.round(laveSec / 1000);

  const d = days ? day + '天' : '';
  const h = hours ? hours + '时': '';
  const m = minutes ? minutes + '分' : '';
  const s = seconds ? seconds + '秒': '0 秒';

  return d + h + m + s;
}

function getHMS(timestamp) {
  const date = timestamp ? new Date(timestamp) : new Date();
  return '' +
    pad(date.getHours()) + ':' + 
    pad(date.getMinutes()) + ':' +
    pad(date.getSeconds());
}

function getNumbers(str) {
  let arr = str.match(/[0-9]+/g) || [];
  if (!arr[0]) arr[0] = '';
  if (!arr[1]) arr[1] = '';
  return arr;
}

function pad(numb) {
  return padStart(numb, 2, 0);
}

export {
  getHMS,
  getNumbers,
  getDur
};