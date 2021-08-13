import React from 'react'
import { auth } from '../firebase'
import { withRouter } from 'react-router-dom'

const Reset = (props) => {

    const [email, setEmail] = React.useState("")
    const [pass, setPass] = React.useState("")
    const [error, setError] = React.useState(null)

    const procesarDatos = e => {
        e.preventDefault()

        if (!email.trim()) {
            setError("ingrese email")
            return
        }
        setError(null)
        sendEmailReset()
    }

    const sendEmailReset = React.useCallback(async () => {
        try {
            await auth.sendPasswordResetEmail(email)
            console.log('correo enviado');
            props.history.push('/login')
            // .then(()=>{

            // })

        } catch (error) {
            console.log(error);
            setError(error.message)
        }
    }, [email, props.history])
    return (
        <div className="mt-5">
            <h3 className="text-center">
                Recuperar contraseña
            </h3>
            <hr />
            <div className="row justify-content-center">
                <div className="col-12 col-sm-8 col-md-6 col-xl-4">
                    <form onSubmit={procesarDatos}>
                        <input
                            type="email"
                            className="form-control mb-2"
                            placeholder="ingrese email"
                            onChange={e => setEmail(e.target.value)}
                            value={email}
                        />
                        <div className="row">
                            <button
                                className="btn btn-dark btn-lg btn-block mb-2"
                                type="submit"                            >
                                Enviar correo
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default withRouter(Reset)
