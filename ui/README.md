# White Board

启动步骤

### 拉代码

```bash
git pull
```

### 装依赖

```bash
npm ci
```

### 配置变量

前端项目目录下新建 `.env` 文件（不由 git 管理）

输入以下内容：

```
NEXT_PUBLIC_BASE_URL = http://127.0.0.1:4523/m1/6629948-6337524-default
NEXT_PUBLIC_WEB_SOCKET_URL = ws://localhost:3002
AUTH_SECRET = llmons
```

其中的值改为实际后端 url，AUTH_SECRET 用于 jwt 加密解密

### 启动

```bash
npm run dev
```