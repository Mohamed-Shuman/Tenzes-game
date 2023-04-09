import React from "react";
import Die from "./components/die";
import { nanoid } from "nanoid";
import Confetti from 'react-confetti'
import Scores from "./components/scores";
import Footer from "./components/footer";
export default function App(){
    const [dice,setDice] = React.useState(allNewDice())
    // check winning
    const [tenzes,setTenzes] = React.useState(false)
    // Create states to hold rolls stats
    const [rolls,setrolls] = React.useState(0)
    const [bestRolls, setBestRolls] = React.useState(
        JSON.parse(localStorage.getItem("bestRolls")) || 0
    );
    const [bestTime, setBestTime] = React.useState(
        JSON.parse(localStorage.getItem("bestTime")) || 0
    );
    React.useEffect(()=>{
        const allHeld = dice.every(die=>die.isHeld)
        const firstValue = dice[0].value
        const allSame = dice.every(die=>die.value === firstValue)
        if(allHeld && allSame){
            setTenzes(true)
            setStart(false)
            setScores()
        }
    },[dice])
    // Create dice object
    function newDiceElements(){
        return{
            value: Math.ceil(Math.random() * 6),
            isHeld:false,
            id: nanoid()
        }
    }
        // create array of object for the dice
    function allNewDice(){
        const newDice =[]
        for(let i=0;i<10;i++){
            newDice.push(newDiceElements())
        }
        return newDice
    }
    // function re-rool the dices 
    function rollDice(){
        increaserolls()
        if(!tenzes){
            setDice(prevDice=>prevDice.map(die=>{
                return die.isHeld? die : newDiceElements()
            }))
        }else{
            setTenzes(false)
            setDice(allNewDice())
            setStart(true);
            setTime(0);
        }
    }
    // function to hold the dice and toggle it
    function holdDice(id){
        setDice(prevDice=>prevDice.map(die=>{
            return die.id===id? {...die, isHeld: !die.isHeld}:die
        }))
    }
    // Map over dices and pass props
    const diceElements= dice.map(die=>(
            <Die key={die.id} value={die.value} isHeld={die.isHeld} holdDice={()=>holdDice(die.id)}/>
        ))
    function increaserolls(){
        if(!tenzes){
            setrolls(prevCount=>prevCount+1)
        }else{
            setrolls(0)
        }
    }
        // ----------------------------TIMER--------------------------------------- //
    const [time, setTime] = React.useState(0);
    const [start, setStart] = React.useState(true);
    React.useEffect(()=>{
        let interval = null
        if(start){
            interval=setInterval(()=>{
                setTime(prevTime=>prevTime+10)
            },10)
        }else{
            clearInterval(interval)
        }
        return () => clearInterval(interval);
    },[start])
    function setScores(){
        if(!bestRolls || rolls < bestRolls){
            setBestRolls(rolls)
        }
        const flooredTime= Math.floor(time / 10)
        if(!bestTime || flooredTime < bestTime){
            setBestTime(flooredTime)
        }
    }
    React.useEffect(()=>{
        window.localStorage.setItem("bestRolls",JSON.stringify(bestRolls))
    },[bestRolls])
    React.useEffect(()=>{
        window.localStorage.setItem("bestTime",JSON.stringify(bestTime))
    },[bestTime])
    return(
        <div className="app-container shadow-shorter">
            <main>
                <h1 className="title">Tenzies</h1>
                <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
                <div className="time-roles">
                    <p># Rolls : {rolls}</p>
                    <p>
                        {/* divide the time by 10 because that is the value of a millisecond
                        then module 1000. Now we will append this to a zero so that when the time starts
                        there will be a zero already instead of just one digit. 
                        Finally we will slice and pass in a parameter of -2 so that when the 
                        number becomes two digits the zero will be removed */}
                        Timer: {("0" + Math.floor((time / 1000) % 60)).slice(-2)}:
                        {("0" + ((time / 10) % 1000)).slice(-2)}
                    </p>
                </div>
                <div className="container">
                    {diceElements}
                    {tenzes&&<Confetti/>}
                    <button className="rollButton" onClick={rollDice}>{tenzes? "New Roll" : "Roll"}</button>
                </div>
                <Scores bestRolls = {bestRolls} bestTime = {bestTime}/>
            </main>
            <Footer/>
        </div>
    )
    
}