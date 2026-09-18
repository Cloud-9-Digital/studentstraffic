import { useState } from "react";
import { FlatList, KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { colors } from "../theme/tokens";
export type PickerOptions = { title: string; selected: string; options: { label: string; value: string }[]; onSelect: (value: string) => void };
export function SearchablePicker({ picker, onClose }: { picker: PickerOptions; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const insets = useSafeAreaInsets();
  const term = query.trim().toLocaleLowerCase();
  const options = picker.options.filter(option => `${option.label} ${option.value.replaceAll("-", " ")}`.toLocaleLowerCase().includes(term));
  return <Modal visible animationType="slide" transparent onRequestClose={onClose}>
    <KeyboardAvoidingView style={{ flex: 1, justifyContent: "flex-end" }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <Pressable accessibilityRole="button" accessibilityLabel="Close options" style={[StyleSheet.absoluteFill, s.modalBackdrop]} onPress={onClose} />
      <View accessibilityViewIsModal style={[s.pickerSheet, { height: "72%", paddingBottom: Math.max(insets.bottom, 16) }]}>
        <View style={s.pickerHandle} />
        <View style={s.pickerHeader}><Text accessibilityRole="header" style={s.pickerTitle}>{picker.title}</Text><Pressable accessibilityRole="button" accessibilityLabel="Close options" onPress={onClose} style={s.pickerClose}><Ionicons name="close" size={21} color={colors.muted} /></Pressable></View>
        <View style={s.pickerSearch}><Ionicons name="search-outline" size={20} color={colors.muted} /><TextInput accessibilityLabel={`Search ${picker.title.replace(/^Select (a )?/, "")}`} placeholder="Search options" placeholderTextColor={colors.muted} value={query} onChangeText={setQuery} autoCorrect={false} autoCapitalize="none" returnKeyType="search" style={s.pickerSearchInput} />{query ? <Pressable accessibilityRole="button" accessibilityLabel="Clear search" onPress={() => setQuery("")} style={s.pickerClose}><Ionicons name="close-circle" size={18} color={colors.muted} /></Pressable> : null}</View>
        <FlatList data={options} keyExtractor={option => option.value} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" showsVerticalScrollIndicator={false} renderItem={({ item: option }) => <Pressable accessibilityRole="button" accessibilityState={{ selected: picker.selected === option.value }} onPress={() => { picker.onSelect(option.value); Haptics.selectionAsync(); onClose(); }} style={s.option}><Text style={[s.optionText, picker.selected === option.value && { color: colors.primary, fontFamily: "PlusJakartaSans-SemiBold" }]}>{option.label}</Text>{picker.selected === option.value ? <Ionicons name="checkmark" size={20} color={colors.primary} /> : null}</Pressable>} ListEmptyComponent={<View style={s.pickerEmpty}><Text style={s.optionText}>{picker.options.length ? "No matches. Try another search." : "No options available yet."}</Text></View>} />
      </View>
    </KeyboardAvoidingView>
  </Modal>;
}
const s = StyleSheet.create({
 pickerSearch: { flexDirection: "row", alignItems: "center", gap: 10, borderRadius: 12, backgroundColor: colors.background, paddingLeft: 12, marginVertical: 14 },
 pickerSearchInput: { flex: 1, minHeight: 48, fontFamily: "PlusJakartaSans-Regular", fontSize: 14, color: colors.ink },
 pickerClose: { minWidth: 44, minHeight: 44, alignItems: "center", justifyContent: "center" },
 pickerEmpty: { paddingVertical: 28, alignItems: "center" },
 modalBackdrop: { backgroundColor: "rgba(15,31,28,0.38)" }, pickerSheet: { maxHeight: "72%", borderTopLeftRadius: 24, borderTopRightRadius: 24, backgroundColor: colors.surface, paddingHorizontal: 20, paddingBottom: 24 }, pickerHandle: { alignSelf: "center", width: 36, height: 4, borderRadius: 3, backgroundColor: colors.line, marginVertical: 10 }, pickerHeader: { minHeight: 44, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, pickerTitle: { flex: 1, fontFamily: "Fraunces-SemiBold", fontSize: 23, color: colors.ink }, option: { minHeight: 52, paddingVertical: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line }, optionText: { flex: 1, fontFamily: "PlusJakartaSans-Regular", fontSize: 14, color: colors.ink },
});