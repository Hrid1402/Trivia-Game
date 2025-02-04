import react, { useEffect } from 'react';
import triviaICON from './assets/triviaICON.png'
import { Link } from 'react-router-dom';

function App() {
  useEffect(() => {
    const audioElements = document.querySelectorAll('audio');

    audioElements.forEach(audio => {
      if (!audio.paused) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
  });

  return (
    <>
      <div className='menu h-screen bg-yellow-50 flex flex-col justify-center items-center gap-5' >
        <img src={triviaICON} className='max-w-[200px]'/>
        <h1 className=' text-center text-orange-950 text-4xl'>TRIVIA TRIVIA!</h1>
        <div className='buttons flex justify-center items-center flex-col gap-3'>
          <Link to={"/BigShow"}><button className=' w-64 px-6 py-3 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500'>Classic Trivia</button></Link>
          <Link to={"/AI-Trivia"}><button className=' w-64 px-6 py-3 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500'>AI Challenge</button></Link>
        </div>
      </div>
      
    </>
  )
}

export default App
