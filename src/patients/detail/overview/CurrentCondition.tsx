import {CircularProgress} from '../../../common/graphs/CircularProgress'
import {FC, ReactNode, useState} from 'react'
import {useParams} from "react-router-dom";
import {
    useGetPatientsByPatientIdDataQuery,
    useGetUsermodelByPatientIdQuery
} from "../../../store/rehybApi";
import {Loader} from "../../../common/Loader";
import {Tooltip} from "../../../common/dialogs/Tooltip";
import {UserModel, StateVariable} from "../../../store/rehybApi";


export const calculateCondition =
    (stateVariable: StateVariable,
     userModel: UserModel,
     goal: 'shortTerm' | 'longTerm',
     cutOffDate?: string) => {
        /////////////////////////value of goals/////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////
        const quantification = goal === 'longTerm' ? userModel.TherapyGoals?.LongTerm?.Quantification :
            userModel.TherapyGoals?.ShortTerm?.Quantification;
        if (!quantification) return undefined; //这里返回undefined表示没有goal的数据

        ///shoulder goals,计算的结果类型可能是number,undefined,NaN
        const rangeShoulderAA = quantification?.Physical?.ROM?.AngleShoulderAA?.Max - quantification?.Physical?.ROM?.AngleShoulderAA?.Min;
        const rangeShoulderFE = quantification?.Physical?.ROM?.AngleShoulderFE?.Max - quantification?.Physical?.ROM?.AngleShoulderFE?.Min;
        const rangeShoulderIE = quantification?.Physical?.ROM?.AngleShoulderIE?.Max - quantification?.Physical?.ROM?.AngleShoulderIE?.Min;
        const enduranceShoulder = quantification?.Physical?.Endurance?.Shoulder;
        const spasticityShoulderAA = quantification?.Physical?.Spasticity?.ShoulderAA;
        const spasticityShoulderFE = quantification?.Physical?.Spasticity?.ShoulderFE;
        const spasticityShoulderIE = quantification?.Physical?.Spasticity?.ShoulderIE;
        const strengthShoulderAA = quantification?.Physical?.Strength?.RequiredSupportShoulderAA;
        const strengthShoulderFE = quantification?.Physical?.Strength?.RequiredSupportShoulderFE;
        const strengthShoulderIE = quantification?.Physical?.Strength?.RequiredSupportShoulderIE;

        ///elbow goals，计算的结果类型可能是number,undefined,NaN
        const rangeElbowFE = quantification?.Physical?.ROM?.AngleElbowFE?.Max - quantification?.Physical?.ROM?.AngleElbowFE?.Min;
        const enduranceElbow = quantification?.Physical?.Endurance?.Elbow;
        const spasticityElbow = quantification?.Physical?.Spasticity?.Elbow;
        const strengthElbowFE = quantification?.Physical?.Strength?.RequiredSupportElbowFE;

        ///wrist goals，计算的结果类型可能是number,undefined,NaN
        const rangeWristPS = quantification?.Physical?.ROM?.AngleWristPS?.Max - quantification?.Physical?.ROM?.AngleWristPS?.Min;
        //endurance,strength好像没有wrist 数据？
        const spasticityWrist = quantification?.Physical?.Spasticity?.Wrist;

        ///hand goals，计算的结果类型可能是number,undefined,NaN
        const rangeIndexFE = quantification?.Physical?.ROM?.AngleIndexFE?.Max - quantification?.Physical?.ROM?.AngleIndexFE?.Min;
        const enduranceHand = quantification?.Physical?.Endurance?.Hand;
        const spasticityHand = quantification?.Physical?.Spasticity?.Hand;
        const strengthHand = quantification?.Physical?.Strength?.RequiredSupportGrip;

        ////////////////////////////////////////////////////////////////////////////
        /////////////////////////value of goals/////////////////////////////////////


        /////////////////////////value of stateVariables////////////////////////////
        ////////////////////////////////////////////////////////////////////////////
        function findLatestByDate(items: { Date: string, [key: string]: any }[]) {
            if (!items || items.length === 0) return undefined;
            //如果Spasticity.ShoulderAA, Spasticity.ShoulderFE, Spasticity.ShoulderIE等等的数据是空数组或者字段根本不存在，就返回undefined
            const cutOff = cutOffDate ? new Date(cutOffDate) : new Date();
            const itemsBeforeCutOff = items.filter(i => new Date(i.Date) <= cutOff);
            if (itemsBeforeCutOff.length === 0) return undefined;
            return itemsBeforeCutOff.reduce((latest, current) => {
                const latestDate = new Date(latest.Date);
                const currentDate = new Date(current.Date);
                return (currentDate > latestDate) ? current : latest;
            });
        }

        function findOldestByDate(items: { Date: string, [key: string]: any }[]) {
            if (!items || items.length === 0) return undefined;
            const cutOff = cutOffDate ? new Date(cutOffDate) : new Date();
            const itemsBeforeCutOff = items.filter(i => new Date(i.Date) <= cutOff);
            if (itemsBeforeCutOff.length === 0) return undefined;
            return itemsBeforeCutOff.reduce((oldest, current) => {
                const oldestDate = new Date(oldest.Date);
                const currentDate = new Date(current.Date);
                return (currentDate < oldestDate) ? current : oldest;
            });
        }

        function calculateSpasticityValue(spasticity: {
            Date: string,
            Assessment: { Speed: string, Spasticity: { Angle: number, Torque: number }[] }[]
        } | undefined) {
            //所有出现的Torque值的平均值
            if (!spasticity) return undefined;
            const allTorque = spasticity.Assessment.flatMap(a => a.Spasticity.map(s => s.Torque));
            if (allTorque.length === 0) return undefined;
            return allTorque.reduce((a, b) => a + b, 0) / allTorque.length;
        }

        ///shoulder stateVariables
        const latestROMShoulderAA = findLatestByDate(stateVariable.Physical?.ROM?.AngleShoulderAA) as
            { Max: number, Min: number, Date: string } | undefined;
        const oldestROMShoulderAA = findOldestByDate(stateVariable.Physical?.ROM?.AngleShoulderAA) as
            { Max: number, Min: number, Date: string } | undefined;
        const latestROMShoulderFE = findLatestByDate(stateVariable.Physical?.ROM?.AngleShoulderFE) as
            { Max: number, Min: number, Date: string } | undefined;
        const oldestROMShoulderFE = findOldestByDate(stateVariable.Physical?.ROM?.AngleShoulderFE) as
            { Max: number, Min: number, Date: string } | undefined;
        const latestROMShoulderIE = findLatestByDate(stateVariable.Physical?.ROM?.AngleShoulderIE) as
            { Max: number, Min: number, Date: string } | undefined;
        const oldestROMShoulderIE = findOldestByDate(stateVariable.Physical?.ROM?.AngleShoulderIE) as
            { Max: number, Min: number, Date: string } | undefined;
        const latestEnduranceShoulder = findLatestByDate(stateVariable.Physical?.Endurance?.Shoulder) as
            { Date: string, TimeToFatigue: number } | undefined;
        const oldestEnduranceShoulder = findOldestByDate(stateVariable.Physical?.Endurance?.Shoulder) as
            { Date: string, TimeToFatigue: number } | undefined;
        const latestSpasticityShoulderAA = findLatestByDate(stateVariable.Physical?.Spasticity?.ShoulderAA) as
            {
                Date: string,
                Assessment: { Speed: string, Spasticity: { Angle: number, Torque: number }[] }[]
            } | undefined;
        const oldestSpasticityShoulderAA = findOldestByDate(stateVariable.Physical?.Spasticity?.ShoulderAA) as
            {
                Date: string,
                Assessment: { Speed: string, Spasticity: { Angle: number, Torque: number }[] }[]
            } | undefined;
        const latestSpasticityShoulderFE = findLatestByDate(stateVariable.Physical?.Spasticity?.ShoulderFE) as
            {
                Date: string,
                Assessment: { Speed: string, Spasticity: { Angle: number, Torque: number }[] }[]
            } | undefined;
        const oldestSpasticityShoulderFE = findOldestByDate(stateVariable.Physical?.Spasticity?.ShoulderFE) as
            {
                Date: string,
                Assessment: { Speed: string, Spasticity: { Angle: number, Torque: number }[] }[]
            } | undefined;
        const latestSpasticityShoulderIE = findLatestByDate(stateVariable.Physical?.Spasticity?.ShoulderIE) as
            {
                Date: string,
                Assessment: { Speed: string, Spasticity: { Angle: number, Torque: number }[] }[]
            } | undefined;
        const oldestSpasticityShoulderIE = findOldestByDate(stateVariable.Physical?.Spasticity?.ShoulderIE) as
            {
                Date: string,
                Assessment: { Speed: string, Spasticity: { Angle: number, Torque: number }[] }[]
            } | undefined;
        const latestStrengthShoulderAA = findLatestByDate(stateVariable.Physical?.Strength?.RequiredSupportShoulderAA) as
            { Torque: number, Date: string } | undefined;
        const oldestStrengthShoulderAA = findOldestByDate(stateVariable.Physical?.Strength?.RequiredSupportShoulderAA) as
            { Torque: number, Date: string } | undefined;
        const latestStrengthShoulderFE = findLatestByDate(stateVariable.Physical?.Strength?.RequiredSupportShoulderFE) as
            { Torque: number, Date: string } | undefined;
        const oldestStrengthShoulderFE = findOldestByDate(stateVariable.Physical?.Strength?.RequiredSupportShoulderFE) as
            { Torque: number, Date: string } | undefined;
        const latestStrengthShoulderIE = findLatestByDate(stateVariable.Physical?.Strength?.RequiredSupportShoulderIE) as
            { Torque: number, Date: string } | undefined;
        const oldestStrengthShoulderIE = findOldestByDate(stateVariable.Physical?.Strength?.RequiredSupportShoulderIE) as
            { Torque: number, Date: string } | undefined;

        const latestROMShoulderAAValue = latestROMShoulderAA && (latestROMShoulderAA?.Max - latestROMShoulderAA?.Min);
        const oldestROMShoulderAAValue = oldestROMShoulderAA && (oldestROMShoulderAA?.Max - oldestROMShoulderAA?.Min);
        const latestROMShoulderFEValue = latestROMShoulderFE && (latestROMShoulderFE?.Max - latestROMShoulderFE?.Min);
        const oldestROMShoulderFEValue = oldestROMShoulderFE && (oldestROMShoulderFE?.Max - oldestROMShoulderFE?.Min);
        const latestROMShoulderIEValue = latestROMShoulderIE && (latestROMShoulderIE?.Max - latestROMShoulderIE?.Min);
        const oldestROMShoulderIEValue = oldestROMShoulderIE && (oldestROMShoulderIE?.Max - oldestROMShoulderIE?.Min);
        const latestEnduranceShoulderValue = latestEnduranceShoulder?.TimeToFatigue;
        const oldestEnduranceShoulderValue = oldestEnduranceShoulder?.TimeToFatigue;
        const latestSpasticityShoulderAAValue = calculateSpasticityValue(latestSpasticityShoulderAA);
        const oldestSpasticityShoulderAAValue = calculateSpasticityValue(oldestSpasticityShoulderAA);
        const latestSpasticityShoulderFEValue = calculateSpasticityValue(latestSpasticityShoulderFE);
        const oldestSpasticityShoulderFEValue = calculateSpasticityValue(oldestSpasticityShoulderFE);
        const latestSpasticityShoulderIEValue = calculateSpasticityValue(latestSpasticityShoulderIE);
        const oldestSpasticityShoulderIEValue = calculateSpasticityValue(oldestSpasticityShoulderIE);
        const latestStrengthShoulderAAValue = latestStrengthShoulderAA?.Torque;
        const oldestStrengthShoulderAAValue = oldestStrengthShoulderAA?.Torque;
        const latestStrengthShoulderFEValue = latestStrengthShoulderFE?.Torque;
        const oldestStrengthShoulderFEValue = oldestStrengthShoulderFE?.Torque;
        const latestStrengthShoulderIEValue = latestStrengthShoulderIE?.Torque;
        const oldestStrengthShoulderIEValue = oldestStrengthShoulderIE?.Torque;

        ///elbow stateVariables
        const latestROMElbowFE = findLatestByDate(stateVariable.Physical?.ROM?.AngleElbowFE) as
            { Max: number, Min: number, Date: string } | undefined;
        const oldestROMElbowFE = findOldestByDate(stateVariable.Physical?.ROM?.AngleElbowFE) as
            { Max: number, Min: number, Date: string } | undefined;
        const latestEnduranceElbow = findLatestByDate(stateVariable.Physical?.Endurance?.Elbow) as
            { Date: string, TimeToFatigue: number } | undefined;
        const oldestEnduranceElbow = findOldestByDate(stateVariable.Physical?.Endurance?.Elbow) as
            { Date: string, TimeToFatigue: number } | undefined;
        const latestSpasticityElbowFE = findLatestByDate(stateVariable.Physical?.Spasticity?.ElbowFE) as
            {
                Date: string,
                Assessment: { Speed: string, Spasticity: { Angle: number, Torque: number }[] }[]
            } | undefined;
        const oldestSpasticityElbowFE = findOldestByDate(stateVariable.Physical?.Spasticity?.ElbowFE) as
            {
                Date: string,
                Assessment: { Speed: string, Spasticity: { Angle: number, Torque: number }[] }[]
            } | undefined;
        const latestStrengthElbowFE = findLatestByDate(stateVariable.Physical?.Strength?.RequiredSupportElbowFE) as
            { Torque: number, Date: string } | undefined;
        const oldestStrengthElbowFE = findOldestByDate(stateVariable.Physical?.Strength?.RequiredSupportElbowFE) as
            { Torque: number, Date: string } | undefined;

        const latestROMElbowFEValue = latestROMElbowFE && (latestROMElbowFE?.Max - latestROMElbowFE?.Min);
        const oldestROMElbowFEValue = oldestROMElbowFE && (oldestROMElbowFE?.Max - oldestROMElbowFE?.Min);
        const latestEnduranceElbowValue = latestEnduranceElbow?.TimeToFatigue;
        const oldestEnduranceElbowValue = oldestEnduranceElbow?.TimeToFatigue;
        const latestSpasticityElbowFEValue = calculateSpasticityValue(latestSpasticityElbowFE);
        const oldestSpasticityElbowFEValue = calculateSpasticityValue(oldestSpasticityElbowFE);
        const latestStrengthElbowFEValue = latestStrengthElbowFE?.Torque;
        const oldestStrengthElbowFEValue = oldestStrengthElbowFE?.Torque;

        ///wrist stateVariables
        const latestROMWristPS = findLatestByDate(stateVariable.Physical?.ROM?.AngleWristPS) as
            { Max: number, Min: number, Date: string } | undefined;
        const oldestROMWristPS = findOldestByDate(stateVariable.Physical?.ROM?.AngleWristPS) as
            { Max: number, Min: number, Date: string } | undefined;
        //endurance,strength,spasticity 好像没有wrist 数据？

        const latestROMWristPSValue = latestROMWristPS && (latestROMWristPS?.Max - latestROMWristPS?.Min);
        const oldestROMWristPSValue = oldestROMWristPS && (oldestROMWristPS?.Max - oldestROMWristPS?.Min);

        ///hand stateVariables
        const latestROMIndexFE = findLatestByDate(stateVariable.Physical?.ROM?.AngleIndexFE) as
            { Max: number, Min: number, Date: string } | undefined;
        const oldestROMIndexFE = findOldestByDate(stateVariable.Physical?.ROM?.AngleIndexFE) as
            { Max: number, Min: number, Date: string } | undefined;
        const latestEnduranceHand = findLatestByDate(stateVariable.Physical?.Endurance?.Hand) as
            { Date: string, TimeToFatigue: number } | undefined;
        const oldestEnduranceHand = findOldestByDate(stateVariable.Physical?.Endurance?.Hand) as
            { Date: string, TimeToFatigue: number } | undefined;
        const latestSpasticityHand = findLatestByDate(stateVariable.Physical?.Spasticity?.Hand) as
            {
                Date: string,
                Assessment: { Speed: string, Spasticity: { Angle: number, Torque: number }[] }[]
            } | undefined;
        const oldestSpasticityHand = findOldestByDate(stateVariable.Physical?.Spasticity?.Hand) as
            {
                Date: string,
                Assessment: { Speed: string, Spasticity: { Angle: number, Torque: number }[] }[]
            } | undefined;
        const latestStrengthHand = findLatestByDate(stateVariable.Physical?.Strength?.RequiredSupportGrip) as
            { FESSupport: number, Date: string } | undefined;
        const oldestStrengthHand = findOldestByDate(stateVariable.Physical?.Strength?.RequiredSupportGrip) as
            { FESSupport: number, Date: string } | undefined;

        const latestROMIndexFEValue = latestROMIndexFE && (latestROMIndexFE?.Max - latestROMIndexFE?.Min);
        const oldestROMIndexFEValue = oldestROMIndexFE && (oldestROMIndexFE?.Max - oldestROMIndexFE?.Min);
        const latestEnduranceHandValue = latestEnduranceHand?.TimeToFatigue;
        const oldestEnduranceHandValue = oldestEnduranceHand?.TimeToFatigue;
        const latestSpasticityHandValue = calculateSpasticityValue(latestSpasticityHand);
        const oldestSpasticityHandValue = calculateSpasticityValue(oldestSpasticityHand);
        const latestStrengthHandValue = latestStrengthHand?.FESSupport;
        const oldestStrengthHandValue = oldestStrengthHand?.FESSupport;

        ////////////////////////////////////////////////////////////////////////////
        /////////////////////////value of stateVariables////////////////////////////
        function areVariablesValid(...args: any[]) {
            return args.every(v => v !== undefined && !isNaN(v));
        }

        function calculateROMProgress(latestROMValue: number, oldestROMValue: number, rangeGoalValue: number) {
            if (latestROMValue >= rangeGoalValue) {
                return 1;
            } else {
                if (oldestROMValue >= rangeGoalValue) {
                    return 0;
                } else {
                    const progress = (latestROMValue - oldestROMValue) / (rangeGoalValue - oldestROMValue);
                    return progress <= 0 ? 0 : progress;
                }
            }
        }

        function calculateEnduranceProgress(latestEnduranceValue: number, oldestEnduranceValue: number, enduranceGoalValue: number) {
            if (latestEnduranceValue >= enduranceGoalValue) {
                return 1;
            } else {
                if (oldestEnduranceValue >= enduranceGoalValue) {
                    return 0;
                } else {
                    const progress = (latestEnduranceValue - oldestEnduranceValue) / (enduranceGoalValue - oldestEnduranceValue);
                    return progress <= 0 ? 0 : progress;
                }
            }
        }

        function calculateSpasticityProgress(latestSpasticityValue: number, oldestSpasticityValue: number, spasticityGoalValue: number) {
            if (latestSpasticityValue <= spasticityGoalValue) {
                return 1;
            } else {
                if (oldestSpasticityValue <= spasticityGoalValue) {
                    return 0;
                } else {
                    const progress = (oldestSpasticityValue - latestSpasticityValue) / (oldestSpasticityValue - spasticityGoalValue);
                    return progress <= 0 ? 0 : progress;
                }
            }
        }

        function calculateStrengthProgress(latestStrengthValue: number, oldestStrengthValue: number, strengthGoalValue: number) {
            if (latestStrengthValue <= strengthGoalValue) {
                return 1;
            } else {
                if (oldestStrengthValue <= strengthGoalValue) {
                    return 0;
                } else {
                    const progress = (oldestStrengthValue - latestStrengthValue) / (oldestStrengthValue - strengthGoalValue);
                    return progress <= 0 ? 0 : progress;
                }
            }
        }


        //注意ROM，Endurance是越大越好，Spasticity,Strength是越小越好
        let shoulderROMAA = areVariablesValid(latestROMShoulderAAValue, oldestROMShoulderAAValue, rangeShoulderAA) ?
            calculateROMProgress(latestROMShoulderAAValue!, oldestROMShoulderAAValue!, rangeShoulderAA!) : undefined;

        let shoulderROMFE = areVariablesValid(latestROMShoulderFEValue, oldestROMShoulderFEValue, rangeShoulderFE) ?
            calculateROMProgress(latestROMShoulderFEValue!, oldestROMShoulderFEValue!, rangeShoulderFE!) : undefined;

        let shoulderROMIE = areVariablesValid(latestROMShoulderIEValue, oldestROMShoulderIEValue, rangeShoulderIE) ?
            calculateROMProgress(latestROMShoulderIEValue!, oldestROMShoulderIEValue!, rangeShoulderIE!) : undefined;

        let shoulderEndurance = areVariablesValid(latestEnduranceShoulderValue, oldestEnduranceShoulderValue, enduranceShoulder) ?
            calculateEnduranceProgress(latestEnduranceShoulderValue!, oldestEnduranceShoulderValue!, enduranceShoulder!) : undefined;

        let shoulderSpasticityAA = areVariablesValid(latestSpasticityShoulderAAValue, oldestSpasticityShoulderAAValue, spasticityShoulderAA) ?
            calculateSpasticityProgress(latestSpasticityShoulderAAValue!, oldestSpasticityShoulderAAValue!, spasticityShoulderAA!) : undefined;

        let shoulderSpasticityFE = areVariablesValid(latestSpasticityShoulderFEValue, oldestSpasticityShoulderFEValue, spasticityShoulderFE) ?
            calculateSpasticityProgress(latestSpasticityShoulderFEValue!, oldestSpasticityShoulderFEValue!, spasticityShoulderFE!) : undefined;

        let shoulderSpasticityIE = areVariablesValid(latestSpasticityShoulderIEValue, oldestSpasticityShoulderIEValue, spasticityShoulderIE) ?
            calculateSpasticityProgress(latestSpasticityShoulderIEValue!, oldestSpasticityShoulderIEValue!, spasticityShoulderIE!) : undefined;

        let shoulderStrengthAA = areVariablesValid(latestStrengthShoulderAAValue, oldestStrengthShoulderAAValue, strengthShoulderAA) ?
            calculateStrengthProgress(latestStrengthShoulderAAValue!, oldestStrengthShoulderAAValue!, strengthShoulderAA!) : undefined;

        let shoulderStrengthFE = areVariablesValid(latestStrengthShoulderFEValue, oldestStrengthShoulderFEValue, strengthShoulderFE) ?
            calculateStrengthProgress(latestStrengthShoulderFEValue!, oldestStrengthShoulderFEValue!, strengthShoulderFE!) : undefined;

        let shoulderStrengthIE = areVariablesValid(latestStrengthShoulderIEValue, oldestStrengthShoulderIEValue, strengthShoulderIE) ?
            calculateStrengthProgress(latestStrengthShoulderIEValue!, oldestStrengthShoulderIEValue!, strengthShoulderIE!) : undefined;


        let elbowROMFE = areVariablesValid(latestROMElbowFEValue, oldestROMElbowFEValue, rangeElbowFE) ?
            calculateROMProgress(latestROMElbowFEValue!, oldestROMElbowFEValue!, rangeElbowFE!) : undefined;

        let elbowEndurance = areVariablesValid(latestEnduranceElbowValue, oldestEnduranceElbowValue, enduranceElbow) ?
            calculateEnduranceProgress(latestEnduranceElbowValue!, oldestEnduranceElbowValue!, enduranceElbow!) : undefined;

        let elbowSpasticityFE = areVariablesValid(latestSpasticityElbowFEValue, oldestSpasticityElbowFEValue, spasticityElbow) ?
            calculateSpasticityProgress(latestSpasticityElbowFEValue!, oldestSpasticityElbowFEValue!, spasticityElbow!) : undefined;

        let elbowStrengthFE = areVariablesValid(latestStrengthElbowFEValue, oldestStrengthElbowFEValue, strengthElbowFE) ?
            calculateStrengthProgress(latestStrengthElbowFEValue!, oldestStrengthElbowFEValue!, strengthElbowFE!) : undefined;


        let wristROMPS = areVariablesValid(latestROMWristPSValue, oldestROMWristPSValue, rangeWristPS) ?
            calculateROMProgress(latestROMWristPSValue!, oldestROMWristPSValue!, rangeWristPS!) : undefined;


        let handROMIndexFE = areVariablesValid(latestROMIndexFEValue, oldestROMIndexFEValue, rangeIndexFE) ?
            calculateROMProgress(latestROMIndexFEValue!, oldestROMIndexFEValue!, rangeIndexFE!) : undefined;

        let handEndurance = areVariablesValid(latestEnduranceHandValue, oldestEnduranceHandValue, enduranceHand) ?
            calculateEnduranceProgress(latestEnduranceHandValue!, oldestEnduranceHandValue!, enduranceHand!) : undefined;

        let handSpasticity = areVariablesValid(latestSpasticityHandValue, oldestSpasticityHandValue, spasticityHand) ?
            calculateSpasticityProgress(latestSpasticityHandValue!, oldestSpasticityHandValue!, spasticityHand!) : undefined;

        let handStrength = areVariablesValid(latestStrengthHandValue, oldestStrengthHandValue, strengthHand) ?
            calculateStrengthProgress(latestStrengthHandValue!, oldestStrengthHandValue!, strengthHand!) : undefined;

        //加起来求平均值，但是如果有undefined的话就不加且除数减一
        const shoulderVariables = [shoulderROMAA, shoulderROMFE, shoulderROMIE, shoulderEndurance, shoulderSpasticityAA,
            shoulderSpasticityFE, shoulderSpasticityIE, shoulderStrengthAA, shoulderStrengthFE, shoulderStrengthIE]
            .filter(v => v !== undefined);
        const shoulderProgress = shoulderVariables.length === 0 ? undefined :
            (shoulderVariables as number[]).reduce((a, b) => a + b, 0) / shoulderVariables.length;

        const elbowVariables = [elbowROMFE, elbowEndurance, elbowSpasticityFE, elbowStrengthFE].filter(v => v !== undefined);
        const elbowProgress = elbowVariables.length === 0 ? undefined :
            (elbowVariables as number[]).reduce((a, b) => a + b, 0) / elbowVariables.length;

        const wristProgress = wristROMPS;

        const handVariables = [handROMIndexFE, handEndurance, handSpasticity, handStrength].filter(v => v !== undefined);
        const handProgress = handVariables.length === 0 ? undefined :
            (handVariables as number[]).reduce((a, b) => a + b, 0) / handVariables.length;


        const physicalVariables = [shoulderProgress, elbowProgress, wristProgress, handProgress].filter(v => v !== undefined);
        const physicalProgress = physicalVariables.length === 0 ? undefined :
            (physicalVariables as number[]).reduce((a, b) => a + b, 0) / physicalVariables.length;

        // console.log({
        //     shoulderROMAA, shoulderROMFE, shoulderROMIE, shoulderEndurance, shoulderSpasticityAA,
        //     shoulderSpasticityFE, shoulderSpasticityIE, shoulderStrengthAA, shoulderStrengthFE, shoulderStrengthIE,
        //     elbowROMFE, elbowEndurance, elbowSpasticityFE, elbowStrengthFE,
        //     wristROMPS,
        //     handROMIndexFE, handEndurance, handSpasticity, handStrength,
        //     shoulderProgress, elbowProgress, wristProgress, handProgress,
        //     physicalProgress
        // });

        //从shoulderROMAA 开始的值到physicalProgress的值，除了各个后缀是Variables的值，其他值放在一个对象中返回
        return {
            shoulderROMAA, shoulderROMFE, shoulderROMIE, shoulderEndurance, shoulderSpasticityAA,
            shoulderSpasticityFE, shoulderSpasticityIE, shoulderStrengthAA, shoulderStrengthFE, shoulderStrengthIE,
            elbowROMFE, elbowEndurance, elbowSpasticityFE, elbowStrengthFE,
            wristROMPS,
            handROMIndexFE, handEndurance, handSpasticity, handStrength,
            shoulderProgress, elbowProgress, wristProgress, handProgress,
            physicalProgress
        };
    }

