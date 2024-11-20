import { useEffect, useState } from 'react'
import he from 'he';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import Timer from './Timer.jsx';

function BigShow() {
  const [start, setStart] = useState(false);
  const [time, setTime] = useState(null);
  const [questions, setQuestions] = useState(null);
  const prices = [
    "$100",     
    "$200",     
    "$300",     
    "$500",     
    "$1,000",    
    "$2,000",    
    "$4,000",    
    "$8,000",    
    "$16,000",   
    "$32,000",   
    "$64,000",   
    "$125,000",  
    "$250,000",  
    "$500,000",  
    "$1 MILLION" 
  ];
  

  function startGame(time){
    setStart(true);
    setTime(time);
    console.log("activated!");
    fetchData();
  }
  function nextQuestion(){
    console.log("Next!!");
    setQuestions(questions.slice(1));
  }

  async function fetchData(){
      fetch("https://opentdb.com/api.php?amount=15&type=multiple").then(r=>r.json()).then(r=>{setQuestions(r.results), console.log(r.results)}).catch(e=>console.log(e));
  }

  return (
    <>
      <Dialog start={startGame}></Dialog>
      <div className='menu h-screen bg-yellow-50 flex justify-center gap-5 items-center flex-col'>
        
        <div>Big show</div>
        {start && questions ? <>
        <QuestionBlock questionData={questions[0]} next={nextQuestion} number={16-questions.length} restart={startGame} prices={prices} time={time}/>
        </>
        : null}
      </div>
    </>
  )
}

