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
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

import { mobileClient } from "../../src/api/mobileClient";
import { useToast } from "../../src/components/Toast";
import { colors, shadow } from "../../src/theme/tokens";
import type { UniversityDetail } from "../../src/types/domain";

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
      <Text style={[sh.checkText, isWarn && sh.warnText]}>{text}</Text>
    </View>
  );
}

function InfoCard({ icon, title, body }: { icon: string; title: string; body: string }) {
  return (
    <View style={sh.infoCard}>
      <View style={sh.infoIconWrap}>
        <Ionicons name={icon as any} size={16} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={sh.infoTitle}>{title}</Text>
        <Text style={sh.infoBody}>{body}</Text>
      </View>
    </View>
  );
}

function CostRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <View style={[sh.costRow, highlight && sh.costRowHL]}>
      <Text style={[sh.costLabel, highlight && sh.costLabelHL]}>{label}</Text>
      <Text style={[sh.costValue, highlight && sh.costValueHL]}>{value}</Text>
    </View>
  );
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
  });

  const scrollY = useRef(new Animated.Value(0)).current;
  const [saved, setSaved] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (university) setSaved(university.isShortlisted ?? false);
  }, [university?.isShortlisted]);

  const HERO_H = 300;

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
      queryClient.invalidateQueries({ queryKey: ["university", slug] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    } catch {
      setSaved(!next);
    } finally {
      setToggling(false);
    }
  }

  // ── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <View style={[s.root, s.center]}>
        <View style={s.loadingHero} />
        <View style={s.loadingBody}>
          {[1, 2, 3].map(i => <View key={i} style={s.loadingLine} />)}
        </View>
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
  const o = university.primaryOffering;
  const usd = (n: number) => `$${n.toLocaleString()}`;

  const campusSections = [
    { icon: "medkit-outline",     title: "Clinical Exposure",    body: university.clinicalExposure },
    { icon: "home-outline",       title: "Hostel & Accommodation", body: university.hostelOverview },
    { icon: "restaurant-outline", title: "Indian Food",          body: university.indianFoodSupport },
    { icon: "shield-checkmark-outline", title: "Safety",         body: university.safetyOverview },
    { icon: "people-outline",     title: "Student Support",      body: university.studentSupport },
    { icon: "map-outline",        title: "City",                 body: university.cityProfile },
  ].filter(x => !!x.body) as { icon: string; title: string; body: string }[];

  const BOTTOM_BAR_H = 80 + insets.bottom;

  return (
    <View style={s.root}>
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

          {/* Recognition badges */}
          {university.recognitionBadges?.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={s.badgeRow}
              style={s.badgeScroll}
            >
              {university.recognitionBadges.map(b => (
                <View key={b} style={s.recBadge}>
                  <Ionicons name="ribbon-outline" size={12} color={colors.primary} />
                  <Text style={s.recBadgeText}>{b}</Text>
                </View>
              ))}
            </ScrollView>
          )}

          {/* Key facts */}
          <View style={s.factRow}>
            <FactTile icon="cash-outline"     label="Annual Fee" value={o ? usd(o.annualTuitionUsd) : usd(university.tuitionUsd)} />
            <FactTile icon="time-outline"     label="Duration"   value={o ? `${o.durationYears} years` : (university.duration ?? "6 years")} />
            <FactTile icon="language-outline" label="Medium"     value={o?.medium ?? university.medium ?? "English"} />
          </View>

          {/* About */}
          {!!university.summary && (
            <View style={s.section}>
              <SectionTitle>About</SectionTitle>
              <Text style={s.body}>{university.summary}</Text>
            </View>
          )}

          {/* Why choose */}
          {university.whyChoose?.length > 0 && (
            <View style={s.section}>
              <SectionTitle>Why Choose</SectionTitle>
              <View style={s.bulletList}>
                {university.whyChoose.map((item, i) => (
                  <CheckItem key={i} text={item} variant="check" />
                ))}
              </View>
            </View>
          )}

          {/* Admissions */}
          {university.admissionsContent && (
            <View style={s.section}>
              <SectionTitle>Admissions</SectionTitle>
              <View style={s.admCard}>
                {!!university.admissionsContent.overview && (
                  <Text style={[s.body, { marginBottom: 14 }]}>{university.admissionsContent.overview}</Text>
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

              {/* Licensing pathway */}
              {(university.admissionsContent.licensingPathway?.length ?? 0) > 0 && (
                <View style={[s.admBlock, { marginTop: 12 }]}>
                  <View style={s.admLabelRow}>
                    <Ionicons name="medal-outline" size={15} color={colors.primary} />
                    <Text style={s.admLabel}>Licensing Pathway</Text>
                  </View>
                  {university.admissionsContent.licensingPathway!.map((step, i) => (
                    <CheckItem key={i} text={step} variant="check" />
                  ))}
                </View>
              )}
            </View>
          )}

          {/* Cost breakdown */}
          {o && (
            <View style={s.section}>
              <SectionTitle>Fees & Costs</SectionTitle>

              {/* Year-wise table if available, else simple summary */}
              {o.yearlyCostBreakdown?.length > 0 ? (
                <View style={s.yearTable}>
                  <View style={[s.yearRow, s.yearHeader]}>
                    <Text style={[s.yearCell, s.yearHeaderText, { flex: 2 }]}>Year</Text>
                    <Text style={[s.yearCell, s.yearHeaderText]}>Tuition</Text>
                    <Text style={[s.yearCell, s.yearHeaderText]}>Living</Text>
                    <Text style={[s.yearCell, s.yearHeaderText]}>Total</Text>
                  </View>
                  {o.yearlyCostBreakdown.map((yr, i) => (
                    <View key={i} style={[s.yearRow, i % 2 === 1 && s.yearRowAlt]}>
                      <Text style={[s.yearCell, s.yearLabel, { flex: 2 }]}>{yr.yearLabel}</Text>
                      <Text style={s.yearCell}>{usd(yr.tuitionUsd)}</Text>
                      <Text style={s.yearCell}>{usd(yr.livingUsd)}</Text>
                      <Text style={[s.yearCell, s.yearCellBold]}>{usd(yr.totalUsd)}</Text>
                    </View>
                  ))}
                  <View style={[s.yearRow, s.yearTotalRow]}>
                    <Text style={[s.yearCell, s.yearTotalLabel, { flex: 2 }]}>Programme Total</Text>
                    <Text style={[s.yearCell, s.yearTotalVal, { flex: 3, textAlign: "right" }]}>{usd(o.totalTuitionUsd)}</Text>
                  </View>
                </View>
              ) : (
                <View style={s.costCard}>
                  <CostRow label="Annual tuition"      value={usd(o.annualTuitionUsd)} />
                  <CostRow label="Annual living costs" value={usd(o.livingUsd)} />
                  <CostRow label={`Total (${o.durationYears} years)`} value={usd(o.totalTuitionUsd)} highlight />
                </View>
              )}

              {/* Fee notes */}
              {!!o.feeNotes && (
                <View style={s.feeNote}>
                  <Ionicons name="information-circle-outline" size={14} color={colors.faint} />
                  <Text style={s.feeNoteText}>{o.feeNotes}</Text>
                </View>
              )}

              {/* Intake months */}
              {o.intakeMonths?.length > 0 && (
                <View style={s.intakeWrap}>
                  <SectionLabel>INTAKE MONTHS</SectionLabel>
                  <View style={s.intakePills}>
                    {o.intakeMonths.map(m => (
                      <View key={m} style={s.intakePill}>
                        <Text style={s.intakePillText}>{m}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          )}

          {/* Best fit for */}
          {university.bestFitFor?.length > 0 && (
            <View style={s.section}>
              <SectionTitle>Best Fit For</SectionTitle>
              <View style={s.fitWrap}>
                {university.bestFitFor.map((tag, i) => (
                  <View key={i} style={s.fitTag}>
                    <Ionicons name="person-outline" size={11} color={colors.primary} />
                    <Text style={s.fitTagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Campus life */}
          {campusSections.length > 0 && (
            <View style={s.section}>
              <SectionTitle>Campus & Life</SectionTitle>
              <View style={s.infoList}>
                {campusSections.map(c => (
                  <InfoCard key={c.title} icon={c.icon} title={c.title} body={c.body} />
                ))}
              </View>
            </View>
          )}

          {/* Teaching hospitals */}
          {university.teachingHospitals?.length > 0 && (
            <View style={s.section}>
              <SectionTitle>Teaching Hospitals</SectionTitle>
              <View style={s.hospitalList}>
                {university.teachingHospitals.map((h, i) => (
                  <View key={i} style={s.hospitalRow}>
                    <View style={s.hospitalIndex}>
                      <Text style={s.hospitalIndexText}>{i + 1}</Text>
                    </View>
                    <Text style={s.hospitalName}>{h}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* License exam support */}
          {(o?.licenseExamSupport?.length ?? 0) > 0 && (
            <View style={s.section}>
              <SectionTitle>Exam & Licensing Support</SectionTitle>
              <View style={s.bulletList}>
                {o!.licenseExamSupport.map((item, i) => (
                  <CheckItem key={i} text={item} variant="check" />
                ))}
              </View>
            </View>
          )}

          {/* Things to consider */}
          {university.thingsToConsider?.length > 0 && (
            <View style={s.section}>
              <SectionTitle>Things to Consider</SectionTitle>
              <View style={[s.bulletList, s.warnCard]}>
                {university.thingsToConsider.map((item, i) => (
                  <CheckItem key={i} text={item} variant="warn" />
                ))}
              </View>
            </View>
          )}

          {/* FAQ */}
          {university.faq?.length > 0 && (
            <View style={s.section}>
              <SectionTitle>FAQs</SectionTitle>
              <View style={s.faqList}>
                {university.faq.map((item, i) => (
                  <FaqItem key={i} question={item.question} answer={item.answer} />
                ))}
              </View>
            </View>
          )}

          {/* Established + website */}
          {(university.establishedYear || university.officialWebsite) && (
            <View style={s.metaRow}>
              {university.establishedYear && (
                <View style={s.metaItem}>
                  <Ionicons name="calendar-outline" size={13} color={colors.faint} />
                  <Text style={s.metaText}>Est. {university.establishedYear}</Text>
                </View>
              )}
              {university.officialWebsite && (
                <View style={s.metaItem}>
                  <Ionicons name="globe-outline" size={13} color={colors.faint} />
                  <Text style={s.metaText} numberOfLines={1}>{university.officialWebsite.replace(/^https?:\/\//, "")}</Text>
                </View>
              )}
            </View>
          )}

        </View>
      </Animated.ScrollView>

      {/* ── Sticky bottom CTA bar ── */}
      <View style={[s.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
        {Platform.OS === "ios" && (
          <BlurView tint="systemChromeMaterial" intensity={80} style={StyleSheet.absoluteFill} />
        )}
        <View style={s.bottomInner}>
          {/* Call */}
          <Pressable
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); Linking.openURL("tel:+919176162888"); }}
            style={({ pressed }) => [s.counselBtn, pressed && s.counselBtnPressed]}
          >
            <Ionicons name="call" size={19} color={colors.primary} />
          </Pressable>

          {/* Talk to a counsellor */}
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.push({ pathname: "/counselling", params: { universitySlug: university.slug } });
            }}
            style={({ pressed }) => [s.applyBtn, pressed && s.applyBtnPressed]}
          >
            <Ionicons name="chatbubble-ellipses" size={17} color="#fff" />
            <Text style={s.applyLabel}>Talk to a counsellor</Text>
          </Pressable>

          {/* WhatsApp */}
          <Pressable
            onPress={() => { Haptics.selectionAsync(); Linking.openURL("https://wa.me/919176162888?text=Hi%2C+I%27m+interested+in+MBBS+abroad.+Can+you+help+me%3F"); }}
            style={({ pressed }) => [s.counselBtn, pressed && s.counselBtnPressed]}
          >
            <Ionicons name="logo-whatsapp" size={19} color={colors.primary} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

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

  // Loading skeleton
  loadingHero: {
    width: "100%",
    height: 300,
    backgroundColor: colors.line,
  },
  loadingBody: {
    padding: 20,
    gap: 14,
    width: "100%",
  },
  loadingLine: {
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.line,
  },

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
    height: 46,
    borderRadius: 14,
    backgroundColor: colors.primary,
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
