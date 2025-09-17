// Guide API Express + Sequelize - JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Vérifier et corriger le layout si nécessaire
    fixLayoutIfNeeded();
    
    // Gestion de la navigation
    initNavigation();
    
    // Gestion de la copie de code
    initCodeCopy();
    
    // Initialisation des animations
    initAnimations();
    
    // Navigation au scroll
    initScrollSpy();
});

// Correction du layout pour compatibilité navigateurs
function fixLayoutIfNeeded() {
    const container = document.querySelector('.container');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (!container || !sidebar || !mainContent) {
        return;
    }
    
    // Vérifier si le layout flexbox fonctionne
    const containerWidth = container.offsetWidth;
    const sidebarWidth = sidebar.offsetWidth;
    const mainContentWidth = mainContent.offsetWidth;
    
    // Si le contenu principal est trop étroit, forcer les dimensions
    if (mainContentWidth < containerWidth * 0.5) {
        console.log('Correction du layout détectée...');
        
        // Forcer les styles pour Brave/navigateurs problématiques
        sidebar.style.cssText += `
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 300px !important;
            height: 100vh !important;
            z-index: 100 !important;
        `;
        
        mainContent.style.cssText += `
            margin-left: 320px !important;
            width: calc(100% - 320px) !important;
            min-height: 100vh !important;
        `;
        
        // Ajouter une classe pour marquer la correction
        document.body.classList.add('layout-fixed');
    }
}

// Navigation corrigée et fonctionnelle
function initNavigation() {
    const allLinks = document.querySelectorAll('.nav-link');
    
    // Gérer TOUS les liens de navigation
    allLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const href = this.getAttribute('href');
            const isChapterTitle = this.classList.contains('chapter-title');
            
            if (isChapterTitle) {
                // C'est un titre de chapitre
                const chapter = this.closest('.chapter');
                
                // Fermer tous les autres chapitres
                document.querySelectorAll('.chapter').forEach(ch => {
                    if (ch !== chapter) ch.classList.remove('open');
                });
                
                // Toggle ce chapitre
                chapter.classList.toggle('open');
            } else {
                // C'est un lien normal ou sous-lien
                // S'assurer que le chapitre parent est ouvert si c'est un sous-lien
                const parentChapter = this.closest('.chapter');
                if (parentChapter) {
                    parentChapter.classList.add('open');
                }
            }
            
            // Dans tous les cas, naviguer vers la section
            setActiveLink(this);
            scrollToSection(href);
        });
    });
    
    // Fonction pour activer le bon lien
    function setActiveLink(clickedLink) {
        // Enlever active de tous les liens
        allLinks.forEach(l => l.classList.remove('active'));
        
        // Activer le lien cliqué
        clickedLink.classList.add('active');
    }
    
    // Fonction pour scroller vers une section
    function scrollToSection(href) {
        const section = document.querySelector(href);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

// Copie de code avec feedback
function initCodeCopy() {
    const codeBlocks = document.querySelectorAll('.code-container');
    
    codeBlocks.forEach(container => {
        const copyBtn = container.querySelector('.copy-btn');
        const codeElement = container.querySelector('pre code');
        
        if (copyBtn && codeElement) {
            copyBtn.addEventListener('click', function() {
                try {
                    const code = codeElement.textContent;
                    
                    if (navigator.clipboard) {
                        navigator.clipboard.writeText(code).then(() => {
                            // Feedback visuel
                            const originalText = copyBtn.textContent;
                            copyBtn.textContent = 'Copié !';
                            copyBtn.classList.add('copied');
                            
                            // Animation du code
                            codeElement.classList.add('highlight-copied');
                            
                            setTimeout(() => {
                                copyBtn.textContent = originalText;
                                copyBtn.classList.remove('copied');
                                codeElement.classList.remove('highlight-copied');
                            }, 2000);
                            
                            // Notification toast
                            showToast('Code copié dans le presse-papiers !', 'success');
                        }).catch(err => {
                            console.error('Erreur lors de la copie:', err);
                            showToast('Erreur lors de la copie', 'error');
                        });
                    } else {
                        // Fallback pour navigateurs anciens
                        showToast('Copie non supportée sur ce navigateur', 'warning');
                    }
                } catch (error) {
                    console.error('Erreur dans la fonction de copie:', error);
                    showToast('Erreur lors de la copie', 'error');
                }
            });
        }
    });
}

// Animations au scroll
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observer tous les éléments .step
    document.querySelectorAll('.step').forEach(step => {
        step.style.opacity = '0';
        step.style.transform = 'translateY(20px)';
        step.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(step);
    });
}

