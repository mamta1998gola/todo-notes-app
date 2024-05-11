import { Navigate } from 'react-router-dom';

const PrivateRoutes = ({ children }) => {

    let token = sessionStorage.getItem('token');

    return (
        token ? <div>{ children }</div> : <Navigate to='/' />
    )
}

export default PrivateRoutes;
