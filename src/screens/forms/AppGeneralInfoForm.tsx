import {Stack, SxProps} from "@mui/material";
import {AvoirTitledRoFiled} from "@components/inputs/AvoirTitledRoFiled.tsx";

import {AvoirSectionTitledBox} from "@components/basic/AvoirSection.tsx";
import {FieldAction} from "@components/inputs/FieldAction.tsx";
import {AvoirTitledTextField} from "@components/inputs/AvoirTitledTextField.tsx";
import {FormFieldProps, RenderEditButton} from "@screens/forms/form.tsx";
import {str} from "@localization/res.ts";
import {RStr} from "@localization/ids.ts";
import {AppLogo} from "@components/basic/AppLogo.tsx";
import {AvoirTitledContainer} from "@components/layouts/AvoirTitledContainer.tsx";
import {AppRoute} from "@router";

export interface AppGeneralInfoFormProps {
    packageName?: FormFieldProps<string>,
    name: FormFieldProps<string>,
    description?: FormFieldProps<string>,

    isDisabled: boolean,
    sx: SxProps
}

export function AppGeneralInfoForm(
    {
        packageName,
        name,
        description,
        isDisabled,
        sx
    }: AppGeneralInfoFormProps
) {
    return (
        <AvoirSectionTitledBox
            title={str(RStr.AppGeneralInfoForm_title)}
            description={str(RStr.AppGeneralInfoForm_description)}
            infoLink={AppRoute.Article.route(AppRoute.Article.HowItWorks)}
            contentOffset={3}>
            <Stack spacing={4} sx={sx}>
                {
                    packageName &&
                    <AvoirTitledTextField
                        title={`${str(RStr.AppGeneralInfoForm_package_name_label)}*`}
                        helperText={
                            packageName.isValid
                                ? str(RStr.AppGeneralInfoForm_package_name_helper)
                                : str(RStr.AppGeneralInfoForm_package_name_error)
                        }
                        onChange={(e) => {
                            packageName.onChange?.(e.target.value)
                        }}
                        value={packageName.value}
                        disabled={isDisabled}
                        error={!packageName.isValid}
                        maxLength={255}
                    />
                }

                <AvoirTitledTextField
                    title={`${str(RStr.AppGeneralInfoForm_app_name_label)}*`}
                    helperText={
                        name.isValid
                            ? str(RStr.AppGeneralInfoForm_app_name_helper)
                            : str(RStr.AppGeneralInfoForm_app_name_error)
                    }
                    value={name.value}
                    disabled={isDisabled}
                    onChange={(e) => {
                        name.onChange(e.target.value)
                    }}
                    error={!name.isValid}
                    maxLength={50}
                />

                {
                    description && <AvoirTitledTextField
                        title={str(RStr.AppGeneralInfoForm_description_label)}
                        disabled={isDisabled}
                        value={description.value}
                        helperText={str(RStr.AppGeneralInfoForm_description_helper)}
                        maxLength={1000}
                        minRows={3}
                        maxRows={3}
                        multiline={true}
                        onChange={(e) => {
                            description.onChange?.(e.target.value)
                        }}
                    />
                }
            </Stack>
        </AvoirSectionTitledBox>
    )
}


export interface AppGeneralInfoReadOnlyFormProps {
    appAddress?: string;
    name?: string;
    packageName?: string;
    description?: string;
    isLoading: boolean;
    editHref?: string;
    devId?: string;
    appPackage?: string;
    onLogoClick?: () => void;
    logoRefreshKey?: number;
}

export function AppGeneralInfoReadOnlyForm(
    {
        appAddress = "",
        name = "",
        packageName = "",
        description = "",
        editHref,
        devId = "",
        appPackage = "",
        onLogoClick,
        logoRefreshKey = 0
    }: AppGeneralInfoReadOnlyFormProps
) {
    return (
        <AvoirSectionTitledBox
            contentOffset={2}
            title={str(RStr.AppGeneralInfoForm_title)}
            description={str(RStr.AppGeneralInfoForm_description)}
            infoLink={AppRoute.Article.route(AppRoute.Article.HowItWorks)}
            action={() => editHref ? RenderEditButton(editHref) : undefined}
        >

            {devId && appPackage && onLogoClick && (
                <AvoirTitledContainer
                    title={str(RStr.AppGeneralInfoForm_application_logo)}
                    alignItems="flex-start"
                >
                    <AppLogo
                        devName={devId}
                        appPackage={appPackage}
                        onClick={onLogoClick}
                        size={220}
                        refreshKey={logoRefreshKey}
                    />
                </AvoirTitledContainer>
            )}

            <AvoirTitledRoFiled
                label={str(RStr.AppGeneralInfoForm_app_contract_label)}
                value={appAddress}
                minWidth={450}
                action={FieldAction.Copy}
            />

            <AvoirTitledRoFiled
                label={str(RStr.AppGeneralInfoForm_package_name_label)}
                value={packageName}
                action={FieldAction.Copy}
            />

            {
                name && <AvoirTitledRoFiled
                    label={str(RStr.AppGeneralInfoForm_app_name_label)}
                    value={name}
                    action={FieldAction.Copy}
                />
            }

            {
                description && <AvoirTitledRoFiled
                    label={str(RStr.AppGeneralInfoForm_description_label)}
                    value={description}
                />
            }
        </AvoirSectionTitledBox>
    )
}
