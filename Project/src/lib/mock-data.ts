// Mock data only — UI prototype for Laravel/MySQL port.
export type EventCategory = "Conference" | "Music" | "Workshop" | "Networking" | "Sports" | "Technology";
export type EventStatus = "Draft" | "Confirmed" | "Cancelled";

export interface EventItem {
  id: string;
  title: string;
  description: string;
  image: string;
  startDate: string;
  endDate: string;
  location: string;
  category: EventCategory;
  capacity: number;
  booked: number;
  price: number;
  status: EventStatus;
  organiser: { name: string; email: string };
}

export const EVENTS: EventItem[] = [
  {
    id: "evt-001",
    title: "TechSummit 2026 — The Future of AI",
    description: "Two days of keynotes, hands-on labs, and networking with leaders shaping the next decade of artificial intelligence.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80",
    startDate: "2026-08-12",
    endDate: "2026-08-13",
    location: "Lahore Expo Centre, Pakistan",
    category: "Technology",
    capacity: 800,
    booked: 612,
    price: 4500,
    status: "Confirmed",
    organiser: { name: "Ali Muhammad", email: "ali@eventhub.com" },
  },
  {
    id: "evt-002",
    title: "Sunset Acoustic Sessions",
    description: "An intimate evening of acoustic performances featuring rising indie artists from across South Asia.",
    image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1200&q=80",
    startDate: "2026-07-20",
    endDate: "2026-07-20",
    location: "Bagh-e-Jinnah, Lahore",
    category: "Music",
    capacity: 300,
    booked: 300,
    price: 2000,
    status: "Confirmed",
    organiser: { name: "Sara Khan", email: "sara@eventhub.com" },
  },
  {
    id: "evt-003",
    title: "Founders Networking Night",
    description: "Connect with founders, investors, and operators over curated conversations and great food.",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&q=80",
    startDate: "2026-07-28",
    endDate: "2026-07-28",
    location: "Arfa Software Technology Park",
    category: "Networking",
    capacity: 150,
    booked: 88,
    price: 0,
    status: "Confirmed",
    organiser: { name: "Ali Muhammad", email: "ali@eventhub.com" },
  },
  {
    id: "evt-004",
    title: "UX Design Bootcamp",
    description: "A weekend intensive on product design, prototyping, and user research with industry mentors.",
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200&q=80",
    startDate: "2026-09-05",
    endDate: "2026-09-06",
    location: "UMT Lahore",
    category: "Workshop",
    capacity: 60,
    booked: 24,
    price: 3500,
    status: "Confirmed",
    organiser: { name: "Hina Raza", email: "hina@eventhub.com" },
  },
  {
    id: "evt-005",
    title: "Cricket Premier Cup — Final",
    description: "Witness the grand final of the regional Premier Cup with live commentary and post-match meetups.",
    image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1200&q=80",
    startDate: "2026-08-25",
    endDate: "2026-08-25",
    location: "Gaddafi Stadium, Lahore",
    category: "Sports",
    capacity: 20000,
    booked: 14200,
    price: 1500,
    status: "Confirmed",
    organiser: { name: "Bilal Ahmed", email: "bilal@eventhub.com" },
  },
  {
    id: "evt-006",
    title: "Marketing Leaders Conference",
    description: "Hear from CMOs and growth leaders on the strategies powering today's fastest-growing brands.",
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&q=80",
    startDate: "2026-10-10",
    endDate: "2026-10-11",
    location: "Pearl Continental, Lahore",
    category: "Conference",
    capacity: 500,
    booked: 180,
    price: 6000,
    status: "Confirmed",
    organiser: { name: "Sara Khan", email: "sara@eventhub.com" },
  },
];

export const BOOKINGS = [
  { id: "b1", reference: "EVT-2026-A1B2C3", eventId: "evt-001", date: "2026-06-02", amount: 4500, status: "Confirmed" },
  { id: "b2", reference: "EVT-2026-D4E5F6", eventId: "evt-003", date: "2026-06-04", amount: 0, status: "Confirmed" },
  { id: "b3", reference: "EVT-2026-G7H8I9", eventId: "evt-004", date: "2026-06-08", amount: 3500, status: "Pending" },
];

export const PENDING_ORGANISERS = [
  { id: "u1", name: "Ayesha Malik", email: "ayesha@example.com", date: "2026-06-15" },
  { id: "u2", name: "Usman Tariq", email: "usman@example.com", date: "2026-06-14" },
  { id: "u3", name: "Maria Saeed", email: "maria@example.com", date: "2026-06-12" },
];

export const ALL_USERS = [
  { id: "u10", name: "Ali Muhammad", email: "ali@eventhub.com", role: "Admin" },
  { id: "u11", name: "Sara Khan", email: "sara@eventhub.com", role: "Organiser" },
  { id: "u12", name: "Hina Raza", email: "hina@eventhub.com", role: "Organiser" },
  { id: "u13", name: "Bilal Ahmed", email: "bilal@eventhub.com", role: "Attendee" },
  { id: "u14", name: "Zara Sheikh", email: "zara@eventhub.com", role: "Attendee" },
];

export const CONTACT_MESSAGES = [
  { id: "m1", name: "Omar Farooq", email: "omar@example.com", subject: "Partnership inquiry", message: "We'd love to partner for an upcoming summit.", status: "Unread" },
  { id: "m2", name: "Nida Iqbal", email: "nida@example.com", subject: "Refund question", message: "How do I request a refund for a cancelled event?", status: "Read" },
  { id: "m3", name: "Faisal Shah", email: "faisal@example.com", subject: "Organiser approval", message: "Can you expedite my organiser approval?", status: "Unread" },
];

export const TESTIMONIALS = [
  { name: "Ayesha Khan", role: "Event Organiser", avatar: "https://i.pravatar.cc/120?img=47", rating: 5, quote: "EventHub made it effortless to launch our tech summit. The dashboard saves us hours every week." },
  { name: "Usman Raza", role: "Attendee", avatar: "https://i.pravatar.cc/120?img=12", rating: 5, quote: "Booking tickets feels instant and the event pages are beautiful. Best platform I've used in Pakistan." },
  { name: "Maria Saeed", role: "Marketing Lead", avatar: "https://i.pravatar.cc/120?img=32", rating: 4, quote: "We sold out our last conference in 48 hours. The analytics gave us everything we needed." },
];
