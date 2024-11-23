import {Vector3} from "three/src/Three";
import {roundToNearestX} from "../../numberUtils";
import * as R from "rambda";
import {
    ARM_LENGTH,
    ArmRanges,
    calculateElbowLocation,
    calculateElbowRotation,
    getSpherePointsCoordinates
} from "../rendering";

export const workerCreatePointStrSet = (points: Vector3[], accuracy: number): Set<string> => {
    const pointSet = new Set<string>()
    points.forEach((point) => {
        pointSet.add(`${roundToNearestX(point.x, accuracy)}:${roundToNearestX(point.y, accuracy)}:${roundToNearestX(point.z, accuracy)}`)
    })

    return pointSet
}

export const generateReachablePoints = (
    ranges: ArmRanges
) => {
    console.log(window.Worker)

    const points = []
    for (const sfe of R.range(ranges.SFE[0], ranges.SFE[1]).filter(num => num % 10 == 0)) {
        for (const shfe of R.range(ranges.SHFE[0], ranges.SHFE[1]).filter(num => num % 10 == 0)) {
            points.push(...getSpherePointsCoordinates(
                calculateElbowRotation(sfe, shfe),
                ARM_LENGTH,
                calculateElbowLocation(sfe, shfe),
                ranges.EFE, ranges.SIE,
                10
            ).map(point => point.position))
        }
    }
    return points
}