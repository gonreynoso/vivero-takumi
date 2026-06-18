import { useState } from 'react'

// Item individual del accordion de imágenes: se expande al pasar el mouse
function AccordionItem({ item, isActive, onMouseEnter, onClick }) {
  return (
    <div
      className={`relative w-32 h-72 md:h-[65vh] rounded-2xl overflow-hidden cursor-pointer snap-center shrink-0 transition-all duration-700 ease-in-out ${
        isActive ? 'md:w-[380px]' : 'md:w-[60px]'
      }`}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      <img
        src={item.imagen}
        alt={item.titulo}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/30" />

      <span
        className={`absolute text-white text-base md:text-lg font-semibold whitespace-nowrap transition-all duration-300 ease-in-out bottom-6 left-1/2 -translate-x-1/2 rotate-0 ${
          isActive ? '' : 'md:bottom-24 md:rotate-90'
        }`}
      >
        {item.titulo}
      </span>
    </div>
  )
}

// Hero con accordion de imágenes interactivo, pensado para ocupar la pantalla completa
export default function InteractiveImageAccordion({
  topText,
  mainText,
  subText,
  buttonText,
  items,
  beneficios,
  onButtonClick,
  onItemClick,
}) {
  const [activeIndex, setActiveIndex] = useState(items.length - 1)

  return (
    <section className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center gap-10 py-10">
      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="w-full md:w-1/2 text-center md:text-left">
          {topText && (
            <span className="inline-flex bg-primary/10 text-primary text-xs font-medium px-3 py-1.5 rounded-full mb-4">
              {topText}
            </span>
          )}
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight tracking-tight">
            {mainText}
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-xl mx-auto md:mx-0">{subText}</p>
          <div className="mt-8">
            <button
              onClick={onButtonClick}
              className="inline-block bg-primary text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-primary/90 transition-colors duration-300"
            >
              {buttonText}
            </button>
          </div>
        </div>

        <div className="w-full md:w-1/2">
          <div className="flex flex-row items-center md:justify-center gap-3 overflow-x-auto snap-x snap-mandatory p-4">
            {items.map((item, index) => (
              <AccordionItem
                key={item.titulo}
                item={item}
                isActive={index === activeIndex}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => onItemClick && onItemClick(item)}
              />
            ))}
          </div>
        </div>
      </div>

      {beneficios && (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {beneficios.map((beneficio) => (
            <div
              key={beneficio.titulo}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col items-center text-center gap-2"
            >
              <span className="text-3xl">{beneficio.icono}</span>
              <h3 className="font-semibold text-gray-800">{beneficio.titulo}</h3>
              <p className="text-sm text-gray-500">{beneficio.descripcion}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
