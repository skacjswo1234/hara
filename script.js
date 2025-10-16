// DOM 요소들
const header = document.querySelector('.header');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const nav = document.querySelector('.nav');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');
const contactForm = document.querySelector('.contact-form form');

// 스크롤 이벤트 - 헤더 스타일 변경
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});

// 모바일 메뉴 토글
mobileMenuBtn.addEventListener('click', () => {
    nav.classList.toggle('active');
    const icon = mobileMenuBtn.querySelector('i');
    if (nav.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// 네비게이션 링크 클릭 시 부드러운 스크롤
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const headerHeight = header.offsetHeight;
            const targetPosition = targetSection.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // 모바일 메뉴 닫기
            nav.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
});

// 스크롤 시 활성 섹션 하이라이트
window.addEventListener('scroll', () => {
    const headerHeight = header.offsetHeight;
    const scrollPosition = window.scrollY + headerHeight + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// 스크롤 애니메이션
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

// 애니메이션 대상 요소들 관찰
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.service-card, .price-card, .feature, .contact-item');
    animateElements.forEach(el => {
        observer.observe(el);
    });
});

// 폼 제출 처리
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // 폼 데이터 수집
        const formData = new FormData(contactForm);
        const data = {
            name: contactForm.querySelector('input[type="text"]').value,
            phone: contactForm.querySelector('input[type="tel"]').value,
            service: contactForm.querySelector('select').value,
            message: contactForm.querySelector('textarea').value
        };
        
        // 간단한 유효성 검사
        if (!data.name || !data.phone || !data.service) {
            alert('필수 항목을 모두 입력해주세요.');
            return;
        }
        
        // 전화번호 형식 검사
        const phoneRegex = /^[0-9-+\s()]+$/;
        if (!phoneRegex.test(data.phone)) {
            alert('올바른 전화번호를 입력해주세요.');
            return;
        }
        
        // 성공 메시지 (실제로는 서버로 전송)
        alert('상담 신청이 완료되었습니다. 빠른 시일 내에 연락드리겠습니다.');
        contactForm.reset();
    });
}

// 가격 업데이트 기능 (실시간 가격 변경 가능)
function updatePrice(item, newPrice) {
    const priceElement = document.querySelector(`[data-item="${item}"] .price`);
    if (priceElement) {
        priceElement.textContent = newPrice;
    }
}

// 가격 요소에 data 속성 추가
document.addEventListener('DOMContentLoaded', () => {
    const priceCards = document.querySelectorAll('.price-card');
    const priceItems = ['clothes', 'books', 'kitchen', 'computer', 'phone', 'bin'];
    
    priceCards.forEach((card, index) => {
        if (priceItems[index]) {
            card.setAttribute('data-item', priceItems[index]);
        }
    });
});

// 이미지 슬라이드쇼 시작
document.addEventListener('DOMContentLoaded', () => {
    const slideImages = document.querySelectorAll('.slide-image');
    
    if (slideImages.length > 0) {
        // 모든 화면에서 이미지 슬라이드쇼 시작
        startImageSlideshow();
    }
});

// 이미지 슬라이드쇼 함수
function startImageSlideshow() {
    const slideImages = document.querySelectorAll('.slide-image');
    console.log('이미지 슬라이드쇼 시작, 이미지 개수:', slideImages.length);
    
    if (slideImages.length === 0) {
        console.log('슬라이드 이미지를 찾을 수 없습니다.');
        return;
    }
    
    let currentSlide = 0;
    
    function showNextSlide() {
        console.log('슬라이드 전환:', currentSlide);
        // 현재 슬라이드 숨기기
        slideImages[currentSlide].classList.remove('active');
        
        // 다음 슬라이드로 이동
        currentSlide = (currentSlide + 1) % slideImages.length;
        
        // 다음 슬라이드 보이기
        slideImages[currentSlide].classList.add('active');
    }
    
    // 2초마다 슬라이드 전환
    setInterval(showNextSlide, 2000);
}

