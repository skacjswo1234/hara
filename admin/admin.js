// 단순한 관리자 시스템
console.log('🔴 JavaScript 파일 로드됨!');

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔴 DOM 로드 완료!');
    
    const currentPage = window.location.pathname.split('/').pop();
    console.log('🔴 현재 페이지:', currentPage);
    console.log('🔴 전체 경로:', window.location.pathname);
    
    if (currentPage === 'admin-login.html') {
        console.log('🔴 로그인 페이지 초기화 호출');
        initLogin();
    } else if (currentPage === 'admin.html') {
        console.log('🔴 대시보드 초기화 호출');
        initDashboard();
    } else {
        console.log('🔴 알 수 없는 페이지:', currentPage);
    }
});

// 로그인 페이지 초기화
function initLogin() {
    console.log('🔵 로그인 페이지 초기화 시작');
    
    const loginForm = document.getElementById('loginForm');
    const messageDiv = document.getElementById('message');
    
    console.log('🔵 폼 요소 확인:', { loginForm, messageDiv });
    
    if (!loginForm) {
        console.error('❌ 로그인 폼을 찾을 수 없습니다!');
        return;
    }
    
    loginForm.addEventListener('submit', async function(e) {
        console.log('🔵 폼 제출 이벤트 발생');
    e.preventDefault();
    
    const password = document.getElementById('password').value;
        console.log('🔵 입력된 비밀번호:', password);
        
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '로그인 중...';
        submitBtn.disabled = true;
        
        try {
            console.log('🔵 API 요청 시작:', '/api/admin/login');
            
        const response = await fetch('/api/admin/login', {
            method: 'POST',
            headers: {
                    'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password })
        });
        
            console.log('🔵 API 응답 상태:', response.status);
            console.log('🔵 API 응답 헤더:', response.headers);
            
            if (!response.ok) {
                console.error('❌ API 응답 오류:', response.status, response.statusText);
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('🔵 API 응답 데이터:', data);
            
            if (data.success) {
                console.log('✅ 로그인 성공! 페이지 이동 준비');
                messageDiv.textContent = '로그인 성공! 페이지를 이동합니다...';
                messageDiv.className = 'message success';
                
                console.log('🔵 1초 후 페이지 이동 예약');
                setTimeout(() => {
                    console.log('🔵 페이지 이동 실행:', 'admin.html');
            window.location.href = 'admin.html';
                }, 1000);
        } else {
                console.log('❌ 로그인 실패:', data.message);
                messageDiv.textContent = data.message || '로그인 실패';
                messageDiv.className = 'message error';
        }
    } catch (error) {
            console.error('❌ 로그인 오류:', error);
            messageDiv.textContent = `서버 오류가 발생했습니다: ${error.message}`;
            messageDiv.className = 'message error';
    } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
    
    console.log('✅ 로그인 페이지 초기화 완료');
}

// 대시보드 초기화
function initDashboard() {
    console.log('🔵 대시보드 초기화 시작');
    
    // DOM 요소 확인
    console.log('🔵 DOM 요소 확인:');
    console.log('  - 탭 버튼들:', document.querySelectorAll('.nav-btn'));
    console.log('  - 드롭다운 버튼:', document.getElementById('dropdownToggle'));
    console.log('  - 로그아웃 버튼들:', document.querySelectorAll('#logoutBtn, #desktopLogoutBtn'));
    console.log('  - 문의목록 컨테이너:', document.getElementById('inquiriesList'));
    console.log('  - 비밀번호 폼:', document.getElementById('passwordForm'));
    
    // 탭 네비게이션 초기화
    initTabNavigation();
    
    // 모바일 드롭다운 초기화
    initMobileDropdown();
    
    // 로그아웃 버튼 초기화
    initLogoutButtons();
    
    // 새로고침 버튼 초기화
    initRefreshButton();
    
    // 문의목록 로드
    loadInquiries();
    
    // 비밀번호 변경 폼 초기화
    initPasswordForm();
    
    console.log('✅ 대시보드 초기화 완료');
}

// 탭 네비게이션 초기화
function initTabNavigation() {
    console.log('🔵 탭 네비게이션 초기화');
    
    const navButtons = document.querySelectorAll('.nav-btn, .dropdown-item');
    console.log('🔵 찾은 네비게이션 버튼들:', navButtons);
    
    navButtons.forEach((button, index) => {
        console.log(`🔵 버튼 ${index + 1} 이벤트 리스너 추가:`, button);
        button.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🔵 네비게이션 버튼 클릭:', this);
            
            const tabName = this.getAttribute('data-tab');
            console.log('🔵 탭 이름:', tabName);
            
            if (tabName) {
                console.log('🔵 탭 변경:', tabName);
                switchTab(tabName);
                
                // 모바일 드롭다운 닫기
                const dropdownMenu = document.getElementById('dropdownMenu');
                if (dropdownMenu) {
                    dropdownMenu.classList.remove('show');
                    console.log('🔵 드롭다운 메뉴 닫기');
                }
            } else {
                console.log('🔵 data-tab 속성이 없음, 로그아웃 버튼일 수 있음');
            }
        });
    });
    
    if (navButtons.length === 0) {
        console.error('❌ 네비게이션 버튼을 찾을 수 없습니다!');
    }
}

// 탭 전환
function switchTab(tabName) {
    console.log('🔵 탭 전환:', tabName);
    
    // 모든 탭 콘텐츠 숨기기
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // 모든 네비게이션 버튼 비활성화
    document.querySelectorAll('.nav-btn, .dropdown-item').forEach(btn => {
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

// 모바일 드롭다운 초기화
function initMobileDropdown() {
    console.log('🔵 모바일 드롭다운 초기화');
    
    const dropdownToggle = document.getElementById('dropdownToggle');
    const dropdownMenu = document.getElementById('dropdownMenu');
    
    console.log('🔵 드롭다운 요소들:', { dropdownToggle, dropdownMenu });
    
    if (dropdownToggle && dropdownMenu) {
        console.log('🔵 드롭다운 토글 이벤트 리스너 추가');
        dropdownToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            console.log('🔵 드롭다운 토글 클릭');
            dropdownMenu.classList.toggle('show');
            console.log('🔵 드롭다운 상태:', dropdownMenu.classList.contains('show') ? '열림' : '닫힘');
        });
        
        // 외부 클릭시 드롭다운 닫기
        document.addEventListener('click', function() {
            if (dropdownMenu.classList.contains('show')) {
                dropdownMenu.classList.remove('show');
                console.log('🔵 외부 클릭으로 드롭다운 닫기');
            }
        });
    } else {
        console.error('❌ 드롭다운 요소를 찾을 수 없습니다!');
    }
}

// 새로고침 버튼 초기화
function initRefreshButton() {
    console.log('🔵 새로고침 버튼 초기화');
    
    const refreshBtn = document.getElementById('refreshInquiries');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            console.log('🔵 새로고침 버튼 클릭');
            loadInquiries();
        });
    } else {
        console.error('❌ 새로고침 버튼을 찾을 수 없습니다!');
    }
}

