import React, { useState } from "react";
import { db } from "../firebase";
import './firestore.css';

import moment from "moment";
import 'moment/locale/es';

function Firestore(props) {

    const [tareas, setTareas] = useState([])
    const [tarea, setTarea] = useState("")
    const [modoEdicion, setModoEdicion] = useState(false)
    const [id, setId] = useState("")
    const [ultimo, setUltimo] = useState(null)
    const [desactivar, setDesactivar] = useState(false)

    React.useEffect(() => {
        const getData = async () => {
            try {
                setDesactivar(true)
                const data = await db.collection(props.user.uid)
                    .limit(2)
                    .orderBy('fecha')
                    .get()

                const arrayData = data.docs.map(doc => ({ id: doc.id, ...doc.data() }))

                setUltimo(data.docs[data.docs.length - 1])

                // let last = data.docs.length
                // console.log("==>", last);
                // setUltimo(last)
                // console.log("bara ultimo", setUltimo)
                setTareas(arrayData)

                const query = await db.collection(props.user.uid)
                    .limit(2)
                    .orderBy('fecha')
                    .startAfter(data.docs[data.docs.length - 1])
                    .get()

                if (query.empty) {
                    console.log("No hay documentos");
                    setDesactivar(true)
                } else {
                    setDesactivar(false)
                }
            } catch (error) {
                console.log(error);
            }
        }
        getData()
    }, [props.user.uid])

    const siguiente = async () => {

        try {
            const data = await db.collection(props.user.uid)
                .limit(2)
                .orderBy('fecha')
                .startAfter(ultimo)
                .get()

            const arrayData = data.docs.map(doc => ({ id: doc.id, ...doc.data() }))

            setTareas([
                ...tareas,
                ...arrayData])

            setUltimo(data.docs[data.docs.length - 1])
            console.log("SIGUIENTE");

            const query = await db.collection(props.user.uid)
                .limit(2)
                .orderBy('fecha')
                .startAfter(data.docs[data.docs.length - 1])
                .get()

            if (query.empty) {
                console.log("No hay documentos");
                setDesactivar(true)
            } else {
                setDesactivar(false)
            }

        } catch (error) {
            console.log(error.message);
        }
    }


    const agregar = async (e) => {
        e.preventDefault()

        if (!tarea.trim()) {
            console.log("elemento vacio")
            return
        }

        try {

            const nuevaTarea = {
                name: tarea,
                fecha: Date.now()
            }
            const data = await db.collection(props.user.uid).add(nuevaTarea)
            setTareas([
                ...tareas,
                { ...nuevaTarea, id: data.id }
            ])
            setTarea("")

        } catch (error) {
            console.log(error);
        }
    }

    const eliminar = async (id) => {
        try {
            await db.collection(props.user.uid).doc(id).delete()

            const arrayfiltrado = tareas.filter(item => item.id !== id)
            setTareas(arrayfiltrado)

        } catch (error) {
            console.log(error);
        }
    }

    const editar = (item) => {
        setModoEdicion(true)
        setTarea(item.name)
        setId(item.id)

    }

    const update = async (e) => {
        e.preventDefault()

        if (!tarea.trim()) {
            console.log("elemento vacio")
            return
        }

        try {

        } catch (error) {
            console.log(error);
        }

        await db.collection(props.user.uid).doc(id).update({
            name: tarea
        })

        const arrayEditado = tareas.map(item => (
            item.id === id ? { id: item.id, fecha: item.fecha, name: tarea } : item
        ))

        setTareas(arrayEditado)
        setModoEdicion(false)
        setTarea("")
        setId("")


    }



    return (
        <div className="container mt-3">
            <div className="row">
                <div className="col-md-6">
                    <h2>Tareas</h2>
                    <ul className="list-group">
                        {
                            tareas.map(item => (
                                <li className="list-group-item" key={item.id}>
                                    {item.name} - {moment(item.fecha).format('LLL')}
                                    <button
                                        className="btn btn-danger btn-sm float-right float"
                                        onClick={() => eliminar(item.id)}
                                    >
                                        Eliminar
                                    </button>

                                    <button
                                        className="btn btn-warning btn-sm float-right float mr"
                                        onClick={() => editar(item)}
                                    >
                                        Editar
                                    </button>
                                </li>
                            ))
                        }
                    </ul>
                    <button
                        className="btn btn-info btn-block btn-sm mt-2"
                        onClick={() => siguiente()}
                        disabled={desactivar}
                    >
                        ver mas
                    </button>
                </div>
                <div className="col-md-6">
                    <h2>
                        {
                            modoEdicion ? 'Editar Tarea' : 'Agregar Tarea'
                        }
                    </h2>
                    <form onSubmit={modoEdicion ? update : agregar}>
                        <input
                            type="text"
                            placeholder="Ingrese Tarea"
                            className="form-control mb-2"
                            onChange={e => setTarea(e.target.value)}
                            value={tarea}
                        >
                        </input>
                        <button className={modoEdicion ? "btn btn-warning btn-block" : "btn btn-dark btn-block"}
                            type="submit">
                            {modoEdicion ? 'Editar' : 'Agregar'}
                        </button>
                    </form>
                </div>

            </div>
            {

            }
        </div>
    );
}

export default Firestore;
