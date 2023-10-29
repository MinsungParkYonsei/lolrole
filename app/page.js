'use client'
// Import Next.js and other necessary modules
import { useEffect, useState } from 'react';
import Head from 'next/head';

let tmImage;
if (typeof window !== 'undefined') {
  tmImage = require('@teachablemachine/image');
}

export default function Home() {
  const [model, setModel] = useState(null);
  const [predictions, setPredictions] = useState([]);

  const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];

  useEffect(() => {
    async function loadModel() {
      const URL = 'https://teachablemachine.withgoogle.com/models/OKsEBZLb6/';
      const modelURL = `${URL}model.json`;
      const metadataURL = `${URL}metadata.json`;

      const model = await tmImage.load(modelURL, metadataURL);
      setModel(model);
    }

    if (tmImage) {
      loadModel();
    }
  }, []);

  async function predict() {
    if (!model) {
      console.error('Model is not loaded');
      return;
    }

    const image = document.getElementById('upload-image');
    const prediction = await model.predict(image, false);
    
    setPredictions(prediction.map(p => ({
      className: p.className,
      probability: p.probability.toFixed(2),
    })));
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      document.getElementById('upload-image').src = e.target.result;
      predict();
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <Head>
        <title>관상을 통한 롤 라인 추천기</title>
      </Head>
      <div style={{ textAlign: 'center', padding: '20px', backgroundColor: 'black' , color: 'white'}}>
        <h1>관상을 통한 롤 라인 추천기</h1>
        <p>예측을 위해 얼굴을 업로드해보시오</p>
        <div id="fileInput-wrapper">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        이미지 업로드
        <input type="file" id="fileInput" onChange={handleImageUpload} />
      </div>
      
        <br />
        <img id="upload-image" src="./fakerganji.jpg" height="180px" alt="your image" style={{ marginTop: '20px' }}/>
        <h2>예측결과</h2>
        <div>
          {predictions.map((prediction, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ width: '100px' }}>{prediction.className}</span>
              <div className={`prediction-bar prediction-bar-${index}`} style={{
              height: '24px',
              width: `${prediction.probability * 100}%`,
              color: 'white',
              textAlign: 'right',
              padding: '0 5px'
            }}>
                {prediction.probability}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
