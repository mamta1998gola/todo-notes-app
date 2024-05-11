import { useContext } from 'react';
import { MyContext } from '../MyContext';

const UserGreeting = () => {
    const { user } = useContext(MyContext);

    return (
        user.username ? <h2 style={{ margin: '20px auto', textAlign: 'center' }}>{`Welcome ${user.username}`}</h2> : null
    )
}

export default UserGreeting;
