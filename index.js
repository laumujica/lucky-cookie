let fortuneMessages = [];
let currentFortuneIndex = null;

// Función para cargar las frases según el idioma
function loadFortunes(language) {
  if (language === "es") {
    fortuneMessages = fortuneMessagesEs;
  } else {
    fortuneMessages = fortuneMessagesEn;
  }
}

// Obtener los elementos del DOM
const generateButton = document.querySelector(".generate-phrase");
const fortuneText = document.getElementById("fortune-text");
const modalF = document.getElementById("fortuneModal");
const closeModalF = document.querySelector(".close-fortune");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const shareButton = document.getElementById("share-button");
const viewButton = document.getElementById("view-button");
const closeModal = document.querySelector(".close");
const languageSwitch = document.getElementById("languageSwitch");
const revealMessageElement = document.getElementById("reveal-message");
const fortuneNumbersElement = document.getElementById("fortune-numbers");
const shareImageButton = document.getElementById("share-image-button");
const webShareButton = document.getElementById("web-share-button");
const audio = document.getElementById('audio');
const icon = document.getElementById('play-pause-icon');

icon.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        icon.src = 'img/boton-de-pausa.png'; // Cambia a la imagen de pausa
    } else {
        audio.pause();
        icon.src = 'img/boton-de-play.png'; // Cambia de nuevo a la imagen de play
    }
});

// Cargar el idioma inicial
let lang = languageSwitch.checked ? "en" : "es";
loadLanguage(lang);

// Cambiar el idioma al cambiar el switch
languageSwitch.addEventListener("change", () => {
  lang = languageSwitch.checked ? "en" : "es";
  loadLanguage(lang);
});

// Función para generar números aleatorios del 00 al 99 sin duplicados
function generateRandomNumbers() {
  const numbers = new Set();
  while (numbers.size < 6) {
    let number = Math.floor(Math.random() * 100);
    if (number < 10) number = "0" + number;
    numbers.add(number.toString());
  }
  return Array.from(numbers);
}

// Función para generar y mostrar una fortuna aleatoria junto con números aleatorios
function generateRandomFortune() {
  currentFortuneIndex = Math.floor(Math.random() * fortuneMessages.length);
  const randomFortune = fortuneMessages[currentFortuneIndex];
  if (randomFortune) {
    fortuneText.textContent = `"${randomFortune}"`;
    localStorage.setItem("todayFortuneIndex", currentFortuneIndex); // Guardar el índice de la fortuna del día
    localStorage.setItem("fortuneDate", new Date().toISOString().split("T")[0]); // Guardar la fecha de hoy
  } else {
    console.error(
      "No se pudo generar una fortuna. Verifique que las frases estén cargadas correctamente."
    );
  }

  // Generar números aleatorios y guardarlos
  const randomNumbers = generateRandomNumbers();
  localStorage.setItem("todayFortuneNumbers", randomNumbers.join(" ")); // Guardar los números en el almacenamiento local

  displayNumbers(); // Mostrar los números generados

  showShareButton(); // Mostrar el botón de compartir
}

// Función para mostrar los números guardados en el almacenamiento local
function displayNumbers() {
  const savedNumbers = localStorage.getItem("todayFortuneNumbers");
  if (savedNumbers) {
    const numbersArray = savedNumbers.split(" ");
    fortuneNumbersElement.innerHTML = ""; // Limpiar contenido previo

    numbersArray.forEach((number) => {
      const span = document.createElement("span");
      span.textContent = number;
      span.classList.add("number-style"); // Asignar la clase de estilo
      fortuneNumbersElement.appendChild(span);
    });
  }
}

// Función para cargar la fortuna del día al abrir la página
document.addEventListener("DOMContentLoaded", displayTodayFortune);

