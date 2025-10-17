export async function onRequestPost(context) {
    const { request, env } = context;
    
    try {
        // CORS 헤더 설정
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        };

        // OPTIONS 요청 처리 (CORS preflight)
        if (request.method === 'OPTIONS') {
            return new Response(null, {
                status: 200,
                headers: corsHeaders
            });
        }

        // 요청 데이터 파싱
        const data = await request.json();
        const { username, password } = data;

        // 입력 검증
        if (!username || !password) {
            return new Response(JSON.stringify({
                success: false,
                message: '사용자명과 비밀번호를 입력해주세요.'
            }), {
                status: 400,
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json'
                }
            });
        }

        // 데이터베이스에서 관리자 정보 확인
        const admin = await env['hara-db'].prepare(`
            SELECT id, username, password FROM admins WHERE username = ?
        `).bind(username).first();

        if (!admin) {
            return new Response(JSON.stringify({
                success: false,
                message: '사용자명 또는 비밀번호가 올바르지 않습니다.'
            }), {
                status: 401,
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json'
                }
            });
        }

        // 비밀번호 검증
        if (password === admin.password) {
            // 간단한 토큰 생성 (실제 환경에서는 JWT 등을 사용)
            const token = btoa('admin:' + Date.now() + ':' + Math.random());
            
            return new Response(JSON.stringify({
                success: true,
                message: '로그인 성공',
                token: token,
                user: {
                    id: admin.id,
                    username: admin.username
                }
            }), {
                status: 200,
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json'
                }
            });
        } else {
            return new Response(JSON.stringify({
                success: false,
                message: '사용자명 또는 비밀번호가 올바르지 않습니다.'
            }), {
                status: 401,
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json'
                }
            });
        }

    } catch (error) {
        console.error('로그인 오류:', error);
        
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
