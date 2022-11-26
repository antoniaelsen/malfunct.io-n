import React, { useCallback, useMemo } from "react";
import {
  Autocomplete,
  AutocompleteProps,
  TextField,
} from "@mui/material";


type StringAutocompleteProps = AutocompleteProps<string, boolean | undefined, boolean | undefined, boolean | undefined>;
type ControlSelectExtraProps = Partial<Omit<StringAutocompleteProps, "label" | "value" | "options" | "onChange">>
interface ControlSelectProps extends ControlSelectExtraProps {
  label: string;
  value?: string | null;
  options: string[];
  onChange: (value: string | null) => void;
}

export const ControlSelect = (props: ControlSelectProps) => {
  const { label, options, value, onChange, ...etc } = props;

  const handleChange = useCallback((_: any, value: string | null) => {
    onChange(value);
  }, [onChange]);

  return (
    <Autocomplete
      disablePortal
      id="control-algorithm"
      options={options}
      value={value}
      onChange={handleChange as any}
    
      renderInput={(params) => (
        <TextField {...params} label={label} variant="standard"/>
      )}
      sx={{ display: "flex", ...etc.sx }}
      {...etc}
    />
  )
}
