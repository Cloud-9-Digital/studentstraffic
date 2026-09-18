import { SearchablePicker } from "../../src/components/SearchablePicker";
import { useReducedMotion } from "../../src/hooks/useReducedMotion";
import {
  Animated,
  Image,
  LayoutAnimation,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  UIManager,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

import { mobileClient } from "../../src/api/mobileClient";
import { useToast } from "../../src/components/Toast";
import { colors, shadow } from "../../src/theme/tokens";
import type { University, UniversityDetail } from "../../src/types/domain";

// ── Gradient map (same as UniversityCard) ────────────────────────────────────

const TONE_GRADIENT: Record<string, [string, string]> = {
  blue:  ["#0f3d37", "#1c6b5f"],
  coral: ["#c04d28", "#d95f38"],
  green: ["#0a2620", "#0f3d37"],
};

function toneFor(country: string) {
  if (country === "Georgia") return "blue";
  if (country === "Kyrgyzstan") return "coral";
  return "green";
}

// ── Small helpers ─────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: string }) {
  return <Text style={sh.sLabel}>{children}</Text>;
}

function SectionTitle({ children }: { children: string }) {
  return <Text style={sh.sTitle}>{children}</Text>;
}

function FactTile({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={sh.factTile}>
      <Ionicons name={icon as any} size={17} color={colors.primary} />
      <Text style={sh.factLabel}>{label}</Text>
      <Text style={sh.factValue}>{value}</Text>
    </View>
  );
}

function CheckItem({ text, variant = "check" }: { text: string; variant?: "check" | "warn" }) {
  const isWarn = variant === "warn";
  return (
    <View style={sh.checkRow}>
      <View style={[sh.checkDot, isWarn && sh.warnDot]}>
        <Ionicons
          name={isWarn ? "alert" : "checkmark"}
          size={10}
          color={isWarn ? colors.amber : colors.primary}
        />
      </View>
      <View style={{ flex: 1 }}><ExpandableText text={text} /></View>
    </View>
  );
}

