import {ChangeEvent, HTMLInputTypeAttribute, ReactNode, useEffect, useState} from 'react'
import 'react-phone-number-input/style.css';
import PhoneInput,{Value} from 'react-phone-number-input';
import {AiOutlineEye, AiOutlineEyeInvisible, AiOutlineInfoCircle} from "react-icons/ai";

export const EmailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
export const PasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

// export const LabelBox = (props: { label: string, children: ReactNode, className?: string, expand?: boolean }) => {
//     return <label
//         className={`flex flex-col gap-1 items-start ${props.className ? props.className : ''} ${props.expand ? 'flex-1' : ''}`}>
//         <span>{props.label}</span>
//         {props.children}
//     </label>
// }
export const Placeholder = (props: { label?: string }) => <div className="col-span-1 row-span-1">{props.label}</div>;
export const LabelBox = (props: {
    label: string,
    children: ReactNode,
    className?: string,
    expand?: boolean,
    tooltip?: string
}) => {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <div
            className={`flex flex-col gap-1 items-start ${props.className ? props.className : ''} ${props.expand ? 'flex-1' : ''}`}
        >
            <div className="flex items-center space-x-1">
                <span>{props.label}</span>
                {props.tooltip && (
                    <div
                        className={"relative"}
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                    >
                        {showTooltip && (
                            <div
                                className="absolute left-0 z-50 bottom-4 transform -translate-x-1/2 py-1  w-[200px] bg-tertiary shadow-lg text-text-dark text-xs transition-all border border-secondary2 rounded p-2">
                                {props.tooltip}
                            </div>
                        )}
                        <AiOutlineInfoCircle className={'fill-primary cursor-help'}/>

                    </div>
                    // <div
                    //     className="relative w-full"
                    //     onMouseEnter={() => setShowTooltip(true)}
                    //     onMouseLeave={() => setShowTooltip(false)}
                    // >
                    //     <AiOutlineInfoCircle className={'fill-primary cursor-help peer'}/>
                    //     {showTooltip && (
                    //         <div className={`absolute bg-tertiary py-1 whitespace-normal hidden ` +
                    //             'p-4 text-text-dark rounded bottom-5 shadow-lg max-w-lg peer-hover:flex ' +
                    //             `transition-all w-full border border-secondary2`}>
                    //             {props.tooltip}
                    //         </div>
                    //     )}
                    // </div>
                )}
            </div>
            {props.children}
        </div>
    );
};


export const LabeledPasswordEmailInput = (props: {
    label: string,
    placeholder: string,
    onValueSet: (value: string) => void,
    value: string,
    type: 'password' | 'email',
    expand?: boolean,
    className?: string,
    tooltip?: string,
    onIsValid: (isValid: boolean) => void,
}) => {
    const [error, setError] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        let isValid = true;
        let errorMessage = '';

        if (props.type === 'email') {
            isValid = EmailRegex.test(value);
            errorMessage = 'Invalid email address';
        } else if (props.type === 'password') {
            isValid = PasswordRegex.test(value);
            errorMessage = 'Invalid password';
        }
        if (isValid) {
            setError('');
            props.onValueSet(value);
            props.onIsValid(true);
        } else {
            setError(errorMessage);
            props.onValueSet(value);
            props.onIsValid(false);
        }
    };

    return <LabelBox label={props.label} expand={props.expand} tooltip={props.tooltip}>
        <div className={`relative ${props.expand ? 'flex-1 max-w-full w-full' : ''}`}>
            <input
                className={`w-full pr-8 m-0 ${props.className}`}
                placeholder={props.placeholder}
                type={props.type === 'email' ? 'email' : (passwordVisible ? 'text' : 'password')}
                value={props.value}
                onChange={handleChange}
            />
            {props.type === 'password' &&
                (passwordVisible ?
                    <AiOutlineEye onClick={() => setPasswordVisible(false)}
                                  className={'absolute right-2 top-1/2 w-6 h-6 transform -translate-y-1/2 fill-gray-500 cursor-pointer'}/> :
                    <AiOutlineEyeInvisible onClick={() => setPasswordVisible(true)}
                                           className={'absolute right-2 top-1/2 w-6 h-6 transform -translate-y-1/2 fill-gray-500 cursor-pointer'}/>)}
        </div>
        {error && <div className="text-red-500">{error}</div>}
    </LabelBox>
};

