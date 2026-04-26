import Image from "next/image";
import { CountryFlag } from "@/components/site/country-flag";
import { FMGE_DOCTORS } from "../_data";

export function SeminarDoctors() {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-5xl px-4">
        <div className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#c17f3b]">
            Meet the speakers
          </p>
          <h2 className="mt-3 text-3xl font-bold leading-snug text-[#0c1a35] sm:text-4xl">
            FMGE Doctors Coming to Your City
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-7 text-[#5a6270]">
            Real doctors who studied abroad, cleared FMGE, and are now practising in India. They'll answer your questions honestly — not from a brochure.
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:gap-12">
          {FMGE_DOCTORS.map((doctor) => (
            <div
              key={doctor.name}
              className="group overflow-hidden rounded-2xl border border-[#e8d5b7] bg-[#faf6ef] transition-all hover:shadow-lg"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-b from-gray-100 to-gray-200">
                <Image
                  src={doctor.image}
                  alt={doctor.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 500px"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#0c1a35]">{doctor.name}</h3>
                <div className="mt-2 flex items-center gap-2">
                  <CountryFlag
                    countryCode={doctor.countryCode}
                    alt={doctor.country}
                    width={20}
                    height={15}
                    className="shrink-0 rounded-sm"
                  />
                  <span className="text-sm text-[#5a6270]">MBBS from {doctor.country}</span>
                </div>
                <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#c17f3b]/30 bg-[#c17f3b]/10 px-3 py-1.5">
                  <svg
                    className="h-4 w-4 text-[#c17f3b]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-xs font-semibold text-[#c17f3b]">
                    {doctor.credentials}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
