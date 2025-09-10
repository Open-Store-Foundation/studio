import {AvoirProperty, AvoirPropertyBox} from "@components/basic/AvoirProperty.tsx";
import {str} from "@localization/res.ts";
import {RStr} from "@localization/ids.ts";
import {formatTextOrLoading} from "@utils/format.ts";

interface StorageProviderInfoFormProps {
    primarySp?: string;
    freeMonthlyQuote?: string;
    freeOneTimeQuote?: string;
}

export function StorageProviderInfoForm(
    {
        primarySp,
        freeMonthlyQuote,
        freeOneTimeQuote,
    }: StorageProviderInfoFormProps
) {
    return (
        <AvoirPropertyBox title={str(RStr.StorageProviderInfoForm_title)}>
            <AvoirProperty
                title={str(RStr.StorageProviderInfoForm_primaryStorageProvider)}
                isLoading={primarySp == null}
                value={formatTextOrLoading(primarySp, primarySp == null)}
            />

            <AvoirProperty
                title={str(RStr.StorageProviderInfoForm_freeMonthlyQuota)}
                isLoading={freeMonthlyQuote == null}
                value={formatTextOrLoading(freeMonthlyQuote, freeMonthlyQuote == null)}
            />

            <AvoirProperty
                title={str(RStr.StorageProviderInfoForm_freeQuotaOneTime)}
                isLoading={freeOneTimeQuote == null}
                value={formatTextOrLoading(freeOneTimeQuote, freeOneTimeQuote == null)}
            />
        </AvoirPropertyBox>
    );
} 