# 构建阶段
FROM node:24.15.0-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 运行阶段（只保留运行依赖+编译代码）
FROM node:24.15.0-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN npm install --production

EXPOSE 3000
CMD ["npm", "run", "start:prod"]