export const LabeledConfirmPasswordInput = (props: {
    label: string,
    placeholder: string,
    onValueSet: (value: string) => void,
    value: string,
    passwordValue: string,
    expand?: boolean,
    className?: string,
    tooltip?: string,
}) => {
    //将isPasswordMatch 除了比较value和passwordValue是否相等，还要判断两者是否为空
    const isPasswordMatch = props.value === props.passwordValue;
    const [passwordVisible, setPasswordVisible] = useState(false);
    return <LabelBox label={props.label} expand={props.expand} tooltip={props.tooltip}>
        <div className={`relative ${props.expand ? 'flex-1 max-w-full w-full' : ''}`}>
            <input
                className={`w-full pr-8 m-0 ${props.className}`}
                placeholder={props.placeholder}
                type={passwordVisible ? 'text' : 'password'}
                value={props.value}
                onChange={(e) => props.onValueSet(e.target.value)}
            />
            {passwordVisible ? <AiOutlineEye onClick={() => setPasswordVisible(false)}
                                             className={'absolute right-2 top-1/2 w-6 h-6 transform -translate-y-1/2 fill-gray-500 cursor-pointer'}/> :
                <AiOutlineEyeInvisible onClick={() => setPasswordVisible(true)}
                                       className={'absolute right-2 top-1/2 w-6 h-6 transform -translate-y-1/2 fill-gray-500 cursor-pointer'}/>}
        </div>
        {(props.value === '' && props.passwordValue === '') ? <></> :
            (isPasswordMatch ?
                <span className="text-green-500">Passwords match</span> :
                <span className="text-red-500">Passwords do not match</span>)}

    </LabelBox>
}

export const LabeledPhoneInput = (props: {
    label: string,
    onValueSet: (selectedValues: string) => void,
    value: string,
    international?: boolean,
    countryCallingCodeEditable?: boolean,
    expand?: boolean,
    className?: string,
    tooltip?: string
}) => {

    return (
        <LabelBox label={props.label} expand={props.expand} tooltip={props.tooltip}>
            <PhoneInput
                className={`${props.expand ? 'flex-1 max-w-full w-full' : 'w-52'} ${props.className}`}
                value={props.value}
                onChange={props.onValueSet as (value: Value) => void}
                international={props.international}
                countryCallingCodeEditable={props.countryCallingCodeEditable}
                defaultCountry={'DK'}
            />
        </LabelBox>
    );
};

//复选框组件
export const LabeledCheckboxGroup = (props: {
    label: string,
    onValueSet: (selectedValues: string[]) => void, //(selectedValues) => setPatientData({...patientData, interests: selectedValues})
    values: { value: string, text: string }[],
    selectedValues: string[],
    className?: string,
    tooltip?: string
}) => {
    const handleCheckboxChange = (value: string, isChecked: boolean) => {
        if (isChecked) {
            // 如果复选框被选中，将值添加到选中值数组中
            props.onValueSet([...props.selectedValues, value]);
        } else {
            // 如果复选框被取消选中，将值从选中值数组中移除
            //filter() 方法创建一个新的数组，新数组中的元素是通过检查指定数组中符合条件的所有元素，即选中的元素不等于造成change的value
            props.onValueSet(props.selectedValues.filter(selectedValue => selectedValue !== value));
        }
    };

    return <LabelBox label={props.label} className={props.className} tooltip={props.tooltip}>
        {props.values.map(checkboxValue => (
            <div key={checkboxValue.value} className="flex items-center">
                <input
                    type="checkbox"
                    id={checkboxValue.value}
                    value={checkboxValue.value}
                    checked={props.selectedValues.includes(checkboxValue.value)}
                    onChange={(event) => handleCheckboxChange(checkboxValue.value, event.target.checked)}
                />
                <label htmlFor={checkboxValue.value} className="ml-2">{checkboxValue.text}</label>
            </div>
        ))}
    </LabelBox>
};


