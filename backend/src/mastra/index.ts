import { Mastra } from "@mastra/core/mastra";
import {deepResearchAgent} from './agent';
import {deepResearch} from './workflow';
import { LibSQLStore } from "@mastra/libsql";
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';
import { existsSync, mkdirSync } from 'fs';

// 获取当前文件的目录路径
// 使用不同的变量名避免与 Mastra 构建工具生成的变量冲突
const currentFileUrl = fileURLToPath(import.meta.url);
const currentDir = dirname(currentFileUrl);

// 确定数据库文件路径（相对于项目根目录）
const dbDir = join(currentDir, '../../..');
const dbPath = resolve(dbDir, 'mastra.db');

// 确保目录存在
if (!existsSync(dbDir)) {
    mkdirSync(dbDir, { recursive: true });
}

// 使用文件数据库而不是内存数据库，确保 suspend/resume 状态能够持久化
// LibSQLStore URL 格式要求：
// - :memory: - 内存数据库（用于测试）
// - file:/absolute/path/to/db.db - 文件数据库（绝对路径，需要 file: 前缀）
// - 如果环境变量设置了 DATABASE_URL，优先使用环境变量
let databaseUrl: string;

if (process.env.DATABASE_URL) {
    databaseUrl = process.env.DATABASE_URL;
} else {
    // 使用 file: 协议前缀，路径必须是绝对路径
    // 在 Windows 上，路径格式为 file:/C:/path/to/db.db
    // 在 Unix 系统上，路径格式为 file:/absolute/path/to/db.db
    const normalizedPath = dbPath.replace(/\\/g, '/'); // 统一使用正斜杠
    databaseUrl = `file:${normalizedPath}`;
}

const storage = new LibSQLStore({
    url: databaseUrl
})

export const mastra = new Mastra({
    agents: {
        deepResearchAgent
    },
    workflows: {
        deepResearch
    },
    storage
});