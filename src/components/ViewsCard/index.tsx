import React from "react";
import Box, { BoxProps } from "@mui/material/Box";
import Button from "@mui/material/Button";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Card from "@mui/material/Card";
import { ImagesState, useImagesStore } from "store/image";


interface ViewsCardProps extends BoxProps {
};

export const ViewsCard = (props: ViewsCardProps) => {
  const { ...etc } = props;
  const { filter, setFilter } = useImagesStore((state: ImagesState) => ({
    filter: state.filter,
    setFilter: state.setFilter
  }));

  const handleFilter = (e: any) => {
    const value = e.target.value;
    if (value === filter) {
      setFilter(null);
      return;
    }
    setFilter(value);
  }

  return (
    <Box {...etc}>
      <Card sx={(theme) => ({
          display: "flex",
          flexFlow: "row",
          p: 1,
        })}>

        <Button
          fullWidth={false}
          variant="contained"
          
          sx={{ m: 1 }}
        >
          {`${true ? "Show" : "Hide"} guides`}
        </Button>

        <ToggleButtonGroup
          aria-label="filter button group"
          exclusive 
          value={filter?.key || null}
          sx={{ m: 1 }}
          onChange={handleFilter}
        >
          <ToggleButton value="r">R</ToggleButton>
          <ToggleButton value="g">G</ToggleButton>
          <ToggleButton value="b">B</ToggleButton>
          <ToggleButton value="h">H</ToggleButton>
          <ToggleButton value="s">S</ToggleButton>
          <ToggleButton value="l">L</ToggleButton>
        </ToggleButtonGroup>
      </Card>
    </Box>
  );
}