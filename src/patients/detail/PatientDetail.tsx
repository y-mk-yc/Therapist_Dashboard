import {NavLink, Outlet, useLocation, useNavigate, useParams} from 'react-router-dom'
// import {AiOutlineLeft} from 'react-icons/ai'
import { BackButton } from '../../common/Buttons'
import {useGetPatientsByPatientIdQuery} from "../../store/rehybApi";
import {Loader} from "../../common/Loader";


const Tab = (props: { name: string, linkTo: string, isEnd?: boolean }) => {
    return <NavLink
        end={props.isEnd}
        className={({isActive, isPending}) => {
            const base = `p-2 px-6 text-primary rounded-t-lg font-medium 
                cursor-pointer hover:brightness-105 select-none whitespace-nowrap `

            return base + (isActive ? 'bg-primary text-white' : 'bg-secondary')
        }}
        to={props.linkTo}>
        {props.name}
    </NavLink>
}

const TabBar = () => {
    const {patientId} = useParams()
    const {data,isLoading} = useGetPatientsByPatientIdQuery({PatientID: patientId!}) //感叹号表示确定一定不为空

    if (!data||isLoading) return <Loader/>

    return <div className='bg-white flex flex-row gap-x-16 gap-y-4 pt-4 flex-wrap'>
        <BackButton label={data.Name} backPath={'/patients'}/> {/*返回按钮*/}
        <div className='flex flex-row justify-center gap-1 sm:gap-4'>
            <Tab name={'Overview'} linkTo={''} isEnd={true}/> {/*isEnd用来设置NavLink的end属性,其为true时表示路径完全匹配，搭配isActive使用*/}
            <Tab name={'Patient\'s data'} linkTo={'data'}/>
            <Tab name={'Exercise plan'} linkTo={'exercises'}/>
        </div>
    </div>
}

export const PatientDetail = () => {
    return <div className='flex flex-col h-full w-full'>
        <TabBar/>
        <div className='flex shadow-inner flex-1 w-full'>
            <Outlet/>
        </div>
    </div>
}