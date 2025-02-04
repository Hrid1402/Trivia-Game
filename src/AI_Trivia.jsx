import React, { useState } from 'react'
import QuestionBlock from './QuestionBlock.jsx'
import {responseAI} from './AI.js'
import LoadingGif  from './assets/loading.gif'
import extractTextFromPDF from "pdf-parser-client-side";
import loadingSong from './assets/loadingSong.mp3'

const loadingTheme = new Audio(loadingSong);

loadingTheme.loop = true;

let totalQuestions = 0;
function AI_Trivia() {
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState(null);
    const [selectedTime, setSelectedTime] = useState(60);
    const [selectedDifficulty, setSelectedDifficulty] = useState("Progressive");
    const [selectedLanguage, setSelectedLanguage] = useState("English");
    const [topic, setTopic] = useState('');
    const [fileName, setFileName] = useState(null);

    const handleChange = (event) => {
        setSelectedTime(event.target.value);
      };

    const handleDifficultyChange = (event) => {
        setSelectedDifficulty(event.target.value);
    };
    const handleLanguageChange = (event) =>{
        setSelectedLanguage(event.target.value);
    }
    

    const prices = [
        "$100",
        "$500",
        "$1,000",
        "$4,000",
        "$16,000",
        "$32,000",
        "$64,000",
        "$125,000",
        "$500,000",
        "$1 MILLION"
    ];

    function nextQuestion(){
        setQuestions(questions.slice(1));
    }

    async function generateTrivia(){
        console.log("generating...");
        setLoading(true)
        loadingTheme.play();
        try {
            const questions = await responseAI(10, topic, `'${selectedDifficulty}'`, selectedLanguage);
            setQuestions(questions.results);
            totalQuestions = questions.results.length;
        } catch (error) {
            console.log("Error generating trivia", error);
        }finally{
            setLoading(false);
            loadingTheme.pause();
        }
    }

    async function handleFileChange(e){
        const file = e.target.files?.[0];
        if (!file) { return }
        if(file.type !== 'application/pdf'){
            alert('Oops! Only PDF files are allowed. Please try again.');
            return
        }
        const filename = file.name;
        setFileName(filename);
        try {
            const text = await extractTextFromPDF(file, "alphanumericwithspaceandpunctuation");
            setTopic("the next document content:\n" + text);
            
        } catch (error) {
            alert("Error extracting data from PDF");
            console.error("Error extracting text from PDF:", error);
            }
    }


  return (
   <div className='menu p-4 h-screen bg-yellow-50 flex flex-col justify-center items-center gap-5' >
   {
    loading ?
        <>
            <img src={LoadingGif} alt="Loading..." className='select-none max-w-[600px] w-full max-h-screen object-cover'/>
            <h2 className='text-3xl w-full text-center'>🤖{fileName ??  topic}</h2> : 
        </>
    :
    !questions ?
        <>
            <h1 className=' text-center text-orange-950 text-4xl'>AI Trivia!</h1>
            <h2 className=' text-center text-orange-800 text-2xl'>Create a trivia about anything using AI! </h2>
            {!fileName ? 
            <input placeholder='Write here!' value={topic} onChange={e=>setTopic(e.target.value)} type="text" className='max-w-[300px] w-full px-4 py-2 text-lg border-2 border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500'/>
                :
                <h2 className='text-center font-semibold'>{fileName} selected!</h2>
            }
            {
                fileName ? 
                <button onClick={()=>{setTopic(''),setFileName(null)}} className='bg-red-400 text-white py-2 px-4 rounded-lg hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-600'>Remove file</button>
                :
                
                <div className="flex items-center justify-center w-full">
                <label
                    htmlFor="file-upload"
                    className="px-6 py-3 bg-yellow-500 text-white rounded-lg shadow-md cursor-pointer hover:bg-yellow-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                    From file 📄
                </label>
                <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    onChange={(e) => handleFileChange(e)}
                />
            </div>

            }
            
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
                  <h2 className='text-2xl'>Select Difficulty:</h2>
  
                  <select name="trivia_difficulty" className="pt-2 pb-2 w-full border border-yellow-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 mb-6" onChange={handleDifficultyChange}>
                    <option value="Progressive">Progressive</option>
                    <option value="easy">Beginner</option>
                    <option value="medium">Intermediate</option>
                    <option value="hard">Expert</option>
                  </select>

                  <h2 className='text-2xl'>Select Language:</h2>
                  <select
                    name="trivia_language"
                    className="pt-2 pb-2 w-full border border-yellow-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 mb-6"
                    onChange={handleLanguageChange}
                    >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                    <option value="zh">中文</option>
                    <option value="ja">日本語</option>
                    <option value="ru">Русский</option>
                    <option value="pt">Português</option>
                    <option value="ar">العربية</option>
                    <option value="hi">हिन्दी</option>
                    </select>
                </div>
            <button onClick={()=>generateTrivia()} disabled={!topic && fileName==null} className='disabled:pointer-events-none disabled:bg-orange-200 ml-4 px-6 py-2 text-lg bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500'>Create</button>
        </>
    : 
    <QuestionBlock totalQuestions={totalQuestions} questionData={questions[0]} next={nextQuestion} number={totalQuestions+1-questions.length} restart={()=>generateTrivia()} prices={prices} time={selectedTime}/>
   }
   </div>
    
  )
}

export default AI_Trivia