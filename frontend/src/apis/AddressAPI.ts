export interface AddressBalance {
  final_balance: number;
  n_tx: number;
  total_received: number;
}

export const fetchAddressDetail = async (address: string | null) => {
  if (address !== null) {
    const url = `https://blockchain.info/balance?active=${address}`;
    const data = await (await fetch(url)).json();
    return address ? data[address] : null;
  } else return null;
};
