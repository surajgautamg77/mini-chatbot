import { memo } from "react";
import { Handle, Position } from "reactflow";
import { Type, MessageSquare } from "lucide-react";

const TextInputNode = memo(({ data, selected }) => {
  return (
    <div
      className={`px-4 py-3 shadow-lg rounded-lg border-2 bg-white ${
        selected ? "border-blue-500" : "border-gray-300"
      }`}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3" />

      <div className="flex items-center space-x-2 mb-2">
        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
          <Type className="w-3 h-3 text-white" />
        </div>
        <span className="font-medium text-sm">Text Input</span>
      </div>

      <div className="space-y-2">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Question/Prompt
          </label>
          <input
            type="text"
            value={data.question || ""}
            onChange={(e) =>
              data.onChange?.({ ...data, question: e.target.value })
            }
            placeholder="What time would you like to book?"
            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Variable Name
          </label>
          <input
            type="text"
            value={data.variableName || ""}
            onChange={(e) =>
              data.onChange?.({ ...data, variableName: e.target.value })
            }
            placeholder="bookingTime"
            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Validation (Optional)
          </label>
          <select
            value={data.validation || "none"}
            onChange={(e) =>
              data.onChange?.({ ...data, validation: e.target.value })
            }
            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="none">No validation</option>
            <option value="email">Email</option>
            <option value="phone">Phone number</option>
            <option value="time">Time format</option>
            <option value="date">Date format</option>
          </select>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
});

TextInputNode.displayName = "TextInputNode";

export default TextInputNode;
