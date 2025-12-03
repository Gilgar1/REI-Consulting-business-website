import { Target, Eye, Award, User, Lightbulb } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

const values = [
  {
    icon: Award,
    title: "Integrity",
    description: "Real estate built on truth."
  },
  {
    icon: Lightbulb,
    title: "Competence",
    description: "Deep knowledge, continuous learning, technical mastery."
  },
  {
    icon: User,
    title: "Professionalism",
    description: "Quality, respect, and excellence."
  },
  {
    icon: Eye,
    title: "Transparency",
    description: "Zero hidden practices, zero surprises."
  },
  {
    icon: Target,
    title: "Technology",
    description: "Modern, efficient, data-informed solutions."
  }
];

const approachSteps = [
  "Understanding your needs",
  "Providing professional guidance",
  "Verifying property & documentation",
  "Strategic planning",
  "Loan or acquisition support",
  "Post-acquisition help"
];

export function AboutPage() {
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-white mb-6">About REI Consulting Firm</h1>
          <p className="text-blue-100 text-xl leading-relaxed">
            REI Consulting Firm is a modern, integrity-led real estate consulting practice based in Yaoundé, Cameroon. We specialize in helping individuals, diaspora investors, and businesses navigate the complex realities of Cameroon's property market — safely and efficiently.
          </p>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-gray-900 mb-6">We exist to solve one core problem:</h2>
          <p className="text-gray-700 text-xl leading-relaxed mb-4">
            Too many people lose money in real estate because of fraud, poor documentation, or lack of expert guidance.
          </p>
          <p className="text-blue-600 text-xl">
            Our mission is to change that.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="p-8 bg-white rounded-xl border border-gray-200">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-gray-900 mb-4">Mission</h2>
              <p className="text-gray-700 leading-relaxed">
                To bring professionalism, transparency, and data-driven solutions into the Cameroonian real estate ecosystem — empowering clients to make safer, smarter, and more profitable property decisions.
              </p>
            </div>

            <div className="p-8 bg-white rounded-xl border border-gray-200">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Eye className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-gray-900 mb-4">Vision</h2>
              <p className="text-gray-700 leading-relaxed">
                To become Africa's most trusted real estate consulting brand — grounded in integrity, powered by technology, and expanding from Cameroon to the world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-gray-900 mb-12 text-center">Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="flex gap-4 p-6 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-gray-900 mb-2">{value.title}</h3>
                    <p className="text-gray-600 text-sm">{value.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-gray-900 mb-6 text-center">Our Approach</h2>
          <p className="text-gray-700 text-center mb-12 text-lg">
            Every client receives a structured process:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {approachSteps.map((step, index) => (
              <div key={index} className="flex items-center gap-4 p-6 bg-white rounded-lg border border-gray-200">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center">
                  {index + 1}
                </div>
                <span className="text-gray-700">{step}</span>
              </div>
            ))}
          </div>

          <p className="text-gray-700 text-center mt-12 text-lg">
            Our consulting is personalized, hands-on, and deeply methodical.
          </p>
        </div>
      </section>

      {/* The Founder */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-gray-900 mb-4">The Founder</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 text-center text-white">
                <div className="w-32 h-32 bg-white/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <User className="w-16 h-16" />
                </div>
                <h3 className="mb-2">Ndah Gilgar M</h3>
                <div className="text-blue-100 text-sm space-y-1">
                  <p>Software Engineer</p>
                  <p>Real Estate Consultant</p>
                  <p>Investment Strategist</p>
                  <p className="mt-4">Based in Yaoundé, Cameroon</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Gilgar combines:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-gray-700">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Software engineering</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-700">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Real estate consulting</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-700">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Loan system knowledge (CFC)</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-700">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Market intelligence</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-700">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Content creation</span>
                  </li>
                </ul>
              </div>

              <p className="text-gray-700 leading-relaxed">
                His unique advantage is the ability to merge technology, data, and on-ground real estate experience — providing a fresh, modern, trustworthy approach.
              </p>

              <div className="p-6 bg-blue-50 rounded-lg border-l-4 border-blue-600">
                <h3 className="text-gray-900 mb-3">Why I Started REI Consulting Firm</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  I saw how many people — especially young professionals, diaspora families, and retirees — were being misled, overcharged, or defrauded when trying to buy land or secure funding.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  I wanted to build a consulting firm based on:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-gray-700">
                    <span className="text-blue-600">✓</span>
                    <span>Truth</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <span className="text-blue-600">✓</span>
                    <span>Professionalism</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <span className="text-blue-600">✓</span>
                    <span>Modern systems</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <span className="text-blue-600">✓</span>
                    <span>And genuine care for clients</span>
                  </li>
                </ul>
                <p className="text-blue-600 mt-4">
                  That is what REI Consulting stands for.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