// Función para generar la imagen con el texto aleatorio y los números (cargados o generados)
function generateImage() {
  const language = localStorage.getItem("language") || "en";
  const backgroundImage = loadBackgroundImage(language);
  return new Promise((resolve, reject) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Crear una nueva imagen de fondo
    const img = new Image();
    img.onload = function () {
      // Establecer el tamaño del canvas al tamaño de la imagen
      canvas.width = img.width;
      canvas.height = img.height;

      // Dibujar la imagen de fondo en el canvas
      ctx.drawImage(img, 0, 0);

      // Estilos para el texto
      ctx.font = "60px Futura";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const text = fortuneText.textContent; // Obtener la frase aleatoria generada
      const x = canvas.width / 2;
      const y = canvas.height / 2 - 40; // Ajustar la posición vertical del texto

      // Ajustar el texto para que se divida en líneas si es muy largo
      const maxWidth = canvas.width - 100; // Ajusta el ancho máximo según sea necesario
      const lineHeightFactor = 1.55;
      const lineHeight = 50; // Ajusta la altura de la línea según sea necesario
      const lines = wrapText(ctx, text, x, y, maxWidth, lineHeight);

      // Calcular la posición y para cada línea de texto
      let textHeight = 0;
      lines.forEach((line, i) => {
        const offsetY = i * lineHeight * lineHeightFactor;
        ctx.fillText(line, x, y + offsetY);
        textHeight = offsetY + lineHeight; // Actualizar la altura del texto
      });

      // Obtener los números (cargados o generados)
      const savedNumbers = localStorage.getItem("todayFortuneNumbers");
      
      const numbersArray = savedNumbers
        ? savedNumbers.split(" ")
        : Array.from(document.querySelectorAll("#fortune-numbers span")).map(
            (span) => span.textContent
          );
      

      // Dibujar los números en la imagen
      const numbersY = canvas.height - 650; // Ajusta la posición vertical de los números

      numbersArray.forEach((number, index) => {
        ctx.font = "40px Futura"; // Ajustar el tamaño de la fuente para los números
        ctx.fillStyle = "lemonchiffon";
        const numbersX = canvas.width / 2 + (index - 2.5) * 100; // Ajustar la posición horizontal de cada número
        ctx.fillText(number, numbersX, numbersY);
      });

      // Crear una nueva imagen para el trébol
      const clover = new Image();
      clover.onload = function () {
        // Ajustar el tamaño del trébol
        const cloverWidth = 65; // Ajusta el ancho deseado
        const cloverHeight = 65; // Ajusta el alto deseado

        // Dibujar el trébol en el canvas después de los textos y números
        const cloverX = canvas.width - cloverWidth - 160; // Ajustar la posición horizontal del trébol
        const cloverY = canvas.height - cloverHeight - 620; // Ajustar la posición vertical del trébol
        ctx.drawImage(clover, cloverX, cloverY, cloverWidth, cloverHeight);

        resolve(); // Resolvemos la promesa después de completar la generación
      };

      // Manejar errores de carga de la imagen del trébol
      clover.onerror = function () {
        console.error("Error al cargar la imagen del trébol.");
        reject("Error al cargar la imagen del trébol.");
      };

      // Establecer la ruta de la imagen del trébol
      clover.src = "img/trebol.png";
    };

    // Manejar errores de carga de la imagen de fondo
    img.onerror = function () {
      console.error("Error al cargar la imagen de fondo.");
      reject("Error al cargar la imagen de fondo.");
    };

    // Establecer la ruta de la imagen de fondo
    img.src = backgroundImage;
  });
}

// Función para mostrar la fortuna del día si ya existe
function displayTodayFortune() {
  const savedIndex = localStorage.getItem("todayFortuneIndex");
  const savedDate = localStorage.getItem("fortuneDate");
  const today = new Date().toISOString().split("T")[0];

  if (savedIndex !== null && savedDate === today) {
    currentFortuneIndex = parseInt(savedIndex, 10);
    fortuneText.textContent = `"${fortuneMessages[currentFortuneIndex]}"`;
    showShareButton(); // Mostrar el botón de compartir si ya se ha revelado la fortuna

    // Mostrar los números aleatorios guardados
    const savedNumbers = localStorage.getItem("todayFortuneNumbers");
    if (savedNumbers) {
      const numbersArray = savedNumbers.split(" ");
      fortuneNumbersElement.innerHTML = ""; // Limpiar contenido previo

      numbersArray.forEach((number) => {
        const span = document.createElement("span");
        span.textContent = number;
        span.classList.add("number-style"); // Asignar la clase de estilo
        fortuneNumbersElement.appendChild(span);
      });
    }

    revealMessageElement.style.display = "none";
    fortuneText.style.display = "block";

    // Volver a generar la imagen con los números cargados
    generateImage(); // Llama a la función para generar la imagen con números cargados
  } else {
    // Mostrar un mensaje indicando que se necesita revelar la nueva fortuna del día
    fortuneText.textContent = fortuneMessages.reveal_message;
    fortuneNumbersElement.textContent = ""; // Limpiar números anteriores si es necesario
    /* hideShareButton();  */ // Esconder el botón de compartir si no hay fortuna del día
    revealMessageElement.style.display = "block";
    fortuneText.style.display = "none";
  }
}

// Función para comprobar si la galleta de la fortuna ya fue abierta hoy
function checkFortuneOpenedToday() {
  const lastOpened = localStorage.getItem("fortuneLastOpened");
  if (!lastOpened) return false;

  const lastOpenedDate = new Date(lastOpened);
  const today = new Date();

  // Comparar solo por día, ignorando la hora para que sea válido durante 24 horas
  return lastOpenedDate.toDateString() === today.toDateString();
}

