export async function onRequestPost(context) {
    const { request, env, params } = context;
    
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

        // URL에서 ID 추출
        const id = params.id;
        if (!id) {
            return new Response(JSON.stringify({
                success: false,
                message: '신청서 ID가 필요합니다.'
            }), {
                status: 400,
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json'
                }
            });
        }

        // 요청 데이터 파싱
        const data = await request.json();
        const { status } = data;

        if (!status) {
            return new Response(JSON.stringify({
                success: false,
                message: '상태가 필요합니다.'
            }), {
                status: 400,
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json'
                }
            });
        }

        // 상태 업데이트
        const result = await env['hara-db'].prepare(`
            UPDATE applications 
            SET status = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `).bind(status, id).run();

        if (result.success) {
            return new Response(JSON.stringify({
                success: true,
                message: '상태가 업데이트되었습니다.'
            }), {
                status: 200,
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json'
                }
            });
        } else {
            throw new Error('상태 업데이트 실패');
        }

    } catch (error) {
        console.error('상태 업데이트 오류:', error);
        
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

export async function onRequestDelete(context) {
    const { request, env, params } = context;
    
    try {
        // CORS 헤더 설정
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        };

        // OPTIONS 요청 처리 (CORS preflight)
        if (request.method === 'OPTIONS') {
            return new Response(null, {
                status: 200,
                headers: corsHeaders
            });
        }

        // URL에서 ID 추출
        const id = params.id;
        if (!id) {
            return new Response(JSON.stringify({
                success: false,
                message: '신청서 ID가 필요합니다.'
            }), {
                status: 400,
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json'
                }
            });
        }

        // 신청서 삭제
        const result = await env['hara-db'].prepare(`
            DELETE FROM applications WHERE id = ?
        `).bind(id).run();

        if (result.success) {
            return new Response(JSON.stringify({
                success: true,
                message: '신청서가 삭제되었습니다.'
            }), {
                status: 200,
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json'
                }
            });
        } else {
            throw new Error('신청서 삭제 실패');
        }

    } catch (error) {
        console.error('신청서 삭제 오류:', error);
        
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
