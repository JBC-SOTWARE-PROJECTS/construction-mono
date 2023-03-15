import { Form, Select } from "antd";
import React, { forwardRef } from "react";
import _ from "lodash"

const FilterSelect = ({ placeholder, field, list, mode, loading, onChange, ...props }, ref) => {

    let choices = _.map(list, (data, i) => {
        return (
            <Select.Option key={i} value={data.value}>
                {data.label}
            </Select.Option>
        );
    });


    return (
        <>
            <Select
                className="gx-w-100"
                loading={loading}
                ref={ref}
                id={field}
                mode={mode}
                placeholder={placeholder}
                showSearch
                optionFilterProp="children"
                onChange={onChange}
                filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                {...props}>
                {choices}
            </Select>
        </>
    )

};

export default forwardRef(FilterSelect);
