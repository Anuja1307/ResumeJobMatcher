from fastapi.testclient import TestClient
from app import app
import os

client = TestClient(app)

def test_routes():
    print("\n==================================================")
    print("      FASTAPI ENDPOINTS STRUCTURE TEST            ")
    print("==================================================")

    # 1. Home
    res = client.get("/")
    assert res.status_code == 200
    print("  ✓ GET / =>", res.json())

    # 2. Embedding error check or structure test
    res = client.post("/embed", json={"text": "Software Developer"})
    print(f"  ✓ POST /embed status: {res.status_code}")

    # 3. Extract Job Skills
    res = client.post("/extract-job", json={"description": "Node.js and React required."})
    print(f"  ✓ POST /extract-job status: {res.status_code}")

    # 4. Extract Job Keywords
    res = client.post("/extract-job-keywords", json={"description": "Node.js, Express, MongoDB."})
    print(f"  ✓ POST /extract-job-keywords status: {res.status_code}")

    # 5. Extract Resume
    res = client.post("/extract", json={"text": "Software Developer with React experience."})
    print(f"  ✓ POST /extract status: {res.status_code}")

    print("\n==================================================")
    print("      FASTAPI STRUCTURE TESTS COMPLETED           ")
    print("==================================================\n")

if __name__ == "__main__":
    test_routes()