// Función para registrar la fecha de apertura de la galleta de la fortuna
function setFortuneOpenedToday() {
  const today = new Date();
  localStorage.setItem("fortuneLastOpened", today.toString());

  // Eliminar la fortuna anterior si ya ha pasado el día
  const savedDate = localStorage.getItem("fortuneDate");
  const todayDate = today.toISOString().split("T")[0];

  if (savedDate !== todayDate) {
    localStorage.removeItem("todayFortuneIndex");
    localStorage.removeItem("fortuneDate");
    localStorage.removeItem("todayFortuneNumbers");
  }
}

// Función para manejar el clic en el botón "Revelar"
function handleButtonClick() {
  if (checkFortuneOpenedToday()) {
    // Mostrar el modal si la fortuna ya fue revelada hoy
    modalF.style.display = "flex";
  } else {
    // Generar y mostrar una nueva fortuna
    generateRandomFortune();
    setFortuneOpenedToday();
    languageSwitch.disabled = true; // Deshabilitar el cambio de idioma
    languageSwitch.classList.add("disabled"); // Añadir clase para estilo en escala de grises
    generateButton.disabled = false; // Habilitar el botón de revelar
    // Ocultar el mensaje de revelación y mostrar la fortuna
    revealMessageElement.style.display = "none";
    fortuneText.style.display = "block";
  }
}

// Añadir un evento de escucha al botón "Revelar"
generateButton.addEventListener("click", handleButtonClick);

// Función para cerrar el modal
closeModalF.addEventListener("click", () => {
  modalF.style.display = "none";
});

// Cerrar el modal si se hace clic fuera de él
window.addEventListener("click", (event) => {
  if (event.target === modalF) {
    modalF.style.display = "none";
  }
});

// Cargar el idioma preferido al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  const preferredLanguage = localStorage.getItem("language") || "en";
  loadLanguage(preferredLanguage);
  generateImage(preferredLanguage).then(() => {
    displayTodayFortune(); // Mostrar la fortuna del día si ya existe
  });

  // Actualizar el estado del switch
  const languageSwitch = document.getElementById("languageSwitch");
  languageSwitch.checked = preferredLanguage === "en"; // Cambiar según el idioma
  languageSwitch.setAttribute("data-label", preferredLanguage.toUpperCase());

  const today = new Date().toISOString().split("T")[0];
  const savedDate = localStorage.getItem("fortuneDate");

  // Deshabilitar el cambio de idioma si ya se ha revelado la fortuna hoy
  if (savedDate === today) {
    languageSwitch.disabled = true;
    languageSwitch.classList.add("disabled");
    /* generateButton.disabled = true; */
  }
});

// Función para cargar la imagen de fondo según el idioma
function loadBackgroundImage(language) {
  if (language === "es") {
    return "img/bg-imgES2.png"; // Ruta de la imagen en español
  } else if (language === "en") {
    return "img/bg-imgEN2.png"; // Ruta de la imagen en inglés
  } else {
    return "img/bg-imgES2.png"; // Ruta de la imagen por defecto
  }
}

// Verificar que las frases se carguen correctamente al cambiar el idioma
function loadLanguage(language) {
  fetch(`${language}.json`)
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("title-text").textContent = data.title;

      // Asignar el eslogan al contenedor correspondiente
      document.getElementById("slogan-desktop").textContent = data.slogan;
      document.getElementById("slogan-mobile").innerHTML = data.slogan_mobile;

      document.getElementById("reveal-button").textContent = data.reveal_button;
      document.getElementById("modal-message").innerHTML = data.modal_message;
      shareButton.textContent = data.share_button;
      viewButton.textContent = data.view_button;
      revealMessageElement.textContent = data.reveal_message;
      webShareButton.textContent = data.web_share_button;
      // Asignar textos desde JSON a las constantes
      text.title = data.title;
      text.text = data.slogan;

      image.title = data.title;
      image.text = data.slogan;

      shareTitle = data.title;
      shareText = data.slogan;

      // Cargar la imagen de fondo según el idioma
      const backgroundImage = data.background_image || "img/bg-imgES2.png"; // Puedes usar una imagen por defecto
      setBackgroundImage(backgroundImage);

      // Usar innerHTML para el mensaje del modal
      localStorage.setItem("language", language);
      loadFortunes(language); // Cargar las frases según el idioma
      translateFortune(); // Traducir la fortuna del día
    });
}

// Imagen mepa
function setBackgroundImage(imagePath) {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const img = new Image();
  img.onload = function () {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  };
  img.src = imagePath;
}

// Función para cargar y establecer el idioma
function setLanguage(language) {
  loadLanguage(language);

  // Generar la imagen con el texto aleatorio y la imagen de fondo según el idioma
  generateImage(language).then(() => {
    displayTodayFortune(); // Mostrar la fortuna del día si ya existe
  });
}

