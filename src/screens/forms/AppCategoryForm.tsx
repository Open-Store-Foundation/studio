import {Stack, SxProps} from "@mui/material";
import {AvoirSelector} from "@components/inputs/AvoirSelector.tsx";
import {useMemo} from "react";
import {AvoirSectionTitledBox} from "@components/basic/AvoirSection.tsx";
import {AvoirTitledRoFiled} from "@components/inputs/AvoirTitledRoFiled.tsx";
import {AvoirProperty, AvoirPropertyBox} from "@components/basic/AvoirProperty.tsx";
import {AndroidTypeId, AppCategoryId, CategoryId, GameCategoryId, PlatformId} from "@data/CommonModels.ts";
import {RenderEditButton} from "@screens/forms/form.tsx";
import {str} from "@localization/res.ts";
import {RStr} from "@localization/ids.ts";

function enumKeyToLabel(key: string): string {
    return key.replace(/([A-Z])/g, ' $1').trim();
}

function getEnumOptions<T extends number>(enumObject: object): { value: T; label: string }[] {
    return Object.entries(enumObject)
        .filter(([key]) => isNaN(Number(key)))
        .map(([key, value]) => ({
            value: value as T,
            label: enumKeyToLabel(key)
        }));
}

function useAppCategoryOptions(objType: AndroidTypeId) {
    const objTypeOptions = useMemo(() => getEnumOptions<AndroidTypeId>(AndroidTypeId), []);
    const appCategoryOptions = useMemo(() => getEnumOptions<AppCategoryId>(AppCategoryId), []);
    const gameCategoryOptions = useMemo(() => getEnumOptions<GameCategoryId>(GameCategoryId), []);

    const categoryOptions = useMemo(() =>
            objType === AndroidTypeId.Game ? gameCategoryOptions : appCategoryOptions,
        [objType, gameCategoryOptions, appCategoryOptions]);

    return {objTypeOptions, categoryOptions};
}

function useAppCategoryLabels({objType, category, platform}: {
    objType: AndroidTypeId;
    category: CategoryId;
    platform: PlatformId;
}) {
    const typeLabel = AndroidTypeId[objType];
    const categoryLabel = useMemo(() => objType === AndroidTypeId.Game
        ? GameCategoryId[category as GameCategoryId]
        : AppCategoryId[category as AppCategoryId], [objType, category]);
    const platformLabel = PlatformId[platform];

    return {typeLabel, categoryLabel, platformLabel};
}

export interface AppCategoryReadOnlyFormProps {
    objType: AndroidTypeId;
    category: CategoryId;
    platform: PlatformId;
    onTypeChanged?: (type: AndroidTypeId) => void;
    onCategoryChanged?: (category: CategoryId) => void;
    editHref?: string;
}

export function AppCategoryReadOnlyForm(
    {
        objType,
        category,
        platform,
        onTypeChanged,
        onCategoryChanged,
        editHref,
    }: AppCategoryReadOnlyFormProps
) {
    const {typeLabel, categoryLabel, platformLabel} = useAppCategoryLabels({objType, category, platform});

    return (
        <AvoirSectionTitledBox
            title={str(RStr.AppCategoryForm_title)}
            description={str(RStr.AppCategoryForm_description)}
            contentOffset={2}
            action={() => editHref ? RenderEditButton(editHref) : undefined}>

            <Stack spacing={2}>
                <AvoirTitledRoFiled
                    label={str(RStr.AppCategoryForm_platform_label)}
                    value={platformLabel}
                    helperText={str(RStr.AppCategoryForm_platform_helper)}
                />
                <AvoirTitledRoFiled
                    label={str(RStr.AppCategoryForm_type_label)}
                    value={typeLabel}
                    helperText={str(RStr.AppCategoryForm_type_helper)}
                    onActionClick={() => onTypeChanged?.(objType)}
                />
                <AvoirTitledRoFiled
                    label={str(RStr.AppCategoryForm_category_label)}
                    value={categoryLabel}
                    helperText={str(RStr.AppCategoryForm_category_helper)}
                    onActionClick={() => onCategoryChanged?.(category)}
                />
            </Stack>
        </AvoirSectionTitledBox>
    );
}

export interface AppCategorySummaryFormProps {
    objType: AndroidTypeId;
    category: CategoryId;
    platform: PlatformId;
}

export function AppCategorySummaryForm(
    {
        objType,
        category,
        platform
    }: AppCategorySummaryFormProps
) {
    const {typeLabel, categoryLabel, platformLabel} = useAppCategoryLabels({objType, category, platform});

    return (
        <AvoirPropertyBox title={str(RStr.AppCategoryForm_title)}>
            <AvoirProperty
                title={str(RStr.AppCategoryForm_type_label)}
                value={typeLabel}
            />
            <AvoirProperty
                title={str(RStr.AppCategoryForm_platform_label)}
                value={platformLabel}
            />
            <AvoirProperty
                title={str(RStr.AppCategoryForm_category_label)}
                value={categoryLabel}
            />
        </AvoirPropertyBox>
    );
}

export interface AppCategoryFormProps {
    objType: AndroidTypeId;
    category: CategoryId;
    onChangedType: (type: AndroidTypeId) => void;
    onChangedCategory: (category: CategoryId) => void;
    isDisabled: boolean;
    sx?: SxProps;
}

export function AppCategoryForm(
    {
        objType,
        category,
        onChangedType,
        onChangedCategory,
        isDisabled,
        sx
    }: AppCategoryFormProps
) {
    const {objTypeOptions, categoryOptions} = useAppCategoryOptions(objType);

    return (
        <AvoirSectionTitledBox
            title={str(RStr.AppCategoryForm_title)}
            description={str(RStr.AppCategoryForm_description)}
            contentOffset={3}>
            <Stack spacing={2} sx={sx}>
                <AvoirSelector
                    title={str(RStr.AppCategoryForm_type_label)}
                    value={objType}
                    options={objTypeOptions}
                    onChange={(newType) => {
                        onChangedType(newType as AndroidTypeId);
                        if (newType === AndroidTypeId.Game) {
                            onChangedCategory(GameCategoryId.Action);
                        } else {
                            onChangedCategory(AppCategoryId.BooksAndReference);
                        }
                    }}
                    disabled={isDisabled}
                />

                <AvoirSelector
                    title={str(RStr.AppCategoryForm_category_label)}
                    value={category}
                    options={categoryOptions}
                    onChange={(newCategory) => onChangedCategory(newCategory as CategoryId)}
                    disabled={isDisabled}
                />
            </Stack>
        </AvoirSectionTitledBox>
    );
} 