import { memo } from "react";
import { Handle, Position } from "reactflow";
import { Brain, Settings } from "lucide-react";

const IntentNode = memo(({ data, selected }) => {
  return (
    <div
      className={`px-4 py-3 shadow-lg rounded-lg border-2 bg-white ${
        selected ? "border-blue-500" : "border-gray-300"
      }`}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3" />

      <div className="flex items-center space-x-2 mb-2">
        <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
          <Brain className="w-3 h-3 text-white" />
        </div>
        <span className="font-medium text-sm">Intent Detection</span>
      </div>

      <div className="space-y-2">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Intent Keywords
          </label>
          <input
            type="text"
            value={data.intentKeywords || ""}
            onChange={(e) =>
              data.onChange?.({ ...data, intentKeywords: e.target.value })
            }
            placeholder="book appointment, schedule, booking"
            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Confidence Threshold
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={data.confidence || 0.7}
            onChange={(e) =>
              data.onChange?.({
                ...data,
                confidence: parseFloat(e.target.value),
              })
            }
            className="w-full"
          />
          <span className="text-xs text-gray-500">
            {data.confidence || 0.7}
          </span>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
});

IntentNode.displayName = "IntentNode";

export default IntentNode;
