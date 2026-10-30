# Reto Saludable

Juego educativo web sobre alimentación saludable desarrollado con HTML, CSS y JavaScript puro.

## Probar
1. Extrae el ZIP.
2. Abre `index.html` en Chrome, Edge o Firefox.
3. Elige una respuesta y pulsa **Comprobar respuesta**. Solo las correctas dan fichas y revelan una pieza.

## Personalizar
Edita el arreglo `QUESTIONS` al inicio de `script.js`. Cada objeto contiene categoría, pregunta, pista, cuatro opciones, índice de la respuesta correcta (`correct`, empieza en 0), recompensa (`reward`) y explicación.

La imagen de ejemplo es `puzzle-image.svg`. El rompecabezas muestra ocho piezas que revelan progresivamente esa imagen.

## Publicar gratis con Vercel
1. Sube estos archivos a un repositorio de GitHub.
2. Entra en https://vercel.com/ y elige **Add New → Project**.
3. Importa el repositorio y pulsa **Deploy**. No requiere comando de compilación ni framework.
4. Comparte la URL que Vercel genere.

También puedes usar Netlify Drop: https://app.netlify.com/drop

Contenido educativo general; revisa las preguntas según la edad y el objetivo de tu grupo.


## Dificultad progresiva
- **Nivel 1 — Fácil (preguntas 1 y 2):** reconocer alimentos y hábitos básicos. Recompensa: 1 ficha por acierto.
- **Nivel 2 — Intermedio (preguntas 3 a 5):** relacionar nutrientes con sus funciones y aplicar ideas de alimentación equilibrada. Recompensa: 2 fichas por acierto.
- **Nivel 3 — Difícil (preguntas 6 a 8):** analizar etiquetas y resolver situaciones de seguridad alimentaria y decisiones cotidianas. Recompensa: 3 fichas por acierto.

La dificultad y las recompensas se configuran en cada pregunta del arreglo `QUESTIONS` dentro de `script.js`.
