import { vendureDashboardPlugin } from '@vendure/dashboard/plugin';
import path from 'path';
import { pathToFileURL } from 'url';
import { defineConfig } from 'vite';

export default defineConfig({
    base: '/dashboard/',
    plugins: [
        vendureDashboardPlugin({
            vendureConfigPath: pathToFileURL('./dev-config.ts'),
            adminUiConfig: { apiHost: 'http://localhost', apiPort: 3000 },
            gqlOutputPath: path.resolve(__dirname, './graphql/'),
        }) as any,
    ],
});
