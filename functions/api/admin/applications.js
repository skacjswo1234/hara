export async function onRequestGet(context) {
    const { request, env } = context;
    
    try {
        console.log('관리자 문의 리스트 조회 시작');
        
        // CORS 헤더 설정
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        };

        // OPTIONS 요청 처리 (CORS preflight)
        if (request.method === 'OPTIONS') {
            return new Response(null, {
                status: 200,
                headers: corsHeaders
            });
        }

        // 인증 확인 (간단한 토큰 검증)
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

        // D1 데이터베이스에서 신청서 목록 조회
        const applications = await env['hara-db'].prepare(`
            SELECT id, address, contact, inquiry, items, status, created_at
            FROM applications
            ORDER BY created_at DESC
        `).all();

        // 통계 정보 계산
        const totalCount = applications.results.length;
        const pendingCount = applications.results.filter(app => app.status === 'pending').length;
        const completedCount = applications.results.filter(app => app.status === 'completed').length;

        return new Response(JSON.stringify({
            success: true,
            data: {
                applications: applications.results,
                stats: {
                    total: totalCount,
                    pending: pendingCount,
                    completed: completedCount
                }
            }
        }), {
            status: 200,
            headers: {
                ...corsHeaders,
                'Content-Type': 'application/json'
            }
        });

    } catch (error) {
        console.error('관리자 문의 리스트 조회 오류:', error);
        
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

export async function onRequestPut(context) {
    const { request, env } = context;
    
    try {
        // CORS 헤더 설정
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'PUT, OPTIONS',
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
        const { id, status } = data;

        if (!id || !status) {
            return new Response(JSON.stringify({
                success: false,
                message: 'ID와 상태가 필요합니다.'
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
