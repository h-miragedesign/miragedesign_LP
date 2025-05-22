// DOM要素の取得
const header = document.querySelector('.header');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const links = document.querySelectorAll('a[href^="#"]');
const sections = document.querySelectorAll('.section');
const particles = document.querySelector('#particles-js');

// 初期設定
document.addEventListener('DOMContentLoaded', function() {
    // パーティクルの初期化
    initParticles();
    
    // スクロールアニメーションの初期化
    initScrollAnimations();
    
    // スクロールトップボタンの追加
    createScrollTopButton();
    
    // サービスカードのホバーエフェクト
    initServiceCardEffects();
    
    // トーストシステムの初期化
    initToastSystem();

    // フォーム検証の初期化
    initFormValidation();
});

// ヘッダースクロール制御
let lastScrollTop = 0;
window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // ヘッダーの背景色変更
    if (scrollTop > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // ヘッダーの表示/非表示制御
    if (scrollTop > lastScrollTop && scrollTop > 200) {
        header.style.transform = 'translateY(-100%)';
    } else {
        header.style.transform = 'translateY(0)';
    }
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    
    // スクロールトップボタンの表示制御
    const scrollTopBtn = document.querySelector('.scroll-top');
    if (scrollTopBtn) {
        if (scrollTop > 300) {
            scrollTopBtn.classList.add('active');
        } else {
            scrollTopBtn.classList.remove('active');
        }
    }
    
    // スクロール位置に応じたセクションのアニメーション
    animateSectionsOnScroll();
});

// メニュートグル制御
menuToggle.addEventListener('click', function() {
    this.classList.toggle('active');
    nav.classList.toggle('active');
    document.body.classList.toggle('menu-open');
});

// スムーススクロール
links.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        // モバイルメニューを閉じる
        menuToggle.classList.remove('active');
        nav.classList.remove('active');
        document.body.classList.remove('menu-open');
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;
        
        const headerOffset = 90;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = targetPosition - headerOffset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    });
});

// パーティクル初期化
function initParticles() {
    if (!particles) return;
    
    particlesJS('particles-js', {
        "particles": {
            "number": {
                "value": 100,
                "density": {
                    "enable": true,
                    "value_area": 800
                }
            },
            "color": {
                "value": "#ffffff"
            },
            "shape": {
                "type": "circle",
                "stroke": {
                    "width": 0,
                    "color": "#000000"
                },
                "polygon": {
                    "nb_sides": 5
                }
            },
            "opacity": {
                "value": 0.3,
                "random": true,
                "anim": {
                    "enable": true,
                    "speed": 1,
                    "opacity_min": 0.1,
                    "sync": false
                }
            },
            "size": {
                "value": 3,
                "random": true,
                "anim": {
                    "enable": true,
                    "speed": 2,
                    "size_min": 0.1,
                    "sync": false
                }
            },
            "line_linked": {
                "enable": true,
                "distance": 150,
                "color": "#ffffff",
                "opacity": 0.2,
                "width": 1
            },
            "move": {
                "enable": true,
                "speed": 1.5,
                "direction": "none",
                "random": true,
                "straight": false,
                "out_mode": "out",
                "bounce": false,
                "attract": {
                    "enable": true,
                    "rotateX": 600,
                    "rotateY": 1200
                }
            }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": {
                    "enable": true,
                    "mode": "bubble"
                },
                "onclick": {
                    "enable": true,
                    "mode": "push"
                },
                "resize": true
            },
            "modes": {
                "grab": {
                    "distance": 400,
                    "line_linked": {
                        "opacity": 1
                    }
                },
                "bubble": {
                    "distance": 200,
                    "size": 4,
                    "duration": 2,
                    "opacity": 0.8,
                    "speed": 3
                },
                "repulse": {
                    "distance": 200,
                    "duration": 0.4
                },
                "push": {
                    "particles_nb": 4
                },
                "remove": {
                    "particles_nb": 2
                }
            }
        },
        "retina_detect": true
    });
}

// 蜃気楼のようなエフェクト
function applyMirageEffect() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.classList.add('mirage-effect');
    });
}

