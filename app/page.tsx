"use client";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { CopyIcon, CheckIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAutoAnimate } from "@formkit/auto-animate/react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [regexPattern, setRegexPattern] = useState(""); // State for regex pattern
  const [tokens, setTokens] = useState<string[]>([]);
  const [isCopiedId, setIsCopiedId] = useState<string>(""); // State to track copied status
  const [completedTokens, setCompletedTokens] = useState<number[]>([]); // State to track completed tokens
  const [replacePattern, setReplacePattern] = useState(""); // State for replace pattern
  const [history, setHistory] = useState<
    { pattern: string; tokens: string[] }[]
  >([]);
  const [parent] = useAutoAnimate();
  // Add these state declarations after other states
  const [utcTime, setUtcTime] = useState(() =>
    new Date().toISOString().slice(0, 19)
  );
  const [gmtTime, setGmtTime] = useState(() => {
    const now = new Date();
    return new Date(now.getTime() + 8 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 19);
  });

  const handleTokenizeSnowflake = () => {
    const regex =
      /(usecase\/.*?\/(raw_.*?))\s+(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}\.\d{3}\s+[+-]\d{2}\d{2})\s+\d+/g;

    const matches = [...message.matchAll(regex)];
    const result = matches.map((match) => {
      const token = match[1]; // The token part
      const dateString = `${match[3]}`; // Constructing the date string with timezone
      const date = new Date(dateString).toISOString().replace(/\.\d{3}Z$/, "Z"); // Create a Date object in local time

      return `${token} ${date}`; // Return the token with the UTC date
    });

    // Group tokens and count occurrences
    const tokenCountMap: { [key: string]: number } = {};
    result.forEach((token) => {
      tokenCountMap[token] = (tokenCountMap[token] || 0) + 1;
    });

    // Convert the map back to an array of strings with counts
    const groupedTokens = Object.entries(tokenCountMap).map(
      ([token, count]) => `${token} ${count}`
    );

    setTokens(groupedTokens); // Store the grouped result in state

    // Add to history
    setHistory((prev) => [
      ...prev,
      { pattern: regex.source, tokens: groupedTokens },
    ]);
  };

  const handleTokenizeOutlook = () => {
    const regex =
      /(usecase\/.*?\/(raw_.*?))\/(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z)/g;

    const matches = [...message.matchAll(regex)];
    const result = matches.map((match) => `${match[1]} ${match[3]}`);

    // Group tokens and count occurrences
    const tokenCountMap: { [key: string]: number } = {};
    result.forEach((token) => {
      tokenCountMap[token] = (tokenCountMap[token] || 0) + 1;
    });

    // Convert the map back to an array of strings with counts
    const groupedTokens = Object.entries(tokenCountMap).map(
      ([token, count]) => `${token} ${count}`
    );

    setTokens(groupedTokens); // Store the grouped result in state

    // Add to history
    setHistory((prev) => [
      ...prev,
      { pattern: regex.source, tokens: groupedTokens },
    ]);
  };

  const handleCopy = (token: string, index: number) => {
    navigator.clipboard.writeText(token);
    setIsCopiedId(token);
    setCompletedTokens((prev) => {
      const newCompletedTokens = [...prev];
      // increment the count of the token for each index
      const tokenCount = prev[index] ? prev[index] + 1 : 1;
      newCompletedTokens[index] = tokenCount;

      return newCompletedTokens;
    });
    setTimeout(() => setIsCopiedId(""), 2000); // Reset after 2 seconds
  };

  const handleApply = (pattern: string, replacePattern: string) => {
    const regex = new RegExp(pattern);
    const replacedMessage = message.replace(regex, replacePattern);
    setHistory((prev) => [
      ...prev,
      { pattern: pattern, tokens: replacedMessage.split(" ") },
    ]);
    setMessage(replacedMessage);
  };

  const handleDelete = (pattern: string) => {
    setHistory((prev) => prev.filter((item) => item.pattern !== pattern));
  };

  const handleCheckboxChange = (index: number) => {
    setCompletedTokens((prev) => {
      const newCompletedTokens = [...prev];
      newCompletedTokens[index] = 0;
      return newCompletedTokens;
    });
  };

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  return (
    <div className="grid justify-items-center min-h-screen font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-4xl font-bold my-8">Copy Pesto</h1>
      <main className="grid gap-8 w-full max-w-7xl px-8 place-self-center">
        <div className="w-full">
          <div className="flex gap-8">
            <div className="w-full">
              <Textarea
                ref={textareaRef}
                className="w-full min-h-[150px] overflow-hidden resize-none p-4 rounded-lg"
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
                value={message}
                placeholder="Paste your copied emails titles here."
              />
            </div>
            <div className="flex flex-col gap-4 min-w-[300px]">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold mb-2">UTC</h4>
                  <Input
                    type="datetime-local"
                    value={utcTime}
                    onChange={(e) => {
                      const utcDate = new Date(e.target.value + "Z"); // Add Z to make it UTC
                      setUtcTime(e.target.value);
                      const gmtDate = new Date(
                        utcDate.getTime() + 8 * 60 * 60 * 1000
                      );
                      setGmtTime(gmtDate.toISOString().slice(0, 19));
                    }}
                  />
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-2">GMT+8</h4>
                  <Input
                    type="datetime-local"
                    value={gmtTime}
                    onChange={(e) => {
                      setGmtTime(e.target.value);
                      const gmtDate = new Date(e.target.value);
                      const utcDate = new Date(
                        gmtDate.getTime() - 8 * 60 * 60 * 1000
                      );
                      setUtcTime(utcDate.toISOString().slice(0, 19));
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-x-4 mt-4 w-full">
            <Button className="flex-1" onClick={handleTokenizeOutlook}>
              Tokenize Outlook
            </Button>
            <Button className="flex-1" onClick={handleTokenizeSnowflake}>
              Tokenize Snowflake
            </Button>
          </div>
          {tokens.length > 0 && (
            <div className="mt-8">
              <h4 className="text-lg font-bold">Tokens:</h4>
              <ul
                ref={parent}
                className="flex flex-col divide-y divide-gray-200"
              >
                {tokens.map((token, index) => {
                  const splitTokens = token.split(" "); // Split the token by space
                  return (
                    <div key={index} className="items-center flex gap-x-2">
                      <Checkbox
                        checked={completedTokens[index] >= 2}
                        onCheckedChange={() => handleCheckboxChange(index)}
                      />
                      {splitTokens.map((splitToken, splitIndex) => {
                        return (
                          <li key={splitIndex}>
                            {splitToken}
                            {splitIndex === 2 ? null : (
                              <Button
                                variant={"ghost"}
                                size={"icon"}
                                onClick={() => handleCopy(token, index)}
                                className="ml-2"
                              >
                                {isCopiedId === splitToken ? (
                                  <CheckIcon />
                                ) : (
                                  <CopyIcon />
                                )}
                              </Button>
                            )}
                          </li>
                        );
                      })}
                    </div>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
        {history.length > 0 && (
          <div className="w-full">
            <div className="flex flex-col gap-2">
              <Input
                type="text"
                placeholder="Enter regex pattern"
                value={regexPattern}
                onChange={(e) => setRegexPattern(e.target.value)}
              />
              <Input
                type="text"
                placeholder="Enter replace pattern"
                value={replacePattern}
                onChange={(e) => setReplacePattern(e.target.value)}
              />
              <div className="flex flex-row gap-2">
                <Button
                  variant={"outline"}
                  onClick={() => handleApply(regexPattern, replacePattern)}
                >
                  Apply
                </Button>
                <Button
                  variant={"outline"}
                  onClick={() => handleDelete(regexPattern)}
                >
                  Delete
                </Button>
              </div>
            </div>

            <ScrollArea className="max-h-[320px] h-fit w-full rounded-md border p-4 mt-4">
              <ul className="flex flex-col divide-y divide-gray-200 text-xs space-y-4">
                {history.map((item, index) => (
                  <li key={index} className="pt-4 first:pt-0">
                    <h4 className="font-semibold">{item.pattern}</h4>
                    <ul className="flex flex-col divide-y divide-gray-200">
                      {item.tokens.map((token, index) => (
                        <li key={index} className="py-2">
                          {token}
                        </li>
                      ))}
                    </ul>
                    <div className="flex gap-x-2 mt-2">
                      <Button
                        variant={"outline"}
                        onClick={() =>
                          handleApply(item.pattern, item.tokens[index])
                        }
                      >
                        Apply
                      </Button>
                      <Button
                        variant={"outline"}
                        onClick={() => handleDelete(item.pattern)}
                      >
                        Delete
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </div>
        )}
      </main>
      {/* <footer>footer</footer> */}
    </div>
  );
}
