const userAgent = process.env.npm_config_user_agent || '';
if (!userAgent.startsWith('pnpm/')) {
  process.stderr.write(
    'Dự án dùng pnpm. Chạy pnpm install --frozen-lockfile.\n',
  );
  process.exit(1);
}