// Función para traducir la fortuna del día
function translateFortune() {
  const savedIndex = localStorage.getItem("todayFortuneIndex");
  if (savedIndex !== null) {
    const index = parseInt(savedIndex, 10);
    fortuneText.textContent = `"${fortuneMessages[index]}"`;

    // Mostrar los números aleatorios guardados
    /* const savedNumbers = localStorage.getItem("todayFortuneNumbers");
    if (savedNumbers) {
      document.getElementById("fortune-numbers").textContent = savedNumbers;
    } */
  }
}

// Manejar el cambio de idioma
document
  .getElementById("languageSwitch")
  .addEventListener("change", (event) => {
    const language = event.target.checked ? "en" : "es";
    /* setLanguage(language); */
    loadContent(language);
    document
      .getElementById("languageSwitch")
      .setAttribute("data-label", language.toUpperCase());
  });

// Función para mostrar el botón de compartir
function showShareButton() {
  shareButton.style.display = "inline-block";
  viewButton.style.display = "inline-block";
  webShareButton.style.display = "inline-block";
  // Mostrar el trébol
  document.querySelector(".trebol").style.display = "inline";
}

// Función para obtener el nombre del archivo de acuerdo al idioma y la fecha
function getFilename() {
  const language = localStorage.getItem("language") || "es";
  const date = new Date();
  let formattedDate;

  if (language === "es") {
    // Formato de fecha para español: dd/mm/yy
    formattedDate = `${("0" + date.getDate()).slice(-2)}/${(
      "0" +
      (date.getMonth() + 1)
    ).slice(-2)}/${date.getFullYear().toString().slice(-2)}`;
    return `miFortuna-${formattedDate}.png`;
  } else {
    // Formato de fecha para inglés: mm/dd/yy
    formattedDate = `${("0" + (date.getMonth() + 1)).slice(-2)}/${(
      "0" + date.getDate()
    ).slice(-2)}/${date.getFullYear().toString().slice(-2)}`;
    return `myFortune-${formattedDate}.png`;
  }
}

// Añadir evento al botón de compartir
shareButton.addEventListener("click", () => {
  generateImage(); // Generar la imagen con texto
  setTimeout(() => {
    // Esperar un breve momento para asegurarse de que generateImage() haya terminado
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const language = localStorage.getItem("language");
      const date = new Date().toLocaleDateString(
        language === "es" ? "es-ES" : "en-US"
      );
      const fileName =
        language === "es" ? `miFortuna-${date}.png` : `myFortune-${date}.png`;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }, 110); // Esperar 100ms (ajusta según sea necesario)
});

// Añadir evento al botón de ver para mostrar el modal de imagen
viewButton.addEventListener("click", () => {
  generateImage().then(() => {
    // Esperar a que generateImage() termine
    const imageModal = document.getElementById("imageModal");
    const modalImage = document.getElementById("modal-image");
    modalImage.src = canvas.toDataURL(); // Establecer la imagen generada en el modal
    imageModal.style.display = "flex";
  });
});

// Variables para textos de compartir
let shareTitle;
let shareText;
let shareUrl = "https://luckycookie.app/";

// Constantes para textos e imagen
const text = {
  title: "",
  text: "",
  url: "https://luckycookie.app/",
};

const image = {
  title: "",
  text: "",
  url: "https://luckycookie.app/",
  files: [],
};

// Event listener para el botón web-share-button
webShareButton.addEventListener("click", async () => {
  if (navigator.share) {
    try {
      // Convertir el canvas a un blob
      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/png")
      );
      const file = new File([blob], getFilename(), { type: "image/png" });
      image.files = [file]; // Asignar el archivo a la constante image

      await navigator.share({
        title: shareTitle,
        text: shareText,
        files: [file],
        url: shareUrl,
      });
      console.log("¡Contenido compartido con éxito!");
    } catch (error) {
      console.error("Error al compartir:", error);
    }
  } else {
    console.error("Web Share API no está disponible en este navegador.");
  }
});

// Función para dividir el texto en líneas según el ancho máximo
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  const lines = [];

  words.forEach((word) => {
    const testLine = line + word + " ";
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;

    if (testWidth > maxWidth && line.length > 0) {
      lines.push(line.trim());
      line = word + " ";
    } else {
      line = testLine;
    }
  });

  lines.push(line.trim());
  return lines;
}

// Cerrar el modal de imagen
const imageCloseButton = document.querySelector("#imageModal .close");
imageCloseButton.addEventListener("click", () => {
  document.getElementById("imageModal").style.display = "none";
});

// Cerrar el modal de imagen si se hace clic fuera de él
window.addEventListener("click", (event) => {
  const imageModal = document.getElementById("imageModal");
  if (event.target === imageModal) {
    imageModal.style.display = "none";
  }
});
