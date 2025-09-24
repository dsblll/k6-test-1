import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '10s', target: 5 },  // Ramp up to 5 users
    { duration: '30s', target: 5 },  // Stay at 5 users
    { duration: '10s', target: 0 },  // Ramp down
  ],
};

export default function() {
  // Test the /data endpoint
  let response = http.get('http://fastapi:8000/data');
  
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
    'has message': (r) => r.json().message !== undefined,
    'has data array': (r) => Array.isArray(r.json().data),
  });
  
  // Health check
  let healthResponse = http.get('http://fastapi:8000/health');
  check(healthResponse, {
    'health check OK': (r) => r.status === 200,
  });
  
  sleep(1);
}
