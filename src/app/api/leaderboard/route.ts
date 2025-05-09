import { auth } from "@/auth";
import { db, getLeaderboard, saveAttempt } from "@/lib/firestore";
import { Position } from "@/lib/wordsearch/utils";
import { NextResponse } from "next/server";

export const GET = async () => {
  return NextResponse.json({
    data: await getLeaderboard(),
  });
};

export const POST = auth(async function POST(req) {
  if (!req.auth || !req.auth?.user?.email) {
    return NextResponse.json(
      { message: "Not authenticated" },
      {
        status: 401,
      }
    );
  }

  const data = (await req.json()) as {
    data: {
      solutions: { [key: string]: Position[] };
    };
  };
  console.log(data);
  if (!data || !data.data || !data.data.solutions) {
    return NextResponse.json({
      status: 406,
      message: "Invalid data provided.",
    });
  }
  let position = await saveAttempt(req.auth.user.email, data.data.solutions);

  return NextResponse.json({
    status: 200,
    message: "Submitted the attempt.",
    data: {
      position,
    },
  });
});