export const LabeledInput = (props: {
    label: string,
    placeholder: string,
    onValueSet: (value: string) => void,
    value: string,
    type?: HTMLInputTypeAttribute,
    expand?: boolean,
    className?: string,
    tooltip?: string
}) => {

    return <LabelBox label={props.label} expand={props.expand} tooltip={props.tooltip}>
        <input
            className={`${props.expand ? 'flex-1 max-w-full w-full' : ''} ${props.className}`}
            placeholder={props.placeholder}
            type={props.type}
            value={props.value}
            onChange={(e) => props.onValueSet(e.target.value)}
        />
    </LabelBox>
}

export const LabeledTimeInput = (props: {
    label: string,
    onValueSet: (value: Date) => void,
    value?: Date,
    setIsTimeSet: (value: boolean) => void,
    expand?: boolean,
    tooltip?: string
}) => {
    const time = props.value ?
        props.value.getHours().toString().padStart(2, '0') + ':'
        + props.value.getMinutes().toString().padStart(2, '0')
        : undefined; //如果props.value存在，就是props.value得到的时间，否则不设置时间
    // 获得当前的小时和分钟,例如"12:30"，为了在input中显示，所以日期无所谓
    if (time) props.setIsTimeSet(true);


    return <LabelBox label={props.label} expand={props.expand} tooltip={props.tooltip}>
        <input
            className={`${props.expand ? 'flex-1 max-w-full' : ''}`}
            type='time'
            onChange={(e) => {
                // valueAsDate is apparently some trap api that doesn't do what one would expect
                const values = e.target.value.split(':').map(value => +value);
                const newDate = new Date(); //当前时间的Date对象
                newDate.setHours(values[0], values[1]); //当前时间的Date对象设置小时和分钟
                props.onValueSet(newDate);
                props.setIsTimeSet(true);
            }}
            value={time} //显示的是当前的时间
        />
    </LabelBox>
}

export const LabeledRange = (props: {
    label: string
    min: number
    max: number
    step1?: number
    step2?: number
    unit: string
    value: number
    onChanged: (newValue: number) => void
    showManualInput?: boolean,
    tooltip?: string
}) => {
    return <LabelBox label={props.label} tooltip={props.tooltip}>
        <div className={'flex gap-2 items-center [&>span]:text-text-light'}>
            <span className={'w-7'}>{props.min}</span>
            <input
                type={'range'}
                min={props.min}
                step={props.step1}
                max={props.max}
                value={props.value}
                onChange={e => props.onChanged(+e.target.value)}
            />
            <span className={'w-7'}>{props.max}</span>
            {props.showManualInput || props.showManualInput === undefined && <><input
                className={`w-24`}
                type={"number"}
                value={props.value}
                min={props.min}
                max={props.max}
                step={props.step2}
                onChange={e => props.onChanged(+e.target.value)}
            />
                <span>{props.unit}</span></>}
        </div>
    </LabelBox>
}

export const LabeledSelect = (props: {
    label: string,
    placeholder: string,
    onValueSet: (value: string) => void,
    value: string,
    values: { value: string, text: string }[],
    tooltip?: string,
    expand?: boolean
}) => {
    return <LabelBox label={props.label} tooltip={props.tooltip}>
        <select
            className={`bg-down-triangle appearance-none bg-no-repeat bg-[center_right_0.5em] pr-12 ${props.expand ? 'flex-1 max-w-full' : ''}`}
            value={props.value}
            onChange={(event) => props.onValueSet(event.target.value)}
        >
            {props.values.map(value => <option value={value.value} key={value.value}>{value.text}</option>)}
        </select>
    </LabelBox>
}

