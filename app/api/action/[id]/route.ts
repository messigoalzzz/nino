import { NextResponse } from "next/server";
import { ActionGetResponse, createActionHeaders } from "@solana/actions";
import { Connection, Transaction, SystemProgram ,PublicKey} from "@solana/web3.js";
const headers = createActionHeaders();
export const GET = async (req: Request, props: { params: Promise<{ id: string }> }) => {
  const params = await props.params;
  const tokenId = params.id; // 动态获取 Token ID
//   const tokenDetailUrl = `https://yourdomain.com/token/${tokenId}`; // 动态生成 Token 页面 URL

  // 初始化 Solana RPC 连接
  const connection = new Connection("https://api.devnet.solana.com");

  const { blockhash } = await connection.getLatestBlockhash();
  console.log("Fetched blockhash:", blockhash);

  

  // 接收者地址（toPubkey）
  const toPubkey = new PublicKey("9Ptpw4ms67Rxp8bxYz7fb1LQKu2Qv2vtqKiPx4TdtqVg");

  // 创建转账交易
  const transaction = new Transaction({
    recentBlockhash: 'xx', // 必须添加 recentBlockhash
    feePayer: toPubkey, // 示例中的 feePayer，实际生产中应为真实发送者地址
  }).add(
    SystemProgram.transfer({
      fromPubkey: toPubkey, // 示例中的 fromPubkey（通常为发送者地址）
      toPubkey, // 接收者地址
      lamports: 1000000, // 转账金额（1 SOL = 1e9 lamports）
    })
  );

  // 序列化交易并生成 Base64 格式的交易字符串
  const serializedTransaction = transaction.serialize().toString("base64");
  const walletLink = `solana:${serializedTransaction}`; // 钱包链接

  const payload: ActionGetResponse = {
    type: "action",
    title: `Buy Token ${tokenId}`,
    icon: "https://yourdomain.com/icon.png",
    description: `Explore and purchase token ${tokenId}.`,
    label: "View Details",
    links: {
      actions: [
        {
          type: "transaction",
          label: "Buy Token",
          href: walletLink,
        },
        {
          type: "transaction",
          label: "Sell Token",
          href: walletLink,
        },
      ],
    },
  };

  return NextResponse.json(payload, { headers });
};