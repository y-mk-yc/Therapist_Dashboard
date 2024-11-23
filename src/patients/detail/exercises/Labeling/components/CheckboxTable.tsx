import React, { useState, useEffect } from 'react';
import { TinyDialog } from '../../../../../common/dialogs/TinyDialog';
import { Frame, LabeledZone } from '../TestData/LabelingDataStructure';
import { LabelType } from '../TypeColors';
import { v4 as uuidv4 } from 'uuid';
import { compensationType } from '../TestData/LabelingDataStructure';

interface CheckboxTableProps {
  options: compensationType[];
  values: number[];
  setCurrentFrame: React.Dispatch<React.SetStateAction<number>>;
  setIsLabeling: React.Dispatch<React.SetStateAction<boolean>>;
  singleLabeledZone: LabeledZone | null;
  setSingleLabeledZone: React.Dispatch<React.SetStateAction<LabeledZone | null>>;
  frames: Frame[];
  setFrames: React.Dispatch<React.SetStateAction<Frame[]>>;
  labeledZones: LabeledZone[];
  setLabeledZones: React.Dispatch<React.SetStateAction<LabeledZone[]>>;
  setPlaying: React.Dispatch<React.SetStateAction<boolean>>;
}
export const CheckboxTable: React.FC<CheckboxTableProps> = ({ options, values, setCurrentFrame, setIsLabeling, singleLabeledZone, setSingleLabeledZone,
  frames, setFrames, labeledZones, setLabeledZones, setPlaying
}) => {
  const [selectedOptions, setSelectedOptions] = useState<compensationType[]>([]);
  const [comment, setComment] = useState<string>('');

  useEffect(() => {
    if (singleLabeledZone) {
      setSelectedOptions(singleLabeledZone.details.detailedType);
      setComment(singleLabeledZone.details.comment);
    } else {
      setSelectedOptions(["Healthy"]);
      setComment('');
    }
  }, [singleLabeledZone]);


  const handleCheckboxChange = (option: compensationType) => {
    const singleOptions = ["Unable to determine", "Healthy", "Other reason (Compensation)"];

    if (singleOptions.includes(option)) {
      if (selectedOptions.includes(option)) {
        setSelectedOptions([]);
      } else {
        setSelectedOptions([option]);
      }
    } else {
      if (selectedOptions.some(opt => singleOptions.includes(opt))) {
        setSelectedOptions([option]);
      } else {
        if (selectedOptions.includes(option)) {
          setSelectedOptions(selectedOptions.filter((item) => item !== option));
        } else {
          setSelectedOptions([...selectedOptions, option]);
        }
      }
    }
  };



  const initialize = () => {
    setSelectedOptions([]);
    setComment('');
    setSingleLabeledZone(null);
    setCurrentFrame(values[1]);
    setIsLabeling(false);
    setPlaying(false);
  }

  const handleConfirm = () => {
    if (!selectedOptions.length) {
      alert('Please select at least one option before confirming.');
      return;
    }

    const singleOptions = ["Unable to determine", "Healthy", "Other reason (Compensation)"];

    if (selectedOptions.some(option => singleOptions.includes(option)) && selectedOptions.length > 1) {
      alert('When "Unable to determine", "Healthy", or "Other reason (Compensation)" is selected, you can not select other options.');
      return;
    }

    if (selectedOptions.includes("Other reason (Compensation)") && !comment.trim()) {
      alert('Please provide other reasons in the comment.');
      return;
    }

    console.log('Selected Options:', selectedOptions);
    console.log('Comment:', comment.trim());
    console.log('Values:', values);

    if (selectedOptions.length === 1 && selectedOptions[0] === 'Healthy' && comment.trim() === '') {
      if (singleLabeledZone) {
        const updatedLabeledZones = labeledZones.filter(zone => zone.id !== singleLabeledZone.id);
        const updatedFrames = frames.map(frame => {
          if (frame.labelId.includes(singleLabeledZone.id)) {
            frame.labelId = frame.labelId.filter(id => id !== singleLabeledZone.id);
          }
          return frame;
        });

        setLabeledZones(updatedLabeledZones);
        setFrames(updatedFrames);
        initialize();

        alert('Successful! Restored!');
      } else {

        initialize();

        alert('Successful! Restored!');
      }
      return;
    }


    let type: LabelType = 'Compensatory_Manually';
    if (selectedOptions.length === 1 && selectedOptions.includes('Unable to determine')) {
      type = 'UnableToDetermine';
    } else if (selectedOptions.length === 1 && selectedOptions.includes('Healthy')) {
      type = 'Healthy';
    } else if (selectedOptions.length === 1 && selectedOptions.includes('Other reason (Compensation)')) {
      type = 'Compensatory_Manually';
    } else {
      type = 'Compensatory_Manually';
    }

    const newLabeledZone: LabeledZone = {
      id: singleLabeledZone ? singleLabeledZone.id : uuidv4(),
      type: type,
      therapistID: 'Test_id',
      therapistName: 'Test_name',
      date: Date.now().toString(),//存储ms，转化为当地时间显示
      details: {
        startFrame: values[0],
        endFrame: values[1],
        detailedType: selectedOptions,
        comment: comment.trim()
      }
    };

    if (singleLabeledZone) {
      const updatedLabeledZones = labeledZones.map(zone =>
        zone.id === singleLabeledZone.id ? newLabeledZone : zone
      );
      setLabeledZones(updatedLabeledZones);
    } else {
      setLabeledZones(prev => [...prev, newLabeledZone]);
    }

    const updatedFrames = frames.map(frame => {
      if (singleLabeledZone && frame.labelId.includes(singleLabeledZone.id)) {
        frame.labelId = frame.labelId.filter(id => id !== singleLabeledZone.id);
      }
      if (frame.frameNumber >= newLabeledZone.details.startFrame && frame.frameNumber <= newLabeledZone.details.endFrame) {
        if (frame.labelId.length === 1 && frame.labelId[0] === "") {
          frame.labelId = [];
        }
        frame.labelId.push(newLabeledZone.id);
      }

      if (frame.labelId.length === 0) {
        frame.labelId.push("");
      }
      return frame;
    });

    setFrames(updatedFrames);

    initialize();

    alert('Successful!');


  };

  const handleCancel = () => {
    console.log(values[1]);
    initialize();
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <table className="w-full border-collapse border border-black">
        <thead>
          <tr>
            <th className="text-lg font-bold border border-black p-2">Compensation Type</th>
            <th className="text-lg font-bold border border-black p-2">Comment</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-black p-2">
              <div className="space-y-2">
                {options.map((option) => (
                  <div key={option} className="flex items-center">
                    <input
                      type="checkbox"
                      id={option}
                      checked={selectedOptions.includes(option)}
                      onChange={() => handleCheckboxChange(option)}
                      className="h-3 w-3 mr-2"
                    />
                    <label htmlFor={option}>{option}</label>
                  </div>
                ))}
              </div>
            </td>
            <td className="border border-black p-2">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full h-64 border border-gray-300 rounded-md mt-2 p-2 resize-none"
                placeholder="Enter your comment here..."
              />

            </td>
          </tr>
        </tbody>
      </table>

      <div className="flex justify-center mt-8">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded mr-8"
          onClick={handleConfirm}
        >
          Confirm
        </button>
        <button
          className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded"
          onClick={handleCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
