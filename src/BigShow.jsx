import { useEffect, useState } from 'react'
import he from 'he';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import Timer from './Timer.jsx';
import LoadingGif  from './assets/loading.gif'

let lastTime = null;
let lastCategory = "any";
let lastDifficulty = "any";

function BigShow() {
  const [start, setStart] = useState(false);
  const [time, setTime] = useState(lastTime);
  const [category, setCategory] = useState(lastCategory);
  const [difficulty, setDifficulty] = useState(lastDifficulty);
  const [questions, setQuestions] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
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
  const categoryNames = {
    "any": "All Categories",
    "9": "General Knowledge",
    "10": "Books",
    "11": "Movies",
    "12": "Music",
    "13": "Musicals & Theatres",
    "14": "TV Shows",
    "15": "Video Games",
    "16": "Board Games",
    "17": "Science & Nature",
    "18": "Computers",
    "19": "Math",
    "20": "Mythology",
    "21": "Sports",
    "22": "Geography",
    "23": "History",
    "24": "Politics",
    "25": "Art",
    "26": "Famous People",
    "27": "Animals",
    "28": "Vehicles",
    "29": "Comics",
    "30": "Gadgets",
    "31": "Anime & Manga",
    "32": "Cartoons",
  };
  
  useEffect(() => {
    if (start) {
      fetchData();
    }
  }, [category, start, refreshTrigger]);

  function startGame(time, selectedCategory, selectedDifficulty){
    setStart(true);
    if(time != undefined){
      setTime(time);
      lastTime = time;
    }
    if(selectedDifficulty != undefined){
      setDifficulty(selectedDifficulty);
      lastDifficulty = selectedDifficulty;
    }
    if(selectedCategory != undefined){
      setCategory(selectedCategory);
      lastCategory = selectedCategory;
    }else{
      setRefreshTrigger(prev => prev + 1);
    }

    
  }
  function nextQuestion(){
    console.log("Next!!");
    setQuestions(questions.slice(1));
  }


  async function fetchData(){
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      let url = "https://opentdb.com/api.php?amount=15&type=multiple" + ((category != "any" && category!= undefined) ? ("&category=" + category) : "");
      url = url + ((difficulty != "any" && difficulty != undefined) ? ("&difficulty=" + difficulty) : "");
      console.log("url: " + url);
      fetch(url).then(r=>r.json()).then(r=>{setQuestions(r.results), console.log(r.results), setIsLoading(false)}).catch(e=>console.log(e));
  }

  return (
    <>
      <Dialog start={startGame}></Dialog>
      <div className='menu h-screen bg-yellow-50 flex justify-center gap-5 items-center flex-col'>
        {isLoading && <img src={LoadingGif} alt="Loading..." className='select-none w-[30%] h-[50%]'/>}
        
        {start && questions ? <>
        {category != "any" ?
          <h2 className='text-3xl'><strong>Category: </strong> {categoryNames[category]}</h2>: 
          null
        }
        {difficulty != "any" ?
          <h2 className='text-3xl'><strong>Difficulty: 🧠</strong>{difficulty}</h2> : 
          null
        }
        {!isLoading ? <QuestionBlock questionData={questions[0]} next={nextQuestion} number={16-questions.length} restart={startGame} prices={prices} time={time} key={uuidv4()}/> : null}
        </>
        : null}
      </div>
    </>
  )
}
let powerUps = {
  1 : true,
  2 : true,
  3 : true,
  4 : true,
}
function QuestionBlock({questionData, next, number, restart, prices, time}){
  const navigate = useNavigate();

  const [hiddenIndex, setHiddenIndex] = useState(null);
  const [paused, setPaused] = useState(false);
  const [onReset, setOnReset] = useState(false);
  const [powerUp1, setPowerUp1] = useState(powerUps[1]);
  const [powerUp2, setPowerUp2] = useState(powerUps[2]);
  const [powerUp3, setPowerUp3] = useState(powerUps[3]);
  const [powerUp4, setPowerUp4] = useState(powerUps[4]);
  const [askTheAudience, setAskTheAudience] = useState(false);

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
    setAnswers(options);
    setPaused(false);
    setOnReset(!onReset);
    setAskTheAudience(false);
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
    powerUps[2]=false;
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
        <button className="w-full text-2xl px-5 py-3 bg-blue-400 text-white font-semibold rounded-lg shadow-md  focus:outline-none focus:ring-2 focus:ring-yellow-500 hover:bg-blue-600" onClick={()=>{restart(), setCorrect(null), setHiddenIndex(null), powerUps = { 1 : true, 2 : true, 3 : true, 4 : true }}} >Try again</button>
        <button className="w-full text-2xl px-5 py-3 bg-blue-400 text-white font-semibold rounded-lg shadow-md  focus:outline-none focus:ring-2 focus:ring-yellow-500 hover:bg-blue-600" onClick={() => navigate('/')} >Back to the menu</button>
      </> : null
      }
      {(powerUp1 || powerUp2 || powerUp3 || powerUp4) && correct!=false ? <h2 className='text-blue-500 text-3xl'>Power ups</h2> : null}
      {
        correct!=false ? 
        <div className='flex gap-3'>
          { powerUp1 && time!=-1? <button className='bg-blue-500 px-5 py-3 text-white font-semibold rounded-lg focus:outline-none shadow-md hover:bg-blue-600' onClick={()=>{setPaused(true), setPowerUp1(false), powerUps[1]=false}}>Time-Out</button> : null }
          { powerUp2 ? <button className='bg-blue-500 px-5 py-3 text-white font-semibold rounded-lg focus:outline-none shadow-md hover:bg-blue-600' onClick={()=>deleteAnwer()}>Delete one answer</button> : null }
          { powerUp3 ? <button className='bg-blue-500 px-5 py-3 text-white font-semibold rounded-lg focus:outline-none shadow-md hover:bg-blue-600' onClick={()=>{optionClick(true), setPowerUp3(false), powerUps[3]=false}}>Skip question</button> : null }
          { powerUp4 ? <button className='bg-blue-500 px-5 py-3 text-white font-semibold rounded-lg focus:outline-none shadow-md hover:bg-blue-600' onClick={()=>{setAskTheAudience(true), setPowerUp4(false), powerUps[4]=false}}>Ask the Audience</button> : null }
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

function Dialog({start}){
  const [open, setOpen] = useState(true);
  const [selectedTime, setSelectedTime] = useState(30);
  const [selectedCategory, setSelectedCategory] = useState("any");
  const [selectedDifficulty, setSelectedDifficulty] = useState("any");


  const handleChange = (event) => {
    setSelectedTime(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleDifficultyChange = (event) => {
    setSelectedDifficulty(event.target.value);
  };

  function saveConfig(){
    setOpen(!open);
    console.log("time:" + selectedTime);
    console.log("category: " + selectedCategory);
    start(selectedTime, selectedCategory, selectedDifficulty);
  }
  return(
    <dialog open={open} className='backdrop:bg-black/50 backdrop:backdrop-blur-sm p-0 bg-transparent w-full max-w-lg rounded-lg shadow-xl mt-10 '>
            <div className="bg-white rounded-lg p-6 h-full w-full flex flex-col justify-center">
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

                <h2 className='text-2xl'>Select Category:</h2>
                <select name="trivia_category" className='pt-2 pb-2 w-full border border-yellow-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 mb-6' onChange={handleCategoryChange}>
                  <option value="any">All Categories</option>
                  <option value="9">General Knowledge</option>
                  <option value="10">Books</option>
                  <option value="11">Movies</option>
                  <option value="12">Music</option>
                  <option value="13">Musicals & Theatres</option>
                  <option value="14">TV Shows</option>
                  <option value="15">Video Games</option>
                  <option value="16">Board Games</option>
                  <option value="17">Science & Nature</option>
                  <option value="18">Computers</option>
                  <option value="19">Math</option>
                  <option value="20">Mythology</option>
                  <option value="21">Sports</option>
                  <option value="22">Geography</option>
                  <option value="23">History</option>
                  <option value="24">Politics</option>
                  <option value="25">Art</option>
                  <option value="26">Famous People</option>
                  <option value="27">Animals</option>
                  <option value="28">Vehicles</option>
                  <option value="29">Comics</option>
                  <option value="30">Gadgets</option>
                  <option value="31">Anime & Manga</option>
                  <option value="32">Cartoons</option>
                </select>
                <h2 className='text-2xl'>Select Difficulty:</h2>

                <select name="trivia_difficulty" className="pt-2 pb-2 w-full border border-yellow-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 mb-6" onChange={handleDifficultyChange}>
                  <option value="any">Surprise Me!</option>
                  <option value="easy">Beginner</option>
                  <option value="medium">Intermediate</option>
                  <option value="hard">Expert</option>
                </select>

                

                <button className=' text-2xl w-64 px-5 py-3 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500' onClick={()=>saveConfig()}>Start</button>
              </div>
            </div>
        </dialog>
  )
}
export default BigShow