import { memo } from "react";
import { Handle, Position } from "reactflow";
import { Square, Plus, Trash2 } from "lucide-react";

const ButtonNode = memo(({ data, selected }) => {
  const addOption = () => {
    const newOptions = [
      ...(data.options || []),
      { label: "New Option", value: "new_option" },
    ];
    data.onChange?.({ ...data, options: newOptions });
  };

  const removeOption = (index) => {
    const newOptions = data.options?.filter((_, i) => i !== index) || [];
    data.onChange?.({ ...data, options: newOptions });
  };

  const updateOption = (index, field, value) => {
    const newOptions = [...(data.options || [])];
    newOptions[index] = { ...newOptions[index], [field]: value };
    data.onChange?.({ ...data, options: newOptions });
  };

  return (
    <div
      className={`px-4 py-3 shadow-lg rounded-lg border-2 bg-white ${
        selected ? "border-blue-500" : "border-gray-300"
      }`}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3" />

      <div className="flex items-center space-x-2 mb-2">
        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
          <Square className="w-3 h-3 text-white" />
        </div>
        <span className="font-medium text-sm">Button Options</span>
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
            placeholder="What would you like to do?"
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
            placeholder="userChoice"
            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-medium text-gray-700">
              Button Options
            </label>
            <button
              onClick={addOption}
              className="p-1 text-blue-500 hover:bg-blue-50 rounded"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-1 max-h-32 overflow-y-auto">
            {(data.options || []).map((option, index) => (
              <div key={index} className="flex items-center space-x-1">
                <input
                  type="text"
                  value={option.label}
                  onChange={(e) => updateOption(index, "label", e.target.value)}
                  placeholder="Option label"
                  className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={option.value}
                  onChange={(e) => updateOption(index, "value", e.target.value)}
                  placeholder="value"
                  className="w-16 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  onClick={() => removeOption(index)}
                  className="p-1 text-red-500 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
});

ButtonNode.displayName = "ButtonNode";

export default ButtonNode;
