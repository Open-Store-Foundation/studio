import {Stack} from "@mui/material";
import {AvoirTitledRoFiled} from "@components/inputs/AvoirTitledRoFiled.tsx";
import {appConfig} from "@config";
import {FieldAction} from "@components/inputs/FieldAction.tsx";
import {AvoirSectionTitledBox} from "@components/basic/AvoirSection.tsx";
import {str} from "@localization/res.ts";
import {RStr} from "@localization/ids.ts";

export interface ContractsInfoFormProps {
    isLoading: boolean;
    action?: FieldAction;
}

export function ContractsInfoForm({}: ContractsInfoFormProps) {
    return (
        <AvoirSectionTitledBox
            contentOffset={2}
            title={str(RStr.ContractsInfoForm_title)}
            description={str(RStr.ContractsInfoForm_description)}>

            <Stack spacing={2}>
                <AvoirTitledRoFiled
                    label={str(RStr.ContractsInfoForm_store_contract_label)}
                    value={appConfig.contracts.store}
                    minWidth={450}
                    action={FieldAction.Copy}
                />

                <AvoirTitledRoFiled
                    label={str(RStr.ContractsInfoForm_oracle_contract_label)}
                    value={appConfig.contracts.oracle}
                    minWidth={450}
                    action={FieldAction.Copy}
                />

                <AvoirTitledRoFiled
                    label={str(RStr.ContractsInfoForm_dev_factory_label)}
                    value={appConfig.contracts.devFactory}
                    minWidth={450}
                    action={FieldAction.Copy}
                />
            </Stack>
        </AvoirSectionTitledBox>
    )
} 