// 윈도우 리사이즈 시 슬라이드쇼 제어 (필요시)
window.addEventListener('resize', () => {
    // 화면 크기 변경 시에도 슬라이드쇼는 계속 동작
    console.log('화면 크기 변경됨:', window.innerWidth);
});

// 플로팅 버튼 기능
document.addEventListener('DOMContentLoaded', () => {
    const phoneBtn = document.getElementById('phoneBtn');
    const kakaoBtn = document.getElementById('kakaoBtn');
    const topBtn = document.getElementById('topBtn');
    
    // 전화 버튼 클릭
    if (phoneBtn) {
        phoneBtn.addEventListener('click', () => {
            window.location.href = 'tel:010-4657-3803';
        });
    }
    
    // 카카오톡 버튼 클릭
    if (kakaoBtn) {
        kakaoBtn.addEventListener('click', () => {
            // 카카오톡 채팅 연결
            window.open('https://pf.kakao.com/_rxhCDxj/chat', '_blank');
        });
    }
    
    // TOP 버튼 클릭
    if (topBtn) {
        topBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // 스크롤 시 TOP 버튼 표시/숨김
    window.addEventListener('scroll', () => {
        if (topBtn) {
            if (window.scrollY > 300) {
                topBtn.style.opacity = '1';
                topBtn.style.visibility = 'visible';
            } else {
                topBtn.style.opacity = '0.7';
                topBtn.style.visibility = 'visible';
            }
        }
    });
});

// 스크롤 진행률 표시
function createScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #3498db, #e74c3c);
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

// 페이지 로드 시 스크롤 진행률 바 생성
document.addEventListener('DOMContentLoaded', createScrollProgress);

// 리뷰 슬라이더 기능
class ReviewSlider {
    constructor() {
        this.sliderTrack = document.getElementById('sliderTrack');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.indicatorsContainer = document.getElementById('sliderIndicators');
        
        this.currentSlide = 0;
        this.slideInterval = null;
        this.autoSlideDelay = 3000; // 3초마다 자동 슬라이드
        this.slidesToShow = 3; // 한 번에 보여줄 슬라이드 수
        this.slideWidth = 270; // 슬라이드 너비 (gap 포함)
        
        this.reviewImages = [
            'images/review/d_1.jpg',
            'images/review/d2.jpg',
            'images/review/d3.jpg',
            'images/review/d4.jpg',
            'images/review/d5.jpg',
            'images/review/d6.jpg',
            'images/review/d7.jpg',
            'images/review/d8.jpg',
            'images/review/d9.jpg',
            'images/review/d10.jpg',
            'images/review/d11.jpg',
            'images/review/d12.jpg',
            'images/review/d13.jpg'
        ];
        
        this.init();
    }
    
    init() {
        this.updateSlidesToShow();
        this.createSlides();
        this.createIndicators();
        this.bindEvents();
        this.startAutoSlide();
    }
    
    updateSlidesToShow() {
        const containerWidth = this.sliderTrack.parentElement.offsetWidth;
        if (containerWidth < 768) {
            this.slidesToShow = 1;
            this.slideWidth = 170; // 160px + 10px gap
        } else if (containerWidth < 1024) {
            this.slidesToShow = 2;
            this.slideWidth = 215; // 200px + 15px gap
        } else {
            this.slidesToShow = 3;
            this.slideWidth = 270; // 250px + 20px gap
        }
    }
    
    createSlides() {
        this.sliderTrack.innerHTML = '';
        
        this.reviewImages.forEach((imageSrc, index) => {
            const slide = document.createElement('div');
            slide.className = 'slider-slide';
            slide.innerHTML = `<img src="${imageSrc}" alt="하라 환경보호 활동 ${index + 1}" loading="lazy">`;
            this.sliderTrack.appendChild(slide);
        });
    }
    
    createIndicators() {
        this.indicatorsContainer.innerHTML = '';
        
        const totalSlides = this.reviewImages.length;
        const maxSlides = Math.ceil(totalSlides / this.slidesToShow);
        
        for (let i = 0; i < maxSlides; i++) {
            const indicator = document.createElement('button');
            indicator.className = 'slider-indicator';
            if (i === 0) indicator.classList.add('active');
            indicator.addEventListener('click', () => this.goToSlide(i));
            this.indicatorsContainer.appendChild(indicator);
        }
    }
    
    bindEvents() {
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // 키보드 네비게이션
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });
        
        // 터치 제스처 지원
        let startX = 0;
        let endX = 0;
        
        this.sliderTrack.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        this.sliderTrack.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            this.handleSwipe(startX, endX);
        });
        
        // 마우스 호버 시 자동 슬라이드 일시정지
        this.sliderTrack.addEventListener('mouseenter', () => this.stopAutoSlide());
        this.sliderTrack.addEventListener('mouseleave', () => this.startAutoSlide());
        
        // 윈도우 리사이즈 이벤트
        window.addEventListener('resize', () => {
            this.updateSlidesToShow();
            this.createIndicators();
            this.currentSlide = 0;
            this.updateSlider();
            this.updateIndicators();
        });
    }
    
    handleSwipe(startX, endX) {
        const threshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
    }
    
    goToSlide(index) {
        this.currentSlide = index;
        this.updateSlider();
        this.updateIndicators();
        this.restartAutoSlide();
    }
    
    nextSlide() {
        const maxSlides = Math.ceil(this.reviewImages.length / this.slidesToShow);
        this.currentSlide = (this.currentSlide + 1) % maxSlides;
        this.updateSlider();
        this.updateIndicators();
        this.restartAutoSlide();
    }
    
    prevSlide() {
        const maxSlides = Math.ceil(this.reviewImages.length / this.slidesToShow);
        this.currentSlide = this.currentSlide === 0 ? maxSlides - 1 : this.currentSlide - 1;
        this.updateSlider();
        this.updateIndicators();
        this.restartAutoSlide();
    }
    
    updateSlider() {
        const translateX = -this.currentSlide * this.slideWidth;
        this.sliderTrack.style.transform = `translateX(${translateX}px)`;
    }
    
    updateIndicators() {
        const indicators = this.indicatorsContainer.querySelectorAll('.slider-indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });
    }
    
    startAutoSlide() {
        this.stopAutoSlide();
        this.slideInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoSlideDelay);
    }
    
    stopAutoSlide() {
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
            this.slideInterval = null;
        }
    }
    
    restartAutoSlide() {
        this.stopAutoSlide();
        this.startAutoSlide();
    }
}

