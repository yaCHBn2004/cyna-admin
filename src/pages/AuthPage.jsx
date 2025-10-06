import React from "react";
import { useLocation } from "react-router-dom";
import SignInForm from "../features/profile/SignInForm";
import image2 from "../assets/images/4.jpg";

const AuthPage = () => {
  const location = useLocation();

  const quote =
    '"Votre image de marque, c’est ce que les gens disent de vous quand vous n’êtes pas dans la pièce." – Jeff Bezos';

  return (
  <div
  className="w-full h-screen bg-center flex items-center justify-center relative"
  style={{
    backgroundImage: window.innerWidth >= 768 ? `url(${image2})` : "bg-[var(--primBg)]",
    backgroundSize: "cover",
  }}
>

      {/* Overlay */}
      <div className="absolute inset-0 md:bg-gray-800/30" />

      {/* Form container */}
      <div className="relative z-10 w-full max-w-md p-8 bg-[var(--primBg)] md:mr-[50%] backdrop-blur-lg rounded-2xl md:shadow-lg">
        <SignInForm />
        <p className="italic font-light text-center text-gray-600 text-sm mt-6">
          {quote}
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
