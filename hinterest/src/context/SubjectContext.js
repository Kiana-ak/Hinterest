import React, { createContext, useState, useContext } from 'react';

const SubjectContext = createContext();

export const useSubject = () => useContext(SubjectContext);

export const SubjectProvider = ({ children }) => {
  const [selectedSubject, setSelectedSubject] = useState(null);

  return (
    <SubjectContext.Provider value={{ selectedSubject, setSelectedSubject }}>
      {children}
    </SubjectContext.Provider>
  );
};