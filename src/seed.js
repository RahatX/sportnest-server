import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { Booking } from "./models/Booking.js";
import { Facility } from "./models/Facility.js";
import { ensureSeedOwner } from "./utils/seedOwner.js";

dotenv.config();

const ownerEmail = "owner@sportnest.com";

const facilities = [
  {
    name: "Apex Indoor Futsal Arena",
    facility_type: "Futsal",
    image: "https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=1200&q=80",
    location: "Dhanmondi, Dhaka",
    price_per_hour: 2400,
    capacity: 18,
    available_slots: ["08:00 AM - 09:00 AM", "06:00 PM - 07:00 PM", "09:00 PM - 10:00 PM"],
    description: "A covered turf arena with bright match lighting, team benches, clean changing rooms and secure parking for evening leagues.",
    owner_email: ownerEmail,
    booking_count: 18
  },
  {
    name: "Summit Tennis Club",
    facility_type: "Tennis",
    image: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=1200&q=80",
    location: "Banani, Dhaka",
    price_per_hour: 1800,
    capacity: 4,
    available_slots: ["07:00 AM - 08:00 AM", "04:00 PM - 05:00 PM", "08:00 PM - 09:00 PM"],
    description: "A professionally maintained hard court with coaching lanes, ball machine access and shaded spectator seating.",
    owner_email: ownerEmail,
    booking_count: 15
  },
  {
    name: "Harbor Basketball Court",
    facility_type: "Basketball",
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80",
    location: "Gulshan, Dhaka",
    price_per_hour: 2200,
    capacity: 20,
    available_slots: ["10:00 AM - 11:00 AM", "05:00 PM - 06:00 PM", "07:00 PM - 08:00 PM"],
    description: "A full-size hardwood court built for pickup games, school tournaments and corporate sports nights.",
    owner_email: ownerEmail,
    booking_count: 13
  },
  {
    name: "Bluewave Swimming Complex",
    facility_type: "Swimming",
    image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80",
    location: "Uttara, Dhaka",
    price_per_hour: 3000,
    capacity: 30,
    available_slots: ["06:00 AM - 07:00 AM", "12:00 PM - 01:00 PM", "06:00 PM - 07:00 PM"],
    description: "A temperature-controlled pool complex with lifeguards, lane dividers, family changing areas and beginner-friendly shallow lanes.",
    owner_email: ownerEmail,
    booking_count: 11
  },
  {
    name: "Metro Badminton Hall",
    facility_type: "Badminton",
    image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1200&q=80",
    location: "Mirpur, Dhaka",
    price_per_hour: 1200,
    capacity: 8,
    available_slots: ["09:00 AM - 10:00 AM", "03:00 PM - 04:00 PM", "08:00 PM - 09:00 PM"],
    description: "Four synthetic courts with high ceilings, quality nets, shoe rental support and reliable ventilation for long rallies.",
    owner_email: ownerEmail,
    booking_count: 9
  },
  {
    name: "Greenfield Cricket Nets",
    facility_type: "Cricket",
    image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=1200&q=80",
    location: "Bashundhara, Dhaka",
    price_per_hour: 1600,
    capacity: 12,
    available_slots: ["07:00 AM - 08:00 AM", "02:00 PM - 03:00 PM", "05:00 PM - 06:00 PM"],
    description: "Practice nets with bowling machine support, turf and matting options, protective screens and room for squad training.",
    owner_email: ownerEmail,
    booking_count: 8
  }
];

async function seed() {
  await connectDB();
  await Promise.all([Booking.deleteMany({}), Facility.deleteMany({})]);
  await ensureSeedOwner();

  await Facility.insertMany(facilities);
  console.log(`Seeded ${facilities.length} facilities. Owner login: ${ownerEmail} / OwnerPass1`);
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
