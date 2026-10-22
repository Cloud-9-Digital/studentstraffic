import { Fragment } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { colors } from "../../theme/tokens";

// The small slice of Markdown Mira writes: paragraphs, bullet and numbered
// lists, **bold**, [links](/path), the odd heading, and a comparison table.
// As on the web, headings read as bold lines and images never render.

type Props = { content: string; onLink: (href: string) => void };

function Inline({ text, onLink }: { text: string; onLink: (href: string) => void }) {
  const nodes: React.ReactNode[] = [];
  const pattern = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text))) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    if (match[1] !== undefined) {
      nodes.push(<Text key={match.index} style={s.bold}>{match[1]}</Text>);
    } else {
      const href = match[3];
      nodes.push(<Text key={match.index} style={s.link} accessibilityRole="link" onPress={() => onLink(href)}>{match[2]}</Text>);
    }
    last = match.index + match[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return <>{nodes.map((node, index) => <Fragment key={index}>{node}</Fragment>)}</>;
}

function cells(row: string) {
  return row.trim().replace(/^\||\|$/g, "").split("|").map((cell) => cell.trim());
}

export function MiraMarkdown({ content, onLink }: Props) {
  const blocks: React.ReactNode[] = [];
  const lines = content.replace(/\r/g, "").split("\n");
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) { i++; continue; }

    if (trimmed.startsWith("|")) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        if (!/^\|?\s*:?-{2,}/.test(lines[i].trim())) rows.push(cells(lines[i]));
        i++;
      }
      blocks.push(
        <ScrollView key={blocks.length} horizontal showsHorizontalScrollIndicator={false} style={s.table}>
          <View>
            {rows.map((row, r) => (
              <View key={r} style={[s.tableRow, r === 0 && s.tableHead]}>
                {row.map((cell, c) => <Text key={c} style={[s.tableCell, r === 0 && s.bold]}><Inline text={cell} onLink={onLink} /></Text>)}
              </View>
            ))}
          </View>
        </ScrollView>
      );
      continue;
    }

    const bullet = /^\s*(?:[-*•]|(\d+)[.)])\s+(.*)$/.exec(line);
    if (bullet) {
      const items: Array<{ marker: string; text: string }> = [];
      while (i < lines.length) {
        const item = /^\s*(?:[-*•]|(\d+)[.)])\s+(.*)$/.exec(lines[i]);
        if (!item) break;
        items.push({ marker: item[1] ? `${item[1]}.` : "•", text: item[2] });
        i++;
      }
      blocks.push(
        <View key={blocks.length} style={s.list}>
          {items.map((item, index) => (
            <View key={index} style={s.listItem}>
              <Text style={s.marker}>{item.marker}</Text>
              <Text style={[s.body, s.flex]}><Inline text={item.text} onLink={onLink} /></Text>
            </View>
          ))}
        </View>
      );
      continue;
    }

    const heading = /^#{1,6}\s+(.*)$/.exec(trimmed);
    if (heading) {
      blocks.push(<Text key={blocks.length} style={[s.body, s.bold]}><Inline text={heading[1]} onLink={onLink} /></Text>);
      i++;
      continue;
    }

    const paragraph: string[] = [];
    while (i < lines.length && lines[i].trim() && !/^\s*(?:[-*•]|\d+[.)])\s+/.test(lines[i]) && !lines[i].trim().startsWith("|") && !/^#{1,6}\s/.test(lines[i].trim())) {
      paragraph.push(lines[i].trim());
      i++;
    }
    blocks.push(<Text key={blocks.length} style={s.body}><Inline text={paragraph.join("\n").replace(/!\[[^\]]*\]\([^)]*\)/g, "")} onLink={onLink} /></Text>);
  }

  return <View style={s.root}>{blocks}</View>;
}

const s = StyleSheet.create({
  root: { gap: 8 },
  body: { fontFamily: "PlusJakartaSans-Regular", fontSize: 15, lineHeight: 23, color: colors.ink },
  bold: { fontFamily: "PlusJakartaSans-Bold" },
  link: { fontFamily: "PlusJakartaSans-SemiBold", color: colors.accent, textDecorationLine: "underline" },
  list: { gap: 6 },
  listItem: { flexDirection: "row", gap: 8 },
  marker: { minWidth: 14, fontFamily: "PlusJakartaSans-SemiBold", fontSize: 15, lineHeight: 23, color: colors.muted },
  flex: { flex: 1 },
  table: { borderWidth: 1, borderColor: colors.line, borderRadius: 10 },
  tableRow: { flexDirection: "row", borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line },
  tableHead: { backgroundColor: colors.background, borderTopWidth: 0 },
  tableCell: { width: 140, paddingHorizontal: 10, paddingVertical: 7, fontFamily: "PlusJakartaSans-Regular", fontSize: 12, lineHeight: 17, color: colors.ink },
});
