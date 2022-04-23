import React from 'react'
import Todo from './Todo'

export default function Directory({ todosList }) {
    return (

        todosList.map(todo => {
            return <Todo key={todo.id} todo={todo}/>
        })

    )
}