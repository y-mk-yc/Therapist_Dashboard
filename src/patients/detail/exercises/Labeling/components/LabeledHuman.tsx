import React from 'react';
import { Frame, Details } from '../TestData/LabelingDataStructure';
import LabeledHumanImg from '../Image/human.png'
import { Marker } from './Marker';
import { LabeledZone } from '../TestData/LabelingDataStructure';
import { formatDate } from '../Labeling';

interface Props {
  data: Frame[];
  labeledZone: LabeledZone[];
  currentFrame: number;
}

export function findLabeledZoneForCurrentFrame(frames: Frame[], labeledZones: LabeledZone[], currentFrame: number): LabeledZone[] {
  const currentFrameData = frames.find(frame => frame.frameNumber === currentFrame);
  if (!currentFrameData) {
    return [];
  }

  const currentFrameLabelIds = new Set(currentFrameData.labelId);

  const matchingLabeledZones = labeledZones.filter(zone => currentFrameLabelIds.has(zone.id));

  return matchingLabeledZones;
}




export const LabeledHuman: React.FC<Props> = ({ data, labeledZone, currentFrame }) => {

  const labeledZonesForCurrentFrame = findLabeledZoneForCurrentFrame(data, labeledZone, currentFrame);

  const shouldShowMarker = labeledZonesForCurrentFrame.some(zone => zone.details.detailedType.includes("Shoulder rotation"));
  const elbowShowMarker = labeledZonesForCurrentFrame.some(zone => zone.details.detailedType.includes("Elbow flexion"));
  const wristShowMarker = labeledZonesForCurrentFrame.some(zone => zone.details.detailedType.includes("Wrist flexion")
    || zone.details.detailedType.includes("Wrist deviation"));
  const torsoShowMarker = labeledZonesForCurrentFrame.some(zone => zone.details.detailedType.includes("Torso flexion")
    || zone.details.detailedType.includes("Torso tilt") || zone.details.detailedType.includes("Torso rotation"));
  const forearmShowMarker = labeledZonesForCurrentFrame.some(zone => zone.details.detailedType.includes("Forearm rotation"));

  return (
    <div className="flex flex-col items-center">

      <div className="mb-4">
        <img id='labeledHuman' src={LabeledHumanImg} alt="Labeled Human Image" className="w-full max-w-md" />

        {shouldShowMarker && (
          <Marker top="20.8%" left="84.5%" />
        )}
        {elbowShowMarker && (
          <Marker top="26.8%" left="87.6%" />
        )}
        {wristShowMarker && (
          <Marker top="31.5%" left="90.4%" />
        )}
        {torsoShowMarker && (
          <Marker top="24%" left="82%" />
        )}
        {forearmShowMarker && (
          <Marker top="29%" left="89.3%" />
        )}
      </div>

      <div className="bg-gray-200 h-60 w-full p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">Details</h2>
        {labeledZonesForCurrentFrame.length > 0 ? (
          <div>
            {labeledZonesForCurrentFrame.map((zone, index) => (
              <div key={index}>
                <div className="flex justify-center font-bold text-xl">{zone.details.detailedType.join(", ")}</div>
                <div className="flex justify-between gap-1">
                  <p className="flex-1 text-left">{currentFrame}</p>
                  <p className="flex-1 text-center">{zone.therapistName}</p>
                  <p className="flex-1 text-right">{zone.date === "--" ? "--" : formatDate(zone.date)}</p>
                  {/* 要与labeling的mapping和checkbox的date设置一致！ */}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <div className="flex justify-center font-bold text-xl">Healthy</div>
            <div className="flex justify-center">
              <p>{currentFrame}</p>
            </div>
          </div>
        )}
      </div>
    </div >
  );
};
