// Get elements
const yesButton = document.getElementById('yesButton');
const noButton = document.getElementById('noButton');
const noPlaceholder = document.getElementById('noPlaceholder');
const celebration = document.getElementById('celebration');
const buttonsContainer = document.querySelector('.buttons-container');

// Track if we're on mobile/touch device
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// Safe distance - button will move if cursor gets within this distance
const SAFE_DISTANCE = 180;

// Track if button has been activated
let isButtonAbsolute = false;

// CRITICAL: Ensure No button can NEVER be hovered by setting pointer-events to none from the start
noButton.style.pointerEvents = 'none';

// For desktop: smooth predictive movement
function moveButtonAway(event) {
    if (isTouchDevice) return;
    
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    
    const buttonRect = noButton.getBoundingClientRect();
    const containerRect = buttonsContainer.getBoundingClientRect();
    
    // Calculate button center
    const buttonCenterX = buttonRect.left + buttonRect.width / 2;
    const buttonCenterY = buttonRect.top + buttonRect.height / 2;
    
    // Calculate distance from mouse to button center
    const distanceX = buttonCenterX - mouseX;
    const distanceY = buttonCenterY - mouseY;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    
    // If cursor is within safe distance
    if (distance < SAFE_DISTANCE) {
        // First time activation - switch to absolute positioning
        if (!isButtonAbsolute) {
            isButtonAbsolute = true;
            
            // Get current position before switching to absolute
            const currentLeft = buttonRect.left - containerRect.left;
            const currentTop = buttonRect.top - containerRect.top;
            
            // Show placeholder to maintain layout
            noPlaceholder.style.visibility = 'visible';
            noPlaceholder.style.opacity = '0';
            noPlaceholder.style.position = 'relative';
            
            // Switch to absolute positioning
            noButton.style.position = 'absolute';
            noButton.style.left = currentLeft + 'px';
            noButton.style.top = currentTop + 'px';
            noButton.style.transform = 'none';
            noButton.style.pointerEvents = 'none';
        }
        
        // Calculate angle from mouse to button (direction to escape)
        const angle = Math.atan2(distanceY, distanceX);
        
        // Calculate how far to move (further away when cursor is closer)
        const moveDistance = SAFE_DISTANCE * 1.5;
        
        // Calculate new position
        let newCenterX = mouseX + Math.cos(angle) * moveDistance;
        let newCenterY = mouseY + Math.sin(angle) * moveDistance;
        
        // Convert to top-left position
        let newLeft = newCenterX - buttonRect.width / 2 - containerRect.left;
        let newTop = newCenterY - buttonRect.height / 2 - containerRect.top;
        
        // Ensure button stays within container bounds
        const padding = 10;
        const maxLeft = containerRect.width - buttonRect.width - padding;
        const maxTop = containerRect.height - buttonRect.height - padding;
        
        newLeft = Math.max(padding, Math.min(maxLeft, newLeft));
        newTop = Math.max(padding, Math.min(maxTop, newTop));
        
        // Apply new position
        noButton.style.left = newLeft + 'px';
        noButton.style.top = newTop + 'px';
    }
}

// For mobile: move button on touch/click attempt
function moveButtonAwayMobile(event) {
    event.preventDefault();
    event.stopPropagation();
    
    const containerRect = buttonsContainer.getBoundingClientRect();
    const buttonRect = noButton.getBoundingClientRect();
    
    // First time - switch to absolute
    if (!isButtonAbsolute) {
        isButtonAbsolute = true;
        const currentLeft = buttonRect.left - containerRect.left;
        const currentTop = buttonRect.top - containerRect.top;
        
        // Show placeholder
        noPlaceholder.style.visibility = 'visible';
        noPlaceholder.style.opacity = '0';
        
        noButton.style.position = 'absolute';
        noButton.style.left = currentLeft + 'px';
        noButton.style.top = currentTop + 'px';
        noButton.style.transform = 'none';
        noButton.style.pointerEvents = 'none';
    }
    
    // Generate random position within container
    const padding = 10;
    const maxLeft = containerRect.width - buttonRect.width - padding;
    const maxTop = containerRect.height - buttonRect.height - padding;
    
    const newLeft = padding + Math.random() * (maxLeft - padding);
    const newTop = padding + Math.random() * (maxTop - padding);
    
    noButton.style.left = newLeft + 'px';
    noButton.style.top = newTop + 'px';
}

// Set up event listeners based on device type
if (isTouchDevice) {
    // Mobile: enable touch events temporarily for detection
    noButton.style.pointerEvents = 'auto';
    noButton.addEventListener('touchstart', moveButtonAwayMobile);
    noButton.addEventListener('click', moveButtonAwayMobile);
} else {
    // Desktop: continuous tracking, pointer-events already none
    document.addEventListener('mousemove', moveButtonAway);
}

// Yes button functionality
yesButton.addEventListener('click', () => {
    celebration.classList.remove('hidden');
    createEnhancedConfetti();
});

// Create enhanced confetti effect with emojis and shapes
function createEnhancedConfetti() {
    const confettiContainer = document.querySelector('.confetti-container');
    const colors = ['#ff1493', '#ff69b4', '#ffb6c1', '#ffc0cb', '#ff69b4', '#ffd700'];
    const shapes = ['💖', '💕', '💗', '💝', '💘', '💞', '⭐', '✨'];
    
    // Create more confetti pieces for a spectacular effect
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const isEmoji = Math.random() > 0.5;
            const confetti = document.createElement('div');
            
            if (isEmoji) {
                // Emoji confetti
                confetti.textContent = shapes[Math.floor(Math.random() * shapes.length)];
                confetti.style.fontSize = (15 + Math.random() * 20) + 'px';
            } else {
                // Regular confetti pieces
                confetti.style.width = (8 + Math.random() * 8) + 'px';
                confetti.style.height = (8 + Math.random() * 8) + 'px';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            }
            
            confetti.style.position = 'absolute';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = '-20px';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '9999';
            confetti.style.opacity = '0.8';
            
            confettiContainer.appendChild(confetti);
            
            const fallDuration = 2000 + Math.random() * 3000;
            const drift = (Math.random() - 0.5) * 200;
            const startTime = Date.now();
            const rotation = Math.random() * 360;
            const rotationSpeed = (Math.random() - 0.5) * 720;
            
            function animateConfetti() {
                const elapsed = Date.now() - startTime;
                const progress = elapsed / fallDuration;
                
                if (progress < 1) {
                    const currentTop = progress * (window.innerHeight + 50);
                    const currentDrift = Math.sin(progress * Math.PI * 2) * drift;
                    const currentRotation = rotation + (rotationSpeed * progress);
                    
                    confetti.style.top = currentTop + 'px';
                    confetti.style.transform = `translateX(${currentDrift}px) rotate(${currentRotation}deg)`;
                    confetti.style.opacity = (1 - progress) * 0.8;
                    requestAnimationFrame(animateConfetti);
                } else {
                    confetti.remove();
                }
            }
            
            animateConfetti();
        }, i * 20);
    }
}