function ExpandableText({ text, lines = 4 }: { text: string; lines?: number }) {
  const [expanded, setExpanded] = useState(false);
  return <View><Text style={ux.paragraph} numberOfLines={expanded ? undefined : lines}>{text}</Text>{text.length > lines * 40 ? <Pressable accessibilityRole="button" accessibilityState={{ expanded }} onPress={() => setExpanded(v => !v)} style={ux.textAction}><Text style={ux.link}>{expanded ? "Read less" : "Read more"}</Text></Pressable> : null}</View>;
}
function DetailSection({ title, icon, children }: { title: string; icon?: keyof typeof Ionicons.glyphMap; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const reducedMotion = useReducedMotion();
  return <View style={ux.accordion}><Pressable accessibilityRole="button" accessibilityState={{ expanded: open }} onPress={() => { if (!reducedMotion) LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); setOpen(v => !v); }} style={ux.accordionHeader}>{icon ? <Ionicons name={icon} size={20} color={colors.primary} /> : null}<Text style={ux.accordionTitle}>{title}</Text><Ionicons name={open ? "chevron-up" : "chevron-down"} size={17} color={colors.muted} /></Pressable>{open ? <View style={ux.accordionContent}>{children}</View> : null}</View>;
}
function BulletPreview({ items, warn = false }: { items: string[]; warn?: boolean }) {
  const [all, setAll] = useState(false);
  return <View style={{ gap: 12 }}>{(all ? items : items.slice(0, 3)).map((text, i) => <View key={i} style={{ flexDirection: "row", gap: 10 }}><Ionicons name={warn ? "alert-circle-outline" : "checkmark-circle-outline"} size={18} color={warn ? colors.accent : colors.primary} /><View style={{ flex: 1 }}><ExpandableText text={text} lines={2} /></View></View>)}{items.length > 3 ? <Pressable accessibilityRole="button" accessibilityState={{ expanded: all }} onPress={() => setAll(v => !v)} style={ux.textAction}><Text style={ux.link}>{all ? "Show fewer" : `Show all ${items.length}`}</Text></Pressable> : null}</View>;
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  function toggle() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    Haptics.selectionAsync();
    setOpen(v => !v);
  }
  return (
    <Pressable onPress={toggle} style={sh.faqItem}>
      <View style={sh.faqRow}>
        <Text style={sh.faqQ}>{question}</Text>
        <Ionicons name={open ? "chevron-up" : "chevron-down"} size={16} color={colors.faint} />
      </View>
      {open && <Text style={sh.faqA}>{answer}</Text>}
    </Pressable>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────

export default function UniversityDetailScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const insets = useSafeAreaInsets();

  const { data: university, isLoading } = useQuery({
    queryKey: ["university", slug],
    queryFn: () => mobileClient.getUniversity(slug),
    enabled: Boolean(slug),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
  const { data: shortlists } = useQuery({
    queryKey: ["shortlists"],
    queryFn: () => mobileClient.getShortlists(),
    enabled: false,
  });

  const scrollY    = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [programPicker, setProgramPicker] = useState(false);
  const [allFaqs, setAllFaqs] = useState(false);
  const [logoError, setLogoError] = useState(false);
  useEffect(() => { setSelectedProgram(null); setProgramPicker(false); setAllFaqs(false); setLogoError(false); setImgError(false); }, [slug]);
  const [saved, setSaved]               = useState(false);
  const [toggling, setToggling]         = useState(false);
  const [imgError, setImgError]         = useState(false);
  // status bar: light (white icons) over the dark hero, dark once sticky header appears
  const [statusBarStyle, setStatusBarStyle] = useState<"light" | "dark">("light");

  useEffect(() => {
    if (shortlists !== undefined && slug) {
      setSaved(shortlists.some((item: University) => item.slug === slug));
      return;
    }
    if (university) {
      const cached = queryClient.getQueryData<University[]>(["shortlists"]);
      setSaved(cached?.some((item) => item.slug === university.slug) ?? false);
    }
  }, [queryClient, shortlists, slug, university]);

  // Shimmer loop — runs while loading
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, { toValue: 1, duration: 850, useNativeDriver: true }),
        Animated.timing(shimmerAnim, { toValue: 0, duration: 850, useNativeDriver: true }),
      ]),
    );
    if (isLoading) loop.start();
    return () => loop.stop();
  }, [isLoading]);

  // Status bar: white icons over dark hero → dark icons once white sticky header slides in
  useEffect(() => {
    const listenerId = scrollY.addListener(({ value }) => {
      setStatusBarStyle(value > HERO_H - 80 ? "dark" : "light");
    });
    return () => scrollY.removeListener(listenerId);
  }, [scrollY]);

  const HERO_H = 260 + Math.max(0, insets.top - 44);

  const headerOpacity = scrollY.interpolate({
    inputRange: [HERO_H - 80, HERO_H - 20],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });
  const floatingOpacity = scrollY.interpolate({
    inputRange: [HERO_H - 100, HERO_H - 40],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  async function handleBookmark() {
    if (!university || toggling) return;
    Haptics.impactAsync(saved ? Haptics.ImpactFeedbackStyle.Light : Haptics.ImpactFeedbackStyle.Medium);
    const next = !saved;
    setSaved(next);
    showToast(next ? "Added to shortlist" : "Removed from shortlist", next ? "add" : "remove");
    setToggling(true);
    try {
      if (next) await mobileClient.addShortlist(university.slug);
      else await mobileClient.removeShortlist(university.slug);
      queryClient.invalidateQueries({ queryKey: ["shortlists"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    } catch {
      setSaved(!next);
    } finally {
      setToggling(false);
    }
  }

  // ── Loading skeleton ─────────────────────────────────────────────────────
  if (isLoading) {
    const shimmerOpacity = shimmerAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.45, 1],
    });
    return (
      <View style={s.root}>
        <StatusBar style="light" />
        <Animated.View style={{ opacity: shimmerOpacity }}>
          {/* Hero */}
          <View style={sk.hero} />
          {/* Floating back + bookmark placeholder */}
          <View style={[sk.floatBtn, { top: insets.top + 10, left: 16 }]} />
          <View style={[sk.floatBtn, { top: insets.top + 10, right: 16 }]} />

          <View style={sk.body}>
            {/* Est. pill */}
            <View style={sk.pill} />

            {/* 3 fact tiles */}
            <View style={sk.factRow}>
              {[1, 2, 3].map(i => <View key={i} style={sk.factTile} />)}
            </View>

            {/* "About" section */}
            <View style={sk.sectionTitle} />
            <View style={[sk.line, { width: "100%" }]} />
            <View style={[sk.line, { width: "88%" }]} />
            <View style={[sk.line, { width: "72%" }]} />

            {/* "Why Choose" section */}
            <View style={[sk.sectionTitle, { marginTop: 20, width: 130 }]} />
            {[1, 2, 3].map(i => (
              <View key={i} style={sk.bulletRow}>
                <View style={sk.bulletDot} />
                <View style={[sk.line, { flex: 1 }]} />
              </View>
            ))}
          </View>
        </Animated.View>
      </View>
    );
  }

  if (!university) {
    return (
      <View style={[s.root, s.center]}>
        <Ionicons name="school-outline" size={48} color={colors.faint} />
        <Text style={s.missing}>University not found.</Text>
        <Pressable onPress={() => router.back()} style={s.backPill}>
          <Ionicons name="arrow-back" size={16} color={colors.primary} />
          <Text style={s.backPillLabel}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const tone = toneFor(university.country);
  const hasCoverImage = !imgError && !!university.coverImageUrl;
  const programs = university.offerings ?? [];
  const o = programs.find(program => program.slug === selectedProgram) ?? university.primaryOffering ?? programs[0] ?? null;

  const campusSections = [
    { icon: "home-outline",       title: "Hostel & Accommodation", body: university.hostelOverview },
    { icon: "restaurant-outline", title: "Indian Food",          body: university.indianFoodSupport },
    { icon: "shield-checkmark-outline", title: "Safety",         body: university.safetyOverview },
    { icon: "people-outline",     title: "Student Support",      body: university.studentSupport },
    { icon: "map-outline",        title: "City",                 body: university.cityProfile },
  ].filter(x => !!x.body) as { icon: string; title: string; body: string }[];

  const BOTTOM_BAR_H = 80 + insets.bottom;

  return (
    <View style={s.root}>
      {/* Dynamic status bar: light over dark hero, dark once white header slides in */}
      <StatusBar style={statusBarStyle} />

      {/* ── Animated sticky header ── */}
      <Animated.View style={[s.stickyHeader, { opacity: headerOpacity, paddingTop: insets.top }]} pointerEvents="box-none">
        {Platform.OS === "ios" ? (
          <BlurView tint="systemChromeMaterial" intensity={80} style={StyleSheet.absoluteFill} />
        ) : (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.surface }]} />
        )}
        <View style={s.stickyInner}>
          <Pressable onPress={() => router.back()} style={s.stickyBack} hitSlop={8}>
            <Ionicons name="arrow-back" size={20} color={colors.ink} />
          </Pressable>
          <Text style={s.stickyTitle} numberOfLines={1}>{university.name}</Text>
          <Pressable onPress={handleBookmark} hitSlop={8} style={[s.stickyBookmark, saved && s.stickyBookmarkSaved]}>
            <Ionicons name={saved ? "bookmark" : "bookmark-outline"} size={16} color={saved ? "#fff" : colors.ink} />
          </Pressable>
        </View>
      </Animated.View>

      {/* ── Scrollable body ── */}
      <Animated.ScrollView
        contentContainerStyle={{ paddingBottom: BOTTOM_BAR_H + 16 }}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
      >
        {/* ── Hero ── */}
        <View style={{ height: HERO_H }}>
          {hasCoverImage ? (
            <Image
              source={{ uri: university.coverImageUrl! }}
              style={StyleSheet.absoluteFill}
              resizeMode="cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <LinearGradient
              colors={TONE_GRADIENT[tone]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          )}
          {/* Dark scrim for text legibility */}
          <LinearGradient
            colors={["rgba(0,0,0,0.05)", "rgba(0,0,0,0.65)"]}
            style={StyleSheet.absoluteFill}
          />

          {/* Floating back + bookmark (fades out as header appears) */}
          <Animated.View
            style={[s.floatingBtns, { top: insets.top + 10, opacity: floatingOpacity }]}
            pointerEvents="box-none"
          >
            <Pressable onPress={() => router.back()} style={s.floatingBtn}>
              <BlurView tint="dark" intensity={60} style={StyleSheet.absoluteFill} />
              <Ionicons name="arrow-back" size={18} color="#fff" />
            </Pressable>
            <Pressable onPress={handleBookmark} style={[s.floatingBtn, saved && s.floatingBtnSaved]}>
              {!saved && <BlurView tint="dark" intensity={60} style={StyleSheet.absoluteFill} />}
              <Ionicons name={saved ? "bookmark" : "bookmark-outline"} size={18} color="#fff" />
            </Pressable>
          </Animated.View>

          {/* Name overlay */}
          <View style={s.heroBottom}>
            {university.type && (
              <View style={s.typeBadge}>
                <Text style={s.typeBadgeText}>{university.type.toUpperCase()}</Text>
              </View>
            )}
            <Text style={s.heroCity}>{university.city}, {university.country}</Text>
            <Text style={s.heroName} numberOfLines={3}>{university.name}</Text>
          </View>
        </View>

        {/* ── Content ── */}
        <View style={s.content}>

          <View style={ux.identityRow}>{university.logoUrl && !logoError ? <Image source={{ uri: university.logoUrl }} resizeMode="contain" style={ux.logo} onError={() => setLogoError(true)} /> : <View style={ux.logoFallback}><Ionicons name="school-outline" size={24} color={colors.primary} /></View>}<View style={{ flex: 1 }}><Text style={[ux.meta, { color: colors.ink }]}>University overview</Text><Text style={ux.meta}>{university.establishedYear ? `Established ${university.establishedYear} · ` : ""}{programs.length} {programs.length === 1 ? "program" : "programs"}</Text></View></View>
          {!!university.summary && <View style={ux.section}><SectionTitle>At a glance</SectionTitle><ExpandableText key={university.slug} text={university.summary} /></View>}
          <View style={ux.programSection}><View style={ux.sectionHeading}><SectionTitle>Explore programs</SectionTitle><Text style={ux.count}>{programs.length}</Text></View><Text style={ux.caption}>Choose a program to see its duration, language and intake.</Text>{programs.length ? <Pressable accessibilityRole="button" accessibilityLabel="Choose a program" onPress={() => setProgramPicker(true)} style={ux.programSelector}><Ionicons name="school-outline" size={21} color={colors.accent} /><Text style={ux.programTitle} numberOfLines={2}>{o?.title ?? "Choose a program"}</Text><Ionicons name="chevron-down" size={18} color={colors.accent} /></Pressable> : <Text style={ux.caption}>Program details are being updated.</Text>}
          {o ? <View style={ux.facts}><View style={ux.fact}><Ionicons name="time-outline" size={17} color={colors.muted} /><Text style={ux.factLabel}>Duration</Text><Text style={ux.factValue}>{o.durationYears ? `${o.durationYears} years` : "Not confirmed"}</Text></View><View style={ux.fact}><Ionicons name="language-outline" size={17} color={colors.muted} /><Text style={ux.factLabel}>Language</Text><Text style={ux.factValue}>{o.medium || "Not confirmed"}</Text></View>{o.intakeMonths?.length ? <View style={ux.fact}><Ionicons name="calendar-outline" size={17} color={colors.muted} /><Text style={ux.factLabel}>Intake</Text><Text style={ux.factValue}>{o.intakeMonths.join(", ")}</Text></View> : null}</View> : null}</View>
          {university.whyChoose?.length > 0 ? <View style={ux.section}><SectionTitle>Why consider this university</SectionTitle><BulletPreview key={university.slug} items={university.whyChoose} /></View> : null}
          <View style={ux.section}><SectionTitle>A closer look</SectionTitle>
          {/* Admissions */}
          {university.admissionsContent && (
            <DetailSection title="University admissions" icon="document-text-outline">
              <View style={s.admCard}>
                {!!university.admissionsContent.overview && (
                  <ExpandableText text={university.admissionsContent.overview} />
                )}

                {/* Eligibility */}
                {university.admissionsContent.eligibility && (
                  <View style={s.admBlock}>
                    <View style={s.admLabelRow}>
                      <Ionicons name="checkmark-circle-outline" size={15} color={colors.primary} />
                      <Text style={s.admLabel}>Eligibility</Text>
                    </View>
                    {!!university.admissionsContent.eligibility.intro && (
                      <Text style={s.admBody}>{university.admissionsContent.eligibility.intro}</Text>
                    )}
                    {university.admissionsContent.eligibility.items?.map((item, i) => (
                      <CheckItem key={i} text={item} variant="check" />
                    ))}
                  </View>
                )}

                {/* Admission steps */}
                {(university.admissionsContent.admissionSteps?.length ?? 0) > 0 && (
                  <View style={s.admBlock}>
                    <View style={s.admLabelRow}>
                      <Ionicons name="list-outline" size={15} color={colors.primary} />
                      <Text style={s.admLabel}>Application Steps</Text>
                    </View>
                    {university.admissionsContent.admissionSteps!.map((step, i) => (
                      <View key={i} style={s.stepRow}>
                        <View style={s.stepNum}><Text style={s.stepNumText}>{i + 1}</Text></View>
                        <Text style={s.admBody}>{step}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Documents */}
                {university.admissionsContent.documentsRequired && (
                  <View style={s.admBlock}>
                    <View style={s.admLabelRow}>
                      <Ionicons name="document-outline" size={15} color={colors.primary} />
                      <Text style={s.admLabel}>Documents Required</Text>
                    </View>
                    {university.admissionsContent.documentsRequired.educational?.length > 0 && (
                      <>
                        <Text style={s.docSubLabel}>Educational</Text>
                        {university.admissionsContent.documentsRequired.educational.map((d, i) => (
                          <CheckItem key={i} text={d} variant="check" />
                        ))}
                      </>
                    )}
                    {university.admissionsContent.documentsRequired.visa?.length > 0 && (
                      <>
                        <Text style={[s.docSubLabel, { marginTop: 10 }]}>Visa</Text>
                        {university.admissionsContent.documentsRequired.visa.map((d, i) => (
                          <CheckItem key={i} text={d} variant="check" />
                        ))}
                      </>
                    )}
                  </View>
                )}

                {/* Scholarship */}
                {!!university.admissionsContent.scholarshipInfo && (
                  <View style={s.admBlock}>
                    <View style={s.admLabelRow}>
                      <Ionicons name="trophy-outline" size={15} color={colors.amber} />
                      <Text style={[s.admLabel, { color: colors.amber }]}>Scholarships</Text>
                    </View>
                    <Text style={s.admBody}>{university.admissionsContent.scholarshipInfo}</Text>
                  </View>
                )}

                {/* Deadlines */}
                {!!university.admissionsContent.deadlinesNote && (
                  <View style={[s.admBlock, s.admDeadline]}>
                    <Ionicons name="alarm-outline" size={14} color={colors.coral} />
                    <Text style={s.admDeadlineText}>{university.admissionsContent.deadlinesNote}</Text>
                  </View>
                )}
              </View>

            </DetailSection>
          )}


          {campusSections.map(c => <DetailSection key={university.slug + c.title} title={c.title} icon={c.icon as keyof typeof Ionicons.glyphMap}><ExpandableText text={c.body} /></DetailSection>)}
          {university.bestFitFor?.length ? <DetailSection title="Who it may suit" icon="people-outline"><BulletPreview items={university.bestFitFor} /></DetailSection> : null}
          {university.thingsToConsider?.length ? <DetailSection title="Before you decide" icon="alert-circle-outline"><BulletPreview items={university.thingsToConsider} warn /></DetailSection> : null}
          </View>
          <Pressable accessibilityRole="button" onPress={() => router.push({ pathname: "/student-guides", params: { university: university.slug } })} style={ux.guideCard}><View style={{ flex: 1 }}><Text style={ux.guideTitle}>Ask a student guide</Text><Text style={ux.caption}>Find out what studying here is really like.</Text></View><Ionicons name="arrow-forward" size={22} color={colors.primary} /></Pressable>
          {university.faq?.length ? <View style={ux.section}><SectionTitle>Common questions</SectionTitle>{(allFaqs ? university.faq : university.faq.slice(0,3)).map((item,i) => <FaqItem key={university.slug+i} question={item.question} answer={item.answer} />)}{university.faq.length > 3 ? <Pressable accessibilityRole="button" onPress={() => setAllFaqs(v => !v)} style={ux.textAction}><Text style={ux.link}>{allFaqs ? "Show fewer questions" : `View all ${university.faq.length} questions`}</Text></Pressable> : null}</View> : null}


        </View>
      </Animated.ScrollView>

      {programPicker ? <SearchablePicker picker={{ title: "Choose a program", selected: o?.slug ?? "", options: programs.map(program => ({ label: program.title, value: program.slug })), onSelect: setSelectedProgram }} onClose={() => setProgramPicker(false)} /> : null}
      {/* ── Sticky bottom CTA bar ── */}
      <View style={[s.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
        {Platform.OS === "ios" && (
          <BlurView tint="systemChromeMaterial" intensity={80} style={StyleSheet.absoluteFill} />
        )}
        <View style={s.bottomInner}>
          {/* Talk to a counsellor */}
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.push({ pathname: "/counselling", params: { universitySlug: university.slug } });
            }}
            style={({ pressed }) => [s.applyBtn, pressed && s.applyBtnPressed]}
          >
            <LinearGradient pointerEvents="none" colors={[colors.accent, colors.accentStrong]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
            <Ionicons name="chatbubble-ellipses" size={17} color="#fff" />
            <Text style={s.applyLabel}>Talk to a counsellor</Text>
          </Pressable>


        </View>
      </View>
    </View>
  );
}

// ── Skeleton styles ───────────────────────────────────────────────────────────

const sk = StyleSheet.create({
  // Hero: dark tinted rectangle matching the actual gradient feel
  hero: {
    width: "100%",
    height: 300,
    backgroundColor: "#1a2e28",
  },
  // Circular placeholder for floating back / bookmark buttons
  floatBtn: {
    position: "absolute",
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 14,
    gap: 10,
  },
  // Est. pill
  pill: {
    height: 32,
    width: 130,
    borderRadius: 999,
    backgroundColor: colors.line,
  },
  // Fact tiles row
  factRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 6,
  },
  factTile: {
    flex: 1,
    height: 88,
    borderRadius: 16,
    backgroundColor: colors.line,
  },
  // Section heading placeholder
  sectionTitle: {
    height: 22,
    width: 110,
    borderRadius: 6,
    backgroundColor: colors.line,
    marginTop: 18,
    marginBottom: 10,
  },
  // Text line placeholder
  line: {
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.line,
  },
  // Bullet list row
  bulletRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  bulletDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.line,
    flexShrink: 0,
  },
});

// ── Shared helper styles ──────────────────────────────────────────────────────

const sh = StyleSheet.create({
  sLabel: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 11,
    color: colors.faint,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  sTitle: {
    fontFamily: "Fraunces-SemiBold",
    fontSize: 20,
    color: colors.ink,
    letterSpacing: -0.3,
    marginBottom: 12,
  },

  factTile: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 14,
    gap: 4,
    alignItems: "flex-start",
    ...shadow,
  },
  factLabel: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 11,
    color: colors.faint,
    marginTop: 4,
  },
  factValue: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 14,
    color: colors.ink,
  },

  checkRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  checkDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 1,
  },
  warnDot: {
    backgroundColor: colors.amberSoft,
  },
  checkText: {
    flex: 1,
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 14,
    color: colors.muted,
    lineHeight: 22,
  },
  warnText: {
    color: colors.amber,
  },

  infoCard: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 14,
  },
  infoIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  infoTitle: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 13,
    color: colors.ink,
    marginBottom: 4,
  },
  infoBody: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 13,
    color: colors.muted,
    lineHeight: 20,
  },

  costRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  costRowHL: {
    backgroundColor: colors.primarySoft,
    borderBottomWidth: 0,
    borderRadius: 12,
    marginTop: 4,
  },
  costLabel: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 14,
    color: colors.muted,
  },
  costLabelHL: {
    fontFamily: "PlusJakartaSans-Bold",
    color: colors.primary,
  },
  costValue: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 14,
    color: colors.ink,
  },
  costValueHL: {
    fontSize: 16,
    color: colors.primary,
  },

  faqItem: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  faqRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  faqQ: {
    flex: 1,
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 14,
    color: colors.ink,
    lineHeight: 22,
  },
  faqA: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 14,
    color: colors.muted,
    lineHeight: 22,
    marginTop: 10,
  },
});

