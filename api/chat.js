// /api/chat.js
export default async function handler(req, res) {
    // 1. 验证请求方法
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // 2. 从 Vercel 环境变量中获取 Key
    // 注意：部署时需要在 Vercel 仪表盘的 Environment Variables 里设置 DEEPSEEK_API_KEY
    const apiKey = process.env.DEEPSEEK_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'Server misconfiguration: No API Key found' });
    }

    try {
        // 3. 转发请求给 DeepSeek
        const response = await fetch("https://api.deepseek.com/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: req.body.messages, // 从前端接收对话历史
                max_tokens: 300,
                temperature: 1.2 // 稍微提高创造性
            })
        });

        // 4. 处理 DeepSeek 的响应
        if (!response.ok) {
            const errorData = await response.json();
            return res.status(response.status).json({ error: errorData });
        }

        const data = await response.json();

        // 5. 将结果返回给前端
        res.status(200).json(data);

    } catch (error) {
        console.error("DeepSeek API Error:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}