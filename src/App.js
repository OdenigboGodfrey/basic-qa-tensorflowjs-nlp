import logo from './logo.svg';
import './App.css';
import * as tf from "@tensorflow/tfjs";
import * as qna from "@tensorflow-models/qna";
// import * as Loader from 'react-loader-spinner';
// import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import { useEffect, useRef, useState } from 'react';
import { Circles } from 'react-loader-spinner';

function App() {
  const questionRef = useRef(null);
  const dataStringRef = useRef(null);
  const [answer, setAnswer] = useState();
  const [model, setModel] = useState(null);

  // load tensorflow model
  const loadModel = async () => {
    const loadedModel = await qna.load();
    setModel(loadedModel);
    console.log("Model loaded");
  }

  const generateAnswers = async (e) => {
    if (model == null) return;
    console.log('generating answers');
    const passage = dataStringRef.current.value;
    const question = questionRef.current.value;

    const answers = await model.findAnswers(question, passage);
    if (answers) {
      setAnswer(answers);
      console.log('answer generated', answers);
    } else {
      console.log('no answers');
    }
  }

  useEffect(() => {
    loadModel();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {
          model == null ? 
          <Circles
          height="80"
          width="80"
          color="#4fa94d"
          ariaLabel="circles-loading"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
          />
          : 
            <>
            <div>
              Passage
              <textarea ref={dataStringRef} rows={30} cols={100}></textarea>
            </div>
            <div>
              Your Question
              <input ref={questionRef} size={80} />
              <button onClick={(e) => generateAnswers(e)} >Submit</button>
            </div>
            <div>
              {
                answer ? answer.map((ans, index) => {
                  return (
                    <div>
                      <b>Answer {index + 1}</b>
                      {ans.text} @ {ans.score.toFixed(2)} %
                    </div>
                  );
                }) : <></>
              }
            </div>
            </>
        }
      </header>
    </div>
  );
}

export default App;
