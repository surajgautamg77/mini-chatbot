import { memo } from "react";
import { Handle, Position } from "reactflow";
import { MessageSquare, Bot } from "lucide-react";

const ResponseNode = memo(({ data, selected }) => {
  return (
    <div
      className={`px-4 py-3 shadow-lg rounded-lg border-2 bg-white ${
        selected ? "border-blue-500" : "border-gray-300"
      }`}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3" />

      <div className="flex items-center space-x-2 mb-2">
        <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
          <Bot className="w-3 h-3 text-white" />
        </div>
        <span className="font-medium text-sm">Bot Response</span>
      </div>

      <div className="space-y-2">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Response Message
          </label>
          <textarea
            value={data.message || ""}
            onChange={(e) =>
              data.onChange?.({ ...data, message: e.target.value })
            }
            placeholder="Thank you! Your appointment has been booked for {bookingTime}."
            rows={3}
            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Response Type
          </label>
          <select
            value={data.responseType || "text"}
            onChange={(e) =>
              data.onChange?.({ ...data, responseType: e.target.value })
            }
            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="text">Text only</option>
            <option value="confirmation">Confirmation</option>
            <option value="error">Error message</option>
            <option value="success">Success message</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Variables to Use
          </label>
          <input
            type="text"
            value={data.variables || ""}
            onChange={(e) =>
              data.onChange?.({ ...data, variables: e.target.value })
            }
            placeholder="bookingTime, userName, appointmentDate"
            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Use {"{variableName}"} in your message to insert values
          </p>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
});

ResponseNode.displayName = "ResponseNode";

export default ResponseNode;
