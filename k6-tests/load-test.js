// Import k6 modules for HTTP requests, validation checks, and delays
import http from 'k6/http';
import { check, sleep } from 'k6';

// Test configuration: defines how the load test should behave
export let options = {
  scenarios: {
    concurrent_users: {
      // Use constant-vus executor for true concurrent users
      // Each VU runs independently and makes requests at their own pace
      executor: 'constant-vus',
      
      // Exactly 3 concurrent virtual users running simultaneously
      vus: 3,
      
      // Total test duration: 25 seconds
      // Each user will make ~5 requests (25s ÷ 5s per request)
      // Total expected requests: 3 users × 5 requests = ~15 requests
      duration: '25s',
    }
  }
};

// Main test function: executed by each virtual user (VU) continuously
// Each of the 3 VUs runs this function in a loop for the entire duration
export default function() {
  // Make HTTP GET request to the FastAPI /data endpoint
  // Note: 'fastapi' is the service name from docker-compose.yml
  let response = http.get('http://fastapi:8000/data');
  
  // Validate the response using k6's check function
  // Each check returns true/false and contributes to success metrics
  check(response, {
    'status is 200': (r) => r.status === 200,                    // HTTP success
    'response time < 500ms': (r) => r.timings.duration < 500,    // Performance check
    'has message': (r) => r.json().message !== undefined,        // Data structure validation
    'has data array': (r) => Array.isArray(r.json().data),       // Content validation
  });
  
  // Make a second request to test the health endpoint
  // This simulates a typical user flow: data request + health check
  let healthResponse = http.get('http://fastapi:8000/health');
  check(healthResponse, {
    'health check OK': (r) => r.status === 200,                  // Health endpoint validation
  });
  
  // Wait a random time between 2-10 seconds before the next iteration
  // This simulates realistic user behavior with varied timing patterns
  // Each user will have different request intervals, creating more natural load
  const randomSleep = Math.random() * 8 + 2; // Random float between 2.0 and 10.0
  sleep(randomSleep);
}
