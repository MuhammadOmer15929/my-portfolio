// --- Particle Background System ---
const canvas = document.getElementById('bg-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 80;
    const connectionDistance = 150;
    let width, height;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 1.5 + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 242, 255, 0.4)';
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            const p1 = particles[i];
            p1.update();
            p1.draw();

            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectionDistance) {
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(0, 242, 255, ${0.1 * (1 - dist / connectionDistance)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }

    initParticles();
    animate();
}

// --- Global UI Elements ---
const navbar = document.getElementById('navbar');
const navLinksUl = document.getElementById('nav-links');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section');
const backToTop = document.getElementById('back-to-top');
const projectsGrid = document.querySelector('.projects-grid');
const prevProject = document.getElementById('prevProject');
const nextProject = document.getElementById('nextProject');
const skillsGrid = document.querySelector('.skills-grid');
const prevSkill = document.getElementById('prevSkill');
const nextSkill = document.getElementById('nextSkill');
const contactForm = document.querySelector('.contact-form');

// --- Scroll Reveal Animation ---
const revealElements = document.querySelectorAll('[data-reveal]');
if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
}

// --- Mobile Menu Toggle ---
if (mobileMenuBtn && navLinksUl) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinksUl.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (navLinksUl.classList.contains('active')) {
            icon.setAttribute('data-lucide', 'x');
        } else {
            icon.setAttribute('data-lucide', 'menu');
        }
        lucide.createIcons();
    });
}

// Close mobile menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navLinksUl && navLinksUl.classList.contains('active')) {
            navLinksUl.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.setAttribute('data-lucide', 'menu');
                lucide.createIcons();
            }
        }
    });
});

// --- Navbar & Scroll Effects ---
window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;

    // Navbar visible background
    if (navbar) {
        if (scrollPos > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // Active Link Highlighting (Scroll Spy)
    let current = "";
    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollPos >= sectionTop - sectionHeight / 3) {
            current = section.getAttribute("id");
        }
    });

    navLinks.forEach((link) => {
        link.classList.remove("active");
        if (current && link.getAttribute("href") === "#" + current) {
            link.classList.add("active");
        }
    });

    // Back to top button visibility
    if (backToTop) {
        if (scrollPos > 500) {
            backToTop.style.display = 'flex';
        } else {
            backToTop.style.display = 'none';
        }
    }
}, { passive: true });

// --- Smooth Link Scrolling ---
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href.startsWith('#')) {
            e.preventDefault();
            const targetElement = document.querySelector(href);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// --- Contact Form Submission ---
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button');
        const originalText = btn.innerText;
        const formData = new FormData(contactForm);

        btn.innerText = 'Sending...';
        btn.disabled = true;

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                btn.innerText = 'Message Sent!';
                btn.style.borderColor = '#00ff88';
                btn.style.color = '#00ff88';
                contactForm.reset();
            } else {
                throw new Error();
            }
        } catch (err) {
            btn.innerText = 'Error! Try Again';
            btn.style.borderColor = '#ff4b2b';
            btn.style.color = '#ff4b2b';
        }

        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.borderColor = '';
            btn.style.color = '';
            btn.disabled = false;
        }, 3000);
    });
}

// --- Project & Skill Slider Arrows ---
function setupSlider(grid, prevBtn, nextBtn) {
    if (grid && prevBtn && nextBtn) {
        const scrollAmount = 400; // Average card width

        nextBtn.addEventListener('click', () => {
            grid.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });

        prevBtn.addEventListener('click', () => {
            grid.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
    }
}

setupSlider(projectsGrid, prevProject, nextProject);
setupSlider(skillsGrid, prevSkill, nextSkill);

// --- Back to Top Action ---
// --- Back to Top Action ---
if (backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// --- 3D Tilt Animations ---
if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll(".skill-card, .project-card, #certifications .glass-panel"), {
        max: 10,
        speed: 400,
        glare: true,
        "max-glare": 0.15,
        scale: 1.02,
    });
}
