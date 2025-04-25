from flask import Flask, request, jsonify, render_template  

app=Flask(__name__)

@app.route('/',methods=['GET'])
def hello_world():
    return render_template('index.html')

@app.route('/predict',methods=['POST'])
def predict():
    text=request.form['text']
    
    #for prediction loading model and vectorizer
    import pickle
    import numpy as np
    model=pickle.load(open('model.pkl','rb'))
    vectorizer=pickle.load(open('vectorizer.pkl','rb'))
    #now predict?
    text_vectorized=vectorizer.transform([text])
    prediction=model.predict(text_vectorized)
    
    if prediction==1:
        result='Fake News'
    else: 
        result="Real News"
#return model accuracy and informmation too
    accuracy=model.score(text_vectorized,prediction)*100
            
    return render_template('index.html', prediction=result,accuracy=accuracy)
    
    
        
if __name__=='__main__':
    app.run(port=3000,debug=True)
    
