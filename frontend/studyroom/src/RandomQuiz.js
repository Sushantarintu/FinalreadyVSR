import React, { useEffect, useState } from "react";

const RandomQuiz = () => {
    const url = "https://opentdb.com/api.php?amount=10&category=27&difficulty=medium";

    const [data, setData] = useState([]); // Initialize as an empty array
    const [loading, setLoading] = useState(true); // Loading state for better UX
    const [nextQuestion , setNextQuestion] = useState(0);

    const apiData = async () => {
        try {
            const response = await fetch(url); // Fetch data from API
            const realData = await response.json();
            // console.log(realData.results);
            
            setData(realData.results || []); // Update state with results or empty array
            setLoading(false); // Stop loading after data is fetched
        } catch (err) {
            console.error("Error fetching data:", err);
            setLoading(false); // Stop loading even on error
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            apiData(url);
        }, 1000); // Wait for 1 second before making the API call
        return () => clearTimeout(timer); // Cleanup the timeout on unmount
    }, []);

        console.log(data[nextQuestion]);
    
    
    const handleNext = ()=>{
        setNextQuestion(prev => prev + 1);
    }

    const checkAnswer = (e)=>{
        if(e.target.value === data[nextQuestion].correct_answer){
            alert("congrats");
        }
        else{
            alert("Try Again");
        }
    }

    // const searchData = pokemon.filter((CurPokemon)=>{
    //     return CurPokemon.name.toLowerCase().includes(inputData.toLowerCase());
    //    })
    return (
        <div>
            <div className="main">
                <div className="container">
                    <h1>Quiz Questions</h1>
                    {loading ? (
                <p>Loading...</p>
            ) : data.length > 0 ? (
                <ul>
                    {/* <h1>{curVal}</h1> */}
                        <li>
                            <div className="upper_div">
                            <h1><span>{nextQuestion+1} .</span>{data[nextQuestion].question}</h1>
                            </div>
                            <div className="lower_div">
                            {[data[nextQuestion].incorrect_answers, data[nextQuestion].correct_answer]
                                    .sort(() => Math.random() - 0.5) // Randomize options
                                    .map((answer, index) => (
                                        <div key={index}>
                                            <input
                                                type="radio"
                                                id={`answer-${index}`}
                                                name="answer"
                                                value={answer}
                                                onClick={checkAnswer}
                                            />
                                             <label htmlFor={`answer-${index}`}>{answer}</label>
                                            </div>
                                             ))}
                                </div>
                            <div className="third_div">
                                <button onClick={handleNext}>Next</button>
                            </div>
                        </li>
                </ul>
            ) : (
                <p>No data available.</p>
            )}
                </div>
            </div>
        </div>
    );
};

export default RandomQuiz;
