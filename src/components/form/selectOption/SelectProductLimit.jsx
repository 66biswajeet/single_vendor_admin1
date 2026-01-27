import { Select } from "@windmill/react-ui";
import React from "react";
// import { CODES } from 'currencies-map';

const SelectProductLimit = ({ register, name, label, required }) => {
  return (
    <>
      <Select name={name} {...register(`${name}`)}>
        <option value="" defaultValue hidden>
          Select Products Limit
        </option>
        {/* {CODES.map((currency) => (
          <option key={currency} value={currency}>
            {currency}{' '}
          </option>
        ))} */}

        <option value="5">5</option>
        <option value="15">15</option>
        <option value="20">20</option>
        <option value="25">25</option>
      </Select>
    </>
  );
};
export default SelectProductLimit;
