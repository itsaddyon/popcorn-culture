import React, { Suspense, useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  PerspectiveCamera,
  Environment,
  Float,
  ContactShadows,
  MeshTransmissionMaterial,
} from "@react-three/drei";
import { motion as Motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";

/* ---------------- 3D HERO OBJECT (Optimized) ---------------- */

function HeroVessel({ scrollYProgress, mouse, isMobile }) {
  const meshRef = useRef();

  const rotationY = useTransform(scrollYProgress, [0, 1], [0, Math.PI * 4]);
  const smoothRotation = useSpring(rotationY, { stiffness: 40, damping: 20 });

  const scaleValue = isMobile ? [1.1, 1.4, 1.2] : [1.7, 2.4, 1.9];
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], scaleValue);

  useFrame(() => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = smoothRotation.get() + mouse.current.x * 0.3;
    meshRef.current.rotation.x = mouse.current.y * 0.3;
    meshRef.current.scale.setScalar(scale.get());
  });

  return (
    <group>
      <Float
        speed={isMobile ? 1 : 2.5}
        rotationIntensity={isMobile ? 0.2 : 0.5}
        floatIntensity={isMobile ? 0.2 : 1}
      >
        <mesh ref={meshRef}>
          <dodecahedronGeometry args={[1.5, 0]} />
          {/* Mobile Fix: Use standard material for performance, Glass for Desktop */}
          {isMobile ? (
            <meshStandardMaterial color="#050505" metalness={1} roughness={0.1} emissive="#f59e0b" emissiveIntensity={0.2} />
          ) : (
            <MeshTransmissionMaterial 
              backside thickness={2.5} roughness={0.05} chromaticAberration={0.2} anisotropy={0.1} color="#050505" transmission={1} 
            />
          )}
          
          <mesh scale={1.02}>
            <dodecahedronGeometry args={[1.5, 2]} />
            <meshBasicMaterial color="#f59e0b" wireframe transparent opacity={0.15} />
          </mesh>
        </mesh>
      </Float>
      {/* Disable shadows on mobile to stop lag */}
      {!isMobile && <ContactShadows position={[0, -4, 0]} opacity={0.7} scale={15} blur={2.5} />}
    </group>
  );
}

/* ---------------- MAIN APP ---------------- */

