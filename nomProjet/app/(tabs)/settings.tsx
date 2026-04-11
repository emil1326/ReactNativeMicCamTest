import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

import { saveStudentToFirestore } from '../../firebase/students';
import { useAppDispatch, useCurrentStudent } from '../../store/hooks';
import { setStudent } from '../../store/studentSlice';
import { paletteItems, paletteTones, type ToneOption } from './settings.options';

export default function SettingsScreen() {
    const student = useCurrentStudent();
    const dispatch = useAppDispatch();
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [selectedColor, setSelectedColor] = useState(student.color);
    const [pickerOpen, setPickerOpen] = useState(false);
    const [pickerItems, setPickerItems] = useState(paletteItems);

    useEffect(() => {
        setSelectedColor(student.color);
    }, [student.color]);

    const selectedTone = useMemo(
        () => paletteTones.find((tone) => tone.value === selectedColor) ?? null,
        [selectedColor],
    );

    const saveColor = async (nextColor: string, toneLabel?: string) => {
        if (isSaving || student.color === nextColor) {
            return;
        }

        const nextStudent = {
            ...student,
            color: nextColor,
        };

        dispatch(setStudent(nextStudent));
        setStatusMessage(null);
        setIsSaving(true);

        try {
            await saveStudentToFirestore(nextStudent);
            setStatusMessage(`Couleur enregistrée: ${toneLabel ?? selectedTone?.label ?? nextColor}`);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Erreur inconnue Firebase.';
            setStatusMessage(`Impossible de sauvegarder la couleur: ${message}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleTonePress = (tone: ToneOption) => {
        setSelectedColor(tone.value);
        void saveColor(tone.value, tone.label);
    };

    const closePicker = () => {
        if (pickerOpen) {
            setPickerOpen(false);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={closePicker} accessible={false}>
            <View style={[styles.container, { backgroundColor: student.color }]}>
                <View style={styles.card}>
                    <Text style={styles.kicker}>Settings</Text>
                    <Text style={styles.title}>Couleur de fond</Text>
                    <Text style={styles.description}>
                        Choisis une des 8 teintes rapides ou ouvre la liste complète pour trouver une autre nuance.
                    </Text>

                    <View style={styles.quickTones}>
                        {paletteTones.slice(0, 8).map((tone) => {
                            const isSelected = tone.value === student.color;

                            return (
                                <Pressable
                                    key={tone.label}
                                    accessibilityRole="button"
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
                        <Text style={styles.pickerLabel}>Palette complète</Text>
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

                    <Text style={styles.status}>{isSaving ? 'Enregistrement...' : statusMessage ?? `Fond actuel: ${selectedTone?.label ?? student.color}`}</Text>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        gap: 14,
        width: '100%',
        maxWidth: 550,
        borderRadius: 28,
        padding: 24,
        backgroundColor: '#ffffff',
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
    description: {
        fontSize: 15,
        lineHeight: 22,
        color: '#475569',
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
    },
    pickerLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0f172a',
        marginBottom: 8,
    },
    picker: {
        borderRadius: 18,
        borderColor: '#cbd5e1',
        backgroundColor: '#f8fafc',
    },
    pickerDropdown: {
        borderRadius: 18,
        borderColor: '#e2e8f0',
    },
    pickerText: {
        fontSize: 15,
        color: '#0f172a',
    },
    pickerSelectedItem: {
        backgroundColor: '#f8fafc',
    },
    pickerSelectedText: {
        fontWeight: '700',
    },
    status: {
        fontSize: 14,
        lineHeight: 20,
        color: '#334155',
    },
});