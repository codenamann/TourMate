import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { MessageCircle, Send } from "lucide-react"

const Chatbot = () => {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([
    { id: 1, role: "assistant", content: "Hello! I'm your TourMate assistant. How can I help you plan your trip today? Note: Gemini AI integration is coming soon." },
  ])
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!message.trim()) return
    
    const userMessage = { id: Date.now(), role: "user", content: message }
    setMessages(prev => [...prev, userMessage])
    setMessage("")
    setLoading(true)

    // TODO: Integrate with Gemini API
    setTimeout(() => {
      const assistantMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: "I'm sorry, but the Gemini AI integration is not yet available. Please use the Budget Planner or Explore pages to plan your trip."
      }
      setMessages(prev => [...prev, assistantMessage])
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
          <MessageCircle className="w-8 h-8" />
          Chatbot Assistant
        </h1>
        <p className="text-muted-foreground">
          Get travel assistance powered by Gemini AI (Coming Soon)
        </p>
      </div>

      <Card className="h-[600px] flex flex-col">
        <CardHeader>
          <CardTitle>Chat with TourMate AI</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <Avatar>
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
                {msg.role === "user" && (
                  <Avatar>
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>

          <Separator />

          {/* Input Area */}
          <div className="mt-4 flex gap-2">
            <Textarea
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[80px]"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              disabled={loading}
            />
            <Button 
              size="icon" 
              className="h-[80px] w-[80px]"
              onClick={handleSend}
              disabled={loading || !message.trim()}
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Chatbot