export const CurrentCondition = () => {
    const {patientId} = useParams()
    const [goal, setGoal] = useState<'shortTerm' | 'longTerm'>('longTerm');
    const {
        data: stateVariable,
        isLoading: isLoadingSV,
        isError: isErrorSV
    } = useGetPatientsByPatientIdDataQuery({PatientID: patientId!})
    const {
        data: usermodel,
        isLoading: isLoadingUM,
        isError: isErrorUM
    } = useGetUsermodelByPatientIdQuery({PatientID: patientId!})


    if (isLoadingSV || isLoadingUM) return <Loader/>
    if (isErrorSV || isErrorUM || !stateVariable || !usermodel)
        return <div className={`flex-col`}>
            <h3 className={'whitespace-nowrap'}>Patient current condition</h3>
            <p>No data available</p>
        </div>

    const longTermCondition = calculateCondition(stateVariable!, usermodel!, 'longTerm');
    const shortTermCondition = calculateCondition(stateVariable!, usermodel!, 'shortTerm');

    return <div className={'flex flex-col gap-2'}>
        <div className={'flex justify-between gap-4'}>
            <h3 className={'whitespace-nowrap'}>Patient current condition</h3>
            <div className='flex gap-2'>
                <button onClick={() => setGoal('longTerm')}>
                    <span className={`btn-text ${goal == 'longTerm' ? 'font-semibold' : ''}`}>Long-term</span>
                </button>
                <button onClick={() => setGoal('shortTerm')}>
                    <span className={`btn-text ${goal == 'shortTerm' ? 'font-semibold' : ''}`}>Short-term</span>
                </button>
            </div>
        </div>
        <div className='flex flex-wrap gap-2 gap-y-4'>
            {goal == 'longTerm' && <>
                <LabeledProgress title={'Physical score'}
                                 outOf={100}
                                 score={longTermCondition?.physicalProgress !== undefined ? Math.round(longTermCondition.physicalProgress * 100) : undefined}
                    //如果longTermCondition 不存在，就返回undefined，表示没有goal的数据
                                 tip={'Physical score is an average of physical scores for each body part. Each body ' +
                                     'part\'s score consist of range of movement, strength, spasticity and time to fatigue. ' +
                                     'The score is how well the measured movements match the movements of a healthy individuals.'}
                                 leftColumn={
                                     <div className={'flex flex-col'}>
                                         <ScoreComponentRow title={'Shoulder'}
                                                            score={longTermCondition?.shoulderProgress !== undefined ? Math.round(longTermCondition.shoulderProgress * 100) : undefined}
                                                            outOf={100}/>
                                         <ScoreComponentRow title={'Elbow'}
                                                            score={longTermCondition?.elbowProgress !== undefined ? Math.round(longTermCondition.elbowProgress * 100) : undefined}
                                                            outOf={100}/>
                                         {<ScoreComponentRow title={'Wrist'}
                                                             score={longTermCondition?.wristProgress !== undefined ? Math.round(longTermCondition.wristProgress * 100) : undefined}
                                                             outOf={100}/>}
                                         <ScoreComponentRow title={'Hand'}
                                                            score={longTermCondition?.handProgress !== undefined ? Math.round(longTermCondition.handProgress * 100) : undefined}
                                                            outOf={100}/>
                                     </div>}
                />
                <LabeledProgress title={'Cognitive score'}
                                 outOf={100}
                                 score={33} //totalCognitive
                                 leftColumn={
                                     <div className={'flex flex-col'}>
                                         <ScoreComponentRow title={'ReHyb cog. score'}
                                                            score={35}
                                                            outOf={100}/>
                                         <ScoreComponentRow title={'Neglect'}
                                                            score={30}
                                                            outOf={100}/>
                                         <ScoreComponentRow title={'Aphasia'}
                                                            score={40}
                                                            outOf={100}/>
                                         <ScoreComponentRow title={'Cognitive fatigue'}
                                                            score={20}
                                                            outOf={100}/>
                                     </div>
                                 } tip={`
                             Cognitive score is an average score of Rehyb cognitive score, cognitive fatigue, aphasia and neglect. 
                             More details about these variables can be found on the data/cognitive page.
                             `}
                />
            </>}
            {goal == 'shortTerm' && <>
                <LabeledProgress title={'Physical score'}
                                 outOf={100}
                                 score={shortTermCondition?.physicalProgress !== undefined ? Math.round(shortTermCondition.physicalProgress * 100) : undefined}
                                 tip={'Physical score is an average of physical scores for each body part. Each body ' +
                                     'part\'s score consist of range of movement, strength, spasticity and time to fatigue. ' +
                                     'The score is how well the measured movements match the movements of a healthy individuals.'}
                                 leftColumn={
                                     <div className={'flex flex-col'}>
                                         <ScoreComponentRow title={'Shoulder'}
                                                            score={shortTermCondition?.shoulderProgress !== undefined ? Math.round(shortTermCondition.shoulderProgress * 100) : undefined}
                                                            outOf={100}/>
                                         <ScoreComponentRow title={'Elbow'}
                                                            score={shortTermCondition?.elbowProgress !== undefined ? Math.round(shortTermCondition.elbowProgress * 100) : undefined}
                                                            outOf={100}/>
                                         {<ScoreComponentRow title={'Wrist'}
                                                             score={shortTermCondition?.wristProgress !== undefined ? Math.round(shortTermCondition.wristProgress * 100) : undefined}
                                                             outOf={100}/>}
                                         <ScoreComponentRow title={'Hand'}
                                                            score={shortTermCondition?.handProgress !== undefined ? Math.round(shortTermCondition.handProgress * 100) : undefined}
                                                            outOf={100}/>
                                     </div>}
                />
                <LabeledProgress title={'Cognitive score'}
                                 outOf={100}
                                 score={60} //totalCognitive
                                 leftColumn={
                                     <div className={'flex flex-col'}>
                                         <ScoreComponentRow title={'ReHyb cog. score'}
                                                            score={55}
                                                            outOf={100}/>
                                         <ScoreComponentRow title={'Neglect'}
                                                            score={70}
                                                            outOf={100}/>
                                         <ScoreComponentRow title={'Aphasia'}
                                                            score={50}
                                                            outOf={100}/>
                                         <ScoreComponentRow title={'Cognitive fatigue'}
                                                            score={67}
                                                            outOf={100}/>
                                     </div>
                                 } tip={`
                             Cognitive score is an average score of Rehyb cognitive score, cognitive fatigue, aphasia and neglect. 
                             More details about these variables can be found on the data/cognitive page.
                             `}
                />
            </>}
        </div>
    </div>
}

