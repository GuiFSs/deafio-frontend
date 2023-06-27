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

  const [__, drop] = useDrop({
    accept: 'NODE',
    drop: (item: DropItem) => {
      onChangePosition(item.id, id);
    },
    collect: (monitor) => ({
      canDrop: monitor.canDrop(),
      isOver: monitor.isOver(),
    }),
  });

  const [_, topDrop] = useDrop({
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
          className="absolute -top-[70px] left-0 w-fit rounded-md border border-dashed border-black bg-white p-2"
          ref={topDrop}>
          <div>{`Soltar acima de node ${id}`}</div>
        </div>
      )}
      <div className="absolute -top-7 left-0 inline-block rounded-md text-center text-sm normal-case shadow-md">
        <div className="relative">
          <div
            className="absolute z-10 rotate-45"
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
            className="z-50 max-w-[200px] rounded bg-white px-2 py-[3px] text-center text-black"
            style={{ zIndex: 999 }}>
            {isStart ? 'Welcome' : `node ${id}`}
          </div>
        </div>
      </div>

      <div ref={!isStart ? drag : undefined}>
        <div
          className={clsx(
            'flex h-14 w-14 items-center justify-center rounded-full',
            {
              'bg-[#2A4383]': isStart,
              'bg-[#4B76FE]': !isStart,
            },
          )}>
          <span className="text-sm text-white">
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
                className="w-36 rounded-md border border-dashed border-black bg-white p-2"
                ref={drop}>
                <div>{`Soltar como último filho de node ${id}`}</div>
              </div>
            ) : (
              <button
                className="h-7 w-7 items-center justify-center rounded-full border border-dotted border-gray-500 bg-gray-100 text-xl/[0px] text-gray-600"
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
