from flask import Flask, request, jsonify
import pickle
import numpy as np
from flask_cors import CORS 
app = Flask(__name__)

CORS(app)
@app.route('/predict', methods=['POST'])
def predict():
    # Get JSON data from the request
    data = request.get_json()

    if 'text' not in data:
        return jsonify({'error': 'No text provided'}), 400

    # Extract 'text' from the JSON body
    text = data['text']

    # Load the pre-trained model and vectorizer
    model = pickle.load(open('model.pkl', 'rb'))
    vectorizer = pickle.load(open('vectorizer.pkl', 'rb'))

    # Vectorize the input text
    text_vectorized = vectorizer.transform([text])

    # Make the prediction
    prediction = model.predict(text_vectorized)

    # Determine the result
    if prediction == 1:
        result = 'Fake News'
    else:
        result = 'Real News'

    # You can also return accuracy if you calculate it elsewhere or precompute it
    # Here I am sending a static value, but you can modify it accordingly
    accuracy = model.score(text_vectorized,prediction) *100 # Example, replace with actual accuracy calculation

    # Return the result and accuracy as JSON
    return jsonify({'result': result, 'accuracy': accuracy})

if __name__ == '__main__':
    app.run(port=5000, debug=True)