const ScoreComponentRow = (props: { title: string, score: number | undefined, outOf: number }) => {
    return <div className={'flex'}>
        <span className={'flex-1 mr-4 whitespace-nowrap'}>{props.title}</span>
        {/*Shoulder，Elbow，Wrist，Hand*/}
        <span>{props.score ?? '?'}</span>{'\u00A0/\u00A0'}<span className={'text-gray-300'}>{props.outOf}</span>
    </div>
}

const LabeledProgress: FC<{
    title: string,
    leftColumn: ReactNode,
    score: number | undefined
    outOf: number,
    tip: string
}> = ({title, leftColumn, score, outOf, tip}) => {
    return <div className='flex gap-2 justify-start flex-1'>
        <div className='flex flex-col gap-2 min-w-[200px]'>
            <div className={'flex items-center gap-2'}>
                <span className='font-semibold whitespace-nowrap'>{title}</span>
                <Tooltip tip={tip} className={'min-w-[300px]'}/>
            </div>
            {leftColumn}
        </div>
        <div className={'flex flex-1 justify-center pt-2'}>
            {score && <CircularProgress progress={(score / outOf) * 100}>
                <div className={'flex items-baseline'}>
                    <span className='text-white text-2xl font-medium'>{score}</span>
                    <span className='text-white'>/{outOf}</span>
                </div>
            </CircularProgress>}
            {!score && <CircularProgress progress={(0 / outOf) * 100}>
                <div className={'flex items-baseline'}>
                    <span className='text-white text-2xl font-medium'>?</span>
                    <span className='text-white'>/{outOf}</span>
                </div>
            </CircularProgress>}
        </div>
    </div>
}