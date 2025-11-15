import { useSession } from "next-auth/react";

const Hero = () => {
    const { data: session, status } = useSession();

  return (
    <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="flex-1 max-w-2xl">
              <div className="inline-block bg-black text-white px-4 py-2 rounded-full text-sm mb-6">
                100%
              </div>
              
              <p className="text-sm uppercase tracking-wide mb-4">WELCOME TO MINERVA</p>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                We are an Awarded Digital Agency
              </h1>
              
              <p className="text-lg mb-8 text-gray-700">
                Minerva is a Non Code creative<br />Agency Webflow Template
              </p>
              
              <button className="bg-black text-white px-8 py-4 rounded-full hover:bg-gray-800 transition flex items-center gap-2">
                LEARN MORE
                <span>→</span>
              </button>

              {status === "authenticated" && (
                <p className="mt-6 text-sm text-gray-600">
                  Welcome back, {session.user?.name}!
                </p>
              )}
            </div>

            <div className="flex-1 relative">
              <div className="relative w-full max-w-md mx-auto">
                <div className="absolute top-0 left-0 w-8 h-8 bg-gradient-to-br from-red-400 to-pink-500 rounded-lg transform rotate-45"></div>
                
                <div className="mt-12 space-y-4">
                  <div className="bg-[#FF9B9B] text-black px-6 py-3 rounded-full inline-block transform -rotate-12 font-medium">
                    WEBDESIGN
                  </div>
                  
                  <div className="bg-[#FF9966] text-black px-8 py-8 rounded-full inline-flex flex-col items-center justify-center w-48 h-48 ml-12">
                    <span className="text-2xl mb-2">👍</span>
                    <span className="font-bold text-center">SOCIAL<br/>MEDIA</span>
                  </div>
                  
                  <div className="bg-[#FFD93D] text-black px-8 py-8 rounded-2xl inline-block transform rotate-6 ml-32">
                    <div className="font-bold text-xl">UX<br/>DESIGN</div>
                    <div className="text-2xl mt-2">✨</div>
                  </div>
                  
                  <div className="bg-[#6BCB77] text-black px-6 py-3 rounded-full inline-block ml-24 font-medium">
                    WEBFLOW
                  </div>
                </div>

                <div className="absolute bottom-0 right-0 bg-black text-white w-12 h-12 rounded-full flex items-center justify-center">
                  ↓
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  )
}

export default Hero