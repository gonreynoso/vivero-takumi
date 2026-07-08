const DIMENSION_MAXIMA = 1200
const CALIDAD_WEBP = 0.85

export function convertirAWebp(archivo, calidad = CALIDAD_WEBP) {
  return new Promise((resolve, reject) => {
    const lector = new FileReader()
    lector.onerror = () => reject(lector.error)
    lector.onload = () => {
      const imagen = new Image()
      imagen.onerror = () => reject(new Error('No se pudo leer la imagen'))
      imagen.onload = () => {
        let { width, height } = imagen
        if (width > DIMENSION_MAXIMA || height > DIMENSION_MAXIMA) {
          const escala = DIMENSION_MAXIMA / Math.max(width, height)
          width = Math.round(width * escala)
          height = Math.round(height * escala)
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        canvas.getContext('2d').drawImage(imagen, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('No se pudo convertir la imagen a WebP'))
              return
            }
            const lectorBlob = new FileReader()
            lectorBlob.onerror = () => reject(lectorBlob.error)
            lectorBlob.onload = () =>
              resolve({ dataUrl: lectorBlob.result, tamanoOriginal: archivo.size, tamanoFinal: blob.size })
            lectorBlob.readAsDataURL(blob)
          },
          'image/webp',
          calidad
        )
      }
      imagen.src = lector.result
    }
    lector.readAsDataURL(archivo)
  })
}
