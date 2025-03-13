import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import { errorMessageState } from "../state/atoms";

const ErrorPopup: React.FC = () => {
  const [errorMessage, setErrorMessage] = useRecoilState(errorMessageState);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [errorMessage, setErrorMessage]);

  if (!errorMessage) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className="bg-white border-l-4 border-red-500 text-red-700 p-4 rounded shadow-lg max-w-md"
        role="alert"
      >
        <p className="font-bold">Error</p>
        <p>{errorMessage}</p>
      </div>
    </div>
  );
};

export default ErrorPopup;
