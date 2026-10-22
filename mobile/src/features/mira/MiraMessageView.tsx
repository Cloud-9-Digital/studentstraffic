import { memo, useEffect } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";

import { CountryFlag } from "../../components/CountryFlag";
import { colors } from "../../theme/tokens";
import { MiraContactForm } from "./MiraContactForm";
import { MiraMarkdown } from "./MiraMarkdown";
import { MiraMark } from "./MiraMark";
import { openMiraLink } from "./openMiraLink";
import { isToolPart, type MiraContext, type MiraMessage, type MiraPart, type MiraToolPart, type MiraUniversityCard } from "./types";

// One message, rendered from its typed parts in the order the server produced
// them — the lookups Mira made, then her answer, then the cards and links
// those lookups returned. As on the web, nothing here re-reads the model's
// prose for figures: every card and fee is a data part the server wrote.

/** Present tense while running, past tense once done. Mirrors lib/chatbot/tool-names.ts. */
const TOOL_LABELS: Record<string, [string, string]> = {
  search_site: ["Searching", "Searched our pages"],
  find_programs: ["Shortlisting programmes", "Shortlisted programmes"],
  get_university: ["Reading the university profile", "Read the university profile"],
  compare_universities: ["Comparing universities", "Compared universities"],
  get_destination: ["Checking the destination", "Checked the destination"],
  list_destinations: ["Checking our coverage", "Checked our coverage"],
  request_counselling_callback: ["Opening the callback form", "Opened the callback form"],
  find_student_peers: ["Checking who is available", "Checked current students"],
  get_peer_coverage: ["Checking where students are available", "Checked where students are available"],
  request_peer_connection: ["Opening the introduction form", "Opened the introduction form"],
  shortlist_universities: ["Saving to your shortlist", "Saved to your shortlist"],
};

function toolDetail(part: MiraToolPart) {
  const output = part.output as { totalMatches?: number; found?: boolean; matches?: unknown[] } | undefined;
  if (part.state !== "output-available" || !output || typeof output !== "object") return undefined;
  if (output.found === false) return "no match";
  if (typeof output.totalMatches === "number") return output.totalMatches === 0 ? "no match" : `${output.totalMatches} found`;
  if (Array.isArray(output.matches)) return output.matches.length === 0 ? "no match" : `${output.matches.length} found`;
  return undefined;
}

function ToolStep({ part }: { part: MiraToolPart }) {
  const name = part.type.replace(/^tool-/, "");
  const running = part.state === "input-streaming" || part.state === "input-available";
  const failed = part.state === "output-error";
  const [runningLabel, doneLabel] = TOOL_LABELS[name] ?? ["Checking our catalogue", "Checked our catalogue"];
  const detail = toolDetail(part);
  return (
    <View style={s.step}>
      <View style={s.stepIcon}>
        {running ? <ActivityIndicator size="small" color={colors.muted} style={{ transform: [{ scale: 0.7 }] }} /> : <Ionicons name={failed ? "warning-outline" : "checkmark"} size={14} color={failed ? colors.accent : colors.success} />}
      </View>
      <Text style={[s.stepText, failed && { color: colors.accent }]} numberOfLines={1}>
        {running ? runningLabel : doneLabel}
        {detail ? <Text style={s.stepDetail}> · {detail}</Text> : null}
      </Text>
    </View>
  );
}

function UniversityCardView({ card, onOpen }: { card: MiraUniversityCard; onOpen: () => void }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`Open ${card.name}`} onPress={onOpen} style={({ pressed }) => [s.uniCard, pressed && s.pressed]}>
      <View style={s.uniTop}>
        <CountryFlag isoCode={card.countryCode} height={12} />
        <Text style={s.uniPlace} numberOfLines={1}>{[card.city, card.country].filter(Boolean).join(", ")}</Text>
      </View>
      <Text style={s.uniName} numberOfLines={2}>{card.name}</Text>
      <Text style={s.uniFee}>{card.annualFee}<Text style={s.uniFeeUnit}>{card.annualFeeUsd ? " / year" : ""}</Text></Text>
      {card.courses.length ? <Text style={s.uniMeta} numberOfLines={1}>{card.courses.slice(0, 2).join(" · ")}</Text> : null}
      {card.medium || card.intakes.length ? <Text style={s.uniMeta} numberOfLines={1}>{[card.medium, card.intakes.length ? `Intake ${card.intakes.slice(0, 2).join(", ")}` : ""].filter(Boolean).join(" · ")}</Text> : null}
      <View style={s.uniOpen}><Text style={s.uniOpenText}>View university</Text><Ionicons name="arrow-forward" size={13} color={colors.primary} /></View>
    </Pressable>
  );
}

