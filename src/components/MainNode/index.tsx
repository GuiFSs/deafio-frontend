import { Node } from '@/types';
import clsx from 'clsx';
import { FC, useEffect, useMemo } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { MdSend } from 'react-icons/md';

type DropItem = {
  type: string;
  id: string;
};

type Props = {
  node: Node;
  isDraggingGlobal: boolean;
  onPressAdd(id: string): void;
  onChangePosition(fromNodeId: string, toNodeId: string): void;
  onChangePositionAbove(fromNodeId: string, toNodeChildId: string): void;
  setIsDragging(value: boolean): void;
};

export const MainNode: FC<Props> = ({
  node: { id, children },
  onPressAdd,
  isDraggingGlobal,
  setIsDragging,
  onChangePosition,
  onChangePositionAbove,
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'NODE',
    item: { type: 'NODE', id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ canDrop, isOver }, drop] = useDrop({
    accept: 'NODE',
    drop: (item: DropItem) => {
      onChangePosition(item.id, id);
    },
    collect: (monitor) => ({
      canDrop: monitor.canDrop(),
      isOver: monitor.isOver(),
    }),
  });

  const [{ canDrop: canDropTop }, topDrop] = useDrop({
    accept: 'NODE',
    drop: (item: DropItem) => {
      onChangePositionAbove(item.id, id);
    },
    collect: (monitor) => ({
      canDrop: monitor.canDrop(),
      isOver: monitor.isOver(),
    }),
  });

  useEffect(() => {
    setIsDragging(isDragging);
  }, [isDragging, setIsDragging]);

  const showDropComponent = isDraggingGlobal && !isDragging;

  const isStart = useMemo(() => id === 'START', [id]);

  return (
    <div key={id} className="relative">
      {showDropComponent && !isStart && (
        <div
          className="w-fit p-2 bg-white border border-black rounded-md border-dashed absolute -top-[70px] left-0"
          ref={topDrop}>
          <div>{`Soltar acima de node ${id}`}</div>
        </div>
      )}
      <div className="absolute text-center normal-case text-sm inline-block left-0 -top-7 shadow-md rounded-md">
        <div className="relative">
          <div
            className="rotate-45 absolute z-10"
            style={{
              left: 13,
              bottom: -2,
              width: 7,
              height: 7,
              backgroundColor: '#fff',
              borderRadius: 1,
              zIndex: 1,
            }}
          />
          <div
            className="max-w-[200px] text-black text-center bg-white rounded px-2 py-[3px] z-50"
            style={{ zIndex: 999 }}>
            {isStart ? 'Welcome' : `node ${id}`}
          </div>
        </div>
      </div>

      <div ref={drag}>
        <div
          className={clsx(
            'flex rounded-full w-14 h-14 justify-center items-center',
            {
              'bg-[#2A4383]': isStart,
              'bg-[#4B76FE]': !isStart,
            },
          )}>
          <span className="text-white text-sm">
            <MdSend size={22} />
          </span>
        </div>
      </div>

      <div className="ml-[100px] mt-4">
        <>
          {children.map((childNode) => (
            <MainNode
              key={childNode.id}
              node={childNode}
              onPressAdd={onPressAdd}
              isDraggingGlobal={isDraggingGlobal}
              setIsDragging={setIsDragging}
              onChangePosition={onChangePosition}
              onChangePositionAbove={onChangePositionAbove}
            />
          ))}
          <div className="h-24">
            {showDropComponent ? (
              <div
                className="w-36 p-2 bg-white border border-black rounded-md border-dashed"
                ref={drop}>
                <div>{`Soltar como último filho de node ${id}`}</div>
              </div>
            ) : (
              <button
                className="w-7 h-7 rounded-full border border-gray-500 border-dotted text-xl/[0px] items-center justify-center bg-gray-100 text-gray-600"
                onClick={() => onPressAdd(id)}>
                +
              </button>
            )}
          </div>
        </>
      </div>
    </div>
  );
};