export const LabeledNumberInput = (props: {
    label: string,
    placeholder?: string,
    onValueSet: (value: number) => void,
    value: number,
    tooltip?: string,
    currentState?: number | null
}) => {
    const [error, setError] = useState('');

    return <>
        <LabelBox label={props.label} tooltip={props.tooltip}>
            {props.currentState && <div className={'text-primary'}>
                {`Current state: ${parseFloat(props.currentState.toFixed(1))}`}
            </div>}
            {props.currentState === null && <div className={'text-primary'}> No data of current state </div>}
            <input
                placeholder={props.placeholder ?? ''}
                type={'number'}
                value={props.value}
                onChange={(e) => {
                    if (+e.target.value < 0) {
                        setError('Value must not be less than 0');
                    } else {
                        setError('');
                    }
                    props.onValueSet(Number(e.target.value));
                }}
            />
            {error && <div className="text-red-500">{error}</div>}
        </LabelBox>

    </>
}

export const LabeledTextArea = (props: {
    label: string, placeholder: string, onValueSet: (value: string) => void, value: string, className?: string,
    tooltip?: string
}) => {
    return <LabelBox label={props.label} className={props.className} tooltip={props.tooltip}>
        <textarea
            placeholder={props.placeholder}
            value={props.value}
            onChange={(e) => props.onValueSet(e.target.value)}
        />
    </LabelBox>
}

export const LabeledCheckbox = (props: {
    label: string, onValueSet: (value: boolean) => void, value: boolean
}) => {
    return <label className={'flex gap-4 my-1 cursor-pointer select-none'}>
        <input
            type='checkbox'
            checked={props.value}
            onChange={(e) => props.onValueSet(e.target.checked as unknown as boolean)}
        />
        {props.label}
    </label>
}


export const BigSelect = (props: {
    onValueSet: (value: string) => void,
    value: string,
    values: { value: string, text: string }[],
    className?: string
}) => {
    return <select
        value={props.value}
        onChange={(event) => props.onValueSet(event.target.value)}
        className={`text-text-dark text-xl font-bold w-48 cursor-pointer uppercase 
            bg-transparent bg-down-triangle appearance-none bg-no-repeat bg-[center_right_0.5em] bg-[length:30px_30px] ${props.className}`}>
        {props.values.map(value => <option value={value.value} key={value.value}>{value.text}</option>)}
    </select>
}

export const LabeledToBase64FileInput = (props: {   //图片上传组件，将图片转换为base64格式
    label: string,
    valueBase64: string,
    onValueSet: (valueBase64: string) => void,
    className?: string
    tooltip?: string
}) => {

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files) return
        getBase64(files[0])
    };

    const getBase64 = (file: File) => {
        let reader = new FileReader()
        reader.readAsDataURL(file);
        reader.onload = () => {
            props.onValueSet(reader.result as string)
        }
    }

    return <LabelBox label={props.label} className={'flex-row'} tooltip={props.tooltip}>
        <div className={'flex gap-2 items-center w-56'}>
            {props.valueBase64.length > 0 &&
                <img src={props.valueBase64} className={'h-10 aspect-square border flex-shrink-0'} alt={'preview'}/>}
            <input
                className={`flex-grow ${props.className}`}
                type={'file'}
                accept="image/png, image/jpeg, image/gif"
                onChange={onChange}
            />
        </div>
    </LabelBox>
}


export const LabeledMinMaxInput = (props: {
    label: string,
    onMinValueSet: (value: number) => void,
    onMaxValueSet: (value: number) => void,
    minValue: number,
    maxValue: number,
    tooltip?: string,
    currentState: { min: number, max: number } | null,
}) => {
    const [error, setError] = useState('');

    const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        props.onMinValueSet(value);
    };

    const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        props.onMaxValueSet(value);
    };

    // console.log(props.minValue, props.maxValue);

    useEffect(() => {
        if(props.minValue > props.maxValue) {
            setError('Min value must be less than Max value');
        }else{
            setError('');
        }
    }, [props.minValue, props.maxValue]);

    return (
        <div>
            <LabelBox label={props.label} tooltip={props.tooltip}>
                {props.currentState !== null ? <div className={'text-primary'}>
                    {`Current state: ${parseFloat(props.currentState.min.toFixed(1))} - ${parseFloat(props.currentState.max.toFixed(1))}`}
                </div> : <div className={'text-primary'}> No data of current state </div>}
                <div className="flex items-center space-x-2">
                    <input
                        type={'number'}
                        value={props.minValue}
                        onChange={handleMinChange}
                        className="w-[88px]"
                    />
                    <span>-</span>
                    <input
                        type={'number'}
                        value={props.maxValue}
                        onChange={handleMaxChange}
                        className="w-[88px]"
                    />
                </div>
            </LabelBox>
            {error && <div className="text-red-500 break-words max-w-[calc(2*88px+0.5rem)]">{error}</div>}
        </div>
    );
};