// 리뷰 슬라이더 초기화
document.addEventListener('DOMContentLoaded', () => {
    new ReviewSlider();
    new GalleryLightbox();
});

// 갤러리 라이트박스 기능
class GalleryLightbox {
    constructor() {
        this.lightbox = document.getElementById('lightbox');
        this.lightboxImage = document.getElementById('lightboxImage');
        this.lightboxCounter = document.getElementById('lightboxCounter');
        this.lightboxClose = document.getElementById('lightboxClose');
        this.lightboxPrev = document.getElementById('lightboxPrev');
        this.lightboxNext = document.getElementById('lightboxNext');
        this.galleryGrid = document.getElementById('galleryGrid');
        
        this.currentImageIndex = 0;
        this.images = [];
        
        this.init();
    }
    
    init() {
        this.createGallery();
        this.bindEvents();
    }
    
    createGallery() {
        const detailImages = [
            'images/detail/webp/img2.webp',
            'images/detail/webp/img3.webp',
            'images/detail/webp/img4.webp',
            'images/detail/webp/img5.webp',
            'images/detail/webp/img6.webp',
            'images/detail/webp/img7.webp',
            'images/detail/webp/img8.webp',
            'images/detail/webp/img9.webp',
            'images/detail/webp/img10.webp',
            'images/detail/webp/img11.webp',
            'images/detail/webp/img12.webp'
        ];
        
        this.images = detailImages;
        this.galleryGrid.innerHTML = '';
        
        // Intersection Observer로 뷰포트 진입 시 이미지 로드
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const galleryItem = entry.target;
                    const img = galleryItem.querySelector('img');
                    const loadingDiv = galleryItem.querySelector('.image-loading');
                    
                    // 이미지 로드 시작
                    img.src = img.dataset.src;
                    img.style.display = 'block';
                    
                    // 이미지 로드 완료 시 스피너 숨기고 이미지 표시
                    img.addEventListener('load', () => {
                        loadingDiv.style.display = 'none';
                        img.style.opacity = '0';
                        setTimeout(() => {
                            img.style.opacity = '1';
                        }, 100);
                    });
                    
                    // 이미지 로드 실패 시 처리
                    img.addEventListener('error', () => {
                        loadingDiv.innerHTML = '<div class="load-error">이미지 로드 실패</div>';
                    });
                    
                    // 관찰 중단
                    imageObserver.unobserve(galleryItem);
                }
            });
        }, {
            rootMargin: '50px' // 뷰포트 50px 전에 미리 로드
        });
        
        detailImages.forEach((imageSrc, index) => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            
            // 로딩 스피너 추가
            galleryItem.innerHTML = `
                <div class="image-loading">
                    <div class="loading-spinner"></div>
                </div>
                <img data-src="${imageSrc}" alt="하라 상세 이미지 ${index + 1}" style="display: none;">
            `;
            
            galleryItem.addEventListener('click', () => this.openLightbox(index));
            this.galleryGrid.appendChild(galleryItem);
            
            // Intersection Observer로 관찰 시작
            imageObserver.observe(galleryItem);
        });
    }
    
    bindEvents() {
        this.lightboxClose.addEventListener('click', () => this.closeLightbox());
        this.lightboxPrev.addEventListener('click', () => this.prevImage());
        this.lightboxNext.addEventListener('click', () => this.nextImage());
        
        // ESC 키로 닫기
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.lightbox.classList.contains('active')) {
                this.closeLightbox();
            }
            if (e.key === 'ArrowLeft' && this.lightbox.classList.contains('active')) {
                this.prevImage();
            }
            if (e.key === 'ArrowRight' && this.lightbox.classList.contains('active')) {
                this.nextImage();
            }
        });
        
        // 배경 클릭으로 닫기
        this.lightbox.addEventListener('click', (e) => {
            if (e.target === this.lightbox) {
                this.closeLightbox();
            }
        });
        
        // 터치 제스처 지원
        let startX = 0;
        let endX = 0;
        
        this.lightbox.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        this.lightbox.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            this.handleSwipe(startX, endX);
        });
    }
    
    handleSwipe(startX, endX) {
        const threshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                this.nextImage();
            } else {
                this.prevImage();
            }
        }
    }
    
    openLightbox(index) {
        this.currentImageIndex = index;
        this.updateLightboxImage();
        this.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // 스크롤 방지
    }
    
    closeLightbox() {
        this.lightbox.classList.remove('active');
        document.body.style.overflow = ''; // 스크롤 복원
    }
    
    prevImage() {
        this.currentImageIndex = this.currentImageIndex === 0 
            ? this.images.length - 1 
            : this.currentImageIndex - 1;
        this.updateLightboxImage();
    }
    
    nextImage() {
        this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
        this.updateLightboxImage();
    }
    
    updateLightboxImage() {
        this.lightboxImage.src = this.images[this.currentImageIndex];
        this.lightboxImage.alt = `하라 상세 이미지 ${this.currentImageIndex + 1}`;
        this.lightboxCounter.textContent = `${this.currentImageIndex + 1} / ${this.images.length}`;
    }
}

