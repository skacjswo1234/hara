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
        
        // 필수 필드 검증
        if (!data.address || !data.contact) {
            return new Response(JSON.stringify({
                success: false,
                message: '주소와 연락처는 필수 입력 항목입니다.'
            }), {
                status: 400,
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json'
                }
            });
        }

        // D1 데이터베이스에 데이터 삽입
        const result = await env.hara-db.prepare(`
            INSERT INTO applications (address, contact, inquiry, items, status)
            VALUES (?, ?, ?, ?, 'pending')
        `).bind(
            data.address,
            data.contact,
            data.inquiry || '',
            data.items ? JSON.stringify(data.items) : ''
        ).run();

        if (result.success) {
            return new Response(JSON.stringify({
                success: true,
                message: '신청서가 성공적으로 제출되었습니다.',
                applicationId: result.meta.last_row_id
            }), {
                status: 200,
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json'
                }
            });
        } else {
            throw new Error('데이터베이스 삽입 실패');
        }

    } catch (error) {
        console.error('신청서 제출 오류:', error);
        
        return new Response(JSON.stringify({
            success: false,
            message: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
        }), {
            status: 500,
            headers: {
                ...corsHeaders,
                'Content-Type': 'application/json'
            }
        });
    }
}
