import { useEffect } from 'react'

const styles = `
.chronicleButton {
  border-radius: var(--chronicle-button-border-radius);
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  line-height: 1;
  padding: 1rem 1.232rem;
  cursor: pointer;
  border: none;
  font-weight: 700;
  background: var(--chronicle-button-background);
  color: var(--chronicle-button-foreground);
  transition: background 0.4s linear, color 0.4s linear;
  will-change: background, color;
  position: relative;
}
.chronicleButton:hover {
  background: var(--chronicle-button-hover-background);
  color: var(--chronicle-button-hover-foreground);
}
.chronicleButton span {
  position: relative;
  display: block;
  perspective: 108px;
}
.chronicleButton span:nth-of-type(2) {
  position: absolute;
}
.chronicleButton em {
  font-style: normal;
  display: inline-block;
  font-size: 1.025rem;
  color: inherit;
  will-change: transform, opacity, color, transition;
  transition: transform 0.55s cubic-bezier(.645,.045,.355,1), opacity 0.35s linear 0.2s, color 0.4s linear;
}
.chronicleButton span:nth-of-type(1) em {
  transform-origin: top;
}
.chronicleButton span:nth-of-type(2) em {
  opacity: 0;
  transform: rotateX(-90deg) scaleX(.9) translate3d(0,10px,0);
  transform-origin: bottom;
}
.chronicleButton:hover span:nth-of-type(1) em {
  opacity: 0;
  transform: rotateX(90deg) scaleX(.9) translate3d(0,-10px,0);
}
.chronicleButton:hover span:nth-of-type(2) em {
  opacity: 1;
  transform: rotateX(0deg) scaleX(1) translateZ(0);
  transition: transform 0.75s cubic-bezier(.645,.045,.355,1), opacity 0.35s linear 0.3s, color 0.4s linear;
}
`

export function ChronicleButton({
  text,
  onClick,
  hoverColor = '#52b788',
  width = '160px',
  borderRadius = '8px',
  customBackground = '#fff',
  customForeground = '#111014',
  hoverForeground = '#fff',
}) {
  useEffect(() => {
    if (!document.getElementById('chronicle-button-style')) {
      const style = document.createElement('style')
      style.id = 'chronicle-button-style'
      style.innerHTML = styles
      document.head.appendChild(style)
    }
  }, [])

  const buttonStyle = {
    '--chronicle-button-background': customBackground,
    '--chronicle-button-foreground': customForeground,
    '--chronicle-button-hover-background': hoverColor,
    '--chronicle-button-hover-foreground': hoverForeground,
    '--chronicle-button-border-radius': borderRadius,
    width,
    borderRadius,
  }

  return (
    <button className="chronicleButton" onClick={onClick} style={buttonStyle} type="button">
      <span>
        <em>{text}</em>
      </span>
      <span>
        <em>{text}</em>
      </span>
    </button>
  )
}
