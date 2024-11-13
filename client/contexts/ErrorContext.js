import { createContext, useContext, useState } from 'react';
import { toast } from 'react-toastify';

const ErrorContext = createContext();

export function ErrorProvider({ children }) {
  const [errors, setErrors] = useState([]);

  const handleError = (error) => {
    console.error(error);
    setErrors(prev => [...prev, error]);
    toast.error(error.message || '发生错误,请稍后重试');
  };

  const clearErrors = () => {
    setErrors([]);
  };

  return (
    <ErrorContext.Provider value={{ errors, handleError, clearErrors }}>
      {children}
    </ErrorContext.Provider>
  );
}

export function useError() {
  return useContext(ErrorContext);
} 