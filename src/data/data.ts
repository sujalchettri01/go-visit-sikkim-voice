import type {
  Destination,
  Activity,
  Accommodation,
  CultureItem,
  Testimonial,
  TravelTip,
  EmergencyContact,
  GalleryImage,
} from "./types";

export const destinations: Destination[] = [
  {
    id: "gangtok",
    name: "Gangtok",
    description:
      "The vibrant capital city nestled in the Eastern Himalayas with modern amenities and traditional charm",
    image: "https://images.pexels.com/photos/14916663/pexels-photo-14916663.jpeg",
    duration: "2-3 days",
    difficulty: "Easy",
    suitableFor: "All Ages",
    highlights: ["MG Marg", "Rumtek Monastery", "Tsomgo Lake"],
    link: "#gangtok",
  },
  {
    id: "nathula-pass",
    name: "Nathula Pass",
    description:
      "Historic mountain pass on the Indo-China border offering breathtaking high-altitude views",
    image: "https://media.istockphoto.com/id/2154423340/photo/india-gangtok-india-china-border-december-2023-tourist-at-view-of-nathula-pass-entrance-gate.jpg?s=2048x2048&w=is&k=20&c=99ygf0K20JLqZ_cyyRDaMz_KduibMxgTmL8ml6K55fM=",
    duration: "1 day",
    difficulty: "Moderate",
    suitableFor: "All Ages",
    highlights: ["Border View", "Snow Mountains", "War Memorial"],
    link: "#nathula",
  },
  {
    id: "yuksom",
    name: "Yuksom",
    description:
      "The first capital of Sikkim and gateway to Kanchenjunga, perfect for trekking adventures",
    image: "https://i0.wp.com/stampedmoments.com/wp-content/uploads/2024/06/landscape-yuksom.jpg?fit=800%2C600&ssl=1",
    duration: "2-4 days",
    difficulty: "Challenging",
    suitableFor: "All Ages",
    highlights: [
      "Kanchenjunga Trek",
      "Coronation Throne",
      "Ancient Monasteries",
    ],
    link: "#yuksom",
  },
  {
    id: "pelling",
    name: "Pelling",
    description:
      "Scenic hill station with panoramic views of Kanchenjunga and ancient monasteries",
    image: "https://media-cdn.tripadvisor.com/media/attractions-splice-spp-674x446/0b/22/85/cd.jpg",
    duration: "2-3 days",
    difficulty: "Easy",
    suitableFor: "All Ages",
    highlights: ["Kanchenjunga View", "Pemayangtse Monastery", "Skywalk"],
    link: "#pelling",
  },
  {
    id: "lachung",
    name: "Lachung",
    description:
      "Picturesque mountain village gateway to Yumthang Valley and Zero Point",
    image: "https://sikkimtourism.org/wp-content/uploads/2022/04/Lachung-e1653463465649.jpg",
    duration: "2-3 days",
    difficulty: "Moderate",
    suitableFor: "All Ages",
    highlights: ["Yumthang Valley", "Zero Point", "Hot Springs"],
    link: "#lachung",
  },
  {
    id: "namchi",
    name: "Namchi",
    description:
      "Cultural hub featuring the world's largest statue of Guru Padmasambhava",
    image: "https://www.naturetravelagency.com/uploads/1714050753char%20dham%20namchi%20south%20sikkim.jpg",
    duration: "1-2 days",
    difficulty: "Easy",
    suitableFor: "All Ages",
    highlights: ["Char Dham", "Samdruptse Hill", "Rock Garden"],
    link: "#namchi",
  },
];

