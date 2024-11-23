import React from 'react';
import { Info } from '../TypeColors';

type LabeledColorsProps = {
  colors: Record<string, Info>;
};

export const LabeledColors: React.FC<LabeledColorsProps> = ({ colors }) => {
  return (
    <div>
      {Object.keys(colors).map((labelType: string) => {
        const { color, description } = colors[labelType as keyof typeof colors];
        const colorItem = (
          <div key={labelType} className="flex items-center gap-2">
            <div className="w-6 h-4" style={{ backgroundColor: color }}></div>
            <span>{description}</span>
          </div>
        );
        return colorItem;
      })}
    </div>
  );
};