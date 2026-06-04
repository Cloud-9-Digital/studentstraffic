export type Author = {
  slug: string;
  name: string;
  initials: string;
  title: string;
  bio: string;
  promise: string;
  longBio: string[];
  avatarUrl?: string;
};

const AUTHORS = {
  "bharat-vasireddy": {
    slug: "bharat-vasireddy",
    name: "Bharat Vasireddy",
    initials: "BV",
    title: "Co-Founder, Students Traffic",
    bio: "Bharat co-founded Students Traffic with a single conviction: every Indian student deserves honest, unbiased guidance for MBBS abroad — not a sales pitch.",
    promise: "I personally ensure every student who reaches out to us gets the truth about a university, not what an agent wants them to hear. My commitment doesn't end at admission — I stay connected with students through their entire journey.",
    longBio: [
      "Bharat started Students Traffic after watching too many Indian students get misled by consultancies that earned commissions from universities. He had seen families make six-figure decisions based on brochures, fake reviews, and agents who disappeared the moment the fees were paid. He decided to build something different — a platform where the information is verified, the advice is free from commission bias, and the team actually cares what happens after a student boards the flight.",
      "Over five years, Bharat has personally researched and verified hundreds of universities across Russia, Georgia, Kyrgyzstan, Uzbekistan, Vietnam, and the Philippines. He has visited campuses, spoken with Indian student unions, cross-checked data against NMC and WHO directories, and dug through ministry records to verify what universities claim about themselves. If a university has an issue, he would rather tell a student and lose the click than stay quiet and damage someone's future.",
      "Before Students Traffic, Bharat worked in digital product development — which is why the platform is built the way it is. He believes the best guidance is the kind that empowers students to make their own informed decision, not one that steers them toward whichever university pays the highest referral fee.",
    ],
  },
  yamini: {
    slug: "yamini",
    name: "Yamini",
    initials: "YM",
    title: "Content Specialist, Students Traffic",
    bio: "Yamini writes for students, not for search engines. Every guide she produces is built around the questions real students ask before taking one of the biggest decisions of their lives.",
    promise: "I write every piece of content thinking about a student sitting at home, scared and confused, trying to figure out if a university is actually good for them. If my words help even one family make a confident, informed choice, that's what matters.",
    longBio: [
      "Yamini joined Students Traffic because she believed in what it was trying to do. There were plenty of websites about MBBS abroad — most of them recycling the same marketing copy universities hand out. She wanted to write content that was actually useful: the kind that tells you what the hostel food is really like, what Indian students actually think of the campus after Year 2, and whether the city is safe for a teenager living away from home for the first time.",
      "She spends a significant amount of her time talking directly to Indian students who are already studying abroad — asking them the questions that prospective students are too shy or too far removed to ask themselves. That on-ground insight shapes everything she writes at Students Traffic, from city guides and student life sections to FAQ pages and hostel breakdowns.",
      "Yamini believes that transparent, plainly written content is a form of student support. She avoids jargon, never writes to make a university look better than it is, and always flags gaps in available information rather than papering over them. If something isn't verified, she says so.",
    ],
  },
  "vijaya-raghavan": {
    slug: "vijaya-raghavan",
    name: "Vijaya Raghavan",
    initials: "VR",
    title: "Co-Founder & MD, Students Traffic",
    bio: "With 15+ years in the education sector, Vijaya Raghavan co-founded Students Traffic to give Indian students a genuinely reliable path through the maze of medical education abroad — one built on real data, honest advice, and long-term student outcomes.",
    promise: "Every student who comes to us deserves more than a brochure and a fee quote. My 15 years in education have shown me that families make better decisions when they have the full picture — not the version that suits an agent's commission. That is the standard I hold this platform to.",
    longBio: [
      "Vijaya Raghavan has spent more than 15 years working across the education sector — from student counselling and curriculum development to institutional partnerships and outcomes research. That depth of experience is what he brought to Students Traffic when he co-founded the platform with a clear goal: to make overseas medical education navigable, honest, and genuinely useful for Indian families.",
      "He has seen first-hand how the lack of reliable information damages students' futures. Families spend their savings on MBBS seats at universities with weak NMC standing, poor clinical training, and no India-return support — often because they trusted the wrong source. Vijaya built Students Traffic's advisory framework around reversing that dynamic: independent verification before recommendation, transparent fee structures, and guidance that holds up five years after a student enrols.",
      "His focus at Students Traffic is on the decisions that shape a student's entire career — country selection, university shortlisting, NExT readiness, and the transition back to India after graduation. He works closely with the team to ensure that every major guide published on the platform reflects not just current data, but the kind of considered judgement that only comes with years of watching students navigate these systems.",
    ],
  },
  "rajendra-kumar-deepak": {
    slug: "rajendra-kumar-deepak",
    name: "Rajendra Kumar Deepak",
    initials: "RD",
    title: "Advisor, Students Traffic",
    bio: "Rajendra Kumar Deepak brings over 15 years of experience guiding students and families through some of the most consequential decisions of their lives — where to study, which university to trust, and how to build a medical career that lasts.",
    promise: "I have spent 15 years watching students get it right and get it wrong. The difference is almost always the quality of information they had at the start. Every resource on this platform exists to close that gap — and I take that responsibility personally.",
    longBio: [
      "Rajendra Kumar Deepak brings more than 15 years of hands-on experience in student advisory, institutional relations, and overseas education to his role as Advisor at Students Traffic. He has spent the better part of his career working directly with students and their families at the moment they need clarity most — when they are choosing a path that will define the next decade of their lives.",
      "His background spans admissions consulting, university partnership development, and pre-departure student support across multiple countries. He has worked with medical universities in Russia, Georgia, Kyrgyzstan, and Vietnam, giving him an unusually detailed understanding of what the on-ground experience actually looks like for Indian students — beyond what any brochure or agent will tell you. That insider knowledge informs every piece of guidance Students Traffic publishes.",
      "At Students Traffic, Rajendra oversees the practical, process-oriented content that students rely on most: fee structures, admission timelines, visa documentation, hostel realities, and what returning to India after six years abroad actually involves. He believes that a student who understands the process from day one is a student who finishes the degree, clears NExT, and builds a real career — and that is what every guide he contributes to is designed to deliver.",
    ],
  },
} as const satisfies Record<string, Author>;

export type AuthorSlug = keyof typeof AUTHORS;

export function getAuthor(slug: AuthorSlug): Author {
  return AUTHORS[slug];
}

export function getAllAuthors(): Author[] {
  return Object.values(AUTHORS);
}

export function isValidAuthorSlug(slug: string): slug is AuthorSlug {
  return slug in AUTHORS;
}
