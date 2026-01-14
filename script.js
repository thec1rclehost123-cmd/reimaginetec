// Premium Glassmorphic Interactions - Reimagine

// ===== AMBIENT CANVAS WITH PARTICLE SYSTEM =====
const canvas = document.getElementById('ambient-canvas');
const ctx = canvas?.getContext('2d');

function initAmbientCanvas() {
    if (!canvas || !ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    const particleCount = 60;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.2;
            this.vy = (Math.random() - 0.5) * 0.2;
            this.size = Math.random() * 1.5 + 0.5;
            this.opacity = Math.random() * 0.2 + 0.1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }

        draw() {
            ctx.fillStyle = `rgba(191, 0, 255, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        // Draw connections between nearby particles
        particles.forEach((p1, i) => {
            particles.slice(i + 1).forEach(p2 => {
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    ctx.strokeStyle = `rgba(191, 0, 255, ${0.08 * (1 - distance / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            });
        });

        requestAnimationFrame(animate);
    }

    animate();
}

initAmbientCanvas();

// ===== CURSOR-REACTIVE LIGHTING =====
const cursorLight = document.createElement('div');
cursorLight.className = 'cursor-light';
document.body.appendChild(cursorLight);

let mouseX = 0;
let mouseY = 0;
let lightX = 0;
let lightY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorLight.style.opacity = '0.3';
});

document.addEventListener('mouseleave', () => {
    cursorLight.style.opacity = '0';
});

function animateCursorLight() {
    lightX += (mouseX - lightX) * 0.1;
    lightY += (mouseY - lightY) * 0.1;

    cursorLight.style.left = `${lightX - 200}px`;
    cursorLight.style.top = `${lightY - 200}px`;

    requestAnimationFrame(animateCursorLight);
}

animateCursorLight();

// ===== ORBITAL SYSTEM WITH PHYSICS =====
const orbitalSystem = document.getElementById('orbital-system');
const orbitNodes = document.querySelectorAll('.orbit-node');
let orbitMouseX = 0;
let orbitMouseY = 0;
let orbitTargetX = 0;
let orbitTargetY = 0;
let rotationAngle = 0;

document.addEventListener('mousemove', (e) => {
    orbitMouseX = e.clientX;
    orbitMouseY = e.clientY;
});

function updateOrbitalSystem() {
    if (!orbitalSystem) return;

    const rect = orbitalSystem.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (orbitMouseX - centerX) / window.innerWidth;
    const deltaY = (orbitMouseY - centerY) / window.innerHeight;

    orbitTargetX += (deltaX * 15 - orbitTargetX) * 0.04;
    orbitTargetY += (deltaY * 15 - orbitTargetY) * 0.04;

    orbitalSystem.style.transform = `translate(${orbitTargetX}px, ${orbitTargetY}px)`;

    requestAnimationFrame(updateOrbitalSystem);
}

function rotateOrbitalNodes() {
    rotationAngle += 0.15;

    orbitNodes.forEach((node, index) => {
        const baseAngle = index * 90;
        const currentAngle = baseAngle + rotationAngle;
        const rad = (currentAngle * Math.PI) / 180;
        const radius = 210;

        const x = Math.cos(rad) * radius;
        const y = Math.sin(rad) * radius;

        node.style.transform = `translate(${x}px, ${y}px)`;

        const content = node.querySelector('.node-content');
        if (content) {
            content.style.transform = `rotate(${-rotationAngle}deg) scale(${1 + Math.sin(rotationAngle / 50) * 0.05})`;
        }
    });

    requestAnimationFrame(rotateOrbitalNodes);
}

if (orbitalSystem && orbitNodes.length > 0) {
    updateOrbitalSystem();
    rotateOrbitalNodes();
}

// ===== SCROLL-TRIGGERED TIMELINE ANIMATIONS =====
const timeline = document.querySelector('.timeline');
if (timeline) {
    const timelineObserver = new IntersectionObserver(
        (entries) => {
            if (entries[0].isIntersecting) {
                const nodes = timeline.querySelectorAll('.timeline-node');
                nodes.forEach((node, index) => {
                    setTimeout(() => {
                        node.classList.add('visible');
                    }, index * 250); // Explicit stagger: 250ms between each card
                });
                // Once triggered, we can stop observing
                timelineObserver.unobserve(timeline);
            }
        },
        {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px',
        }
    );
    timelineObserver.observe(timeline);
}

