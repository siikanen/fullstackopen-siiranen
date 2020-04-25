import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Button = ({ onClick, text }) => (
  <button onClick={onClick}>
    {text}
  </button>
)

const anecdotes = [
  'If it hurts, do it more often',
  'A primary cause of complexity is that software vendors uncritically adopt almost any feature that users want.',
  'Programming can be fun, so can cryptography; however they should not be combined.',
  'Adding manpower to a late software project makes it later!',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'I have always found that plans are useless, but planning is indispensable.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]


const getRandomInt = (max) => Math.floor(Math.random() * max)


const App = (props) => {
  const [selected, setSelected] = useState(getRandomInt(props.anecdotes.length))
  const [points, setPoints] = useState(Array.from({length: props.anecdotes.length}, () => 0))

  const addVote = () => {
    const newPoints = [...points]
    newPoints[selected] += 1
    setPoints(newPoints)    
  }
  
  const mostVotes = points.indexOf(Math.max(...points))

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>{props.anecdotes[selected]}</p>
      <p>has {points[selected]} votes</p>
      <Button onClick={addVote} text={"vote"} />
      <Button onClick={() => setSelected(getRandomInt(props.anecdotes.length))}
            text={"next anecdote"} />
      <h1>Anecdote with most votes</h1>
      <p>{anecdotes[mostVotes]}</p>
      <p>has {points[mostVotes]} points</p>
    </div>
  )
}

ReactDOM.render(
  <App anecdotes={anecdotes} />,
  document.getElementById('root')
)












