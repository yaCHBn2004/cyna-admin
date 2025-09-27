import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import InputAuth from "../../components/auth/InputAuth";
import { Eye, EyeOff } from "lucide-react";
import { Loader2 } from "lucide-react";
import googleLogo from "../../assets/icons/google.png";
import { signIn } from "../../services/auth";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Charger les credentials si "remember me" a été activé
  useEffect(() => {
    const savedEmail = localStorage.getItem("authEmail");
    const savedPassword = localStorage.getItem("authPassword");
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRemember(true);
    }
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Tous les champs sont obligatoires.");
      return;
    }

    setLoading(true);
    try {
      const res = await signIn({ email, password, remember });

      const token = res.token;
      const type = res.type;
      console.log("Type is:", type);
      localStorage.setItem("authToken", token);

      // Sauvegarder si remember est activé
      if (remember) {
        localStorage.setItem("authEmail", email);
        localStorage.setItem("authPassword", password);
      } else {
        localStorage.removeItem("authEmail");
        localStorage.removeItem("authPassword");
      }

      // Redirection selon type
      navigate("/admin/dashboard");
    } catch (error) {
      alert(error.message || "Erreur lors de la connexion.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    alert("Connexion Google à venir.");
  };

  // Gérer la touche "Enter"
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div
      className="flex flex-col w-full max-w-md gap-8 items-center px-4 sm:px-0"
      onKeyDown={handleKeyDown}
    >
      {/* Header */}
      <div className="w-full text-left">
        <h1 className="text-3xl font-bold text-primary">Welcome Back !</h1>
        <p className="text-secondary text-sm mt-1">
          Please enter log in details below
        </p>
      </div>

      {/* Inputs */}
      <div className="flex flex-col space-y-4 w-full">
        <InputAuth
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

       
        {/* Mot de passe avec toggle */}
<div className="relative">
  <InputAuth
    label="Mot de passe"
    type={showPassword ? "text" : "password"}
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />
  <button
    type="button"
    onClick={() => setShowPassword((prev) => !prev)}
    className="absolute right-3 top-[55%] text-gray-500 hover:text-gray-700"
  >
    {showPassword ? (
      <EyeOff className="w-5 h-5" />
    ) : (
      <Eye className="w-5 h-5" />
    )}
  </button>
</div>

      </div>

      {/* Remember me & Forgot password */}
      <div className="w-full flex items-center justify-between text-sm text-gray-600">
        <label className="flex items-center">
          <input
            type="checkbox"
            className="mr-2"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          Remember me
        </label>
        <Link to="/auth/forgot-password" className="text-primary hover:underline">
          Mot de passe oublié ?
        </Link>
      </div>

      {/* Submit & Google Auth */}
      <div className="flex flex-col gap-2 w-full">
        <button
          onClick={handleLogin}
          disabled={loading}
          className="bg-secondary text-white font-bold h-12 rounded-full w-full hover:bg-opacity-90 transition disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="animate-spin h-5 w-5 mx-auto" />
          ) : (
            "Se connecter"
          )}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-2 text-sm text-gray-500 my-2">
          <hr className="flex-grow border-gray-300" />
          <span>ou</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Google Auth */}
        <button
          onClick={handleGoogle}
          className="bg-main text-white font-semibold rounded-full flex items-center w-full h-12 justify-center space-x-3 hover:bg-opacity-90 transition"
        >
          <img src={googleLogo} alt="Google" className="w-5 h-5" />
          <span>Se connecter avec Google</span>
        </button>

        {/* Sign up link */}
        <div className="text-center text-sm text-gray-600 mt-4">
          Pas encore de compte ?{" "}
          <Link to="/auth/signup/general" className="text-primary font-medium hover:underline">
            Créer un compte
          </Link>
        </div>
      </div>
    </div>
  );
}
