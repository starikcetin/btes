import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import Select, { Props as SelectProps } from 'react-select';

type OptionType = { value: string; label: string };

interface SaneSelectProps extends SelectProps<OptionType> {
  /** Do NOT use this prop: `value` is controlled internally by `SaneSelect`. */
  value?: never;
  options: OptionType[];
  onChange: (selectedOption: OptionType | null) => void;
}

/**
 * Wraps over `react-select` for invalidating the selected
 * option if it no longer exists in the `options` prop.
 */
export const SaneSelect: React.FC<SaneSelectProps> = (props) => {
  const { options, onChange, value, ...passProps } = props;

  const [internalValue, setInternalValue] = useState<OptionType | null>(null);

  useEffect(() => {
    const isValueInvalid =
      internalValue && !options.some((opt) => _.isEqual(opt, internalValue));

    if (isValueInvalid) {
      setInternalValue(null);
    }
  }, [internalValue, options]);

  return (
    <Select
      {...passProps}
      options={options}
      value={internalValue}
      onChange={(val) => {
        setInternalValue(val);
        onChange(val);
      }}
    />
  );
};
