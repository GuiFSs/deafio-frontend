'use client';
import React, { useState } from 'react';

interface Node {
  id: string;
  text: string;
  children?: Node[];
}

interface TreeNodeProps {
  node: Node;
  parentId?: string;
}

const TreeNode: React.FC<TreeNodeProps> = ({ node, parentId }) => {
  const [dragOver, setDragOver] = useState(false);
  const [childNodes, setChildNodes] = useState<Node[]>(node.children || []);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('text/plain', node.id);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedNodeId = e.dataTransfer.getData('text/plain');
    const droppedNode = findNodeById(childNodes, droppedNodeId);

    if (droppedNode) {
      // Remove o nó movido de seu nível anterior
      const updatedChildNodes = removeNodeById(childNodes, droppedNodeId);
      setChildNodes(updatedChildNodes);

      // Adiciona o nó movido ao novo nível
      const newChildNodes = insertNode(childNodes, droppedNode, node.id);
      setChildNodes(newChildNodes);
    }
    setDragOver(false);
  };

  const findNodeById = (nodes: Node[], nodeId: string): Node | null => {
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].id === nodeId) {
        return nodes[i];
      }
      if (nodes[i].children) {
        const foundNode = findNodeById(nodes[i].children, nodeId);
        if (foundNode) {
          return foundNode;
        }
      }
    }
    return null;
  };

  const removeNodeById = (nodes: Node[], nodeId: string): Node[] => {
    return nodes.filter((node) => node.id !== nodeId);
  };

  const insertNode = (
    nodes: Node[],
    newNode: Node,
    parentId: string,
  ): Node[] => {
    return nodes.map((node) => {
      if (node.id === parentId) {
        return {
          ...node,
          children: [...(node.children || []), newNode],
        };
      }
      if (node.children) {
        return {
          ...node,
          children: insertNode(node.children, newNode, parentId),
        };
      }
      return node;
    });
  };

  return (
    <div
      className={`tree-node ${dragOver ? 'drag-over' : ''}`}
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}>
      {node.text}
      {childNodes &&
        childNodes.map((child) => (
          <TreeNode key={child.id} node={child} parentId={node.id} />
        ))}
    </div>
  );
};

const Tree: React.FC = () => {
  const treeData: Node[] = [
    {
      id: '1',
      text: 'Node 1',
      children: [
        {
          id: '1.1',
          text: 'Node 1.1',
          children: [
            { id: '1.1.1', text: 'Node 1.1.1' },
            { id: '1.1.2', text: 'Node 1.1.2' },
          ],
        },
        {
          id: '1.2',
          text: 'Node 1.2',
          children: [
            { id: '1.2.1', text: 'Node 1.2.1' },
            { id: '1.2.2', text: 'Node 1.2.2' },
          ],
        },
      ],
    },
    {
      id: '2',
      text: 'Node 2',
      children: [
        {
          id: '2.1',
          text: 'Node 2.1',
          children: [
            { id: '2.1.1', text: 'Node 2.1.1' },
            { id: '2.1.2', text: 'Node 2.1.2' },
          ],
        },
        {
          id: '2.2',
          text: 'Node 2.2',
          children: [
            { id: '2.2.1', text: 'Node 2.2.1' },
            { id: '2.2.2', text: 'Node 2.2.2' },
          ],
        },
      ],
    },
  ];

  return (
    <div className="tree">
      {treeData.map((node) => (
        <TreeNode key={node.id} node={node} />
      ))}
    </div>
  );
};

export default Tree;
