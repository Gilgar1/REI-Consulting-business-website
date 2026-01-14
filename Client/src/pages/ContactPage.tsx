import { Calendar, Mail, Phone, MapPin, MessageCircle, ArrowRight, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function ContactPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    date: "",
    time: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submission
    navigate("/booking-success");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative bg-primary py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center opacity-10" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading font-bold text-4xl md:text-5xl text-white mb-6 animate-fade-in-up">
            Let's Build Your <span className="text-accent">Legacy</span>
          </h1>
          <p className="text-xl text-slate-300 animate-fade-in-up delay-100">
            Expert guidance is just one conversation away. Book your value-packed consultation today.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

            {/* Contact Form */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
              <h2 className="text-2xl font-bold text-primary mb-8 flex items-center gap-3">
                <Calendar className="w-6 h-6 text-accent" />
                Schedule Consultation
              </h2>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Full Name</label>
                    <input
                      type="text"
                      required
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Phone / WhatsApp</label>
                    <input
                      type="tel"
                      required
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                      placeholder="+237 ..."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Email Address</label>
                  <input
                    type="email"
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                    placeholder="john@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Service Interest</label>
                  <div className="relative">
                    <select
                      required
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all appearance-none"
                    >
                      <option value="">Select a service category...</option>
                      <option value="loan">Real Estate Loan Assistance</option>
                      <option value="documentation">Land & Property Documentation</option>
                      <option value="verification">Property Verification (Due Diligence)</option>
                      <option value="rental">Rental Property Management</option>
                      <option value="diaspora">Diaspora Investment Strategy</option>
                      <option value="listings">Property Acquisition Support</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Preferred Date</label>
                    <input
                      type="date"
                      name="date"
                      required
                      value={formData.date}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Preferred Time</label>
                    <input
                      type="time"
                      name="time"
                      required
                      value={formData.time}
                      onChange={handleChange}
                      min="08:00"
                      max="19:00"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Your Message (Optional)</label>
                  <textarea
                    rows={4}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all resize-none"
                    placeholder="Tell us a bit about your situation or goals..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/25 hover:-translate-y-1"
                >
                  Confirm Booking <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            </div>

            {/* Contact Info & Trust */}
            <div className="space-y-12">
              <div>
                <h3 className="text-3xl font-heading font-bold text-primary mb-6">Contact Information</h3>
                <div className="space-y-6">
                  {[
                    { icon: Phone, label: "Phone & WhatsApp", value: "+237 681 478 111", action: "Call Now", href: "tel:+237681478111" },
                    { icon: MessageCircle, label: "Direct Chat", value: "Chat on WhatsApp", action: "Start Chat", href: "https://wa.me/237681478111" },
                    { icon: Mail, label: "Email Support", value: "reiconsultingcm@gmail.com", action: "Send Email", href: "mailto:reiconsultingcm@gmail.com" },
                    { icon: MapPin, label: "Office Location", value: "Yaoundé, Cameroon", sub: "Mon-Sat, 8am - 6pm", action: "Get Directions", href: "#" }
                  ].map((contact, i) => (
                    <a key={i} href={contact.href} className="flex items-center gap-6 p-6 bg-white rounded-2xl border border-slate-100 hover:border-accent/40 hover:shadow-lg transition-all duration-300 group">
                      <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center text-primary group-hover:bg-accent group-hover:text-white transition-colors">
                        <contact.icon className="w-7 h-7" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">{contact.label}</p>
                        <p className="text-lg font-semibold text-primary">{contact.value}</p>
                        {contact.sub && <p className="text-sm text-slate-500">{contact.sub}</p>}
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              <div className="bg-primary p-8 rounded-3xl relative overflow-hidden text-white">
                <div className="relative z-10">
                  <h4 className="font-bold text-xl mb-4">Why Book With Us?</h4>
                  <ul className="space-y-3">
                    {[
                      "100% Confidential Consultations",
                      "Actionable, Data-Backed Advice",
                      "Direct Access to Expertise",
                      "No Obligation Required"
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-accent" />
                        <span className="text-slate-200">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent/20 rounded-full blur-2xl" />
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}