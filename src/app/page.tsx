'use client';

import { MainNode } from '@/components';
import { Node } from '@/types';
import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const initialNodes: Node = {
  id: 'START',
  children: [],
};

export default function Home() {
  const [nodeTree, setNodeTree] = useState<Node>(initialNodes);
  const [isDragging, setIsDragging] = useState(false);

  const addNewNode = (id: string) => {
    const parentNode = findNodeById(id, nodeTree);
    if (!parentNode) return;
    const newId = generateNodeId(parentNode);
    const newItem = { id: newId, children: [] };
    parentNode.children.push(newItem);
    setNodeTree({ ...nodeTree });
  };

  const generateNodeId = (parentNode: Node, number = 1): string => {
    const id = parentNode.id;
    const idNumber = number;
    const newId = id === 'START' ? `${idNumber}` : `${id}.${idNumber}`;
    const hasAnyNodeWithId = findNodeById(newId, nodeTree);
    if (hasAnyNodeWithId) {
      return generateNodeId(parentNode, number + 1);
    }
    return newId;
  };

  const findNodeById = (id: string, node: Node): Node | null => {
    if (node.id === id) {
      return node;
    }
    for (const child of node.children) {
      const foundNode = findNodeById(id, child);
      if (foundNode) {
        return foundNode;
      }
    }
    return null;
  };

  const findParentNodeById = (
    parentId: string,
    currentNode: Node,
  ): Node | null => {
    if (currentNode.children.some((child) => child.id === parentId)) {
      return currentNode;
    }

    for (const child of currentNode.children) {
      const foundNode = findParentNodeById(parentId, child);
      if (foundNode) {
        return foundNode;
      }
    }

    return null;
  };

  const onChangeNodePosition = (fromNodeId: string, toNodeId: string) => {
    const parentNode = findParentNodeById(fromNodeId, nodeTree);
    const fromNode = findNodeById(fromNodeId, nodeTree);
    const toNode = findNodeById(toNodeId, nodeTree);
    if (!fromNode || !toNode || !parentNode) return;
    changeNode(fromNode, toNode, parentNode);
  };

  const onChangeNodePositionAbove = (
    fromNodeId: string,
    toNodeChildId: string,
  ) => {
    const parentNode = findParentNodeById(fromNodeId, nodeTree);
    const fromNode = findNodeById(fromNodeId, nodeTree);
    const toNode = findParentNodeById(toNodeChildId, nodeTree);
    if (!fromNode || !toNode || !parentNode) return;
    changeNode(fromNode, toNode, parentNode);
  };

  const changeNode = (fromNode: Node, toNode: Node, parentNode: Node) => {
    const isTheSameParent = parentNode.id === toNode.id;
    const isTheSameNode = fromNode.id === toNode.id;
    const isChildren = !!findNodeById(toNode.id, fromNode);
    if (isTheSameParent || isTheSameNode || isChildren) return;
    toNode.children.push(fromNode);
    parentNode.children = parentNode.children.filter(
      (n) => n.id !== fromNode.id,
    );
    setNodeTree({ ...nodeTree });
  };

  return (
    <main>
      <DndProvider backend={HTML5Backend}>
        <div className="px-4 py-12 pl-16">
          <MainNode
            node={nodeTree}
            onPressAdd={addNewNode}
            isDraggingGlobal={isDragging}
            setIsDragging={setIsDragging}
            onChangePosition={onChangeNodePosition}
            onChangePositionAbove={onChangeNodePositionAbove}
          />
        </div>
      </DndProvider>
    </main>
  );
}
