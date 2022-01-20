import React from "react";

interface Props {
    label: string, 
    name: string, 
    type: string,
    placeholder?: string,
    minLength?: number,
    maxLength?: number,
    defaultValue?: string
}

const FormInput: React.FC<Props> = (props) => {
    return (
        <div className="form-group">
            <label>{props.label}</label>
            <input 
                name={props.name} 
                className="form-control" 
                type={props.type} 
                placeholder={props.placeholder} 
                minLength={props.minLength}
                maxLength={props.maxLength} 
                defaultValue={props.defaultValue}
            />
        </div>
    )
} 

export default FormInput;