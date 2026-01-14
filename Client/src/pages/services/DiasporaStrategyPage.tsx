import { Globe, AlertTriangle, TrendingUp } from "lucide-react";

const services = [
  "Choose the right property for your goals",
  "Avoid common diaspora investment traps",
  "Build long-term ROI strategies",
  "Leverage loans and financing options",
  "Manage property remotely with confidence",
  "Verify every step of the process"
];

const commonTraps = [
  {
    title: "Overpaying Due to Distance",
    description: "Sellers often inflate prices for diaspora buyers. We provide accurate market valuations."
  },
  {
    title: "Fake Property Deals",
    description: "Scammers target overseas investors. Our verification protects you from fraud."
  },
  {
    title: "Poor Property Selection",
    description: "Buying in wrong locations or bad investments. We guide you to profitable opportunities."
  },
  {
    title: "Documentation Issues",
    description: "Missing or fake documents discovered too late. We ensure proper documentation from the start."
  },
  {
    title: "No Local Representation",
    description: "Being taken advantage of without trusted boots on the ground. We are your eyes and ears."
  }
];

export function DiasporaStrategyPage() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-6">
            <Globe className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-white mb-6">Portfolio Strategy for Diaspora Investors</h1>
          <p className="text-blue-100 text-xl">
            Invest back home with confidence — guided by local expertise you can trust
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-gray-900 mb-8 text-center">How We Help Diaspora Investors</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <div key={index} className="flex items-start gap-4 p-6 bg-blue-50 rounded-lg border border-blue-200">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700 text-lg">{service}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Common Traps */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-gray-900 mb-12 text-center">Common Diaspora Investment Traps We Help You Avoid</h2>
          
          <div className="space-y-6">
            {commonTraps.map((trap, index) => (
              <div key={index} className="p-6 bg-white rounded-xl border border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-gray-900 mb-2">{trap.title}</h3>
                    <p className="text-gray-600">{trap.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-gray-900 mb-12 text-center">Why Diaspora Investors Choose Us</h2>
          
          <div className="space-y-6">
            <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-gray-900 mb-2">Local Knowledge, Global Standards</h3>
                  <p className="text-gray-700">
                    We understand Cameroon's market intimately while maintaining international professional standards you expect.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-gray-900 mb-2">Bilingual Communication</h3>
                  <p className="text-gray-700">
                    Seamless communication in English and French, whether you're in the US, Europe, or anywhere else.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-gray-900 mb-2">Your Trusted Representative</h3>
                  <p className="text-gray-700">
                    We act as your eyes, ears, and advocate on the ground — ensuring your interests are protected at every step.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-white mb-6">Ready to Invest Back Home?</h2>
          <p className="text-blue-100 text-lg mb-8">
            Let us help you build a profitable property portfolio in Cameroon — safely and intelligently.
          </p>
          <button className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors">
            Schedule Your Strategy Session
          </button>
        </div>
      </section>
    </div>
  );
}
