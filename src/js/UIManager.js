export class UIManager {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.navMenu = document.getElementById('nav-menu');
        this.navToggle = document.getElementById('nav-toggle');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.init();
    }

    init() {
        // Mobile menu toggle
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }

        // Close mobile menu when clicking nav links
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    this.closeMobileMenu();
                }
            });
        });

        // Active nav link on scroll
        this.setupScrollSpy();

        // Close mobile menu on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        if (this.navMenu) {
            this.navMenu.classList.toggle('active');
        }
    }

    closeMobileMenu() {
        if (this.navMenu) {
            this.navMenu.classList.remove('active');
        }
    }

    setupScrollSpy() {
        const sections = document.querySelectorAll('.section[id]');
        
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    this.setActiveNavLink(id);
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            observer.observe(section);
        });
    }

    setActiveNavLink(sectionId) {
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });
    }

    // View control button handlers
    setupViewControls(cameraController) {
        const resetBtn = document.getElementById('reset-view-btn');
        const frontBtn = document.getElementById('front-view-btn');
        const sideBtn = document.getElementById('side-view-btn');
        const topBtn = document.getElementById('top-view-btn');

        if (resetBtn && cameraController) {
            resetBtn.addEventListener('click', () => {
                cameraController.resetView();
            });
        }

        if (frontBtn && cameraController) {
            frontBtn.addEventListener('click', () => {
                cameraController.frontView();
            });
        }

        if (sideBtn && cameraController) {
            sideBtn.addEventListener('click', () => {
                cameraController.sideView();
            });
        }

        if (topBtn && cameraController) {
            topBtn.addEventListener('click', () => {
                cameraController.topView();
            });
        }
    }

    // Hero button handlers
    setupHeroButtons() {
        const exploreBtn = document.getElementById('explore-btn');
        const learnMoreBtn = document.getElementById('learn-more-btn');

        if (exploreBtn) {
            exploreBtn.addEventListener('click', () => {
                const modelSection = document.getElementById('model');
                if (modelSection) {
                    modelSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }

        if (learnMoreBtn) {
            learnMoreBtn.addEventListener('click', () => {
                const overviewSection = document.getElementById('overview');
                if (overviewSection) {
                    overviewSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    }

    // Update loading screen
    updateLoadingProgress(percentage) {
        const progressBar = document.getElementById('progress-bar');
        const loadingPercentage = document.getElementById('loading-percentage');
        
        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
        }
        
        if (loadingPercentage) {
            loadingPercentage.textContent = `${Math.round(percentage)}%`;
        }
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            // Remove from DOM after animation
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }

    showViewControls() {
        const viewControls = document.getElementById('view-controls');
        if (viewControls) {
            viewControls.style.display = 'flex';
        }
    }
}
