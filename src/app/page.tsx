"use client";

import Hero from "./components/Hero";
import Welcome from "./components/Welcome";

export default function Home() {

  return (
    <div className="min-h-screen bg-[#FFF5EB]">
      <Hero />
      <Welcome />
      
      {/* About Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <span className="bg-[#7B68EE] text-white px-6 py-2 rounded-full text-sm">ABOUT US</span>
            <h2 className="text-3xl sm:text-4xl font-bold">
              We are a creative and talented team of 👍 creators
            </h2>
          </div>
        </div>
      </section>
    </div>
  );
}