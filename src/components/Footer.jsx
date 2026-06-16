import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Share2,
  MessageCircle,
} from "lucide-react";
import { categorias } from "../data/categorias";
import { TextHoverEffect, FooterBackgroundGradient } from "./TextHoverEffect";

const linksAyuda = [
  { label: "Preguntas frecuentes", href: "#" },
  { label: "Cómo cuidar tu planta", href: "#" },
  { label: "Envíos y entregas", href: "#" },
];

const contactInfo = [
  {
    icon: <Mail size={18} className="text-accent" />,
    text: "hola@viverotakumi.com",
    href: "mailto:hola@viverotakumi.com",
  },
  {
    icon: <Phone size={18} className="text-accent" />,
    text: "(011) 4567-8900",
    href: "tel:+541145678900",
  },
  {
    icon: <MapPin size={18} className="text-accent" />,
    text: "Ruta 8 km 45, Buenos Aires",
  },
];

const socialLinks = [
  { icon: <Globe size={20} />, label: "Sitio web", href: "#" },
  { icon: <Share2 size={20} />, label: "Redes sociales", href: "#" },
  { icon: <MessageCircle size={20} />, label: "WhatsApp", href: "#" },
];

// Footer de la tienda con enlaces, contacto y efecto hover en el nombre de marca
export default function Footer() {
  return (
    <footer className="bg-primary text-white/70 relative overflow-hidden mt-16">
      <FooterBackgroundGradient />

      <div className="max-w-7xl mx-auto px-6 py-14 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-white text-2xl font-bold">
              <span>🌿</span>
              Vivero Takumi
            </div>
            <p className="text-sm leading-relaxed">
              Tu vivero de confianza: plantas de interior, exterior, suculentas,
              aromáticas y frutales para llenar de vida tu hogar.
            </p>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wide mb-4">
              Categorías
            </h4>
            <ul className="space-y-3 text-sm">
              {categorias.map((categoria) => (
                <li key={categoria}>
                  <Link
                    to={`/catalogo?categoria=${encodeURIComponent(categoria)}`}
                    className="hover:text-white transition-colors"
                  >
                    {categoria}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wide mb-4">
              Ayuda
            </h4>
            <ul className="space-y-3 text-sm">
              {linksAyuda.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wide mb-4">
              Contacto
            </h4>
            <ul className="space-y-4 text-sm">
              {contactInfo.map((item) => (
                <li key={item.text} className="flex items-center gap-3">
                  {item.icon}
                  {item.href ? (
                    <a
                      href={item.href}
                      className="hover:text-white transition-colors"
                    >
                      {item.text}
                    </a>
                  ) : (
                    <span>{item.text}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr className="border-t border-white/10 my-8" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
          <div className="flex gap-5">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="hover:text-white transition-colors"
              >
                {social.icon}
              </a>
            ))}
          </div>
          <p>Vivero Takumi. Todos los derechos reservados.</p>
        </div>
      </div>

      <div className="hidden lg:flex h-48 -mt-16 relative z-10">
        <TextHoverEffect text="Vivero Takumi" />
      </div>
    </footer>
  );
}
