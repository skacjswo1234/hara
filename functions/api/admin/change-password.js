export async function onRequestPost(context) {
    const { request, env } = context;
    
    try {
        // CORS 헤더 설정
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        };

        // OPTIONS 요청 처리 (CORS preflight)
        if (request.method === 'OPTIONS') {
            return new Response(null, {
                status: 200,
                headers: corsHeaders
            });
        }

        // 인증 확인
        const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return new Response(JSON.stringify({
                success: false,
                message: '인증이 필요합니다.'
            }), {
                status: 401,
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json'
                }
            });
        }

        // 요청 데이터 파싱
        const data = await request.json();
        const { currentPassword, newPassword } = data;

        // 현재 비밀번호 검증
        if (currentPassword !== '1234') {
            return new Response(JSON.stringify({
                success: false,
                message: '현재 비밀번호가 올바르지 않습니다.'
            }), {
                status: 400,
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json'
                }
            });
        }

        // 새 비밀번호 유효성 검사
        if (!newPassword || newPassword.length < 4) {
            return new Response(JSON.stringify({
                success: false,
                message: '새 비밀번호는 4자 이상이어야 합니다.'
            }), {
                status: 400,
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json'
                }
            });
        }

        // 실제 환경에서는 D1 데이터베이스에 비밀번호를 저장하고 해시화해야 함
        // 여기서는 간단하게 성공 응답만 반환
        
        return new Response(JSON.stringify({
            success: true,
            message: '비밀번호가 성공적으로 변경되었습니다.'
        }), {
            status: 200,
            headers: {
                ...corsHeaders,
                'Content-Type': 'application/json'
            }
        });

    } catch (error) {
        console.error('비밀번호 변경 오류:', error);
        
        return new Response(JSON.stringify({
            success: false,
            message: '서버 오류가 발생했습니다.'
        }), {
            status: 500,
            headers: {
                ...corsHeaders,
                'Content-Type': 'application/json'
            }
        });
    }
}
