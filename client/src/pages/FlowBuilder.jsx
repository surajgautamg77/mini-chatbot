import { useState, useCallback, useRef } from "react";
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  Panel,
  useReactFlow,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";
import {
  Plus,
  Save,
  Play,
  Trash2,
  Download,
  Upload,
  Settings,
} from "lucide-react";
import toast from "react-hot-toast";
import FlowTester from "../components/flow/FlowTester";

// Import custom node components
import IntentNode from "../components/flow/IntentNode";
import TextInputNode from "../components/flow/TextInputNode";
import ButtonNode from "../components/flow/ButtonNode";
import ResponseNode from "../components/flow/ResponseNode";
import ConditionNode from "../components/flow/ConditionNode";

// Define node types
const nodeTypes = {
  intent: IntentNode,
  textInput: TextInputNode,
  button: ButtonNode,
  response: ResponseNode,
  condition: ConditionNode,
};

function FlowBuilderContent() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [flowName, setFlowName] = useState("New Flow");
  const [showTester, setShowTester] = useState(false);
  const reactFlowWrapper = useRef(null);
  const { project } = useReactFlow();

  // Handle edge connections
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Handle node selection
  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);

  // Handle node data changes
  const onNodeDataChange = useCallback(
    (nodeId, newData) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            return { ...node, data: { ...node.data, ...newData } };
          }
          return node;
        })
      );
    },
    [setNodes]
  );

  // Add new node
  const addNode = (type) => {
    const newNode = {
      id: `${type}-${Date.now()}`,
      type,
      position: { x: 100, y: 100 },
      data: {
        label: type.charAt(0).toUpperCase() + type.slice(1),
        onChange: (newData) => onNodeDataChange(newNode.id, newData),
      },
    };
    setNodes((nds) => [...nds, newNode]);
    toast.success(`${type} node added`);
  };

  // Delete selected node
  const deleteSelectedNode = () => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
      setEdges((eds) =>
        eds.filter(
          (edge) =>
            edge.source !== selectedNode.id && edge.target !== selectedNode.id
        )
      );
      setSelectedNode(null);
      toast.success("Node deleted");
    }
  };

  // Save flow
  const saveFlow = () => {
    const flowData = {
      name: flowName,
      nodes,
      edges,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem("flowData", JSON.stringify(flowData));
    toast.success("Flow saved successfully");
  };

  // Load flow
  const loadFlow = () => {
    const saved = localStorage.getItem("flowData");
    if (saved) {
      try {
        const flowData = JSON.parse(saved);
        setNodes(flowData.nodes || []);
        setEdges(flowData.edges || []);
        setFlowName(flowData.name || "Loaded Flow");
        toast.success("Flow loaded successfully");
      } catch (error) {
        toast.error("Error loading flow");
      }
    } else {
      toast.error("No saved flow found");
    }
  };

  // Export flow as JSON
  const exportFlow = () => {
    const flowData = {
      name: flowName,
      nodes,
      edges,
      exportedAt: new Date().toISOString(),
    };
    const dataStr = JSON.stringify(flowData, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = `${flowName.replace(/\s+/g, "_")}_flow.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();

    toast.success("Flow exported successfully");
  };

  // Import flow from JSON
  const importFlow = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const flowData = JSON.parse(e.target.result);
          setNodes(flowData.nodes || []);
          setEdges(flowData.edges || []);
          setFlowName(flowData.name || "Imported Flow");
          toast.success("Flow imported successfully");
        } catch (error) {
          toast.error("Error importing flow");
        }
      };
      reader.readAsText(file);
    }
  };

  // Test flow
  const testFlow = () => {
    if (nodes.length === 0) {
      toast.error("Please add some nodes to test the flow");
      return;
    }
    setShowTester(true);
  };

  // Node type definitions for the sidebar
  const nodeTypeDefinitions = [
    {
      type: "intent",
      label: "Intent Detection",
      description: "Detect user intent from keywords",
      color: "bg-purple-500",
      icon: "🧠",
    },
    {
      type: "textInput",
      label: "Text Input",
      description: "Collect text input from user",
      color: "bg-green-500",
      icon: "📝",
    },
    {
      type: "button",
      label: "Button Options",
      description: "Present button choices to user",
      color: "bg-blue-500",
      icon: "🔘",
    },
    {
      type: "response",
      label: "Bot Response",
      description: "Send response to user",
      color: "bg-orange-500",
      icon: "🤖",
    },
    {
      type: "condition",
      label: "Condition",
      description: "Add conditional logic",
      color: "bg-yellow-500",
      icon: "🔀",
    },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Flow Builder</h1>
              <p className="text-gray-600">
                Create conversation flows and automation
              </p>
            </div>
            <input
              type="text"
              value={flowName}
              onChange={(e) => setFlowName(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Flow name"
            />
          </div>
          <div className="flex space-x-3">
            <button
              onClick={testFlow}
              className="btn btn-secondary flex items-center space-x-2"
            >
              <Play className="w-4 h-4" />
              <span>Test Flow</span>
            </button>
            <button
              onClick={loadFlow}
              className="btn btn-secondary flex items-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>Load</span>
            </button>
            <button
              onClick={saveFlow}
              className="btn btn-primary flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 p-4 overflow-y-auto">
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Node Types</h3>
            <div className="space-y-2">
              {nodeTypeDefinitions.map((nodeType) => (
                <button
                  key={nodeType.type}
                  onClick={() => addNode(nodeType.type)}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left"
                >
                  <div
                    className={`w-8 h-8 rounded-full ${nodeType.color} flex items-center justify-center text-white text-sm`}
                  >
                    {nodeType.icon}
                  </div>
                  <div>
                    <div className="font-medium text-sm text-gray-900">
                      {nodeType.label}
                    </div>
                    <div className="text-xs text-gray-500">
                      {nodeType.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Import/Export */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Import/Export</h3>
            <div className="space-y-2">
              <label className="block">
                <input
                  type="file"
                  accept=".json"
                  onChange={importFlow}
                  className="hidden"
                />
                <div className="w-full flex items-center space-x-2 p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
                  <Upload className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">Import Flow</span>
                </div>
              </label>
              <button
                onClick={exportFlow}
                className="w-full flex items-center space-x-2 p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <Download className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">Export Flow</span>
              </button>
            </div>
          </div>

          {/* Selected Node Properties */}
          {selectedNode && (
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">Node Properties</h4>
                <button
                  onClick={deleteSelectedNode}
                  className="p-1 text-red-500 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="text-sm text-gray-600">
                <div className="mb-2">
                  <strong>Type:</strong> {selectedNode.type}
                </div>
                <div className="mb-2">
                  <strong>ID:</strong> {selectedNode.id}
                </div>
                <div>
                  <strong>Position:</strong>{" "}
                  {Math.round(selectedNode.position.x)},{" "}
                  {Math.round(selectedNode.position.y)}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* React Flow Canvas */}
        <div className="flex-1" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
            attributionPosition="bottom-left"
          >
            <Controls />
            <Background />
            <MiniMap />
            <Panel
              position="top-right"
              className="bg-white p-2 rounded-lg shadow-lg"
            >
              <div className="text-xs text-gray-600">
                Nodes: {nodes.length} | Edges: {edges.length}
              </div>
            </Panel>
          </ReactFlow>
        </div>
      </div>

      {/* Flow Tester Modal */}
      {showTester && (
        <FlowTester
          flowData={{ nodes, edges }}
          onClose={() => setShowTester(false)}
        />
      )}
    </div>
  );
}

function FlowBuilder() {
  return (
    <ReactFlowProvider>
      <FlowBuilderContent />
    </ReactFlowProvider>
  );
}

export default FlowBuilder;
