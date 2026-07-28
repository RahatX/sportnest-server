import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import { Facility } from "./models/Facility.js";
import { ensureSeedOwner } from "./utils/seedOwner.js";

dotenv.config();

const ownerEmail = "owner@sportnest.com";
const targetPerType = 51;

const prefixes = [
  "Apex",
  "Beacon",
  "Capital",
  "Central",
  "Champion",
  "Cityside",
  "Crest",
  "Crown",
  "Delta",
  "Dynamic",
  "Eastern",
  "Elite",
  "Evergreen",
  "Falcon",
  "Fusion",
  "Golden",
  "Grand",
  "Harbor",
  "Heritage",
  "Horizon",
  "Landmark",
  "Legacy",
  "Metro",
  "Momentum",
  "Northgate",
  "Nova",
  "Olympic",
  "Paramount",
  "Peak",
  "Pioneer",
  "Premier",
  "Prime",
  "ProActive",
  "Pulse",
  "Riverside",
  "Royal",
  "Skyline",
  "Southgate",
  "Summit",
  "Sunrise",
  "Titan",
  "Unity",
  "Urban",
  "Victory",
  "Westfield",
  "Zenith",
  "NextGen",
  "Elevate",
  "Greenfield",
  "Lakeview",
  "Redline",
  "Bluewave",
  "IronCore",
  "Serenity",
  "Sterling",
  "Frontier",
  "Junction",
  "Keystone",
  "Meridian",
  "Parkside"
];

const locations = [
  "Banani, Dhaka",
  "Dhanmondi, Dhaka",
  "Gulshan 1, Dhaka",
  "Gulshan 2, Dhaka",
  "Uttara Sector 4, Dhaka",
  "Uttara Sector 7, Dhaka",
  "Bashundhara, Dhaka",
  "Mirpur 1, Dhaka",
  "Mirpur 10, Dhaka",
  "Mohammadpur, Dhaka",
  "Badda, Dhaka",
  "Rampura, Dhaka",
  "Tejgaon, Dhaka",
  "Khilgaon, Dhaka",
  "Wari, Dhaka",
  "Lalmatia, Dhaka",
  "Baridhara, Dhaka",
  "Aftabnagar, Dhaka",
  "Motijheel, Dhaka",
  "Nikunja, Dhaka",
  "Purbachal, Dhaka",
  "Farmgate, Dhaka",
  "Shyamoli, Dhaka",
  "Agargaon, Dhaka",
  "Cantonment, Dhaka",
  "Keraniganj, Dhaka",
  "Savar, Dhaka",
  "Narayanganj",
  "Tongi, Gazipur",
  "Jatrabari, Dhaka"
];

const slotGroups = [
  ["06:00 AM - 07:00 AM", "04:00 PM - 05:00 PM", "08:00 PM - 09:00 PM"],
  ["07:00 AM - 08:00 AM", "05:00 PM - 06:00 PM", "09:00 PM - 10:00 PM"],
  ["08:00 AM - 09:00 AM", "03:00 PM - 04:00 PM", "07:00 PM - 08:00 PM"],
  ["09:00 AM - 10:00 AM", "02:00 PM - 03:00 PM", "06:00 PM - 07:00 PM"],
  ["10:00 AM - 11:00 AM", "01:00 PM - 02:00 PM", "08:30 PM - 09:30 PM"]
];

