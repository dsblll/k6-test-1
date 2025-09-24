# k6 Load Testing Project

A complete load testing setup using k6, FastAPI, and Docker Compose for API performance testing and monitoring.

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           Load Testing Workflow                        │
└─────────────────────────────────────────────────────────────────────────┘

    ┌─────────────┐    HTTP Requests     ┌─────────────┐
    │             │ ───────────────────► │             │
    │     k6      │                      │   FastAPI   │
    │ Load Tester │                      │   Server    │
    │             │ ◄─────────────────── │             │
    └─────────────┘    JSON Responses    └─────────────┘
           │                                     │
           │                                     │
           ▼                                     ▼
    ┌─────────────┐                      ┌─────────────┐
    │   Console   │                      │   Docker    │
    │   Metrics   │                      │ Container   │
    │ & Test Log  │                      │   (Port     │
    │             │                      │   8000)     │
    └─────────────┘                      └─────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                          Test Execution Flow                           │
└─────────────────────────────────────────────────────────────────────────┘

1. Start FastAPI Server  ──►  2. Launch k6 Test  ──►  3. Generate Load
        │                           │                         │
        │                           │                         │
        ▼                           ▼                         ▼
   Port 8000 Ready           3 Virtual Users           Concurrent Requests
                                    │                         │
                                    │                         │
                                    ▼                         ▼
                            Run for 25 seconds         GET /data & /health
                                    │                         │
                                    │                         │
                                    ▼                         ▼
                             Collect Metrics          Validate Responses
                                    │                         │
                                    │                         │
                                    ▼                         ▼
                            Display Results          Sleep 2-10 seconds
```

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose installed
- Git (to clone the repository)

### Running the Load Test

1. **Clone and navigate to the project:**
   ```bash
   cd k6-test-1
   ```

2. **Start the FastAPI server:**
   ```bash
   docker-compose up --build -d fastapi
   ```

3. **Run the k6 load test:**
   ```bash
   docker-compose run --rm k6 run /tests/load-test.js
   ```

4. **Stop all services:**
   ```bash
   docker-compose down
   ```

## 📁 Project Structure

```
k6-test-1/
├── docker-compose.yml      # Orchestrates FastAPI and k6 services
├── Dockerfile             # FastAPI container configuration
├── main.py               # FastAPI application with test endpoints
├── requirements.txt      # Python dependencies
├── k6-tests/
│   └── load-test.js     # k6 load test script
└── README.md           # This file
```

## 🔧 Components

### FastAPI Application (`main.py`)
A simple REST API with two endpoints:
- **`GET /data`** - Returns JSON data with simulated processing delay (100-300ms)
- **`GET /health`** - Health check endpoint for monitoring

### k6 Load Test (`k6-tests/load-test.js`)
Sophisticated load test configuration:
- **3 concurrent virtual users** running simultaneously
- **25-second test duration** (~15 total requests expected)
- **Realistic user behavior** with random 2-10 second delays between requests
- **Comprehensive validation** including response time, status codes, and data structure
- **Dual endpoint testing** (both /data and /health endpoints)

### Test Metrics & Validations
Each request is validated for:
- ✅ HTTP status code (200 OK)
- ✅ Response time (< 500ms)
- ✅ Data structure integrity
- ✅ Content validation
- ✅ Health check functionality

## 📊 Understanding the Results

When you run the test, k6 provides detailed metrics:

```
✓ status is 200........................: 100.00% ✓ 30  ✗ 0
✓ response time < 500ms................: 100.00% ✓ 30  ✗ 0  
✓ has message..........................: 100.00% ✓ 15  ✗ 0
✓ has data array.......................: 100.00% ✓ 15  ✗ 0
✓ health check OK......................: 100.00% ✓ 15  ✗ 0

http_req_duration....................: avg=104ms min=100ms med=103ms max=115ms p(90)=109ms p(95)=111ms
http_reqs............................: 30     1.199654/s
iterations...........................: 15     0.599827/s
```

### Key Metrics Explained:
- **http_reqs**: Total number of HTTP requests made (30 = 15 data + 15 health requests)
- **iterations**: Complete test cycles (15 = 3 users × ~5 iterations each)
- **http_req_duration**: Response time statistics (avg, min, max, percentiles)
- **Check success rates**: Percentage of validations that passed (aim for 100%)

## 🎯 Load Testing Concepts Demonstrated

### Realistic User Simulation
- **Concurrent users**: Multiple users acting simultaneously (not sequential)
- **Random delays**: Mimics real user behavior with varied timing
- **Multiple endpoints**: Tests complete user workflows

### Performance Validation
- **Response time limits**: Ensures API meets performance requirements
- **Concurrent load handling**: Tests server capacity under simultaneous requests
- **Data integrity checks**: Validates response structure and content

### Best Practices Implemented
- **Containerized testing**: Consistent, reproducible test environment
- **Comprehensive checks**: Multiple validation points per request
- **Realistic scenarios**: User-like behavior patterns with natural delays

## 🚀 Next Steps

To extend this project, consider:
- Add InfluxDB + Grafana for visual monitoring dashboards
- Implement different load testing scenarios (spike tests, ramp-up/down)
- Add authentication testing
- Test error scenarios and edge cases
- Implement CI/CD integration for automated testing

## 🛠️ Customization

### Modify Test Parameters
Edit `k6-tests/load-test.js`:
- Change `vus: 3` to adjust concurrent users
- Modify `duration: '25s'` for different test lengths
- Adjust sleep times for different request patterns

### Add New Endpoints
Add endpoints to `main.py` and corresponding tests in the k6 script for comprehensive API coverage.

---

This project demonstrates modern load testing practices with containerized, realistic user simulation for API performance validation.