// 로그아웃 버튼 초기화
function initLogoutButtons() {
    console.log('🔵 로그아웃 버튼 초기화');
    
    const logoutButtons = document.querySelectorAll('#logoutBtn, #desktopLogoutBtn');
    console.log('🔵 찾은 로그아웃 버튼들:', logoutButtons);
    
    logoutButtons.forEach(button => {
        console.log('🔵 로그아웃 버튼 이벤트 리스너 추가:', button);
        button.addEventListener('click', function() {
            console.log('🔵 로그아웃 버튼 클릭');
            if (confirm('로그아웃 하시겠습니까?')) {
                console.log('🔵 로그아웃 실행');
                window.location.href = 'admin-login.html';
            }
        });
    });
    
    if (logoutButtons.length === 0) {
        console.error('❌ 로그아웃 버튼을 찾을 수 없습니다!');
    }
}

// 문의목록 로드
async function loadInquiries() {
    console.log('🔵 문의목록 로드 시작');
    
    const inquiriesList = document.getElementById('inquiriesList');
    if (!inquiriesList) {
        console.error('❌ 문의목록 컨테이너를 찾을 수 없습니다!');
        return;
    }
    
    inquiriesList.innerHTML = '<div class="loading">로딩중...</div>';
    
    try {
        console.log('🔵 API 요청:', '/api/admin/applications');
        const response = await fetch('/api/admin/applications');
        
        console.log('🔵 응답 상태:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const inquiries = await response.json();
        console.log('🔵 문의목록 데이터:', inquiries);
        
        if (inquiries.length === 0) {
            inquiriesList.innerHTML = '<div class="no-data">문의가 없습니다.</div>';
            return;
        }
        
        inquiriesList.innerHTML = inquiries.map(inquiry => `
            <div class="inquiry-item">
                <div class="inquiry-info">
                    <h4>${inquiry.name || '이름 없음'}</h4>
                    <p>이메일: ${inquiry.email || 'N/A'}</p>
                    <p>전화: ${inquiry.phone || 'N/A'}</p>
                    <p>문의내용: ${inquiry.inquiry || 'N/A'}</p>
                    <p>신청일: ${new Date(inquiry.createdAt).toLocaleDateString('ko-KR')}</p>
                    <p>상태: ${getStatusText(inquiry.status)}</p>
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
        
        console.log('✅ 문의목록 렌더링 완료');
        
    } catch (error) {
        console.error('❌ 문의목록 로드 오류:', error);
        inquiriesList.innerHTML = '<div class="error">문의목록을 불러올 수 없습니다.</div>';
    }
}

// 상태 텍스트 변환
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
    console.log('🔵 상태 업데이트:', id, status);
    
    try {
        const response = await fetch(`/api/admin/applications/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
        });
        
        console.log('🔵 상태 업데이트 응답:', response.status);
        
        if (response.ok) {
            console.log('✅ 상태 업데이트 성공');
            loadInquiries(); // 목록 새로고침
        } else {
            console.error('❌ 상태 업데이트 실패');
            alert('상태 업데이트에 실패했습니다.');
        }
    } catch (error) {
        console.error('❌ 상태 업데이트 오류:', error);
        alert('서버 오류가 발생했습니다.');
    }
}

