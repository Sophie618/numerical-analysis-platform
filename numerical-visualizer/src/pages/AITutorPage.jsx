import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Bot, User, AlertCircle } from 'lucide-react';

// 配置你的 Groq API Key
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY; 

const AITutorPage = () => {
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: '你好！我是你的数值分析学习助手。我可以帮助你理解算法原理、解答疑问、分析计算结果。有什么我可以帮助你的吗？',
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);

    // 自动滚动到底部
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // 自适应文本框高度
    const adjustTextareaHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
        }
    };

    useEffect(() => {
        adjustTextareaHeight();
    }, [input]);

    // 调用 Groq API
    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = {
            role: 'user',
            content: input.trim(),
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${GROQ_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'llama-3.3-70b-versatile',  // 使用 Llama 3.3 70B 模型
                    messages: [
                        {
                            role: 'system',
                            content: `你是一个专业的数值分析学习助手，专注于帮助学生理解数值分析中的迭代求根算法。你的职责包括：

1. **算法讲解**：清晰解释二分法、埃特肯法、牛顿法、双点弦截法的原理和特点
2. **问题答疑**：回答关于算法实现、收敛性、误差分析等问题
3. **结果分析**：帮助分析迭代过程的数据和可视化结果
4. **学习指导**：提供学习建议和实践指导

请用简洁、准确、友好的语言回答，使用中文交流。适当使用数学公式和代码示例来说明概念。回答要条理清晰，重点突出。`
                        },
                        ...messages
                            .filter(msg => msg.role !== 'system' && !msg.isError)
                            .map(msg => ({
                                role: msg.role,
                                content: msg.content
                            })),
                        { role: 'user', content: userMessage.content }
                    ],
                    temperature: 0.7,
                    max_tokens: 2000
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('❌ API 错误详情:', errorData);
                throw new Error(errorData.error?.message || `API 请求失败 (${response.status})`);
            }

            const data = await response.json();

            const assistantMessage = {
                role: 'assistant',
                content: data.choices[0].message.content,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (err) {
            console.error('❌ 完整错误信息:', err);

            let errorMsg = '抱歉，我暂时无法回复。';
            if (err.message.includes('401')) {
                errorMsg = '⚠️ API Key 无效或已过期，请检查配置。';
            } else if (err.message.includes('429')) {
                errorMsg = '⚠️ 请求过于频繁，请稍后再试。';
            } else if (err.message.includes('Failed to fetch')) {
                errorMsg = '⚠️ 网络连接失败，请检查网络设置。';
            }

            errorMsg += `\n\n详细信息: ${err.message}`;
            setError(errorMsg);

            // 添加错误消息
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: errorMsg,
                timestamp: new Date(),
                isError: true
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    // 格式化时间
    const formatTime = (date) => {
        return date.toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // 清空对话
    const clearChat = () => {
        setMessages([{
            role: 'assistant',
            content: '你好！我是你的数值分析学习助手。我可以帮助你理解算法原理、解答疑问、分析计算结果。有什么我可以帮助你的吗？',
            timestamp: new Date()
        }]);
        setError(null);
    };

    return (
        <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* 头部标题 */}
            <div className="flex-shrink-0 bg-white border-b border-slate-200 px-6 py-4 shadow-sm">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#006C39] to-[#A13F0B] bg-clip-text text-transparent">
                            智能体伴学
                        </h1>
                        <p className="text-sm text-slate-600 mt-1">
                            数值分析算法学习助手
                        </p>
                    </div>
                    <button
                        onClick={clearChat}
                        className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        清空对话
                    </button>
                </div>
            </div>

            {/* 消息区域 */}
            <div className="flex-1 overflow-y-auto px-4 py-6">
                <div className="max-w-4xl mx-auto space-y-6">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                                }`}
                        >
                            {/* 头像 */}
                            <div
                                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${message.role === 'user'
                                    ? 'bg-gradient-to-br from-[#A13F0B] to-[#006C39]'
                                        : 'bg-gradient-to-br from-[#006C39] to-[#A13F0B]'
                                    }`}
                            >
                                {message.role === 'user' ? (
                                    <User className="w-6 h-6 text-white" />
                                ) : (
                                    <Bot className="w-6 h-6 text-white" />
                                )}
                            </div>

                            {/* 消息内容 */}
                            <div
                                className={`flex-1 ${message.role === 'user' ? 'items-end' : 'items-start'
                                    } flex flex-col`}
                            >
                                <div
                                    className={`rounded-2xl px-5 py-3 max-w-[85%] ${message.role === 'user'
                                        ? 'bg-gradient-to-br from-[#A13F0B] to-[#006C39] text-white ml-auto'
                                            : message.isError
                                                ? 'bg-red-50 border border-red-200 text-red-800'
                                                : 'bg-white border border-slate-200 text-slate-800 shadow-sm'
                                        }`}
                                >
                                    <div className="prose prose-sm max-w-none">
                                        <p className="whitespace-pre-wrap m-0 leading-relaxed">
                                            {message.content}
                                        </p>
                                    </div>
                                </div>
                                <span className="text-xs text-slate-500 mt-1 px-2">
                                    {formatTime(message.timestamp)}
                                </span>
                            </div>
                        </div>
                    ))}

                    {/* 加载指示器 */}
                    {isLoading && (
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-[#006C39] to-[#A13F0B] flex items-center justify-center">
                                <Bot className="w-6 h-6 text-white" />
                            </div>
                            <div className="bg-white border border-slate-200 rounded-2xl px-5 py-3 shadow-sm">
                                <div className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin text-[#006C39]" />
                                    <span className="text-slate-600 text-sm">正在思考...</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* 错误提示 */}
            {error && (
                <div className="flex-shrink-0 px-4 py-2">
                    <div className="max-w-4xl mx-auto bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                        <button
                            onClick={() => setError(null)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                            关闭
                        </button>
                    </div>
                </div>
            )}

            {/* 输入区域 */}
            <div className="flex-shrink-0 bg-white border-t border-slate-200 px-4 py-4 shadow-lg ">
                <div className="max-w-4xl mx-auto">
                    <div className="relative bg-slate-50 rounded-2xl border-2 border-slate-200 focus-within:border-[#006C39] transition-colors">
                        <textarea
                            ref={textareaRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="输入你的问题... (Shift + Enter 换行)"
                            disabled={isLoading}
                            className="w-full px-5 py-4 pr-14 bg-transparent resize-none focus:outline-none text-slate-800 placeholder-slate-400 disabled:opacity-50"
                            style={{ minHeight: '56px', maxHeight: '200px' }}
                            rows={1}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={!input.trim() || isLoading}
                            className="absolute right-3 bottom-3 w-10 h-10 rounded-xl bg-gradient-to-br from-[#006C39] to-[#A13F0B] text-white flex items-center justify-center hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Send className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                    <p className="text-xs text-slate-500 mt-2 text-center">
                        AI 可能会产生错误。请核实重要信息。
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AITutorPage;