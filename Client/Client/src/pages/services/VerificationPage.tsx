import { ShieldCheck, AlertTriangle, CheckCircle } from "lucide-react";

const verificationChecks = [
  "Ownership verification",
  "Boundary verification",
  "Document authenticity",
  "Title history",
  "Seller legitimacy",
  "Red flag identification"
];

const risksAvoided = [
  "Fake documents",
  "Double sales",
  "Overpriced land",
  "Illegal land deals",
  "Disputed ownership",
  "Encumbered properties"
];

export function VerificationPage() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-white mb-6">Property Verification (Anti-Fraud Service)</h1>
          <p className="text-blue-100 text-xl">
            Protect yourself from scams and ensure legitimate property deals
          </p>
        </div>
      </section>

      {/* What We Verify */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-gray-900 mb-8 text-center">What We Verify</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {verificationChecks.map((check, index) => (
              <div key={index} className="flex items-start gap-4 p-6 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <span className="text-gray-700 text-lg">{check}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Risks Avoided */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-gray-900 mb-8 text-center">We Help You Avoid</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {risksAvoided.map((risk, index) => (
              <div key={index} className="flex items-start gap-4 p-6 bg-red-50 rounded-lg border border-red-200">
                <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                <span className="text-gray-700 text-lg">{risk}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-gray-900 mb-12 text-center">Our Verification Process</h2>
          
          <div className="space-y-6">
            <div className="flex gap-6 p-6 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center">
                1
              </div>
              <div className="flex-1">
                <h3 className="text-gray-900 mb-2">Initial Document Review</h3>
                <p className="text-gray-600">
                  We examine all available property documents for authenticity and completeness.
                </p>
              </div>
            </div>

            <div className="flex gap-6 p-6 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-gray-900 mb-2">Official Records Check</h3>
                <p className="text-gray-600">
                  Verification with government offices and land registries to confirm ownership and status.
                </p>
              </div>
            </div>

            <div className="flex gap-6 p-6 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center">
                3
              </div>
              <div className="flex-1">
                <h3 className="text-gray-900 mb-2">Physical Site Inspection</h3>
                <p className="text-gray-600">
                  On-ground verification of property boundaries, location, and condition.
                </p>
              </div>
            </div>

            <div className="flex gap-6 p-6 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center">
                4
              </div>
              <div className="flex-1">
                <h3 className="text-gray-900 mb-2">Seller Background Check</h3>
                <p className="text-gray-600">
                  Verification of seller identity and legitimacy of their claim to the property.
                </p>
              </div>
            </div>

            <div className="flex gap-6 p-6 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center">
                5
              </div>
              <div className="flex-1">
                <h3 className="text-gray-900 mb-2">Comprehensive Report</h3>
                <p className="text-gray-600">
                  Detailed verification report with findings, red flags, and recommendations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why It Matters */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-white mb-8 text-center">Why Property Verification Matters</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="text-4xl text-white mb-4">60%+</div>
              <p className="text-blue-100">
                of property disputes involve fraud or fake documents
              </p>
            </div>
            <div className="p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="text-4xl text-white mb-4">Millions</div>
              <p className="text-blue-100">
                lost annually to real estate scams in Cameroon
              </p>
            </div>
            <div className="p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="text-4xl text-white mb-4">100%</div>
              <p className="text-blue-100">
                peace of mind with professional verification
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <button className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors">
              Verify a Property Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
