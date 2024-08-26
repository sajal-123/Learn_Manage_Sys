'use client'
import React, { FC, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { AiOutlineEye, AiOutlineEyeInvisible, AiFillGithub } from 'react-icons/ai'

type Props = {
    setRoute: (route: string) => void
}
const Schema = Yup.object().shape({
    email: Yup.string().email("Invalid Email").required("Please Enter email"),
    Password: Yup.string().required("Please Enter Password").min(6)
})

const Login: FC<Props> = (props: Props) => {
    const [show, setShow] = useState(false)
    const formik = useFormik({
        initialValues: { email: "", password: "" },
        validationSchema: Schema,
        onSubmit: async (email, password) => {
            console.log(email, password)
        }
    })

    const {errors,touched,values,handleChange,handleSubmit}=formik;

    return (
        <div className='w-full'>

        </div>
    )
}

export { Login }
