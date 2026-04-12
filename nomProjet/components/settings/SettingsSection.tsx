import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { SettingsSectionProps } from '../../types/settings';

export function SettingsSection({ title, description, isOpen, onToggle, children }: SettingsSectionProps) {
    return (
        <View style={styles.container}>
            <Pressable
                onPress={onToggle}
                style={styles.header}
                accessibilityRole="button"
                accessibilityState={{ expanded: isOpen }}
            >
                <View style={styles.headerCopy}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.description}>{description}</Text>
                </View>
                <Text style={styles.toggle}>{isOpen ? 'Masquer' : 'Afficher'}</Text>
            </Pressable>

            {isOpen ? <View style={styles.body}>{children}</View> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 12,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 16,
    },
    headerCopy: {
        flex: 1,
        gap: 4,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#0f172a',
    },
    description: {
        fontSize: 14,
        lineHeight: 20,
        color: '#475569',
    },
    toggle: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1.1,
        textTransform: 'uppercase',
        color: '#0f766e',
    },
    body: {
        gap: 14,
        overflow: 'hidden',
    },
});