function FeeChart({ title, points, onOpen }: { title: string; points: Array<{ label: string; value: number; formatted: string; href?: string }>; onOpen: (href: string) => void }) {
  const max = Math.max(...points.map((point) => point.value), 1);
  return (
    <View style={s.chart}>
      <Text style={s.groupTitle}>{title}</Text>
      {points.map((point) => (
        <Pressable key={point.label} disabled={!point.href} onPress={() => point.href && onOpen(point.href)} style={s.barRow}>
          <View style={s.barLabelRow}>
            <Text style={s.barLabel} numberOfLines={1}>{point.label}</Text>
            <Text style={s.barValue}>{point.formatted}</Text>
          </View>
          <View style={s.barTrack}><View style={[s.barFill, { width: `${Math.max(6, (point.value / max) * 100)}%` }]} /></View>
        </Pressable>
      ))}
    </View>
  );
}

function ShortlistNote({ added, alreadyThere, requiresSignIn, onOpen }: { added: string[]; alreadyThere: string[]; requiresSignIn: boolean; onOpen: (href: string) => void }) {
  const queryClient = useQueryClient();
  useEffect(() => {
    if (added.length) queryClient.invalidateQueries({ queryKey: ["shortlists"] });
  }, [added.length, queryClient]);

  if (requiresSignIn) {
    return <Text style={s.small}><Text style={s.inlineLink} onPress={() => onOpen("/login")}>Sign in</Text> to save a shortlist you can come back to.</Text>;
  }
  if (added.length + alreadyThere.length === 0) return null;
  return (
    <View style={s.inlineRow}>
      <Ionicons name="bookmark" size={14} color={colors.accent} />
      <Text style={s.small}>
        {added.length ? `Saved ${added.length} to your shortlist. ` : "Already on your shortlist. "}
        <Text style={s.inlineLink} onPress={() => onOpen("/dashboard/shortlist")}>View</Text>
      </Text>
    </View>
  );
}

function Part({ part, partKey, conversationId, context }: { part: MiraPart; partKey: string; conversationId?: string; context: MiraContext }) {
  const router = useRouter();
  const open = (href: string) => { openMiraLink(href, router); };

  switch (part.type) {
    case "text":
      return part.text.trim() ? <MiraMarkdown content={part.text} onLink={open} /> : null;
    case "data-universities":
      return (
        <View style={s.group}>
          <Text style={s.groupTitle}>{part.data.title}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.cards}>
            {part.data.cards.map((card) => <UniversityCardView key={card.slug} card={card} onOpen={() => router.push({ pathname: "/university/[slug]", params: { slug: card.slug } })} />)}
          </ScrollView>
        </View>
      );
    case "data-feeChart":
      return <FeeChart title={part.data.title} points={part.data.points} onOpen={open} />;
    case "data-links":
      return (
        <View style={s.chips}>
          {part.data.links.map((link) => (
            <Pressable key={link.href} accessibilityRole="link" onPress={() => open(link.href)} style={({ pressed }) => [s.chip, pressed && s.pressed]}>
              <Text style={s.chipText} numberOfLines={1}>{link.label}</Text>
            </Pressable>
          ))}
        </View>
      );
    case "data-shortlist":
      return <ShortlistNote {...part.data} onOpen={open} />;
    case "data-peerRequest":
      return <MiraContactForm kind={{ type: "peer", request: part.data }} conversationId={conversationId} context={context} formKey={partKey} />;
    case "data-leadRequest":
      return <MiraContactForm kind={{ type: "lead", request: part.data }} conversationId={conversationId} context={context} formKey={partKey} />;
    default:
      return null;
  }
}

