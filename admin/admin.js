// 관리자 시스템
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage === 'admin-login.html') {
        initLogin();
    } else if (currentPage === 'admin.html') {
        initDashboard();
    }
});

// 로그인 페이지 초기화
function initLogin() {
    const loginForm = document.getElementById('loginForm');
    const messageDiv = document.getElementById('message');
    
    if (!loginForm) return;
    
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const password = document.getElementById('password').value;
        
        try {
            const response = await fetch('/api/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ password })
            });
            
            const data = await response.json();
            
            if (data.success) {
                messageDiv.textContent = '로그인 성공!';
                messageDiv.className = 'message success';
                setTimeout(() => {
                    window.location.href = 'admin.html';
                }, 500);
            } else {
                messageDiv.textContent = data.message || '로그인 실패';
                messageDiv.className = 'message error';
            }
        } catch (error) {
            messageDiv.textContent = '서버 오류가 발생했습니다.';
            messageDiv.className = 'message error';
        }
    });
}

// 대시보드 초기화
function initDashboard() {
    // 탭 네비게이션
    initTabs();
    
    // 모바일 드롭다운
    initMobileMenu();
    
    // 로그아웃 버튼
    initLogout();
    
    // 새로고침 버튼
    initRefresh();
    
    // 문의목록 로드
    loadInquiries();
    
    // 비밀번호 변경 폼
    initPasswordForm();
}

// 탭 네비게이션
function initTabs() {
    const tabButtons = document.querySelectorAll('[data-tab]');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            if (tabName) {
                switchTab(tabName);
            }
        });
    });
}

// 탭 전환
function switchTab(tabName) {
    // 모든 탭 숨기기
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // 모든 버튼 비활성화
    document.querySelectorAll('[data-tab]').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 선택된 탭 표시
    const targetTab = document.getElementById(tabName + 'Tab');
    if (targetTab) {
        targetTab.classList.add('active');
    }
    
    // 선택된 버튼 활성화
    document.querySelectorAll(`[data-tab="${tabName}"]`).forEach(btn => {
        btn.classList.add('active');
    });
    
    // 문의목록 탭이면 새로고침
    if (tabName === 'inquiries') {
        loadInquiries();
    }
}

// 모바일 메뉴
function initMobileMenu() {
    const toggle = document.getElementById('dropdownToggle');
    const menu = document.getElementById('dropdownMenu');
    
    if (toggle && menu) {
        toggle.addEventListener('click', function(e) {
            e.stopPropagation();
            menu.classList.toggle('show');
        });
        
        // 외부 클릭시 닫기
        document.addEventListener('click', function() {
            menu.classList.remove('show');
        });
    }
}

// 로그아웃
function initLogout() {
    const logoutButtons = document.querySelectorAll('#logoutBtn, #desktopLogoutBtn');
    
    logoutButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (confirm('로그아웃 하시겠습니까?')) {
                window.location.href = 'admin-login.html';
            }
        });
    });
}

// 새로고침
function initRefresh() {
    const refreshBtn = document.getElementById('refreshInquiries');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            loadInquiries();
        });
    }
}

// 문의목록 로드
async function loadInquiries() {
    const inquiriesList = document.getElementById('inquiriesList');
    if (!inquiriesList) return;
    
    inquiriesList.innerHTML = '<div class="loading">로딩중...</div>';
    
    try {
        const response = await fetch('/api/admin/applications');
        
        if (!response.ok) {
            throw new Error('서버 오류');
        }
        
        const inquiries = await response.json();
        
        if (inquiries.length === 0) {
            inquiriesList.innerHTML = '<div class="no-data">문의가 없습니다.</div>';
            return;
        }
        
        inquiriesList.innerHTML = inquiries.map(inquiry => `
            <div class="inquiry-item">
                <div class="inquiry-info">
                    <h4>${inquiry.name || '이름 없음'}</h4>
                    <p><strong>이메일:</strong> ${inquiry.email || 'N/A'}</p>
                    <p><strong>전화:</strong> ${inquiry.phone || 'N/A'}</p>
                    <p><strong>주소:</strong> ${inquiry.address || 'N/A'}</p>
                    <p><strong>문의내용:</strong> ${inquiry.inquiry || 'N/A'}</p>
                    <p><strong>신청일:</strong> ${new Date(inquiry.createdAt).toLocaleDateString('ko-KR')}</p>
                    <p><strong>상태:</strong> ${getStatusText(inquiry.status)}</p>
                </div>
                <div class="inquiry-actions">
                    ${inquiry.status === 'pending' ? 
                        `<button onclick="updateStatus(${inquiry.id}, 'processing')">처리중</button>` : 
                        ''
                    }
                    ${inquiry.status === 'processing' ? 
                        `<button onclick="updateStatus(${inquiry.id}, 'completed')">완료</button>` : 
                        ''
                    }
                    <button onclick="deleteInquiry(${inquiry.id})" class="delete-btn">삭제</button>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        inquiriesList.innerHTML = '<div class="error">문의목록을 불러올 수 없습니다.</div>';
    }
}

// 상태 텍스트
function getStatusText(status) {
    const statusMap = {
        'pending': '대기중',
        'processing': '처리중',
        'completed': '완료'
    };
    return statusMap[status] || status;
}

// 상태 업데이트
async function updateStatus(id, status) {
    try {
        const response = await fetch(`/api/admin/applications/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
        });
        
        if (response.ok) {
            loadInquiries();
        } else {
            alert('상태 업데이트에 실패했습니다.');
        }
    } catch (error) {
        alert('서버 오류가 발생했습니다.');
    }
}

// 문의 삭제
async function deleteInquiry(id) {
    if (!confirm('정말로 삭제하시겠습니까?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/admin/applications/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            loadInquiries();
        } else {
            alert('삭제에 실패했습니다.');
        }
    } catch (error) {
        alert('서버 오류가 발생했습니다.');
    }
}

// 비밀번호 변경 폼
function initPasswordForm() {
    const passwordForm = document.getElementById('passwordForm');
    if (!passwordForm) return;
    
    passwordForm.addEventListener('submit', handlePasswordChange);
}

// 비밀번호 변경
async function handlePasswordChange(e) {
    e.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (newPassword !== confirmPassword) {
        alert('새 비밀번호가 일치하지 않습니다.');
        return;
    }
    
    if (newPassword.length < 4) {
        alert('비밀번호는 최소 4자 이상이어야 합니다.');
        return;
    }
    
    try {
        const response = await fetch('/api/admin/change-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                currentPassword,
                newPassword
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('비밀번호가 성공적으로 변경되었습니다.');
            document.getElementById('passwordForm').reset();
        } else {
            alert(data.message || '비밀번호 변경에 실패했습니다.');
        }
    } catch (error) {
        alert('서버 오류가 발생했습니다.');
    }
}