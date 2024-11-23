//Add this back, once the other endpoints of the code has been added
//Find a way to figure out the routing for the login page, once the other pages endpoints are implemented
import {LoginInput} from '../common/Inputs'
import React, {useState} from 'react'
import {useLoginRedirect} from '../common/hooks/authHooks'
import {usePostAuthLoginMutation} from "../store/rehybApi";
import {TfiEmail} from 'react-icons/tfi';
import {LogoImage} from "../common/LogoImage";
import {BsEye, BsEyeSlash, BsShieldSlash} from "react-icons/bs";
import helloImg from "../dashboard/components/hello.svg";

export const Login = () => {
    const [email, setEmail] = useState('Hello7@email.com'); //设置默认值
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [errorCount, setErrorCount] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    //这个是用来记录错误次数的，可用于1.后续的一些错误过多的限制登录处理 2.错误信息的强制重新渲染
    // const dispatch = useDispatch();

    const [loginMutation] = usePostAuthLoginMutation();

    useLoginRedirect();

    const onLogin = async () => {
        const result = await loginMutation({
            authLoginBody: {
                Email: email,
                Password: password
            }
        }); //这里发出的email和password如果正确，经过后端验证，TherapistID和与他对应的token会被存在本地的cookie中
        if ('error' in result) {
            // console.error('login failed', result.error);
            setLoginError('Incorrect email or password. Please try again.');
            setErrorCount(count => count + 1);
            // console.log('errorCount', errorCount);
            return;
        } else {
            window.location.reload();
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
        <div className={'w-full h-screen bg-tertiary flex flex-col gap-4 items-center justify-center relative'}>
            <h1 className="text-black font-bold text-2xl">Login to your Account</h1>
            <LoginInput prefixIcon={<TfiEmail className={`fill-gray-400 w-5 h-5`}/>}
                        type={'email'} value={email} onValueSet={setEmail} placeholder={'Email'}/>
            <LoginInput prefixIcon={<BsShieldSlash className={`fill-gray-400 w-5 h-5`}/>}
                        postfixIcon={showPassword ? <BsEye className={`fill-gray-400 w-5 h-5 hover:cursor-pointer`}
                                                           onClick={() => setShowPassword(false)}/>
                            : <BsEyeSlash className={`fill-gray-400 w-5 h-5 hover:cursor-pointer`}
                                          onClick={() => setShowPassword(true)}/>}
                        type={showPassword ? 'text' : 'password'} value={password} onValueSet={setPassword}
                        placeholder={'Password'}/>
            {(email !== '' && password !== '') ?
                <div className={'btn-primary font-semibold justify-center hover:cursor-pointer w-60'}
                     onClick={onLogin}>LOG IN
                </div> :
                <div className={'btn-primary font-semibold border-0 justify-center w-60 cursor-default relative'}>
                    <div className="absolute inset-0 bg-white opacity-50"></div>
                    LOG IN
                </div>
            }
            <div>
                Don't have an account? <a href={'/signup'} className={`font-semibold text-primary`}>Create an
                account</a>
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
        </div>
    </div>
}
