import React from 'react'
import { Column, Notification, Box, Table, Subtitle } from 'bloomer';

const TableRows = ( {parts} ) => {
  const partList = parts.map( data => {
      return (
        <tr key={data.id}>
            <th>{data.name}</th>
            <th>{data.exercises}</th>
        </tr>
      )
  })
  return  (
    <>{partList}</>
  )
}

const Total = ({parts}) => {
  const exercises = parts.map( data => data.exercises).reduce((a, b) => a + b, 0)
  return (
      <Column>
          <Notification>Number of exercises {exercises}</Notification>
      </Column>
  )
}

const course = ({courseInfo}) => {
    console.log(courseInfo);
    const {name, id, parts} = courseInfo
    console.log(name, id, parts);
    return (
        <Column isSize='1/2'>
            <Box>
                <Column>
                    <Subtitle>{name}</Subtitle>
                    <Table isFullWidth>
                        <tbody><TableRows parts={parts} /></tbody>
                    </Table>
                    <Total parts={parts}/>
                </Column>
            </Box>
        </Column>
    )
}

export default course
