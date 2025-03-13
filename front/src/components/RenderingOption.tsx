import React, { useRef, useEffect } from "react";
import { useRecoilState } from "recoil";

const RenderingOption: React.FC<RenderingOptionProps> = ({
  label,
  stateAtom,
  id,
}) => {
  // 여기서 직접 처리해서 상위 요소 리렌더링 방지
  const [value, setValue] = useRecoilState<number>(stateAtom);
  const rangeRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(event.target.value);
    if (!isNaN(newValue) && newValue >= 0 && newValue <= 1) {
      setValue(newValue);
    }
  };

  useEffect(() => {
    if (rangeRef.current) {
      const progress = (value / 1) * 100;
      rangeRef.current.style.setProperty("--range-progress", `${progress}%`);
    }
  }, [value]);

  return (
    <div>
      <label
        htmlFor={`${id}-range`}
        className="block text-sm font-medium text-gray-300 mb-1"
      >
        {label}
      </label>
      <div className="flex items-center space-x-2">
        <input
          ref={rangeRef}
          type="range"
          id={`${id}-range`}
          min="0"
          max="1"
          step="0.01"
          value={value}
          onChange={handleInputChange}
          className="w-full"
        />
        <input
          type="number"
          value={value}
          onChange={handleInputChange}
          min="0"
          max="1"
          step="0.01"
          className="w-16 bg-gray-700 text-white rounded px-2 py-1"
        />
      </div>
    </div>
  );
};
export default RenderingOption;
