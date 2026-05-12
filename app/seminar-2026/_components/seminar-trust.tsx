import { ShieldCheck, UserCheck, GraduationCap, Clock } from "lucide-react";

const TRUST_POINTS = [
  {
    icon: UserCheck,
    stat: "5 Countries",
    label: "Doctors & representatives from Russia, Georgia, Kyrgyzstan, Uzbekistan, and Vietnam",
  },
  {
    icon: GraduationCap,
    stat: "FMGE Cleared",
    label: "Every doctor at the event has cleared FMGE and is registered with NMC",
  },
  {
    icon: ShieldCheck,
    stat: "No Sales Pitch",
    label: "This is peer guidance — doctors share their experience, not a consultancy script",
  },
  {
    icon: Clock,
    stat: "2–3 Hours",
    label: "Enough time for open Q&A, one-on-one conversations, and real clarity",
  },
] as const;

export function SeminarTrust() {
  const colors = [
    { bg: "bg-red-50", icon: "text-red-600" },
    { bg: "bg-yellow-50", icon: "text-yellow-600" },
    { bg: "bg-green-50", icon: "text-green-600" },
    { bg: "bg-red-50", icon: "text-red-600" },
  ];

  return (
    <section className="border-b border-gray-200 bg-white py-12">
      <div className="mx-auto max-w-5xl px-4">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {TRUST_POINTS.map(({ icon: Icon, stat, label }, index) => (
            <div key={stat} className="flex flex-col gap-3">
              <div className={`flex size-10 items-center justify-center rounded-xl ${colors[index].bg}`}>
                <Icon className={`size-5 ${colors[index].icon}`} />
              </div>
              <div>
                <div className="text-base font-bold text-gray-900">{stat}</div>
                <p className="mt-1 text-sm leading-5 text-gray-600">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
