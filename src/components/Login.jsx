import React from 'react'
import { auth, db } from '../firebase'
import { withRouter } from 'react-router-dom'

const Login = (props) => {

    const [email, setEmail] = React.useState("")
    const [pass, setPass] = React.useState("")
    const [error, setError] = React.useState(null)
    const [esRegistro, setEsRegistro] = React.useState(false)

    const clearInput = () => {
        setEmail('')
        setPass('')
    }

    const procesarDatos = e => {
        e.preventDefault()

        if (!email.trim()) {
            setError("ingrese email")
            return
        }
        if (!pass.trim()) {
            setError("ingrese pass")
            return
        }
        if (pass.length < 6) {
            setError("ingrese mas de 6 caracteres")
            return
        }
        setError(null)
        console.log("paso todas las validaciones");

        if (esRegistro) {
            console.log("llamam a registrar()")
            registar()
        } else {
            console.log("llama a login()");
            login()
        }


    }

    const login = React.useCallback(async () => {
        clearInput()
        try {
            const res = await auth.signInWithEmailAndPassword(email, pass)
            console.log(res.user);
            clearInput()
            setError(null)
            props.history.push('/admin')
        } catch (error) {
            console.log(error);
            if (error.code === 'auth/invalid-email') {
                setError('Email no corresponde!')
            }
            if (error.code === 'auth/user-not-found') {
                setError('No hay ningún registro de usuario que corresponda a este identificador. El usuario puede haber sido eliminado.')
            }
            if (error.code === 'auth/wrong-password') {
                setError('La contraseña no es válida o el usuario no tiene contraseña.!')
            }

        }
    }, [email, pass, props.history])

    const registar = React.useCallback(async () => {
        // clearInput()
        try {
            const res = await auth.createUserWithEmailAndPassword(email, pass)
            await db.collection('users').doc(res.user.email).set({
                email: res.user.email,
                uid: res.user.uid
            })
            await db.collection(res.user.uid).add({
                name: 'Tarea de ejemplo',
                fecha: Date.now()
            })
            clearInput()
            setError(null)
            props.history.push('/admin')
        } catch (error) {
            console.log(error);
            if (error.code === 'auth/invalid-email') {
                setError('Email no Valido!')
            }
            if (error.code === 'auth/email-already-in-use') {
                setError('Email ya registrado!')
            }


        }
    }, [email, pass, props.history])

    return (
        <div className="mt-5">
            <h3 className="text-center">
                {
                    esRegistro ? 'REGISTRO DE USUARIOS' : 'LOGIN'
                }
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
                        <input
                            type="password"
                            className="form-control mb-2"
                            placeholder="ingrese un password"
                            onChange={e => setPass(e.target.value)}
                            value={pass}
                        />
                        <div className="row">
                            <button
                                className="btn btn-dark btn-lg btn-block mb-2"
                                type="submit"
                            >
                                {
                                    esRegistro ? 'Registrarse' : 'Acceder'
                                }
                            </button>

                            <button
                                className="btn btn-info btn-sm btn-block mb-2"
                                onClick={() => setEsRegistro(!esRegistro)}
                                type="button"
                            >
                                {
                                    esRegistro ? '¿Ya estás registrado?' : '¿No tienes una cuenta?'
                                }
                            </button>
                            {
                                !esRegistro ? (
                                    <button
                                        className="btn btn-danger btn-sm mt-2 mb-2"
                                        type="button"
                                        onClick={() => props.history.push('/reset')}
                                    >
                                        Recuperar contraseña
                                    </button>
                                ) : false
                            }
                        </div>
                        {
                            error && (
                                <div className="alert alert-danger">{error}</div>
                            )
                        }
                    </form>
                </div>
            </div>
        </div>
    )
}

export default withRouter(Login)
