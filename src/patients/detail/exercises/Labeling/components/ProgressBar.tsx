import React, { useState, useEffect } from 'react';
import { CompensationType_COLORS, LabelType } from '../TypeColors';
import { LabeledColors } from './LabeledColors';
import { LabeledZone } from '../TestData/LabelingDataStructure';

const defaultButtonStyles = { zIndex: 1, opacity: 0.9 };


interface ProgressBarProps {
  frames: number[];
  currentFrame: number;
  setCurrentFrame: React.Dispatch<React.SetStateAction<number>>;
  Playing: boolean;
  setPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  isDoubleClick: boolean;
  setIsDoubleClick: React.Dispatch<React.SetStateAction<boolean>>;
  startFrame: number | null;
  setStartFrame: React.Dispatch<React.SetStateAction<number | null>>;
  endFrame: number | null;
  setEndFrame: React.Dispatch<React.SetStateAction<number | null>>;
  isLabeling: boolean;
  setIsLabeling: React.Dispatch<React.SetStateAction<boolean>>;
  labeledZone: LabeledZone[];
  singleLabeledZone: LabeledZone | null;
  setSingleLabeledZone: React.Dispatch<React.SetStateAction<LabeledZone | null>>;
  filteredZones: LabeledZone[];
  setFilteredZones: React.Dispatch<React.SetStateAction<LabeledZone[]>>;
}
export const ProgressBar: React.FC<ProgressBarProps> = ({ frames, currentFrame, setCurrentFrame, Playing, setPlaying, isDoubleClick, setIsDoubleClick,
  startFrame, setStartFrame, endFrame, setEndFrame, isLabeling, setIsLabeling,
  labeledZone, singleLabeledZone, setSingleLabeledZone,
  filteredZones, setFilteredZones }) => {

  const [indicatorPosition, setIndicatorPosition] = useState(0);
  const [DbClickStartFrame, setDbClickStartFrame] = useState<number | null>(null);
  const [DbClickEndFrame, setDbClickEndFrame] = useState<number | null>(null);
  const [showButtons, setShowButtons] = useState(false);
  const [mouseDownX, setMouseDownX] = useState<number | null>(null);
  const [mouseUpX, setMouseUpX] = useState<number | null>(null);
  const [allowMouseMove, setAllowMouseMove] = useState(true);
  const [buttonStyles, setButtonStyles] = useState<{ zIndex: number; opacity: number }[]>(
    new Array(labeledZone.length).fill({ zIndex: defaultButtonStyles.zIndex, opacity: defaultButtonStyles.opacity })
  );

  const [showAutomaticLabeling, setShowAutomaticLabeling] = useState(false);
  const [showManualLabeling, setShowManualLabeling] = useState(false);


  useEffect(() => {
    if (frames.length > 1) {
      const newPosition = (currentFrame / (frames.length - 1)) * 100;
      setIndicatorPosition(newPosition);
    }
    else {
      setIndicatorPosition(0);
    }
    console.log(currentFrame);
  }, [currentFrame, frames.length]);


  const calculateFrameIndex = (e: React.MouseEvent<HTMLDivElement>): number => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const totalWidth = rect.width;
    const clickedPercent = (clickX / totalWidth) * 100;
    return Math.max(0, Math.round((frames.length - 1) * (clickedPercent / 100)));
  };

  const calculateNearestFramePosition = (frame: number): number => {
    const position = (frame / (frames.length - 1)) * 100;
    return position;
  }

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDoubleClick || isLabeling) return;

    const newFrameIndex = calculateFrameIndex(e);
    setCurrentFrame(newFrameIndex);
  };

  const handleDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDoubleClick || !allowMouseMove) return;

    console.log('handleDoubleClick');
    setIsDoubleClick(true);

    const newFrameIndex = calculateFrameIndex(e);
    setDbClickStartFrame(newFrameIndex);
    setDbClickEndFrame(newFrameIndex);

    setCurrentFrame(newFrameIndex);
    setPlaying(false);
    setMouseDownX(calculateNearestFramePosition(newFrameIndex));
    setMouseUpX(calculateNearestFramePosition(newFrameIndex));
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDoubleClick || !allowMouseMove || DbClickStartFrame === null || DbClickEndFrame === null) return;

    const newFrameIndex = calculateFrameIndex(e);
    setDbClickEndFrame(newFrameIndex);
    setCurrentFrame(newFrameIndex);
    setMouseUpX(calculateNearestFramePosition(newFrameIndex));
  };

  const handleMouseUp = () => {
    if (!isDoubleClick || !allowMouseMove || DbClickStartFrame === null || DbClickEndFrame === null) return;



    if (DbClickStartFrame !== null && DbClickEndFrame !== null
      && mouseDownX !== null && mouseUpX !== null
    ) {
      const leftStartFrame = Math.min(DbClickStartFrame, DbClickEndFrame);
      const rightEndFrame = Math.max(DbClickStartFrame, DbClickEndFrame);
      const startPosition = Math.min(mouseDownX, mouseUpX);
      const endPosition = Math.max(mouseDownX, mouseUpX);

      console.log('DoubleClick Start Frame:', leftStartFrame);
      console.log('DoubleClick End Frame:', rightEndFrame);
      console.log('DoubleClick Start position:', startPosition);
      console.log('DoubleClick End position:', endPosition);


      setShowButtons(true);
      setAllowMouseMove(false);

    }


  };
  const initialize = () => {
    setShowButtons(false);

    setIsDoubleClick(false);
    setDbClickStartFrame(null);
    setDbClickEndFrame(null);
    setMouseDownX(null);
    setMouseUpX(null);

    setAllowMouseMove(true);
  }

  const handleCancel = () => {
    initialize();
  };

  const handleConfirm = () => {

    if (DbClickStartFrame !== null && DbClickEndFrame !== null) {
      const leftStartFrame = Math.min(DbClickStartFrame, DbClickEndFrame);
      const rightEndFrame = Math.max(DbClickStartFrame, DbClickEndFrame);

      setStartFrame(leftStartFrame);
      setEndFrame(rightEndFrame);

      initialize();
      setIsLabeling(true);

      console.log(startFrame, endFrame, isLabeling);

    }
  };

  const handleLabeledZoneDoubleClick = (e: React.MouseEvent<HTMLDivElement>, zone: LabeledZone) => {
    e.stopPropagation();
    console.log('handleLabeledZoneDoubleClick')

    if (isDoubleClick) return;


    setPlaying(false);
    if (zone !== null && zone.details.startFrame !== null && zone.details.endFrame !== null) {

      setStartFrame(zone.details.startFrame);
      setEndFrame(zone.details.endFrame);
      setSingleLabeledZone(zone);

      initialize();
      setIsLabeling(true);

      console.log(startFrame, endFrame, isLabeling);

    }
  };

  const calculateOverlapAndSetButtonStyles = (zones: LabeledZone[]) => {

    const newButtonStyles = new Array(zones.length).fill({ zIndex: defaultButtonStyles.zIndex, opacity: defaultButtonStyles.opacity });

    console.log('Starting calculateOverlapAndSetButtonStyles', zones.length, newButtonStyles.length)

    while (newButtonStyles.length < zones.length) {
      newButtonStyles.push({ zIndex: defaultButtonStyles.zIndex, opacity: defaultButtonStyles.opacity });
    }


    for (let currentIndex = 0; currentIndex < zones.length; currentIndex++) {
      const currentZone = zones[currentIndex];
      let zIndex = defaultButtonStyles.zIndex;
      let opacity = defaultButtonStyles.opacity;

      for (let i = 0; i < currentIndex; i++) {
        if (i !== currentIndex) {

          const prevZone = zones[i];
          const prevStartPosition = calculateNearestFramePosition(prevZone.details.startFrame);
          const prevEndPosition = calculateNearestFramePosition(prevZone.details.endFrame);

          const currentStartPosition = calculateNearestFramePosition(currentZone.details.startFrame);
          const currentEndPosition = calculateNearestFramePosition(currentZone.details.endFrame);

          // Reference: https://stackoverflow.com/questions/325933/determine-whether-two-date-ranges-overlap
          if ((currentStartPosition <= prevEndPosition) && (currentEndPosition >= prevStartPosition)) {
            const overlapWidth = Math.min(prevEndPosition, currentEndPosition) - Math.max(prevStartPosition, currentStartPosition);
            const currentWidth = Math.max(1, Math.abs(currentEndPosition - currentStartPosition));
            const prevWidth = Math.max(1, Math.abs(prevEndPosition - prevStartPosition));


            if (overlapWidth >= 0) {

              if (currentWidth === 1 && prevWidth > 1) {
                zIndex = Math.max(zIndex, newButtonStyles[i].zIndex + 1);
              } else if (currentWidth > 1 && prevWidth === 1) {
                zIndex = Math.min(zIndex, newButtonStyles[i].zIndex - 1);
              } else {
                const currentOverlapRatio = overlapWidth / currentWidth;
                const prevOverlapRatio = overlapWidth / prevWidth;
                if (currentOverlapRatio > prevOverlapRatio) {
                  zIndex = Math.max(zIndex, newButtonStyles[i].zIndex + 1);
                } else if (currentOverlapRatio < prevOverlapRatio) {
                  zIndex = Math.min(zIndex, newButtonStyles[i].zIndex - 1);
                  // newButtonStyles[i].zIndex = Math.max(zIndex + 1, newButtonStyles[i].zIndex);
                }

              }
            }

          }
        }
      }
      newButtonStyles[currentIndex] = { zIndex, opacity };
    };
    console.log(newButtonStyles, frames.length);
    setButtonStyles(newButtonStyles);

    console.log('Finishing calculateOverlapAndSetButtonStyles');
  };

  useEffect(() => {
    console.log('labeled zone changed');

    let newFilteredZones = labeledZone;
    if (showAutomaticLabeling) {
      newFilteredZones = labeledZone.filter(zone => zone.type === "Compensatory_SystemDetected");
    } else if (showManualLabeling) {
      newFilteredZones = labeledZone.filter(zone =>
        zone.type === "UnableToDetermine" || zone.type === "Healthy" || zone.type === "Compensatory_Manually");
    }

    setFilteredZones(newFilteredZones);
    calculateOverlapAndSetButtonStyles(newFilteredZones);
  }, [showAutomaticLabeling, showManualLabeling, labeledZone, frames]);


  const handleAutomaticChange = () => {
    if (isDoubleClick || isLabeling) return;

    if (!showAutomaticLabeling) {
      setShowAutomaticLabeling(true);
      setShowManualLabeling(false);
    } else {
      setShowAutomaticLabeling(false);
    }
  };

  const handleManualChange = () => {
    if (isDoubleClick || isLabeling) return;

    if (!showManualLabeling) {
      setShowManualLabeling(true);
      setShowAutomaticLabeling(false);
    } else {
      setShowManualLabeling(false);
    }
  };


  return (
    <>
      <div
        className="h-10 w-full relative"
        style={{ backgroundColor: CompensationType_COLORS['Healthy'].color, zIndex: 0 }}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <div
          className="w-1 h-10 bg-black absolute top-0"
          style={{
            left: `${indicatorPosition}%`,
            zIndex: 1000,
            pointerEvents: 'none'
          }}
        />
        {isDoubleClick && mouseDownX !== null && mouseUpX !== null && (
          <div
            className="absolute top-0 h-full"
            style={{
              backgroundColor: CompensationType_COLORS['CurrentlySelected'].color,
              width: `${Math.abs(mouseUpX - mouseDownX)}%`,
              left: `${Math.min(mouseUpX, mouseDownX)}%`,
              zIndex: 999,
              opacity: 0.9
            }}
          />
        )}

        <div>
          {filteredZones.map((zone, index) => {
            const startFramePosition = calculateNearestFramePosition(zone.details.startFrame);
            const endFramePosition = calculateNearestFramePosition(zone.details.endFrame);

            return (
              <div
                key={index}
                id={`zone-${index}`}
                className={`absolute top-0 h-full border border-black hover:shadow-lg cursor-pointer`}
                style={{
                  backgroundColor: CompensationType_COLORS[zone.type].color,
                  left: `${Math.min(startFramePosition, endFramePosition)}%`,
                  width: `${Math.max(1, Math.abs(startFramePosition - endFramePosition))}%`,
                  opacity: `${buttonStyles[index]?.opacity ?? defaultButtonStyles.opacity}`,
                  zIndex: buttonStyles[index]?.zIndex ?? defaultButtonStyles.zIndex,
                }}
                onDoubleClick={(e) => handleLabeledZoneDoubleClick(e, zone)}
              />
            );
          })}
        </div>

      </div>

      {(showButtons && DbClickStartFrame !== null && DbClickEndFrame !== null) && (
        <div className="mt-1 text-center">
          Currently Selected: {Math.min(DbClickStartFrame, DbClickEndFrame)} - {Math.max(DbClickStartFrame, DbClickEndFrame)}
        </div>
      )}

      <div className="flex gap-16 flex-wrap mt-2">

        <div>
          {(!isDoubleClick && !isLabeling && !Playing) && (
            <div className='mb-3'>

              <label htmlFor="automatic-labeling-only" className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  id="automatic-labeling-only"
                  checked={showAutomaticLabeling}
                  onChange={handleAutomaticChange}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-gray-700">Show Automatic Labeling - Only</span>
              </label>
              <label htmlFor="manual-labeling-only" className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  id="manual-labeling-only"
                  checked={showManualLabeling}
                  onChange={handleManualChange}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-gray-700">Show Manual Labeling - Only</span>
              </label>

            </div>
          )}

          <LabeledColors colors={CompensationType_COLORS}></LabeledColors>
        </div>
        {showButtons && (
          <div className='flex items-center gap-3'>
            <button className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded mr-2" onClick={handleConfirm}>
              Confirm
            </button>
            <button className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        )}
      </div>
    </>
  );
};