export const activities: Activity[] = [
  {
    id: "trekking",
    name: "Trekking & Hiking",
    description:
      "Explore pristine trails through rhododendron forests and alpine meadows",
    image: "https://media1.thrillophilia.com/filestore/8c4endyet4gv16wx0d1otkevk90l_pexels-saikat-ghosh-914128.jpg?w=400&dpr=2",
    difficulty: "All Levels",
    actionLabel: "Book Experience",
  },
  {
    id: "photography",
    name: "Photography Tours",
    description: "Capture stunning landscapes, wildlife, and cultural heritage",
    image: "https://i.pinimg.com/736x/3a/7d/4f/3a7d4fd91a21ee91d3d24ee3db248ef0.jpg",
    difficulty: "Beginner",
    actionLabel: "Book Experience",
  },
  {
    id: "rafting",
    name: "River Rafting",
    description: "Navigate thrilling rapids on Teesta and Rangit rivers",
    image: "https://media2.thrillophilia.com/images/photos/000/119/629/original/1509609792_IMG_5502.JPG?w=753&h=450&dpr=1.5",
    difficulty: "Intermediate",
    actionLabel: "Book Experience",
  },
  {
    id: "wildlife",
    name: "Wildlife Safari",
    description:
      "Spot red pandas, snow leopards, and exotic birds in national parks",
    image: "https://wanderon-images.gumlet.io/blogs/new/2024/08/yak-safari-in-sikkim.jpg",
    difficulty: "Easy",
    actionLabel: "Book Experience",
  },
  {
    id: "cultural",
    name: "Cultural Tours",
    description: "Visit ancient monasteries and experience local traditions",
    image: "https://www.esikkimtourism.in/wp-content/uploads/2019/04/serdupcholingmonaster.jpg",
    difficulty: "Easy",
    actionLabel: "Book Experience",
  },
  {
    id: "wellness",
    name: "Wellness Retreats",
    description: "Rejuvenate with yoga, meditation, and natural hot springs",
    image: "https://bookretreats.com/cdn-cgi/image/width=1200,quality=65,f=auto,sharpen=1,fit=cover,gravity=auto/assets/photo/retreat/0m/57k/57276/p_2219002/1000_1758521933.jpg",
    difficulty: "All Levels",
    actionLabel: "Book Experience",
  },
];

export const accommodations: Accommodation[] = [
  {
    id: "himalayan-heritage",
    name: "Himalayan Heritage Resort",
    location: "Gangtok",
    description:
      "Experience luxury with panoramic Himalayan views and traditional Sikkimese hospitality",
    image: "https://cdn.tajhotels.com/images/ocl5w36p/prod5/6ac788861251a2f3c32377cec37c8be8bad31c3c-3840x1860.jpg",
    type: "Luxury Resort",
    rating: 4.8,
    pricePerNight: 8500,
    amenities: ["Mountain View", "Spa", "Restaurant", "WiFi"],
  },
  {
    id: "monastery-view",
    name: "Monastery View Homestay",
    location: "Pelling",
    description:
      "Stay with local families and experience authentic Sikkimese culture and cuisine",
    image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/86/58/d5/hotel-mount-siniolchu.jpg?w=900&h=-1&s=1",
    type: "Homestay",
    rating: 4.6,
    pricePerNight: 2500,
    amenities: ["Home Cooked Meals", "Cultural Experience", "Garden", "WiFi"],
  },
  {
    id: "alpine-adventure",
    name: "Alpine Adventure Lodge",
    location: "Lachung",
    description:
      "Perfect base for high-altitude adventures with cozy mountain lodge atmosphere",
    image: "https://adventurebuddy.com/wp-content/uploads/2025/03/cropped-image0-scaled-1.jpeg",
    type: "Adventure Lodge",
    rating: 4.7,
    pricePerNight: 4200,
    amenities: ["Trekking Base", "Bonfire", "Local Cuisine", "Parking"],
  },
  {
    id: "eco-valley",
    name: "Eco Valley Resort",
    location: "Yuksom",
    description:
      "Sustainable luxury in pristine natural surroundings with minimal environmental impact",
    image: "https://q-xx.bstatic.com/xdata/images/hotel/max500/400727402.jpg?k=37f6760f428f8fd796b410406a784c8574a1d158d3a14323152cb5daec0c1f56&o=",
    type: "Eco Resort",
    rating: 4.5,
    pricePerNight: 3800,
    amenities: ["Eco-Friendly", "Organic Food", "Nature Walks", "Solar Power"],
  },
  {
    id: "budget-backpacker",
    name: "Budget Backpacker Hostel",
    location: "Gangtok",
    description:
      "Clean, safe, and affordable accommodation perfect for budget travelers and backpackers",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsWWrjWYllR9LK0th8-GE8pqhAdSrm3zo7hQ&s",
    type: "Hostel",
    rating: 4.2,
    pricePerNight: 800,
    amenities: ["Shared Kitchen", "Common Area", "Laundry", "WiFi"],
  },
  {
    id: "heritage-palace",
    name: "Heritage Palace Hotel",
    location: "Namchi",
    description:
      "Stay in a restored palace with royal treatment and immersive cultural experiences",
    image: "https://www.theleela.com/prod/content/assets/aio-banner/dekstop/The-Leela-Sikkim.jpg?VersionId=DE80m_g1AumzhaAkxoWw.sb.zkH.bRmX",
    type: "Heritage Hotel",
    rating: 4.4,
    pricePerNight: 6500,
    amenities: [
      "Heritage Architecture",
      "Cultural Shows",
      "Fine Dining",
      "Concierge",
    ],
  },
];

