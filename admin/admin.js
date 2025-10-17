// 관리자 시스템 JavaScript

class AdminSystem {
    constructor() {
        this.isLoggedIn = false;
        this.currentUser = null;
        this.applications = [];
        
        this.init();
    }

    init() {
        // 현재 페이지 확인
        const currentPage = window.location.pathname.split('/').pop();
        
        if (currentPage === 'admin-login.html') {
            this.initLogin();
        } else if (currentPage === 'admin.html') {
            this.initDashboard();
        }
        
        // 로그인 상태 확인
        this.checkAuthStatus();
    }

    // 인증 상태 확인
    checkAuthStatus() {
        const token = localStorage.getItem('adminToken');
        const user = localStorage.getItem('adminUser');
        
        if (token && user) {
            this.isLoggedIn = true;
            this.currentUser = JSON.parse(user);
            
            // 로그인 페이지에서 대시보드로 리다이렉트
            if (window.location.pathname.includes('admin-login.html')) {
                window.location.href = 'admin.html';
            }
        } else {
            // 대시보드에서 로그인 페이지로 리다이렉트
            if (window.location.pathname.includes('admin.html')) {
                window.location.href = 'admin-login.html';
            }
        }
    }

    // 로그인 페이지 초기화
    initLogin() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
    }

    // 대시보드 페이지 초기화
    initDashboard() {
        if (!this.isLoggedIn) return;

        this.initNavigation();
        this.initStats();
        this.initApplications();
        this.initPasswordChange();
        this.loadApplications();
    }

    // 네비게이션 초기화
    initNavigation() {
        const menuToggle = document.getElementById('menuToggle');
        const sidebar = document.getElementById('sidebar');
        const mobileOverlay = document.getElementById('mobileOverlay');
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('.content-section');

        // 모바일 메뉴 토글
        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                sidebar.classList.toggle('active');
                mobileOverlay.classList.toggle('active');
            });
        }

        // 오버레이 클릭시 메뉴 닫기
        if (mobileOverlay) {
            mobileOverlay.addEventListener('click', () => {
                sidebar.classList.remove('active');
                mobileOverlay.classList.remove('active');
            });
        }

        // 네비게이션 링크 클릭
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const sectionId = link.getAttribute('data-section');
                
                if (sectionId === 'logout') {
                    this.handleLogout();
                    return;
                }
                
                // 활성 링크 업데이트
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                // 활성 섹션 업데이트
                sections.forEach(s => s.classList.remove('active'));
                const targetSection = document.getElementById(sectionId);
                if (targetSection) {
                    targetSection.classList.add('active');
                }
                
                // 모바일에서 메뉴 닫기
                sidebar.classList.remove('active');
                mobileOverlay.classList.remove('active');
                
                // 섹션별 데이터 로드
                if (sectionId === 'applications') {
                    this.loadApplications();
                }
            });
        });
    }

    // 통계 초기화
    initStats() {
        this.updateStats();
    }

    // 신청서 관리 초기화
    initApplications() {
        const statusFilter = document.getElementById('statusFilter');
        const refreshBtn = document.getElementById('refreshApplications');

        if (statusFilter) {
            statusFilter.addEventListener('change', () => this.filterApplications());
        }

        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.loadApplications());
        }
    }

    // 비밀번호 변경 초기화
    initPasswordChange() {
        const passwordForm = document.getElementById('passwordChangeForm');
        if (passwordForm) {
            passwordForm.addEventListener('submit', (e) => this.handlePasswordChange(e));
        }
    }

    // 로그인 처리
    async handleLogin(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const password = formData.get('password');
        
        const errorMessage = document.getElementById('errorMessage');
        
        try {
            const response = await fetch('/api/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // 로그인 성공
                localStorage.setItem('adminToken', data.token);
                localStorage.setItem('adminUser', JSON.stringify(data.user));
                
                window.location.href = 'admin.html';
            } else {
                // 로그인 실패
                errorMessage.textContent = data.message || '로그인에 실패했습니다.';
                errorMessage.style.display = 'block';
            }
        } catch (error) {
            console.error('로그인 오류:', error);
            errorMessage.textContent = '서버 연결 오류가 발생했습니다.';
            errorMessage.style.display = 'block';
        }
    }

    // 로그아웃 처리
    handleLogout() {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        window.location.href = 'admin-login.html';
    }

    // 신청서 로드
    async loadApplications() {
        const applicationsList = document.getElementById('applicationsList');
        if (!applicationsList) return;

        applicationsList.innerHTML = '<div class="loading">로딩중...</div>';

        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch('/api/admin/applications', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                this.applications = await response.json();
                this.renderApplications();
                this.updateStats();
            } else {
                applicationsList.innerHTML = '<div class="loading">신청서를 불러올 수 없습니다.</div>';
            }
        } catch (error) {
            console.error('신청서 로드 오류:', error);
            applicationsList.innerHTML = '<div class="loading">서버 연결 오류가 발생했습니다.</div>';
        }
    }

    // 신청서 렌더링
    renderApplications() {
        const applicationsList = document.getElementById('applicationsList');
        if (!applicationsList) return;

        const statusFilter = document.getElementById('statusFilter');
        const selectedStatus = statusFilter ? statusFilter.value : '';

        let filteredApplications = this.applications;
        if (selectedStatus) {
            filteredApplications = this.applications.filter(app => app.status === selectedStatus);
        }

        if (filteredApplications.length === 0) {
            applicationsList.innerHTML = '<div class="loading">신청서가 없습니다.</div>';
            return;
        }

        applicationsList.innerHTML = filteredApplications.map(app => `
            <div class="application-item">
                <div class="application-info">
                    <h4>${app.name || '이름 없음'}</h4>
                    <p>이메일: ${app.email || 'N/A'}</p>
                    <p>전화번호: ${app.phone || 'N/A'}</p>
                    <p>신청일: ${new Date(app.createdAt).toLocaleDateString('ko-KR')}</p>
                    <p>상태: <span class="status-${app.status}">${this.getStatusText(app.status)}</span></p>
                </div>
                <div class="application-actions">
                    ${app.status === 'pending' ? 
                        `<button class="btn btn-primary" onclick="adminSystem.updateApplicationStatus('${app.id}', 'processing')">처리중</button>` : 
                        ''
                    }
                    ${app.status === 'processing' ? 
                        `<button class="btn btn-success" onclick="adminSystem.updateApplicationStatus('${app.id}', 'completed')">완료</button>` : 
                        ''
                    }
                    <button class="btn btn-danger" onclick="adminSystem.deleteApplication('${app.id}')">삭제</button>
                </div>
            </div>
        `).join('');
    }

    // 신청서 상태 업데이트
    async updateApplicationStatus(id, status) {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`/api/admin/applications/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });

            if (response.ok) {
                // 로컬 데이터 업데이트
                const app = this.applications.find(a => a.id === id);
                if (app) {
                    app.status = status;
                    this.renderApplications();
                    this.updateStats();
                }
            } else {
                alert('상태 업데이트에 실패했습니다.');
            }
        } catch (error) {
            console.error('상태 업데이트 오류:', error);
            alert('서버 연결 오류가 발생했습니다.');
        }
    }

    // 신청서 삭제
    async deleteApplication(id) {
        if (!confirm('정말로 이 신청서를 삭제하시겠습니까?')) {
            return;
        }

        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`/api/admin/applications/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                // 로컬 데이터에서 제거
                this.applications = this.applications.filter(app => app.id !== id);
                this.renderApplications();
                this.updateStats();
            } else {
                alert('삭제에 실패했습니다.');
            }
        } catch (error) {
            console.error('삭제 오류:', error);
            alert('서버 연결 오류가 발생했습니다.');
        }
    }

    // 신청서 필터링
    filterApplications() {
        this.renderApplications();
    }

    // 통계 업데이트
    updateStats() {
        const totalEl = document.getElementById('totalApplications');
        const newEl = document.getElementById('newApplications');
        const processedEl = document.getElementById('processedApplications');

        if (totalEl) totalEl.textContent = this.applications.length;
        if (newEl) newEl.textContent = this.applications.filter(app => app.status === 'pending').length;
        if (processedEl) processedEl.textContent = this.applications.filter(app => app.status === 'completed').length;
    }

    // 상태 텍스트 변환
    getStatusText(status) {
        const statusMap = {
            'pending': '대기중',
            'processing': '처리중',
            'completed': '완료'
        };
        return statusMap[status] || status;
    }

    // 비밀번호 변경 처리
    async handlePasswordChange(e) {
        e.preventDefault();
        
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (newPassword !== confirmPassword) {
            alert('새 비밀번호가 일치하지 않습니다.');
            return;
        }
        
        if (newPassword.length < 6) {
            alert('비밀번호는 최소 6자 이상이어야 합니다.');
            return;
        }

        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch('/api/admin/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert('비밀번호가 성공적으로 변경되었습니다.');
                document.getElementById('passwordChangeForm').reset();
            } else {
                alert(data.message || '비밀번호 변경에 실패했습니다.');
            }
        } catch (error) {
            console.error('비밀번호 변경 오류:', error);
            alert('서버 연결 오류가 발생했습니다.');
        }
    }
}

// 전역 인스턴스 생성
const adminSystem = new AdminSystem();

// 페이지 로드 완료시 초기화
document.addEventListener('DOMContentLoaded', () => {
    // 추가 초기화 로직이 필요한 경우 여기에 추가
});

// 윈도우 리사이즈시 모바일 메뉴 처리
window.addEventListener('resize', () => {
    const sidebar = document.getElementById('sidebar');
    const mobileOverlay = document.getElementById('mobileOverlay');
    
    if (window.innerWidth >= 768) {
        sidebar?.classList.remove('active');
        mobileOverlay?.classList.remove('active');
    }
});
