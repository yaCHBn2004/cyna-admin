import React from "react";
import { useLocation } from "react-router-dom";
import SignInForm from "../features/profile/SignInForm";
import image2 from "../assets/images/4.jpg";

const AuthPage = () => {
  const location = useLocation();

  const quote =
    '"Votre image de marque, c’est ce que les gens disent de vous quand vous n’êtes pas dans la pièce." – Jeff Bezos';

  return (
    <div className="w-full h-screen flex flex-col md:flex-row">
      {/* Left image section (hidden on small screens) */}
      <div
        className="hidden md:block md:w-1/2 h-full bg-cover bg-center relative"
        style={{ backgroundImage: `url(${image2})` }}
      >
        <div className="absolute inset-0 bg-gray-800/30" />
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white italic text-sm md:text-base text-center max-w-sm">
          {quote}
        </div>
      </div>

      {/* Form section (full width on mobile) */}
      <div className="w-full md:w-1/2 h-full flex items-center justify-center px-6 bg-[var(--primBg)]">
        <div className="w-full max-w-md bg-white/90 md:bg-transparent backdrop-blur-md md:backdrop-blur-lg rounded-2xl shadow-lg p-8">
          <SignInForm />
          <p className="italic font-light text-center text-gray-600 text-sm mt-6 md:hidden">
            {quote}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