// ===== PARALLAX SCROLL EFFECTS =====
let scrollY = 0;
let ticking = false;

function updateParallax() {
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    const heroVisual = document.querySelector('.hero-visual');

    if (hero && scrollY < window.innerHeight) {
        const offset = scrollY * 0.4;
        // Buttons should not have parallax - removed translateY from heroContent
        if (heroVisual) heroVisual.style.transform = `translateY(${-offset * 0.25}px) scale(${1 - scrollY / window.innerHeight * 0.1})`;
    }

    // Parallax for execution cards
    const serviceCards = document.querySelectorAll('.execution-card');
    serviceCards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const scrollProgress = (window.innerHeight - rect.top) / window.innerHeight;
        if (scrollProgress > 0 && scrollProgress < 1.5) {
            const translateY = (0.5 - scrollProgress) * 30;
            card.style.transform = `translateY(${translateY}px)`;
        }
    });

    ticking = false;
}

window.addEventListener('scroll', () => {
    scrollY = window.pageYOffset;

    if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
    }
});

// ===== GLASS CARD MICRO-INTERACTIONS =====
const glassCards = document.querySelectorAll('.execution-card, .node-card, .why-token, .trust-item');

glassCards.forEach((card) => {
    card.addEventListener('mouseenter', function () {
        this.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });

    card.addEventListener('mouseleave', function () {
        this.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    });

    // Subtle tilt on hover
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 30;
        const rotateY = (centerX - x) / 30;

        card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1200px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            const offsetTop = target.offsetTop - 100;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth',
            });
        }
    });
});

// ===== BUTTON MICRO-INTERACTIONS =====
const buttons = document.querySelectorAll('.btn-glass-primary, .btn-glass-secondary');

buttons.forEach((button) => {
    button.addEventListener('click', function (e) {
        // Ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple styles
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    .btn-glass-primary, .btn-glass-secondary {
        position: relative;
        overflow: hidden;
    }

    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.4);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }

    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// ===== GLOBAL REVEAL SYSTEM =====
const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Don't unobserve if we want it to re-animate (though usually we don't)
                // revealObserver.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
    }
);

// Apply to all reveal components
document.querySelectorAll('.reveal-section, .reveal-text, .reveal-item, .stagger-reveal').forEach((el) => {
    revealObserver.observe(el);
});

// ===== MAGNETIC BUTTONS =====
const magneticButtons = document.querySelectorAll('.btn-glass-primary, .btn-glass-secondary');

