import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { auth_user, db } from '../firebase/appConfig'
import { useForm } from 'react-hook-form'
import Header from './Header'
import Login from '../session/Login'
import { onAuthStateChanged } from 'firebase/auth'

export default function EditForm() {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm()

    //estado donde vamos a verificar si el usuario esta autenticado
    const [user, setUser] = useState(null)

    //useParams captura los parametros que mandamos en las rutas
    const { id } = useParams();

    const navigate = useNavigate()

    //verificamos si el usuario esta en firebase
    //userFirebase = devuelve un objeto si la persona existe
    onAuthStateChanged(auth_user, (userFirebase) => {
        if (userFirebase) { //objeto
            //si el usuario existe
            console.log(userFirebase);
            setUser(userFirebase)
        } else {
            setUser(null)
        }
    })

    //montando la tarea seleccionada
    useEffect(() => {

        const getTareaById = async () => {
            const tareaDoc = await getDoc(doc(db, "tareas", id));

            //validamos si el documento existe
            if (tareaDoc.exists()) {
                const tareaData = tareaDoc.data()
                console.log(tareaData);

                //mandar la informacion de la tarea al formulario
                setValue('name', tareaData.name)
                setValue('description', tareaData.description)
            } else {
                console.log("No existe la tarea");
            }
        }

        getTareaById()
    }, [])

    const editTarea = async (data) => {
        try {
            //actualizamos la tarea, seleccionamos el documento por su id
            updateDoc(doc(db, "tareas", id), {
                name: data.name, 
                description: data.description 
            });
            //redireccionamos a la lista de tareas
            navigate("/tareas")
        } catch (error) {
            console.error('Error al actualizar la tarea', error)
        }
    }

    return (
        <div>
            {user ?
                <>
                    <Header />
                    <main>
                        <form action="" onSubmit={handleSubmit(editTarea)}>
                            <h2>Editar Tarea</h2>
                            <div className='form_group'>
                                <label htmlFor="">Ingresar Tarea</label>
                                <input type="text" {...register('name', { required: true })} />
                                {errors.name && <span>*Campo Obligatorio</span>}
                            </div>

                            <div className='form_group'>
                                <label htmlFor="">Descripcion</label>
                                <input type="text" {...register('description', { required: true })} />
                                {errors.description && <span>*Campo Obligatorio</span>}
                            </div>
                            <div>
                                <button type='submit' className='button'>Guardar Tarea</button>
                            </div>
                        </form>
                    </main>

                </>
                : <Login />
            }
        </div>
    )
}