// 문의 삭제
async function deleteInquiry(id) {
    console.log('🔵 문의 삭제:', id);
    
    if (!confirm('정말로 삭제하시겠습니까?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/admin/applications/${id}`, {
            method: 'DELETE'
        });
        
        console.log('🔵 삭제 응답:', response.status);
        
        if (response.ok) {
            console.log('✅ 삭제 성공');
            loadInquiries(); // 목록 새로고침
        } else {
            console.error('❌ 삭제 실패');
            alert('삭제에 실패했습니다.');
        }
    } catch (error) {
        console.error('❌ 삭제 오류:', error);
        alert('서버 오류가 발생했습니다.');
    }
}

// 비밀번호 변경 폼 초기화
function initPasswordForm() {
    console.log('🔵 비밀번호 변경 폼 초기화');
    
    const passwordForm = document.getElementById('passwordForm');
    console.log('🔵 비밀번호 폼 요소:', passwordForm);
    
    if (!passwordForm) {
        console.error('❌ 비밀번호 폼을 찾을 수 없습니다!');
        return;
    }
    
    console.log('🔵 비밀번호 폼 이벤트 리스너 추가');
    passwordForm.addEventListener('submit', handlePasswordChange);
    console.log('✅ 비밀번호 폼 초기화 완료');
}

// 비밀번호 변경
async function handlePasswordChange(e) {
    console.log('🔵 비밀번호 변경 시도');
    e.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    console.log('🔵 입력값 확인:', { 
        hasCurrent: !!currentPassword, 
        hasNew: !!newPassword, 
        hasConfirm: !!confirmPassword 
    });
    
    if (newPassword !== confirmPassword) {
        alert('새 비밀번호가 일치하지 않습니다.');
        return;
    }
    
    if (newPassword.length < 4) {
        alert('비밀번호는 최소 4자 이상이어야 합니다.');
        return;
    }
    
    try {
        console.log('🔵 비밀번호 변경 API 요청');
        
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
        
        console.log('🔵 비밀번호 변경 응답:', response.status);
        
        const data = await response.json();
        console.log('🔵 비밀번호 변경 응답 데이터:', data);
        
        if (data.success) {
            console.log('✅ 비밀번호 변경 성공');
            alert('비밀번호가 성공적으로 변경되었습니다.');
            document.getElementById('passwordForm').reset();
        } else {
            console.error('❌ 비밀번호 변경 실패:', data.message);
            alert(data.message || '비밀번호 변경에 실패했습니다.');
        }
    } catch (error) {
        console.error('❌ 비밀번호 변경 오류:', error);
        alert('서버 오류가 발생했습니다.');
    }
}