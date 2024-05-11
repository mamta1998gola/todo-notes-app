import { useContext, useEffect } from 'react';
import {
    Box,
    Paper,
    Stack,
    Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { MyContext } from '../MyContext';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    width: '100%',
    padding: theme.spacing(1),
    textAlign: 'left',
}));

const API = 'http://localhost:8080';

export default function BasicStack({ allTodos, completedTodos, fetchAllTodos }) {
    const { user } = useContext(MyContext);
    const clearTodos = (e, id, type) => {
        e.preventDefault();

        fetch(`${API}/updateTodos`, {
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            method: "PUT",
            body: JSON.stringify({ id, type, email: user.email })
        })
            .then(() => {
                fetchAllTodos();
            })
            .catch(err => {
                throw new Error(err)
            })
    }

    useEffect(() => {
        fetchAllTodos();
    }, [])

    return (
        <>
            <Box sx={{ width: '100%' }} className="layout-margin">
                <Stack spacing={2}>
                    {
                        allTodos.map(({ id, todo }) => <div key={id} style={{ display: 'flex' }}>
                            <Item>{todo}</Item>
                            <i
                                style={{ marginLeft: '-30px', minWidth: '30px', cursor: 'pointer', marginTop: '10px' }}
                                className="fa fa-times fa-lg" aria-hidden="true"
                                onClick={(e) => clearTodos(e, id, 'all')}
                            />
                        </div>)
                    }
                </Stack>
            </Box>
            {completedTodos.length ?
                <Box sx={{ width: '100%', marginTop: '20px' }} className="layout-margin">
                    <Typography sx={{ marginBottom: '20px', fontWeight: '700' }}>Completed Todos</Typography>
                    <Stack spacing={2}>
                        {
                            completedTodos.map(({ id, todo }) => <div key={id} style={{ display: 'flex' }}>
                                <Item style={{ color: 'green' }}>{todo}</Item>
                                <i
                                    style={{ marginLeft: '-30px', minWidth: '30px', cursor: 'pointer', marginTop: '10px' }}
                                    className="fa fa-trash fa-lg" aria-hidden="true"
                                    onClick={(e) => clearTodos(e, id, 'completed')}
                                />
                            </div>)
                        }
                    </Stack>
                </Box> : null}
        </>
    );
}
