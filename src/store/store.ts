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

    routeAccess: Record<string, boolean>;
    allowRoute: (path: string) => void;
    clearRouteAccess: (path: string) => void;
    resetRouteAccess: () => void;
}

const useAppStore = create<AppStates>((set) => ({
    selectedGrade: '',
    // setSelectedGrade: (grade: string) => set({ selectedGrade: grade }),
    setSelectedGrade: (grade: string) => {
        console.log('Setting grade:', grade);
        set({ selectedGrade: grade });
    },

    scoreString: '0/0',
    setScoreString: (score) => set({ scoreString: score }),

    step: 1,
    setStep: (step: number) => set({ step }),

    isRegisteredUser: false,
    setIsRegisteredUser: (isRegisteredUser: boolean) => set({ isRegisteredUser }),

    routeAccess: {},
    allowRoute: (path: string) =>
        set((state) => ({
            routeAccess: { ...state.routeAccess, [path]: true },
        })),
    clearRouteAccess: (path: string) =>
        set((state) => {
            const newAccess = { ...state.routeAccess };
            delete newAccess[path];
            return { routeAccess: newAccess };
        }),
    resetRouteAccess: () => set({ routeAccess: {} }),
}));

export default useAppStore;
