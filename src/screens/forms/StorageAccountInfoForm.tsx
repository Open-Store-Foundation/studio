import {AvoirProperty, AvoirPropertyBox} from "@components/basic/AvoirProperty.tsx";
import {shrinkAddress} from "@utils/account.ts";
import {str} from "@localization/res.ts";
import {RStr} from "@localization/ids.ts";

interface StorageAccountInfoFormProps {
    bucketName?: string;
    ownerAccount?: string;
}

export function StorageAccountInfoForm({
    bucketName,
    ownerAccount
}: StorageAccountInfoFormProps) {
    return (
        <AvoirPropertyBox title={str(RStr.StorageAccountInfoForm_title)}>
            <AvoirProperty
                title={str(RStr.StorageAccountInfoForm_bucketName)}
                value={bucketName}
            />
            <AvoirProperty
                title={str(RStr.StorageAccountInfoForm_paymentAccount)}
                value={shrinkAddress(ownerAccount)}
            />
        </AvoirPropertyBox>
    );
} 