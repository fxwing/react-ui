import React from "react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
interface CardData {
  name: number;
  content: number;
}
interface CardProps extends CardData {
  index: number;
  swapIndex: (index1: number, index2: number) => void;
}

interface ItemType {
  name: number;
  content: number;
  index: number;
}
export default function App() {
  const [cardList, setCardList] = React.useState<CardData[]>(() => {
    return [
      { name: 1, content: 1 },
      { name: 2, content: 2 },
      { name: 3, content: 3 },
      { name: 4, content: 4 },
      { name: 5, content: 5 },
    ];
  });

  const swapIndex = React.useCallback((index1: number, index2: number) => {
    setCardList((prev) => {
      const temp = prev[index1];
      prev[index1] = prev[index2];
      prev[index2] = temp;
      return [...prev];
    });
  }, []);

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        {cardList.map((card, index) => (
          <Card
            key={card.name}
            index={index}
            {...card}
            swapIndex={swapIndex}
          ></Card>
        ))}
      </DndProvider>
    </>
  );
}

function Card({ name, content, swapIndex, index }: CardProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    item: { name, content, index } as ItemType,
    type: "card",
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: "card",
    hover: (item: ItemType) => {
      swapIndex(item.index, index);
      item.index = index;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });
  React.useEffect(() => {
    drag(ref);
    drop(ref);
  }, [drag, drop]);
  return (
    <div
      ref={ref}
      className={`w-1/5 h-20 
      ${isDragging ? "bg-slate-100" : "bg-slate-500"}
      ${isOver ? " border  border-sky-500" : ""}
       m-4 rounded-xl grid place-items-center`}
    >
      {content}
    </div>
  );
}
