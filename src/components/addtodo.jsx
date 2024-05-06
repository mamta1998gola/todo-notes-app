
import { useState } from 'react';
import {
    FormControl,
    TextField,
    Button,
} from '@mui/material';

const API = 'http://localhost:8080';

export default function BasicTextFields({ fetchAllTodos }) {
    const [todo, setTodo] = useState('');

    const createTodo = (e) => {
        setTodo(e.target.value);
    }

    const addTodos = () => {
        fetch(`${API}/addtodo`, {
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({ todo })
        })
            .then(() => {
                fetchAllTodos();
                setTodo('');
            })
            .catch(err => {
                throw new Error(err)
            })
    }

    return (
        <>
            <FormControl fullWidth sx={{ m: 1 }} variant="filled">
                <TextField id="standard-basic" label="Create to do" variant="standard" value={todo} onChange={(e) => createTodo(e)} />
            </FormControl>
            <Button sx={{ marginLeft: '8px', marginTop: '12px' }} variant="contained" onClick={() => addTodos()}>Add</Button>
        </>
    );
}
