import React, { useCallback, useMemo } from "react";
import {
  Box,
  FormControl,
  FormGroup,
  FormLabel,
  TextField
} from "@mui/material";
import { ControlSelect } from "components/ControlSelect";
import { PixelSortScanConfig, PixelSortDirection, PixelSortOperator, PixelSortProperty } from "types/layers";


export interface PropertyOperatorControlProps {
  config: PixelSortScanConfig;
  label: string;
  operatorOptions: string[];
  propertyOptions: string[];
  sortDirectionOptions: string[];
  onChange: (key: string, value: string | null) => void;
}

export const PropertyOperatorControl = (props: PropertyOperatorControlProps) => {
  const { config, label, sortDirectionOptions, propertyOptions, operatorOptions, onChange } = props;

  const handleChange = (key: string) => (value: string | null) => {
    onChange(key, value);
  };

  return (
    <FormControl component="fieldset" variant="standard" sx={{ mt: 4 }}>
      <FormLabel component="legend">{label}</FormLabel>
      <FormGroup sx={{ flexFlow: "row" }}>
        <ControlSelect
          sx={{ flex: "1 1 auto", mr: 1 }}
          label="Scan"
          options={sortDirectionOptions}
          onChange={handleChange("scan")}
          disableClearable={true}
          value={config.scan}
        />
        <ControlSelect
          sx={{ flex: "1 1 auto", mr: 1 }}
          label="Property"
          options={propertyOptions}
          onChange={handleChange("property")}
          disableClearable={true}
          value={config.property}
        />
        <ControlSelect
          sx={{ flex: "1 1 auto", mr: 1 }}
          label="Operator"
          options={operatorOptions}
          onChange={handleChange("operator")}
          disableClearable={true}
          value={config.operator}
        />
        <TextField
          sx={{ flex: "1 1 auto", width: "50px" }}
          label="Value"
          variant="standard"
          fullWidth={false}
          value={config.value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("value")(e.target.value)}
        />
      </FormGroup>
    </FormControl>
  )
}

export interface PixelSortProps {
  config: any;
  onChange: (key: string, value: string | null) => void;
}


export const PixelSort = (props: PixelSortProps) => {
  const { config = {}, onChange } = props;

  console.log("PixelSort Controls | ", config);

  const handlePropertyOperatorChange = (configKey: string) => (key: string, value: string | null) => {
    onChange([configKey, key].join("."), value);
  }

  return (
    <Box sx={{ display: "flex", flexFlow: "column" }}>
      <ControlSelect
        label="Sort"
        options={Object.values(PixelSortDirection)}
        onChange={(value) => onChange("sort", value)}
        value={config.sort}
      />

      <PropertyOperatorControl
        label="Sort area start"
        operatorOptions={Object.values(PixelSortOperator)}
        propertyOptions={Object.values(PixelSortProperty)}
        sortDirectionOptions={Object.values(PixelSortDirection)}
        onChange={handlePropertyOperatorChange("start")}
        config={config.start || {}}
      />

      <PropertyOperatorControl
        label="Sort area end"
        operatorOptions={Object.values(PixelSortOperator)}
        propertyOptions={Object.values(PixelSortProperty)}
        sortDirectionOptions={Object.values(PixelSortDirection)}
        onChange={handlePropertyOperatorChange("end")}
        config={config.end || {}}
      />
      
    </Box>
  );
}