
import { useState, useContext } from 'react';
import {
    FormControl,
    TextField,
    Button,
} from '@mui/material';
import { MyContext } from '../MyContext';

const API = import.meta.env.VITE_API_URL;

export default function BasicTextFields({ fetchAllTodos }) {
    const [todo, setTodo] = useState('');
    const { user } = useContext(MyContext);

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
            body: JSON.stringify({ todo, email: user.email })
        })
            .then(() => {
                if(user?.email) fetchAllTodos();
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