magneticButtons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) scale(1.02)`;
        const text = btn.querySelector('span');
        if (text) text.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
        const text = btn.querySelector('span');
        if (text) text.style.transform = '';
    });
});

// ===== NAVBAR SCROLL EFFECT =====
const nav = document.querySelector('.nav');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// ===== LAB CARD PHYSICS-BASED TILT =====
const labCard = document.querySelector('.lab-card');

if (labCard) {
    let labTiltX = 0;
    let labTiltY = 0;
    let labTargetX = 0;
    let labTargetY = 0;

    function animateLabCard() {
        labTiltX += (labTargetX - labTiltX) * 0.08;
        labTiltY += (labTargetY - labTiltY) * 0.08;

        labCard.style.transform = `perspective(1200px) rotateX(${labTiltY}deg) rotateY(${labTiltX}deg)`;

        requestAnimationFrame(animateLabCard);
    }

    labCard.addEventListener('mousemove', (e) => {
        const rect = labCard.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        labTargetX = (x - centerX) / 25;
        labTargetY = (centerY - y) / 25;
    });

    labCard.addEventListener('mouseleave', () => {
        labTargetX = 0;
        labTargetY = 0;
    });

    animateLabCard();
}

// Observers are now handled by the Global Reveal System above
document.querySelectorAll('.trust-item, .why-token').forEach((item) => {
    revealObserver.observe(item);
});

// ===== GLASS REFRACTION HIGHLIGHTS =====
function addSpecularHighlights() {
    const glassElements = document.querySelectorAll('.node-card, .execution-card, .case-frame, .trust-item, .why-token');

    glassElements.forEach((element) => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const xPercent = (x / rect.width) * 100;
            const yPercent = (y / rect.height) * 100;

            element.style.background = `
                radial-gradient(circle at ${xPercent}% ${yPercent}%,
                rgba(255, 255, 255, 0.08) 0%,
                rgba(255, 255, 255, 0.04) 50%,
                transparent 100%)
            `;
        });

        element.addEventListener('mouseleave', () => {
            element.style.background = '';
        });
    });
}

addSpecularHighlights();

// ===== DEPTH BLUR SIMULATION =====
function updateDepthBlur() {
    const scrollPercentage = Math.min(scrollY / (document.body.scrollHeight - window.innerHeight), 1);

    // Add subtle blur to background elements as you scroll
    const bgElements = document.querySelectorAll('.hero-visual, .orbital-system');
    bgElements.forEach((el) => {
        const blurAmount = scrollPercentage * 3;
        el.style.filter = `blur(${blurAmount}px) brightness(${1 - scrollPercentage * 0.2})`;
    });
}

window.addEventListener('scroll', updateDepthBlur);

// ===== AMBIENT COLOR SHIFT =====
let colorShiftPhase = 0;

function updateAmbientColor() {
    colorShiftPhase += 0.0008;

    const technicalBlue = `hsl(${220 + Math.sin(colorShiftPhase) * 15}, 85%, 65%)`;

    document.documentElement.style.setProperty('--primary-blue', technicalBlue);

    requestAnimationFrame(updateAmbientColor);
}

updateAmbientColor();

// ===== CASE FRAME PARALLAX =====
const caseFrame = document.querySelector('.case-frame');

if (caseFrame) {
    window.addEventListener('scroll', () => {
        const rect = caseFrame.getBoundingClientRect();
        const scrollProgress = (window.innerHeight - rect.top) / window.innerHeight;

        if (scrollProgress > 0 && scrollProgress < 1.5) {
            const translateY = (0.5 - scrollProgress) * 30;
            caseFrame.style.transform = `translateY(${translateY}px)`;
        }
    });
}

// ===== PERFORMANCE OPTIMIZATION =====
// Reduce animations for users who prefer reduced motion
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('*').forEach((el) => {
        el.style.animation = 'none';
        el.style.transition = 'none';
    });
}

// (Narrative pinning is now handled by pure CSS sticky for maximum smoothness)

// ===== INITIALIZATION =====
window.addEventListener('load', () => {
    // Hide loader
    setTimeout(() => {
        document.body.classList.add('loaded');

        // Orchestrated reveal: start with hero
        const hero = document.querySelector('.hero');
        if (hero) hero.classList.add('visible');
    }, 1500); // 1.5s loader time

    console.log('%c✨ Reimagine', 'font-size: 20px; font-weight: bold; color: #00f2ff;');
    console.log('%cPremium glassmorphic system loaded', 'font-size: 14px; color: #bababa;');

    // Initialize Card Focus Observer for Execution Models
    initCardFocusObserver();
});

// ===== EXECUTION MODELS FOCUS OBSERVER =====
function initCardFocusObserver() {
    const cards = document.querySelectorAll('.execution-card');
    if (!cards.length) return;

    const options = {
        threshold: 0.3,
        rootMargin: '-5% 0px -5% 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-focus');
            } else {
                entry.target.classList.remove('in-focus');
            }
        });
    }, options);

    cards.forEach(card => observer.observe(card));
}

// ===== WINDOW RESIZE HANDLER =====
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
    }, 250);
});

// ===== HERO METRICS COUNTER ANIMATION =====
const metricsObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const metricValues = entry.target.querySelectorAll('.metric-value');

                metricValues.forEach((value) => {
                    const text = value.textContent.trim();

                    if (text.includes('–')) {
                        // Animate range values
                        const [start, end] = text.split('–').map((n) => parseInt(n));
                        animateValue(value, start, end, 1500);
                    } else if (text.includes('%')) {
                        // Animate percentage values
                        const num = parseInt(text);
                        animateValue(value, 0, num, 1500, '%');
                    }
                });

                metricsObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.5 }
);

const heroMetrics = document.querySelector('.hero-metrics');
if (heroMetrics) {
    metricsObserver.observe(heroMetrics);
}

function animateValue(element, start, end, duration, suffix = '') {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }

        if (suffix === '%') {
            element.textContent = Math.floor(current) + suffix;
        } else if (typeof end === 'string' || typeof start === 'string') {
            element.textContent = Math.floor(current) + '–' + end;
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// ===== GLASS EDGE LIGHTING =====
function addEdgeLighting() {
    const glassCards = document.querySelectorAll('.node-card, .execution-card, .case-frame');

    glassCards.forEach((card) => {
        card.style.position = 'relative';

        card.addEventListener('mouseenter', function () {
            const edgeLight = document.createElement('div');
            edgeLight.className = 'edge-light';
            edgeLight.style.cssText = `
                position: absolute;
                inset: 0;
                border-radius: inherit;
                background: linear-gradient(135deg, rgba(46, 88, 255, 0.2) 0%, transparent 50%);
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.3s;
            `;
            this.appendChild(edgeLight);

            setTimeout(() => {
                edgeLight.style.opacity = '1';
            }, 10);
        });

        card.addEventListener('mouseleave', function () {
            const edgeLight = this.querySelector('.edge-light');
            if (edgeLight) {
                edgeLight.style.opacity = '0';
                setTimeout(() => edgeLight.remove(), 300);
            }
        });
    });
}

addEdgeLighting();

// ===== COMPARISON SECTION INTERACTIONS =====
function initComparisonInteractions() {
    const rows = document.querySelectorAll('[data-row]');

    rows.forEach(row => {
        row.addEventListener('mouseenter', () => {
            const rowId = row.getAttribute('data-row');
            document.querySelectorAll(`[data-row="${rowId}"]`).forEach(el => {
                el.classList.add('highlighted');
            });
        });

        row.addEventListener('mouseleave', () => {
            const rowId = row.getAttribute('data-row');
            document.querySelectorAll(`[data-row="${rowId}"]`).forEach(el => {
                el.classList.remove('highlighted');
            });
        });
    });

    // Simple Tooltip logic
    const infoIcons = document.querySelectorAll('.info-icon');
    infoIcons.forEach(icon => {
        icon.addEventListener('mouseenter', (e) => {
            const text = icon.getAttribute('data-tooltip');
            const tooltip = document.createElement('div');
            tooltip.className = 'feature-tooltip';
            tooltip.innerText = text;
            document.body.appendChild(tooltip);

            const rect = icon.getBoundingClientRect();
            tooltip.style.left = `${rect.left + rect.width / 2}px`;
            tooltip.style.top = `${rect.top - 10}px`;

            // Add style for tooltip if not in CSS
            if (!document.getElementById('tooltip-style')) {
                const style = document.createElement('style');
                style.id = 'tooltip-style';
                style.innerHTML = `
                    .feature-tooltip {
                        position: fixed;
                        transform: translate(-50%, -100%);
                        background: rgba(0, 0, 0, 0.9);
                        color: white;
                        padding: 8px 12px;
                        border-radius: 8px;
                        font-size: 12px;
                        border: 1px solid var(--glass-border);
                        z-index: 10000;
                        pointer-events: none;
                        max-width: 200px;
                        text-align: center;
                        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                        backdrop-filter: blur(10px);
                        animation: tooltipFade 0.2s ease-out;
                    }
                    @keyframes tooltipFade {
                        from { opacity: 0; transform: translate(-50%, -90%); }
                        to { opacity: 1; transform: translate(-50%, -100%); }
                    }
                `;
                document.head.appendChild(style);
            }
        });

        icon.addEventListener('mouseleave', () => {
            const tooltip = document.querySelector('.feature-tooltip');
            if (tooltip) tooltip.remove();
        });
    });
}

initComparisonInteractions();
