import React, {useState, useEffect} from 'react'
import Timer from './Timer.jsx';
import he from 'he';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import winnerGif from './assets/winner.gif'
import correctMusic from './assets/correct.mp3';
import incorrectMusic from './assets/incorrect.mp3';
import winningSoundSFX from './assets/winningSound.mp3'
import quizTheme from './assets/quizSong.mp3';

const winningSound = new Audio(winningSoundSFX);
const themeSong = new Audio(quizTheme);

themeSong.loop = true;
const correctSFX = new Audio(correctMusic);
const incorrectSFX = new Audio(incorrectMusic);

let powerUps = {
    1 : true,
    2 : true,
    3 : true,
    4 : true,
  }
function QuestionBlock({questionData, next, number, restart, prices, time, totalQuestions}){
    const navigate = useNavigate();
  
    const [hiddenIndex, setHiddenIndex] = useState(null);
    const [paused, setPaused] = useState(false);
    const [onReset, setOnReset] = useState(false);
    const [powerUp1, setPowerUp1] = useState(powerUps[1]);
    const [powerUp2, setPowerUp2] = useState(powerUps[2]);
    const [powerUp3, setPowerUp3] = useState(powerUps[3]);
    const [powerUp4, setPowerUp4] = useState(powerUps[4]);
    const [askTheAudience, setAskTheAudience] = useState(false);
  
    function restartGameData(){
      setCorrect(null), setHiddenIndex(null), powerUps = { 1 : true, 2 : true, 3 : true, 4 : true }
    }
  
    function getCrowdAnswer(correctAnswer, fakeAnswers) {
      const totalOptions = fakeAnswers.length + 1;
      
      const isAccurate = Math.random() < 0.8;
      
      let percentages;
      if (isAccurate) {
        const basePercentage = 100 / totalOptions;
        percentages = [
          basePercentage + Math.random() * 20,
          ...fakeAnswers.map(() => basePercentage - Math.random() * 10)
        ];
      } else {
        percentages = Array(totalOptions).fill(0).map(() => Math.random() * 100);
      }
      
      const total = percentages.reduce((a, b) => a + b, 0);
      percentages = percentages.map(p => (p / total * 100).toFixed(1));
      
      const answers = [correctAnswer, ...fakeAnswers];
      return answers.map((answer, index) => ({
        name: answer,
        percentage: percentages[index]
      }));
    }
  
  
    const [correct, setCorrect] = useState(null);
  
    function shuffleArray(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    }
  
    const options = (questionData) ? shuffleArray([questionData.correct_answer, ...questionData.incorrect_answers]) : [];
    const [answers, setAnswers] = useState(options);
  
    useEffect(() => {
    if(questionData==null){
        themeSong.pause();
        winningSound.play();
    }else{
        themeSong.play();
      setAnswers(options);
      setPaused(false);
      setOnReset(!onReset);
      setAskTheAudience(false);
    } 
    }, [questionData]);
  
  
    function optionClick(correct){
      themeSong.pause()
      themeSong.currentTime = 0;
      if(correct){
        correctSFX.play();
        setCorrect(true);
      }else{
        incorrectSFX.play();
        setCorrect(false);
      }
      setPaused(true);
    }
  
    function deleteAnwer(){
      const answerIndex = answers.indexOf(questionData.correct_answer);
      let randomNumber;
      do{
        randomNumber = Math.floor(Math.random() * (3 - 0 + 1)) + 0;
      }while(randomNumber==answerIndex)
      setHiddenIndex(randomNumber);
      setPowerUp2(false);
      powerUps[2]=false;
    }
  
    return(
        questionData==null ? 
        <>
          <h1 className='text-center text-4xl'>🎉 Congratulations! You have just won $1,000,000! 🎉</h1>
          <img src={winnerGif} />
          <button className=" text-2xl px-5 py-3 bg-orange-400 text-white font-semibold rounded-lg shadow-md  focus:outline-none focus:ring-2 focus:ring-yellow-500 hover:bg-orange-600" onClick={() => navigate('/')} >Back to the menu</button>
        </> : 
  
        <div className='flex flex-col items-center gap-7 w-11/12 overflow-y-auto scrollbar-hide' >
        <div>
        <h2 className='text-3xl text-center mt-[20px] mb-[0]'>Question {number}/{totalQuestions}</h2>
        <h2 className='text-3xl text-center mt-[10px] text-green-500 animate-pulse font-bold'>For {prices[number-1]}:</h2>
        </div>
        {time!=-1 ? <Timer initialTime={time} onTimeUp={()=>optionClick(false)} paused={paused} onReset={onReset}></Timer> : null}
        <h1 className='text-center text-4xl'>{he.decode(questionData.question)}</h1>
        <div className='grid grid-cols-2 grid-rows-2 gap-6 w-full'>
        {
          answers.map((answer, i) => {
            if(answer == questionData.correct_answer){
              return <button disabled={correct !== null} className={`break-words w-full text-2xl px-5 py-3  text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-500 ${(correct!=null) ? "bg-green-400" : "bg-yellow-500 hover:bg-yellow-600"}`} onClick={()=>optionClick(true)} key={uuidv4()}>{he.decode(answer)}</button>
            }else if(i == hiddenIndex){
              return <button disabled className={`break-words w-full text-2xl px-5 py-3 text-white font-semibold rounded-lg shadow-md invisible`} key={uuidv4()}></button>
            }
            else{
              return <button disabled={correct !== null} className={`break-words w-full text-2xl px-5 py-3 text-white font-semibold rounded-lg shadow-md  focus:outline-none focus:ring-2 focus:ring-yellow-500 ${(correct==false) ? "bg-red-400" : "bg-yellow-500 hover:bg-yellow-600"}`} onClick={()=>optionClick(false)} key={uuidv4()}>{he.decode(answer)}</button>
            }
            
          })
        } 
        </div>
        {
        correct==true ? 
        <button className="w-full text-2xl  px-5 py-3 bg-blue-400 text-white font-semibold rounded-lg shadow-md  focus:outline-none focus:ring-2 focus:ring-yellow-500 hover:bg-blue-600" onClick={()=>{next(), setCorrect(null), setHiddenIndex(null)}} >Next!</button> 
        : correct == false ?
        <>
          <button className="w-full text-2xl px-5 py-3 bg-blue-400 text-white font-semibold rounded-lg shadow-md  focus:outline-none focus:ring-2 focus:ring-yellow-500 hover:bg-blue-600" onClick={()=>{restartGameData(), restart()}}>Try again</button>
          <button className="w-full text-2xl px-5 py-3 bg-blue-400 text-white font-semibold rounded-lg shadow-md  focus:outline-none focus:ring-2 focus:ring-yellow-500 hover:bg-blue-600 mb-30px" onClick={() => {restartGameData(), navigate('/')}} >Back to the menu</button>
        </> : null
        }
        {(powerUp1 || powerUp2 || powerUp3 || powerUp4) && correct==null ? <h2 className='text-blue-500 text-3xl'>Power ups</h2> : null}
        {
          correct==null ? 
          <div className='flex gap-3 flex-wrap justify-center w-full mb-3'>
            { powerUp1 && time!=-1? <button className='bg-blue-400 px-5 py-3 text-white font-semibold rounded-lg focus:outline-none shadow-md hover:bg-blue-600' onClick={()=>{setPaused(true), setPowerUp1(false), powerUps[1]=false}}>⌛Freeze Time</button> : null }
            { powerUp2 ? <button className='bg-blue-400 px-5 py-3 text-white font-semibold rounded-lg focus:outline-none shadow-md hover:bg-blue-600' onClick={()=>deleteAnwer()}>❌Delete one answer</button> : null }
            { powerUp3 ? <button className='bg-blue-400 px-5 py-3 text-white font-semibold rounded-lg focus:outline-none shadow-md hover:bg-blue-600' onClick={()=>{optionClick(true), setPowerUp3(false), powerUps[3]=false}}>⏩Skip question</button> : null }
            { powerUp4 ? <button className='bg-blue-400 px-5 py-3 text-white font-semibold rounded-lg focus:outline-none shadow-md hover:bg-blue-600' onClick={()=>{setAskTheAudience(true), setPowerUp4(false), powerUps[4]=false}}>👥Ask the Audience</button> : null }
          </div> 
          : null
        }
        
        {askTheAudience ?
        <>
          <h2 className='font-bold text-3xl text-blue-700'>Let’s see what the crowd thinks…</h2>
          <div className='flex flex-col gap-1'>
            {getCrowdAnswer(questionData.correct_answer, questionData.incorrect_answers).map(d=>{
              return <h2 className='font-bold text-2xl text-blue-700'>{"█".repeat((d.percentage/100)*20)}  {d.percentage}%  {d.name} </h2>         
            })}
          </div> 
        </>
        : null}
        
      </div>
  
      );
  }
  
export default QuestionBlock