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
            SELECT id, name, email, phone, address, contact, inquiry, items, status, created_at
            FROM applications
            ORDER BY created_at DESC
        `).all();

        // 데이터 포맷팅 (모바일 친화적)
        const formattedApplications = applications.results.map(app => ({
            id: app.id,
            name: app.name || '이름 없음',
            email: app.email || app.contact || 'N/A',
            phone: app.phone || 'N/A',
            address: app.address || 'N/A',
            inquiry: app.inquiry || 'N/A',
            items: app.items || 'N/A',
            status: app.status || 'pending',
            createdAt: app.created_at
        }));

        return new Response(JSON.stringify(formattedApplications), {
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

export async function onRequestPatch(context) {
    const { request, env, params } = context;
    
    try {
        // CORS 헤더 설정
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'PATCH, OPTIONS',
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
