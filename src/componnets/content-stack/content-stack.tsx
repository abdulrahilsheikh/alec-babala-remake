const getContent = (itemType: string, content: string) => {
  switch (itemType) {
    case "p":
      return <p>{content}</p>;
    case "h2":
      return <h2>{content}</h2>;
  }
};

const ContentStack = ({ content }: { content: string[][] }) => {
  return content.map((item) => getContent(item[0], item[1]));
};
export default ContentStack;
