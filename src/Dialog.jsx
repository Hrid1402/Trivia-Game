import React, {useState} from 'react'

export function Dialog({start}){
    const [open, setOpen] = useState(true);
    const [selectedTime, setSelectedTime] = useState(60);
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
      <dialog open={open} className='backdrop:bg-black/90 backdrop:backdrop-blur-sm p-0 bg-transparent w-full max-w-lg rounded-lg shadow-xl mt-10 '>
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
                    <option value="any">All</option>
                    <option value="easy">Beginner</option>
                    <option value="medium">Intermediate</option>
                    <option value="hard">Expert</option>
                  </select>
  
                  
  
                  <button className='w-full text-2xl w-64 px-5 py-3 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500' onClick={()=>{saveConfig()}}>Start</button>
                </div>
              </div>
          </dialog>
    )
  }

export default Dialog