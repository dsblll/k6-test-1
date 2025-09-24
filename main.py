from fastapi import FastAPI
import time
import random
import asyncio

app = FastAPI()

@app.get("/data")
async def get_data():
    # Simulate some processing time
    await asyncio.sleep(random.uniform(0.1, 0.3))
    
    return {
        "message": "Hello from FastAPI!",
        "timestamp": time.time(),
        "data": [1, 2, 3, 4, 5]
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
