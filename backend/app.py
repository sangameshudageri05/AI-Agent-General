
from flask import Flask, request, jsonify
from flask_cors import CORS
from rag_pipeline import qa_chain

app = Flask(__name__)

# Allow your local frontend to call Flask during development
CORS(app)

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json(silent=True) or {}
    message = data.get("message", "").strip()

    if not message:
        return jsonify({"error": "Please enter a message"}), 400

    try:
        result = qa_chain.invoke({"query": message})
        return jsonify({"reply": result["result"]})
    except Exception:
        app.logger.exception("Chat request failed")
        return jsonify({"error": "Failed to generate an answer"}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