export const MiraMessageView = memo(function MiraMessageView({ message, conversationId, context }: { message: MiraMessage; conversationId?: string; context: MiraContext }) {
  if (message.role === "user") {
    const text = message.parts.map((part) => (part.type === "text" ? part.text : "")).join("\n");
    return <View style={s.userRow}><View style={s.userBubble}><Text style={s.userText}>{text}</Text></View></View>;
  }

  const tools = message.parts.filter(isToolPart);
  return (
    <View style={s.assistant}>
      {tools.length ? <View style={s.steps}>{tools.map((part) => <ToolStep key={part.toolCallId} part={part} />)}</View> : null}
      {message.parts.map((part, index) => <Part key={`${message.id}-${index}`} partKey={`${message.id}-${index}`} part={part} conversationId={conversationId} context={context} />)}
    </View>
  );
});

export function MiraThinking() {
  return <View style={s.thinking}><MiraMark size={18} /><Text style={s.thinkingText}>Thinking…</Text></View>;
}

const s = StyleSheet.create({
  userRow: { flexDirection: "row", justifyContent: "flex-end" },
  userBubble: { maxWidth: "85%", borderRadius: 18, borderBottomRightRadius: 6, backgroundColor: colors.primary, paddingHorizontal: 14, paddingVertical: 10 },
  userText: { fontFamily: "PlusJakartaSans-Regular", fontSize: 15, lineHeight: 22, color: "#fff" },
  assistant: { gap: 12 },
  steps: { gap: 5, paddingBottom: 2 },
  step: { flexDirection: "row", alignItems: "center", gap: 6 },
  stepIcon: { width: 18, height: 18, alignItems: "center", justifyContent: "center" },
  stepText: { flex: 1, fontFamily: "PlusJakartaSans-Medium", fontSize: 12, color: colors.muted },
  stepDetail: { color: colors.faint },
  group: { gap: 8 },
  groupTitle: { fontFamily: "PlusJakartaSans-Bold", fontSize: 10, letterSpacing: 0.8, textTransform: "uppercase", color: colors.faint },
  cards: { gap: 10, paddingRight: 8 },
  uniCard: { width: 236, padding: 14, borderRadius: 16, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, gap: 5 },
  uniTop: { flexDirection: "row", alignItems: "center", gap: 6 },
  uniPlace: { flex: 1, fontFamily: "PlusJakartaSans-Medium", fontSize: 11, color: colors.muted },
  uniName: { fontFamily: "Fraunces-SemiBold", fontSize: 17, lineHeight: 22, color: colors.ink },
  uniFee: { fontFamily: "PlusJakartaSans-Bold", fontSize: 15, color: colors.primary },
  uniFeeUnit: { fontFamily: "PlusJakartaSans-Regular", fontSize: 12, color: colors.muted },
  uniMeta: { fontFamily: "PlusJakartaSans-Regular", fontSize: 12, color: colors.muted },
  uniOpen: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 },
  uniOpenText: { fontFamily: "PlusJakartaSans-SemiBold", fontSize: 12, color: colors.primary },
  chart: { gap: 9, padding: 14, borderRadius: 16, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line },
  barRow: { gap: 5 },
  barLabelRow: { flexDirection: "row", justifyContent: "space-between", gap: 10 },
  barLabel: { flex: 1, fontFamily: "PlusJakartaSans-Medium", fontSize: 12, color: colors.ink },
  barValue: { fontFamily: "PlusJakartaSans-Bold", fontSize: 12, color: colors.ink },
  barTrack: { height: 7, borderRadius: 4, backgroundColor: colors.primarySoft, overflow: "hidden" },
  barFill: { height: 7, borderRadius: 4, backgroundColor: colors.primary },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 7 },
  chip: { maxWidth: "100%", borderRadius: 999, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, paddingHorizontal: 12, paddingVertical: 7 },
  chipText: { fontFamily: "PlusJakartaSans-SemiBold", fontSize: 12, color: colors.ink },
  small: { flexShrink: 1, fontFamily: "PlusJakartaSans-Regular", fontSize: 13, lineHeight: 19, color: colors.muted },
  inlineRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  inlineLink: { fontFamily: "PlusJakartaSans-SemiBold", color: colors.accent, textDecorationLine: "underline" },
  thinking: { flexDirection: "row", alignItems: "center", gap: 8 },
  thinkingText: { fontFamily: "PlusJakartaSans-Medium", fontSize: 13, color: colors.muted },
  pressed: { opacity: 0.75 },
});
