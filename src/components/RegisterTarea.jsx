import { addDoc, collection } from 'firebase/firestore';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { auth_user, db } from '../firebase/appConfig';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Login from '../session/Login';
import { onAuthStateChanged } from 'firebase/auth';

export default function RegisterTarea() {
    const { register, handleSubmit, watch, formState: { errors } } = useForm()
    /**
     * register = hace referencia a lo que capturo en la entrada de dato
     * watch = permite observar alguna entrada de dato (valor)
     * handleSubmit = es la accion de lo que voy hacer con la informacion
     */

    //creando una constante para redirigir a una ruta
    const navigate = useNavigate()

    //estado donde vamos a verificar si el usuario esta autenticado
    const [user, setUser] = useState(null)

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

    console.log(watch('name'));
    //metodo para guardar una tarea
    const saveTarea = async (data) => {
        
        //conectarnos a la bd y guardamos un documento
        try {
            await addDoc(collection(db, "tareas"), {
                name: data.name, 
                description: data.description 
            })
            
        } catch (error) {
            console.error("Error al registrar la tarea", error)
        }
        //redireccionamos a lista de tareas
        navigate("/tareas")
        
    }

    return (
        <div>
            {user ?
                <>
                    <Header />
                    <main>
                        <form action="" onSubmit={handleSubmit(saveTarea)}>
                            <h2>Registro de Tareas</h2>
                            <div className='form_group'>
                                <label htmlFor="">Nombre de la tarea</label>
                                <input type="text" placeholder='Ingrese el nombre de la tarea' {...register('name', { required: true })} />
                                {errors.name && <span>*Campo Obligatorio</span>}
                            </div>

                            <div className='form_group'>
                                <label htmlFor="">Descripción</label>
                                <input type="text" placeholder='Ingrese una descripción' {...register('description', { required: true })} />
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
