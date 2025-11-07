// Основной функционал сайта KVA Code
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

function initApp() {
    setupAuthButtons();
    setupSmoothScroll();
    setupScrollAnimations();
    setupCourseCards();
    setupMobileMenu();
    setupAnimations();
    setupCourseFilter();
    setupBlogFilter();
    setupReviewsFilter();
    setupFAQ();
    setupContactForm();
    setupNewsletter();
}

// Настройка кнопок авторизации
function setupAuthButtons() {
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');

    if (loginBtn && registerBtn) {
        loginBtn.addEventListener('click', function() {
            showAuthModal('login');
        });

        registerBtn.addEventListener('click', function() {
            showAuthModal('register');
        });
    }
}

// Модальное окно авторизации
function showAuthModal(type) {
    const isLogin = type === 'login';
    const title = isLogin ? 'Вход в аккаунт' : 'Регистрация';
    const buttonText = isLogin ? 'Войти' : 'Создать аккаунт';
    const switchText = isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?';
    const switchButtonText = isLogin ? 'Зарегистрироваться' : 'Войти';

    const modalHTML = `
        <div class="modal-overlay" id="authModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="authForm" class="auth-form">
                        ${!isLogin ? `
                        <div class="form-group">
                            <label>Имя и фамилия</label>
                            <input type="text" placeholder="Введите ваше имя" required>
                        </div>
                        ` : ''}

                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" placeholder="your@email.com" required>
                        </div>

                        <div class="form-group">
                            <label>Пароль</label>
                            <input type="password" placeholder="Минимум 8 символов" required>
                        </div>

                        ${!isLogin ? `
                        <div class="form-group">
                            <label>Подтвердите пароль</label>
                            <input type="password" placeholder="Повторите пароль" required>
                        </div>
                        ` : ''}

                        <button type="submit" class="btn-primary full-width">${buttonText}</button>
                    </form>

                    <div class="auth-divider">
                        <span>или</span>
                    </div>

                    <div class="social-auth">
                        <button class="btn-social google">
                            <span>📧</span>
                            Продолжить с Google
                        </button>
                        <button class="btn-social github">
                            <span>🐙</span>
                            Продолжить с GitHub
                        </button>
                    </div>

                    <div class="auth-switch">
                        <p>${switchText} <a href="#" id="switchAuth">${switchButtonText}</a></p>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    setupModalEvents(isLogin);
    addModalStyles();
}

function setupModalEvents(isLogin) {
    const modal = document.getElementById('authModal');
    const closeBtn = modal.querySelector('.close-modal');
    const switchAuth = modal.querySelector('#switchAuth');
    const form = modal.querySelector('#authForm');

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) closeModal();
    });

    switchAuth.addEventListener('click', function(e) {
        e.preventDefault();
        closeModal();
        showAuthModal(isLogin ? 'register' : 'login');
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        handleAuthSubmit(isLogin);
    });
}

function closeModal() {
    const modal = document.getElementById('authModal');
    if (modal) modal.remove();
}

function handleAuthSubmit(isLogin) {
    const action = isLogin ? 'входа' : 'регистрации';
    showNotification(`Форма ${action} отправлена!`, 'success');
    closeModal();
}

// Уведомления
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;

    const icons = {
        success: '✅',
        error: '❌',
        info: 'ℹ️'
    };

    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${icons[type] || icons.info}</span>
            <span>${message}</span>
        </div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Мобильное меню
function setupMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    const authButtons = document.querySelector('.auth-buttons');

    if (menuBtn) {
        menuBtn.addEventListener('click', function() {
            const isOpen = nav.style.display === 'flex';

            if (isOpen) {
                nav.style.display = 'none';
                authButtons.style.display = 'none';
                menuBtn.classList.remove('active');
            } else {
                nav.style.display = 'flex';
                authButtons.style.display = 'flex';
                menuBtn.classList.add('active');

                // Адаптация для мобильных
                nav.style.flexDirection = 'column';
                nav.style.position = 'absolute';
                nav.style.top = '100%';
                nav.style.left = '0';
                nav.style.right = '0';
                nav.style.background = 'var(--surface)';
                nav.style.padding = '2rem';
                nav.style.borderTop = '1px solid var(--border)';

                authButtons.style.flexDirection = 'column';
                authButtons.style.position = 'absolute';
                authButtons.style.top = 'calc(100% + 200px)';
                authButtons.style.left = '0';
                authButtons.style.right = '0';
                authButtons.style.background = 'var(--surface)';
                authButtons.style.padding = '2rem';
                authButtons.style.borderTop = '1px solid var(--border)';
            }
        });
    }
}

// Плавная прокрутка
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Анимации при скролле
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    const elementsToAnimate = document.querySelectorAll('.course-card, .feature-card, .testimonial-card, .post-card, .review-card, .vacancy-card, .value-card, .team-member');
    elementsToAnimate.forEach(el => observer.observe(el));
}

// Карточки курсов
function setupCourseCards() {
    document.querySelectorAll('.btn-course').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const courseCard = this.closest('.course-card');
            const courseTitle = courseCard.querySelector('h3').textContent;
            showNotification(`Курс "${courseTitle}" добавлен в корзину!`, 'success');
        });
    });
}

// Дополнительные анимации
function setupAnimations() {
    // Параллакс эффект для героя
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

    // Анимация хедера при скролле
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(15, 23, 42, 0.95)';
            header.style.backdropFilter = 'blur(20px)';
        } else {
            header.style.background = 'rgba(15, 23, 42, 0.8)';
            header.style.backdropFilter = 'blur(20px)';
        }
    });
}

// Фильтрация курсов
function setupCourseFilter() {
    const filterButtons = document.querySelectorAll('.courses-filter .filter-btn');
    const courseCards = document.querySelectorAll('.course-card');

    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Убираем активный класс у всех кнопок в группе
                const buttonGroup = this.closest('.filter-buttons');
                if (buttonGroup) {
                    buttonGroup.querySelectorAll('.filter-btn').forEach(btn => {
                        btn.classList.remove('active');
                    });
                }

                // Добавляем активный класс текущей кнопке
                this.classList.add('active');

                const filter = this.getAttribute('data-filter');

                courseCards.forEach(card => {
                    if (filter === 'all') {
                        card.style.display = 'block';
                    } else if (filter === 'job') {
                        const hasJob = card.getAttribute('data-job') === 'true';
                        card.style.display = hasJob ? 'block' : 'none';
                    } else if (filter === 'popular') {
                        const isPopular = card.getAttribute('data-popular') === 'true';
                        card.style.display = isPopular ? 'block' : 'none';
                    } else {
                        const level = card.getAttribute('data-level');
                        card.style.display = level === filter ? 'block' : 'none';
                    }

                    // Анимация появления
                    if (card.style.display === 'block') {
                        card.style.animation = 'fadeInUp 0.6s ease-out';
                    }
                });
            });
        });
    }
}

// Фильтрация блога
function setupBlogFilter() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const postCards = document.querySelectorAll('.post-card');

    if (categoryButtons.length > 0) {
        categoryButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Убираем активный класс у всех кнопок
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                // Добавляем активный класс текущей кнопке
                this.classList.add('active');

                const category = this.getAttribute('data-category');

                postCards.forEach(card => {
                    if (category === 'all') {
                        card.style.display = 'block';
                    } else {
                        const postCategory = card.getAttribute('data-category');
                        card.style.display = postCategory === category ? 'block' : 'none';
                    }

                    // Анимация появления
                    if (card.style.display === 'block') {
                        card.style.animation = 'fadeInUp 0.6s ease-out';
                    }
                });
            });
        });
    }
}

// Фильтрация отзывов
function setupReviewsFilter() {
    const filterButtons = document.querySelectorAll('.reviews-filter .filter-btn');
    const reviewCards = document.querySelectorAll('.review-card');

    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Убираем активный класс у всех кнопок
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Добавляем активный класс текущей кнопке
                this.classList.add('active');

                const course = this.getAttribute('data-course');

                reviewCards.forEach(card => {
                    if (course === 'all') {
                        card.style.display = 'block';
                    } else {
                        const reviewCourse = card.getAttribute('data-course');
                        card.style.display = reviewCourse === course ? 'block' : 'none';
                    }

                    // Анимация появления
                    if (card.style.display === 'block') {
                        card.style.animation = 'fadeInUp 0.6s ease-out';
                    }
                });
            });
        });
    }
}

// FAQ аккордеон
function setupFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', function() {
            // Закрываем все остальные элементы
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });

            // Переключаем текущий элемент
            item.classList.toggle('active');
        });
    });

    // Категории FAQ
    const faqCategoryButtons = document.querySelectorAll('.faq-category-btn');
    const faqSections = document.querySelectorAll('.faq-section');

    if (faqCategoryButtons.length > 0) {
        faqCategoryButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Убираем активный класс у всех кнопок
                faqCategoryButtons.forEach(btn => btn.classList.remove('active'));
                // Добавляем активный класс текущей кнопке
                this.classList.add('active');

                const category = this.getAttribute('data-category');

                faqSections.forEach(section => {
                    if (section.id === category) {
                        section.classList.add('active');
                    } else {
                        section.classList.remove('active');
                    }
                });
            });
        });
    }
}

// Обработка формы контактов
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Сбор данных формы
            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                course: formData.get('course'),
                message: formData.get('message')
            };

            // Валидация
            if (!data.name || !data.email || !data.message) {
                showNotification('Пожалуйста, заполните все обязательные поля', 'error');
                return;
            }

            // Имитация отправки
            showNotification('Сообщение отправлено! Мы свяжемся с вами в течение часа.', 'success');
            contactForm.reset();
        });
    }
}

// Форма рассылки
function setupNewsletter() {
    const newsletterForm = document.querySelector('.newsletter-form');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;

            // Имитация отправки
            showNotification('Спасибо за подписку! Проверьте вашу почту для подтверждения.', 'success');
            this.reset();
        });
    }
}

// Стили для модальных окон и уведомлений
function addModalStyles() {
    const styles = `
        <style>
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                padding: 20px;
                opacity: 0;
                animation: fadeIn 0.3s ease forwards;
            }

            @keyframes fadeIn {
                to { opacity: 1; }
            }

            .modal-content {
                background: var(--surface);
                border-radius: 20px;
                padding: 0;
                max-width: 400px;
                width: 100%;
                border: 1px solid var(--border);
                box-shadow: var(--shadow-lg);
                transform: scale(0.9);
                animation: scaleIn 0.3s ease forwards;
            }

            @keyframes scaleIn {
                to { transform: scale(1); }
            }

            .modal-header {
                padding: 1.5rem;
                border-bottom: 1px solid var(--border);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .modal-header h3 {
                margin: 0;
                color: var(--text-primary);
            }

            .close-modal {
                background: none;
                border: none;
                color: var(--text-secondary);
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 6px;
                transition: all 0.3s ease;
            }

            .close-modal:hover {
                background: var(--surface-light);
                color: var(--text-primary);
            }

            .modal-body {
                padding: 1.5rem;
            }

            .auth-form .form-group {
                margin-bottom: 1rem;
            }

            .auth-form label {
                display: block;
                margin-bottom: 0.5rem;
                color: var(--text-primary);
                font-weight: 500;
            }

            .auth-form input {
                width: 100%;
                padding: 12px;
                background: var(--background);
                border: 1px solid var(--border);
                border-radius: 8px;
                color: var(--text-primary);
                font-size: 1rem;
                transition: border-color 0.3s ease;
            }

            .auth-form input:focus {
                outline: none;
                border-color: var(--primary);
            }

            .full-width {
                width: 100%;
            }

            .auth-divider {
                text-align: center;
                margin: 1.5rem 0;
                position: relative;
            }

            .auth-divider::before {
                content: '';
                position: absolute;
                top: 50%;
                left: 0;
                right: 0;
                height: 1px;
                background: var(--border);
            }

            .auth-divider span {
                background: var(--surface);
                padding: 0 1rem;
                color: var(--text-muted);
                font-size: 0.9rem;
            }

            .social-auth {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
                margin-bottom: 1.5rem;
            }

            .btn-social {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 12px;
                border: 1px solid var(--border);
                background: var(--background);
                color: var(--text-primary);
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 0.9rem;
            }

            .btn-social:hover {
                border-color: var(--primary);
                background: var(--surface-light);
            }

            .auth-switch {
                text-align: center;
            }

            .auth-switch a {
                color: var(--primary);
                text-decoration: none;
                font-weight: 500;
            }

            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--surface);
                border: 1px solid var(--border);
                border-radius: 12px;
                padding: 1rem;
                box-shadow: var(--shadow-lg);
                transform: translateX(400px);
                transition: transform 0.3s ease;
                z-index: 10000;
                max-width: 300px;
            }

            .notification.show {
                transform: translateX(0);
            }

            .notification-success {
                border-left: 4px solid var(--success);
            }

            .notification-error {
                border-left: 4px solid var(--error);
            }

            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }

            .mobile-menu-btn.active span:nth-child(1) {
                transform: rotate(45deg) translate(6px, 6px);
            }

            .mobile-menu-btn.active span:nth-child(2) {
                opacity: 0;
            }

            .mobile-menu-btn.active span:nth-child(3) {
                transform: rotate(-45deg) translate(6px, -6px);
            }
        </style>
    `;

    if (!document.getElementById('dynamic-styles')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'dynamic-styles';
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);
    }
}

console.log('KVA Code website fully initialized! 🚀');