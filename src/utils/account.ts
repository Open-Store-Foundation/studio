
export function shrinkAddress(address: string | undefined): string | undefined {
    if (address == undefined) {
        return undefined
    }

    if (address.length < 18) {
        return address
    }

    const preAddress = address.substring(0, 9);
    const postAddress = address.substring(address.length - 9, address.length);

    return preAddress + "..." + postAddress
}

