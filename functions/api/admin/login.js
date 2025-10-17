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
        const { password } = data;

        // 입력 검증
        if (!password) {
            return new Response(JSON.stringify({
                success: false,
                message: '비밀번호를 입력해주세요.'
            }), {
                status: 400,
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json'
                }
            });
        }

        // 간단한 비밀번호 검증 (임시로 'admin123' 사용)
        const correctPassword = 'admin123';
        
        if (password === correctPassword) {
            // 간단한 토큰 생성
            const token = btoa('admin:' + Date.now() + ':' + Math.random());
            
            return new Response(JSON.stringify({
                success: true,
                message: '로그인 성공',
                token: token,
                user: {
                    id: 1,
                    username: 'admin'
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
                message: '비밀번호가 올바르지 않습니다. (기본 비밀번호: admin123)'
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
