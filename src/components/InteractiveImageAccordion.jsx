import { useState } from 'react'

// Item individual del accordion de imágenes: se expande al pasar el mouse
function AccordionItem({ item, isActive, onMouseEnter, onClick }) {
  return (
    <div
      className={`relative h-[60vh] md:h-[65vh] rounded-2xl overflow-hidden cursor-pointer transition-all duration-700 ease-in-out ${
        isActive ? 'w-[280px] md:w-[380px]' : 'w-[50px] md:w-[60px]'
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
        className={`absolute text-white text-lg font-semibold whitespace-nowrap transition-all duration-300 ease-in-out ${
          isActive
            ? 'bottom-6 left-1/2 -translate-x-1/2 rotate-0'
            : 'w-auto text-left bottom-24 left-1/2 -translate-x-1/2 rotate-90'
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
  onButtonClick,
  onItemClick,
}) {
  const [activeIndex, setActiveIndex] = useState(items.length - 1)

  return (
    <section className="min-h-[calc(100vh-4rem)] flex items-center">
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
          <div className="flex flex-row items-center justify-center gap-3 overflow-x-auto p-4">
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
    </section>
  )
}
