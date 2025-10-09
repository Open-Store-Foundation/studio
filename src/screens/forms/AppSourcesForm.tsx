import {Box, Stack, Typography, useTheme} from "@mui/material";
import {AvoirTitledTextField} from "@components/inputs/AvoirTitledTextField.tsx";
import {FieldAction} from "@components/inputs/FieldAction.tsx";
import {AvoirSecondaryButton} from "@components/inputs/AvoirButtons.tsx";
import {AvoirProperty, AvoirPropertyBox} from "@components/basic/AvoirProperty.tsx";
import {AvoirTitledRoFiled} from "@components/inputs/AvoirTitledRoFiled.tsx";
import {AvoirSectionTitledBox} from "@components/basic/AvoirSection";
import {DefaultScreenEmptyProps, PlaceholderEmpty} from "@components/basic/ScreenEmpty.tsx";
import {RenderEditButton} from "@screens/forms/form.tsx";
import {AvoirSwitchCell} from "@components/inputs/AvoirSwitchCell.tsx";
import {ScAppDistribution, ScAppDistributionType} from "@data/sc/ScAssetService.ts";
import {IconCircleCheck, IconCircleX} from "@tabler/icons-react";
import {str} from "@localization/res.ts";
import {RStr} from "@localization/ids.ts";
import {AppRoute} from "@router";

export const MAX_CUSTOM_URL = 5;
export const MAX_CUSTOM_URL_LENGTH = 255;

export interface AppSourcesReadOnlyFormProps {
    sources: string[];
    isCustomEnabled: boolean;
    editHref?: string;
}

export function AppSourcesReadOnlyForm(
    {
        isCustomEnabled,
        sources,
        editHref,
    }: AppSourcesReadOnlyFormProps
) {
    const theme = useTheme();
    return (
        <AvoirSectionTitledBox
            contentOffset={2}
            title={str(RStr.AppSourcesForm_title)}
            description={str(RStr.AppSourcesForm_description)}
            infoLink={AppRoute.Article.route(AppRoute.Article.CustomDistribution)}
            action={() => editHref ? RenderEditButton(editHref) : undefined}
        >

            <Stack spacing={8}>
                <Stack spacing={2}>
                    <AppSourcesTypeTitle/>

                    {
                        isCustomEnabled
                            ? (
                                <Stack direction={"row"} alignItems={"center"} spacing={1}>
                                    <IconCircleCheck color={theme.palette.success.main}/>
                                    <Typography variant="subtitle1" fontWeight="bold">{str(RStr.AppSourcesForm_custom_distribution_enabled)}</Typography>
                                </Stack>
                            )
                            : (
                                <Stack direction={"row"} alignItems={"center"} spacing={1}>
                                    <IconCircleX color={theme.palette.error.main}/>
                                    <Typography variant="subtitle1" fontWeight="bold">{str(RStr.AppSourcesForm_custom_distribution_disabled)}</Typography>
                                </Stack>
                            )
                    }
                </Stack>


                <Stack spacing={4}>
                    <AppSourcesUrlsTitle/>

                    {
                        sources.length === 0
                            ? <PlaceholderEmpty {...DefaultScreenEmptyProps} />
                            : sources.map((url, index) => {
                                return (
                                    <AvoirTitledRoFiled
                                        key={index}
                                        label={str(RStr.AppSourcesForm_source_label) + " #" + (index + 1)}
                                        value={url}
                                        action={FieldAction.Copy}
                                    />
                                )
                            })
                    }
                </Stack>
            </Stack>
        </AvoirSectionTitledBox>
    );
}


export interface AppSourcesEditFormProps {
    sources: string[];
    isLoading: boolean;

    deletedIndexes: Set<number>;
    onDeleteSource: (index: number) => void;
    onRestoreSource: (index: number) => void;

    isCustomEnabled: boolean;
    onCustomChange: (isChecked: boolean) => void;

    editProps: AppSourcesFormProps;
}

export function AppSourcesEditForm(
    {
        sources,
        deletedIndexes,
        isCustomEnabled,
        isLoading,
        onCustomChange,
        onDeleteSource,
        onRestoreSource,
        editProps,
    }: AppSourcesEditFormProps
) {
    const newSources = editProps?.sources.length ?? 0
    const deletedSources = deletedIndexes?.size ?? 0
    const urlsCount = sources.length + newSources - deletedSources;

    return (
        <AvoirSectionTitledBox
            contentOffset={2}
            title={str(RStr.AppSourcesForm_title)}
            description={str(RStr.AppSourcesForm_description)}
            infoLink={AppRoute.Article.route(AppRoute.Article.CustomDistribution)}>

            <Stack spacing={8}>
                <Stack spacing={2}>
                    <AppSourcesTypeTitle/>

                    <AvoirSwitchCell
                        disabled={isLoading}
                        checked={isCustomEnabled}
                        label={str(RStr.AppSourcesForm_custom_distribution_label)}
                        onChange={onCustomChange}
                    />
                </Stack>


                <Stack spacing={4}>
                    <AppSourcesUrlsTitle/>

                    {
                        sources.map((url, index) => {
                            const isDeleted = deletedIndexes?.has(index)
                            const action = isDeleted ? FieldAction.Restore : FieldAction.Delete

                            const isActionDisabled = (action == FieldAction.Delete && urlsCount == 1)
                                || (action == FieldAction.Restore && urlsCount == MAX_CUSTOM_URL)

                            return (
                                <AvoirTitledRoFiled
                                    key={index}
                                    label={str(RStr.AppSourcesForm_source_label) + " #" + (index + 1)}
                                    value={url}
                                    action={action}
                                    actionDisabled={isActionDisabled || isLoading}
                                    disabled={isDeleted || isLoading}
                                    onActionClick={() => {
                                        if (action == FieldAction.Restore) {
                                            onRestoreSource?.(index)
                                        } else if (action == FieldAction.Delete) {
                                            onDeleteSource?.(index)
                                        }
                                    }}
                                />
                            )
                        })
                    }

                    {
                        <AppSourcesForm
                            indexOffset={sources.length}
                            totalCount={urlsCount}
                            isFirstRemovable={true}
                            isRemovable={urlsCount > 1}
                            {...editProps}
                        />
                    }
                </Stack>
            </Stack>
        </AvoirSectionTitledBox>
    );
}

