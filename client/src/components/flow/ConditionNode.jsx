import { memo } from "react";
import { Handle, Position } from "reactflow";
import { GitBranch, Plus, Trash2 } from "lucide-react";

const ConditionNode = memo(({ data, selected }) => {
  const addCondition = () => {
    const newConditions = [
      ...(data.conditions || []),
      {
        field: "",
        operator: "equals",
        value: "",
        targetNode: "",
      },
    ];
    data.onChange?.({ ...data, conditions: newConditions });
  };

  const removeCondition = (index) => {
    const newConditions = data.conditions?.filter((_, i) => i !== index) || [];
    data.onChange?.({ ...data, conditions: newConditions });
  };

  const updateCondition = (index, field, value) => {
    const newConditions = [...(data.conditions || [])];
    newConditions[index] = { ...newConditions[index], [field]: value };
    data.onChange?.({ ...data, conditions: newConditions });
  };

  return (
    <div
      className={`px-4 py-3 shadow-lg rounded-lg border-2 bg-white ${
        selected ? "border-blue-500" : "border-gray-300"
      }`}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3" />

      <div className="flex items-center space-x-2 mb-2">
        <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
          <GitBranch className="w-3 h-3 text-white" />
        </div>
        <span className="font-medium text-sm">Condition</span>
      </div>

      <div className="space-y-2">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Condition Name
          </label>
          <input
            type="text"
            value={data.name || ""}
            onChange={(e) => data.onChange?.({ ...data, name: e.target.value })}
            placeholder="Check booking time"
            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-medium text-gray-700">
              Conditions
            </label>
            <button
              onClick={addCondition}
              className="p-1 text-blue-500 hover:bg-blue-50 rounded"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-1 max-h-32 overflow-y-auto">
            {(data.conditions || []).map((condition, index) => (
              <div
                key={index}
                className="p-2 border border-gray-200 rounded text-xs"
              >
                <div className="grid grid-cols-3 gap-1 mb-1">
                  <input
                    type="text"
                    value={condition.field}
                    onChange={(e) =>
                      updateCondition(index, "field", e.target.value)
                    }
                    placeholder="Variable"
                    className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <select
                    value={condition.operator}
                    onChange={(e) =>
                      updateCondition(index, "operator", e.target.value)
                    }
                    className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="equals">equals</option>
                    <option value="contains">contains</option>
                    <option value="greater">greater than</option>
                    <option value="less">less than</option>
                    <option value="exists">exists</option>
                    <option value="empty">is empty</option>
                  </select>
                  <input
                    type="text"
                    value={condition.value}
                    onChange={(e) =>
                      updateCondition(index, "value", e.target.value)
                    }
                    placeholder="Value"
                    className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={condition.targetNode}
                    onChange={(e) =>
                      updateCondition(index, "targetNode", e.target.value)
                    }
                    placeholder="Target node ID"
                    className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => removeCondition(index)}
                    className="ml-1 p-1 text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
});

ConditionNode.displayName = "ConditionNode";

export default ConditionNode;