export const cultureItems: CultureItem[] = [
  {
    id: "monasteries",
    title: "Buddhist Monasteries",
    description:
      "Ancient monasteries perched on hilltops, offering spiritual serenity and architectural marvels with centuries of history",
    image: "https://seawatersports.com/images/places/ranka-monastery.png",
    icon: "🛕",
  },
  {
    id: "festivals",
    title: "Traditional Festivals",
    description:
      "Vibrant celebrations like Losar and Saga Dawa that showcase rich Tibetan and Nepali heritage with colorful costumes",
    image: "https://clubmahindra.gumlet.io/blog/images/Losar-Festival-in-Sikkim-resized.jpg?w=376&dpr=2.6",
    icon: "🎭",
  },
  {
    id: "cuisine",
    title: "Local Cuisine",
    description:
      "Authentic flavors of momos, thukpa, and gundruk that reflect the region's diverse cultural influences and mountain ingredients",
    image: "https://www.honeymoonbug.com/blog/wp-content/uploads/2022/10/Dhindo-sikkim.jpg",
    icon: "🍜",
  },
  {
    id: "handicrafts",
    title: "Handicrafts & Arts",
    description:
      "Exquisite handwoven textiles, traditional carpets, and intricate wood carvings that preserve ancient artistic traditions",
    image: "https://shilpkarindicraft.wordpress.com/wp-content/uploads/2018/09/8a775-traditional2bthangka2bpaintings2bof2bsikkim.jpg",
    icon: "🎨",
  },
  {
    id: "rituals",
    title: "Sacred Rituals",
    description:
      "Spiritual ceremonies and prayer rituals that connect the community with nature and Buddhist teachings",
    image: "https://travelogyindia.b-cdn.net/storage/app/upload/saga-dawa-festival.jpg",
    icon: "🙏",
  },
  {
    id: "music-dance",
    title: "Folk Music & Dance",
    description:
      "Traditional performances featuring ancient instruments and storytelling through graceful movements and melodies",
    image: "https://tripexplore.travel.blog/wp-content/uploads/2021/01/yak-chaam-dance.jpg?w=720",
    icon: "🎵",
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "Ashish Das",
    name: "Ashish Das",
    location: "Guwahati , Assam",
    image: "",
    rating: 5,
    experience: "Goecha La Trek",
    comment:
      "Sikkim exceeded all my expectations! The mountain views were breathtaking, and the local people were incredibly welcoming. The trek to Goecha La was the highlight of my trip.",
  },
  {
    id: "raj",
    name: "Raj Patel",
    location: "Mumbai, India",
    image: "",
    rating: 5,
    experience: "Photography Tour",
    comment:
      "As a photography enthusiast, Sikkim was paradise. Every corner offered a new perspective, from the monasteries to the rhododendron forests. Absolutely magical!",
  },
  {
    id: "Abi Chettri",
    name: "Abi Chettri",
    location: "kathmandu Nepal",
    image: "",
    rating: 5,
    experience: "Cultural Homestay",
    comment:
      "The cultural immersion was incredible. Staying in a homestay in Pelling gave us authentic insights into Sikkimese life. The food was amazing too!",
  },
  {
    id: "Saumya Chaudhary",
    name: "Saumya Chaudhary",
    location: "Kolkata",
    image: "",
    rating: 5,
    experience: "Adventure Package",
    comment:
      "Perfect blend of adventure and tranquility. The river rafting was thrilling, and the monastery visits were so peaceful. Sikkim has something for everyone.",
  },
  {
    id: "Seedorf Rai",
    name: "Seedorf Rai",
    location: "Dharan Nepal",
    image: "",
    rating: 5,
    experience: "Wildlife Safari",
    comment:
      "The biodiversity in Sikkim is incredible! We spotted red pandas and so many bird species. The guides were knowledgeable and passionate about conservation.",
  },
  {
    id: "Eros",
    name: "Eros",
    location: "Siliguri",
    image: "",
    rating: 5,
    experience: "Scenic Tour",
    comment:
      "Sikkim's natural beauty is unmatched. The sunrise from Tiger Hill and the serenity of Tsomgo Lake will stay with me forever. Can't wait to return!",
  },
];

