import { Building, CheckCircle } from "lucide-react";

const guidanceAreas = [
  "Land certificates",
  "Survey plans",
  "Sales agreements",
  "Mutation",
  "Land title acquisition",
  "Due diligence",
  "Documentation checks",
  "How to avoid document mistakes"
];

export function DocumentationPage() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-6">
            <Building className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-white mb-6">Land & Property Documentation Guidance</h1>
          <p className="text-blue-100 text-xl">
            Navigate the complex world of property documentation with expert guidance
          </p>
        </div>
      </section>

      {/* Description */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-gray-900 mb-8 text-center">We Guide You Through</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {guidanceAreas.map((area, index) => (
              <div key={index} className="flex items-start gap-4 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <span className="text-gray-700 text-lg">{area}</span>
              </div>
            ))}
          </div>

          <div className="p-8 bg-blue-50 rounded-xl border-l-4 border-blue-600">
            <h3 className="text-gray-900 mb-4">Why Documentation Matters</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Proper documentation is the foundation of legal property ownership in Cameroon. Missing or incorrect documents can lead to:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-gray-700">
                <span className="text-red-600 mt-1">✗</span>
                <span>Loss of property rights</span>
              </li>
              <li className="flex items-start gap-2 text-gray-700">
                <span className="text-red-600 mt-1">✗</span>
                <span>Legal disputes</span>
              </li>
              <li className="flex items-start gap-2 text-gray-700">
                <span className="text-red-600 mt-1">✗</span>
                <span>Inability to sell or transfer property</span>
              </li>
              <li className="flex items-start gap-2 text-gray-700">
                <span className="text-red-600 mt-1">✗</span>
                <span>Loan application rejection</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* How We Help */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-gray-900 mb-12 text-center">How We Help</h2>
          
          <div className="space-y-6">
            <div className="p-6 bg-white rounded-xl border border-gray-200">
              <h3 className="text-gray-900 mb-3">Document Review & Verification</h3>
              <p className="text-gray-600">
                We review all property documents to ensure they are authentic, complete, and legally valid.
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl border border-gray-200">
              <h3 className="text-gray-900 mb-3">Step-by-Step Guidance</h3>
              <p className="text-gray-600">
                From initial certificate checks through land title acquisition, we walk with you through every step.
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl border border-gray-200">
              <h3 className="text-gray-900 mb-3">Error Prevention</h3>
              <p className="text-gray-600">
                We help you avoid common mistakes that could delay or derail your property acquisition.
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl border border-gray-200">
              <h3 className="text-gray-900 mb-3">Professional Connections</h3>
              <p className="text-gray-600">
                Access to trusted notaries, surveyors, and legal professionals who can support your documentation needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-white mb-6">Get Expert Documentation Support</h2>
          <p className="text-blue-100 text-lg mb-8">
            Don't let documentation issues stand between you and property ownership.
          </p>
          <button className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors">
            Request Consultation
          </button>
        </div>
      </section>
    </div>
  );
}
