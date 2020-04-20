import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const Statistics = ({statistics}) => {
  if ( statistics.all === 0 ) 
    return (
      <>
      <h1>Statistics</h1>
      <p>No feedback given</p>
      </>
    )
  return(
    <>
      <h1>statistics</h1>
      <table>
        <tbody>
          <StatisticLine text="good"     value ={statistics.good} />
          <StatisticLine text="neutral"  value ={statistics.neutral} />
          <StatisticLine text="bad"      value ={statistics.bad} />
          <StatisticLine text="all"      value ={statistics.all} />
          <StatisticLine text="average"  value ={statistics.average} />
          <StatisticLine text="positive" value ={statistics.positive} />
        </tbody>
      </table>
    </>
  )
}

const StatisticLine = ({text,value}) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
} 


const App = () => {
  const [good, setGood] = useState(0)
  const [bad, setBad] = useState(0)
  const [neutral, setNeutral] = useState(0)

  const stats = {
    "good": good,
    "bad": bad,
    "neutral": neutral,
    "all": good + bad + neutral,
    "positive": String(good / (good + bad + neutral) * 100) + "%",
    "average": (good - bad) / (good + bad + neutral) 
  }

  return (
    <>
      <h1>give feedback</h1>
      <Button text="good" handleClick={() => setGood(good + 1)} />
      <Button text="neutral" handleClick={() => setNeutral(neutral + 1)} />
      <Button text="bad" handleClick={() => setBad(bad + 1)} />
      <Statistics statistics={stats} />
    </>
  )
}

ReactDOM.render(<App />, 
  document.getElementById('root')
)