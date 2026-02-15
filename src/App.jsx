import React, { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Environment, Float, ContactShadows, MeshTransmissionMaterial } from '@react-three/drei';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';

function HeroVessel({ scrollYProgress, mouse }) {
  const meshRef = useRef();
  const rotationY = useTransform(scrollYProgress, [0, 1], [0, Math.PI * 4]);
  // Mobile-aware scaling: reduced base scale for smaller screens
  const scaleValue = typeof window !== 'undefined' && window.innerWidth < 768 ? [1.2, 1.6, 1.4] : [1.7, 2.4, 1.9];
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], scaleValue);
  const smoothRotation = useSpring(rotationY, { stiffness: 40, damping: 20 });

  useFrame(() => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = smoothRotation.get() + (mouse.x * 0.4);
    meshRef.current.rotation.x = (mouse.y * 0.4);
    meshRef.current.scale.setScalar(scale.get());
  });

  return (
    <group>
      <Float speed={2.5} rotationIntensity={0.5} floatIntensity={1}>
        <mesh ref={meshRef}>
          <dodecahedronGeometry args={[1.5, 0]} />
          <MeshTransmissionMaterial 
            backside thickness={2.5} roughness={0.05} chromaticAberration={0.2}
            anisotropy={0.1} color="#050505" transmission={1} 
          />
          <mesh scale={1.001}>
            <dodecahedronGeometry args={[1.5, 0]} />
            <meshPhysicalMaterial transparent opacity={0.3} color="#000000" metalness={1} 
              roughness={0} clearcoat={1} envMapIntensity={3} 
            />
          </mesh>
          <mesh scale={1.02}>
            <dodecahedronGeometry args={[1.5, 2]} />
            <meshBasicMaterial color="#f59e0b" wireframe transparent opacity={0.15} />
          </mesh>
        </mesh>
      </Float>
      <ContactShadows position={[0, -4, 0]} opacity={0.7} scale={15} blur={2.5} />
    </group>
  );
}