// 부드러운 스크롤을 위한 CSS 추가
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        html {
            scroll-behavior: smooth;
        }
        
        .nav.active {
            display: block;
            position: fixed;
            top: 70px;
            left: 0;
            right: 0;
            background: white;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            padding: 1rem;
        }
        
        .nav.active .nav-list {
            flex-direction: column;
            gap: 1rem;
        }
        
        .nav-link.active {
            color: var(--secondary-color);
        }
        
        .nav-link.active::after {
            width: 100%;
        }
        
        @media (max-width: 768px) {
            .nav {
                display: none;
            }
        }
    `;
    document.head.appendChild(style);
});

// 로딩 애니메이션
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // 히어로 섹션 페이드인 효과
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(30px)';
        heroContent.style.transition = 'all 1s ease';
        
        setTimeout(() => {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 300);
    }
});

// 키보드 접근성 개선
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('active')) {
        nav.classList.remove('active');
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// 터치 제스처 지원 (모바일)
let touchStartY = 0;
let touchEndY = 0;
let isScrolling = false; // 스크롤 중인지 추적

// 모바일에서 터치 스크롤 제어
document.addEventListener('touchstart', (e) => {
    touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', (e) => {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
});

// 모바일에서 휠 스크롤 제어 (터치패드 포함)
let wheelTimeout;
document.addEventListener('wheel', (e) => {
    // 모바일 기기에서만 적용
    if (window.innerWidth <= 768) {
        e.preventDefault();
        
        // 스크롤 중이면 무시
        if (isScrolling) return;
        
        // 휠 이벤트 디바운싱
        clearTimeout(wheelTimeout);
        wheelTimeout = setTimeout(() => {
            if (e.deltaY > 0) {
                // 아래로 스크롤 - 다음 섹션으로
                scrollToNextSection();
            } else if (e.deltaY < 0) {
                // 위로 스크롤 - 이전 섹션으로
                scrollToPrevSection();
            }
        }, 50);
    }
}, { passive: false });

function handleSwipe() {
    const swipeThreshold = 100; // 임계값을 높여서 더 확실한 스와이프만 인식
    const diff = touchStartY - touchEndY;
    
    if (Math.abs(diff) > swipeThreshold) {
        // 스크롤 중인지 확인 (현재 스크롤 중이면 무시)
        if (isScrolling) return;
        
        if (diff > 0) {
            // 위로 스와이프 - 다음 섹션으로
            scrollToNextSection();
        } else {
            // 아래로 스와이프 - 이전 섹션으로
            scrollToPrevSection();
        }
    }
}

function scrollToNextSection() {
    if (isScrolling) return; // 이미 스크롤 중이면 무시
    
    const currentSection = getCurrentSection();
    const nextSection = currentSection.nextElementSibling;
    if (nextSection && nextSection.tagName === 'SECTION') {
        isScrolling = true;
        const headerHeight = header.offsetHeight;
        const targetPosition = nextSection.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        
        // 스크롤 완료 후 상태 리셋 (약간의 지연)
        setTimeout(() => {
            isScrolling = false;
        }, 800);
    }
}

function scrollToPrevSection() {
    if (isScrolling) return; // 이미 스크롤 중이면 무시
    
    const currentSection = getCurrentSection();
    const prevSection = currentSection.previousElementSibling;
    if (prevSection && prevSection.tagName === 'SECTION') {
        isScrolling = true;
        const headerHeight = header.offsetHeight;
        const targetPosition = prevSection.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        
        // 스크롤 완료 후 상태 리셋 (약간의 지연)
        setTimeout(() => {
            isScrolling = false;
        }, 800);
    }
}

function getCurrentSection() {
    const headerHeight = header.offsetHeight;
    const scrollPosition = window.scrollY + headerHeight + 100;
    
    for (let section of sections) {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            return section;
        }
    }
    return sections[0];
}
