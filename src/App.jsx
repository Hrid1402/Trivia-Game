import { useState } from 'react'
import { Link } from 'react-router-dom';

function App() {
  function bigShow(){
    console.log("Big Show");
  }
  return (
    <>
      <div className='menu h-screen bg-yellow-50 flex flex-col justify-center items-center gap-5' >
        <h1 className=' text-center text-orange-950 text-4xl'>TRIVIA TRIVIA!</h1>
        <div className='buttons flex justify-center items-center flex-col gap-3'>
          <Link to={"/BigShow"}><button className=' w-64 px-6 py-3 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500' onClick={()=>bigShow()}>BIG SHOW</button></Link>
          <button className=' w-64 px-6 py-3 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500'>WHO'S THE BEST?</button>
        </div>
      </div>
      
    </>
  )
}

export default App
