"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  Sparkles,
  MapPin,
  Clock,
  PhoneCall,
  Calendar,
  UtensilsCrossed,
  Truck,
  Play,
  Pause,
  X,
  Volume2,
  VolumeX,
  Star,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Flame,
} from "lucide-react";

interface PinterestAnimatedShowcaseProps {
  isOpenVideoModal?: boolean;
  onOpenVideoModal?: () => void;
  onCloseVideoModal?: () => void;
}

export function PinterestAnimatedShowcase({
  isOpenVideoModal = false,
  onOpenVideoModal,
  onCloseVideoModal,
}: PinterestAnimatedShowcaseProps) {
  // Video Modal State
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  // Table reservation form state
  const [reservation, setReservation] = useState({
    name: "",
    persons: "2 Persons",
    timing: "19:00",
    date: "",
  });
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // Testimonials state
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const testimonials = [
    {
      author: "ANGELA M.",
      rating: 5,
      comment:
        "I had dinner at this incredible place yesterday and was delighted. The interior is magnificent, everything is very stylish and consistent. The staff is responsive and attentive. We will come back again and again.",
    },
    {
      author: "MARIA S.",
      rating: 5,
      comment:
        "I really love this place. It is cozy, stylish, and most importantly, very tasty. I really like natural herbs and organic spices in dishes, as well as delicious cocktails and hand-rolled pasta.",
    },
    {
      author: "ANDREW K.",
      rating: 5,
      comment:
        "There was pleasant music playing in the background and all the staff were very friendly. Service, food, drinks, desserts and atmosphere—everything you can dream of here.",
    },
    {
      author: "MONICA R.",
      rating: 5,
      comment:
        "Excellent location! The whole family had dinner and everyone was pleased. Very cosy atmosphere and indescribable emotions of dinner in such a heavenly place. The food is excellent.",
    },
  ];

  // Active service pill
  const [activeService, setActiveService] = useState<number>(1);
  const services = [
    { id: 0, label: "Events", icon: Calendar, desc: "Private bookings & celebrations" },
    { id: 1, label: "Special Menus", icon: UtensilsCrossed, desc: "Chef's 5-course degustation" },
    { id: 2, label: "Fast Delivery", icon: Truck, desc: "Hot & fresh right to your doorstep" },
  ];

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reservation.name) return;
    setBookingConfirmed(true);
    setTimeout(() => {
      setBookingConfirmed(false);
      setReservation({
        name: "",
        persons: "2 Persons",
        timing: "19:00",
        date: "",
      });
    }, 4000);
  };

  return (
    <div className="w-full relative bg-[#09090C] border-t border-[#1C1C24] py-16 sm:py-24 overflow-hidden">
      {/* 1. CINEMATIC VIDEO REEL MODAL (Plays Pinterest.mp4) */}
      {isOpenVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="relative w-full max-w-4xl bg-[#121217] rounded-3xl border border-[#FFC20E]/30 overflow-hidden shadow-[0_0_50px_rgba(255,194,14,0.2)]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#22222D] bg-[#16161D]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#FFC20E] animate-pulse" />
                <h3 className="font-display font-black text-white text-base sm:text-lg">
                  Pinterest Animated UI Motion Showcase
                </h3>
              </div>
              <button
                onClick={onCloseVideoModal}
                className="w-9 h-9 rounded-full bg-[#202028] hover:bg-[#2C2C38] text-gray-400 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Close motion reel modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player */}
            <div className="relative aspect-video w-full bg-black">
              <video
                ref={videoRef}
                src="/pinterest.mp4"
                autoPlay
                loop
                muted={isMuted}
                playsInline
                className="w-full h-full object-contain"
              />

              {/* Floating Media Controls Overlay */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between px-4 py-2.5 rounded-2xl bg-black/70 backdrop-blur-md border border-white/10">
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlay}
                    className="p-2 rounded-xl bg-[#FFC20E] text-black hover:bg-[#FFE066] transition-transform active:scale-90"
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4 fill-black" />
                    ) : (
                      <Play className="w-4 h-4 fill-black" />
                    )}
                  </button>
                  <button
                    onClick={toggleMute}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                    aria-label={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? (
                      <VolumeX className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-[#FFC20E]" />
                    )}
                  </button>
                  <span className="text-xs text-gray-300 font-medium hidden sm:inline">
                    Pinterest Animated Experience Reel
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] bg-[#FFC20E]/20 text-[#FFC20E] px-2.5 py-1 rounded-full font-bold border border-[#FFC20E]/30">
                    Live Concept Preview
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Decorative Golden Ambient Lighting */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#FFC20E]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#D92323]/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Section Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 sm:space-y-28">

        {/* 2. HERO SIZZLING SKILLET & LAYERED OUTLINE TYPOGRAPHY (From Pinterest Video) */}
        <div className="relative">
          {/* Repeating Outlined Stacked Background Typography (Signature Effect from Video) */}
          <div className="absolute -top-12 sm:-top-20 left-0 right-0 overflow-hidden pointer-events-none select-none text-center opacity-30">
            <p className="font-serif text-5xl sm:text-7xl lg:text-9xl font-black uppercase text-stroke-luxury tracking-widest leading-none transform -rotate-1">
              DELICIOUS STORY
            </p>
            <p className="font-serif text-5xl sm:text-7xl lg:text-9xl font-black uppercase text-stroke-luxury tracking-widest leading-none transform rotate-1 mt-2">
              EXQUISITE TASTE
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10 pt-8 sm:pt-14">
            {/* Left Narrative Text */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1A1A22] border border-[#FFC20E]/40 text-[#FFC20E] text-xs font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(255,194,14,0.15)]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Cinematic Culinary Concept</span>
              </div>

              <div className="space-y-2">
                <span className="font-script text-3xl sm:text-4xl text-[#FFC20E] block">
                  Discover
                </span>
                <h2 className="font-serif text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                  Our Delicious Story &amp; Atmosphere
                </h2>
              </div>

              <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-xl">
                More than just dining — it is a paradise for your taste buds, a delight in
                pristine nature and flame-grilled craftsmanship. Here you will get an
                unforgettable feeling of unity with flavor, warmth, and culinary art.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#book-table"
                  className="inline-flex items-center gap-2 bg-[#FFC20E] hover:bg-[#FFE066] text-black font-extrabold text-sm px-7 py-3.5 rounded-full transition-all duration-200 shadow-[0_8px_25px_rgba(255,194,14,0.35)] active:scale-95"
                >
                  <span>Reserve Your Table</span>
                </a>

                {onOpenVideoModal && (
                  <button
                    onClick={onOpenVideoModal}
                    className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-[#181820] hover:bg-[#22222C] border border-[#2F2F3D] text-gray-200 text-sm font-bold transition-all active:scale-95"
                  >
                    <Play className="w-4 h-4 text-[#FFC20E] fill-[#FFC20E]" />
                    <span>Watch Pinterest Animation Reel</span>
                  </button>
                )}
              </div>
            </div>

            {/* Right: Sizzling Pan with Steam & Floating Seasoning Animation */}
            <div className="lg:col-span-6 relative flex items-center justify-center">
              <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden bg-radial from-[#1E1E26] to-[#0A0A0D] p-3 border border-[#2B2B38] shadow-2xl group">
                {/* Floating Salt & Spice Particles */}
                <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
                  <span className="absolute top-10 left-1/3 w-1.5 h-1.5 rounded-full bg-white/70 animate-ping" />
                  <span className="absolute bottom-1/4 right-1/4 w-2 h-2 rounded-full bg-[#FFC20E]/60 animate-bounce" />
                  <span className="absolute top-1/2 right-10 w-1 h-1 rounded-full bg-white/80 animate-pulse" />
                </div>

                {/* Sizzling Pan Photo with subtle levitation animation */}
                <div className="relative w-full h-full rounded-2xl overflow-hidden animate-float-slow">
                  <Image
                    src="/images/foodie/sizzling_skillet_dish.jpg"
                    alt="Sizzling cast iron steak and fresh herbs with rising steam from Pinterest motion video"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

                  {/* Corner Badge */}
                  <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md border border-[#FFC20E]/40 text-[#FFC20E] text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                    <Flame className="w-3.5 h-3.5 fill-[#FFC20E]" />
                    <span>Sizzling Cast Iron</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. GLOWING GOLDEN STATS PILLS (Direct from Pinterest Video: Locate Us, Open Hours, Reservation) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 pt-4">
          {/* 1. Locate Us */}
          <div className="relative group p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#181820] to-[#111116] border border-[#2E2E3C] hover:border-[#FFC20E]/60 transition-all duration-300 gold-glow-card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FFC20E]/15 border border-[#FFC20E]/30 flex items-center justify-center text-[#FFC20E] group-hover:scale-110 transition-transform">
                <MapPin className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <h4 className="font-serif text-base font-bold text-white group-hover:text-[#FFC20E] transition-colors">
                  Locate Us
                </h4>
                <p className="text-xs text-gray-400 mt-0.5">
                  Kalahari Pub, A-Lang Taxi Rank, Accra
                </p>
              </div>
            </div>
          </div>

          {/* 2. Open Hours */}
          <div className="relative group p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#181820] to-[#111116] border border-[#2E2E3C] hover:border-[#FFC20E]/60 transition-all duration-300 gold-glow-card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FFC20E]/15 border border-[#FFC20E]/30 flex items-center justify-center text-[#FFC20E] group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <h4 className="font-serif text-base font-bold text-white group-hover:text-[#FFC20E] transition-colors">
                  Open Hours
                </h4>
                <p className="text-xs text-gray-400 mt-0.5">
                  Mon To Sun 9:00 AM – 11:00 PM
                </p>
              </div>
            </div>
          </div>

          {/* 3. Reservation Direct Call */}
          <div className="relative group p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#181820] to-[#111116] border border-[#2E2E3C] hover:border-[#FFC20E]/60 transition-all duration-300 gold-glow-card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FFC20E]/15 border border-[#FFC20E]/30 flex items-center justify-center text-[#FFC20E] group-hover:scale-110 transition-transform">
                <PhoneCall className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <h4 className="font-serif text-base font-bold text-white group-hover:text-[#FFC20E] transition-colors">
                  Reservation
                </h4>
                <a
                  href="tel:0245656849"
                  className="text-xs font-bold text-[#FFC20E] hover:underline mt-0.5 block"
                >
                  +233 24 565 6849 / 020 715 7071
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 4. DISCOVER OUR MENU: FLOATING CULINARY PLATES (From Pinterest Video) */}
        <div className="space-y-8">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="font-script text-3xl sm:text-4xl text-[#FFC20E] block">
              Discover
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl font-black text-white">
              Signature Culinary Creations
            </h3>
            <p className="text-gray-400 text-xs sm:text-sm">
              Crafted fresh each day with hand-selected ingredients and authentic spices.
            </p>
          </div>

          {/* 3 Levitating Plate Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Plate 1: Green Carbonara */}
            <div className="group relative p-5 rounded-3xl bg-[#14141A] border border-[#242430] hover:border-[#FFC20E]/50 transition-all duration-500 hover:-translate-y-2">
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden mb-4 bg-black animate-float-slow">
                <Image
                  src="/images/foodie/culinary_pasta_dish.jpg"
                  alt="Green Carbonara with crispy bacon and herbs"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-lg font-bold text-white group-hover:text-[#FFC20E] transition-colors">
                    Green Carbonara
                  </h4>
                  <span className="text-sm font-black text-[#FFC20E]">Rs. 282</span>
                </div>
                <p className="text-xs text-gray-400 line-clamp-2">
                  With the addition of organic herb emulsion, Hungarian cured bacon and 24m aged parmesan cheese.
                </p>
              </div>
            </div>

            {/* Plate 2: Rack of Lamb */}
            <div className="group relative p-5 rounded-3xl bg-[#14141A] border border-[#242430] hover:border-[#FFC20E]/50 transition-all duration-500 hover:-translate-y-2">
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden mb-4 bg-black animate-float-reverse">
                <Image
                  src="/images/foodie/sizzling_skillet_dish.jpg"
                  alt="Rack of lamb with rosemary in cast iron"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-lg font-bold text-white group-hover:text-[#FFC20E] transition-colors">
                    Rack of Lamb
                  </h4>
                  <span className="text-sm font-black text-[#FFC20E]">Rs. 295</span>
                </div>
                <p className="text-xs text-gray-400 line-clamp-2">
                  Served on a pillow of roasted garlic, rosemary reduction, and coarse Atlantic sea salt crystals.
                </p>
              </div>
            </div>

            {/* Plate 3: Chocolate Lava Cake */}
            <div className="group relative p-5 rounded-3xl bg-[#14141A] border border-[#242430] hover:border-[#FFC20E]/50 transition-all duration-500 hover:-translate-y-2">
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden mb-4 bg-black animate-float-slow">
                <Image
                  src="/images/foodie/popular_lava_cake.jpg"
                  alt="Belgian Molten Chocolate Lava Cake"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-lg font-bold text-white group-hover:text-[#FFC20E] transition-colors">
                    Chocolate Lava Heart
                  </h4>
                  <span className="text-sm font-black text-[#FFC20E]">Rs. 280</span>
                </div>
                <p className="text-xs text-gray-400 line-clamp-2">
                  Warm Belgian molten fudge center overflowing onto dark artisan earthenware, with vanilla bean gelato.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 5. WHAT WE OFFER: INTERACTIVE SERVICES (From Pinterest Video) */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <span className="font-script text-3xl text-[#FFC20E]">What we offer</span>
            <h3 className="font-serif text-3xl sm:text-4xl font-black text-white">
              Our Great Services
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {services.map((srv) => {
              const Icon = srv.icon;
              const isActive = activeService === srv.id;

              return (
                <button
                  key={srv.id}
                  onClick={() => setActiveService(srv.id)}
                  className={`p-6 rounded-3xl text-left border transition-all duration-300 focus:outline-hidden ${
                    isActive
                      ? "bg-[#1C1C26] border-[#FFC20E] shadow-[0_0_30px_rgba(255,194,14,0.25)]"
                      : "bg-[#14141A] border-[#252532] hover:border-[#383848]"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                        isActive
                          ? "bg-[#FFC20E] text-black shadow-lg"
                          : "bg-[#20202A] text-[#FFC20E]"
                      }`}
                    >
                      <Icon className="w-7 h-7 stroke-[2]" />
                    </div>
                    <div>
                      <h4 className="font-serif text-lg font-bold text-white">
                        {srv.label}
                      </h4>
                      <p className="text-xs text-gray-400 mt-1">{srv.desc}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 6. TESTIMONIALS SLIDER (From Pinterest Video: What Our Visitors Say) */}
        <div className="space-y-6">
          <div className="flex items-end justify-between">
            <div className="space-y-1">
              <span className="font-script text-2xl text-[#FFC20E]">Learn more about</span>
              <h3 className="font-serif text-2xl sm:text-3xl font-black text-white">
                What Our Visitors Say
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setTestimonialIndex(
                    (prev) => (prev - 1 + testimonials.length) % testimonials.length
                  )
                }
                className="w-9 h-9 rounded-full bg-[#181820] hover:bg-[#252530] border border-[#2D2D3A] flex items-center justify-center text-gray-300 hover:text-white transition-colors"
                aria-label="Previous review"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() =>
                  setTestimonialIndex((prev) => (prev + 1) % testimonials.length)
                }
                className="w-9 h-9 rounded-full bg-[#181820] hover:bg-[#252530] border border-[#2D2D3A] flex items-center justify-center text-gray-300 hover:text-white transition-colors"
                aria-label="Next review"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testimonials
              .slice(testimonialIndex, testimonialIndex + 2)
              .map((item, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-[#14141A] border border-[#252532] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-sm font-bold text-white tracking-wider">
                      {item.author}
                    </span>
                    <div className="flex items-center gap-1">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-3.5 h-3.5 fill-[#FFC20E] text-[#FFC20E]"
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed italic">
                    &ldquo;{item.comment}&rdquo;
                  </p>
                </div>
              ))}
          </div>
        </div>

        {/* 7. BOOK YOUR TABLE FORM (From Pinterest Video) */}
        <div id="book-table" className="relative p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#16161E] via-[#121217] to-[#0A0A0E] border border-[#2E2E3E] shadow-2xl">
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-8">
            <span className="font-script text-3xl sm:text-4xl text-[#FFC20E]">
              Reservation
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl font-black text-white">
              Book Your Table
            </h3>
            <p className="text-xs sm:text-sm text-gray-400">
              Join us for an exquisite dining experience under the warm ambient lights.
            </p>
          </div>

          {bookingConfirmed ? (
            <div className="max-w-md mx-auto p-6 rounded-2xl bg-[#10B981]/10 border border-[#10B981]/40 text-center space-y-2 animate-in zoom-in-95 duration-200">
              <CheckCircle2 className="w-10 h-10 text-[#10B981] mx-auto animate-bounce" />
              <h4 className="font-bold text-white text-base">Reservation Request Received!</h4>
              <p className="text-xs text-gray-300">
                Thank you! Our restaurant team will contact you shortly to confirm your table.
              </p>
            </div>
          ) : (
            <form onSubmit={handleBookingSubmit} className="max-w-xl mx-auto space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5 block">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={reservation.name}
                    onChange={(e) =>
                      setReservation({ ...reservation, name: e.target.value })
                    }
                    placeholder="Enter full name"
                    className="w-full px-4 py-3 rounded-2xl bg-[#1C1C24] border border-[#2D2D3B] text-white text-sm focus:border-[#FFC20E] focus:outline-hidden transition-colors"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5 block">
                    Party Size
                  </label>
                  <select
                    value={reservation.persons}
                    onChange={(e) =>
                      setReservation({ ...reservation, persons: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-2xl bg-[#1C1C24] border border-[#2D2D3B] text-white text-sm focus:border-[#FFC20E] focus:outline-hidden transition-colors"
                  >
                    <option value="1 Person">1 Person</option>
                    <option value="2 Persons">2 Persons</option>
                    <option value="4 Persons">4 Persons</option>
                    <option value="6+ Persons">6+ Persons VIP</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5 block">
                    Preferred Time
                  </label>
                  <input
                    type="time"
                    value={reservation.timing}
                    onChange={(e) =>
                      setReservation({ ...reservation, timing: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-2xl bg-[#1C1C24] border border-[#2D2D3B] text-white text-sm focus:border-[#FFC20E] focus:outline-hidden transition-colors"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5 block">
                    Date
                  </label>
                  <input
                    type="date"
                    value={reservation.date}
                    onChange={(e) =>
                      setReservation({ ...reservation, date: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-2xl bg-[#1C1C24] border border-[#2D2D3B] text-white text-sm focus:border-[#FFC20E] focus:outline-hidden transition-colors"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-[#FFC20E] hover:bg-[#FFE066] text-black font-extrabold text-sm uppercase tracking-wider transition-all duration-200 shadow-[0_8px_25px_rgba(255,194,14,0.35)] active:scale-98"
                >
                  Book A Table
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
