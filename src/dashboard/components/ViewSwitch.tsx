import {FancySwitch} from "../../common/FancySwitch";
import {LoggedInUser, userSlice} from "../../store/slices/userSlice";
import React from "react";
import {useDispatch} from "react-redux";
import {useAppSelector} from "../../store/store";

export const ViewSwitch = () => {
    const dispatch = useDispatch()
    const viewType = useAppSelector((state) => (state.userReducer.user as LoggedInUser).settings.viewType) ?? 'IN_CLINIC'

    return <FancySwitch left={{name: 'In-clinic', value: true}}
                        right={{name: 'Home-based', value: false}}
                        active={{name: 'In-clinic', value: viewType == 'IN_CLINIC'}}
                        onChange={(newValue) => {
                            dispatch(userSlice.actions.setViewType(newValue.value ? 'IN_CLINIC' : 'AT_HOME'))
                        }}/>
}