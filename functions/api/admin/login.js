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

        // 데이터베이스에서 관리자 정보 확인 (비활성화 - DB 없이 동작)
        // 나중에 DB가 필요할 때 다시 활성화
        /*
        const admin = await env['hara-db'].prepare(`
            SELECT id, username, password FROM admins WHERE username = 'admin'
        `).first();

        if (!admin) {
            return new Response(JSON.stringify({
                success: false,
                message: '관리자 계정을 찾을 수 없습니다.'
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
            return new Response(JSON.stringify({
                success: true,
                message: '로그인 성공'
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
                message: '비밀번호가 올바르지 않습니다.'
            }), {
                status: 401,
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json'
                }
            });
        }
        */
        
        return new Response(JSON.stringify({
            success: false,
            message: '데이터베이스가 비활성화되어 있습니다.'
        }), {
            status: 503,
            headers: {
                ...corsHeaders,
                'Content-Type': 'application/json'
            }
        });

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
