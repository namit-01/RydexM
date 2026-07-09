import React from "react";

const page = () => {
    
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white">
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-block px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
            About Rydex
          </span>

          <h1 className="text-5xl md:text-6xl font-bold mt-6 leading-tight">
            Smarter Rides.
            <span className="text-blue-500"> Better Journeys.</span>
          </h1>

          <p className="text-gray-400 text-lg mt-6 leading-8">
            Rydex is a modern ride-booking platform designed to make everyday
            travel fast, reliable, and affordable. Whether you're heading to
            work, the airport, or meeting friends, we connect you with trusted
            drivers in just a few taps.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-20">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <div className="text-4xl mb-4">🚖</div>
            <h3 className="text-2xl font-semibold mb-3">Reliable Rides</h3>
            <p className="text-gray-400">
              Book rides anytime with verified drivers and real-time trip
              tracking for a smooth travel experience.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-2xl font-semibold mb-3">Fast Booking</h3>
            <p className="text-gray-400">
              Get matched with nearby drivers instantly and reach your
              destination without unnecessary waiting.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <div className="text-4xl mb-4">🛡️</div>
            <h3 className="text-2xl font-semibold mb-3">Safe & Secure</h3>
            <p className="text-gray-400">
              Driver verification, secure payments, and live ride updates ensure
              peace of mind on every trip.
            </p>
          </div>
        </div>

        <div className="mt-24 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">Our Mission</h2>

            <p className="text-gray-400 leading-8">
              We believe transportation should be simple, transparent, and
              accessible for everyone. Our mission is to use technology to make
              urban mobility smarter while providing a dependable platform for
              both riders and drivers.
            </p>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-3xl p-10">
            <h3 className="text-3xl font-bold mb-8">Why Choose Rydex?</h3>

            <ul className="space-y-5 text-gray-300">
              <li>✅ Real-time ride tracking</li>
              <li>✅ Verified professional drivers</li>
              <li>✅ Secure online payments</li>
              <li>✅ Transparent pricing</li>
              <li>✅ 24/7 customer support</li>
              <li>✅ Clean & comfortable rides</li>
            </ul>
          </div>
        </div>

        <div className="text-center mt-24">
          <h2 className="text-4xl font-bold">Every Ride Begins with Trust.</h2>

          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Join thousands of riders who choose Rydex for safe, convenient, and
            hassle-free transportation every day.
          </p>
        </div>
      </section>
    </main>
  );
};

export default page;
