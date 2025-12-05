import React, { useCallback, useEffect, useRef } from "react";
import { useAppContext } from "app/contexts/AppContext";
import {
  Background,
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  ReactFlowProvider,
  MiniMap,
  Controls,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import "./xy-theme.css";

//import jsonInput from "./../../../viz/pagerank/input/nnp_3.json";

import jsonInput from "./../../../viz/pagerank/test_3_step_1/pagerank_manual_result_nnp_3_1steps.json";
import NodeCustom from "./NodeCustom";

const nodeTypes = {
  NodeCustom: NodeCustom,
};

type edge = {
  id: any;
  source: string;
  target: string;
  label: string;
  type: string;
};

type route = {
  id: any;
  beginOption: number;
  endOption: number;
  points: any[];
  endNodeId: number;
  beginNodeId: number;
  graphId: number;
  parentNodeId: number | null;
  groupInOut: any | null;
  name: string | null;
};

const initialNodes = jsonInput.content[0].nodes.map((n) => ({
  id: n.id.toString(),
  position: n.position,
  data: { label: n.name, nodeOptions: n.nodeOptions },
  type: "NodeCustom",
}));

const initialEdges = jsonInput.content[0].routes.map((r: route) => ({
  id: r.id.toString(),
  source: r.beginNodeId.toString(),
  target: r.endNodeId.toString(),
  label: r.name,
  type: "smoothstep",
}));

// const initialNodes =
// [
//   { id: 'n1', position: { x: 0, y: 0 }, data: { label: 'Node 1' } },
//   { id: 'n2', position: { x: 0, y: 100 }, data: { label: 'Node 2' } },
// ];

// const initialEdges = [{ id: 'n1-n2', source: 'n1', target: 'n2' }];

let id = 1;
const getId = () => `${id++}`;
const nodeOrigin = [0.5, 0];

const AddNodeOnEdgeDrop = () => {
  const reactFlowWrapper = useRef(null);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const { screenToFlowPosition } = useReactFlow();
  const onConnect = useCallback(
    //@ts-ignore
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const onConnectEnd = useCallback(
    //@ts-ignore
    (event, connectionState) => {
      // when a connection is dropped on the pane it's not valid
      if (!connectionState.isValid) {
        // we need to remove the wrapper bounds, in order to get the correct position
        const id = getId();
        const { clientX, clientY } =
          "changedTouches" in event ? event.changedTouches[0] : event;
        const newNode = {
          id,
          position: screenToFlowPosition({
            x: clientX,
            y: clientY,
          }),
          data: { label: `Node ${id}` },
          origin: [0.5, 0.0],
        };

        //@ts-ignore
        setNodes((nds) => nds.concat(newNode));
        setEdges((eds) =>
          //@ts-ignore
          eds.concat({ id, source: connectionState.fromNode.id, target: id })
        );
      }
    },
    [screenToFlowPosition]
  );

  return (
    <div className="wrapper" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectEnd={onConnectEnd}
        fitView
        fitViewOptions={{ padding: 2 }}
        //@ts-ignore
        nodeOrigin={nodeOrigin}
        nodeTypes={nodeTypes}
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

const AppProvider: React.FC = () => {
  const { setGraphData } = useAppContext();

  useEffect(() => {
    setGraphData(initialNodes);
  }, [initialNodes, initialEdges]);

  return (
    <ReactFlowProvider>
      <AddNodeOnEdgeDrop />
    </ReactFlowProvider>
  );
};

export default AppProvider;
