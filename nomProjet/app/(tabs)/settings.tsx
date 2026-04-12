import { useEffect, useMemo, useState } from 'react';
import { LayoutAnimation, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, UIManager, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

import { SettingsSection } from '../../components/settings/SettingsSection';
import { saveStudentToFirestore } from '../../firebase/students';
import { useAppDispatch, useCurrentStudent } from '../../store/hooks';
import { setStudent } from '../../store/studentSlice';
import { normalizePasswordForStorage } from '../../utils/password';
import { paletteItems, paletteTones, type ToneOption } from './settings.options';

export default function SettingsScreen() {
    const student = useCurrentStudent();
    const dispatch = useAppDispatch();
    const [appearanceStatus, setAppearanceStatus] = useState<string | null>(null);
    const [passwordStatus, setPasswordStatus] = useState<string | null>(null);
    const [isSavingColor, setIsSavingColor] = useState(false);
    const [isSavingPassword, setIsSavingPassword] = useState(false);
    const [selectedColor, setSelectedColor] = useState(student.color);
    const [passwordValue, setPasswordValue] = useState(student.password);
    const [pickerOpen, setPickerOpen] = useState(false);
    const [pickerItems, setPickerItems] = useState(paletteItems);
    const [openSection, setOpenSection] = useState<'appearance' | 'password' | null>('appearance');

    useEffect(() => {
        if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }, []);

    useEffect(() => {
        setSelectedColor(student.color);
    }, [student.color]);

    useEffect(() => {
        setPasswordValue(student.password);
    }, [student.password]);

    const selectedTone = useMemo(
        () => paletteTones.find((tone) => tone.value === selectedColor) ?? null,
        [selectedColor],
    );

    const saveColor = async (nextColor: string, toneLabel?: string) => {
        if (isSavingColor || student.color === nextColor) {
            return;
        }

        const nextStudent = {
            ...student,
            color: nextColor,
        };

        dispatch(setStudent(nextStudent));
        setAppearanceStatus(null);
        setIsSavingColor(true);

        try {
            await saveStudentToFirestore(nextStudent);
            setAppearanceStatus(`Couleur enregistrée: ${toneLabel ?? selectedTone?.label ?? nextColor}`);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Erreur inconnue Firebase.';
            setAppearanceStatus(`Impossible de sauvegarder la couleur: ${message}`);
        } finally {
            setIsSavingColor(false);
        }
    };

    const handleTonePress = (tone: ToneOption) => {
        setSelectedColor(tone.value);
        void saveColor(tone.value, tone.label);
    };

    const toggleSection = (section: 'appearance' | 'password') => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setPickerOpen(false);
        setOpenSection((current) => (current === section ? null : section));
    };

    const handleSavePassword = async () => {
        if (isSavingPassword || passwordValue === student.password) {
            return;
        }

        const nextPassword = await normalizePasswordForStorage(passwordValue, student.password);

        const nextStudent = {
            ...student,
            password: nextPassword,
        };

        dispatch(setStudent(nextStudent));
        setPasswordStatus(null);
        setIsSavingPassword(true);

        try {
            await saveStudentToFirestore(nextStudent);
            setPasswordStatus(passwordValue ? 'Mot de passe enregistré.' : 'Compte ouvert sans mot de passe.');
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Erreur inconnue Firebase.';
            setPasswordStatus(`Impossible de sauvegarder le mot de passe: ${message}`);
        } finally {
            setIsSavingPassword(false);
        }
    };

    const closePicker = () => {
        if (pickerOpen) {
            setPickerOpen(false);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={closePicker} accessible={false}>
            <View style={[styles.screen, { backgroundColor: student.color }]}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.content}>
                        <Text style={styles.kicker}>Settings</Text>
                        <Text style={styles.title}>Préférences du compte</Text>

                        <View style={styles.sections}>
                            <SettingsSection
                                title="Apparence"
                                description="Couleur de fond et palette complète."
                                isOpen={openSection === 'appearance'}
                                onToggle={() => toggleSection('appearance')}
                            >
                                <View style={styles.quickTones}>
                                    {paletteTones.slice(0, 8).map((tone) => {
                                        const isSelected = tone.value === student.color;

                                        return (
                                            <Pressable
                                                key={tone.label}
                                                accessibilityState={{ selected: isSelected }}
                                                style={styles.quickToneItem}
                                                onPress={() => handleTonePress(tone)}
                                                accessibilityLabel={tone.label}
                                            >
                                                <View style={[styles.quickToneDot, { backgroundColor: tone.color }, isSelected && styles.quickToneDotSelected]} />
                                            </Pressable>
                                        );
                                    })}
                                </View>

                                <View style={styles.pickerWrapper}>
                                    <Text style={styles.fieldLabel}>Palette complète</Text>
                                    <DropDownPicker
                                        open={pickerOpen}
                                        value={selectedColor}
                                        items={pickerItems}
                                        setOpen={setPickerOpen}
                                        setValue={setSelectedColor}
                                        setItems={setPickerItems}
                                        placeholder="Choisis une couleur"
                                        listMode="SCROLLVIEW"
                                        autoScroll
                                        onChangeValue={(value) => {
                                            if (!value) {
                                                return;
                                            }

                                            const tone = paletteTones.find((item) => item.value === value);
                                            void saveColor(value, tone?.label);
                                        }}
                                        style={styles.picker}
                                        dropDownContainerStyle={styles.pickerDropdown}
                                        textStyle={styles.pickerText}
                                        selectedItemContainerStyle={styles.pickerSelectedItem}
                                        selectedItemLabelStyle={styles.pickerSelectedText}
                                    />
                                </View>

                                <Text style={styles.status}>{isSavingColor ? 'Enregistrement...' : appearanceStatus ?? `Fond actuel: ${selectedTone?.label ?? student.color}`}</Text>
                            </SettingsSection>

                            <SettingsSection
                                title="Mot de passe"
                                description="Laisse vide pour garder le compte ouvert."
                                isOpen={openSection === 'password'}
                                onToggle={() => toggleSection('password')}
                            >
                                <Text style={styles.helperText}>
                                    Ce champ devient la vérification du compte. Si tu le vides, le compte reste ouvert.
                                </Text>

                                <TextInput
                                    placeholder="Mot de passe"
                                    placeholderTextColor="#94a3b8"
                                    secureTextEntry
                                    style={styles.input}
                                    value={passwordValue}
                                    onChangeText={setPasswordValue}
                                />

                                <Pressable
                                    style={[styles.button, isSavingPassword && styles.buttonDisabled]}
                                    onPress={handleSavePassword}
                                    disabled={isSavingPassword}
                                >
                                    <Text style={styles.buttonText}>{isSavingPassword ? 'Mise à jour...' : 'Enregistrer le mot de passe'}</Text>
                                </Pressable>

                                <Text style={styles.status}>{passwordStatus ?? (student.password ? 'Le compte a un mot de passe.' : 'Le compte est ouvert sans mot de passe.')}</Text>
                            </SettingsSection>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        width: '100%',
        maxWidth: 550,
        gap: 14,
        padding: 24,
        borderRadius: 28,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        shadowColor: '#0f172a',
        shadowOpacity: 0.08,
        shadowRadius: 20,
        shadowOffset: {
            width: 0,
            height: 10,
        },
        elevation: 4,
    },
    kicker: {
        fontSize: 12,
        letterSpacing: 1.6,
        textTransform: 'uppercase',
        color: '#0f766e',
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#0f172a',
    },
    sections: {
        gap: 16,
    },
    quickTones: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
        marginBottom: 4,
    },
    quickToneItem: {
        width: 28,
        height: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },
    quickToneDot: {
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: 'rgba(15, 23, 42, 0.08)',
    },
    quickToneDotSelected: {
        borderColor: '#0f172a',
        transform: [{ scale: 1.08 }],
    },
    pickerWrapper: {
        zIndex: 20,
        gap: 8,
    },
    fieldLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0f172a',
    },
    picker: {
        width: '100%',
        borderWidth: 0,
        borderRadius: 16,
        backgroundColor: '#f8fafc',
    },
    pickerDropdown: {
        width: '100%',
        borderWidth: 0,
        borderRadius: 16,
        backgroundColor: '#f8fafc',
        shadowOpacity: 0,
        elevation: 0,
    },
    pickerText: {
        fontSize: 15,
        color: '#0f172a',
    },
    pickerSelectedItem: {
        backgroundColor: '#e2e8f0',
    },
    pickerSelectedText: {
        fontWeight: '700',
    },
    helperText: {
        fontSize: 13,
        lineHeight: 18,
        color: '#64748b',
    },
    input: {
        width: '100%',
        borderWidth: 0,
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: '#0f172a',
        backgroundColor: '#f8fafc',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
        paddingVertical: 15,
        backgroundColor: '#0f766e',
    },
    buttonDisabled: {
        opacity: 0.72,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '700',
    },
    status: {
        fontSize: 14,
        lineHeight: 20,
        color: '#475569',
    },
});
