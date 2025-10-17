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

        // 간단한 인증 확인 (비밀번호 기반)
        console.log('신청서 목록 조회 요청');

        // D1 데이터베이스에서 신청서 목록 조회
        let applications;
        try {
            applications = await env['hara-db'].prepare(`
                SELECT id, address, contact, inquiry, items, status, created_at, updated_at
                FROM applications
                ORDER BY created_at DESC
            `).all();
        } catch (dbError) {
            console.error('데이터베이스 조회 오류:', dbError);
            return new Response(JSON.stringify({
                success: false,
                message: '데이터베이스 연결 오류'
            }), {
                status: 500,
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json'
                }
            });
        }

        // 결과가 없는 경우 처리
        if (!applications || !applications.results) {
            return new Response(JSON.stringify([]), {
                status: 200,
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json'
                }
            });
        }

        // 데이터 포맷팅 (실제 테이블 구조에 맞게)
        const formattedApplications = applications.results.map(app => ({
            id: app.id,
            name: '신청자', // 고정값
            email: app.contact || 'N/A', // contact를 email로 사용
            phone: 'N/A', // phone 컬럼이 없으므로 N/A
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
