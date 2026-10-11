import type { ReactNode } from 'react';

export type SettingsSectionKey = 'appearance' | 'password';

export type SettingsSectionProps = {
    title: string;
    description: string;
    isOpen: boolean;
    onToggle: () => void;
    children: ReactNode;
};
