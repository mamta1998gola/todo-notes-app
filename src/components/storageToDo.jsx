import { useState, useEffect, useContext } from "react";
import {
    FormControl,
    TextField,
    Button,
    Box,
    Stack,
    Paper,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { MyContext } from '../MyContext';
import UserGreeting from './userGreetings';

const API = import.meta.env.VITE_API_URL;

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    width: '100%',
    padding: theme.spacing(1),
    textAlign: 'left',
}));

function StorageToDo() {
    const { user, setUser } = useContext(MyContext);
    const [allNotes, setAllNotes] = useState([]);
    const [notes, setNotes] = useState('');

    const fetchAllNotes = () => {
        if (user?.email) {
            fetch(`${API}/getNotes`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ email: user.email })
            })
            .then(res => res.json())
            .then(notesData => {
                setAllNotes(notesData);
            })
        }
    }

    const getUserData = () => {
        try {
            fetch(`${API}/userdata`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ token: JSON.parse(sessionStorage.getItem('token')) ?? '' })
            })
            .then(res => res.json())
            .then(userData => {
                setUser(prev => ({
                    ...prev,
                    email: userData.data.email
                }));
            })
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    }

    useEffect(() => {
        if (user?.email) {
            fetchAllNotes();
        } else {
            getUserData();
        }
    }, [user.email]);

    // save single notes
    const createNotes = (e) => {
        setNotes(e.target.value);
    }

    // call api to save notes
    const addNotes = () => {
        fetch(`${API}/addNotes`, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",
            credentials: 'include',
            body: JSON.stringify({ notes, email: user.email })
        })
            .then(() => {
                fetchAllNotes();
                setNotes('');
            })
            .catch(err => {
                throw new Error(err)
            })
    }

    // clear notes
    const clearNotes = (e, id) => {
        e.preventDefault();

        fetch(`${API}/deleteNotes`, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "DELETE",
            credentials: 'include',
            body: JSON.stringify({ id, email: user.email })
        })
            .then(() => {
                fetchAllNotes();
            })
            .catch(err => {
                throw new Error(err)
            })
    }

    const renderNotes = () => <Box sx={{ width: '100%' }} className="layout-margin">
        <Stack spacing={2}>
            {
                allNotes.map(({ id, notes }) => <div key={id} style={{ display: 'flex' }}>
                    <Item>{notes}</Item>
                    <i
                        style={{ marginLeft: '-30px', minWidth: '30px', cursor: 'pointer', marginTop: '10px' }}
                        className="fa fa-trash fa-lg" aria-hidden="true"
                        onClick={(e) => clearNotes(e, id)}
                    />
                </div>)
            }
        </Stack>
    </Box>;

    return (<>
        <UserGreeting />
        <FormControl fullWidth sx={{ m: 1 }} variant="filled">
            <TextField id="standard-basic" label="Create notes" variant="standard" value={notes} onChange={(e) => createNotes(e)} />
        </FormControl>
        <Button sx={{ marginLeft: '8px', marginTop: '12px' }} variant="contained" onClick={() => addNotes()}>Add Notes</Button>

        {allNotes.length ? renderNotes() : null}
    </>)
}

export default StorageToDo;