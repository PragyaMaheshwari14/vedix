const Welcome = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8" id="about">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block bg-[#FF9966] text-white px-6 py-2 rounded-full mb-4">
            👋
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">Welcome To Minerva</h2>
          
          <p className="text-lg text-gray-700 mb-16">
            The awesome people who makes<br />all this possible
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Card 1 */}
            <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-lg transition">
              <p className="text-xs uppercase tracking-wide mb-4 text-gray-500">START HERE</p>
              <h3 className="text-2xl font-bold mb-6">Who we are &<br />what we do</h3>
              
              <div className="mb-8">
                <div className="w-full h-48 flex items-center justify-center">
                  <div className="relative">
                    <div className="w-32 h-32 bg-[#FFD93D] rounded-lg"></div>
                    <div className="absolute -right-8 top-8 w-24 h-24 bg-[#FF9966] rounded-full"></div>
                    <div className="absolute bottom-0 left-8 text-6xl">🎭</div>
                  </div>
                </div>
              </div>
              
              <button className="bg-[#6BCB77] text-white px-6 py-3 rounded-full hover:bg-[#5AB968] transition flex items-center gap-2 mx-auto">
                START HERE →
              </button>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-lg transition">
              <p className="text-xs uppercase tracking-wide mb-4 text-gray-500">CUSTOM DESIGN</p>
              <h3 className="text-2xl font-bold mb-6">We&apos;ll design your<br />projects</h3>
              
              <div className="mb-8">
                <div className="w-full h-48 flex items-center justify-center">
                  <div className="relative">
                    <div className="text-7xl">👨‍💻</div>
                    <div className="absolute -left-4 top-0 w-16 h-16 bg-[#FF9B9B] rounded-full opacity-50"></div>
                  </div>
                </div>
              </div>
              
              <button className="bg-[#FF9966] text-white px-6 py-3 rounded-full hover:bg-[#FF8855] transition flex items-center gap-2 mx-auto">
                START HERE →
              </button>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-lg transition">
              <p className="text-xs uppercase tracking-wide mb-4 text-gray-500">CONTACT US</p>
              <h3 className="text-2xl font-bold mb-6">Drop us your<br />message!</h3>
              
              <div className="mb-8">
                <div className="w-full h-48 flex items-center justify-center">
                  <div className="relative">
                    <div className="text-7xl">💬</div>
                    <div className="absolute right-0 bottom-0 w-12 h-12 bg-[#6BCB77] rounded-full"></div>
                  </div>
                </div>
              </div>
              
              <button className="bg-[#4A90E2] text-white px-6 py-3 rounded-full hover:bg-[#3A80D2] transition flex items-center gap-2 mx-auto">
                START HERE →
              </button>
            </div>
          </div>
        </div>
      </section>
  )
}

export default Welcome