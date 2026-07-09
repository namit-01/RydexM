import React from "react";

function page() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white">
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-block px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
            Contact Us
          </span>

          <h1 className="text-5xl md:text-6xl font-bold mt-6">
            We'd Love to
            <span className="text-blue-500"> Hear From You</span>
          </h1>

          <p className="text-gray-400 text-lg mt-6">
            Have a question, feedback, or need support? Our team is here to help
            you. Reach out to us anytime, and we'll get back to you as soon as
            possible.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 mt-20">
          {/* Contact Form */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
            <h2 className="text-3xl font-bold mb-6">Send a Message</h2>

            <form className="space-y-5">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full rounded-xl bg-slate-900 border border-slate-700 px-4 py-3 outline-none focus:border-blue-500"
              />

              <input
                type="email"
                placeholder="Your Email"
                className="w-full rounded-xl bg-slate-900 border border-slate-700 px-4 py-3 outline-none focus:border-blue-500"
              />

              <input
                type="text"
                placeholder="Subject"
                className="w-full rounded-xl bg-slate-900 border border-slate-700 px-4 py-3 outline-none focus:border-blue-500"
              />

              <textarea
                rows={5}
                placeholder="Your Message"
                className="w-full rounded-xl bg-slate-900 border border-slate-700 px-4 py-3 outline-none focus:border-blue-500 resize-none"
              />

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 transition rounded-xl py-3 font-semibold"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Details */}
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-2">📧 Email</h3>
              <p className="text-gray-400">chaturvedinamit899@gmail.com</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-2">📞 Phone</h3>
              <p className="text-gray-400">+91 98765 43210</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-2">📍 Address</h3>
              <p className="text-gray-400">
                Rydex Technologies <br />
                Lucknow, Uttar Pradesh, India
              </p>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-2">🕒 Support Hours</h3>
              <p className="text-gray-300">
                Monday – Sunday
                <br />
                24×7 Customer Support
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default page;
