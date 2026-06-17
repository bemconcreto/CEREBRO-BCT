import { ethers } from "ethers";

const BEM_CONTRACT = "0x9740D64f94298A75087B7Da605685F284d817734";

const ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address account) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function mint(address to, uint256 amount)",
  "function owner() view returns (address)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
];

function getProvider() {
  return new ethers.JsonRpcProvider(
    `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
  );
}

function getTreasuryWallet() {
  const pk = process.env.TREASURY_PRIVATE_KEY!;
  return new ethers.Wallet(pk, getProvider());
}

export async function getTokenInfo() {
  const provider = getProvider();
  const contract = new ethers.Contract(BEM_CONTRACT, ABI, provider);
  const [totalSupply, decimals, owner] = await Promise.all([
    contract.totalSupply(),
    contract.decimals(),
    contract.owner(),
  ]);
  const supply = Number(ethers.formatUnits(totalSupply, decimals));
  return { supply, decimals: Number(decimals), owner, contract: BEM_CONTRACT };
}

export async function getTreasuryBalance() {
  const wallet = getTreasuryWallet();
  const provider = getProvider();
  const contract = new ethers.Contract(BEM_CONTRACT, ABI, provider);
  const [balance, decimals] = await Promise.all([
    contract.balanceOf(wallet.address),
    contract.decimals(),
  ]);
  return {
    address: wallet.address,
    balance: Number(ethers.formatUnits(balance, decimals)),
  };
}

export async function transferTokens(toAddress: string, amount: number): Promise<string> {
  const wallet = getTreasuryWallet();
  const contract = new ethers.Contract(BEM_CONTRACT, ABI, wallet);
  const decimals = await contract.decimals();
  const amountUnits = ethers.parseUnits(amount.toFixed(Number(decimals)), decimals);
  const tx = await contract.transfer(toAddress, amountUnits);
  await tx.wait();
  return tx.hash;
}