// スクロールアニメーションの初期化
function initScrollAnimations() {
    // Intersection Observerの設定
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };
    
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 画面に入ったときのアニメーション
                const target = entry.target;
                
                // アニメーションクラスの適用
                if (target.classList.contains('fade-in')) {
                    target.classList.add('animate');
                } else if (target.classList.contains('slide-in-left')) {
                    target.classList.add('animate');
                } else if (target.classList.contains('slide-in-right')) {
                    target.classList.add('animate');
                }
                
                // セクションタイトルのアニメーション
                const sectionTitle = target.querySelector('.section-title');
                if (sectionTitle) {
                    sectionTitle.classList.add('animate');
                }
                
                // セクション説明のアニメーション
                const sectionDesc = target.querySelector('.section-description');
                if (sectionDesc) {
                    sectionDesc.classList.add('animate', 'animate-delay-1');
                }
                
                // セクションコンテンツのアニメーション
                const contentElements = target.querySelectorAll('.effect-card, .animate-item');
                if (contentElements.length > 0) {
                    contentElements.forEach((el, index) => {
                        setTimeout(() => {
                            el.classList.add('animate');
                        }, 200 * index);
                    });
                }
                
                // 一度アニメーションしたら監視を止める
                observer.unobserve(target);
            }
        });
    };
    
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // 監視対象の設定
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // 個別要素の監視
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// セクションのスクロールアニメーション
function animateSectionsOnScroll() {
    const scrollPosition = window.scrollY + window.innerHeight * 0.8;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition > sectionTop && scrollPosition < sectionTop + sectionHeight) {
            section.classList.add('active');
        }
    });
}

// サービスカードのホバーエフェクト
function initServiceCardEffects() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.05)';
        });
    });
}

// トーストシステムの初期化
function initToastSystem() {
    // トースト要素の作成
    const toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
    
    // グローバルトースト関数の追加
    window.showToast = function(message, type = 'success', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        let iconClass = 'fas fa-check-circle';
        if (type === 'error') {
            iconClass = 'fas fa-exclamation-circle';
        } else if (type === 'info') {
            iconClass = 'fas fa-info-circle';
        }
        
        toast.innerHTML = `
            <div class="toast-icon ${type}">
                <i class="${iconClass}"></i>
            </div>
            <div class="toast-content">
                <div class="toast-title">${type === 'success' ? '成功' : type === 'error' ? 'エラー' : 'お知らせ'}</div>
                <div class="toast-message">${message}</div>
            </div>
            <div class="toast-close"><i class="fas fa-times"></i></div>
        `;
        
        toastContainer.appendChild(toast);
        
        // アニメーション
        setTimeout(() => {
            toast.classList.add('active');
        }, 10);
        
        // 自動消去
        const autoRemove = setTimeout(() => {
            removeToast(toast);
        }, duration);
        
        // 閉じるボタン
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            clearTimeout(autoRemove);
            removeToast(toast);
        });
    };
    
    function removeToast(toast) {
        toast.classList.remove('active');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }
}

// フォーム検証の初期化
function initFormValidation() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 簡易検証
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        const privacy = document.getElementById('privacy').checked;
        
        if (!name || !email || !message || !privacy) {
            window.showToast('必須項目を入力してください。', 'error');
            return;
        }
        
        // メールアドレスの簡易検証
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            window.showToast('有効なメールアドレスを入力してください。', 'error');
            return;
        }
        
        // フォーム送信処理（ここでは模擬処理）
        window.showToast('お問い合わせを送信しました。折り返しご連絡いたします。', 'success');
        contactForm.reset();
    });
}

// スクロールトップボタンの作成
function createScrollTopButton() {
    const scrollTopBtn = document.createElement('div');
    scrollTopBtn.className = 'scroll-top';
    scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(scrollTopBtn);
    
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ページロード時の処理
window.addEventListener('load', function() {
    // 蜃気楼エフェクトの適用
    setTimeout(applyMirageEffect, 500);
    
    // ヒーローセクションのアニメーション
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '1';
        heroContent.style.transform = 'translateY(0)';
    }
    
    // 浮遊要素のアニメーション
    const floatingElements = document.querySelectorAll('.floating-element');
    if (floatingElements.length > 0) {
        floatingElements.forEach((el, index) => {
            el.style.animationDelay = `${index * 0.2}s`;
        });
    }
    
    // 3Dホバーエフェクト
    initHover3DEffect();
});

// 3Dホバーエフェクト
function initHover3DEffect() {
    const hover3DElements = document.querySelectorAll('.hover-3d');
    
    hover3DElements.forEach(element => {
        element.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const xPercent = x / rect.width * 100;
            const yPercent = y / rect.height * 100;
            
            const rotateX = (50 - yPercent) / 25;
            const rotateY = (xPercent - 50) / 25;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            this.style.boxShadow = `
                ${rotateY * -0.5}px ${rotateX * 0.5}px 20px rgba(0, 0, 0, 0.1)
            `;
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            this.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.05)';
            this.style.transition = 'all 0.5s ease';
        });
    });
} 