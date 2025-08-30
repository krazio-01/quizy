import { create } from 'zustand';

interface AppStates {
    selectedGrade: string;
    setSelectedGrade: (grade: string) => void;

    scoreString: string;
    setScoreString: (score: string) => void;

    step: number;
    setStep: (step: number) => void;

    isRegisteredUser: boolean;
    setIsRegisteredUser: (val: boolean) => void;
}

const useAppStore = create<AppStates>((set) => ({
    selectedGrade: '',
    setSelectedGrade: (grade: string) => set({ selectedGrade: grade }),

    scoreString: '0/0',
    setScoreString: (score) => set({ scoreString: score }),

    step: 1,
    setStep: (step: number) => set({ step }),

    isRegisteredUser: false,
    setIsRegisteredUser: (isRegisteredUser: boolean) => set({ isRegisteredUser }),
}));

export default useAppStore;
