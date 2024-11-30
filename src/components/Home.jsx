import { onAuthStateChanged } from 'firebase/auth'
import React, { useState } from 'react'
import { auth_user } from '../firebase/appConfig'
import Login from '../session/Login'
import { signOut } from 'firebase/auth'
import Swal from 'sweetalert2'
import Header from './Header'
import styles from '../styles/Home.module.css'

export default function Home() {
    //estado donde vamos a verificar si el usuario esta autenticado
    const [user, setUser] = useState(null)

    //accediendo al usuario del localstorage
    //const userStorage = JSON.parse(localStorage.getItem("user_firebase")) //{}

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

    //metodo para cerrar sesion
    const logout = () => {
        signOut(auth_user).then(() => {
            Swal.fire({
                icon: "success",
                title: "La sesion se ha cerrado",
                showConfirmButton: false,
                timer: 1500
            });
            setUser(null);
            localStorage.removeItem("user_firebase");
        }).catch((error) => {
            console.error("Error al cerrar sesión", error)
            Swal.fire({
                title: "Algo salio mal",
                text: "Error al cerrar sesión",
                icon: "error"
            });
        })
    }

    return (
        <div>
            {user ?
                <>
                    <Header />
                    <section className={styles.home_section}>
                        <h1 className={styles.welcome_section}>Bienvenido a la Aplicación</h1>
                        <p className={styles.login_message}>Has iniciado sesión</p>
                        {/* <img src={userStorage.photoURL ? userStorage.photoURL : "https://res.cloudinary.com/dmddi5ncx/image/upload/v1729199012/practicas/usuario_tpluzt.png"} alt="" style={{ width: "25%" }} />  */}
                        <p className={styles.user_email}>Correo: {user.email}</p>
                        <button onClick={logout} className={styles.logout_button}>Cerrar Sesión</button>
                    </section>
                </>
                : <Login />
            }

        </div>
    )
}
