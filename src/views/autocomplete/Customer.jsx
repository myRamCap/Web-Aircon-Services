import { Autocomplete, TextField } from '@mui/material'
import React from 'react'
import Customer from '../../data/JSON/dummy/refCustomer.json'

export default function Customer() {
    const optionsCustomer = Customer.RECORDS.map((option) => {
        const firstLetter = option.name[0].toUpperCase();
        return {
          firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
          ...option,
        };
      })

  return (
    <div>
    <Autocomplete
        id="customerName"
        disableClearable
        options={optionsCustomer.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
        // onChange={handleChangeProvince}
        getOptionLabel={(options) => options.name }  
        isOptionEqualToValue={(option, value) => option.name === value.name}
        renderInput={(params) => (
            <TextField
            {...params}
            label="Customer Name"
            InputProps={{
                ...params.InputProps,
                type: 'search',
            }}
            />
        )}
    />
       </div>
  )
}
