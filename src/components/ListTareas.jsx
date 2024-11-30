import { collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { auth_user, db } from '../firebase/appConfig'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import Header from './Header'
import Login from '../session/Login'
import { onAuthStateChanged } from 'firebase/auth'
import styles from '../styles/ListProducts.module.css'

export default function ListTareas() {
    //declaramos un estado para la lista de productos
    const [tareas, setTareas] = useState([])

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

    //montando la informacion de los productos que hay en firebase
    useEffect(() => {
        //Funcion que nos permite visualizar la info de la bd en tiempo real
        onSnapshot(
            //obtenemos la conexion de la base de datos y el nombre de la coleccion
            collection(db, "tareas"),
            (snapshot) => {
                //objeto de firebase
                //console.log(snapshot);
                //testeando el primer documento de la coleccion
                console.log(snapshot.docs[0].data());

                /** mapeando / iterando los documentos de la coleccion */
                const array_tareas = snapshot.docs.map((doc) => {
                    //copiamos la data de cada documento de la coleccion productos y la mandamos al array_products
                    return { ...doc.data(), id: doc.id }
                })
                //testear 
                console.log(array_tareas);

                //actualizamos el estado con el arreglo de productos
                setTareas(array_tareas)
            }
        )
    }, [])

    //funcion para eliminar una tarea
    const deleteTarea = (id) => {
        console.log(id);
        try {
            Swal.fire({
                title: "Estás seguro que terminaste la tarea?",
                text: "No podrás revertir los cambios!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Si, terminé!",
                cancelButtonText: "No",
            }).then((result) => {
                if (result.isConfirmed) {
                    //eliminar el documento
                    deleteDoc(doc(db, "tareas", id));
                    Swal.fire({
                        title: "Tarea terminada!",
                        text: "Has realizado la tarea.",
                        icon: "success"
                    });
                }
            });
        } catch (error) {
            console.error("Error al terminar la tarea", error)
        }

    }

    return (
        <div>
            {user ?
                <>
                    <Header />
                    <section className={styles.products_section}>
                        <h2>Lista de Tareas</h2>
                        <div className={styles.products_grid}>
                            {
                                tareas.length > 0 ?
                                    tareas.map((tarea) => {
                                        return (
                                            <div key={tarea.id} className={styles.product_card}>
                                                <h3>{tarea.name}</h3>
                                                <p>{tarea.description}</p>
                                                <div className={styles.product_actions}>
                                                    <Link to={`/editar/${tarea.id}`} className={styles.edit_product}>Editar</Link>
                                                    <button onClick={() => deleteTarea(tarea.id)} className={styles.delete_button}>Terminar</button>
                                                </div>
                                            </div>
                                        )
                                    })
                                    : <p className={styles.products_message}>No hay tareas por el momento</p>
                            }
                        </div>
                    </section>
                </>
                : <Login />
            }

        </div>
    )
}
