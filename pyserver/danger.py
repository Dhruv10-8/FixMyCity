from flask import Flask, request, jsonify
from sklearn.cluster import DBSCAN
import requests
import numpy as np

app = Flask(__name__)

OVERPASS_URL = "http://overpass-api.de/api/interpreter"

# Query OSM for schools, hospitals, parks, train stations
def query_facilities(lat, lon, radius):
    query = f"""
    [out:json];
    (
      node["amenity"~"school|hospital"](around:{radius},{lat},{lon});
      node["leisure"="park"](around:{radius},{lat},{lon});
      node["railway"="station"](around:{radius},{lat},{lon});
    );
    out center;
    """
    response = requests.post(OVERPASS_URL, data={"data": query})
    data = response.json()
    return [(el["lat"], el["lon"]) for el in data.get("elements", [])]

@app.route("/danger-level", methods=["POST"])
def danger_level():
    data = request.json
    hazard = data["hazard"]  # {"lat": ..., "lon": ...}
    radius = data.get("radius", 300)

    facilities = query_facilities(hazard["lat"], hazard["lon"], radius)
    if not facilities:
        return jsonify({"level": "Low", "reason": "No nearby facilities"})

    points = np.array([(hazard["lat"], hazard["lon"])] + facilities)
    db = DBSCAN(eps=0.002, min_samples=2, metric='haversine').fit(np.radians(points))
    labels = db.labels_

    # If the hazard is in a dense cluster (not -1), it's dangerous
    hazard_label = labels[0]
    danger = "High" if hazard_label != -1 else "Medium"

    return jsonify({"level": danger, "cluster_id": int(hazard_label)})

if __name__ == "__main__":
    app.run(port=5001)
