// 관리자 대시보드 JavaScript

// 페이지 로드시 초기화
document.addEventListener('DOMContentLoaded', function() {
    loadInquiries();
    initPasswordForm();
});

// 탭 전환
function showTab(tabName) {
    // 모든 탭 숨기기
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // 모든 탭 버튼 비활성화
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 선택된 탭 표시
    document.getElementById(tabName).classList.add('active');
    
    // 선택된 버튼 활성화
    event.target.classList.add('active');
    
    // 문의목록 탭이면 새로고침
    if (tabName === 'inquiries') {
        loadInquiries();
    }
}

// 로그아웃
function logout() {
    if (confirm('로그아웃 하시겠습니까?')) {
        window.location.href = 'admin-login.html';
    }
}

// 문의목록 로드
async function loadInquiries() {
    const container = document.getElementById('inquiriesList');
    container.innerHTML = '<div class="loading">로딩중...</div>';
    
    try {
        const response = await fetch('/api/admin/applications');
        
        if (!response.ok) {
            throw new Error('서버 오류');
        }
        
        const inquiries = await response.json();
        
        if (inquiries.length === 0) {
            container.innerHTML = '<div class="no-data">문의가 없습니다.</div>';
            return;
        }
        
        container.innerHTML = inquiries.map(inquiry => `
            <div class="inquiry-item">
                <div class="inquiry-info">
                    <h4>신청서 #${inquiry.id}</h4>
                    
                    <div class="inquiry-details">
                        <div class="inquiry-detail">
                            <div class="label">연락처</div>
                            <div class="value">${inquiry.email || 'N/A'}</div>
                        </div>
                        <div class="inquiry-detail">
                            <div class="label">주소</div>
                            <div class="value">${inquiry.address || 'N/A'}</div>
                        </div>
                        <div class="inquiry-detail">
                            <div class="label">문의내용</div>
                            <div class="value">${inquiry.inquiry || 'N/A'}</div>
                        </div>
                        <div class="inquiry-detail">
                            <div class="label">관심항목</div>
                            <div class="value">${inquiry.items || 'N/A'}</div>
                        </div>
                    </div>
                    
                    <div class="inquiry-meta">
                        <div class="inquiry-date">
                            신청일: ${new Date(inquiry.createdAt).toLocaleDateString('ko-KR')}
                        </div>
                        <div class="inquiry-status ${inquiry.status}">
                            ${getStatusText(inquiry.status)}
                        </div>
                    </div>
                </div>
                
                <div class="inquiry-actions">
                    ${inquiry.status === 'pending' ? 
                        `<button class="process-btn" onclick="updateStatus(${inquiry.id}, 'processing')">처리중</button>` : 
                        ''
                    }
                    ${inquiry.status === 'processing' ? 
                        `<button class="complete-btn" onclick="updateStatus(${inquiry.id}, 'completed')">완료</button>` : 
                        ''
                    }
                    <button class="delete-btn" onclick="deleteInquiry(${inquiry.id})">삭제</button>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        container.innerHTML = '<div class="error">문의목록을 불러올 수 없습니다.</div>';
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
    try {
        const response = await fetch(`/api/admin/applications/${id}`, {
            method: 'POST',
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

// 비밀번호 변경 폼 초기화
function initPasswordForm() {
    const form = document.getElementById('passwordForm');
    form.addEventListener('submit', handlePasswordChange);
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