export default function App() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(null);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });

  const productPlaceholders = [
    { 
      id: 'PC-01', 
      category: "LIGHTING", 
      name: "Touch Control LED Light", 
      price: "₹301",
      img: "https://m.media-amazon.com/images/I/71ZLdAaoeTL._AC_UL480_FMwebp_QL65_.jpg",
      buyLink: "https://www.amazon.in/dp/B0DDXHZXDK" 
    },
    { 
      id: 'PC-02', 
      category: "VESSELS", 
      name: "OBSIDIAN CRYS", 
      price: "₹345",
      img: "https://m.media-amazon.com/images/I/71ff4YDrbuL._AC_UL480_FMwebp_QL65_.jpg",
      buyLink: "https://www.amazon.in/dp/B09GG1VVYT" 
    },
    { 
      id: 'PC-03', 
      category: "Tool Kit", 
      name: "KINETIC WING", 
      price: "₹449",
      img: "https://m.media-amazon.com/images/I/81DDJuO4HkL._AC_UL480_FMwebp_QL65_.jpg",
      buyLink: "https://www.amazon.in/dp/B0FFZFPJHB" 
    },
    { 
      id: 'PC-04', 
      category: "ESSENTIAL", 
      name: "VASE", 
      price: "₹249",
      img: "https://m.media-amazon.com/images/I/511s4x3jzzL._AC_UY327_FMwebp_QL65_.jpg",
      buyLink: "https://www.amazon.in/dp/B0GDVMTVTZ" 
    },
  ];

  return (
    <div 
      ref={containerRef}
      className="bg-[#050505] text-white min-h-[400vh] uppercase font-sans overflow-x-hidden selection:bg-amber-500"
      onMouseMove={(e) => setMouse({ x: (e.clientX / window.innerWidth) * 2 - 1, y: -(e.clientY / window.innerHeight) * 2 + 1 })}
    >
      {/* 3D BACKGROUND STAGE */}
      <div className="fixed inset-0 z-0 h-screen w-full pointer-events-none bg-black">
        <Canvas shadows>
          <PerspectiveCamera makeDefault position={[0, 0, 8]} />
          <Environment preset="city" /> 
          <Suspense fallback={null}>
            <HeroVessel scrollYProgress={scrollYProgress} mouse={mouse} />
          </Suspense>
        </Canvas>
      </div>

      {/* BRAND NAV */}
      <nav className="fixed top-0 w-full flex justify-between items-center p-4 md:p-8 z-[100] border-b border-white/5 backdrop-blur-xl">
        <h1 className="text-xl md:text-3xl font-black italic tracking-tighter text-amber-500">POPCORN CULTURE</h1>
        <div className="flex gap-4 md:gap-10 text-[8px] md:text-[10px] font-bold tracking-[0.2em] md:tracking-[0.4em]">
          <span>SHOP</span>
          <span className="underline decoration-amber-500 underline-offset-4 md:underline-offset-8 font-mono">CART (0)</span>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative z-10 h-screen flex flex-col justify-center px-6 md:px-12 pointer-events-none">
        <motion.div style={{ opacity: useTransform(scrollYProgress, [0, 0.15], [1, 0]) }}>
          <h2 className="text-[18vw] md:text-[14rem] font-black italic tracking-tighter leading-[0.85] md:leading-[0.75] mix-blend-difference">
            POPCORN<br/><span className="text-amber-500 font-normal">CULTURE.</span>
          </h2>
        </motion.div>
      </section>

      {/* PRODUCT GRID */}
      <section className="relative z-10 grid grid-cols-1 md:grid-cols-2 bg-black/90 backdrop-blur-3xl border-t border-white/10">
        {productPlaceholders.map((item) => (
          <div 
            key={item.id} 
            onMouseEnter={() => setHovered(item.id)} 
            onMouseLeave={() => setHovered(null)}
            className="border-r border-b border-white/10 p-8 md:p-20 group relative cursor-crosshair overflow-hidden"
          >
            <div className="flex justify-between text-[8px] md:text-[10px] font-mono mb-6 md:mb-12 opacity-40">
              <span>{item.id} // {item.category}</span>
              <span className="text-amber-500">AVAILABLE</span>
            </div>
            
            <div className="relative aspect-[4/5] bg-[#0A0A0A] overflow-hidden rounded-sm border border-white/5">
              <motion.img 
                src={item.img}
                alt={item.name}
                animate={{ 
                  scale: hovered === item.id ? 1.1 : 1,
                  filter: hovered === item.id ? "grayscale(0%)" : "grayscale(100%)"
                }}
                transition={{ duration: 0.8 }}
                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
            </div>

            <div className="mt-8 md:mt-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h3 className="text-3xl md:text-5xl font-black italic tracking-tighter group-hover:text-amber-500 transition-colors leading-tight">{item.name}</h3>
                <p className="text-xl md:text-2xl font-light mt-2">{item.price}</p>
              </div>
              <a href={item.buyLink} target="_blank" rel="noreferrer" className="w-full md:w-auto bg-white/5 hover:bg-amber-500 hover:text-black border border-white/10 px-8 py-4 text-center text-[10px] font-black tracking-[0.3em] transition-all">
                GET NOW ↗
              </a>
            </div>
          </div>
        ))}
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 bg-[#050505] border-t border-white/10 pt-20 md:pt-40 pb-10 px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 md:gap-20">
          <div className="max-w-2xl">
            <h4 className="text-[18vw] md:text-[12vw] font-black italic tracking-tighter leading-[0.8] mb-8 md:mb-12">
              POPCORN<br/><span className="text-amber-500">SOCIAL.</span>
            </h4>
            <p className="text-[8px] md:text-[10px] tracking-[0.4em] md:tracking-[0.6em] opacity-30 uppercase leading-loose">
              Join the movement. Every day we curate the most unique aesthetic pieces for your culture.
            </p>
          </div>

          <div className="w-full md:w-auto flex flex-col gap-4 md:gap-6 text-left md:text-right">
            {[
              { label: 'Contact Us', link: 'tel:+918235510844'},
              { label: 'Instagram', link: '#' },
              { label: 'Whatsapp', link: '#' },
              { label: 'X / Twitter', link: '#' },
              { label: 'Email Us', link: 'mailto:hello@popcornculture.com' }
            ].map((social) => (
              <a key={social.label} href={social.link} className="group overflow-hidden">
                <span className="block text-2xl md:text-4xl font-black italic tracking-tighter group-hover:text-amber-500 transition-all transform group-hover:-translate-y-1">
                  {social.label} ↗
                </span>
                <div className="h-[1px] w-full bg-white/10 group-hover:bg-amber-500 transition-colors"></div>
              </a>
            ))}
          </div>
        </div>

        <div className="mt-20 md:mt-40 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[8px] md:text-[10px] font-bold tracking-[0.5em] opacity-20 text-center">
          <span>©2026 POPCORN CULTURE</span>
          <span className="italic uppercase">Owned by: Yuvraj Chaudhary</span>
          <span>PRIVACY // TERMS</span>
        </div>
      </footer>
    </div>
  );
}