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


import NodeCustom from "./NodeCustom";
import NodeCustom2 from "./NodeCustom2";

const nodeTypes = {
  NodeCustom: NodeCustom,
  NodeCustom2: NodeCustom2,
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

type node = {
  id: any;
  uid: any;
  code: string;
  name: string;
  comment: null;
  disable: null;
  function: null;
  graphId: number;
  position: any;
  innerParams: any[];
  codeType: string;
  parentNodeId: null;
  width: null;
  height: null;
  functionVariables: any[];
  nodeOptions: any[];
  functionInPython: null;
  relateFem: null;
  commentColor: null;
  bsmall: null;
};

interface graphProps {
  isModal: boolean
}


// const initialNodes =
// [
//   { id: 'n1', position: { x: 0, y: 0 }, data: { label: 'Node 1' } },
//   { id: 'n2', position: { x: 0, y: 100 }, data: { label: 'Node 2' } },
// ];

// const initialEdges = [{ id: 'n1-n2', source: 'n1', target: 'n2' }];

let id = 1;
const getId = () => `${id++}`;
const nodeOrigin = [0.5, 0];

const AppProvider: React.FC = () => {
  const { graphData, setGraphData, graphDataAlt, setGraphDataAlt, isModal } = useAppContext();

  if (!graphData) return;
  let data = graphData
  
  if(isModal) data = graphDataAlt ? graphDataAlt : graphData

  console.log("JSON ID:", data.content[0].id )

  const initialNodes = data.content[0].nodes.map((n: node) => ({
    id: n.id.toString(),
    position: n.position,
    data: { label: n.name || n.code , nodeOptions: n.nodeOptions },
    type: (n.functionInPython == false) ? "NodeCustom" : "NodeCustom2",
  }));

  const initialEdges = data.content[0].routes.map((r: route) => ({
    id: r.id.toString(),
    source: r.beginNodeId.toString(),
    target: r.endNodeId.toString(),
    label: r.name,
    //type: "smoothstep" 
  }));

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

  // useEffect(() => {
  //   setGraphData(graphData);
  // }, [graphData]);

  return (
    <ReactFlowProvider>
      <AddNodeOnEdgeDrop />
    </ReactFlowProvider>
  );
};

export default AppProvider;
