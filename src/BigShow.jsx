import { useState } from 'react'
import he from 'he';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

function BigShow() {
  const [start, setStart] = useState(false);
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
  

  function startGame(){
    setStart(true);
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
        <QuestionBlock questionData={questions[0]} next={nextQuestion} number={16-questions.length} restart={startGame} prices={prices}/>
        </>
        : null}
      </div>
    </>
  )
}

function QuestionBlock({questionData, next, number, restart, prices}){
  const options = [questionData.correct_answer, ...questionData.incorrect_answers];
  const [correct, setCorrect] = useState(null);
  const navigate = useNavigate();

  function optionClick(correct){
    if(correct){
      console.log("Correct!");
      setCorrect(true);
    }else{
      console.log("Bad!");
      setCorrect(false);
    }
  }

  return(
    <div className='flex flex-col items-center gap-7 w-11/12' >
      <h2 className='text-3xl'>Question {number} - For {prices[number-1]}:</h2>
      <h1 className='text-center text-4xl'>{he.decode(questionData.question)}</h1>
      <div className='grid grid-cols-2 grid-rows-2 gap-6 w-full'>
      {
        options.map(option => {
          if(option == questionData.correct_answer){
            return <button disabled={correct !== null} className={`w-full text-2xl px-5 py-3  text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-500 ${(correct!=null) ? "bg-green-400" : "bg-yellow-500 hover:bg-yellow-600"}`} onClick={()=>optionClick(true)} key={uuidv4()}>{he.decode(option)}</button>
          }
          return <button disabled={correct !== null} className={`w-full text-2xl px-5 py-3 text-white font-semibold rounded-lg shadow-md  focus:outline-none focus:ring-2 focus:ring-yellow-500 ${(correct==false) ? "bg-red-400" : "bg-yellow-500 hover:bg-yellow-600"}`} onClick={()=>optionClick(false)} key={uuidv4()}>{he.decode(option)}</button>
        })
      } 
      </div>
      {
      correct==true ? 
      <button className="w-full text-2xl  px-5 py-3 bg-orange-400 text-white font-semibold rounded-lg shadow-md  focus:outline-none focus:ring-2 focus:ring-yellow-500 hover:bg-orange-600" onClick={()=>{next(), setCorrect(null)}} >Next!</button> 
      : correct == false ?
      <>
        <button className="w-full text-2xl px-5 py-3 bg-orange-400 text-white font-semibold rounded-lg shadow-md  focus:outline-none focus:ring-2 focus:ring-yellow-500 hover:bg-orange-600" onClick={()=>{restart(), setCorrect(null)}} >Try again</button>
        <button className="w-full text-2xl px-5 py-3 bg-orange-400 text-white font-semibold rounded-lg shadow-md  focus:outline-none focus:ring-2 focus:ring-yellow-500 hover:bg-orange-600" onClick={() => navigate('/')} >Back to the menu</button>
      </> : null
      }
      
    </div>
  );
}

function Dialog({start}){
  const [open, setOpen] = useState(true);
  const [selectedTime, setSelectedTime] = useState("1m");

  const handleChange = (event) => {
    setSelectedTime(event.target.value);
  };

  function saveConfig(){
    setOpen(!open);
    console.log("time:" + selectedTime);
    start();
  }
  return(
    <dialog open={open} className='backdrop:bg-black/50 backdrop:backdrop-blur-sm p-0 bg-transparent w-full max-w-lg rounded-lg shadow-xl m-auto'>
            <div className="bg-white rounded-lg p-6">
              <h1 className='text-4xl'>Configuration</h1>
              <div className='flex flex-col'>
                <h2 className='text-2xl'>Set time for each question:</h2>
                <label className='flex items-center gap-1'>
                  <input type="radio" name="time" value="30s" onChange={handleChange}/>
                  30 seconds
                </label>
                <label className='flex items-center gap-1'>
                  <input type="radio" name="time" value="1m" defaultChecked onChange={handleChange}/>
                  1 minute
                </label>
                <label className='flex items-center gap-1'>
                  <input type="radio" name="time" value="2m" onChange={handleChange}/>
                  2 minutes
                </label>
                <label className='flex items-center gap-1'>
                  <input type="radio" name="time" value="no" onChange={handleChange}/>
                  No limit
                </label>
                <button className=' text-2xl w-64 px-5 py-3 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500' onClick={()=>saveConfig()}>Start</button>
              </div>
            </div>
        </dialog>
  )
}
export default BigShow