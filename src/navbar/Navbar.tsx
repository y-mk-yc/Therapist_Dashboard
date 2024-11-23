import {AiFillPieChart, AiOutlineDribbble, AiOutlineTeam} from 'react-icons/ai'
import {NavLink} from 'react-router-dom'
import {ReHybLogo} from '../common/ReHybLogo'

export const Navbar = () => {
    const navItems: { icon: JSX.Element, text: string, link: string }[] = [
        {icon: <AiFillPieChart/>, text: 'Dashboard', link: ''},
        {icon: <AiOutlineTeam/>, text: 'Patients', link: 'patients'},
        {icon: <AiOutlineDribbble/>, text: 'Exercises', link: 'exercises'},
        // {icon: <AiOutlineDribbble/>, text: 'Test', link: 'test'}
    ]

    return <div className="flex flex-col w-auto bg-white shadow p-2 gap-2">
        <div className={'flex py-4 justify-center'}><ReHybLogo/></div>
        {navItems.map((item) =>
            <NavLink
                key={item.link}
                className={({isActive, isPending}) => {
                    const base = `
                    flex flex-row rounded-xl py-2 px-4 cursor-pointer max-lg:justify-center
                        items-center gap-4 border border-transparent hover:border-primary [&>span]:text-primary transition-all duration-200 [&>svg]:fill-primary
                        [&>svg]:max-lg:w-6 [&>svg]:max-lg:h-6
                        `
                    return base + ' ' + (isActive ? "bg-primary [&>span]:text-white [&>svg]:fill-white" : undefined)
                }
                }
                to={item.link}>
                {item.icon}
                <span className={`text-lg max-lg:hidden`}>{item.text}</span>
            </NavLink>)}
    </div>
}