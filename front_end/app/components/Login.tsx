'use client'
import React, { FC, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { AiOutlineEye, AiOutlineEyeInvisible, AiFillGithub } from 'react-icons/ai'
import { styles } from '../styles/style'
import { FcGoogle } from 'react-icons/fc'

type Props = {
    setRoute: (route: string) => void
}

const Schema = Yup.object().shape({
    email: Yup.string().email("Invalid Email").required("Please Enter email"),
    password: Yup.string().required("Please Enter Password").min(6)
})

const Login: FC<Props> = ({ setRoute }) => {
    const [show, setShow] = useState(false)

    const formik = useFormik({
        initialValues: { email: "", password: "" },
        validationSchema: Schema,
        onSubmit: (values) => {
            const { email, password } = values
            console.log(email, password)
            setRoute("Verification")
        }
    })

    const { errors, touched, values, handleChange, handleSubmit } = formik;

    return (
        <div className='w-full'>
            <h1 className={`${styles.title}`}>Login With E-Learning</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email" className={`${styles.label}`}>
                        Enter Your Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        id="email"
                        placeholder="example@gmail.com"
                        className={`${errors.email && touched.email ? "border-red-500" : ""} ${styles.input}`}
                    />
                    {errors.email && touched.email && (
                        <span className='text-red-500 pb-2 block'>{errors.email}</span>
                    )}

                    <label htmlFor="password" className={`${styles.label}`}>
                        Enter Your Password
                    </label>
                    <div className='relative'>
                        <input
                            type={show ? "text" : "password"}
                            name="password"
                            value={values.password}
                            onChange={handleChange}
                            id="password"
                            placeholder="password!@$%"
                            className={`${errors.password && touched.password ? "border-red-500" : ""} ${styles.input}`}
                        />
                        <div
                            className='absolute top-2 right-3 z-1 cursor-pointer'
                            onClick={() => setShow(!show)}
                        >
                            {show ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                        </div>
                    </div>
                    {errors.password && touched.password && (
                        <span className='text-red-500 pb-2 block'>{errors.password}</span>
                    )}
                </div>

                <div className='w-full mt-5'>
                    <input type="submit" value="Login" className={`${styles.button}`} />
                </div>

                <h5 className='text-center pt-4 text-Poppins text-[14px] text-black dark:text-white '>
                    Or join with
                </h5>
                <div className='flex items-center justify-center my-3'>
                    <FcGoogle size={30} className='cursor-pointer mr-2'/>
                    <AiFillGithub size={30} className='cursor-pointer ml-2' />
                </div>

                <h5 className='text-center pt-4 font-Poppins text-[14px]'>
                    Don't have an account?{" "}
                    <span className='text-blue-600 pl-1 cursor-pointer' onClick={() => setRoute("Sign-Up")}>
                        Sign Up
                    </span>
                </h5>
            </form>
        </div>
    )
}

export { Login }