// ── Screen styles ─────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  center: { alignItems: "center", justifyContent: "center" },


  missing: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 16,
    color: colors.muted,
    marginTop: 16,
    marginBottom: 20,
  },
  backPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: colors.primarySoft,
  },
  backPillLabel: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 14,
    color: colors.primary,
  },

  // Sticky header
  stickyHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    overflow: "hidden",
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  stickyInner: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  stickyBack: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  stickyTitle: {
    flex: 1,
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 15,
    color: colors.ink,
  },
  stickyBookmark: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  stickyBookmarkSaved: {
    backgroundColor: colors.coral,
  },

  // Hero
  floatingBtns: {
    position: "absolute",
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 10,
  },
  floatingBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  floatingBtnSaved: {
    backgroundColor: colors.coral,
  },
  heroBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 24,
    gap: 4,
  },
  typeBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 4,
  },
  typeBadgeText: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 10,
    color: "rgba(255,255,255,0.9)",
    letterSpacing: 1,
  },
  heroCity: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 13,
    color: "rgba(255,255,255,0.75)",
    letterSpacing: 0.3,
  },
  heroName: {
    fontFamily: "Fraunces-SemiBold",
    fontSize: 26,
    color: "#fff",
    lineHeight: 33,
    letterSpacing: -0.4,
  },

  // Content
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  estPill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    marginTop: 2,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  estText: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 12,
    color: colors.faint,
  },
  section: {
    marginTop: 28,
  },
  body: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 15,
    color: colors.muted,
    lineHeight: 24,
  },

  badgeScroll: { marginTop: 14 },
  badgeRow: { gap: 8 },
  recBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: colors.primarySoft,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  recBadgeText: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 12,
    color: colors.primary,
  },

  factRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },

  bulletList: { gap: 10 },
  warnCard: {
    backgroundColor: colors.amberSoft,
    borderRadius: 16,
    padding: 16,
  },

  costCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: "hidden",
    ...shadow,
  },
  intakeWrap: { marginTop: 16 },
  intakePills: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  intakePill: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  intakePillText: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 13,
    color: colors.ink,
  },

  fitWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  fitTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: colors.primarySoft,
    borderRadius: 8,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  fitTagText: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 13,
    color: colors.primary,
  },

  infoList: { gap: 10 },

  hospitalList: { gap: 8 },
  hospitalRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.line,
  },
  hospitalIndex: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  hospitalIndexText: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 12,
    color: colors.primary,
  },
  hospitalName: {
    flex: 1,
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 14,
    color: colors.ink,
  },

  metaRow: {
    flexDirection: "row",
    gap: 16,
    marginTop: 28,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    marginBottom: 4,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    flex: 1,
  },
  metaText: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 12,
    color: colors.faint,
    flex: 1,
  },

  // Admissions card
  admCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 16,
    gap: 2,
    ...shadow,
  },
  admBlock: { marginTop: 14, gap: 8 },
  admLabelRow: { flexDirection: "row", alignItems: "center", gap: 7, marginBottom: 4 },
  admLabel: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 13,
    color: colors.primary,
  },
  admBody: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 14,
    color: colors.muted,
    lineHeight: 22,
  },
  docSubLabel: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 12,
    color: colors.faint,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  stepRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  stepNum: {
    width: 22,
    height: 22,
    borderRadius: 7,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 1,
  },
  stepNumText: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 11,
    color: colors.primary,
  },
  admDeadline: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: colors.coralSoft,
    borderRadius: 10,
    padding: 12,
    marginTop: 4,
  },
  admDeadlineText: {
    flex: 1,
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 13,
    color: colors.coral,
    lineHeight: 20,
  },

  // Year-wise cost table
  yearTable: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: "hidden",
    ...shadow,
  },
  yearRow: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  yearRowAlt: { backgroundColor: colors.background },
  yearHeader: { backgroundColor: colors.primarySoft },
  yearHeaderText: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 11,
    color: colors.primary,
    textAlign: "right",
  },
  yearCell: {
    flex: 1,
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 12,
    color: colors.muted,
    textAlign: "right",
  },
  yearLabel: {
    fontFamily: "PlusJakartaSans-SemiBold",
    color: colors.ink,
    textAlign: "left",
  },
  yearCellBold: {
    fontFamily: "PlusJakartaSans-Bold",
    color: colors.ink,
  },
  yearTotalRow: {
    backgroundColor: colors.primarySoft,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  yearTotalLabel: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 13,
    color: colors.primary,
  },
  yearTotalVal: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 13,
    color: colors.primary,
    textAlign: "right",
  },

  // Fee note
  feeNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 7,
    marginTop: 10,
  },
  feeNoteText: {
    flex: 1,
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 12,
    color: colors.faint,
    lineHeight: 18,
  },

  // FAQ
  faqList: { gap: 8 },

  // Bottom bar
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    overflow: "hidden",
    borderTopWidth: 1,
    borderTopColor: colors.line,
    backgroundColor: Platform.OS === "android" ? colors.surface : "transparent",
  },
  bottomInner: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 10,
  },
  applyBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    minHeight: 50,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: colors.accent,
  },
  applyBtnPressed: { opacity: 0.88 },
  applyLabel: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 15,
    color: "#fff",
  },
  counselBtn: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#e7f9f3",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  counselBtnPressed: { opacity: 0.75 },
});

