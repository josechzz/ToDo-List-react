import React from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth_user } from '../firebase/appConfig';
import { useNavigate } from 'react-router-dom';

//creando un esquema (reglas) para validar el correo y password
const schema = yup.object().shape({
  //asignamos las reglas que se van a validar
  email: yup.string().required("El correo es obligatorio").email("Correo Inválido, ejemplo: usuario@dominio.com"),
  password: yup.string().required("La contraseña es Obligatoria").min(8, "La contraseña debe contener al menos 8 carácteres"),
  //validamos si las contrasenas son igual con la funcion oneOf()
  confirmPassword: yup.string().oneOf([yup.ref('password'), null], "Las contraseñas no son iguales")
})

export default function SignUp() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  })

  //constante para la navegacion
  const navigate = useNavigate()

  //creando un usuario para firebase
  const registerForm = (data) => {
    console.log(data);

    createUserWithEmailAndPassword(auth_user, data.email, data.password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user); //mandaria la info del usuario (correo)
        //redigirlo a la pagina principal
        navigate('/')
      }).catch((error) => {
        console.log("Error al registrar el usuario", error);
      })
  }

  return (
    <main>
      <form onSubmit={handleSubmit(registerForm)}>
        <h2>Registrar Usuario</h2>
        <div className='form_group'>
          <label htmlFor="">Correo Electrónico</label>
          <input type="email" placeholder='Ingrese su correo' {...register('email', { required: true })} />
          <span style={{ color: "red" }}>
            {errors.email && errors.email.message}
          </span>
        </div>

        <div className='form_group'>
          <label htmlFor="">Contraseña</label>
          <input type="password" placeholder='Ingrese su contraseña' {...register('password', { required: true })} />
          <span style={{ color: "red" }}>
            {errors.password && errors.password.message}
          </span>
        </div>

        <div className='form_group'>
          <label htmlFor="">Confirmar Contraseña</label>
          <input type="password" placeholder='Repita su contraseña' {...register('confirmPassword')} />
          <span style={{ color: "red" }}>
            {errors.confirmPassword && errors.confirmPassword.message}
          </span>
        </div>
        <button type='submit' className='button'>Registrarse</button>
      </form>
    </main>
  )
}
