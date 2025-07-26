// Global Variables
let mouseX = 0;
let mouseY = 0;
let isMenuOpen = false;

// DOM Elements
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const robotContainer = document.getElementById('robot-container');
const contactForm = document.getElementById('contact-form');
const modal = document.getElementById('portfolio-modal');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    initializeAnimations();
    updateActiveNavLink();
});

// Event Listeners
function initializeEventListeners() {
    // Mouse movement for robot
    document.addEventListener('mousemove', handleMouseMove);
    
    // Navigation
    hamburger.addEventListener('click', toggleMobileMenu);
    
    // Navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavClick);
    });
    
    // Scroll events
    window.addEventListener('scroll', handleScroll);
    
    // Contact form
    contactForm.addEventListener('submit', handleFormSubmit);
    
    // Modal events
    window.addEventListener('click', handleModalClick);
    
    // Resize events
    window.addEventListener('resize', handleResize);
}

// Mouse Movement Handler for Robot
function handleMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    if (robotContainer && window.innerWidth > 768) {
        updateRobotPosition();
    }
}

function updateRobotPosition() {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    // Calculate offset based on mouse position
    const offsetX = (mouseX - centerX) * 0.02;
    const offsetY = (mouseY - centerY) * 0.02;
    
    // Apply 3D transformation
    const rotateX = (mouseY - centerY) * 0.01;
    const rotateY = (mouseX - centerX) * 0.01;
    
    robotContainer.style.transform = `
        translateY(-50%) 
        translate(${offsetX}px, ${offsetY}px) 
        perspective(1000px) 
        rotateX(${rotateX}deg) 
        rotateY(${rotateY}deg)
    `;
    
    // Update robot eyes to follow cursor
    updateRobotEyes();
}

function updateRobotEyes() {
    const eyes = document.querySelectorAll('.eye');
    const robotRect = robotContainer.getBoundingClientRect();
    const robotCenterX = robotRect.left + robotRect.width / 2;
    const robotCenterY = robotRect.top + robotRect.height / 4;
    
    const angle = Math.atan2(mouseY - robotCenterY, mouseX - robotCenterX);
    const distance = Math.min(3, Math.sqrt(Math.pow(mouseX - robotCenterX, 2) + Math.pow(mouseY - robotCenterY, 2)) / 100);
    
    eyes.forEach(eye => {
        const pupilX = Math.cos(angle) * distance;
        const pupilY = Math.sin(angle) * distance;
        eye.style.transform = `translate(${pupilX}px, ${pupilY}px)`;
    });
}

// Navigation Functions
function toggleMobileMenu() {
    isMenuOpen = !isMenuOpen;
    navMenu.classList.toggle('active');
    
    // Animate hamburger
    const bars = hamburger.querySelectorAll('.bar');
    if (isMenuOpen) {
        bars[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        bars[1].style.opacity = '0';
        bars[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
        bars[0].style.transform = 'none';
        bars[1].style.opacity = '1';
        bars[2].style.transform = 'none';
    }
}

function handleNavClick(e) {
    e.preventDefault();
    const targetId = e.target.getAttribute('href').substring(1);
    scrollToSection(targetId);
    
    // Close mobile menu if open
    if (isMenuOpen) {
        toggleMobileMenu();
    }
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 70; // Account for fixed navbar
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Scroll Handler
function handleScroll() {
    updateActiveNavLink();
    updateNavbarBackground();
    animateOnScroll();
}

function updateActiveNavLink() {
    const sections = ['home', 'about', 'portfolio', 'skills', 'contact'];
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        const navLink = document.querySelector(`a[href="#${sectionId}"]`);
        
        if (section && navLink) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                navLink.classList.add('active');
            }
        }
    });
}

function updateNavbarBackground() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 30px rgba(255, 105, 180, 0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(255, 105, 180, 0.1)';
    }
}

// Animation Functions
function initializeAnimations() {
    // Animate skill bars when they come into view
    const skillBars = document.querySelectorAll('.skill-progress');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.getAttribute('data-width');
                entry.target.style.width = width + '%';
            }
        });
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => observer.observe(bar));
    
    // Animate cards on scroll
    const cards = document.querySelectorAll('.about-card, .portfolio-item, .skill-item');
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
            }
        });
    }, { threshold: 0.1 });
    
    cards.forEach(card => cardObserver.observe(card));
}

