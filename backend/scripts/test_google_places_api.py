import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

import httpx
from app.core.config import settings


def test_google_places_api() -> None:
    print("=" * 60)
    print("Testing Google Places API Configuration")
    print("=" * 60)
    
    # Check if API key is set
    if not settings.google_places_api_key:
        print("❌ ERROR: GOOGLE_PLACES_API_KEY is not set in .env file")
        print("   Add: GOOGLE_PLACES_API_KEY=your-key-here")
        return
    
    print(f"✅ GOOGLE_PLACES_API_KEY is set: {settings.google_places_api_key[:10]}...")
    
    print("\n🔍 Testing Places API Autocomplete...")
    
    # Test query
    test_query = "1600 Amphitheatre Parkway, Mountain View"
    url = "https://maps.googleapis.com/maps/api/place/autocomplete/json"
    
    params = {
        "input": test_query,
        "key": settings.google_places_api_key,
        "types": "address",
    }
    
    try:
        with httpx.Client(timeout=10.0) as client:
            response = client.get(url, params=params)
            response.raise_for_status()
            
            data = response.json()
            
            if data.get("status") == "OK":
                print("✅ API key is valid!")
                predictions = data.get("predictions", [])
                print(f"   Found {len(predictions)} prediction(s) for: '{test_query}'")
                
                if predictions:
                    print("\n   Sample predictions:")
                    for i, pred in enumerate(predictions[:3], 1):
                        print(f"   {i}. {pred.get('description', 'N/A')}")
                
            elif data.get("status") == "REQUEST_DENIED":
                error_message = data.get("error_message", "Unknown error")
                print(f"❌ API Error: Request Denied")
                print(f"   Error: {error_message}")
                print("\n   Common causes:")
                print("   - API key is invalid")
                print("   - Places API is not enabled in Google Cloud Console")
                print("   - API key restrictions are blocking the request")
                
            elif data.get("status") == "ZERO_RESULTS":
                print("⚠️  API is working but no results found for test query")
                print("   This is normal - the API key appears to be valid")
                
            else:
                status = data.get("status", "UNKNOWN")
                error_message = data.get("error_message", "")
                print(f"⚠️  API returned status: {status}")
                if error_message:
                    print(f"   Error: {error_message}")
    
    except httpx.RequestError as e:
        print(f"❌ Network Error: {e}")
        print("   Check your internet connection")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return
    
    # Test Geocoding API (often used together)
    print("\n🌍 Testing Geocoding API...")
    
    geocode_url = "https://maps.googleapis.com/maps/api/geocode/json"
    geocode_params = {
        "address": "1600 Amphitheatre Parkway, Mountain View, CA",
        "key": settings.google_places_api_key,
    }
    
    try:
        with httpx.Client(timeout=10.0) as client:
            response = client.get(geocode_url, params=geocode_params)
            response.raise_for_status()
            
            data = response.json()
            
            if data.get("status") == "OK":
                print("✅ Geocoding API is also working!")
                results = data.get("results", [])
                if results:
                    location = results[0].get("geometry", {}).get("location", {})
                    print(f"   Coordinates: {location.get('lat')}, {location.get('lng')}")
            elif data.get("status") == "REQUEST_DENIED":
                print("⚠️  Geocoding API may not be enabled (this is optional)")
            else:
                print(f"⚠️  Geocoding returned: {data.get('status')}")
    
    except Exception as e:
        print(f"⚠️  Could not test Geocoding API: {e}")
    
    print("\n" + "=" * 60)
    print("Test completed!")
    print("\n Note: Make sure these APIs are enabled in Google Cloud Console:")
    print("   - Places API")
    print("   - Maps JavaScript API (for frontend)")
    print("   - Geocoding API (optional)")


if __name__ == "__main__":
    test_google_places_api()
