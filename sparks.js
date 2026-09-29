// Función para mostrar las imágenes de sparks
function showSparks() {
  const buttonRect = generateButton.getBoundingClientRect(); // Obtener la posición del botón
  const bodyRect = document.body.getBoundingClientRect(); // Obtener los límites del body
  const sparks = document.querySelectorAll(".spark");
  sparks.forEach((spark) => {
    spark.style.display = "block"; // Mostrar los sparks
  });

  for (let i = 0; i < 50; i++) {
    // Ajusta el número de sparks según sea necesario
    const spark = document.createElement("img");
    spark.src = "img/spark2.png"; // Reemplaza con la ruta correcta de tu imagen de spark
    spark.classList.add("spark");
    document.body.appendChild(spark);

    // Colocar el spark en la posición del botón
    spark.style.left = `${buttonRect.left + buttonRect.width / 2}px`;
    spark.style.top = `${buttonRect.top + buttonRect.height / 2}px`;

    // Mover el spark a una posición aleatoria alrededor del botón dentro de los límites del body
    const angle = Math.random() * 2 * Math.PI;
    const radius = Math.random() * 300 + 50; // Ajusta el radio según sea necesario
    const offsetX = radius * Math.cos(angle);
    const offsetY = radius * Math.sin(angle);

    const targetX = buttonRect.left + buttonRect.width / 2 + offsetX;
    const targetY = buttonRect.top + buttonRect.height / 2 + offsetY;

    // Asegurarse de que el spark no se salga de los límites del body
    const maxX = bodyRect.width - spark.width;
    const maxY = bodyRect.height - spark.height;

    spark.style.left = `${Math.min(Math.max(targetX, 0), maxX)}px`;
    spark.style.top = `${Math.min(Math.max(targetY, 0), maxY)}px`;

    // Animar el spark a la nueva posición
    spark.style.transform = `translate(${offsetX}px, ${offsetY}px)`;

    // Eliminar el spark después de la animación
    spark.addEventListener("animationend", () => {
      spark.remove();
    });
  }
}

// Definición de la función hideSparks
function hideSparks() {
  const sparks = document.querySelectorAll(".spark");
  sparks.forEach((spark) => {
    spark.style.display = "none";
  });
}