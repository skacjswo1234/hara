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

        // 간단한 인증 확인
        console.log('비밀번호 변경 요청');

        // 요청 데이터 파싱
        const data = await request.json();
        const { currentPassword, newPassword } = data;

        // 현재 비밀번호 검증 (데이터베이스에서 확인)
        const admin = await env['hara-db'].prepare(`
            SELECT id, password FROM admins WHERE username = 'admin'
        `).first();

        if (!admin || admin.password !== currentPassword) {
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
        if (!newPassword) {
            return new Response(JSON.stringify({
                success: false,
                message: '새 비밀번호를 입력해주세요.'
            }), {
                status: 400,
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json'
                }
            });
        }

        // 비밀번호 업데이트
        const result = await env['hara-db'].prepare(`
            UPDATE admins 
            SET password = ?, updated_at = CURRENT_TIMESTAMP
            WHERE username = 'admin'
        `).bind(newPassword).run();

        if (!result.success) {
            throw new Error('비밀번호 업데이트 실패');
        }
        
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
