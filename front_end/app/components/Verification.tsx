import React, { FC, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { VscWorkspaceTrusted } from 'react-icons/vsc'
import { styles } from '../styles/style'

type Props = {
    setRoute: (route: string) => void
}

type VerifyNumber = {
    "0": string,
    "1": string,
    "2": string,
    "3": string,
}
const Verification: FC<Props> = ({ setRoute }) => {
    const [invalidError, setInvalidError] = useState<boolean>(false);
    const inputRefs = [
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
    ]
    const [verifyNumber, setVerifyNumber] = useState<VerifyNumber>({
        "0": "",
        "1": "",
        "2": "",
        "3": "",
    })

    const VerificationHandle = async () => {
        console.log("Testing Verificaton")
        setInvalidError(true)
    }

    const handleInputChange = async (index: number, value: String) => {
        console.log("Testing Verificaton")
        setInvalidError(false)
        const NewVerifyNumber = { ...verifyNumber, [index]: value }
        setVerifyNumber(NewVerifyNumber)

        if (value === "" && index > 0) {
            inputRefs[index - 1].current?.focus();
        } else if (value.length === 1 && index < 3) {
            inputRefs[index + 1].current?.focus();
        }
    }
    return (
        <div>
            <h1 className={`${styles.title}`}>
                Verify Your Account
            </h1>
            <div className='w-full flex items-center justify-center mt-2 '>
                <div className='w-[70px] h-[70px] rounded-full flex items-center justify-center bg-blue-500'>
                    <VscWorkspaceTrusted size={40} />
                </div>
            </div>
            <br />
            <br />
            <div className='1100px:w-[70px] m-auto flex items-center gap-4 justify-center'>
                {
                    Object.keys(verifyNumber).map((key, index) => (
                        <input
                            key={key}
                            ref={inputRefs[index]}
                            className={`w-[45px] h-[45px] bg-transparent border-[2px] flex items-center justify-center text-black rounded-lg dark:text-white text-[18px] font-Poppins outline-none text-center ${invalidError ? "shake border-red-500" : "dark:border-white border-[#0000004a]"}`}
                            maxLength={1}
                            value={verifyNumber[key as keyof VerifyNumber]}
                            onChange={(e) => handleInputChange(index, e.target.value)}
                        />
                    ))
                }
            </div>
            <br />
            <br />
            <div className='w-full flex justify-center'>
                <button className={`${styles.button}`}
                    onClick={() => { VerificationHandle() }}>
                    Verify Otp
                </button>
            </div>
            <br />
            <h5 className='text-center pt-4 font-Poppins text-[14px]'>
                Go back to sign in?{" "}
                <span className='text-blue-600 pl-1 cursor-pointer' onClick={() => setRoute("Login")}>
                    Login
                </span>
            </h5>
        </div>
    )
}

export { Verification }
