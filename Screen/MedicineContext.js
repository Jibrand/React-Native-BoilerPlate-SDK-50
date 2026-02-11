import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from './translations';
import { api } from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MedicineContext = createContext();

export const MedicineProvider = ({ children }) => {
    const [todayLogs, setTodayLogs] = useState([]);
    const [medicines, setMedicines] = useState([]);
    const [loadingLogs, setLoadingLogs] = useState(false);
    const [language, setLanguage] = useState('en'); // 'en' | 'es'

    const loadMedicines = async () => {
        try {
            const userDataStr = await AsyncStorage.getItem('userData');
            if (userDataStr) {
                const userData = JSON.parse(userDataStr);
                const response = await api.get(`/medications/patient/${userData.id}`);
                if (response.success) {
                    setMedicines(response.data);
                }
            }
        } catch (error) {
            console.error('Error loading medicines:', error);
        }
    };

    const loadTodayLogs = async (date) => {
        setLoadingLogs(true);
        try {
            const userDataStr = await AsyncStorage.getItem('userData');
            if (userDataStr) {
                const userData = JSON.parse(userDataStr);
                const dateQuery = date ? `?date=${date}` : '';
                const response = await api.get(`/medications/logs/${userData.id}${dateQuery}`);
                if (response.success) {
                    setTodayLogs(response.data);
                }
            }
        } catch (error) {
            console.error('Error loading today logs:', error);
        } finally {
            setLoadingLogs(false);
        }
    };

    const updateLogStatus = async (logId, status) => {
        try {
            const response = await api.patch(`/medications/log/${logId}`, { status });
            if (response.success) {
                setTodayLogs(prev => prev.map(log =>
                    log.id === logId ? { ...log, status: status } : log
                ));
            }
        } catch (error) {
            console.error('Error updating log status:', error);
        }
    };

    useEffect(() => {
        loadMedicines();
        loadTodayLogs();
    }, []);

    const addMedicine = (newMed) => {
        setMedicines(prev => [newMed, ...prev]);
        loadTodayLogs(); // Reload logs if a new medicine is added
    };

    const toggleLanguage = () => {
        setLanguage(prev => (prev === 'en' ? 'es' : 'en'));
    };

    const t = key => translations[language][key] || key;

    return (
        <MedicineContext.Provider
            value={{
                medicines,
                todayLogs,
                loadingLogs,
                addMedicine,
                loadMedicines,
                loadTodayLogs,
                updateLogStatus,
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