export default function App() {
  const containerRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const { scrollYProgress } = useScroll({ target: containerRef });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("home");
  const [cartItems, setCartItems] = useState([]);
  const [activeColorProductId, setActiveColorProductId] = useState(null);
  const [cartNotice, setCartNotice] = useState("");
  const cartNoticeTimerRef = useRef(null);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  const allProducts = [
    // CLOTHES - Real clothing products
    { id: "CL-01", name: "Oversized Cotton Tee", price: "₹299", category: "CLOTHES", img: "https://m.media-amazon.com/images/I/61rQy0KmJmL._AC_UL480_FMwebp_QL65_.jpg" },
    { id: "CL-02", name: "Vintage Graphic Hoodie", price: "₹599", category: "CLOTHES", img: "https://m.media-amazon.com/images/I/715BU9q0tWL._AC_UL480_FMwebp_QL65_.jpg" },
    { id: "CL-03", name: "Denim Jacket Blue", price: "₹899", category: "CLOTHES", img: "https://m.media-amazon.com/images/I/61lkPO7RtML._AC_UL480_FMwebp_QL65_.jpg" },
    // DECORATIVE ITEMS - Real decor products
    { id: "DE-01", name: "Ceramic Vase White", price: "₹249", category: "DECORATIVE ITEMS", img: "https://m.media-amazon.com/images/I/813Kzy7rfqL._AC_UL480_FMwebp_QL65_.jpg" },
    { id: "DE-02", name: "Modern Wall Canvas", price: "₹399", category: "DECORATIVE ITEMS", img: "https://m.media-amazon.com/images/I/71PGTjVmqxL._AC_UL480_FMwebp_QL65_.jpg" },
    { id: "DE-03", name: "Gold Ceramic Pot", price: "₹349", category: "DECORATIVE ITEMS", img: "https://m.media-amazon.com/images/I/61HlF6RzAnL._AC_UL480_FMwebp_QL65_.jpg" },
    // COOL GADGETS - Real tech gadgets
    { id: "GA-01", name: "LED Desk Lamp", price: "₹301", category: "COOL GADGETS", img: "https://m.media-amazon.com/images/I/51vTJvfA7cL._AC_UL480_FMwebp_QL65_.jpg" },
    { id: "GA-02", name: "Wireless Earbuds Pro", price: "₹449", category: "COOL GADGETS", img: "https://m.media-amazon.com/images/I/718Vby0O1GL._AC_UY327_FMwebp_QL65_.jpg" },
    { id: "GA-03", name: "Mini Smart Speaker", price: "₹799", category: "COOL GADGETS", img: "https://m.media-amazon.com/images/I/61ln9HHYBoL._AC_UY327_FMwebp_QL65_.jpg" },
    // BUDGET ITEMS - Real affordable products
    { id: "BU-01", name: "Phone Stand", price: "₹99", category: "BUDGET ITEMS", img: "https://m.media-amazon.com/images/I/51gsnG1oP2L._AC_UY327_FMwebp_QL65_.jpg" },
    { id: "BU-02", name: "Desk Organizer Set", price: "₹149", category: "BUDGET ITEMS", img: "https://m.media-amazon.com/images/I/61A5u90XztL._AC_UL480_FMwebp_QL65_.jpg" },
    { id: "BU-03", name: "USB Cable Set", price: "₹199", category: "BUDGET ITEMS", img: "https://m.media-amazon.com/images/I/7100MyxcglL._AC_UY327_FMwebp_QL65_.jpg" },
  ];

  const filteredCategoryProducts = selectedCategory
    ? allProducts.filter(p => p.category === selectedCategory)
    : [];

  const featuredProducts = [
    { id: "FP-01", name: "Touch LED Lamp", price: "₹301", img: "https://m.media-amazon.com/images/I/71ZLdAaoeTL._AC_UL480_FMwebp_QL65_.jpg" },
    { id: "FP-02", name: "Obsidian Crys", price: "₹345", img: "https://m.media-amazon.com/images/I/71ff4YDrbuL._AC_UL480_FMwebp_QL65_.jpg" },
    { id: "FP-03", name: "Kinetic Wing", price: "₹449", img: "https://m.media-amazon.com/images/I/81DDJuO4HkL._AC_UL480_FMwebp_QL65_.jpg" },
    { id: "FP-04", name: "Twister Vase", price: "₹249", img: "https://m.media-amazon.com/images/I/511s4x3jzzL._AC_UY327_FMwebp_QL65_.jpg" },
  ];

  const cartCount = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems]
  );

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });

    if (cartNoticeTimerRef.current) clearTimeout(cartNoticeTimerRef.current);
    setCartNotice(`${product.name} added to cart`);
    cartNoticeTimerRef.current = setTimeout(() => setCartNotice(""), 1800);
  };

  const removeFromCart = (productId) => {
    let removedName = "";
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === productId) {
            removedName = item.name;
            return { ...item, quantity: item.quantity - 1 };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );

    if (removedName) {
      if (cartNoticeTimerRef.current) clearTimeout(cartNoticeTimerRef.current);
      setCartNotice(`${removedName} removed from cart`);
      cartNoticeTimerRef.current = setTimeout(() => setCartNotice(""), 1800);
    }
  };

  const toggleMobileColorReveal = (productId) => {
    if (!isMobile) return;
    setActiveColorProductId((prev) => (prev === productId ? null : productId));
  };

  return (
    <div
      ref={containerRef}
      className={`bg-black text-white ${currentPage === "home" ? "min-h-[500vh]" : "min-h-screen"} uppercase font-sans overflow-x-hidden selection:bg-amber-500`}
      onMouseMove={(e) => {
        mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
      }}
    >
      <div className="fixed top-4 left-4 z-40 md:top-6 md:left-6">
        <button
          onClick={() => setIsMenuOpen(true)}
          aria-label="Open menu"
          className="border border-white/30 bg-black/60 px-4 py-2 text-[10px] font-black tracking-[0.2em] backdrop-blur-sm hover:bg-amber-500 hover:text-black hover:border-amber-500 transition-colors md:px-6 md:text-xs"
          style={{ fontFamily: "'Google Sans', sans-serif" }}
        >
          MENU
        </button>
      </div>

      <div className="fixed top-4 right-4 z-40 flex gap-2 md:top-6 md:right-6 md:gap-3">
        <button
          onClick={() => setCurrentPage("cart")}
          aria-label="Go to cart page"
          className="border border-white/30 bg-black/60 px-3 py-2 text-[10px] font-black tracking-[0.2em] backdrop-blur-sm hover:bg-amber-500 hover:text-black hover:border-amber-500 transition-colors md:px-6 md:text-xs"
          style={{ fontFamily: "'Google Sans', sans-serif" }}
        >
          CART ({cartCount})
        </button>
        <button
          onClick={() => {
            setCurrentPage("home");
            setIsLoginOpen(true);
          }}
          aria-label="Open sign in popup"
          className="border border-white/30 bg-black/60 px-3 py-2 text-[10px] font-black tracking-[0.2em] backdrop-blur-sm hover:bg-amber-500 hover:text-black hover:border-amber-500 transition-colors md:px-6 md:text-xs"
          style={{ fontFamily: "'Google Sans', sans-serif" }}
        >
          LOGIN
        </button>
      </div>

      {currentPage === "home" ? (
        <>
          {/* 3D BACKGROUND (Hidden on mobile if lag persists) */}
          <div className="fixed inset-0 z-0 h-screen w-full pointer-events-none">
            <Canvas dpr={isMobile ? 1 : [1, 2]} gl={{ powerPreference: "high-performance" }}>
              <PerspectiveCamera makeDefault position={[0, 0, 8]} />
              <Environment preset="city" />
              <Suspense fallback={null}>
                <HeroVessel scrollYProgress={scrollYProgress} mouse={mouse} isMobile={isMobile} />
              </Suspense>
            </Canvas>
          </div>

      {/* 1. HERO */}
      <section className="relative z-10 h-screen flex flex-col items-start justify-center px-8">
        <Motion.h1
          style={{ fontFamily: "'Google Sans', sans-serif", opacity: heroOpacity }}
          className="text-[18vw] md:text-[12rem] font-black tracking-tighter mix-blend-difference leading-[0.8]"
        >
          POPCORN<br /><span className="text-amber-500 font-normal">CULTURE.</span>
        </Motion.h1>
        <Motion.h2
          style={{ fontFamily: "'Google Sans', sans-serif", opacity: heroOpacity }}
          className="text-3xl md:text-4xl text-amber-500 mt-6 font-semibold max-w-2xl"
        >
          Where your search comes to an end.
        </Motion.h2>
      </section>

      {/* 2. BRAND STORY (New Content) */}
      <section className="relative z-10 py-40 px-8 bg-black/60 backdrop-blur-sm border-y border-white/10">
        <div className="max-w-4xl">
          <h2 className="text-sm tracking-[0.8em] opacity-40 mb-10 text-lg" style={{ fontFamily: "'Google Sans', sans-serif" }}>THE MANIFESTO</h2>
          <p className="text-4xl md:text-6xl font-black tracking-tighter leading-tight" style={{ fontFamily: "'Google Sans', sans-serif" }}>
            CULTIVATING EVERYDAY AESTHETICS. WE BELIEVE IN <span className="text-amber-500">GOODIES</span> THAT DEFINE YOUR SPACE.
          </p>
        </div>
      </section>

      {/* 3. FEATURED GRID */}
      <section className="relative z-10 py-32 px-8 bg-black/90">
        <div className="flex justify-between items-end mb-16">
            <h2 className="text-6xl font-black tracking-tighter text-amber-500 leading-none" style={{ fontFamily: "'Google Sans', sans-serif" }}>FEATURED<br/>DROPS.</h2>
            <p className="text-[10px] tracking-widest opacity-30">SCROLL TO EXPLORE</p>
        </div>
        <p className="mb-8 inline-block border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-[11px] tracking-[0.15em] text-amber-300">
          TAP OR CLICK PRODUCT IMAGE TO REVEAL IMMERSIVE COLOR
        </p>

        <div className="grid md:grid-cols-2 gap-px bg-white/10 border border-white/10">
          {featuredProducts.map((item) => (
            <div key={item.id} className="group bg-black p-10 hover:bg-white/5 transition-colors cursor-crosshair">
              <div
                onClick={() => toggleMobileColorReveal(item.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") toggleMobileColorReveal(item.id);
                }}
                role="button"
                tabIndex={0}
                aria-label={`Reveal color preview for ${item.name}`}
                className={`aspect-[4/5] overflow-hidden mb-8 transition-all duration-700 ${
                  isMobile
                    ? activeColorProductId === item.id
                      ? "grayscale-0"
                      : "grayscale"
                    : "grayscale group-hover:grayscale-0"
                }`}
              >
                <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-4xl font-black italic tracking-tighter group-hover:text-amber-500 transition-colors">{item.name}</h3>
                  <p className="text-xl opacity-40">{item.price}</p>
                </div>
                <button
                  onClick={() => addToCart(item)}
                  aria-label={`Add ${item.name} to cart`}
                  className="border border-white/20 px-6 py-2 text-[10px] font-black hover:bg-amber-500 hover:text-black transition-all"
                >
                  ADD TO CART ↗
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. INFINITE MARQUEE (New Content) */}
      <div className="relative z-10 py-20 bg-amber-500 text-black overflow-hidden whitespace-nowrap">
        <Motion.div 
          animate={{ x: [0, -1000] }} 
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="text-6xl font-black italic tracking-tighter flex gap-20"
        >
          <span>NEW DROPS EVERY WEEK</span>
          <span>POPCORN CULTURE</span>
          <span>ESTABLISHED 2026</span>
        </Motion.div>
      </div>

      {/* 5. SHOP BY CATEGORY */}
      <section className="relative z-10 py-32 px-8 bg-black/80 border-y border-white/10">
        <h2 className="text-5xl md:text-7xl font-black text-amber-500 mb-16" style={{ fontFamily: "'Google Sans', sans-serif" }}>SHOP BY CATEGORY</h2>
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {[
            { name: 'CLOTHES', desc: 'Premium wearables & apparel' },
            { name: 'DECORATIVE ITEMS', desc: 'Home aesthetics & decor' },
            { name: 'COOL GADGETS', desc: 'Tech & innovative tools' },
            { name: 'BUDGET ITEMS', desc: 'Affordable finds' }
          ].map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className="group bg-black/50 border border-white/20 p-10 hover:bg-amber-500 hover:text-black transition-all cursor-crosshair text-left"
            >
              <h3 className="text-4xl font-black" style={{ fontFamily: "'Google Sans', sans-serif" }}>{cat.name}</h3>
              <p className="text-sm opacity-60 group-hover:opacity-100">{cat.desc}</p>
            </button>
          ))}
        </div>

        {/* CATEGORY PRODUCTS GRID */}
        {selectedCategory && (
          <div className="mt-20">
            <div className="flex justify-between items-center mb-12">
              <h3 className="text-4xl font-black text-amber-500" style={{ fontFamily: "'Google Sans', sans-serif" }}>{selectedCategory}</h3>
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-sm border border-white/20 px-4 py-2 hover:bg-white/10 transition"
              >
                ✕ CLEAR
              </button>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {filteredCategoryProducts.map((item) => (
                <div key={item.id} className="group bg-black/50 border border-white/20 p-8 hover:border-amber-500 transition-all">
                  <div
                    onClick={() => toggleMobileColorReveal(item.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") toggleMobileColorReveal(item.id);
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`Reveal color preview for ${item.name}`}
                    className={`aspect-square overflow-hidden mb-6 transition-all duration-700 ${
                      isMobile
                        ? activeColorProductId === item.id
                          ? "grayscale-0"
                          : "grayscale"
                        : "grayscale group-hover:grayscale-0"
                    }`}
                  >
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  </div>
                  <h4 className="text-2xl font-black italic mb-2 group-hover:text-amber-500 transition-colors">{item.name}</h4>
                  <p className="text-amber-500 font-bold mb-4">{item.price}</p>
                  <button
                    onClick={() => addToCart(item)}
                    aria-label={`Add ${item.name} to cart`}
                    className="w-full border border-white/20 px-4 py-2 text-[10px] font-black hover:bg-amber-500 hover:text-black transition-all"
                  >
                    ADD TO CART ↗
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 6. TESTIMONIALS */}
      <section className="relative z-10 py-32 px-8 bg-black">
        <h2 className="text-5xl md:text-7xl font-black text-amber-500 mb-16" style={{ fontFamily: "'Google Sans', sans-serif" }}>WHAT CUSTOMERS SAY</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { name: 'Priya M.', text: 'Amazing quality and incredible aesthetics!' },
            { name: 'Arjun S.', text: 'Best place to find unique decorative pieces.' },
            { name: 'Neha K.', text: 'Love the curated selection and fast delivery!' }
          ].map((testi) => (
            <div key={testi.name} className="border border-white/20 p-8 bg-white/5 hover:bg-amber-500/10 transition-colors">
              <p className="text-lg mb-6 italic opacity-80">\"{ testi.text }\"</p>
              <p className="font-black text-amber-500">— {testi.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. NEWSLETTER SIGNUP */}
      <section className="relative z-10 py-32 px-8 bg-amber-500 text-black">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-5xl font-black mb-6" style={{ fontFamily: "'Google Sans', sans-serif" }}>STAY IN THE LOOP</h2>
          <p className="text-lg mb-10 opacity-80">Get early access to drops, exclusive discounts & curated picks</p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="your@email.com"
              aria-label="Email for newsletter"
              className="flex-1 bg-black text-white px-6 py-4 border border-white/20 placeholder-white/40"
            />
            <button
              onClick={() => setIsSubscribeOpen(true)}
              aria-label="Subscribe to newsletter"
              className="bg-black text-amber-500 px-8 py-4 font-black italic hover:bg-white transition-colors"
            >
              SUBSCRIBE
            </button>
          </div>
        </div>
      </section>

      {/* 8. ABOUT */}
      <section className="relative z-10 py-32 px-8 bg-black/80">
        <div className="max-w-3xl">
          <h2 className="text-5xl font-black text-amber-500 mb-8" style={{ fontFamily: "'Google Sans', sans-serif" }}>ABOUT POPCORN</h2>
          <p className="text-lg leading-relaxed opacity-80">Popcorn Culture is a curated marketplace for aesthetic enthusiasts. We believe in delivering affordable, premium-quality items that elevate your everyday spaces. Founded in 2026, we're committed to discovering and showcasing the most unique pieces that resonate with modern aesthetics.</p>
        </div>
      </section>

      {/* 9. CONTACT & SOCIAL */}
      <section className="relative z-10 py-40 px-8 bg-[#050505]">
        <div className="grid md:grid-cols-2 gap-20">
            <div>
                <h2 className="text-[10vw] font-black tracking-tighter text-amber-500 leading-none" style={{ fontFamily: "'Google Sans', sans-serif" }}>LET'S<br/>TALK.</h2>
            </div>
            <div className="flex flex-col gap-8">
                {[
                  { name: 'Instagram', href: 'https://instagram.com/popcornculture1' },
                  { name: 'WhatsApp', href: 'https://wa.me/918409536813' },
                  { name: 'X', href: 'https://x.com/pop_corn_cult' }
                ].map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-4xl font-black border-b border-white/10 py-6 flex justify-between group hover:text-amber-500 transition-colors"
                      style={{ fontFamily: "'Google Sans', sans-serif" }}
                    >
                        {link.name} <span className="opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
                    </a>
                ))}
                <p className="mt-10 opacity-30 text-[10px] tracking-[0.5em]">OWNED BY: YUVRAJ CHAUDHARY</p>
            </div>
        </div>
      </section>

          <footer className="relative z-10 py-10 px-8 border-t border-white/5 text-center text-[8px] tracking-[0.8em] opacity-20">
            ©2026 POPCORN CULTURE
          </footer>
        </>
      ) : (
        <section className="relative z-10 min-h-screen px-6 pt-32 pb-16 md:px-10">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 flex items-end justify-between gap-4">
              <h2 className="text-5xl font-black tracking-tighter text-amber-500 md:text-7xl" style={{ fontFamily: "'Google Sans', sans-serif" }}>
                YOUR CART
              </h2>
              <button
                onClick={() => setCurrentPage("home")}
                className="border border-white/20 px-4 py-2 text-xs font-black hover:bg-white/10 transition-colors"
              >
                BACK TO SHOP
              </button>
            </div>

            {cartItems.length === 0 ? (
              <div className="border border-white/10 bg-black/50 p-10 text-center">
                <p className="text-2xl font-black text-amber-500">Your cart is empty.</p>
                <p className="mt-3 opacity-70">Add items from the homepage to see them here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="grid grid-cols-[90px_1fr_auto] items-center gap-4 border border-white/10 bg-black/50 p-4 md:grid-cols-[110px_1fr_auto]">
                    <img src={item.img} alt={item.name} className="h-20 w-20 object-cover md:h-24 md:w-24" />
                    <div>
                      <p className="text-xl font-black">{item.name}</p>
                      <p className="text-amber-500">{item.price}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        aria-label={`Remove one ${item.name} from cart`}
                        className="h-9 w-9 border border-white/20 text-lg hover:bg-white/10 transition-colors"
                      >
                        -
                      </button>
                      <span className="min-w-8 text-center font-black">{item.quantity}</span>
                      <button
                        onClick={() => addToCart(item)}
                        aria-label={`Add one more ${item.name} to cart`}
                        className="h-9 w-9 border border-white/20 text-lg hover:bg-amber-500 hover:text-black transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      <AnimatePresence>
        {cartNotice && (
          <Motion.div
            className="fixed bottom-5 left-1/2 z-50 w-[92%] max-w-sm -translate-x-1/2 rounded-lg border border-amber-500/40 bg-black/90 px-4 py-3 text-center text-sm font-semibold text-amber-300 shadow-lg shadow-amber-500/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            {cartNotice}
          </Motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <Motion.div
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
            />
            <Motion.aside
              className="fixed left-0 top-0 z-50 h-screen w-[92%] max-w-[420px] border-r border-amber-500/30 bg-[radial-gradient(circle_at_top_left,_#231300_0%,_#0a0a0a_40%,_#050505_100%)] px-5 py-6 md:px-8 md:py-8"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 24, stiffness: 220 }}
            >
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <p className="text-[10px] tracking-[0.35em] text-white/50">POPCORN CULTURE</p>
                  <h3 className="text-3xl font-black tracking-tight text-amber-500">MENU</h3>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="Close menu"
                  className="border border-white/20 px-3 py-1 text-xs font-black hover:bg-white/10 transition-colors"
                >
                  CLOSE
                </button>
              </div>

              <div className="mb-6 rounded-xl border border-white/10 bg-black/35 p-4">
                <p className="text-[11px] tracking-[0.25em] text-white/50">QUICK STATUS</p>
                <p className="mt-2 text-sm text-white/80">Items in cart: <span className="font-black text-amber-500">{cartCount}</span></p>
                <p className="text-sm text-white/70">Page: <span className="font-black text-white">{currentPage.toUpperCase()}</span></p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    setCurrentPage("home");
                    setIsMenuOpen(false);
                  }}
                  className="w-full rounded-lg border border-white/20 bg-black/40 px-4 py-3 text-left text-lg font-black hover:bg-amber-500 hover:text-black transition-colors"
                >
                  HOME
                  <span className="float-right opacity-70">↗</span>
                </button>
                <button
                  onClick={() => {
                    setCurrentPage("cart");
                    setIsMenuOpen(false);
                  }}
                  className="w-full rounded-lg border border-white/20 bg-black/40 px-4 py-3 text-left text-lg font-black hover:bg-amber-500 hover:text-black transition-colors"
                >
                  CART ({cartCount})
                  <span className="float-right opacity-70">↗</span>
                </button>
                <button
                  onClick={() => {
                    setCurrentPage("home");
                    setIsLoginOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full rounded-lg border border-white/20 bg-black/40 px-4 py-3 text-left text-lg font-black hover:bg-amber-500 hover:text-black transition-colors"
                >
                  SIGN IN
                  <span className="float-right opacity-70">↗</span>
                </button>
              </div>
            </Motion.aside>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSubscribeOpen && (
          <Motion.div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Motion.div
              className="relative w-full max-w-lg overflow-hidden bg-[#050505] border border-amber-500/40 p-8 text-center"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              {[...Array(16)].map((_, i) => (
                <Motion.span
                  key={i}
                  className="absolute h-2 w-2 rounded-full bg-amber-400"
                  style={{
                    left: `${8 + i * 5.5}%`,
                    top: "85%",
                  }}
                  animate={{
                    y: [-10, -220 - (i % 5) * 14],
                    x: [0, (i % 2 === 0 ? 1 : -1) * (14 + (i % 4) * 6)],
                    opacity: [1, 1, 0],
                    scale: [1, 1.2, 0.8],
                  }}
                  transition={{
                    duration: 1.6 + (i % 3) * 0.2,
                    repeat: Infinity,
                    delay: i * 0.05,
                    ease: "easeOut",
                  }}
                />
              ))}

              <Motion.h3
                className="text-4xl font-black text-amber-500 mb-4"
                style={{ fontFamily: "'Google Sans', sans-serif" }}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                YOU'RE IN!
              </Motion.h3>
              <p className="text-white/80 mb-8">
                {newsletterEmail
                  ? `Thanks, ${newsletterEmail}. You're now subscribed for early drops and exclusive updates.`
                  : "Thanks for subscribing. You're now in our early access list for upcoming drops."}
              </p>
              <button
                onClick={() => setIsSubscribeOpen(false)}
                className="bg-amber-500 text-black px-8 py-3 font-black hover:bg-amber-400 transition-colors"
              >
                AWESOME
              </button>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isLoginOpen && (
          <Motion.div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Motion.div
              className="w-full max-w-md bg-[#050505] border border-white/20 p-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-3xl font-black text-amber-500" style={{ fontFamily: "'Google Sans', sans-serif" }}>
                  LOGIN
                </h3>
                <button
                  onClick={() => setIsLoginOpen(false)}
                  className="text-sm border border-white/20 px-3 py-1 hover:bg-white/10 transition"
                >
                  CLOSE
                </button>
              </div>

              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full bg-black text-white px-4 py-3 border border-white/20 placeholder-white/40 focus:outline-none focus:border-amber-500"
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full bg-black text-white px-4 py-3 border border-white/20 placeholder-white/40 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  className="w-full bg-amber-500 text-black py-3 font-black hover:bg-amber-400 transition-colors"
                >
                  SIGN IN
                </button>
              </form>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}




