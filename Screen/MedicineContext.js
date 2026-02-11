import React, { createContext, useContext, useState } from 'react';
import { translations } from './translations';

const MedicineContext = createContext();

export const MedicineProvider = ({ children }) => {
    const [medicines, setMedicines] = useState([]);

    const addMedicine = medicine => {
        setMedicines(prev => [
            {
                id: Date.now().toString(),
                ...medicine,
            },
            ...prev,
        ]);
    };

    const [language, setLanguage] = useState('en'); // 'en' | 'es'

    const toggleLanguage = () => {
        setLanguage(prev => (prev === 'en' ? 'es' : 'en'));
    };

      const t = key => translations[language][key] || key;

    return (
        <MedicineContext.Provider
            value={{
                medicines,
                addMedicine,
            /* language */
            language,
            toggleLanguage,
            t
            }}
        >
            {children}
        </MedicineContext.Provider>
    );
};

export const useMedicines = () => useContext(MedicineContext);
