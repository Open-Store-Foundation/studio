import {formatSize} from "@utils/format.ts";
import {IQuotaProps} from "@data/greenfield/gf_mirror.ts";

export const getRemainingQuota = (quotaData: IQuotaProps) => {
    if (!quotaData) return 0;
    const { readQuota, freeQuota, consumedQuota, monthlyFreeQuota, monthlyQuotaConsumedSize } =
        quotaData;
    const remainingQuota =
        freeQuota + readQuota + monthlyFreeQuota - consumedQuota - monthlyQuotaConsumedSize;

    return remainingQuota;
};

export function formatQuota(quota: IQuotaProps) {
    const {
        freeQuota = 0,
        readQuota = 0,
        consumedQuota = 0,
        freeConsumedSize = 0,
        monthlyFreeQuota,
        monthlyQuotaConsumedSize,
    } = quota || {};

    const value = {
        totalFree: freeQuota + freeConsumedSize + monthlyFreeQuota,
        totalRead: readQuota,
        remainFree: freeQuota + monthlyFreeQuota - monthlyQuotaConsumedSize,
        remainRead: readQuota - consumedQuota,
        totalMonthly: readQuota + monthlyFreeQuota,
        total: readQuota + freeQuota + freeConsumedSize + monthlyFreeQuota,
        remain: freeQuota + readQuota - consumedQuota + monthlyFreeQuota - monthlyQuotaConsumedSize,
        monthlyFreeQuota,
        monthlyQuotaConsumedSize,
        monthlyQuotaRemain: monthlyFreeQuota - monthlyQuotaConsumedSize,
        oneTimeFree: freeQuota + freeConsumedSize,
        oneTimeFreeConsumedSize: freeConsumedSize,
        oneTimeFreeRemain: freeQuota,
    };

    const f = (v: number) => {
        if (!quota) return '-';
        if (v <= 0) return '0 GB';
        const text = formatSize(v);
        return text;
    };

    const text = {
        totalFreeText: f(value.totalFree),
        totalReadText: f(readQuota),
        remainFreeText: f(value.remainFree),
        remainReadText: f(readQuota - consumedQuota),
        totalText: f(value.total),
        remainText: f(value.remain),
        monthlyFreeQuotaText: f(monthlyFreeQuota),
        monthlyQuotaConsumedSizeText: f(monthlyQuotaConsumedSize),
        monthlyQuotaRemainText: f(value.monthlyQuotaRemain),
        oneTimeFreeText: f(value.oneTimeFree),
        oneTimeFreeConsumedSizeText: f(value.oneTimeFreeConsumedSize),
        oneTimeFreeRemainText: f(value.oneTimeFreeRemain),
    };

    return {
        ...value,
        ...text,
        remainPercent: (value.remain / value.total) * 100,
        freeRemainPercent: (value.remainFree / value.total) * 100,
        readRemainPercent: (value.remainRead / value.total) * 100,
        show: `${f(value.remain)} of ${f(value.total)}`,
        showMain: `${f(value.remain)} of ${f(value.total)}`,
        showMonthly: `${f(value.monthlyQuotaRemain)} of ${f(value.monthlyFreeQuota)}`,
        showOneTime: `${f(value.oneTimeFreeRemain)} of ${f(value.oneTimeFree)}`,
    };
};