function animateOnScroll() {
    const elements = document.querySelectorAll('.section-header, .hero-text, .hero-image');
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('animate');
        }
    });
}

// Form Handler
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');
    
    // Validate form
    if (!name || !email || !subject || !message) {
        showNotification('Mohon lengkapi semua field!', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Format email tidak valid!', 'error');
        return;
    }
    
    // Simulate form submission
    showNotification('Mengirim pesan...', 'info');
    
    setTimeout(() => {
        showNotification('Pesan berhasil dikirim! Terima kasih.', 'success');
        contactForm.reset();
    }, 2000);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type) {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 10000;
        padding: 15px 20px;
        border-radius: 10px;
        color: white;
        font-weight: 500;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        animation: slideInRight 0.3s ease-out;
        max-width: 400px;
    `;
    
    // Set background color based on type
    switch(type) {
        case 'success':
            notification.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
            break;
        case 'error':
            notification.style.background = 'linear-gradient(135deg, #f44336, #da190b)';
            break;
        case 'info':
            notification.style.background = 'linear-gradient(135deg, #ff69b4, #ff1493)';
            break;
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Modal Functions
function openModal(projectId) {
    const modalBody = document.getElementById('modal-body');
    const projectData = getProjectData(projectId);
    
    modalBody.innerHTML = `
        <div class="modal-project">
            <img src="${projectData.image}" alt="${projectData.title}" style="width: 100%; height: 300px; object-fit: cover; border-radius: 15px; margin-bottom: 30px;">
            <h2 style="color: #333; margin-bottom: 20px; font-size: 2rem;">${projectData.title}</h2>
            <p style="color: #666; line-height: 1.8; margin-bottom: 30px; font-size: 1.1rem;">${projectData.fullDescription}</p>
            <div style="margin-bottom: 30px;">
                <h3 style="color: #ff1493; margin-bottom: 15px;">Teknologi yang Digunakan:</h3>
                <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                    ${projectData.technologies.map(tech => `<span class="tag">${tech}</span>`).join('')}
                </div>
            </div>
            <div style="margin-bottom: 30px;">
                <h3 style="color: #ff1493; margin-bottom: 15px;">Fitur Utama:</h3>
                <ul style="color: #666; line-height: 2;">
                    ${projectData.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            </div>
            <div style="display: flex; gap: 15px; justify-content: center;">
                <a href="${projectData.githubUrl}" class="btn btn-secondary" target="_blank">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 8px;">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    Lihat Kode
                </a>
                <a href="${projectData.liveUrl}" class="btn btn-primary" target="_blank">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 8px;">
                        <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
                    </svg>
                    Live Demo
                </a>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function handleModalClick(e) {
    if (e.target === modal) {
        closeModal();
    }
}

function getProjectData(projectId) {
    const projects = {
        project1: {
            title: 'E-Commerce Platform',
            image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
            fullDescription: 'Platform e-commerce modern yang dibangun dengan teknologi terdepan. Menyediakan pengalaman berbelanja yang seamless dengan fitur-fitur canggih seperti real-time inventory, payment gateway terintegrasi, dan sistem rekomendasi berbasis AI.',
            technologies: ['React', 'Node.js', 'MongoDB', 'Stripe', 'Redis', 'AWS'],
            features: [
                'Sistem autentikasi dan autorisasi yang aman',
                'Katalog produk dengan pencarian dan filter canggih',
                'Keranjang belanja real-time',
                'Integrasi payment gateway multiple',
                'Dashboard admin untuk manajemen produk',
                'Sistem review dan rating produk',
                'Notifikasi real-time untuk order status'
            ],
            githubUrl: 'https://github.com',
            liveUrl: 'https://example.com'
        },
        project2: {
            title: 'Task Management App',
            image: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=800',
            fullDescription: 'Aplikasi manajemen tugas kolaboratif yang memungkinkan tim untuk bekerja sama secara efektif. Dilengkapi dengan fitur real-time collaboration, time tracking, dan analytics untuk meningkatkan produktivitas tim.',
            technologies: ['Vue.js', 'Firebase', 'Tailwind CSS', 'Chart.js', 'PWA'],
            features: [
                'Manajemen proyek dan tugas dengan drag & drop',
                'Kolaborasi real-time antar anggota tim',
                'Time tracking dan reporting',
                'Notifikasi push untuk deadline dan updates',
                'Dashboard analytics untuk monitoring progress',
                'Integrasi kalender untuk scheduling',
                'Offline support dengan PWA'
            ],
            githubUrl: 'https://github.com',
            liveUrl: 'https://example.com'
        },
        project3: {
            title: 'Weather Dashboard',
            image: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=800',
            fullDescription: 'Dashboard cuaca interaktif yang menyediakan informasi cuaca real-time dan prediksi dengan visualisasi data yang menarik. Menggunakan multiple weather APIs untuk memberikan data yang akurat dan komprehensif.',
            technologies: ['JavaScript', 'Weather API', 'Chart.js', 'CSS3', 'Geolocation API'],
            features: [
                'Informasi cuaca real-time berdasarkan lokasi',
                'Prediksi cuaca 7 hari ke depan',
                'Visualisasi data dengan charts interaktif',
                'Pencarian cuaca berdasarkan kota',
                'Notifikasi untuk cuaca ekstrem',
                'Responsive design untuk semua device',
                'Dark/Light mode toggle'
            ],
            githubUrl: 'https://github.com',
            liveUrl: 'https://example.com'
        }
    };
    
    return projects[projectId] || projects.project1;
}

// Resize Handler
function handleResize() {
    if (window.innerWidth > 768) {
        navMenu.classList.remove('active');
        isMenuOpen = false;
        
        // Reset hamburger
        const bars = hamburger.querySelectorAll('.bar');
        bars[0].style.transform = 'none';
        bars[1].style.opacity = '1';
        bars[2].style.transform = 'none';
    }
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 15px;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background 0.3s ease;
    }
    
    .notification-close:hover {
        background: rgba(255, 255, 255, 0.2);
    }
`;
document.head.appendChild(style);

// Easter Egg - Konami Code
let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.keyCode);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.length === konamiSequence.length && 
        konamiCode.every((code, index) => code === konamiSequence[index])) {
        
        // Activate easter egg
        activateEasterEgg();
        konamiCode = [];
    }
});

function activateEasterEgg() {
    // Add rainbow animation to robot
    const robot = document.querySelector('.robot');
    if (robot) {
        robot.style.animation = 'rainbowRobot 2s infinite, robotFloat 4s ease-in-out infinite';
        
        // Add rainbow keyframes
        const rainbowStyle = document.createElement('style');
        rainbowStyle.textContent = `
            @keyframes rainbowRobot {
                0% { filter: hue-rotate(0deg); }
                25% { filter: hue-rotate(90deg); }
                50% { filter: hue-rotate(180deg); }
                75% { filter: hue-rotate(270deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(rainbowStyle);
        
        showNotification('🎉 Easter Egg Activated! Rainbow Robot Mode! 🌈', 'success');
        
        // Reset after 10 seconds
        setTimeout(() => {
            robot.style.animation = 'robotFloat 4s ease-in-out infinite';
            rainbowStyle.remove();
        }, 10000);
    }
}

// Performance optimization
const debouncedMouseMove = debounce(handleMouseMove, 16); // ~60fps
document.removeEventListener('mousemove', handleMouseMove);
document.addEventListener('mousemove', debouncedMouseMove);

// Smooth scroll polyfill for older browsers
if (!('scrollBehavior' in document.documentElement.style)) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/gh/iamdustan/smoothscroll@master/src/smoothscroll.js';
    document.head.appendChild(script);
}

console.log('🎨 Portfolio Website Loaded Successfully!');
console.log('💖 Made with love using HTML, CSS & JavaScript');
console.log('🤖 Try moving your mouse to see the robot follow!');
console.log('🎮 Try the Konami Code for a surprise: ↑↑↓↓←→←→BA');