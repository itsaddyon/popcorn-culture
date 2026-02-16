import React, { Suspense, useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  PerspectiveCamera,
  Environment,
  Float,
  ContactShadows,
  MeshTransmissionMaterial,
} from "@react-three/drei";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";

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

  const allProducts = [
    // CLOTHES - Real clothing products
    { id: "CL-01", name: "Oversized Cotton Tee", price: "₹299", category: "CLOTHES", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=600&fit=crop" },
    { id: "CL-02", name: "Vintage Graphic Hoodie", price: "₹599", category: "CLOTHES", img: "https://images.unsplash.com/photo-1556821552-cb06b6fa0c3b?w=500&h=600&fit=crop" },
    { id: "CL-03", name: "Denim Jacket Blue", price: "₹899", category: "CLOTHES", img: "https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=500&h=600&fit=crop" },
    // DECORATIVE ITEMS - Real decor products
    { id: "DE-01", name: "Ceramic Vase White", price: "₹249", category: "DECORATIVE ITEMS", img: "https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=500&h=600&fit=crop" },
    { id: "DE-02", name: "Modern Wall Canvas", price: "₹399", category: "DECORATIVE ITEMS", img: "https://images.unsplash.com/photo-1582053272087-1b9e1f50bf8e?w=500&h=600&fit=crop" },
    { id: "DE-03", name: "Gold Ceramic Pot", price: "₹349", category: "DECORATIVE ITEMS", img: "https://images.unsplash.com/photo-1567186573515-0586dfa45125?w=500&h=600&fit=crop" },
    // COOL GADGETS - Real tech gadgets
    { id: "GA-01", name: "LED Desk Lamp", price: "₹301", category: "COOL GADGETS", img: "https://images.unsplash.com/photo-1565636192335-14a5a5a3f3fa?w=500&h=600&fit=crop" },
    { id: "GA-02", name: "Wireless Earbuds Pro", price: "₹449", category: "COOL GADGETS", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=600&fit=crop" },
    { id: "GA-03", name: "Mini Smart Speaker", price: "₹799", category: "COOL GADGETS", img: "https://images.unsplash.com/photo-1589003077984-894e133dba90?w=500&h=600&fit=crop" },
    // BUDGET ITEMS - Real affordable products
    { id: "BU-01", name: "Phone Stand", price: "₹99", category: "BUDGET ITEMS", img: "https://images.unsplash.com/photo-1605559424843-9e4c3ca4b7f1?w=500&h=600&fit=crop" },
    { id: "BU-02", name: "Desk Organizer Set", price: "₹149", category: "BUDGET ITEMS", img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=600&fit=crop" },
    { id: "BU-03", name: "USB Cable Set", price: "₹199", category: "BUDGET ITEMS", img: "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500&h=600&fit=crop" },
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

  return (
    <div
      ref={containerRef}
      className="bg-black text-white min-h-[500vh] uppercase font-sans overflow-x-hidden selection:bg-amber-500"
      onMouseMove={(e) => {
        mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
      }}
    >
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
        <motion.h1
          style={{ fontFamily: "'Google Sans', sans-serif", opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]) }}
          className="text-[18vw] md:text-[12rem] font-black tracking-tighter mix-blend-difference leading-[0.8]"
        >
          POPCORN<br /><span className="text-amber-500 font-normal">CULTURE.</span>
        </motion.h1>
        <motion.h2
          style={{ fontFamily: "'Google Sans', sans-serif", opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]) }}
          className="text-3xl md:text-4xl text-amber-500 mt-6 font-semibold max-w-2xl"
        >
          Where your search come to an end.
        </motion.h2>
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

        <div className="grid md:grid-cols-2 gap-px bg-white/10 border border-white/10">
          {featuredProducts.map((item) => (
            <div key={item.id} className="group bg-black p-10 hover:bg-white/5 transition-colors cursor-crosshair">
              <div className="aspect-[4/5] overflow-hidden mb-8 grayscale group-hover:grayscale-0 transition-all duration-700">
                <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-4xl font-black italic tracking-tighter group-hover:text-amber-500 transition-colors">{item.name}</h3>
                  <p className="text-xl opacity-40">{item.price}</p>
                </div>
                <button className="border border-white/20 px-6 py-2 text-[10px] font-black hover:bg-amber-500 hover:text-black transition-all">GET NOW ↗</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. INFINITE MARQUEE (New Content) */}
      <div className="relative z-10 py-20 bg-amber-500 text-black overflow-hidden whitespace-nowrap">
        <motion.div 
          animate={{ x: [0, -1000] }} 
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="text-6xl font-black italic tracking-tighter flex gap-20"
        >
          <span>NEW DROPS EVERY WEEK</span>
          <span>POPCORN CULTURE</span>
          <span>ESTABLISHED 2026</span>
          <span>BASED IN RIT</span>
        </motion.div>
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
                  <div className="aspect-square overflow-hidden mb-6 grayscale group-hover:grayscale-0 transition-all duration-700">
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  </div>
                  <h4 className="text-2xl font-black italic mb-2 group-hover:text-amber-500 transition-colors">{item.name}</h4>
                  <p className="text-amber-500 font-bold mb-4">{item.price}</p>
                  <button className="w-full border border-white/20 px-4 py-2 text-[10px] font-black hover:bg-amber-500 hover:text-black transition-all">ADD TO CART ↗</button>
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
          <div className="flex gap-2">
            <input type="email" placeholder="your@email.com" className="flex-1 bg-black text-white px-6 py-4 border border-white/20 placeholder-white/40" />
            <button className="bg-black text-amber-500 px-8 py-4 font-black italic hover:bg-white transition-colors">SUBSCRIBE</button>
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
                {['Instagram', 'Whatsapp', 'Twitter'].map(link => (
                    <a key={link} href="#" className="text-4xl font-black border-b border-white/10 py-6 flex justify-between group hover:text-amber-500 transition-colors" style={{ fontFamily: "'Google Sans', sans-serif" }}>
                        {link} <span className="opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
                    </a>
                ))}
                <p className="mt-10 opacity-30 text-[10px] tracking-[0.5em]">OWNED BY: YUVRAJ CHAUDHARY</p>
            </div>
        </div>
      </section>

      <footer className="relative z-10 py-10 px-8 border-t border-white/5 text-center text-[8px] tracking-[0.8em] opacity-20">
        ©2026 POPCORN CULTURE // RIT ROORKEE
      </footer>
    </div>
  );
}