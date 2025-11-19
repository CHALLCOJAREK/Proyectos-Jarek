// ===============================
// CONFIGURACIÓN
// ===============================
const config = {
    question: "¿Te gustaría salir conmigo? <3",
    successMessage: "¡Lo sabía! 😊",
    successGif: "https://media1.tenor.com/m/Q00qNDfVO-cAAAAd/pucca-garu.gif",
    yesButtonGrowthRate: 2,
    noButtonShrinkFactor: 0.9
};

// ===============================
// VARIABLES GLOBALES
// ===============================
let noButtonClicks = 0;
let yesButtonSize = 1;
let noButtonScale = 1;

// ===============================
// ELEMENTOS DEL DOM
// ===============================
const proposalSection = document.getElementById('proposal-section');
const successSection = document.getElementById('success-section');
const questionText = document.getElementById('question-text');
const successMessage = document.getElementById('success-message');
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const successGif = document.getElementById('success-gif');

// ===============================
// ACTUALIZAR CONTENIDO
// ===============================
function updateContent() {
    questionText.textContent = config.question;
    successMessage.textContent = config.successMessage;
    successGif.src = config.successGif;
}

// ===============================
// BOTÓN "NO" SE ESCAPA
// ===============================
function moveNoButton() {
    noBtn.style.position = 'fixed';

    const yesRect = yesBtn.getBoundingClientRect(); // ← corregido
    const noBtnRect = noBtn.getBoundingClientRect();
    const noBtnWidth = noBtnRect.width;
    const noBtnHeight = noBtnRect.height;

    const margin = window.innerWidth < 480 ? 15 : 20;
    const minDistance = window.innerWidth < 480 ? 60 : 80;

    let tries = 0;
    let found = false;
    let newX, newY;

    while (!found && tries < 100) {
        newX = Math.random() * (window.innerWidth - noBtnWidth - margin * 2) + margin;
        newY = Math.random() * (window.innerHeight - noBtnHeight - margin * 2) + margin;

        const testRect = {
            left: newX,
            right: newX + noBtnWidth,
            top: newY,
            bottom: newY + noBtnHeight
        };

        if (
            testRect.right < yesRect.left - minDistance ||
            testRect.left > yesRect.right + minDistance ||
            testRect.bottom < yesRect.top - minDistance ||
            testRect.top > yesRect.bottom + minDistance
        ) {
            found = true;
        }
        tries++;
    }

    noBtn.style.left = newX + 'px';
    noBtn.style.top = newY + 'px';

    noBtn.style.animation = 'bounce 0.5s ease';
    setTimeout(() => noBtn.style.animation = '', 500);

    const rotation = (Math.random() - 0.5) * 20;
    noBtn.style.transform = `scale(${noButtonScale}) rotate(${rotation}deg)`;
}

// ===============================
// CRECER EL BOTÓN "SÍ"
// ===============================
function growYesButton() {
    yesButtonSize *= config.yesButtonGrowthRate;
    yesBtn.style.transform = `scale(${yesButtonSize})`;

    const intensity = Math.min(255, 107 + (noButtonClicks * 20));
    yesBtn.style.background = `linear-gradient(45deg, #ff${intensity.toString(16)}9d, #ff8fab)`;
    yesBtn.style.boxShadow = `0 8px 25px rgba(255, 107, 157, 0.8)`;
}

// ===============================
// ACHICAR EL BOTÓN "NO"
// ===============================
function shrinkNoButton() {
    noButtonScale = Math.max(0.3, noButtonScale * config.noButtonShrinkFactor);
    noBtn.style.transform = `scale(${noButtonScale})`;
    noBtn.style.fontSize = `${22 * noButtonScale}px`;
}

// ===============================
// CUANDO DICE "SÍ"
// ===============================
function handleYesClick() {
    proposalSection.classList.add('hidden');
    document.querySelector('.buttons-container').classList.add('hide-buttons');
    noBtn.style.display = 'none';
    successSection.classList.remove('hidden');
    createConfetti();
}

// ===============================
// CUANDO PRESIONA "NO"
// ===============================
function handleNoClick() {
    noButtonClicks++;
    shrinkNoButton();
    moveNoButton();
    growYesButton();

    const noTexts = [
        "¿Seguro?",
        "¿De verdad?",
        "Piénsalo bien",
        "¿Estás segura?",
        "Última oportunidad",
        "Por favor",
        "Te lo pido",
        "❤️",
        "No me hagas esto",
        "😢"
    ];

    if (noButtonClicks < noTexts.length)
        noBtn.textContent = noTexts[noButtonClicks];
}

// ===============================
// CONFETTI (OPTIMIZADO PARA MÓVIL)
// ===============================
function createConfetti() {
    const colors = ['#ff6b9d', '#ff8fab', '#ffb6c1', '#ff69b4', '#ff1493'];
    const total = window.innerWidth < 480 ? 20 : 50; // menos en móvil

    for (let i = 0; i < total; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * window.innerWidth + 'px';
        confetti.style.top = '-10px';
        confetti.style.borderRadius = '50%';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '9999';

        document.body.appendChild(confetti);

        const animation = confetti.animate([
            { transform: 'translateY(0px) rotate(0deg)', opacity: 1 },
            { transform: `translateY(${window.innerHeight + 100}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
        ], {
            duration: Math.random() * 3000 + 2000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });

        animation.onfinish = () => confetti.remove();
    }
}

// ===============================
// ANIMACIÓN BOUNCE
// ===============================
const style = document.createElement('style');
style.textContent = `
@keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-10px); }
    60% { transform: translateY(-5px); }
}`;
document.head.appendChild(style);

// ===============================
// EVENTOS
// ===============================
yesBtn.addEventListener('click', handleYesClick);
noBtn.addEventListener('click', handleNoClick);

yesBtn.addEventListener('touchend', handleYesClick);
noBtn.addEventListener('touchend', handleNoClick);

// ===============================
// INICIALIZAR
// ===============================
document.addEventListener('DOMContentLoaded', () => {
    updateContent();

    proposalSection.style.opacity = '0';
    proposalSection.style.transform = 'translateY(20px)';

    setTimeout(() => {
        proposalSection.style.transition = 'all 0.5s ease';
        proposalSection.style.opacity = '1';
        proposalSection.style.transform = 'translateY(0)';
    }, 100);
});

// ===============================
// REUBICAR "NO" SI SALE DE PANTALLA
// ===============================
window.addEventListener('resize', () => {
    if (noBtn.style.position === 'fixed') {
        const rect = noBtn.getBoundingClientRect();
        if (rect.right < 0 || rect.left > window.innerWidth ||
            rect.bottom < 0 || rect.top > window.innerHeight) {
            moveNoButton();
        }
    }
});