const ux = StyleSheet.create({
  identityRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingBottom: 18, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  logo: { width: 48, height: 48, borderRadius: 10, backgroundColor: "#fff" },
  logoFallback: { width: 48, height: 48, borderRadius: 12, backgroundColor: colors.primarySoft, alignItems: "center", justifyContent: "center" },
  meta: { fontFamily: "PlusJakartaSans-Medium", fontSize: 12, lineHeight: 20, color: colors.muted },
  section: { marginTop: 26 },
  paragraph: { fontFamily: "PlusJakartaSans-Regular", fontSize: 13, lineHeight: 22, color: colors.muted },
  textAction: { minHeight: 44, justifyContent: "center", alignSelf: "flex-start" },
  link: { fontFamily: "PlusJakartaSans-SemiBold", fontSize: 12, color: colors.primary },
  programSection: { marginTop: 24, padding: 16, borderRadius: 18, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line },
  sectionHeading: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
  count: { fontFamily: "PlusJakartaSans-SemiBold", fontSize: 13, color: colors.accent, paddingHorizontal: 9, paddingVertical: 3, borderRadius: 8, backgroundColor: colors.coralSoft },
  caption: { fontFamily: "PlusJakartaSans-Regular", fontSize: 12, lineHeight: 20, color: colors.muted },
  programSelector: { flexDirection: "row", alignItems: "center", gap: 10, padding: 13, borderRadius: 12, backgroundColor: colors.coralSoft, marginTop: 16 },
  programTitle: { flex: 1, fontFamily: "PlusJakartaSans-SemiBold", fontSize: 13, lineHeight: 20, color: colors.accentStrong },
  facts: { marginTop: 10 },
  fact: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  factLabel: { fontFamily: "PlusJakartaSans-Regular", fontSize: 12, color: colors.muted, width: 68 },
  factValue: { flex: 1, textAlign: "right", fontFamily: "PlusJakartaSans-SemiBold", fontSize: 12, lineHeight: 19, color: colors.ink },
  accordion: { borderBottomWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  accordionHeader: { minHeight: 62, flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 14 },
  accordionTitle: { flex: 1, fontFamily: "PlusJakartaSans-SemiBold", fontSize: 13, lineHeight: 21, color: colors.ink },
  accordionContent: { paddingBottom: 18 },
  guideCard: { flexDirection: "row", gap: 16, alignItems: "center", marginTop: 28, padding: 18, backgroundColor: colors.primarySoft, borderRadius: 16 },
  guideTitle: { fontFamily: "Fraunces-Medium", fontSize: 21, color: colors.ink, marginBottom: 6 },
});
