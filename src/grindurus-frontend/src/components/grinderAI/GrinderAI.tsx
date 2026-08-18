import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react'

import styles from './GrinderAI.module.scss'

type Message = {
  id: number
  content: string
  role: 'user' | 'assistant'
}

const predefinedResponses: string[] = [
  "Interesting question! Let's break this down in more detail.",
  "I understand your point of view. Here's what I think about it...",
  'This is a complex topic. Here are a few key points to consider.',
  "Thank you for your question. Here's what I can say on this topic...",
  "I'm not sure, but I can make the following assumption...",
]

function GrinderAI() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState<string>('')
  const [isTyping, setIsTyping] = useState<boolean>(false)

  const simulateAIResponse = async () => {
    setIsTyping(true)
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
    const randomResponse =
      predefinedResponses[Math.floor(Math.random() * predefinedResponses.length)]
    setMessages(prevMessages => [
      ...prevMessages,
      { id: Date.now(), content: randomResponse, role: 'assistant' },
    ])
    setIsTyping(false)
  }

  const sendMessage = (e: FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      setMessages(prevMessages => [
        ...prevMessages,
        { id: Date.now(), content: input, role: 'user' },
      ])
      setInput('')
      simulateAIResponse()
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  return (
    <section className={styles['section']}>
      <div className={`${styles['container']} container`}>
        <div className={`${styles['chat']} form`}>
          <div className={styles['header']}>
            <h1 className={`${styles['title']} form-title`}>Ask GrinderAI Chat</h1>
          </div>
          <div className={styles['messages-wrapper']}>
            <div className={styles['messages']}>
              {messages.map(m => (
                <div key={m.id} className={`${styles['message']} ${styles[m.role]}`}>
                  <span className={styles['message-content']}>{m.content}</span>
                </div>
              ))}
              {isTyping && (
                <div className={styles['typing']}>
                  <span>AI is typing...</span>
                </div>
              )}
            </div>
          </div>
          <div className={styles['form-input']}>
            <form onSubmit={sendMessage} className="form-input">
              <input value={input} onChange={handleChange} placeholder="Enter the question" />
              <button type="submit" className={`${styles['submit-button']} button`}>
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default GrinderAI