export const travelTips: TravelTip[] = [
  {
    id: "best-time",
    title: "Best Time to Visit",
    description:
      "March to May and October to December offer clear skies and pleasant weather. Avoid monsoons (June-September).",
    icon: "",
  },
  {
    id: "weather",
    title: "Weather & Climate",
    description:
      "Pack layers! Temperatures vary greatly with altitude. Carry warm clothes even in summer for high-altitude areas.",
    icon: "",
  },
  {
    id: "packing",
    title: "What to Pack",
    description:
      "Sturdy trekking shoes, warm clothing, rain gear, sunscreen, first aid kit, and portable charger are essentials.",
    icon: "",
  },
  {
    id: "permits",
    title: "Permits & Documents",
    description:
      "Inner Line Permit required for non-Sikkimese Indians. Foreign tourists need Protected Area Permit. Carry ID proofs.",
    icon: "",
  },
  {
    id: "transport",
    title: "Getting Around",
    description:
      "Shared taxis are common. Book vehicles in advance for remote areas. Roads can be challenging during monsoons.",
    icon: "",
  },
  {
    id: "health",
    title: "Health & Safety",
    description:
      "Acclimatize gradually to high altitudes. Carry altitude sickness medication. Stay hydrated and avoid alcohol initially.",
    icon: "",
  },
];

export const emergencyContacts: EmergencyContact[] = [
  { service: "Tourist Helpline", number: "1363" },
  { service: "Police", number: "100" },
  { service: "Medical Emergency", number: "108" },
  { service: "Fire Service", number: "101" },
];

export const localEtiquette: string[] = [
  "Respect local customs and traditions",
  "Remove shoes before entering monasteries",
  "Don't point feet towards Buddha statues",
  "Ask permission before photographing people",
];

export const galleryImages: GalleryImage[] = [
  {
    id: "kanchenjunga-sunrise",
    title: "Kanchenjunga at Sunrise",
    location: "Pelling",
    image: "https://img.myloview.com/stickers/kangchenjunga-close-up-view-from-pelling-in-sikkim-india-700-215215459.jpg",
    category: "Landscapes",
    likes: 342,
    views: 1250,
  },
  {
    id: "prayer-ceremony",
    title: "Prayer Ceremony",
    location: "Rumtek Monastery",
    image: "https://images.newsarenaindia.com//sikkim-monksjpg_1738572999795.jpg",
    category: "Culture",
    likes: 287,
    views: 980,
  },
  {
    id: "red-panda",
    title: "Red Panda",
    location: "Khangchendzonga National Park",
    image: "https://res.cloudinary.com/roundglass/image/upload/v1629364404/rg/collective/media/x80t61pvukxo46eeokhr.jpg",
    category: "Wildlife",
    likes: 456,
    views: 1890,
  },
  {
    id: "river-rafting",
    title: "River Rafting",
    location: "Teesta River",
    image: "https://media1.thrillophilia.com/filestore/phhsf70sao0nwrldpeyxx1yq2mgm_1583483790_1513345568_brahmaputra-river-rafting.jpg.jpg",
    category: "Adventure",
    likes: 198,
    views: 756,
  },
  {
    id: "yumthang-valley",
    title: "Valley of Flowers",
    location: "Yumthang",
    image: "https://hblimg.mmtcdn.com/content/hubble/img/yumthanvalley/mmt/activities/m_Yumthang%20Valley_Sikkim_1_l_408_640.jpg",
    category: "Landscapes",
    likes: 523,
    views: 2134,
  },
  {
    id: "traditional-dance",
    title: "Traditional Dance",
    location: "Gangtok",
    image: "https://www.windhorsetours.com/wp-content/uploads/2014/11/Sikkim-festival-Mask-sance.jpg",
    category: "Culture",
    likes: 312,
    views: 1045,
  },
  {
    id: "snow-leopard",
    title: "Snow Leopard",
    location: "High Altitude",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbvAqaJaM0au5TtzizdxFbt9FvJ0KRAecwqA&s",
    category: "Wildlife",
    likes: 678,
    views: 2890,
  },
  {
    id: "mountain-trekking",
    title: "Mountain Trekking",
    location: "Goecha La",
    image: "https://trekthehimalayas.com/images/HomePageImages/Desktop/7d187666-dfc4-4063-8549-c9c8081b392a_Goechala-Day-6.webp",
    category: "Adventure",
    likes: 234,
    views: 890,
  },
  {
    id: "tsomgo-lake",
    title: "Sacred Lake",
    location: "Tsomgo Lake",
    image: "https://travelsetu.com/apps/uploads/new_destinations_photos/destination/2023/12/12/f09dff586c1bc6922554274fb5a451db_1000x1000.jpg",
    category: "Landscapes",
    likes: 445,
    views: 1678,
  },
];
