import { FileText, CheckCircle, ArrowRight } from "lucide-react";

const loanTypes = [
  "Buying land",
  "Buying a house",
  "Construction",
  "Land + construction",
  "Renovation"
];

const processSteps = [
  {
    title: "Assess your eligibility",
    description: "We review your financial situation and determine your loan options"
  },
  {
    title: "Explain your loan options",
    description: "Clear breakdown of available programs, rates, and requirements"
  },
  {
    title: "Collect or guide your documents",
    description: "Help you gather all necessary documentation"
  },
  {
    title: "Prepare your file professionally",
    description: "Ensure your application is complete and compelling"
  },
  {
    title: "Submit or support submission",
    description: "Guide you through the submission process"
  },
  {
    title: "Follow-up and guidance until approval",
    description: "Stay with you every step until you get your loan"
  }
];

const documents = [
  "ID",
  "Residence certificate",
  "Land documents",
  "Business registration",
  "Salary slips or revenue proof",
  "Construction plans",
  "And more..."
];

export function LoanAssistancePage() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-6">
            <FileText className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-white mb-6">Real Estate Loan Assistance</h1>
          <p className="text-blue-100 text-xl">
            Professional support to help you secure financing for your real estate goals
          </p>
        </div>
      </section>

      {/* Description */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-gray-900 mb-6 text-center">How We Help You</h2>
          <p className="text-gray-700 text-lg mb-8 text-center leading-relaxed">
            We help individuals and businesses secure real estate loans for:
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-12">
            {loanTypes.map((type, index) => (
              <div key={index} className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <span className="text-gray-700">{type}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-gray-900 mb-12 text-center">Our Process</h2>
          
          <div className="space-y-6">
            {processSteps.map((step, index) => (
              <div key={index} className="flex gap-6 p-6 bg-white rounded-xl border border-gray-200">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Documents */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-gray-900 mb-6 text-center">Documents We Help With</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {documents.map((doc, index) => (
              <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <span className="text-gray-700">{doc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-white mb-6">Ready to Get Started?</h2>
          <p className="text-blue-100 text-lg mb-8">
            Let us help you navigate the loan process and secure the financing you need.
          </p>
          <button className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors">
            Request Loan Support
            <ArrowRight className="ml-2 w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
}