function QuestionBlock({questionData, next, number, restart, prices, time}){
  const navigate = useNavigate();

  const [hiddenIndex, setHiddenIndex] = useState(null);
  const [paused, setPaused] = useState(false);
  const [onReset, setOnReset] = useState(false);
  const [powerUp1, setPowerUp1] = useState(true);
  const [powerUp2, setPowerUp2] = useState(true);
  const [powerUp3, setPowerUp3] = useState(true);
  const [powerUp4, setPowerUp4] = useState(true);


  const [correct, setCorrect] = useState(null);

  const options = (questionData) ? [questionData.correct_answer, ...questionData.incorrect_answers] : [];
  const [answers, setAnswers] = useState(options);

  useEffect(() => {
    setAnswers(options);
    setPaused(false);
    setOnReset(!onReset);
  }, [questionData]);


  function optionClick(correct){
    if(correct){
      console.log("Correct!");
      setCorrect(true);
    }else{
      console.log("Bad!");
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
  }

  return(
      questionData==null ? 
      <>
        <h1 className='text-center text-4xl'>🎉 Congratulations! You have just won $100! 🎉</h1>
        <button className="w-full text-2xl px-5 py-3 bg-orange-400 text-white font-semibold rounded-lg shadow-md  focus:outline-none focus:ring-2 focus:ring-yellow-500 hover:bg-orange-600" onClick={() => navigate('/')} >Back to the menu</button>
      </> : 

      <div className='flex flex-col items-center gap-7 w-11/12' >
      {time!=-1 ? <Timer initialTime={time} onTimeUp={()=>optionClick(false)} paused={paused} onReset={onReset}></Timer> : null}
      <h2 className='text-3xl'>Question {number} - For {prices[number-1]}:</h2>
      <h1 className='text-center text-4xl'>{he.decode(questionData.question)}</h1>
      <div className='grid grid-cols-2 grid-rows-2 gap-6 w-full'>
      {
        answers.map((answer, i) => {
          if(answer == questionData.correct_answer){
            return <button disabled={correct !== null} className={`w-full text-2xl px-5 py-3  text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-500 ${(correct!=null) ? "bg-green-400" : "bg-yellow-500 hover:bg-yellow-600"}`} onClick={()=>optionClick(true)} key={uuidv4()}>{he.decode(answer)}</button>
          }else if(i == hiddenIndex){
            return <button disabled className={`w-full text-2xl px-5 py-3 text-white font-semibold rounded-lg shadow-md invisible`} key={uuidv4()}></button>
          }
          else{
            return <button disabled={correct !== null} className={`w-full text-2xl px-5 py-3 text-white font-semibold rounded-lg shadow-md  focus:outline-none focus:ring-2 focus:ring-yellow-500 ${(correct==false) ? "bg-red-400" : "bg-yellow-500 hover:bg-yellow-600"}`} onClick={()=>optionClick(false)} key={uuidv4()}>{he.decode(answer)}</button>
          }
          
        })
      } 
      </div>
      {
      correct==true ? 
      <button className="w-full text-2xl  px-5 py-3 bg-blue-400 text-white font-semibold rounded-lg shadow-md  focus:outline-none focus:ring-2 focus:ring-yellow-500 hover:bg-blue-600" onClick={()=>{next(), setCorrect(null), setHiddenIndex(null)}} >Next!</button> 
      : correct == false ?
      <>
        <button className="w-full text-2xl px-5 py-3 bg-blue-400 text-white font-semibold rounded-lg shadow-md  focus:outline-none focus:ring-2 focus:ring-yellow-500 hover:bg-blue-600" onClick={()=>{restart(), setCorrect(null), setHiddenIndex(null), setPowerUp1(true), setPowerUp2(true), setPowerUp3(true)}} >Try again</button>
        <button className="w-full text-2xl px-5 py-3 bg-blue-400 text-white font-semibold rounded-lg shadow-md  focus:outline-none focus:ring-2 focus:ring-yellow-500 hover:bg-blue-600" onClick={() => navigate('/')} >Back to the menu</button>
      </> : null
      }
      <h2 className='text-blue-500 text-2xl'>Power ups</h2>
      <div className='flex gap-3'>
        { powerUp1 && time!=-1? <button className='bg-blue-500 px-5 py-3 text-white font-semibold rounded-lg focus:outline-none shadow-md hover:bg-blue-600' onClick={()=>{setPaused(true), setPowerUp1(false)}}>Freeze time</button> : null }
        { powerUp2 ? <button className='bg-blue-500 px-5 py-3 text-white font-semibold rounded-lg focus:outline-none shadow-md hover:bg-blue-600' onClick={()=>deleteAnwer()}>Delete one answer</button> : null }
        { powerUp3 ? <button className='bg-blue-500 px-5 py-3 text-white font-semibold rounded-lg focus:outline-none shadow-md hover:bg-blue-600' onClick={()=>{optionClick(true), setPowerUp3(false)}}>Skip question</button> : null }
        
      </div>
      
    </div>

    );
}

function Dialog({start}){
  const [open, setOpen] = useState(true);
  const [selectedTime, setSelectedTime] = useState(30);

  const handleChange = (event) => {
    setSelectedTime(event.target.value);
  };

  function saveConfig(){
    setOpen(!open);
    console.log("time:" + selectedTime);
    start(selectedTime);
  }
  return(
    <dialog open={open} className='backdrop:bg-black/50 backdrop:backdrop-blur-sm p-0 bg-transparent w-full max-w-lg rounded-lg shadow-xl m-auto'>
            <div className="bg-white rounded-lg p-6">
              <h1 className='text-4xl'>Configuration</h1>
              <div className='flex flex-col'>
                <h2 className='text-2xl'>Set time for each question:</h2>
                <label className='flex items-center gap-1'>
                  <input type="radio" name="time" value={30} onChange={handleChange}/>
                  30 seconds
                </label>
                <label className='flex items-center gap-1'>
                  <input type="radio" name="time" value={60} defaultChecked onChange={handleChange}/>
                  1 minute
                </label>
                <label className='flex items-center gap-1'>
                  <input type="radio" name="time" value={120} onChange={handleChange}/>
                  2 minutes
                </label>
                <label className='flex items-center gap-1'>
                  <input type="radio" name="time" value={-1} onChange={handleChange}/>
                  No limit
                </label>
                <button className=' text-2xl w-64 px-5 py-3 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500' onClick={()=>saveConfig()}>Start</button>
              </div>
            </div>
        </dialog>
  )
}
export default BigShow