/* ----------------------------------

SoMuchSharing Sharing Widget
Developer : Tuxedosoft (http://tuxedosoft.com)
Version   : 1.0.0
Released  : 5th, August, 2025

-------------------------------------*/


// Widget Configuration
const widgetConfig = {
    position: 'right', // 'left' or 'right'
    enableConfetti: true,
    enablePulse: true,
    enableFloating: true
};

let isOpen = false;
const shareButton = document.getElementById('shareButton');
const shareOptions = document.getElementById('shareOptions');
const successAnimation = document.getElementById('successAnimation');
const confettiContainer = document.getElementById('confettiContainer');
const floatingWidget = document.querySelector('.floating-share-widget');

// Initialize widget position
function initializeWidgetPosition() {
    if (widgetConfig.position === 'left') {
        floatingWidget.classList.add('left');
    } else {
        floatingWidget.classList.remove('left');
    }
}

// Function to change widget position
function setWidgetPosition(position) {
    if (position === 'left' || position === 'right') {
        widgetConfig.position = position;
        initializeWidgetPosition();
        console.log(`Widget position changed to: ${position}`);
    }
}

// Initialize widget on page load
initializeWidgetPosition();

// Confetti function
function createConfetti() {
    const colors = ['#ff6b6b', '#4ecdc4', '#f39c12', '#9b59b6', '#e74c3c', '#2ecc71', '#3498db', '#f1c40f'];
    const confettiCount = 150;
    
    // Get button position for explosion center
    const buttonRect = shareButton.getBoundingClientRect();
    const buttonCenterX = buttonRect.left + buttonRect.width / 2;
    const buttonCenterY = buttonRect.top + buttonRect.height / 2;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        // Position confetti at button center
        confetti.style.left = buttonCenterX + 'px';
        confetti.style.top = buttonCenterY + 'px';
        confetti.style.position = 'fixed';
        
        // Random explosion direction and distance
        const angle = Math.random() * 360;
        const distance = Math.random() * 200 + 50; // 50-250px from center
        const endX = buttonCenterX + Math.cos(angle * Math.PI / 180) * distance;
        const endY = buttonCenterY + Math.sin(angle * Math.PI / 180) * distance;
        
        // Random animation properties
        const duration = Math.random() * 1.5 + 1.5; // 1.5-3 seconds
        const delay = Math.random() * 0.5; // 0-0.5 seconds delay
        
        confetti.style.animationDelay = delay + 's';
        confetti.style.animationDuration = duration + 's';
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        
        // Random confetti shapes
        if (Math.random() > 0.5) {
            confetti.style.borderRadius = '50%';
        } else {
            confetti.style.borderRadius = '0';
        }
        
        // Random sizes
        const size = Math.random() * 8 + 5;
        confetti.style.width = size + 'px';
        confetti.style.height = size + 'px';
        
        // Random colors
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        
        // Set custom animation for explosion effect
        confetti.style.setProperty('--end-x', (endX - buttonCenterX) + 'px');
        confetti.style.setProperty('--end-y', (endY - buttonCenterY) + 'px');
        confetti.style.animation = `confetti-explosion ${duration}s ${delay}s ease-out forwards`;
        
        confettiContainer.appendChild(confetti);
        
        // Remove confetti after animation
        setTimeout(() => {
            if (confetti.parentNode) {
                confetti.parentNode.removeChild(confetti);
            }
        }, (duration + delay) * 1000 + 1000);
    }
}

// Add pulse animation on page load
if (widgetConfig.enablePulse) {
    setTimeout(() => {
        shareButton.classList.add('pulse');
    }, 1000);
}

function toggleShare() {
    isOpen = !isOpen;
    
    if (isOpen) {
        shareButton.classList.add('active');
        shareOptions.classList.add('show');
        shareButton.classList.remove('pulse');
        // Create confetti when button is clicked and opens
        if (widgetConfig.enableConfetti) {
            createConfetti();
        }
    } else {
        shareButton.classList.remove('active');
        shareOptions.classList.remove('show');
        // Restart pulse animation after closing
        if (widgetConfig.enablePulse) {
            setTimeout(() => {
                shareButton.classList.add('pulse');
            }, 500);
        }
    }
}

function share(platform) {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent('Check out this amazing content!');
    const text = encodeURIComponent('I found this really cool floating share widget!');

    let shareUrl = '';

    switch (platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
            break;
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${text}%20${url}`;
            break;
        case 'telegram':
            shareUrl = `https://t.me/share/url?url=${url}&text=${text}`;
            break;
        case 'pinterest':
            shareUrl = `https://pinterest.com/pin/create/button/?url=${url}&description=${text}`;
            break;
        case 'email':
            shareUrl = `mailto:?subject=${title}&body=${text}%20${url}`;
            break;
        case 'instagram':
            // Instagram doesn't support direct sharing via URL
            showSuccess('Instagram sharing requires manual copy/paste');
            return;
    }

    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
        showSuccess(`Shared on ${platform.charAt(0).toUpperCase() + platform.slice(1)}!`);
    }
}

function showSuccess(message) {
    successAnimation.textContent = message;
    successAnimation.classList.add('show');
    
    setTimeout(() => {
        successAnimation.classList.remove('show');
    }, 2000);
}

// Close share options when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.floating-share-widget') && isOpen) {
        toggleShare();
    }
});

// Add some fun interactions
shareButton.addEventListener('mouseenter', () => {
    if (!isOpen) {
        shareButton.style.transform = 'scale(1.05)';
    }
});

shareButton.addEventListener('mouseleave', () => {
    if (!isOpen) {
        shareButton.style.transform = 'scale(1)';
    }
});

// Add keyboard support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) {
        toggleShare();
    }
});

// Add touch support for mobile
let touchStartY = 0;
let touchEndY = 0;

shareButton.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
});

shareButton.addEventListener('touchend', (e) => {
    touchEndY = e.changedTouches[0].clientY;
    const swipeDistance = touchStartY - touchEndY;
    
    if (swipeDistance > 50 && !isOpen) {
        toggleShare();
    } else if (swipeDistance < -50 && isOpen) {
        toggleShare();
    }
});

// Add some random floating animation
function addFloatingAnimation() {
    const widget = document.querySelector('.floating-share-widget');
    widget.style.animation = 'floating 3s ease-in-out infinite';
}

// Add CSS for floating animation
const style = document.createElement('style');
style.textContent = `
    @keyframes floating {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
    }
`;
document.head.appendChild(style);

// Start floating animation after a delay
if (widgetConfig.enableFloating) {
    setTimeout(addFloatingAnimation, 2000);
}