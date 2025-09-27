import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';


import SignInForm from '../features/profile/SignInForm';
import image from '../assets/images/signIn2.jpg';
const AuthPage = () => {
  const location = useLocation();


 
  const quote = '"Votre image de marque, c’est ce que les gens disent de vous quand vous n’êtes pas dans la pièce." – Jeff Bezos';

  return (
    <div
      className={`w-full h-screen flex bg-gray-100 relative `}
    >
      {/* Image Section (hidden on small screens) */}
      <div
        className="hidden md:block w-1/2 h-full bg-cover bg-center relative"
        style={{ backgroundImage: `url(${image})` }}
      >
        <div className="absolute inset-0 bg-black/40 flex items-end justify-center text-white p-6">
          <p className="italic font-light text-center text-sm md:text-base max-w-sm">
            {quote}
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="w-full md:w-1/2 h-full flex items-center justify-center px-6 overflow-y-auto">
        <div className="w-full max-w-md">
          < SignInForm/>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
