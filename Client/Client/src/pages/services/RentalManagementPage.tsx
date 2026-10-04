import { Home, CheckCircle } from "lucide-react";

const services = [
  {
    title: "Tenant Selection",
    description: "Thorough screening and selection of reliable tenants"
  },
  {
    title: "Rent Collection",
    description: "Timely collection and remittance of rental payments"
  },
  {
    title: "Maintenance Coordination",
    description: "Regular maintenance and emergency repairs management"
  },
  {
    title: "Digital Reporting",
    description: "Monthly reports on property status and financials"
  },
  {
    title: "Contract Management",
    description: "Professional lease agreements and renewals"
  },
  {
    title: "Property Inspections",
    description: "Regular inspections to maintain property value"
  }
];

export function RentalManagementPage() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-6">
            <Home className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-white mb-6">Rental Property Management</h1>
          <p className="text-blue-100 text-xl">
            Professional management so you can enjoy the returns without the hassle
          </p>
        </div>
      </section>

      {/* What We Manage */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-gray-900 mb-12 text-center">What We Manage</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div key={index} className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-gray-900 mb-2">{service.title}</h3>
                    <p className="text-gray-600">{service.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-gray-900 mb-12 text-center">Why Choose Our Management Service</h2>
          
          <div className="space-y-6">
            <div className="p-6 bg-white rounded-xl border border-gray-200">
              <h3 className="text-gray-900 mb-3">Save Time & Stress</h3>
              <p className="text-gray-600">
                Let professionals handle tenant issues, maintenance calls, and rent collection while you focus on other priorities.
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl border border-gray-200">
              <h3 className="text-gray-900 mb-3">Maximize Occupancy</h3>
              <p className="text-gray-600">
                Our efficient tenant placement process minimizes vacancy periods and ensures steady rental income.
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl border border-gray-200">
              <h3 className="text-gray-900 mb-3">Protect Your Investment</h3>
              <p className="text-gray-600">
                Regular inspections and preventive maintenance preserve and increase your property value over time.
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl border border-gray-200">
              <h3 className="text-gray-900 mb-3">Transparent Reporting</h3>
              <p className="text-gray-600">
                Monthly digital reports keep you informed about property performance, expenses, and tenant status.
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl border border-gray-200">
              <h3 className="text-gray-900 mb-3">Perfect for Diaspora Investors</h3>
              <p className="text-gray-600">
                Manage your Cameroon property remotely with complete peace of mind and professional oversight.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-white mb-6">Let Us Manage Your Property</h2>
          <p className="text-blue-100 text-lg mb-8">
            Professional, reliable, and transparent rental property management.
          </p>
          <button className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors">
            Get Started
          </button>
        </div>
      </section>
    </div>
  );
}
