import { useState, useEffect } from "react";
import {
    FormControl,
    TextField,
    Button,
    Box,
    Stack,
    Paper,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const API = 'http://localhost:8080';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    width: '100%',
    padding: theme.spacing(1),
    textAlign: 'left',
}));


function StorageToDo() {
    const [allNotes, setAllNotes] = useState([]);
    const [notes, setNotes] = useState('');

    const fetchAllNotes = async () => {
        const data = await fetch(`${API}/getNotes`);
        const notesData = await data.json();

        setAllNotes(notesData);
    }


    useEffect(() => {
        fetchAllNotes()
    }, []);

    // save single notes
    const createNotes = (e) => {
        setNotes(e.target.value);
    }

    // call api to save notes
    const addNotes = () => {
        fetch(`${API}/addNotes`, {
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({ notes })
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
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            method: "DELETE",
            body: JSON.stringify({ id })
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
        <FormControl fullWidth sx={{ m: 1 }} variant="filled">
            <TextField id="standard-basic" label="Create notes" variant="standard" value={notes} onChange={(e) => createNotes(e)} />
        </FormControl>
        <Button sx={{ marginLeft: '8px', marginTop: '12px' }} variant="contained" onClick={() => addNotes()}>Add Notes</Button>

        {allNotes.length ? renderNotes() : null}
    </>)
}

export default StorageToDo;