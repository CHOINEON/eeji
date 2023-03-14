import React from "react";
import layout_list from "../data/layout_list";
import { Grid, GridItem, useColorModeValue } from "@chakra-ui/react";

interface GridInfoProps {
  gridInfo: string;
}

export const GridLayoutBox: React.FC<GridInfoProps> = (props) => {
  const [CursorGridItem, setCursorGridItem] = React.useState<string>("none");
  const [LayoutChildOption, setLayoutChildOption] = React.useState<any>();

  const [rows, setRows] = React.useState<string>();
  const [cols, setCols] = React.useState<string>();

  const [ItemColor, setItemColor] = React.useState("#0044620f");

  let theme = useColorModeValue("navy.700", "white");

  React.useEffect(() => {
    if (theme === "white") {
      setItemColor("#ffffff0f");
    } else {
      setItemColor("#0044620f");
    }
  }, [theme]);

  React.useEffect(() => {
    let cols = 0;
    let rows = 0;

    if (props.gridInfo !== undefined) {
      if (Number(props.gridInfo.split("*")[0]) === 1) {
        rows = Number(props.gridInfo.split("*")[0]) + 1;

        setRows("repeat(" + rows + ", 1fr)");
        setCols("repeat(" + props.gridInfo.split("*")[1] + ", 1fr)");
      } else if (Number(props.gridInfo.split("*")[1]) === 1) {
        cols = Number(props.gridInfo.split("*")[1]) + 1;

        setRows("repeat(" + props.gridInfo.split("*")[0] + ", 1fr)");
        setCols("repeat(" + cols + ", 1fr)");
      } else {
        setRows("repeat(" + props.gridInfo.split("*")[0] + ", 1fr)");
        setCols("repeat(" + props.gridInfo.split("*")[1] + ", 1fr)");
      }
    }
  });

  const ClickItem = (item: any) => {
    console.log(item);
    console.log(item.target.css);
  };

  const render = () => {
    let arr: any = [];

    if (props.gridInfo === "reset" && props.gridInfo !== undefined) {
      return <div></div>;
    } else if (props.gridInfo !== undefined) {
      let r = Number(props.gridInfo.split("*")[0]);
      let c = Number(props.gridInfo.split("*")[1]);

      for (
        let i = 0,
          len =
            Number(props.gridInfo.split("*")[0]) +
            Number(props.gridInfo.split("*")[1]);
        i < len;
        i++
      ) {
        if (r === c) {
          arr.push(
            <GridItem
              key={i}
              bg={ItemColor}
              border={CursorGridItem}
              cursor={"pointer"}
              onClick={(e: any) => ClickItem(e)}
            />
          );
        } else {
          if (r > c) {
            if (i !== r) {
              arr.push(
                <GridItem
                  key={i}
                  bg={ItemColor}
                  border={CursorGridItem}
                  cursor={"pointer"}
                  onClick={(e: any) => ClickItem(e)}
                />
              );
            } else {
              arr.push(
                <GridItem
                  key={i}
                  bg={ItemColor}
                  border={CursorGridItem}
                  cursor={"pointer"}
                  colSpan={r}
                  onClick={(e: any) => ClickItem(e)}
                />
              );
            }
          } else {
            //row가 작은경우
            if (r === 1) {
              if (i === r - 1) {
                let a = r - 1;
                arr.push(
                  <GridItem
                    key={i}
                    bg={ItemColor}
                    border={CursorGridItem}
                    cursor={"pointer"}
                    colSpan={c}
                    onClick={(e: any) => ClickItem(e)}
                  />
                );
              } else if (i <= c) {
                arr.push(
                  <GridItem
                    key={i}
                    bg={ItemColor}
                    border={CursorGridItem}
                    cursor={"pointer"}
                    onClick={(e: any) => ClickItem(e)}
                  />
                );
              }
            }
          }
        }
      }
      return arr;
    }
  };

  return (
    <Grid
      h="40vw"
      pt={8}
      cursor={"pointer"}
      templateRows={rows}
      templateColumns={cols}
      gap={4}
    >
      {render()}
    </Grid>
  );
};

export default GridLayoutBox;
