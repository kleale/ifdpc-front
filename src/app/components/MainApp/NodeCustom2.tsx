import React, { memo } from "react";
import { Handle, Position } from '@xyflow/react';
 
import {
  NodeTooltip,
  NodeTooltipContent,
  NodeTooltipTrigger,
} from "../NodeTooltip";
import { BaseNode, BaseNodeContent } from "../BaseNode";
 
const NodeTooltipDemo = memo(({ data, isConnectable } : {data: any, isConnectable: any}) => {
  return (
    <NodeTooltip>
      <NodeTooltipContent position={Position.Top} className="text-center">
        {JSON.stringify(data.nodeOptions)}
      </NodeTooltipContent>
      <BaseNode className="w-64 text-center calculatedNode">
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
      />
        <BaseNodeContent className="flex flex-col items-center">
          <NodeTooltipTrigger className="rounded border border-gray-300 p-2 text-lg font-bold">
            {data.label}
          </NodeTooltipTrigger>
        </BaseNodeContent>
        <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
      />
      </BaseNode>
    </NodeTooltip>
  );
});
 
export default NodeTooltipDemo;

