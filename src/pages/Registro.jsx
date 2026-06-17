import { useState } from "react";
import { Link } from "react-router-dom";
import {
  UserPlus,
  User,
  Mail,
  Lock,
  MailCheck,
  Phone,
  MapPin,
  Building2,
  IdCard,
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";

const camposIniciales = {
  nombre: "",
  apellido: "",
  telefono: "",
  email: "",
  repetirEmail: "",
  password: "",
  repetirPassword: "",
  direccion: "",
  ciudad: "",
  dni: "",
};

// Alta de cuenta pública. El rol siempre queda "cliente" (lo fuerza el trigger
// on_auth_user_created en Supabase) y la cuenta se activa al confirmar el mail.
export default function Registro() {
  const [form, setForm] = useState(camposIniciales);
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.email !== form.repetirEmail) {
      setError("Los emails no coinciden");
      return;
    }
    if (form.password !== form.repetirPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setEnviando(true);
    const { error: errorSignUp } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          nombre: form.nombre,
          apellido: form.apellido,
          telefono: form.telefono,
          direccion: form.direccion,
          ciudad: form.ciudad,
          dni: form.dni,
        },
        emailRedirectTo: `${window.location.origin}/login`,
      },
    });
    setEnviando(false);
    if (errorSignUp) {
      setError(errorSignUp.message);
      return;
    }
    setEnviado(true);
  };

  if (enviado) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm bg-gradient-to-b from-white to-background rounded-3xl shadow-xl p-8 flex flex-col items-center text-center border border-accent/20">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary mb-6 shadow-lg">
            <MailCheck className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-semibold mb-2 text-gray-800">Revisá tu correo</h2>
          <p className="text-gray-500 text-sm mb-6">
            Te enviamos un mail a <strong>{form.email}</strong> para confirmar tu cuenta. Una vez
            confirmada, ya podés iniciar sesión.
          </p>
          <Link to="/login" className="text-primary text-sm font-medium hover:underline">
            Volver a ingresar
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md bg-gradient-to-b from-white to-background rounded-3xl shadow-xl p-8 flex flex-col items-center border border-accent/20">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary mb-6 shadow-lg">
          <UserPlus className="w-7 h-7 text-white" />
        </div>
        <h2 className="text-2xl font-semibold mb-2 text-center text-gray-800">Creá tu cuenta</h2>
        <p className="text-gray-500 text-sm mb-6 text-center">
          Sumate a Vivero Takumi para comprar y seguir tus pedidos.
        </p>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <User className="w-4 h-4" />
              </span>
              <input
                name="nombre"
                placeholder="Nombre"
                value={form.nombre}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent bg-gray-50 text-sm"
              />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <User className="w-4 h-4" />
              </span>
              <input
                name="apellido"
                placeholder="Apellido"
                value={form.apellido}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent bg-gray-50 text-sm"
              />
            </div>
          </div>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <IdCard className="w-4 h-4" />
            </span>
            <input
              name="dni"
              placeholder="DNI"
              value={form.dni}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent bg-gray-50 text-sm"
            />
          </div>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Phone className="w-4 h-4" />
            </span>
            <input
              type="tel"
              name="telefono"
              placeholder="Teléfono"
              value={form.telefono}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent bg-gray-50 text-sm"
            />
          </div>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Mail className="w-4 h-4" />
            </span>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent bg-gray-50 text-sm"
            />
          </div>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Mail className="w-4 h-4" />
            </span>
            <input
              type="email"
              name="repetirEmail"
              placeholder="Repetir email"
              value={form.repetirEmail}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent bg-gray-50 text-sm"
            />
          </div>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <MapPin className="w-4 h-4" />
            </span>
            <input
              name="direccion"
              placeholder="Dirección"
              value={form.direccion}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent bg-gray-50 text-sm"
            />
          </div>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Building2 className="w-4 h-4" />
            </span>
            <input
              name="ciudad"
              placeholder="Ciudad"
              value={form.ciudad}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent bg-gray-50 text-sm"
            />
          </div>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Lock className="w-4 h-4" />
            </span>
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent bg-gray-50 text-sm"
            />
          </div>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Lock className="w-4 h-4" />
            </span>
            <input
              type="password"
              name="repetirPassword"
              placeholder="Repetir contraseña"
              value={form.repetirPassword}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent bg-gray-50 text-sm"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={enviando}
            className="w-full bg-gradient-to-b from-accent to-primary text-white font-medium py-2.5 rounded-xl shadow hover:brightness-105 transition mt-2 disabled:opacity-60"
          >
            {enviando ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-5">
          ¿Ya tenés cuenta?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Ingresá
          </Link>
        </p>
      </div>
    </div>
  );
}
