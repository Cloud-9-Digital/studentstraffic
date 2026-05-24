import { useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import { TextInput as PaperTextInput, HelperText } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { colors } from "../theme/tokens";

type Props = TextInputProps & {
  label: string;
  error?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
};

// ─── iOS ──────────────────────────────────────────────────────────────────────

function IOSInput({
  label, error, leftIcon, rightIcon, onRightIconPress, style, onFocus, onBlur, ...props
}: Props) {
  const [focused, setFocused] = useState(false);

  return (
    <View>
      <Text style={ios.label}>{label}</Text>
      <View style={[ios.row, focused && ios.rowFocused, !!error && ios.rowError]}>
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={18}
            color={focused ? colors.primary : colors.faint}
            style={ios.leftIcon}
          />
        )}
        <TextInput
          style={[ios.input, leftIcon && ios.inputWithLeft, style as any]}
          placeholderTextColor={colors.faint}
          selectionColor={colors.primary}
          onFocus={(e) => {
            setFocused(true);
            Haptics.selectionAsync();
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...props}
        />
        {rightIcon && (
          <Pressable onPress={onRightIconPress} style={ios.rightBtn} hitSlop={8}>
            <Ionicons name={rightIcon} size={18} color={colors.faint} />
          </Pressable>
        )}
      </View>
      {error ? <Text style={ios.error}>{error}</Text> : null}
    </View>
  );
}

const ios = StyleSheet.create({
  label: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 12,
    color: "#374151",
    marginBottom: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: "#fafafa",
    paddingHorizontal: 14,
  },
  rowFocused: {
    borderColor: colors.primary,
    backgroundColor: "#fff",
  },
  rowError: {
    borderColor: "#ef4444",
    backgroundColor: "#fff5f5",
  },
  leftIcon: { marginRight: 8 },
  input: {
    flex: 1,
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 15,
    color: colors.ink,
    paddingVertical: 0,
  },
  inputWithLeft: {},
  rightBtn: { padding: 4 },
  error: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 11,
    color: "#ef4444",
    marginTop: 4,
    marginLeft: 2,
  },
});

// ─── Android ──────────────────────────────────────────────────────────────────

function AndroidInput({
  label, error, leftIcon, rightIcon, onRightIconPress, ...props
}: Props) {
  return (
    <View>
      <PaperTextInput
        label={label}
        mode="outlined"
        error={!!error}
        left={leftIcon
          ? <PaperTextInput.Icon
              icon={({ size, color }) => (
                <Ionicons name={leftIcon} size={size - 2} color={color} />
              )}
            />
          : undefined
        }
        right={rightIcon
          ? <PaperTextInput.Icon
              icon={({ size, color }) => (
                <Ionicons name={rightIcon} size={size - 2} color={color} />
              )}
              onPress={() => {
                Haptics.selectionAsync();
                onRightIconPress?.();
              }}
            />
          : undefined
        }
        onFocus={() => Haptics.selectionAsync()}
        style={android.input}
        contentStyle={android.content}
        outlineStyle={android.outline}
        {...(props as any)}
      />
      {error ? (
        <HelperText type="error" style={android.helperText}>{error}</HelperText>
      ) : null}
    </View>
  );
}

const android = StyleSheet.create({
  input: { backgroundColor: "#fafafa" },
  content: { fontFamily: "PlusJakartaSans-Regular", fontSize: 15 },
  outline: { borderRadius: 12 },
  helperText: { fontFamily: "PlusJakartaSans-Regular" },
});

// ─── Export ───────────────────────────────────────────────────────────────────

export function FormInput(props: Props) {
  if (Platform.OS === "android") return <AndroidInput {...props} />;
  return <IOSInput {...props} />;
}
