import Form from "react-bootstrap/Form";

const SelectComponent = ({ datas, selected, handleChange }) => {
    return (
        <Form.Select
            value={selected}
            onChange={handleChange}
        >
            {datas.map((data, index) => (
                <option key={index} value={data.value}>
                    {data.label}
                </option>
            ))}
        </Form.Select>
    )
}

export default SelectComponent;