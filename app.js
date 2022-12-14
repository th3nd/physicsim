// Set up canvasen
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

// sätt canvas bredd och höjd
context.canvas.width  = window.innerWidth;
context.canvas.height = window.innerHeight;

// skapa variabler för vår boll
let x = window.innerWidth/2;
let y = window.innerHeight/2;
let velocity = [0, 0];

// vi använder pi senare för att räkna ut luftmotstånd.
const pi = 3.141
// sätt radien av bollen.
const r = 25
// skulle vara bra att ändra den med slider men orkar inte
const bounce = .75

// skapa vår tids-variable
let t = 0;

// Ställ in standardvärdena för alla variabler
document.getElementById("t").value = 20
document.getElementById("g").value = 982
document.getElementById("d").value = 47
document.getElementById("m").value = 40
document.getElementById("a").value = 120

// allt inuti animate körs i en loop
function animate() {
  // hämta all input från usern
  // dt = time scale
  let dt = document.getElementById("t").value / 100;
  // g = gravity
  let g = document.getElementById("g").value / 100;
  let drag = document.getElementById("d").value / 100;
  let mass = document.getElementById("m").value / 100;
  let air = document.getElementById("a").value / 100;

  document.getElementById("speed").innerText = Math.round(Math.abs((velocity[1]+velocity[0])));

  // bollen har som standard en radie på 0,2 meter, en luftmotståndskoefficient på 0,47, en massa på 0,4 kilogram och rör sig genom luft med en densitet på 1,2 kilogram per kubikmeter
  let b = 0.5 * drag * pi * (r/10^2) * air / mass

  // Uppdatera bollens position och hastighet
  x += velocity[1] * dt;
  y += velocity[0] * dt;
  velocity[0] += g * dt;
  velocity[1] -= b * velocity[1] * dt;

  
  // Kontrollera om bollen har nuddat marken
  if (y + r > canvas.height) {
    // Om det har, invertera dess vertikala hastighet och tillämpa en dämpningsfaktor
    // todo: lägg till .bounce som en slider
    velocity[0] *= -bounce;
    //  x friction
    velocity[1] *= .95;
    y = canvas.height - r;
    
    // normalisera vår velocity med dt eftersom thresholden är annorlunda annars
    // utan den här checken studsar bollen för alltid
    if (Math.abs(velocity[0]/dt) <= 50) {
      velocity[0] /= 2
    }
  } 

  // ganska basic bounds-check
  if (x+r > canvas.width) {
    velocity[1] *= -bounce;
    x = canvas.width - r;
  }

  if (x-r < 0) {
    velocity[1] *= -bounce;
    x = r
  }

  // ta bort förra bollen
  context.clearRect(0, 0, canvas.width, canvas.height);

  // rita bollen
  context.beginPath();
  context.arc(x, y, r, 0, 2 * Math.PI);
  context.fillStyle = "red";
  context.fill();

  // kör om funktionen
  requestAnimationFrame(animate);
}

// Lyssna efter mus händelser på canvasen
// varje gång som något av de här händelserna inträffar körs den funktionen som är associerad med händelsen.
// mousemove körs nästan hela tiden.
canvas.addEventListener("mousedown", m_down);
canvas.addEventListener("mouseup", m_up);
canvas.addEventListener("mousemove", m_move);

// globala mus-variabler för att ha koll på musens state.
let isMouseDown = false;
let mouseX = 0;
let mouseY = 0;

// när musknapp åker ner körs den här koden
function m_down(event) {
  isMouseDown = true;
  mouseX = event.clientX;
  mouseY = event.clientY;
}

// när musknapp åker upp körs den här koden
function m_up(event) {
  isMouseDown = false;
}

// körs när musen rörs
function m_move(event) {
  if (isMouseDown) {
    // Om musen är nere, uppdatera bollens position och hastighet
    x = event.clientX;
    y = event.clientY;
    velocity[1] = (x - mouseX);
    velocity[0] = (y - mouseY);
    mouseX = x;
    mouseY = y;
  }
}

// det här körs en gång för att starta loopen.
requestAnimationFrame(animate);