const sportConfigs = [
  {
    type: "Futsal",
    nameSuffix: "Futsal Arena",
    images: [
      "https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=1200&q=80"
    ],
    basePrice: 1800,
    baseCapacity: 12,
    description:
      "A covered futsal arena with quality turf, bright match lighting, team benches, changing rooms and secure parking."
  },
  {
    type: "Football",
    nameSuffix: "Football Ground",
    images: [
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=1200&q=80"
    ],
    basePrice: 2200,
    baseCapacity: 18,
    description:
      "A match-ready football ground with maintained turf, floodlights, team benches, changing areas and equipment storage."
  },
  {
    type: "Basketball",
    nameSuffix: "Basketball Court",
    images: [
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=1200&q=80"
    ],
    basePrice: 1700,
    baseCapacity: 16,
    description:
      "A full-size basketball court with reliable flooring, regulation hoops, bright lighting, team seating and spectator space."
  },
  {
    type: "Tennis",
    nameSuffix: "Tennis Club",
    images: [
      "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=1200&q=80"
    ],
    basePrice: 1400,
    baseCapacity: 4,
    description:
      "A professionally maintained tennis court with quality nets, coaching space, shaded seating and evening lighting."
  },
  {
    type: "Cricket",
    nameSuffix: "Cricket Academy",
    images: [
      "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?auto=format&fit=crop&w=1200&q=80"
    ],
    basePrice: 1500,
    baseCapacity: 14,
    description:
      "A focused cricket training venue with protected nets, turf and matting options, bowling support and room for squad drills."
  },
  {
    type: "Badminton",
    nameSuffix: "Badminton Hall",
    images: [
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1200&q=80"
    ],
    basePrice: 900,
    baseCapacity: 8,
    description:
      "A high-ceiling badminton hall with synthetic courts, quality nets, clear lighting, ventilation and comfortable player seating."
  },
  {
    type: "Swimming",
    nameSuffix: "Aquatic Center",
    images: [
      "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560089000-7433a4ebbd64?auto=format&fit=crop&w=1200&q=80"
    ],
    basePrice: 2000,
    baseCapacity: 24,
    description:
      "A clean aquatic center with marked lanes, trained lifeguards, family changing areas and beginner-friendly practice space."
  },
  {
    type: "Volleyball",
    nameSuffix: "Volleyball Arena",
    images: [
      "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1592656094267-764a45160876?auto=format&fit=crop&w=1200&q=80"
    ],
    basePrice: 1300,
    baseCapacity: 12,
    description:
      "A competition-ready volleyball court with quality flooring, adjustable nets, overhead lighting, changing rooms and spectator seating."
  },
  {
    type: "Yoga",
    nameSuffix: "Yoga Studio",
    images: [
      "https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80"
    ],
    basePrice: 800,
    baseCapacity: 14,
    description:
      "A peaceful yoga studio with natural light, premium mats, climate control, mirrored practice walls and changing facilities."
  },
  {
    type: "Gym",
    nameSuffix: "Fitness Center",
    images: [
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80"
    ],
    basePrice: 1100,
    baseCapacity: 24,
    description:
      "A fully equipped fitness center with free weights, strength machines, cardio stations, locker rooms and attentive trainers."
  }
];

function buildFacility(config, prefix, index) {
  return {
    name: `${prefix} ${config.nameSuffix}`,
    facility_type: config.type,
    image: config.images[index % config.images.length],
    location: locations[index % locations.length],
    price_per_hour: config.basePrice + (index % 9) * 100,
    capacity: config.baseCapacity + (index % 6) * 2,
    available_slots: slotGroups[index % slotGroups.length],
    description: config.description,
    owner_email: ownerEmail,
    booking_count: 0
  };
}

async function seedAllFacilities() {
  await connectDB();
  await ensureSeedOwner();

  for (const config of sportConfigs) {
    const existingFacilities = await Facility.find({ facility_type: config.type })
      .select("name")
      .lean();
    const missingCount = Math.max(0, targetPerType - existingFacilities.length);
    const existingNames = new Set(existingFacilities.map((facility) => facility.name));
    const candidates = prefixes
      .map((prefix, index) => buildFacility(config, prefix, index))
      .filter((facility) => !existingNames.has(facility.name));
    const facilitiesToInsert = candidates.slice(0, missingCount);

    if (facilitiesToInsert.length < missingCount) {
      throw new Error(`Not enough unique ${config.type} facilities to reach ${targetPerType}.`);
    }

    if (facilitiesToInsert.length > 0) {
      await Facility.insertMany(facilitiesToInsert);
    }

    const total = await Facility.countDocuments({ facility_type: config.type });
    console.log(`${config.type}: added ${facilitiesToInsert.length}, total ${total}`);
  }
}

seedAllFacilities()
  .catch((error) => {
    console.error("All-sports facility seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
