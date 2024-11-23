import {LoginInput, EmailRegex, PasswordRegex} from "../common/Inputs";
import React, {useEffect, useState} from "react";
import {useCreateTherapistMutation} from "../store/rehybApi";
import {LogoImage} from "../common/LogoImage";
import {TfiEmail} from "react-icons/tfi";
import {BsPerson, BsShieldSlash} from "react-icons/bs";
import helloImg from "../dashboard/components/hello.svg";
import {useNavigate} from "react-router-dom";


export const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [name, setName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorCount, setErrorCount] = useState(0);
    //这个是用来记录错误次数的，可用于1.后续的一些错误过多的限制登录处理 2.错误信息的强制重新渲染
    const navigate = useNavigate();
    const [signUpSuccess, setSignUpSuccess] = useState(false);
    const [countDown, setCountDown] = useState(5);

    const [signUpMutation] = useCreateTherapistMutation();

    useEffect(() => {
        if (signUpSuccess) {
            const timer = setInterval(() => {
                setCountDown(prevCountDown => prevCountDown - 1);
            }, 1000);

            const redirect = setTimeout(() => {
                navigate('/login');
            }, 5000);

            return () => {
                clearInterval(timer);
                clearTimeout(redirect);
            };
        }
    }, [signUpSuccess, navigate]);

    const signUpEnabled = name.length > 0 && email.length > 0 && password.length > 0 && password === confirmPassword;

    const onSignUp = async () => {
        const result = await signUpMutation({
            Email: email,
            Password: password,
            Name: name
        });
        if ('error' in result) {
            if ('originalStatus' in result.error && result.error.originalStatus === 409) {
                setLoginError('Email already exists. Please try another.');
                setErrorCount(count => count + 1);
                return;
            }
            setLoginError('An error occurred. Please try later.');
            setErrorCount(count => count + 1);
            return;
        } else {
            setSignUpSuccess(true);
        }

    }


    return <div className="grid grid-cols-[2fr_3fr]">
        <div className={`bg-primary flex flex-col justify-around items-center`}>
            <div>
                <h1 className="text-tertiary font-bold text-8xl">ReHyb</h1>
            </div>
            <div>
                <LogoImage scale={0.5}/>
            </div>
            <span className={`text-tertiary`}>Lead a healthy and active living environment.</span>
        </div>
        {!signUpSuccess &&
            <div className={'w-full h-screen bg-tertiary flex flex-col gap-4 items-center justify-center relative'}>
                <h1 className="text-black font-bold text-2xl">Create your Account</h1>
                <LoginInput prefixIcon={<BsPerson className={`fill-gray-400 w-5 h-5`}/>}
                            type={'text'} value={name} onValueSet={setName} placeholder={'Your name'}/>
                <LoginInput prefixIcon={<TfiEmail className={`fill-gray-400 w-5 h-5`}/>}
                            type={'email'} value={email} onValueSet={setEmail} placeholder={'Email'}/>
                <LoginInput prefixIcon={<BsShieldSlash className={`fill-gray-400 w-5 h-5`}/>}
                            type={'password'} value={password} onValueSet={setPassword}
                            placeholder={'Password'}/>
                <LoginInput prefixIcon={<BsShieldSlash className={`fill-gray-400 w-5 h-5`}/>}
                            type={'password'} value={confirmPassword} onValueSet={setConfirmPassword}
                            placeholder={'Confirm password'}/>
                {signUpEnabled ?
                    <div className={'btn-primary font-semibold justify-center hover:cursor-pointer w-60'}
                         onClick={() => {
                             if (!EmailRegex.test(email)) {
                                 setLoginError('Invalid email address.');
                                 setErrorCount(count => count + 1);
                                 return;
                             }
                             if (!PasswordRegex.test(password)) {
                                 setLoginError('Password must contain uppercase and lowercase letters, numbers, and be at least 8 characters long.');
                                 setErrorCount(count => count + 1);
                                 return;
                             }
                             onSignUp();
                         }}>Sign up
                    </div> :
                    <div className={'btn-primary font-semibold border-0 justify-center w-60 cursor-default relative'}>
                        <div className="absolute inset-0 bg-white opacity-50"></div>
                        Sign up
                    </div>}
                <div>
                    You have account? <a href={'/login'} className={`font-semibold text-primary`}>Login now
                </a>
                </div>
                <div className={`h-28`}>
                    {loginError && (
                        <div
                            key={errorCount}
                            className={"error-message w-80 overflow-wrap-normal flex justify-center"}
                            role="alert"
                        >
                            <span className="block sm:inline">{loginError}</span>
                        </div>
                    )}
                </div>
                <img src={helloImg} alt="hello" className={'h-80 w-40 absolute bottom-0 right-0'}/>
            </div>}
        {signUpSuccess &&
            <div className={'w-full h-screen bg-tertiary flex flex-col gap-4 items-center justify-center'}>
                <h1 className="text-black font-bold text-2xl">Account created successfully</h1>
                <div>
                    {countDown} seconds to redirect to login page.
                </div>
            </div>}
    </div>
}


