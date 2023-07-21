import React, { useEffect, useState } from "react";
import Die from "./dieComponent";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

export default function App() {
  const [totalMoves, setTotalMoves] = useState(-1);

  const [dice, setDice] = useState(allNewDice());
  const [tenzies, setTenzies] = useState(false);
  useEffect(() => {
    setTotalMoves(-1);
  }, []);

  const holdDice = (id) => {
    setDice((prevDice) => {
      return prevDice.map((die) => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
      });
    });
  };

  useEffect(() => {
    setTotalMoves((prevMoves) => prevMoves + 1);
    const allHeld = dice.every((die) => die.isHeld);
    const firstValue = dice[0].value;
    const allSameValue = dice.every((die) => die.value === firstValue);
    if (allHeld && allSameValue) {
      setTenzies(true);
    }
  }, [dice]);

  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push({
        value: Math.ceil(Math.random() * 6),
        isHeld: false,
        id: nanoid(),
      });
    }
    return newDice;
  }
  function saveToLocalStorage(moves) {
    localStorage.setItem("New Best Total Moves", moves);
    const newTotalMoves = moves;
    const prevTotalMoves = localStorage.getItem("New Best Total Moves");
    if (newTotalMoves < prevTotalMoves) {
      localStorage.setItem("New Best Total Moves", moves);
    }
  }
  function rollDice() {
    if (!tenzies) {
      setDice((prevDice) =>
        prevDice.map((die) =>
          die.isHeld
            ? die
            : { ...prevDice, value: Math.ceil(Math.random() * 6), id: nanoid() }
        )
      );
    } else {
      setDice(allNewDice());
      saveToLocalStorage(totalMoves);
      setTotalMoves(-1);
      setTenzies(false);
    }
  }

  const diceElements = dice.map((die) => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      handleClick={() => holdDice(die.id)}
    />
  ));

  return (
    <main>
      <h1 className="title">Tenzies</h1>
      <h2 className="tot-moves">Total Moves : {totalMoves}</h2>
      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>
      <div className="dice-container">{diceElements}</div>
      <button className="roll-dice" onClick={rollDice}>
        {tenzies ? "Play Again" : "Roll"}
      </button>
      {tenzies && <Confetti />}
    </main>
  );
}
