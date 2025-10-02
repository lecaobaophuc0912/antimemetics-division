import { ConfigService } from '@nestjs/config';

export interface CorsConfig {
    origin: string | string[] | RegExp[] | ((origin: string, callback: (err: Error | null, allow?: boolean) => void) => void);
    credentials: boolean;
    methods: string[];
    allowedHeaders?: string[];
    exposedHeaders?: string[];
    maxAge: number;
}

export const getCorsConfigFromEnv = (configService: ConfigService) => {
    // Lấy danh sách domain từ environment variables
    const allowedOrigins = configService.get<string>('ALLOWED_ORIGINS');
    console.log('allowedOrigins', allowedOrigins);

    // Parse origins từ environment variables
    const corsOrigins = allowedOrigins
        ? allowedOrigins.split(',').map(origin => origin.trim())
        : [];

    // Cấu hình mặc định
    const defaultOrigins = [
        // /\.ngrok-free\.app$/
    ];

    // Kết hợp domain từ env và domain mặc định
    const origins = [...new Set([...defaultOrigins, ...corsOrigins])];
    console.log('origins', origins);

    const corsConfig: CorsConfig = {
        origin: function (origin, callback) {
            // Nếu không có origin (same-origin request), cho phép
            if (!origin) {
                return callback(null, true);
            }

            // Kiểm tra từng origin trong danh sách
            for (const allowedOrigin of origins) {
                console.log(`origin: ${origin}, allowedOrigin: ${allowedOrigin}`);
                // Nếu origin là "*", cho phép tất cả
                if (allowedOrigin === '*') {
                    return callback(null, true);
                }

                // Nếu origin là regex pattern (bắt đầu và kết thúc bằng /)
                if (typeof allowedOrigin === 'string' && allowedOrigin.startsWith('/') && allowedOrigin.endsWith('/')) {
                    try {
                        const regex = new RegExp(allowedOrigin.slice(1, -1));
                        if (regex.test(origin)) {
                            return callback(null, true);
                        }
                    } catch (error) {
                        console.warn(`Invalid regex pattern: ${allowedOrigin}`, error);
                        continue;
                    }
                }

                // Nếu origin là wildcard pattern (chứa *)
                if (typeof allowedOrigin === 'string' && allowedOrigin.includes('*')) {
                    const pattern = allowedOrigin
                        .replace(/\./g, '\\.')  // Escape dots
                        .replace(/\*/g, '.*');  // Convert * to .*
                    try {
                        const regex = new RegExp(`^${pattern}$`);
                        if (regex.test(origin)) {
                            return callback(null, true);
                        }
                    } catch (error) {
                        console.warn(`Invalid wildcard pattern: ${allowedOrigin}`, error);
                        continue;
                    }
                }

                // Nếu origin là string thường, so sánh trực tiếp
                if (typeof allowedOrigin === 'string' && allowedOrigin === origin) {
                    return callback(null, true);
                }

                if (typeof allowedOrigin === 'object' && (allowedOrigin as any) instanceof RegExp) {
                    if ((allowedOrigin as RegExp).test(origin)) {

                        return callback(null, true);
                    }
                }
            }

            // Nếu không match với origin nào, từ chối
            console.log(`CORS blocked: ${origin} not in allowed origins:`, origins);
            callback(new Error(`Origin ${origin} not allowed by CORS`));
        },
        credentials: configService.get<boolean>('CORS_CREDENTIALS') ?? true,
        methods: configService.get<string>('CORS_METHODS')?.split(',') ?? [
            'GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'
        ],
        maxAge: configService.get<number>('CORS_MAX_AGE') ?? 3600,
    }

    return corsConfig;
};
