import React from 'react'
import ReactDOM from 'react-dom'

const Header = (props) => <h1>{props.course}</h1>

const Part = (props) => (
    <p>{props.info.name} {props.info.exercises}</p>
)

const Content = ( {parts} ) => {
  const partList = parts.map( data => <Part info={data} />)
  return  (
    <> {partList} </>
  )
}

const Total = (props) => {
  const parts = props.parts
  const exercises = parts.map( data => data.exercises).reduce((a, b) => a + b, 0)
  return (
     <p>Number of exercises {exercises}</p>
  )
}

const App = () => {
    const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
   <div>
      <Header course={course.name} />
      <Content parts={course.parts}/>
      <Total parts={course.parts} />
    </div> 
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
