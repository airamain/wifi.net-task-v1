import React from 'react'
import { auth } from '../firebase'
import { withRouter } from 'react-router-dom'
import Firestore from './Firestore'

const Admin = (props) => {

    const [user, setUser] = React.useState(null)

    React.useEffect(() => {
        if (auth.currentUser) {
            console.log("usuario existe");
            setUser(auth.currentUser)
        } else {
            console.log("no existe usuario registrado");
            props.history.push('/login')
        }
    }, [props.history])
    return (
        <div>
            <h2>Ruta protegida admin</h2>
            {
                user && (
                    <Firestore user={user}/> 
                )
            }
        </div>
    )
}

export default withRouter(Admin)
