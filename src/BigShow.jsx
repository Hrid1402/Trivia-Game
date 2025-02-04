import { useEffect, useState } from 'react'
import {Link} from 'react-router-dom'
import Dialog from './Dialog.jsx'
import QuestionBlock from './QuestionBlock.jsx'
import LoadingGif  from './assets/loading.gif';
import loadingSong from './assets/loadingSong.mp3'

const loadingTheme = new Audio(loadingSong);

loadingTheme.loop = true;

let lastTime = null;
let lastCategory = "any";
let lastDifficulty = "any";


function BigShow() {
  const [start, setStart] = useState(false);
  const [time, setTime] = useState(lastTime);
  const [category, setCategory] = useState(lastCategory);
  const [difficulty, setDifficulty] = useState(lastDifficulty);
  const [questions, setQuestions] = useState(null);
  const [error, setError] = useState(false);
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
      loadingTheme.play();
      await new Promise(resolve => setTimeout(resolve, 3000));
      let url = "https://opentdb.com/api.php?amount=15&type=multiple" + ((category != "any" && category!= undefined) ? ("&category=" + category) : "");
      url = url + ((difficulty != "any" && difficulty != undefined) ? ("&difficulty=" + difficulty) : "");
      try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        if(data.results.length == 0){
          console.log('Error: No questions available with the selected characteristics.');
          setError(true);
        }else{
          setQuestions(data.results);
        }
      } catch (error) {
        console.log("Error fetching trivia questions", e);
      }finally{
        setIsLoading(false);
        loadingTheme.pause();
      }
  }

  return (
    <>
      {!start && !questions ?
      <div className='h-screen flex justify-content items-center bg-yellow-50'>
        <Dialog start={startGame}></Dialog>
      </div>
      :
      <div className={`menu ${questions ? 'h-full' : 'h-screen'} bg-yellow-50 flex justify-center gap-5 items-center flex-col`}>
        {
        error ? 
        <>
          <h1 className='text-4xl w-full text-center'>Error</h1>
          <h2 className='text-3xl w-full text-center'>No questions available with the selected characteristics.</h2>
          {category != "any" ?
            <h2 className='text-3xl w-full text-center'><strong>Category: </strong> {categoryNames[category]}</h2>: 
            null
          }
          {difficulty != "any" ?
            <h2 className='text-3xl w-full text-center'><strong>Difficulty: </strong>🧠{difficulty}</h2> : 
            null
          }
          <Link to='/' className='w-full text-2xl max-w-64 px-5 py-3 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-center'><button>Go back</button></Link>
        </>
        
        : 
        isLoading ?
        <>
          <img src={LoadingGif} alt="Loading..." className='select-none max-w-[600px] w-full max-h-screen object-cover'/>
          {category != "any" ?
          <h2 className='text-3xl w-full text-center'><strong>Category: </strong> {categoryNames[category]}</h2>: 
          null
          }
          {difficulty != "any" ?
            <h2 className='text-3xl w-full text-center'><strong>Difficulty: </strong>🧠{difficulty}</h2> : 
            null
          }
        </>
          : questions ? <QuestionBlock totalQuestions={questions.length} questionData={questions[0]} next={nextQuestion} number={16-questions.length} restart={startGame} prices={prices} time={time}/> : null
        }
      </div>
      }
    </>
  )
}
export default BigShow