export interface AppSourcesNewFormProps {
    sources: string[];
    isLoading: boolean;

    isCustomEnabled: boolean;
    onCustomChange: (isChecked: boolean) => void;

    onAddUrl: () => void;
    onRemoveUrl: (index: number) => void;
    onUpdateUrl: (index: number, value: string) => void;
}

export function AppSourcesNewForm(
    {
        isLoading,

        isCustomEnabled,
        onCustomChange,

        sources,
        onAddUrl,
        onRemoveUrl,
        onUpdateUrl,
    }: AppSourcesNewFormProps
) {
    return (
        <AvoirSectionTitledBox
            contentOffset={2}
            title={str(RStr.AppSourcesForm_title)}
            description={str(RStr.AppSourcesForm_description)}
            infoLink={AppRoute.Article.route(AppRoute.Article.CustomDistribution)}>

            <Stack spacing={8}>
                <Stack spacing={2}>
                    <AppSourcesTypeTitle/>

                    <AvoirSwitchCell
                        disabled={isLoading}
                        checked={isCustomEnabled}
                        label={str(RStr.AppSourcesForm_custom_distribution_label)}
                        onChange={onCustomChange}
                    />
                </Stack>


                {isCustomEnabled &&
                    <Stack spacing={4}>
                        <AppSourcesUrlsTitle/>

                        <AppSourcesForm
                            sources={sources}
                            isLoading={isLoading}
                            onAddUrl={onAddUrl}
                            onRemoveUrl={onRemoveUrl}
                            onUpdateUrl={onUpdateUrl}
                        />
                    </Stack>
                }
            </Stack>
        </AvoirSectionTitledBox>
    );
}

export interface AppSourcesFormProps {
    sources: string[];
    isLoading: boolean;
    onAddUrl: () => void;
    onRemoveUrl: (index: number) => void;
    onUpdateUrl: (index: number, value: string) => void;
    totalCount?: number;
    indexOffset?: number;
    isFirstRemovable?: boolean;
    isRemovable?: boolean;
}

export function AppSourcesForm(
    {
        sources,
        isLoading,
        onAddUrl,
        onRemoveUrl,
        onUpdateUrl,
        totalCount = sources.length,
        indexOffset = 0,
        isFirstRemovable = false,
        isRemovable = true,
    }: AppSourcesFormProps
) {
    return (
        <Stack spacing={4}>
            {sources.map((url, index) => (
                <Stack key={index} flexGrow={1} spacing={4}>
                    <AvoirTitledTextField
                        grow
                        title={str(RStr.AppSourcesForm_source_label) + " #" + (indexOffset + index + 1)}
                        helperText={
                            index == 0
                                ? str(RStr.AppSourcesForm_field_description)
                                : undefined
                        }
                        autocomplete={"source"}
                        onChange={(e) => onUpdateUrl(index, e.target.value)}
                        value={url}
                        disabled={isLoading}
                        action={(index > 0 || isFirstRemovable) ? FieldAction.Delete : undefined}
                        actionDisabled={isLoading || !isRemovable}
                        onAction={() => onRemoveUrl(index)}
                        maxLength={MAX_CUSTOM_URL_LENGTH}
                    />
                </Stack>
            ))}

            <Stack direction={"row"} display={"flex"}>
                {totalCount < MAX_CUSTOM_URL && (
                    <Box width={850} textAlign={"end"}>
                        <AvoirSecondaryButton
                            text={str(RStr.AppSourcesForm_add_source_button)}
                            onClick={onAddUrl}
                            disabled={isLoading}
                        />
                    </Box>
                )}
            </Stack>
        </Stack>
    );
}

export interface AppSourcesSummaryFormProps {
    distribution: ScAppDistribution;
}

export function AppSourcesSummaryForm(
    {distribution}: AppSourcesSummaryFormProps
) {
    return (
        <AvoirPropertyBox title={str(RStr.AppSourcesForm_distribution_info_title)}>
            <AvoirProperty
                title={str(RStr.AppSourcesForm_custom_distribution_title)}
                value={distribution.type == ScAppDistributionType.Default ? str(RStr.Disabled) : str(RStr.Enabled)}
            />

            <AvoirProperty
                title={str(RStr.AppSourcesForm_sources_count_title)}
                value={distribution.sources.length.toString()}
            />
        </AvoirPropertyBox>
    );
}

function AppSourcesTypeTitle() {
    return (
        <Stack>
            <Typography variant="subtitle1" color="text.primary" fontWeight="bold">
                {str(RStr.AppSourcesForm_settings_title)}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
                {str(RStr.AppSourcesForm_settings_description)}
            </Typography>
        </Stack>
    )
}


function AppSourcesUrlsTitle() {
    return (
        <Stack>
            <Typography variant="subtitle1" color="text.primary" fontWeight="bold">
                {str(RStr.AppSourcesForm_sources_title)}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
                {str(RStr.AppSourcesForm_sources_description)}
            </Typography>
        </Stack>
    )
}
