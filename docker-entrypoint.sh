#!/bin/sh
set -e

echo "🚀 Starting WYLM application..."

# 等待数据库就绪
echo "⏳ Waiting for database to be ready..."
until npx prisma db push --skip-generate 2>/dev/null; do
  echo "Database is unavailable - sleeping"
  sleep 2
done

echo "✅ Database is ready!"

# 运行数据库迁移
echo "🔄 Running database migrations..."
npx prisma migrate deploy

# 检查是否需要初始化数据
echo "🌱 Checking if database needs seeding..."
if npx prisma db seed 2>/dev/null; then
  echo "✅ Database seeded successfully!"
else
  echo "ℹ️  Database already seeded or seed failed (this is normal if data exists)"
fi

echo "🎉 Application is ready to start!"

# 执行传入的命令
exec "$@"
