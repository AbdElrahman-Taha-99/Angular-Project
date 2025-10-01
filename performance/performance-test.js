import http from 'k6/http';
import { sleep, check } from 'k6';

export let options = {
  vus: 10,        // virtual users
  duration: '30s' // test duration
};

export default function () {
  let res = http.get('http://54.157.237.38:8080');
  check(res, { 'status was 200': (r) => r.status === 200 });
  sleep(1);
}

