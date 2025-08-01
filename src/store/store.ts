import { create } from 'zustand';

interface AppStates {
    selectedGrade: string;
    setSelectedGrade: (grade: string) => void;

    scoreString: string;
    setScoreString: (score: string) => void;
}

const useAppStore = create<AppStates>((set) => ({
    selectedGrade: '',
    setSelectedGrade: (grade: string) => set({ selectedGrade: grade }),

    scoreString: '0/0',
    setScoreString: (score) => set({ scoreString: score }),
}));

export default useAppStore;
