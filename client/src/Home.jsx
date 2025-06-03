import React from "react";
import { Link } from "react-router-dom";
import {
  FaMapMarkedAlt,
  FaPlug,
  FaUserShield,
  FaSignInAlt,
  FaSearchLocation,
  FaClock,
  FaChartLine,
} from "react-icons/fa";

const Home = () => {
  return (
    <>
      {/* Fixed Dark Gradient Background */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background:
            "linear-gradient(135deg, #000000, #121212, #1c1c1c, #000000)", // black gradient shades
          backgroundAttachment: "fixed",
        }}
      ></div>

      <div className="flex flex-col min-h-screen text-white font-sans relative">
        {/* Navbar (not fixed) */}
        <header className="w-full">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <Link
              to="/"
              className="text-3xl font-extrabold text-green-400 tracking-wide"
            >
              ElectroWay
            </Link>
            
          </div>
        </header>

        {/* Hero Section */}
        <section className="h-screen flex flex-col items-center justify-center px-6 text-center pt-20 space-y-8">
          <div className="max-w-3xl space-y-6">
            <h1 className="text-5xl md:text-6xl font-extrabold text-green-400 drop-shadow-lg">
              Power Your Journey with Smart EV Charging
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-xl mx-auto drop-shadow-md">
              Find stations nearby, book your charging slot, and drive on with
              confidence.
            </p>
          </div>

          {/* Login & Signup Buttons in center */}
          <div className="flex space-x-6">
            <Link
              to="/login"
              className="px-7 py-3 border border-green-400 rounded-lg text-green-400 font-semibold hover:bg-green-400 hover:text-black transition"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              className="px-7 py-3 bg-green-400 rounded-lg text-black font-semibold hover:bg-green-500 transition"
            >
              Sign Up
            </Link>
          </div>
        </section>

       {/* About Section */}
<section className="min-h-screen flex flex-col items-center justify-center px-6 text-gray-300">
  <div className="max-w-3xl bg-gray-900 bg-opacity-80 rounded-lg p-10 shadow-lg text-center">
    <h2 className="text-4xl font-bold text-green-400 mb-8">About Us</h2>

    <p className="mb-6 text-lg leading-relaxed">
      Welcome to our platform! We are dedicated to providing you with the best
      experience possible. Our goal is to deliver reliable, user-friendly services that
      help you achieve your goals efficiently and effectively.
    </p>

    <p className="mb-6 text-lg leading-relaxed">
      Our team is passionate about innovation and continuously improving the features
      we offer. Whether you are here to log in, explore, or manage your account, we
      strive to make your journey seamless and enjoyable.
    </p>

    <p className="text-lg leading-relaxed">
      If you have any questions or feedback, don’t hesitate to reach out. Thank you for
      choosing us!
    </p>
  </div>
</section>



        {/* How to Track Section */}
<section className="h-screen flex flex-col items-center justify-center px-6 text-center">
  <div className="max-w-4xl">
    <h2 className="text-4xl font-bold text-green-300 mb-8">How to Track</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
      <div className="p-6 rounded-xl shadow-md hover:shadow-lg transition bg-gray-800 bg-opacity-30">
        <FaSignInAlt className="text-green-400 text-3xl mb-3" />
        <h3 className="text-2xl font-semibold text-green-300 mb-3">
          1. Log In
        </h3>
        <p className="text-gray-300">
          Securely log in to your EVCharge account to get started.
        </p>
      </div>
      <div className="p-6 rounded-xl shadow-md hover:shadow-lg transition bg-gray-800 bg-opacity-30">
        <FaMapMarkedAlt className="text-green-400 text-3xl mb-3" />
        <h3 className="text-2xl font-semibold text-green-300 mb-3">
          2. Allow Location Access
        </h3>
        <p className="text-gray-300">
          Enable location permissions in your browser to find nearby charging stations.
        </p>
      </div>
      <div className="p-6 rounded-xl shadow-md hover:shadow-lg transition bg-gray-800 bg-opacity-30">
        <FaPlug className="text-green-400 text-3xl mb-3" />
        <h3 className="text-2xl font-semibold text-green-300 mb-3">
          3. Browse Nearby Stations
        </h3>
        <p className="text-gray-300">
          View a list and map of charging stations close to your location.
        </p>
      </div>
      <div className="p-6 rounded-xl shadow-md hover:shadow-lg transition bg-gray-800 bg-opacity-30">
        <FaUserShield className="text-green-400 text-3xl mb-3" />
        <h3 className="text-2xl font-semibold text-green-300 mb-3">
          4. Save Stations for Later
        </h3>
        <p className="text-gray-300">
          Save your favorite stations to your profile for quick access anytime.
        </p>
      </div>
    </div>
  </div>
</section>


        {/* Footer */}
        <footer className=" text-gray-400 text-center py-6 text-sm mt-auto">
          &copy; {new Date().getFullYear()} ElectroWay. All rights reserved.
        </footer>
      </div>
    </>
  );
};

export default Home;
