import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function SupportPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-[#803C9A] to-[#FA4B99] bg-clip-text text-transparent">
            Support Center
          </h1>
          
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              How Can We Help?
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Contact Us</h3>
                <p className="text-gray-600">
                  For any questions or concerns, please email us at:{" "}
                  <a 
                    href="mailto:support@restrevivethrive.com" 
                    className="text-[#803C9A] hover:text-[#FA4B99] transition-colors"
                  >
                    support@restrevivethrive.com
                  </a>
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Response Time</h3>
                <p className="text-gray-600">
                  We aim to respond to all inquiries within 24-48 hours during business days.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Emergency Support</h3>
                <p className="text-gray-600">
                  If you're experiencing a medical emergency, please contact your local emergency services or visit the nearest emergency room.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  What is Rest Revive Thrive?
                </h3>
                <p className="text-gray-600">
                  Rest Revive Thrive is a platform dedicated to fibromyalgia awareness and empowering users with resources and tools for managing Fibromyalgia and CFS/ME.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  How can I book a consultation?
                </h3>
                <p className="text-gray-600">
                  You can book a consultation through our{" "}
                  <a 
                    href="/book-consultation" 
                    className="text-[#803C9A] hover:text-[#FA4B99] transition-colors"
                  >
                    consultation page
                  </a>
                  . Follow the simple steps to schedule your appointment.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  Are the resources free?
                </h3>
                <p className="text-gray-600">
                  Yes, most of our resources are freely available. Some specialized content or consultations may require payment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 