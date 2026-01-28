import { CheckCircle2, ArrowLeft, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

export function BookingSuccessPage() {
  return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-surface relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />

      <div className="max-w-lg w-full mx-auto px-4 relative z-10">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 text-center animate-fade-in-up">

          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce-slow">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>

          <h1 className="font-heading font-bold text-3xl md:text-4xl text-primary mb-4">
            Booking Confirmed!
          </h1>

          <p className="text-slate-600 text-lg mb-8 leading-relaxed">
            Thank you for trusting REI Consulting. We have received your request and will be in touch shortly to confirm the details.
          </p>

          <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100 text-left">
            <h3 className="font-bold text-primary mb-2 text-sm uppercase tracking-wider">Next Steps</h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex gap-2">
                <span className="text-accent font-bold">1.</span> An agent will review your request.
              </li>
              <li className="flex gap-2">
                <span className="text-accent font-bold">2.</span> You'll receive a WhatsApp/Email confirmation within 24h.
              </li>
              <li className="flex gap-2">
                <span className="text-accent font-bold">3.</span> Prepare any relevant documents for the call.
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <Link
              to="/"
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all hover:shadow-lg"
            >
              <ArrowLeft className="w-4 h-4" /> Return to Home
            </Link>

            <a
              href="https://wa.me/237681478111"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-slate-500 hover:text-accent flex items-center justify-center gap-1 transition-colors"
            >
              <MessageCircle className="w-4 h-4" /> Need urgent help? Chat on WhatsApp
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
