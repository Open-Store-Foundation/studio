////////////////////////
// TextFieldWithCounter
////////////////////////
import {AvoirCountedTextField, TextFieldWithCounterProps} from "@components/inputs/AvoirCountedTextField.tsx";
import {AvoirTitledContainer} from "@components/layouts/AvoirTitledContainer.tsx";

export interface PropertyTextFieldProps extends TextFieldWithCounterProps {
    title: string;
}

export function AvoirTitledTextField(
    props: PropertyTextFieldProps
) {
    return (
        <AvoirTitledContainer title={props.title}>
            <AvoirCountedTextField {...props} />
        </AvoirTitledContainer>
    )
}