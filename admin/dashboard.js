// 전역 변수
let authToken = localStorage.getItem('adminToken');

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    if (!authToken) {
        // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
        window.location.href = 'index.html';
        return;
    }
    
    // 대시보드 초기화
    loadApplications();
});

// 신청서 목록 로드
async function loadApplications() {
    const tbody = document.getElementById('applicationsTableBody');
    const refreshBtn = document.querySelector('.refresh-btn');
    
    // 로딩 상태
    tbody.innerHTML = `
        <tr>
            <td colspan="8" class="loading">
                <i class="fas fa-spinner fa-spin"></i>
                <br>
                로딩 중...
            </td>
        </tr>
    `;
    
    refreshBtn.disabled = true;
    refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 로딩 중...';
    
    try {
        const response = await fetch('/api/admin/applications', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            }
        });
        
        const result = await response.json();
        
        if (result.success) {
            updateStats(result.data.stats);
            renderApplications(result.data.applications);
        } else {
            if (response.status === 401) {
                logout();
                return;
            }
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" class="no-data">
                        <i class="fas fa-exclamation-triangle"></i>
                        <br>
                        데이터를 불러올 수 없습니다.
                    </td>
                </tr>
            `;
        }
    } catch (error) {
        console.error('신청서 목록 로드 오류:', error);
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="no-data">
                    <i class="fas fa-exclamation-triangle"></i>
                    <br>
                    네트워크 오류가 발생했습니다.
                </td>
            </tr>
        `;
    } finally {
        refreshBtn.disabled = false;
        refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> 새로고침';
    }
}

// 통계 업데이트
function updateStats(stats) {
    document.getElementById('totalCount').textContent = stats.total;
    document.getElementById('pendingCount').textContent = stats.pending;
    document.getElementById('completedCount').textContent = stats.completed;
}

// 신청서 목록 렌더링
function renderApplications(applications) {
    const tbody = document.getElementById('applicationsTableBody');
    
    if (applications.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="no-data">
                    <i class="fas fa-inbox"></i>
                    <br>
                    신청서가 없습니다.
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = applications.map(app => `
        <tr>
            <td>${app.id}</td>
            <td>${app.address}</td>
            <td>${app.contact}</td>
            <td>${app.items || '-'}</td>
            <td>${app.inquiry || '-'}</td>
            <td>
                <span class="status-badge status-${app.status}">
                    ${app.status === 'pending' ? '대기중' : '완료'}
                </span>
            </td>
            <td>${formatDate(app.created_at)}</td>
            <td>
                ${app.status === 'pending' ? 
                    `<button class="btn btn-primary" onclick="updateStatus(${app.id}, 'completed')">
                        <i class="fas fa-check"></i> 완료
                    </button>` :
                    `<button class="btn btn-secondary" onclick="updateStatus(${app.id}, 'pending')">
                        <i class="fas fa-undo"></i> 대기
                    </button>`
                }
            </td>
        </tr>
    `).join('');
}

// 상태 업데이트
async function updateStatus(id, status) {
    try {
        const response = await fetch('/api/admin/applications', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, status })
        });
        
        const result = await response.json();
        
        if (result.success) {
            loadApplications(); // 목록 새로고침
        } else {
            alert(result.message || '상태 업데이트에 실패했습니다.');
        }
    } catch (error) {
        console.error('상태 업데이트 오류:', error);
        alert('네트워크 오류가 발생했습니다.');
    }
}

// 날짜 포맷팅
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// 비밀번호 변경 모달 열기
function openChangePasswordModal() {
    document.getElementById('changePasswordModal').classList.add('active');
    document.getElementById('changePasswordForm').reset();
}

// 비밀번호 변경 모달 닫기
function closeChangePasswordModal() {
    document.getElementById('changePasswordModal').classList.remove('active');
}

// 비밀번호 변경
async function changePassword() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (!currentPassword || !newPassword || !confirmPassword) {
        alert('모든 필드를 입력해주세요.');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        alert('새 비밀번호와 확인 비밀번호가 일치하지 않습니다.');
        return;
    }
    
    if (newPassword.length < 4) {
        alert('새 비밀번호는 4자 이상이어야 합니다.');
        return;
    }
    
    try {
        const response = await fetch('/api/admin/change-password', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ currentPassword, newPassword })
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert('비밀번호가 성공적으로 변경되었습니다.');
            closeChangePasswordModal();
        } else {
            alert(result.message || '비밀번호 변경에 실패했습니다.');
        }
    } catch (error) {
        console.error('비밀번호 변경 오류:', error);
        alert('네트워크 오류가 발생했습니다.');
    }
}

// 로그아웃
function logout() {
    authToken = null;
    localStorage.removeItem('adminToken');
    window.location.href = 'index.html';
}

// 모달 외부 클릭 시 닫기
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        closeChangePasswordModal();
    }
});

// ESC 키로 모달 닫기
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeChangePasswordModal();
    }
});
