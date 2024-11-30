import React from 'react'
import { Link } from 'react-router-dom'
import styles from '../styles/Header.module.css'

export default function Header() {
    return (
        <header className={styles.header}>
            <nav>
                <ul className={styles.nav_ul}>
                    <li>
                        <Link to="/" className={styles.nav_enlace}>Home</Link>
                    </li>
                    <li>
                        <Link to="/tareas" className={styles.nav_enlace}>Tareas</Link>
                    </li>
                    <li>
                        <Link to="/registro" className={styles.nav_enlace}>Agregar tarea</Link>
                    </li>
                </ul>
            </nav>
        </header>
    )
}

