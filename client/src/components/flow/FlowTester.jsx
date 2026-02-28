import { useState, useEffect } from "react";
import { Send, Play, RotateCcw, MessageSquare, User, Bot } from "lucide-react";
import { flowAPI } from "../../services/flowAPI";
import toast from "react-hot-toast";

function FlowTester({ flowData, onClose }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [sessionId] = useState(`session-${Date.now()}`);
  const [variables, setVariables] = useState({});

  useEffect(() => {
    // Start the flow with initial message
    if (flowData && flowData.nodes && flowData.nodes.length > 0) {
      handleFlowExecution("", 0);
    }
  }, [flowData]);

  const handleFlowExecution = async (userInput, step) => {
    if (!flowData || !flowData.nodes) return;

    setLoading(true);
    try {
      const response = await flowAPI.execute(
        userInput,
        flowData,
        sessionId,
        step
      );

      if (response.success) {
        // Add bot response to messages
        const botMessage = {
          id: Date.now(),
          type: "bot",
          content: response.response,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, botMessage]);

        // Update variables
        if (response.variables) {
          setVariables((prev) => ({ ...prev, ...response.variables }));
        }

        // Update current step
        setCurrentStep(response.nextStep);

        // Check if flow is completed
        if (response.flowCompleted) {
          toast.success("Flow completed!");
        }
      }
    } catch (error) {
      console.error("Flow execution error:", error);
      toast.error("Error executing flow");

      const errorMessage = {
        id: Date.now(),
        type: "error",
        content: "Sorry, there was an error executing the flow.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: inputValue,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageToSend = inputValue;
    setInputValue("");

    // Execute flow with user input
    await handleFlowExecution(messageToSend, currentStep);
  };

  const resetFlow = () => {
    setMessages([]);
    setCurrentStep(0);
    setVariables({});
    handleFlowExecution("", 0);
    toast.success("Flow reset");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const MessageBubble = ({ message }) => {
    const isUser = message.type === "user";
    const isError = message.type === "error";

    return (
      <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
        <div
          className={`flex max-w-3xl ${
            isUser ? "flex-row-reverse" : "flex-row"
          } items-start space-x-3`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              isUser ? "bg-blue-600" : isError ? "bg-red-500" : "bg-green-600"
            }`}
          >
            {isUser ? (
              <User className="w-4 h-4 text-white" />
            ) : isError ? (
              <Bot className="w-4 h-4 text-white" />
            ) : (
              <Bot className="w-4 h-4 text-white" />
            )}
          </div>
          <div
            className={`rounded-lg px-4 py-2 max-w-2xl ${
              isUser
                ? "bg-blue-600 text-white"
                : isError
                ? "bg-red-50 text-red-800 border border-red-200"
                : "bg-white text-gray-900 border border-gray-200"
            }`}
          >
            <p className="whitespace-pre-wrap">{message.content}</p>
            <p
              className={`text-xs mt-2 ${
                isUser ? "text-blue-100" : "text-gray-500"
              }`}
            >
              {formatDate(message.timestamp)}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-5/6 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Flow Tester</h2>
              <p className="text-gray-600">
                Test your conversation flow in real-time
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={resetFlow}
                className="btn btn-secondary flex items-center space-x-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
              <button onClick={onClose} className="btn btn-secondary">
                Close
              </button>
            </div>
          </div>

          {/* Flow Info */}
          <div className="mt-4 flex space-x-4 text-sm text-gray-600">
            <div>
              <strong>Step:</strong> {currentStep + 1} /{" "}
              {flowData?.nodes?.length || 0}
            </div>
            <div>
              <strong>Session:</strong> {sessionId.slice(-8)}
            </div>
            <div>
              <strong>Variables:</strong> {Object.keys(variables).length}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Starting Flow
              </h3>
              <p className="text-gray-500">
                The flow will begin automatically...
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))
          )}
          {loading && (
            <div className="flex justify-start mb-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white border border-gray-200 rounded-lg px-4 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex space-x-4">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type your response..."
              className="input flex-1"
              disabled={loading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || loading}
              className="btn btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              <span>Send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FlowTester;