export const LabeledTimeInputWithSelect = (props: {
    label: string,
    onValueSet: (value: Date) => void,
    value: Date,
    expand?: boolean,
    tooltip?: string,
    error?: string
}) => {
    const hours = Array.from({length: 24}, (_, i) => i.toString().padStart(2, '0'));
    const minutes = Array.from({length: 60}, (_, i) => i.toString().padStart(2, '0'));

    const handleTimeChange = (e: ChangeEvent<HTMLSelectElement>, type: 'hour' | 'minute') => {
        const newDate = new Date(props.value);
        if (type === 'hour') {
            newDate.setHours(parseInt(e.target.value, 10));
        } else {
            newDate.setMinutes(parseInt(e.target.value, 10));
        }
        props.onValueSet(newDate);
    };
    return <>
        <LabelBox label={props.label} expand={props.expand} tooltip={props.tooltip}>
            <div className="flex items-center space-x-2">
                <select
                    className="w-20"
                    value={props.value.getHours().toString().padStart(2, '0')}
                    onChange={(e) => handleTimeChange(e, 'hour')}
                >
                    {hours.map((hour) => (
                        <option key={hour} value={hour}>
                            {hour}
                        </option>
                    ))}
                </select>
                <span>:</span>
                <select
                    className="w-20"
                    value={props.value.getMinutes().toString().padStart(2, '0')}
                    onChange={(e) => handleTimeChange(e, 'minute')}
                >
                    {minutes.map((minute) => (
                        <option key={minute} value={minute}>
                            {minute}
                        </option>
                    ))}
                </select>
            </div>
        </LabelBox>
        {props.error && <div className="text-red-500">{props.error}</div>}
    </>
};


export const LabeledAvatarFileInput = (props: {
    label: string,
    value:File|null,
    onValueSet: (valueBase64: File|null) => void,
    className?: string
    tooltip?: string
}) => {

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        if(e.target.files && e.target.files.length>0) {
            props.onValueSet(e.target.files[0]);

        }
    };

    return <LabelBox label={props.label} className={'flex-row'} tooltip={props.tooltip}>
        <div className={'flex gap-2 items-center w-56'}>
            <input
                className={`flex-grow ${props.className}`}
                type={'file'}
                accept={".glb"}
                multiple={false}
                onChange={onChange}
            />
        </div>
    </LabelBox>
};


export const LoginInput = (props: {
    placeholder: string,
    onValueSet: (value: string) => void,
    value: string,
    error?: string,
    prefixIcon?: ReactNode,
    postfixIcon?: ReactNode,
    type: HTMLInputTypeAttribute,
}) => {
    return <>
        <div
            className={`border-primary border-[1px] bg-white rounded flex justify-center items-center
            focus-within:border-blue-500 focus-within:border-2 w-60`}>
            {props.prefixIcon && <div className={`ml-2`}>
                {props.prefixIcon}
            </div>}
            <input
                className={`border-0 placeholder:text-gray-400 focus:outline-none w-full h-full bg-transparent text-black px-2`}
                type={props.type}
                value={props.value}
                placeholder={props.placeholder}
                onChange={(e: ChangeEvent<HTMLInputElement>) => props.onValueSet(e.target.value)}>
            </input>
            {props.postfixIcon && <div className={`mr-2`}>
                {props.postfixIcon}
            </div>}
        </div>
    </>
};