// ScrollSpy corrigé
function initScrollSpy() {
    const sections = document.querySelectorAll('.section');
    const allLinks = document.querySelectorAll('.nav-link');
    
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                const targetHref = `#${sectionId}`;
                
                // Enlever active de tous les liens
                allLinks.forEach(l => l.classList.remove('active'));
                
                // Trouver TOUS les liens qui pointent vers cette section
                const matchingLinks = document.querySelectorAll(`a[href="${targetHref}"]`);
                
                if (matchingLinks.length > 0) {
                    // Prioriser : sous-lien > chapitre principal
                    let linkToActivate = matchingLinks[0];
                    
                    // Chercher s'il y a un sous-lien (plus spécifique)
                    for (let link of matchingLinks) {
                        if (link.closest('.sub-links')) {
                            linkToActivate = link;
                            break;
                        }
                    }
                    
                    // Activer le lien choisi
                    linkToActivate.classList.add('active');
                    
                    // Ouvrir le chapitre parent si c'est un sous-lien
                    const parentChapter = linkToActivate.closest('.chapter');
                    if (parentChapter) {
                        parentChapter.classList.add('open');
                    }
                }
            }
        });
    }, { 
        threshold: 0.3,
        rootMargin: '-20% 0px -70% 0px'
    });
    
    sections.forEach(section => observer.observe(section));
}

// Système de notifications toast
function showToast(message, type = 'info') {
    // Créer l'élément toast
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Créer le contenu de façon sécurisée
    const toastContent = document.createElement('div');
    toastContent.className = 'toast-content';
    
    const toastIcon = document.createElement('span');
    toastIcon.className = 'toast-icon';
    toastIcon.textContent = getToastIcon(type);
    
    const toastMessage = document.createElement('span');
    toastMessage.className = 'toast-message';
    toastMessage.textContent = message;
    
    toastContent.appendChild(toastIcon);
    toastContent.appendChild(toastMessage);
    toast.appendChild(toastContent);
    
    // Styles inline pour le toast
    Object.assign(toast.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        zIndex: '1000',
        opacity: '0',
        transform: 'translateX(100%)',
        transition: 'all 0.3s ease',
        minWidth: '300px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
    });
    
    // Couleurs selon le type
    const colors = {
        success: '#27ae60',
        error: '#e74c3c',
        info: '#3498db',
        warning: '#f39c12'
    };
    
    toast.style.background = colors[type] || colors.info;
    
    // Ajouter au DOM
    document.body.appendChild(toast);
    
    // Animation d'entrée
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    // Suppression automatique
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

function getToastIcon(type) {
    const icons = {
        success: '✅',
        error: '❌',
        info: 'ℹ️',
        warning: '⚠️'
    };
    return icons[type] || icons.info;
}

// Recherche dans le contenu
function initSearch() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Rechercher dans le guide...';
    searchInput.className = 'search-input';
    
    // Styles pour la recherche
    Object.assign(searchInput.style, {
        width: '100%',
        padding: '0.75rem',
        border: '1px solid #e1e8ed',
        borderRadius: '8px',
        fontSize: '1rem',
        marginBottom: '1rem'
    });
    
    // Ajouter à la sidebar
    const sidebar = document.querySelector('.sidebar');
    const nav = sidebar.querySelector('.nav-menu');
    sidebar.insertBefore(searchInput, nav);
    
    // Fonctionnalité de recherche
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const sections = document.querySelectorAll('.section');
        
        sections.forEach(section => {
            const content = section.textContent.toLowerCase();
            const isVisible = content.includes(searchTerm) || searchTerm === '';
            
            section.style.display = isVisible ? 'block' : 'none';
        });
        
        // Mettre à jour la navigation
        updateNavigation(searchTerm);
    });
}

function updateNavigation(searchTerm) {
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            const isVisible = targetSection.style.display !== 'none';
            link.style.display = isVisible ? 'block' : 'none';
        }
    });
}

// Mode sombre
function initDarkMode() {
    const darkModeBtn = document.createElement('button');
    darkModeBtn.innerHTML = '🌙';
    darkModeBtn.className = 'dark-mode-toggle';
    darkModeBtn.title = 'Mode sombre';
    
    Object.assign(darkModeBtn.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        border: 'none',
        background: '#2c3e50',
        color: 'white',
        fontSize: '1.5rem',
        cursor: 'pointer',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
        zIndex: '999'
    });
    
    document.body.appendChild(darkModeBtn);
    
    darkModeBtn.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        this.innerHTML = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
        
        // Sauvegarder la préférence
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    });
    
    // Charger la préférence
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        darkModeBtn.innerHTML = '☀️';
    }
}

// Barre de progression de lecture
function initReadingProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    
    Object.assign(progressBar.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '0%',
        height: '3px',
        background: 'linear-gradient(90deg, #3498db, #27ae60)',
        zIndex: '1001',
        transition: 'width 0.1s ease'
    });
    
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        progressBar.style.width = scrollPercent + '%';
    });
}

// Initialiser toutes les fonctionnalités avancées
setTimeout(() => {
    initSearch();
    initDarkMode();
    initReadingProgress();
}, 1000);