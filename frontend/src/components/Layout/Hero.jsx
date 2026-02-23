import heroImg from "../../assets/rabbit-hero.webp";
import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative">
      <img
        src={heroImg}
        alt="Rabbit"
        className="w-full h-[400px] md:h-[600px] lg:h-[750px] object-cover"
      />

      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center text-white px-4">
        <h1 className="text-4xl md:text-7xl lg:text-9xl font-bold tracking-tighter uppercase mb-4">
          Vacation <br /> Ready
        </h1>

        <p className="text-sm md:text-lg tracking-tight mb-6 max-w-xl">
          Explore our vacation-ready outfits with fast worldwide shipping.
        </p>

        <Link
          to="/collections/all"
          className="bg-white text-gray-950 px-6 py-2 rounded-sm text-lg font-medium hover:bg-gray-200 transition"
        >
          Shop Now
        </Link>
      </div>
    </section>
  );
};

export default Hero;
