import { NextResponse } from "next/server";
import { Connection, Transaction, SystemProgram, PublicKey } from "@solana/web3.js";

export const GET = async (req: Request, props: { params: { id: string } }) => {
  try {
    const params = props.params;
    const tokenId = params.id;

    // 初始化 Solana RPC 连接
    const connection = new Connection("https://api.devnet.solana.com");
    
    // 获取最新区块哈希
    const { blockhash } = await connection.getLatestBlockhash();
    console.log("Fetched blockhash:", blockhash);

    // 接收者地址
    const toPubkey = new PublicKey("9Ptpw4ms67Rxp8bxYz7fb1LQKu2Qv2vtqKiPx4TdtqVg");

    // 创建转账交易
    const transaction = new Transaction({
      recentBlockhash: blockhash, // 使用最新的区块哈希
      feePayer: toPubkey,
    }).add(
      SystemProgram.transfer({
        fromPubkey: toPubkey,
        toPubkey,
        lamports: 1000000, // 转账金额
      })
    );

    // 序列化交易并生成 Base64 格式的交易字符串
    const serializedTransaction = transaction.serialize().toString("base64");
    const walletLink = `solana:${serializedTransaction}`; // 钱包链接

    const payload = {
      type: "action",
      title: `Buy Token ${tokenId}`,
      description: `Purchase token ${tokenId}.`,
      label: "View Details",
      links: {
        actions: [
          {
            type: "transaction",
            label: "Buy Token",
            href: walletLink,
          },
        ],
      },
    };

    return NextResponse.json(payload);
  } catch (error) {
    console.error("Error creating transaction:", error);
    return NextResponse.json(
      { error: "Failed to create transaction." },
      { status: 500 }
    );
  }
};